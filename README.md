# 🚀 RepoMirror: AI-Powered Code Analysis & Developer Profiler

## 🌟 Project Overview

**RepoMirror** is an intelligent system designed to evaluate a developer's GitHub repository and transform raw code into actionable, professional feedback. It acts as a "Repository Mirror," reflecting the true strengths and weaknesses of a project based on industry best practices for code quality, documentation, and version control.

The system accepts a public GitHub URL and generates three key outputs: a **Score (0-100)**, a concise **Summary**, and a **Personalized Roadmap** of improvement steps, guided by the Gemini Large Language Model (LLM).

### 🎯 Key Features

* **API-First Architecture:** Utilizes the GitHub REST API exclusively to fetch metrics, completely avoiding local file system operations (like cloning), ensuring reliability in serverless environments like Vercel.
* **Multi-Dimensional Evaluation:** Analyzes commit consistency, folder structure (via Trees API), language usage, documentation quality, and simulated code complexity.
* **AI-Powered Mentor:** Leverages the Gemini API for advanced natural language generation, turning complex metrics into human-readable summaries and personalized advice.

## 🛠️ Technology Stack

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Backend** | Node.js (Express) | Orchestrates the API calls, processes data, and interfaces with the LLM. |
| **Frontend** | React / TypeScript | User interface for inputting the GitHub URL and displaying the final report. |
| **AI/LLM** | Google Gemini API (Flash/Pro) | Generates the Score, Summary, and Personalized Roadmap based on structured data. |
| **Data Source** | GitHub REST API | Fetches all repository metadata, file structure (Trees API), and file contents (Contents API). |
| **Deployment** | Vercel | Serverless hosting for the Node.js backend and static frontend assets. |

## 📐 Architecture: The API-Only Workflow

The system operates in three distinct phases, designed to maximize efficiency and stability in a serverless environment:

1.  **Fetch (GitHub API):** The Node.js backend uses the GitHub Personal Access Token (PAT) to call various endpoints (Commits, Languages, Trees, Contents, Pulls) to gather all raw metrics.
2.  **Analyze (Node.js Logic):** The system processes the API data. It calculates derived metrics like Commit Consistency, analyzes the `README.md` content, and runs a **simulated complexity analysis** on a sample of code files (fetched via Contents API).
3.  **Generate (Gemini LLM):** All raw metrics, along with the analyzed `README` text, are passed into a structured prompt. The Gemini LLM interprets these inputs and returns the final `Score`, `Summary`, and `Roadmap` in a strict JSON format.

---

### Video URL - https://drive.google.com/drive/folders/1UVhRTW11GmP07MBYmlcNZhU29M7lwmoy?usp=sharing


## 🚀 Getting Started

Follow these steps to set up and deploy the RepoMirror project.

### 1. Prerequisites

* Node.js (v18+) and npm
* A GitHub Account
* A Vercel Account

### 2. Environment Setup (API Keys)

You need two critical keys. Store them in a `.env` file for local development.

| Key | Source | Scope |
| :--- | :--- | :--- |
| `GEMINI_API_KEY` | [Google AI Studio](https://ai.google.dev/gemini-api/docs/api-key) (Free Tier) | Required for LLM generation. |
| `GITHUB_PAT` | GitHub Settings (Developer Settings $\rightarrow$ Personal Access Tokens) | Read access to **public repositories** for high API rate limits. |

### 3. Local Installation

```bash
# Clone the repository
git clone [YOUR_REPO_LINK]
cd [YOUR_REPO_NAME]

# Install backend dependencies
npm install --prefix backend

# Install frontend dependencies (navigate to your React directory)
npm install --prefix frontend
