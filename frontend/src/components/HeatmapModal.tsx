import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ConfidenceBar } from "./ConfidenceBar";

interface HeatmapModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  finding: string;
  confidence: number;
  imageSrc?: string;
}

export function HeatmapModal({
  open,
  onOpenChange,
  finding,
  confidence,
  imageSrc,
}: HeatmapModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{finding} - AI Confidence Heatmap</DialogTitle>
          <DialogDescription>
            Visualization of model uncertainty and detection regions
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Heatmap visualization */}
          <div className="bg-muted rounded-lg aspect-video flex items-center justify-center overflow-hidden">
            {imageSrc ? (
              <img src={imageSrc} alt="Heatmap" className="w-full h-full object-contain" />
            ) : (
              <div className="text-center p-8">
                <p className="text-muted-foreground">
                  Heatmap visualization would appear here
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Showing AI attention regions and uncertainty areas
                </p>
              </div>
            )}
          </div>

          {/* Confidence breakdown */}
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Model Confidence Breakdown</h4>
            <ConfidenceBar confidence={confidence} label="Overall Confidence" />
            <ConfidenceBar confidence={confidence * 0.95} label="Spatial Accuracy" />
            <ConfidenceBar confidence={confidence * 0.88} label="Classification Certainty" />
          </div>

          {/* Explainability section */}
          <div className="bg-muted/50 rounded-lg p-4 border border-border">
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <span className="text-primary">🔍</span>
              Explainability Mode
            </h4>
            <p className="text-sm text-muted-foreground">
              The AI model shows {confidence}% confidence in detecting this finding. 
              Highlighted regions indicate areas of high attention, while cooler colors 
              represent uncertainty. This visualization helps clinicians understand the 
              AI's reasoning process.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
