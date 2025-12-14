import { Code, FileText, CheckCircle, Folder, GitBranch, Globe } from 'lucide-react';

interface CategoryCardProps {
  name: string;
  score: number;
  maxScore: number;
  icon: string;
  description: string;
  index: number;
}

const iconMap: Record<string, React.ReactNode> = {
  'code': <Code className="w-5 h-5" />,
  'file-text': <FileText className="w-5 h-5" />,
  'check-circle': <CheckCircle className="w-5 h-5" />,
  'folder': <Folder className="w-5 h-5" />,
  'git-branch': <GitBranch className="w-5 h-5" />,
  'globe': <Globe className="w-5 h-5" />,
};

const CategoryCard = ({ name, score, maxScore, icon, description, index }: CategoryCardProps) => {
  const percentage = (score / maxScore) * 100;

  const getColor = () => {
    if (percentage >= 80) return { bg: 'bg-success/10', text: 'text-success', bar: 'bg-success' };
    if (percentage >= 60) return { bg: 'bg-primary/10', text: 'text-primary', bar: 'bg-primary' };
    if (percentage >= 40) return { bg: 'bg-warning/10', text: 'text-warning', bar: 'bg-warning' };
    return { bg: 'bg-destructive/10', text: 'text-destructive', bar: 'bg-destructive' };
  };

  const colors = getColor();

  return (
    <div 
      className="p-5 rounded-xl bg-card border border-border hover:border-primary/30 transition-all duration-300 group animate-slide-up"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`p-2.5 rounded-lg ${colors.bg} ${colors.text} group-hover:scale-110 transition-transform duration-300`}>
          {iconMap[icon] || <Code className="w-5 h-5" />}
        </div>
        <div className="text-right">
          <span className={`text-2xl font-bold ${colors.text}`}>{score}</span>
          <span className="text-sm text-muted-foreground">/{maxScore}</span>
        </div>
      </div>

      <h3 className="font-semibold text-foreground mb-1">{name}</h3>
      <p className="text-sm text-muted-foreground mb-4">{description}</p>

      {/* Progress bar */}
      <div className="h-2 bg-secondary rounded-full overflow-hidden">
        <div
          className={`h-full ${colors.bar} rounded-full transition-all duration-1000 ease-out`}
          style={{ 
            width: `${percentage}%`,
            transitionDelay: `${index * 100 + 300}ms`
          }}
        />
      </div>
    </div>
  );
};

export default CategoryCard;
