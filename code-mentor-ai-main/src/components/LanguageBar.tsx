interface LanguageBarProps {
  languages: { name: string; percentage: number; color: string }[];
}

const LanguageBar = ({ languages }: LanguageBarProps) => {
  return (
    <div className="p-5 rounded-xl bg-card border border-border">
      <h3 className="font-semibold text-foreground mb-4">Languages Used</h3>
      
      {/* Combined bar */}
      <div className="h-3 rounded-full overflow-hidden flex mb-4">
        {languages.map((lang, index) => (
          <div
            key={lang.name}
            className="h-full transition-all duration-500"
            style={{
              width: `${lang.percentage}%`,
              backgroundColor: lang.color,
              transitionDelay: `${index * 100}ms`,
            }}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {languages.map((lang) => (
          <div key={lang.name} className="flex items-center gap-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: lang.color }}
            />
            <span className="text-sm text-foreground">{lang.name}</span>
            <span className="text-sm text-muted-foreground">{lang.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LanguageBar;
