import { useState } from "react";
import { Github, ArrowRight, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface HeroProps {
  onAnalyze: (url: string) => void;
  isLoading: boolean;
}

const Hero = ({ onAnalyze, isLoading }: HeroProps) => {
  const [url, setUrl] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onAnalyze(url.trim());
    }
  };

  const exampleRepos = [
    "https://github.com/Pranit-Jadhav/ClipSync",
    "https://github.com/Pranit-Jadhav/Brainly",
    "https://github.com/Pranit-Jadhav/Paytm",
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center hero-gradient overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-glow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl animate-pulse-glow"
          style={{ animationDelay: "1s" }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "50px 50px",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-card/50 border border-border mb-8 animate-fade-in">
          <Sparkles className="w-4 h-4 text-primary" />
          <span className="text-sm text-muted-foreground">
            AI-Powered Repository Analysis
          </span>
        </div>

        {/* Main heading */}
        <h1
          className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="text-foreground">Your Code,</span>
          <br />
          <span className="gradient-text">Clearly Scored</span>
        </h1>

        {/* Subtitle */}
        <p
          className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto animate-fade-in"
          style={{ animationDelay: "0.2s" }}
        >
          Transform your GitHub repository into actionable insights. Get a
          detailed score, honest feedback, and a personalized roadmap to level
          up your code.
        </p>

        {/* Search form */}
        <form
          onSubmit={handleSubmit}
          className="max-w-2xl mx-auto mb-8 animate-fade-in"
          style={{ animationDelay: "0.3s" }}
        >
          <div className="relative flex gap-3 p-2 bg-card/50 rounded-xl border border-border backdrop-blur-sm">
            <div className="flex-1 relative">
              <Github className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type="url"
                placeholder="https://github.com/username/repository"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-12 bg-transparent border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-12"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              variant="glow"
              disabled={isLoading || !url.trim()}
              className="min-w-[140px]"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Analyzing
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Analyze
                  <ArrowRight className="w-4 h-4" />
                </span>
              )}
            </Button>
          </div>
        </form>

        {/* Example repos */}
        <div className="animate-fade-in" style={{ animationDelay: "0.4s" }}>
          <p className="text-sm text-muted-foreground mb-3">Try an example:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {exampleRepos.map((repo) => (
              <button
                key={repo}
                onClick={() => setUrl(repo)}
                className="px-3 py-1.5 text-xs font-mono text-muted-foreground bg-card/50 border border-border rounded-md hover:border-primary hover:text-primary transition-all duration-300"
              >
                {repo.split("/").slice(-2).join("/")}
              </button>
            ))}
          </div>
        </div>

        {/* Features preview */}
        <div
          className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in"
          style={{ animationDelay: "0.5s" }}
        >
          {[
            {
              icon: "📊",
              title: "Smart Scoring",
              desc: "Multi-dimensional analysis",
            },
            {
              icon: "📝",
              title: "Detailed Summary",
              desc: "Honest, actionable feedback",
            },
            {
              icon: "🗺️",
              title: "Personalized Roadmap",
              desc: "Step-by-step improvements",
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="p-6 rounded-xl bg-card/30 border border-border backdrop-blur-sm hover:border-primary/50 transition-all duration-300 group"
            >
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="font-semibold mb-1 text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
