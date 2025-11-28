interface ConfidenceBarProps {
  confidence: number;
  label?: string;
}

export function ConfidenceBar({ confidence, label }: ConfidenceBarProps) {
  const getConfidenceColor = (conf: number) => {
    if (conf >= 80) return "bg-confidence-high";
    if (conf >= 60) return "bg-confidence-medium";
    return "bg-confidence-low";
  };

  const getConfidenceTextColor = (conf: number) => {
    if (conf >= 80) return "text-confidence-high";
    if (conf >= 60) return "text-confidence-medium";
    return "text-confidence-low";
  };

  return (
    <div className="space-y-1">
      {label && (
        <div className="flex justify-between items-center text-xs">
          <span className="text-muted-foreground">{label}</span>
          <span className={`font-medium ${getConfidenceTextColor(confidence)}`}>
            {confidence}%
          </span>
        </div>
      )}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className={`h-full ${getConfidenceColor(confidence)} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${confidence}%` }}
        />
      </div>
    </div>
  );
}
