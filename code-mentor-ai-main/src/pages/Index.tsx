import { useState, useEffect } from "react";
import Hero from "@/components/Hero";
import AnalysisLoader from "@/components/AnalysisLoader";
import ResultsDashboard from "@/components/ResultsDashboard";
import { type AnalysisResult } from "@/data/mockAnalysis";

type AppState = "idle" | "loading" | "results";

interface BackendData {
  score: number;
  rating_tier: string;
  summary: string;
  roadmap: string[];
  raw_metrics: {
    total_files: number;
    total_code_files: number;
    total_loc: number;
    language_usage: Record<string, number>;
    commit_consistency_score: number;
    has_tests_folder: boolean;
    total_prs: number;
    pr_ratio: number;
    avg_complexity: number;
    readme_content: string;
    commitActivity: { total: number }[];
    repoDetails: { updated_at: string };
  };
}

function transformBackendData(
  data: BackendData,
  repoUrl: string
): AnalysisResult {
  const match = repoUrl.match(/github\.com\/([^/]+)\/([^/]+)/);
  if (!match) throw new Error("Invalid GitHub URL");
  const [, owner, repoName] = match;

  const level = data.rating_tier as "Beginner" | "Intermediate" | "Advanced";
  const badge =
    level === "Beginner"
      ? "Bronze"
      : level === "Intermediate"
      ? "Silver"
      : "Gold";

  const raw = data.raw_metrics;

  // Calculate total commits
  const totalCommits = raw.commitActivity
    ? raw.commitActivity.reduce(
        (sum: number, c: { total: number }) => sum + c.total,
        0
      )
    : 0;

  // Languages
  const totalBytes = Object.values(raw.language_usage).reduce(
    (sum: number, b: number) => sum + b,
    0
  );
  const languages =
    totalBytes > 0
      ? Object.entries(raw.language_usage).map(
          ([name, bytes]: [string, number]) => ({
            name,
            percentage: Math.round((bytes / totalBytes) * 100),
            color: getColorForLanguage(name),
          })
        )
      : [];

  // Categories
  const categories = [
    {
      name: "Code Quality",
      score: raw.avg_complexity < 5 ? 90 : raw.avg_complexity < 10 ? 70 : 50,
      maxScore: 100,
      icon: "code",
      description: "Based on code complexity analysis",
    },
    {
      name: "Documentation",
      score: raw.readme_content && raw.readme_content.length > 200 ? 80 : 40,
      maxScore: 100,
      icon: "file-text",
      description: "README quality and completeness",
    },
    {
      name: "Test Coverage",
      score: raw.has_tests_folder ? 70 : 20,
      maxScore: 100,
      icon: "check-circle",
      description: "Presence of test files",
    },
    {
      name: "Project Structure",
      score: raw.total_files > 50 ? 90 : raw.total_files > 20 ? 70 : 50,
      maxScore: 100,
      icon: "folder",
      description: "Organization and file count",
    },
    {
      name: "Git Practices",
      score: Math.round(raw.commit_consistency_score),
      maxScore: 100,
      icon: "git-branch",
      description: "Commit consistency and activity",
    },
    {
      name: "Real-world Relevance",
      score: 70,
      maxScore: 100,
      icon: "globe",
      description: "Practical application and features",
    },
  ];

  // Roadmap
  const roadmap = data.roadmap.map((item: string, index: number) => ({
    id: (index + 1).toString(),
    title: item,
    description: "",
    priority: "medium" as const,
    category: "General",
    completed: false,
  }));

  // Stats
  const stats = {
    files: raw.total_files,
    commits: totalCommits,
    contributors: 1,
    languages,
    lastUpdated: raw.repoDetails
      ? new Date(raw.repoDetails.updated_at).toLocaleDateString()
      : "Unknown",
  };

  return {
    repoUrl,
    repoName,
    owner,
    score: data.score,
    level,
    badge,
    summary: data.summary,
    categories,
    roadmap,
    stats,
  };
}

function getColorForLanguage(lang: string): string {
  const colors: Record<string, string> = {
    JavaScript: "#f1e05a",
    TypeScript: "#3178c6",
    Python: "#3572A5",
    Java: "#ed8c33",
    "C++": "#f34b7d",
    Go: "#00ADD8",
    Rust: "#dea584",
    PHP: "#777BB4",
    Ruby: "#701516",
    HTML: "#e34c26",
    CSS: "#563d7c",
  };
  return colors[lang] || "#586069";
}

const Index = () => {
  const [state, setState] = useState<AppState>("idle");
  const [repoUrl, setRepoUrl] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);

  const handleAnalyze = (url: string) => {
    setRepoUrl(url);
    setState("loading");
  };

  const handleReset = () => {
    setState("idle");
    setRepoUrl("");
    setResult(null);
  };

  useEffect(() => {
    if (state === "loading") {
      fetch("http://localhost:3000/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ githubLink: repoUrl }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            const transformed = transformBackendData(data.data, repoUrl);
            setResult(transformed);
            setState("results");
          } else {
            alert("Analysis failed: " + data.error);
            setState("idle");
          }
        })
        .catch((err) => {
          alert("Network error: " + err.message);
          setState("idle");
        });
    }
  }, [state, repoUrl]);

  return (
    <>
      {state === "idle" && <Hero onAnalyze={handleAnalyze} isLoading={false} />}

      {state === "loading" && <AnalysisLoader repoUrl={repoUrl} />}

      {state === "results" && result && (
        <ResultsDashboard result={result} onReset={handleReset} />
      )}
    </>
  );
};

export default Index;
