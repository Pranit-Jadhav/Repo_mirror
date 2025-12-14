import { FileCode, GitCommit, Users, Clock } from 'lucide-react';

interface StatsBarProps {
  stats: {
    files: number;
    commits: number;
    contributors: number;
    languages: { name: string; percentage: number; color: string }[];
    lastUpdated: string;
  };
}

const StatsBar = ({ stats }: StatsBarProps) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10 text-primary">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.files}</p>
            <p className="text-sm text-muted-foreground">Files</p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-success/10 text-success">
            <GitCommit className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.commits}</p>
            <p className="text-sm text-muted-foreground">Commits</p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-warning/10 text-warning">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <p className="text-2xl font-bold text-foreground">{stats.contributors}</p>
            <p className="text-sm text-muted-foreground">Contributors</p>
          </div>
        </div>
      </div>

      <div className="p-4 rounded-xl bg-card border border-border">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-secondary text-muted-foreground">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{stats.lastUpdated}</p>
            <p className="text-sm text-muted-foreground">Last Update</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsBar;
