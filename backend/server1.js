// server.js

// 1. Setup Environment and Dependencies
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const simpleGit = require('simple-git');
const path = require('path');
const fs = require('fs/promises');
const os = require('os');
const { GoogleGenAI } = require('@google/genai');

const app = express();
const PORT = process.env.PORT || 3000;

// --- CONFIGURATION ---
const TEMP_DIR_ROOT = path.join(os.tmpdir(), 'repo_analysis_');
const GITHUB_PAT = process.env.GITHUB_PAT;
const GITHUB_BASE_URL = 'https://api.github.com/repos';

// Initialize Gemini AI Client
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(bodyParser.json());
// Enable CORS for frontend development (adjust this for production)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); 
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});


// Utility Function for GitHub API Calls
async function fetchGitHubData(urlPath) {
    const url = `https://api.github.com/${urlPath}`;
    const headers = {
        'Authorization': `token ${GITHUB_PAT}`,
        'User-Agent': 'RepoMirrorAnalysisApp/1.0',
        'Accept': 'application/vnd.github.v3+json'
    };
    
    // Using native fetch for simplicity in modern Node.js
    const response = await fetch(url, { headers });
    if (!response.ok) {
        throw new Error(`GitHub API Error for ${urlPath}: ${response.statusText}`);
    }
    return response.json();
}

// =========================================================================
// 2. CORE ANALYSIS HANDLER
// =========================================================================

async function analyzeRepository(repoUrl) {
    let tempRepoPath = null;
    let metrics = {};

    // 1. Parse URL to get owner and repo name
    const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
    if (!match) throw new Error("Invalid GitHub URL format.");
    const [, owner, repo] = match;
    const repoPath = `${owner}/${repo}`;

    try {
        // --- PHASE 1: API-ONLY DATA GATHERING ---

        // A. Commit History & Languages (Metadata API)
        console.log(`[API] Fetching metadata for ${repoPath}...`);
        const [commitActivity, languages, prs] = await Promise.all([
            fetchGitHubData(`repos/${repoPath}/stats/commit_activity`),
            fetchGitHubData(`repos/${repoPath}/languages`),
            fetchGitHubData(`repos/${repoPath}/pulls?state=all`)
        ]);

        metrics.commit_consistency_score = commitActivity.length > 0 ? 
            (commitActivity.filter(c => c.total > 0).length / 52) * 100 : 0;
        metrics.language_usage = languages;
        metrics.total_prs = prs.length;
        metrics.pr_ratio = prs.length > 0 ? prs.filter(p => p.state === 'closed').length / prs.length : 0;
        
        // B. README & Structure (Contents/Trees API)
        const readmeData = await fetchGitHubData(`repos/${repoPath}/readme`);
        const readmeContentBase64 = readmeData.content;
        metrics.readme_content = Buffer.from(readmeContentBase64, 'base64').toString('utf-8');
        
        // C. Simple structure check via API (optional but fast)
        const rootContents = await fetchGitHubData(`repos/${repoPath}/contents/`);
        metrics.has_tests_folder = rootContents.some(item => item.name === 'tests' && item.type === 'dir');


        // --- PHASE 2: MINIMAL CLONING FOR DEEPER ANALYSIS (Complexity/Linting) ---

        tempRepoPath = `${TEMP_DIR_ROOT}${Date.now()}`;
        console.log(`[CLONE] Cloning shallow copy to ${tempRepoPath}...`);

        // Initialize simple-git, configured for shallow clone
        const git = simpleGit();
        
        // Clone only the latest commit (--depth 1) to save time/space
        await git.clone(`https://${GITHUB_PAT}@github.com/${repoPath}`, tempRepoPath, ['--depth', '1']);

        // D. Code Quality and File Count
        let codeFilesCount = 0;
        let totalLines = 0;
        let complexityScore = 0;
        let complexityCount = 0;
        
        // A simple recursive traversal to count files and simulate complexity check
        const traverseDir = async (dir) => {
            const entries = await fs.readdir(dir, { withFileTypes: true });
            for (const entry of entries) {
                const fullPath = path.join(dir, entry.name);

                if (entry.isDirectory()) {
                    // Ignore common non-code folders
                    if (['.git', 'node_modules', 'dist', 'build'].includes(entry.name)) continue;
                    await traverseDir(fullPath);
                } else if (entry.isFile() && (entry.name.endsWith('.js') || entry.name.endsWith('.py'))) {
                    codeFilesCount++;
                    const content = await fs.readFile(fullPath, 'utf-8');
                    totalLines += content.split('\n').length;
                    
                    // NOTE: A real system would run 'radon' or a linter here. 
                    // For this hackathon solution, we simulate complexity based on file size/lines.
                    complexityScore += Math.min(10, totalLines / 50); // Simple proxy
                    complexityCount++;
                }
            }
        };

        await traverseDir(tempRepoPath);
        
        metrics.total_files = codeFilesCount; // Simplified count
        metrics.total_loc = totalLines;
        metrics.avg_complexity = complexityCount > 0 ? complexityScore / complexityCount : 0;
        

        // --- PHASE 3: LLM SYNTHESIS ---

        console.log(`[LLM] Generating Score, Summary, and Roadmap...`);
        const prompt = createLlmPrompt(owner, repo, metrics);
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "object",
                    properties: {
                        score: { type: "number", description: "The final rating from 0-100." },
                        rating_tier: { type: "string", description: "Beginner, Intermediate, or Advanced." },
                        summary: { type: "string", description: "A concise evaluation of strengths and weaknesses." },
                        roadmap: { 
                            type: "array", 
                            items: { type: "string" }, 
                            description: "3-5 actionable steps for improvement." 
                        }
                    },
                    required: ["score", "rating_tier", "summary", "roadmap"]
                }
            }
        });

        const llmResult = JSON.parse(response.text);
        
        // Combine LLM result with the raw metrics for a detailed response
        return {
            ...llmResult,
            raw_metrics: metrics
        };

    } catch (error) {
        console.error("Analysis failed:", error.message);
        throw new Error(`Analysis failed: ${error.message}`);
    } finally {
        // --- PHASE 4: CLEANUP ---
        if (tempRepoPath) {
            console.log(`[CLEANUP] Removing temp directory ${tempRepoPath}...`);
            await fs.rm(tempRepoPath, { recursive: true, force: true });
        }
    }
}

// 3. LLM Prompt Generator
function createLlmPrompt(owner, repo, metrics) {
    const languageString = Object.entries(metrics.language_usage)
        .map(([lang, bytes]) => `${lang}: ${bytes} bytes`)
        .join(', ');
    
    return `
        You are an AI Code Mentor tasked with evaluating a student's GitHub repository.
        Analyze the provided metrics and the README content for the project: ${owner}/${repo}.
        
        **Instructions:**
        1. Generate a Score (0-100) and a Rating Tier (Beginner/Intermediate/Advanced).
        2. Write a professional Summary highlighting 1-2 strengths and 1-2 weaknesses.
        3. Create a Personalized Roadmap (3-5 actionable steps).
        4. Your final output MUST be a single JSON object matching the required schema.

        **Repository Metrics:**
        - Total LOC: ${metrics.total_loc}
        - Total Code Files: ${metrics.total_files}
        - Primary Languages: ${languageString}
        - Commit Consistency (Annual): ${metrics.commit_consistency_score.toFixed(1)}% (Percentage of weeks with commits)
        - Average Simulated Code Complexity: ${metrics.avg_complexity.toFixed(2)}
        - Has 'tests' Folder: ${metrics.has_tests_folder ? 'YES' : 'NO'}
        - Total Pull Requests: ${metrics.total_prs}

        **README Content (for Documentation Quality):**
        ---
        ${metrics.readme_content.substring(0, 1000)}
        ---
        
        Evaluate the project structure, documentation clarity, maintainability (via complexity), and development consistency.
    `;
}

// 4. Express Route
app.post('/api/analyze', async (req, res) => {
    const { githubLink } = req.body;
    if (!githubLink) {
        return res.status(400).json({ error: 'GitHub link is required.' });
    }

    try {
        const result = await analyzeRepository(githubLink);
        // Send the final structured JSON response to the frontend
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});