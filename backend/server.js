
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const { GoogleGenAI } = require("@google/genai");

const app = express();
const PORT = process.env.PORT || 3000;

// --- CONFIGURATION ---
const GITHUB_PAT = process.env.GITHUB_PAT;
const GITHUB_BASE_URL = "https://api.github.com/repos";

// Initialize Gemini AI Client
const ai = new GoogleGenAI(process.env.GEMINI_API_KEY);

// Middleware
app.use(bodyParser.json());
// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

// Utility Function for GitHub API Calls
async function fetchGitHubData(urlPath) {
  const url = `https://api.github.com/${urlPath}`;
  const headers = {
    Authorization: `token ${GITHUB_PAT}`,
    "User-Agent": "RepoMirrorAnalysisApp/1.0",
    Accept: "application/vnd.github.v3+json",
  };

  const response = await fetch(url, { headers });
  if (response.status === 404) {
    throw new Error(
      `Repository not found or data not available for: ${urlPath}`
    );
  }
  if (!response.ok) {
    throw new Error(
      `GitHub API Error for ${urlPath}: ${response.statusText} (Status: ${response.status})`
    );
  }
  return response.json();
}

/**
 * Very basic complexity simulation based on code structure (e.g., if/for/while count)
 * This is a substitute for tools like Radon, which require local execution.
 * @param {string} code - The raw code content.
 * @returns {number} A simple complexity score.
 */
function simulateComplexity(code) {
  if (!code) return 0;
  let complexity = 1; // Start with one for the main function/file

  // Count control flow keywords (basic proxy for cyclomatic complexity)
  const controlKeywords = [
    "if",
    "for",
    "while",
    "switch",
    "catch",
    "do",
    "else if",
  ];
  controlKeywords.forEach((keyword) => {
    // Use a regex boundary check (\b) to avoid partial matches
    const regex = new RegExp(`\\b${keyword}\\b`, "g");
    const matches = code.match(regex);
    if (matches) {
      complexity += matches.length;
    }
  });

  // Penalize long functions (proxy for maintainability)
  const lines = code.split("\n").length;
  if (lines > 100) {
    complexity += Math.floor(lines / 100);
  }

  return complexity;
}

// =========================================================================
// 2. CORE ANALYSIS HANDLER - API ONLY
// =========================================================================

async function analyzeRepository(repoUrl) {
  let metrics = {};

  // 1. Parse URL to get owner and repo name
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
  if (!match) throw new Error("Invalid GitHub URL format.");
  const [, owner, repo] = match;
  const repoPath = `${owner}/${repo}`;

  try {
    // --- PHASE 1: METADATA & API DATA GATHERING ---

    console.log(`[API] Fetching metadata for ${repoPath}...`);
    const [repoDetails, commitActivity, languages, prs] = await Promise.all([
      fetchGitHubData(`repos/${repoPath}`), // Get default branch info
      fetchGitHubData(`repos/${repoPath}/stats/commit_activity`),
      fetchGitHubData(`repos/${repoPath}/languages`),
      fetchGitHubData(`repos/${repoPath}/pulls?state=all`),
    ]);

    metrics.default_branch = repoDetails.default_branch || "main";
    metrics.commit_consistency_score =
      commitActivity.length > 0
        ? (commitActivity.filter((c) => c.total > 0).length / 52) * 100
        : 0;
    metrics.language_usage = languages;
    metrics.total_prs = prs.length;
    metrics.pr_ratio =
      prs.length > 0
        ? prs.filter((p) => p.state === "closed").length / prs.length
        : 0;
    metrics.commitActivity = commitActivity;
    metrics.repoDetails = repoDetails;

    // --- PHASE 2: STRUCTURE & CODE ANALYSIS (using Trees/Contents API) ---

    // 2. Get the entire file tree (recursive=1)
    console.log(`[API] Fetching file tree for complexity analysis...`);
    const treeData = await fetchGitHubData(
      `repos/${repoPath}/git/trees/${metrics.default_branch}?recursive=1`
    );

    const codeFiles = treeData.tree.filter(
      (item) =>
        item.type === "blob" &&
        item.size < 500000 && // Ignore files over 500KB to prevent issues
        /\.(js|ts|py|go|java|c|cpp|rb|php|html|css)$/.test(item.path)
    );

    // Analyze Structure
    metrics.total_files = treeData.tree.length;
    metrics.total_code_files = codeFiles.length;
    metrics.has_tests_folder = treeData.tree.some(
      (item) => item.path.startsWith("test/") || item.path.startsWith("tests/")
    );

    // 3. Analyze Documentation (README)
    let readmeContent = "No README.md found or could not be read.";
    try {
      const readmeData = await fetchGitHubData(`repos/${repoPath}/readme`);
      readmeContent = Buffer.from(readmeData.content, "base64").toString(
        "utf-8"
      );
    } catch (e) {
      /* Handle missing README gracefully */
    }
    metrics.readme_content = readmeContent;

    // 4. Simulate Complexity (Fetch a sample of code files)
    const sampleFiles = codeFiles.slice(0, Math.min(10, codeFiles.length)); // Max 10 files
    let complexityTotal = 0;
    let totalLines = 0;

    console.log(
      `[API] Fetching content for ${sampleFiles.length} sample files...`
    );

    // Use Promise.all to fetch file contents concurrently
    const fileContentPromises = sampleFiles.map((file) =>
      fetchGitHubData(`repos/${repoPath}/contents/${file.path}`)
    );
    const fileContents = await Promise.all(fileContentPromises);

    for (const fileData of fileContents) {
      if (fileData && fileData.content) {
        const content = Buffer.from(fileData.content, "base64").toString(
          "utf-8"
        );
        complexityTotal += simulateComplexity(content);
        totalLines += content.split("\n").length;
      }
    }

    metrics.total_loc = totalLines;
    metrics.avg_complexity =
      sampleFiles.length > 0 ? complexityTotal / sampleFiles.length : 0;

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
            score: {
              type: "number",
              description: "The final rating from 0-100.",
            },
            rating_tier: {
              type: "string",
              description: "Beginner, Intermediate, or Advanced.",
            },
            summary: {
              type: "string",
              description: "A concise evaluation of strengths and weaknesses.",
            },
            roadmap: {
              type: "array",
              items: { type: "string" },
              description: "3-5 actionable steps for improvement.",
            },
          },
          required: ["score", "rating_tier", "summary", "roadmap"],
        },
      },
    });

    const llmResult = JSON.parse(response.text);

    // Combine LLM result with the raw metrics for a detailed response
    return {
      ...llmResult,
      raw_metrics: metrics,
    };
  } catch (error) {
    console.error("Analysis failed:", error.message);
    throw new Error(`Analysis failed: ${error.message}`);
  }
}

// 3. LLM Prompt Generator (remains largely the same, but with new metrics)
function createLlmPrompt(owner, repo, metrics) {
  const languageString = Object.entries(metrics.language_usage)
    .map(([lang, bytes]) => `${lang}: ${bytes} bytes`)
    .join(", ");

  // Check if complexity simulation was successful
  const complexityOutput =
    metrics.total_code_files > 0
      ? `Average Simulated Code Complexity: ${metrics.avg_complexity.toFixed(
          2
        )} (Based on control flow and function length in ${
          metrics.total_code_files
        } files)`
      : "Complexity analysis skipped/failed (no code files found or complexity metric could not be calculated).";

  return `
        You are an AI Code Mentor tasked with evaluating a student's GitHub repository.
        Analyze the provided metrics and the README content for the project: ${owner}/${repo}.
        
        **Instructions:**
        1. Generate a Score (0-100) and a Rating Tier (Beginner/Intermediate/Advanced).
        2. Write a professional Summary highlighting 1-2 strengths and 1-2 weaknesses.
        3. Create a Personalized Roadmap (3-5 actionable steps).
        4. Your final output MUST be a single JSON object matching the required schema.

        **Repository Metrics:**
        - Total Files (Including docs/config): ${metrics.total_files}
        - Total Code Files Analyzed: ${metrics.total_code_files}
        - Estimated LOC (Sampled): ${metrics.total_loc}
        - Primary Languages: ${languageString}
        - Commit Consistency (Annual): ${metrics.commit_consistency_score.toFixed(
          1
        )}% (Percentage of weeks with commits)
        - ${complexityOutput}
        - Has Tests Folder/Files: ${
          metrics.has_tests_folder
            ? "YES (Strong indication of testing)"
            : "NO (Weakness in maintainability)"
        }
        - Total Pull Requests: ${metrics.total_prs}

        **README Content (for Documentation Quality):**
        ---
        ${metrics.readme_content.substring(0, 1000)}
        ---
        
        Evaluate the project structure, documentation clarity, maintainability (via complexity), and development consistency.
    `;
}

// 4. Express Route (Same as before)
app.post("/api/analyze", async (req, res) => {
  const { githubLink } = req.body;
  if (!githubLink) {
    return res.status(400).json({ error: "GitHub link is required." });
  }

  try {
    const result = await analyzeRepository(githubLink);
    // Send the final structured JSON response to the frontend
    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
