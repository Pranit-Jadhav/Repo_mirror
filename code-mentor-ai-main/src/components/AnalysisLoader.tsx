import { useEffect, useState } from 'react';

const analysisSteps = [
  { text: 'Connecting to GitHub API...', delay: 0 },
  { text: 'Fetching repository metadata...', delay: 800 },
  { text: 'Analyzing file structure...', delay: 1600 },
  { text: 'Evaluating code quality...', delay: 2400 },
  { text: 'Scanning for tests...', delay: 3200 },
  { text: 'Reviewing commit history...', delay: 4000 },
  { text: 'Checking documentation...', delay: 4800 },
  { text: 'Generating insights...', delay: 5600 },
  { text: 'Building your roadmap...', delay: 6400 },
  { text: 'Finalizing analysis...', delay: 7200 },
];

interface AnalysisLoaderProps {
  repoUrl: string;
}

const AnalysisLoader = ({ repoUrl }: AnalysisLoaderProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  useEffect(() => {
    analysisSteps.forEach((step, index) => {
      setTimeout(() => {
        setCurrentStep(index);
        if (index > 0) {
          setCompletedSteps(prev => [...prev, index - 1]);
        }
      }, step.delay);
    });
  }, []);

  const repoName = repoUrl.split('/').slice(-2).join('/');

  return (
    <section className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="max-w-2xl w-full">
        {/* Terminal window */}
        <div className="rounded-xl overflow-hidden border border-border shadow-2xl animate-scale-in">
          {/* Terminal header */}
          <div className="bg-card px-4 py-3 flex items-center gap-2 border-b border-border">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-destructive/80" />
              <div className="w-3 h-3 rounded-full bg-warning/80" />
              <div className="w-3 h-3 rounded-full bg-success/80" />
            </div>
            <span className="ml-4 text-sm text-muted-foreground font-mono">
              repo-analyzer — analyzing {repoName}
            </span>
          </div>

          {/* Terminal body */}
          <div className="terminal-bg p-6 font-mono text-sm space-y-2 min-h-[400px]">
            {/* Header */}
            <div className="text-primary mb-4">
              <pre className="text-xs opacity-70">
{`╔══════════════════════════════════════════════════════════════╗
║                    REPOSITORY ANALYZER v2.0                   ║
╚══════════════════════════════════════════════════════════════╝`}
              </pre>
            </div>

            {/* Target URL */}
            <div className="flex items-center gap-2 text-muted-foreground pb-4 border-b border-border/50">
              <span className="text-success">$</span>
              <span>analyze</span>
              <span className="text-primary">{repoUrl}</span>
            </div>

            {/* Steps */}
            <div className="pt-4 space-y-3">
              {analysisSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-3 transition-all duration-300 ${
                    index > currentStep ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'
                  }`}
                  style={{ transitionDelay: `${index * 50}ms` }}
                >
                  {/* Status indicator */}
                  <div className="w-5 flex justify-center">
                    {completedSteps.includes(index) ? (
                      <span className="text-success">✓</span>
                    ) : index === currentStep ? (
                      <span className="inline-block w-2 h-2 bg-primary rounded-full animate-pulse" />
                    ) : (
                      <span className="text-muted-foreground">○</span>
                    )}
                  </div>

                  {/* Step text */}
                  <span
                    className={`${
                      completedSteps.includes(index)
                        ? 'text-muted-foreground'
                        : index === currentStep
                        ? 'text-foreground'
                        : 'text-muted-foreground/50'
                    }`}
                  >
                    {step.text}
                  </span>

                  {/* Completion time */}
                  {completedSteps.includes(index) && (
                    <span className="text-xs text-muted-foreground/50 ml-auto">
                      {(Math.random() * 0.5 + 0.2).toFixed(2)}s
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Progress bar */}
            <div className="mt-8 pt-4 border-t border-border/50">
              <div className="flex items-center justify-between text-xs text-muted-foreground mb-2">
                <span>Progress</span>
                <span>{Math.min(Math.round(((currentStep + 1) / analysisSteps.length) * 100), 100)}%</span>
              </div>
              <div className="h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-success transition-all duration-500 ease-out rounded-full"
                  style={{ width: `${((currentStep + 1) / analysisSteps.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Blinking cursor */}
            <div className="mt-6 flex items-center gap-1">
              <span className="text-success">$</span>
              <span className="w-2 h-4 bg-primary animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnalysisLoader;
