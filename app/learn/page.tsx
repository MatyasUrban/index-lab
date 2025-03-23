"use client";

import Link from "next/link";
import { learningPath } from "@/data/learning-path";
import { PathItem } from "@/app/learn/components/PathItem";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function LearnPage() {
  const [completedIds, setCompletedIds] = useState<number[]>([]);

  useEffect(() => {
    const storedProgress = localStorage.getItem("learningProgress");
    if (storedProgress) {
      try {
        const parsedProgress = JSON.parse(storedProgress);
        if (Array.isArray(parsedProgress)) {
          setCompletedIds(parsedProgress);
        }
      } catch (e) {
        console.error("Failed to parse learning progress", e);
      }
    }
  }, []);

  const totalItems = learningPath.length;
  const completedItems = learningPath.filter((item) =>
    completedIds.includes(item.id),
  ).length;
  const progressPercentage =
    totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const resetProgress = () => {
    localStorage.removeItem("learningProgress");
    setCompletedIds([]);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-4">Learning Path</h1>
      <p className="mb-8">
        Follow this structured path to master PostgreSQL indexing.
      </p>

      <div className="mb-8">
        <div className="text-sm font-medium mb-2">Learning Progress</div>
        <Progress value={progressPercentage} className="h-2 mb-2" />
        <div className="flex justify-between items-center mt-1">
          <span className="text-sm text-gray-600">
            {completedItems} of {totalItems} completed
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={resetProgress}
            className="text-xs"
          >
            Reset Progress
          </Button>
        </div>
      </div>

      <div className="space-y-12">
        {learningPath.map((item, index) => (
          <div key={item.id} className="relative">
            {/* Flow indicator line between cards */}
            {index < learningPath.length - 1 && (
              <div className="absolute left-8 top-full h-12 w-0.5 bg-gray-200 z-0"></div>
            )}

            <Link href={`/learn/${item.id}`}>
              <PathItem
                item={item}
                index={index}
                isCompleted={completedIds.includes(item.id)}
              />
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
