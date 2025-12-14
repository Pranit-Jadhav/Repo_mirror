import { useState } from 'react';
import { Check, Circle, ChevronRight, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low';
  category: string;
  completed: boolean;
}

interface RoadmapCardProps {
  items: RoadmapItem[];
}

const priorityConfig = {
  high: {
    icon: AlertTriangle,
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive/30',
    label: 'High Priority',
  },
  medium: {
    icon: AlertCircle,
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning/30',
    label: 'Medium Priority',
  },
  low: {
    icon: Info,
    bg: 'bg-primary/10',
    text: 'text-primary',
    border: 'border-primary/30',
    label: 'Low Priority',
  },
};

const RoadmapCard = ({ items }: RoadmapCardProps) => {
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [expandedItem, setExpandedItem] = useState<string | null>(null);

  const toggleComplete = (id: string) => {
    setCompletedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const toggleExpand = (id: string) => {
    setExpandedItem(prev => prev === id ? null : id);
  };

  const progress = (completedItems.size / items.length) * 100;

  return (
    <div className="rounded-xl bg-card border border-border overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground">Personalized Roadmap</h2>
          <span className="text-sm text-muted-foreground">
            {completedItems.size} of {items.length} completed
          </span>
        </div>
        
        {/* Progress bar */}
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-success rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Items */}
      <div className="divide-y divide-border">
        {items.map((item, index) => {
          const isCompleted = completedItems.has(item.id);
          const isExpanded = expandedItem === item.id;
          const config = priorityConfig[item.priority];
          const PriorityIcon = config.icon;

          return (
            <div
              key={item.id}
              className={`transition-all duration-300 ${isCompleted ? 'bg-success/5' : 'hover:bg-secondary/50'}`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="p-4 flex items-start gap-4">
                {/* Checkbox */}
                <button
                  onClick={() => toggleComplete(item.id)}
                  className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-success border-success text-success-foreground'
                      : 'border-muted-foreground/30 hover:border-primary'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5" />
                  ) : (
                    <Circle className="w-3.5 h-3.5 opacity-0" />
                  )}
                </button>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-medium transition-all duration-300 ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                      {item.title}
                    </h3>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.text}`}>
                      {item.category}
                    </span>
                  </div>

                  <button
                    onClick={() => toggleExpand(item.id)}
                    className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <ChevronRight className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`} />
                    <span>{isExpanded ? 'Hide details' : 'Show details'}</span>
                  </button>

                  {isExpanded && (
                    <p className="mt-3 text-sm text-muted-foreground pl-5 animate-fade-in">
                      {item.description}
                    </p>
                  )}
                </div>

                {/* Priority indicator */}
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${config.bg} ${config.text}`}>
                  <PriorityIcon className="w-3.5 h-3.5" />
                  <span className="text-xs font-medium hidden sm:inline">{config.label}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RoadmapCard;
