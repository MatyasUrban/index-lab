"use client";

import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";

interface PracticeHintsProps {
  hints: string[];
}

export function PracticeHints({ hints }: PracticeHintsProps) {
  const [hintStates, setHintStates] = useState<boolean[]>(
    Array(hints.length).fill(false),
  );

  const toggleHint = (index: number) => {
    setHintStates((prev) => {
      const newStates = [...prev];
      newStates[index] = !newStates[index];
      return newStates;
    });
  };

  return (
    <>
      {hints.map((hint, index) => (
        <Collapsible
          key={`hint-${index}`}
          open={hintStates[index]}
          onOpenChange={() => toggleHint(index)}
          className="border rounded-md"
        >
          <CollapsibleTrigger className="flex w-full justify-between items-center p-4 font-medium">
            <span>Hint {index + 1}</span>
            {hintStates[index] ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 pt-0 border-t">
            {hint}
          </CollapsibleContent>
        </Collapsible>
      ))}
    </>
  );
}
