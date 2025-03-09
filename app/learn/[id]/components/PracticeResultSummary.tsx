"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

interface PracticeResultSummaryProps {
  isCorrect: boolean | undefined;
  isPerformant: boolean | undefined;
}

export function PracticeResultSummary({
  isCorrect = false,
  isPerformant = false,
}: PracticeResultSummaryProps) {
  const isPassed = !!isCorrect && !!isPerformant;

  return (
    <div className="space-y-2">
      <div className="flex justify-center">
        <Badge className={isPassed ? "bg-green-600" : "bg-red-600"}>
          {isPassed ? "Passed" : "Failed"}
        </Badge>
      </div>

      <div className="flex items-center gap-2 mt-2">
        {isCorrect ? (
          <CheckCircle2 className="text-green-600" size={20} />
        ) : (
          <XCircle className="text-red-600" size={20} />
        )}
        <span>Query returned {isCorrect ? "expected" : "unexpected"} data</span>
      </div>

      {isCorrect && (
        <div className="flex items-center gap-2">
          {isPerformant ? (
            <CheckCircle2 className="text-green-600" size={20} />
          ) : (
            <XCircle className="text-red-600" size={20} />
          )}
          <span>
            Query performance is {isPerformant ? "sufficient" : "insufficient"}
          </span>
        </div>
      )}
    </div>
  );
}
