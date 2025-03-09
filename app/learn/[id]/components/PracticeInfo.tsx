"use client";

import { type PracticeItem } from "@/data/learning-path";
import { PracticeDescription } from "./PracticeDescription";
import { PracticeSchema } from "./PracticeSchema";
import { PracticeHints } from "./PracticeHints";

interface PracticeInfoProps {
  item: PracticeItem;
}

export function PracticeInfo({ item }: PracticeInfoProps) {
  return (
    <div className="flex flex-col gap-4">
      <PracticeDescription itemId={item.id} />
      <PracticeSchema />
      <PracticeHints hints={item.hints} />
    </div>
  );
}
