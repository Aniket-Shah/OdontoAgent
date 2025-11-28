import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UploadZone } from "@/components/UploadZone";
import { DetectionCard } from "@/components/DetectionCard";
import { HeatmapModal } from "@/components/HeatmapModal";
import { Image as ImageIcon, Sparkles } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<{
    finding: string;
    confidence: number;
  } | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { toast } = useToast();

  // Mock detection results
  const detections = uploadedFile
    ? [
        {
          finding: "Occlusal Caries - Tooth 16",
          confidence: 87,
          description: "Probable decay on occlusal surface of upper right first molar",
          severity: "high" as const,
        },
        {
          finding: "Marginal Bone Loss - Quadrant 3",
          confidence: 76,
          description: "Moderate alveolar bone resorption detected in lower left quadrant",
          severity: "medium" as const,
        },
        {
          finding: "Enamel Fracture - Tooth 24",
          confidence: 92,
          description: "Hairline fracture detected on buccal surface",
          severity: "high" as const,
        },
      ]
    : [];

  const handleFileSelect = (file: File) => {
    setUploadedFile(file);
  };

  const handleDetectionClick = (finding: string, confidence: number) => {
    setSelectedFinding({ finding, confidence });
  };

  const handleAnalyze = async () => {
    if (!uploadedFile) return;

    setIsAnalyzing(true);
    
    try {
      const formData = new FormData();
      formData.append('file', uploadedFile);

      const { data, error } = await supabase.functions.invoke('upload-image', {
        body: formData,
      });

      if (error) throw error;

      toast({
        title: "Image uploaded successfully",
        description: `File: ${data.fileName}`,
      });
      
      console.log('Upload response:', data);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload image",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Upload dental imaging for AI-assisted analysis
        </p>
      </div>

      {/* Upload Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Upload Image</h2>
          <UploadZone onFileSelect={handleFileSelect} />
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Preview</h2>
          <Card className="p-6 shadow-soft border border-border min-h-[300px] flex items-center justify-center">
            {uploadedFile ? (
              <div className="space-y-3 w-full">
                <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-muted-foreground" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-foreground">{uploadedFile.name}</p>
                  <p className="text-muted-foreground">
                    {(uploadedFile.size / 1024).toFixed(2)} KB
                  </p>
                </div>
                <Button 
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft"
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  {isAnalyzing ? "Analyzing..." : "Analyze with AI"}
                </Button>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p>Upload an image to preview</p>
              </div>
            )}
          </Card>
        </div>
      </div>

      {/* AI Results Section */}
      {detections.length > 0 && (
        <div className="space-y-4 animate-fade-in">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">AI Detection Results</h2>
            <span className="text-sm text-muted-foreground">
              {detections.length} findings detected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {detections.map((detection, index) => (
              <DetectionCard
                key={index}
                {...detection}
                onClick={() =>
                  handleDetectionClick(detection.finding, detection.confidence)
                }
              />
            ))}
          </div>

          {/* Clinical Suggestion */}
          <Card className="p-6 shadow-soft border border-primary/20 bg-gradient-to-br from-primary/5 to-accent/5">
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <span className="text-primary">💡</span>
              Clinical Suggestion
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Based on the AI analysis, we recommend further examination of the occlusal
              caries on tooth 16 with 87% confidence. Consider radiographic confirmation
              and evaluate the extent of decay. The enamel fracture on tooth 24 shows
              high confidence (92%) and may require immediate attention to prevent further
              deterioration.
            </p>
          </Card>
        </div>
      )}

      {/* Heatmap Modal */}
      <HeatmapModal
        open={selectedFinding !== null}
        onOpenChange={(open) => !open && setSelectedFinding(null)}
        finding={selectedFinding?.finding || ""}
        confidence={selectedFinding?.confidence || 0}
      />
    </div>
  );
}
