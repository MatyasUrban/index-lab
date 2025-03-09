"use client";

import React from "react";
import { useRouter } from "next/navigation";
import {
  learningPath,
  type LearnItem,
  type PracticeItem,
} from "@/data/learning-path";
import { LearningDetailNavigation } from "@/app/learn/[id]/components/LearningDetailNavigation";
import { LearnContent } from "@/app/learn/[id]/components/LearnContent";
import { PracticeContent } from "@/app/learn/[id]/components/PracticeContent";

export default function LearnDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  useRouter();
  const unwrappedParams = React.use(params);
  const currentItemId = Number.parseInt(unwrappedParams.id, 10);
  const currentIndex = learningPath.findIndex(
    (item) => item.id === currentItemId,
  );
  const currentItem = learningPath[currentIndex];

  if (!currentItem) {
    return <div>Item not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <LearningDetailNavigation currentItemId={currentItemId} />

      {currentItem.type === "learn" ? (
        <LearnContent item={currentItem as LearnItem} />
      ) : (
        <PracticeContent item={currentItem as PracticeItem} />
      )}
    </div>
  );
}
