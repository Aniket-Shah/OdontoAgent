import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Clock, FileText, CheckCircle } from "lucide-react";

const auditLogs = [
  {
    id: "PT-2341",
    timestamp: "2025-10-15 14:32",
    imageType: "Panoramic X-Ray",
    model: "OdontoNet-v3.2",
    confidence: 92,
    findings: 3,
    notes: "High confidence detections",
  },
  {
    id: "PT-2340",
    timestamp: "2025-10-15 13:18",
    imageType: "Bitewing",
    model: "OdontoNet-v3.2",
    confidence: 87,
    findings: 2,
    notes: "Reviewed by Dr. Smith",
  },
  {
    id: "PT-2339",
    timestamp: "2025-10-15 11:45",
    imageType: "Periapical",
    model: "OdontoNet-v3.1",
    confidence: 76,
    findings: 1,
    notes: "Manual review requested",
  },
  {
    id: "PT-2338",
    timestamp: "2025-10-14 16:22",
    imageType: "Panoramic X-Ray",
    model: "OdontoNet-v3.2",
    confidence: 94,
    findings: 4,
    notes: "Emergency case priority",
  },
  {
    id: "PT-2337",
    timestamp: "2025-10-14 15:10",
    imageType: "Cephalometric",
    model: "OdontoNet-v3.2",
    confidence: 89,
    findings: 2,
    notes: "Follow-up scheduled",
  },
];

export default function Audit() {
  const getConfidenceBadge = (confidence: number) => {
    if (confidence >= 85) {
      return (
        <Badge className="bg-confidence-high/10 text-confidence-high border-confidence-high/20">
          High
        </Badge>
      );
    }
    if (confidence >= 70) {
      return (
        <Badge className="bg-confidence-medium/10 text-confidence-medium border-confidence-medium/20">
          Medium
        </Badge>
      );
    }
    return (
      <Badge className="bg-confidence-low/10 text-confidence-low border-confidence-low/20">
        Low
      </Badge>
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Audit & Case Log</h1>
        <p className="text-muted-foreground">
          Historical record of analyzed cases and AI detections
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-primary/10 rounded-lg">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {auditLogs.length}
              </p>
              <p className="text-sm text-muted-foreground">Total Cases</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-confidence-high/10 rounded-lg">
              <CheckCircle className="h-6 w-6 text-confidence-high" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">88%</p>
              <p className="text-sm text-muted-foreground">Avg Confidence</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 shadow-soft">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-accent/10 rounded-lg">
              <Clock className="h-6 w-6 text-accent" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">24h</p>
              <p className="text-sm text-muted-foreground">Time Range</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Audit Table */}
      <Card className="shadow-soft">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Patient ID</TableHead>
              <TableHead className="font-semibold">Timestamp</TableHead>
              <TableHead className="font-semibold">Image Type</TableHead>
              <TableHead className="font-semibold">Model Used</TableHead>
              <TableHead className="font-semibold">Confidence</TableHead>
              <TableHead className="font-semibold">Findings</TableHead>
              <TableHead className="font-semibold">Notes</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {auditLogs.map((log) => (
              <TableRow
                key={log.id}
                className="hover:bg-muted/30 transition-colors cursor-pointer"
              >
                <TableCell className="font-medium text-foreground">
                  {log.id}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {log.timestamp}
                </TableCell>
                <TableCell className="text-foreground">{log.imageType}</TableCell>
                <TableCell className="text-muted-foreground font-mono text-xs">
                  {log.model}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getConfidenceBadge(log.confidence)}
                    <span className="text-sm text-muted-foreground">
                      {log.confidence}%
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{log.findings} detected</Badge>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                  {log.notes}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
