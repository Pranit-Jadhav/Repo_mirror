import { ArrowLeft, ExternalLink, Award, TrendingUp, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CircularScore from './CircularScore';
import CategoryCard from './CategoryCard';
import RoadmapCard from './RoadmapCard';
import StatsBar from './StatsBar';
import LanguageBar from './LanguageBar';
import type { AnalysisResult } from '@/data/mockAnalysis';

interface ResultsDashboardProps {
  result: AnalysisResult;
  onReset: () => void;
}

const badgeConfig = {
  Bronze: { bg: 'bg-orange-500/10', text: 'text-orange-400', border: 'border-orange-500/30' },
  Silver: { bg: 'bg-slate-400/10', text: 'text-slate-300', border: 'border-slate-400/30' },
  Gold: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/30' },
};

const ResultsDashboard = ({ result, onReset }: ResultsDashboardProps) => {
  const badge = badgeConfig[result.badge];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
        <div className="container max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={onReset} className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Analyze Another
          </Button>
          
          <a
            href={result.repoUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <span className="font-mono">{result.owner}/{result.repoName}</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </header>

      <main className="container max-w-6xl mx-auto px-4 py-8 space-y-8">
        {/* Score Hero */}
        <section className="grid md:grid-cols-2 gap-8 items-center py-8">
          <div className="text-center md:text-left space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold text-foreground">Analysis Complete</h1>
              <p className="text-lg text-muted-foreground">
                Here's the comprehensive review of your repository
              </p>
            </div>

            {/* Badges */}
            <div className="flex flex-wrap gap-3 justify-center md:justify-start">
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg border ${badge.bg} ${badge.text} ${badge.border}`}>
                <Award className="w-5 h-5" />
                <span className="font-semibold">{result.badge} Badge</span>
              </div>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-secondary-foreground">
                <TrendingUp className="w-5 h-5" />
                <span className="font-semibold">{result.level}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center animate-scale-in">
            <CircularScore score={result.score} size={220} />
          </div>
        </section>

        {/* Stats */}
        <section className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
          <StatsBar stats={result.stats} />
        </section>

        {/* Summary */}
        <section className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="p-6 rounded-xl bg-card border border-border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <MessageSquare className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-foreground">AI Summary</h2>
            </div>
            <p className="text-muted-foreground leading-relaxed text-lg">
              "{result.summary}"
            </p>
          </div>
        </section>

        {/* Languages */}
        <section className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
          <LanguageBar languages={result.stats.languages} />
        </section>

        {/* Categories Grid */}
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-foreground">Detailed Breakdown</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {result.categories.map((category, index) => (
              <CategoryCard key={category.name} {...category} index={index} />
            ))}
          </div>
        </section>

        {/* Roadmap */}
        <section className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
          <RoadmapCard items={result.roadmap} />
        </section>

        {/* Footer CTA */}
        <section className="text-center py-12">
          <p className="text-muted-foreground mb-4">Ready to analyze another repository?</p>
          <Button variant="glow" size="lg" onClick={onReset}>
            Start New Analysis
          </Button>
        </section>
      </main>
    </div>
  );
};

export default ResultsDashboard;
