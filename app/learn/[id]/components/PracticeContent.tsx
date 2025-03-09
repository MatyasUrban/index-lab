"use client";

import React from "react";
import { PracticeItem } from "@/data/learning-path";
import { PracticeInfo } from "./PracticeInfo";
import { PracticeImplementation } from "./PracticeImplementation";

interface PracticeContentProps {
  item: PracticeItem;
}

export function PracticeContent({ item }: PracticeContentProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-background">
      <PracticeInfo item={item} />
      <PracticeImplementation item={item} />
    </div>
  );
}
