import React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Insight } from "./Insight";

type CostData = {
  node: string;
  startupCost: number;
  totalCost: number;
};

type CostInsightProps = {
  title: string;
  description: string;
  data: CostData[];
  total?: boolean;
};

export function CostInsight({
  title,
  description,
  data,
  total = false,
}: CostInsightProps) {
  const learnings = total
    ? ["actualStartupTime", "actualTotalTime"]
    : ["startupCost", "totalCost"];
  const chartContent = data && (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="node" />
        <YAxis />
        <Tooltip />
        <Bar dataKey="startupCost" stackId="a" fill="hsl(var(--chart-1))" />
        <Bar dataKey="totalCost" stackId="a" fill="hsl(var(--chart-2))" />
      </BarChart>
    </ResponsiveContainer>
  );

  return (
    <Insight
      title={title}
      description={description}
      learnings={learnings}
      content={chartContent}
    />
  );
}
