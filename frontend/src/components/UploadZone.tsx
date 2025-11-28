import { Upload, FileImage } from "lucide-react";
import { useState, useCallback } from "react";
import { Card } from "@/components/ui/card";

interface UploadZoneProps {
  onFileSelect: (file: File) => void;
}

export function UploadZone({ onFileSelect }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onFileSelect(files[0]);
      }
    },
    [onFileSelect]
  );

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      onFileSelect(files[0]);
    }
  };

  return (
    <Card
      className={`border-2 border-dashed rounded-lg p-12 transition-all cursor-pointer shadow-soft hover:shadow-medium ${
        isDragging
          ? "border-primary bg-primary/5 scale-[1.02]"
          : "border-muted-foreground/30 hover:border-primary/50"
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center justify-center gap-4">
          <div className={`p-4 rounded-full transition-colors ${
            isDragging ? "bg-primary/10" : "bg-muted"
          }`}>
            {isDragging ? (
              <FileImage className="h-12 w-12 text-primary" />
            ) : (
              <Upload className="h-12 w-12 text-muted-foreground" />
            )}
          </div>
          <div className="text-center">
            <p className="text-lg font-medium text-foreground mb-1">
              Drop DICOM or image files here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse your computer
            </p>
          </div>
          <p className="text-xs text-muted-foreground">
            Supports: DICOM, PNG, JPG, TIFF
          </p>
        </div>
        <input
          id="file-upload"
          type="file"
          className="sr-only"
          accept=".dcm,.dicom,.png,.jpg,.jpeg,.tiff"
          onChange={handleFileInput}
        />
      </label>
    </Card>
  );
}
