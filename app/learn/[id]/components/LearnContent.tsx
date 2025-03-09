"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { LearnItem } from "@/data/learning-path";
import { Markdown } from "@/components/Markdown";
import QuizCard from "@/app/learn/[id]/components/QuizCard";

interface LearnContentProps {
  item: LearnItem;
}

export function LearnContent({ item }: LearnContentProps) {
  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <Markdown contentId={item.id} />
        </CardContent>
      </Card>
      <QuizCard id={item.id} />
    </>
  );
}
