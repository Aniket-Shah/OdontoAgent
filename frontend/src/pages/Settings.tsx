import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Save, User } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [modelType, setModelType] = useState("ensemble");
  const [userRole, setUserRole] = useState("clinician");
  const [explainabilityMode, setExplainabilityMode] = useState(true);
  const { toast } = useToast();

  const handleSave = () => {
    // Toggle dark mode class on document
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    toast({
      title: "Settings saved",
      description: "Your preferences have been updated successfully.",
    });
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground">
          Configure your OdontoAgent preferences
        </p>
      </div>

      {/* Appearance */}
      <Card className="p-6 shadow-soft space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            {darkMode ? (
              <Moon className="h-5 w-5 text-primary" />
            ) : (
              <Sun className="h-5 w-5 text-primary" />
            )}
            Appearance
          </h2>
        </div>

        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label htmlFor="dark-mode" className="text-foreground font-medium">
              Dark Mode
            </Label>
            <p className="text-sm text-muted-foreground">
              Switch between light and dark theme
            </p>
          </div>
          <Switch
            id="dark-mode"
            checked={darkMode}
            onCheckedChange={setDarkMode}
          />
        </div>
      </Card>

      {/* AI Model Settings */}
      <Card className="p-6 shadow-soft space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4">
            AI Model Configuration
          </h2>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="model-select" className="text-foreground font-medium">
              Model Selection
            </Label>
            <Select value={modelType} onValueChange={setModelType}>
              <SelectTrigger id="model-select" className="bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-card">
                <SelectItem value="ensemble">
                  Classification + Segmentation Ensemble
                </SelectItem>
                <SelectItem value="classification">
                  Classification Only
                </SelectItem>
                <SelectItem value="segmentation">
                  Segmentation Only
                </SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              Ensemble mode combines multiple AI models for higher accuracy
            </p>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="space-y-1">
              <Label htmlFor="explainability" className="text-foreground font-medium">
                Explainability Mode
              </Label>
              <p className="text-sm text-muted-foreground">
                Show uncertainty overlays and heatmaps
              </p>
            </div>
            <Switch
              id="explainability"
              checked={explainabilityMode}
              onCheckedChange={setExplainabilityMode}
            />
          </div>
        </div>
      </Card>

      {/* User Settings */}
      <Card className="p-6 shadow-soft space-y-6">
        <div>
          <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            User Settings
          </h2>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role-select" className="text-foreground font-medium">
            User Role
          </Label>
          <Select value={userRole} onValueChange={setUserRole}>
            <SelectTrigger id="role-select" className="bg-background">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-card">
              <SelectItem value="clinician">Clinician</SelectItem>
              <SelectItem value="admin">Administrator</SelectItem>
              <SelectItem value="researcher">Researcher</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Your role determines access permissions and available features
          </p>
        </div>
      </Card>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-soft"
        >
          <Save className="mr-2 h-4 w-4" />
          Save Settings
        </Button>
      </div>
    </div>
  );
}
