import { useEffect, useState } from 'react';

interface CircularScoreProps {
  score: number;
  size?: number;
  strokeWidth?: number;
  showAnimation?: boolean;
}

const CircularScore = ({ score, size = 200, strokeWidth = 12, showAnimation = true }: CircularScoreProps) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    if (showAnimation) {
      const duration = 1500;
      const startTime = Date.now();
      
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function
        const eased = 1 - Math.pow(1 - progress, 3);
        setAnimatedScore(Math.round(eased * score));
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };
      
      requestAnimationFrame(animate);
    } else {
      setAnimatedScore(score);
    }
  }, [score, showAnimation]);

  const getScoreColor = () => {
    if (score >= 80) return 'hsl(var(--success))';
    if (score >= 60) return 'hsl(var(--primary))';
    if (score >= 40) return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  const getScoreGlow = () => {
    if (score >= 80) return '0 0 40px hsl(142 72% 45% / 0.4)';
    if (score >= 60) return '0 0 40px hsl(174 72% 56% / 0.4)';
    if (score >= 40) return '0 0 40px hsl(38 92% 50% / 0.4)';
    return '0 0 40px hsl(0 72% 51% / 0.4)';
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="hsl(var(--secondary))"
          strokeWidth={strokeWidth}
        />
        
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getScoreColor()}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{
            transition: 'stroke-dashoffset 1.5s ease-out',
            filter: `drop-shadow(${getScoreGlow()})`,
          }}
        />
      </svg>
      
      {/* Score text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span 
          className="text-5xl font-bold tabular-nums"
          style={{ color: getScoreColor() }}
        >
          {animatedScore}
        </span>
        <span className="text-sm text-muted-foreground mt-1">out of 100</span>
      </div>
    </div>
  );
};

export default CircularScore;
