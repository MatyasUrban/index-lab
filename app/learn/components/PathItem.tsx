"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Code, ChevronRight } from "lucide-react";
import { LearningItem } from "@/data/learning-path";

interface PathItemProps {
  item: LearningItem;
  index: number;
}

export function PathItem({ item, index }: PathItemProps) {
  const isLearnType = item.type === "learn";

  return (
    <Card className="hover:bg-gray-50 transition-colors cursor-pointer border-l-4 border-l-primary shadow-sm">
      <CardHeader>
        <div className="flex justify-between items-center">
          <Badge className="flex items-center gap-1">
            {isLearnType ? (
              <BookOpen className="h-3 w-3" />
            ) : (
              <Code className="h-3 w-3" />
            )}
            {isLearnType ? "Learn" : "Practice"}
          </Badge>
          <div className="flex items-center justify-center h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm font-medium">
            {index + 1}
          </div>
        </div>
        <CardTitle>{item.title}</CardTitle>
        <CardDescription>{item.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-gray-500 flex items-center">
          Click to {isLearnType ? "learn" : "practice"}
          <ChevronRight className="h-4 w-4 ml-1" />
        </div>
      </CardContent>
    </Card>
  );
}
