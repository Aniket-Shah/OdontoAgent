import { Card } from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const accuracyData = [
  { month: "Jan", accuracy: 82 },
  { month: "Feb", accuracy: 84 },
  { month: "Mar", accuracy: 86 },
  { month: "Apr", accuracy: 87 },
  { month: "May", accuracy: 89 },
  { month: "Jun", accuracy: 91 },
];

const usageData = [
  { month: "Jan", cases: 45 },
  { month: "Feb", cases: 52 },
  { month: "Mar", cases: 68 },
  { month: "Apr", cases: 71 },
  { month: "May", cases: 83 },
  { month: "Jun", cases: 94 },
];

const detectionTypes = [
  { name: "Caries", value: 42, color: "hsl(180, 32%, 51%)" },
  { name: "Bone Loss", value: 28, color: "hsl(180, 35%, 45%)" },
  { name: "Fractures", value: 18, color: "hsl(180, 20%, 75%)" },
  { name: "Other", value: 12, color: "hsl(180, 25%, 90%)" },
];

export default function Analytics() {
  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold text-foreground">Analytics & Insights</h1>
        <p className="text-muted-foreground">
          Track AI performance and usage patterns
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 shadow-soft">
          <p className="text-sm text-muted-foreground mb-1">Total Cases</p>
          <p className="text-3xl font-bold text-foreground">413</p>
          <p className="text-xs text-confidence-high mt-1">↑ 14% this month</p>
        </Card>
        <Card className="p-6 shadow-soft">
          <p className="text-sm text-muted-foreground mb-1">Avg Confidence</p>
          <p className="text-3xl font-bold text-foreground">87%</p>
          <p className="text-xs text-confidence-high mt-1">↑ 3% improvement</p>
        </Card>
        <Card className="p-6 shadow-soft">
          <p className="text-sm text-muted-foreground mb-1">Active Dentists</p>
          <p className="text-3xl font-bold text-foreground">24</p>
          <p className="text-xs text-muted-foreground mt-1">Across 3 clinics</p>
        </Card>
        <Card className="p-6 shadow-soft">
          <p className="text-sm text-muted-foreground mb-1">Detection Rate</p>
          <p className="text-3xl font-bold text-foreground">91%</p>
          <p className="text-xs text-confidence-high mt-1">Industry leading</p>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Accuracy Over Time */}
        <Card className="p-6 shadow-soft">
          <h3 className="font-semibold text-foreground mb-4">
            Detection Accuracy Trend
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={accuracyData}>
              <defs>
                <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(180, 32%, 51%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(180, 32%, 51%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(180, 20%, 80%)" />
              <XAxis dataKey="month" stroke="hsl(201, 44%, 10%)" />
              <YAxis stroke="hsl(201, 44%, 10%)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(180, 20%, 80%)",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="accuracy"
                stroke="hsl(180, 32%, 51%)"
                strokeWidth={2}
                fill="url(#accuracyGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </Card>

        {/* Usage Statistics */}
        <Card className="p-6 shadow-soft">
          <h3 className="font-semibold text-foreground mb-4">Monthly Cases</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(180, 20%, 80%)" />
              <XAxis dataKey="month" stroke="hsl(201, 44%, 10%)" />
              <YAxis stroke="hsl(201, 44%, 10%)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(180, 20%, 80%)",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="cases" fill="hsl(180, 32%, 51%)" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Detection Distribution */}
        <Card className="p-6 shadow-soft">
          <h3 className="font-semibold text-foreground mb-4">
            Detection Type Distribution
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={detectionTypes}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {detectionTypes.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        {/* Model Confidence Trends */}
        <Card className="p-6 shadow-soft">
          <h3 className="font-semibold text-foreground mb-4">
            Model Confidence Trends
          </h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(180, 20%, 80%)" />
              <XAxis dataKey="month" stroke="hsl(201, 44%, 10%)" />
              <YAxis stroke="hsl(201, 44%, 10%)" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(180, 20%, 80%)",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="accuracy"
                stroke="hsl(180, 35%, 45%)"
                strokeWidth={3}
                dot={{ fill: "hsl(180, 32%, 51%)", r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}
