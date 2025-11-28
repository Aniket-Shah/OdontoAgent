import { Card } from "@/components/ui/card";
import { ConfidenceBar } from "./ConfidenceBar";
import { AlertTriangle, CheckCircle, Info } from "lucide-react";

interface DetectionCardProps {
  finding: string;
  confidence: number;
  description: string;
  severity?: "low" | "medium" | "high";
  onClick?: () => void;
}

export function DetectionCard({
  finding,
  confidence,
  description,
  severity = "medium",
  onClick,
}: DetectionCardProps) {
  const getSeverityIcon = () => {
    switch (severity) {
      case "high":
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
      case "medium":
        return <Info className="h-5 w-5 text-confidence-medium" />;
      case "low":
        return <CheckCircle className="h-5 w-5 text-confidence-high" />;
    }
  };

  return (
    <Card
      className="p-5 shadow-soft hover:shadow-medium transition-all cursor-pointer group border border-border hover:border-primary/50 animate-fade-in"
      onClick={onClick}
    >
      <div className="flex items-start gap-3 mb-4">
        <div className="mt-1">{getSeverityIcon()}</div>
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
            {finding}
          </h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
      <ConfidenceBar confidence={confidence} label="Detection Confidence" />
    </Card>
  );
}
