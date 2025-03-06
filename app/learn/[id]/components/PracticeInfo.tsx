"use client"

import { type LearningItem } from "@/data/learning-path"
import { PracticeDescription } from "./PracticeDescription"
import { PracticeSchema } from "./PracticeSchema"
import { PracticeHints } from "./PracticeHints"

interface PracticeInfoProps {
  item: LearningItem & { type: "practice" }
}

export function PracticeInfo({ item }: PracticeInfoProps) {
  return (
    <div className="flex flex-col gap-4">
      {/* Task Description */}
      <PracticeDescription itemId={item.id} />
      
      {/* Database Schema Button */}
      <PracticeSchema />
      
      {/* Hints */}
      <PracticeHints hints={item.hints} />
    </div>
  )
} 