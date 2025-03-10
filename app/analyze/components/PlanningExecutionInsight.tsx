import React from "react";
import { Insight } from "./Insight";

type PlanningExecutionInsightProps = {
  planningTime: number;
  executionTime: number;
};

export function PlanningExecutionInsight({
  planningTime,
  executionTime,
}: PlanningExecutionInsightProps) {
  const planningExecutionTimeContent = (
    <div className="flex gap-4">
      <div className="flex-1 bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Planning Time</h3>
        <p className="text-3xl font-bold">{planningTime.toFixed(3)} ms</p>
      </div>
      <div className="flex-1 bg-green-100 dark:bg-green-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">Execution Time</h3>
        <p className="text-3xl font-bold">{executionTime.toFixed(3)} ms</p>
      </div>
    </div>
  );

  return (
    <Insight
      title="Planning and Execution Time"
      description="This insight showcases the time spent planning and execution duration of your query."
      learnings={["planningTime", "executionTime"]}
      content={planningExecutionTimeContent}
    />
  );
}
