"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { learningPath } from "@/data/learning-path";

interface LearningDetailNavigationProps {
  currentItemId: number;
}

export function LearningDetailNavigation({
  currentItemId,
}: LearningDetailNavigationProps) {
  const router = useRouter();
  const currentIndex = learningPath.findIndex(
    (item) => item.id === currentItemId,
  );
  const currentItem = learningPath[currentIndex];
  const previousItem = currentIndex > 0 ? learningPath[currentIndex - 1] : null;
  const nextItem =
    currentIndex < learningPath.length - 1
      ? learningPath[currentIndex + 1]
      : null;

  const handleClose = () => {
    router.push("/learn");
  };

  if (!currentItem) {
    return <div>Item not found</div>;
  }

  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h1 className="text-3xl font-bold">{currentItem.title}</h1>
        <Badge
          variant={currentItem.type === "learn" ? "default" : "secondary"}
          className="mt-2"
        >
          {currentItem.type === "learn" ? "Learn" : "Practice"}
        </Badge>
      </div>
      <div className="flex space-x-2">
        <Button
          variant="outline"
          size="icon"
          disabled={!previousItem}
          onClick={() =>
            previousItem && router.push(`/learn/${previousItem.id}`)
          }
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          disabled={!nextItem}
          onClick={() => nextItem && router.push(`/learn/${nextItem.id}`)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={handleClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
