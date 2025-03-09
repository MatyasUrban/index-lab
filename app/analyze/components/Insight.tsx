import React from "react";
import { Info } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export type LearningConcept = {
  title: string;
  description: string;
};

export type LearningConcepts = {
  [key: string]: LearningConcept;
};

export const learningConcepts: LearningConcepts = {
  startupCost: {
    title: "Startup Cost",
    description:
      "The estimated cost to get to the first row of output. This includes the cost of initialization and preparation before actual data retrieval begins.",
  },
  totalCost: {
    title: "Total Cost",
    description:
      "The estimated total cost to retrieve all rows. This includes the startup cost plus the cost of processing all rows.",
  },
  planningTime: {
    title: "Planning Time",
    description:
      "The time taken by the PostgreSQL query planner to generate an execution plan for the query.",
  },
  executionTime: {
    title: "Execution Time",
    description:
      "The actual time taken to execute the query and retrieve the results.",
  },
  "Index Only Scan": {
    title: "Index Only Scan",
    description:
      "A scan that can retrieve all needed data from the index without accessing the table. This is typically faster than a regular index scan.",
  },
  "Seq Scan": {
    title: "Sequential Scan",
    description:
      "A scan that reads all rows from a table sequentially. This can be slow for large tables if an appropriate index is not used.",
  },
};

export type InsightProps = {
  title: string;
  description: string;
  learnings: string[];
  content: React.ReactNode;
};

export function Insight({
  title,
  description,
  learnings,
  content,
}: InsightProps) {
  const validLearnings = learnings.filter(
    (concept) => learningConcepts[concept],
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Key Concepts:</h4>
          <div className="flex gap-2 flex-wrap">
            {validLearnings.map((concept) => (
              <Dialog key={concept}>
                <DialogTrigger asChild>
                  <Badge variant="secondary" className="cursor-pointer">
                    <Info className="mr-1 h-3 w-3" />
                    {learningConcepts[concept].title}
                  </Badge>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{learningConcepts[concept].title}</DialogTitle>
                    <DialogDescription>
                      {learningConcepts[concept].description}
                    </DialogDescription>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            ))}
          </div>
        </div>
        {content}
      </CardContent>
    </Card>
  );
}
