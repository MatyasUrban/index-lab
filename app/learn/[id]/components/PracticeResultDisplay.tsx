"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Loader2, AlertCircle, InfoIcon } from "lucide-react";
import { PracticeResultCard } from "./PracticeResultCard";
import { EvaluationResponseType } from "@/app/api/evaluate/[practiceTaskId]/route";

interface PracticeResultDisplayProps {
  loading: boolean;
  submitted: boolean;
  result: EvaluationResponseType | null;
  progress?: { value: number; message: string } | null;
}

export function PracticeResultDisplay({
  loading,
  submitted,
  result,
  progress,
}: PracticeResultDisplayProps) {
  if (!loading && !submitted && !result) {
    return (
      <Alert className="mt-4">
        <InfoIcon className="h-4 w-4" />
        <AlertTitle>Ready for your solution</AlertTitle>
        <AlertDescription>
          Write your SQL query and submit it for evaluation. Your solution will
          be checked for correctness and performance.
        </AlertDescription>
      </Alert>
    );
  }

  if (loading) {
    return (
      <Card className="mt-4">
        <CardContent className="p-6 flex flex-col items-center justify-center min-h-[150px]">
          {progress ? (
            <>
              <Progress value={progress.value} className="w-full mb-2" />
              <p className="text-sm text-muted-foreground">
                {progress.message}
              </p>
            </>
          ) : (
            <div className="flex flex-col items-center">
              <Loader2 className="h-8 w-8 animate-spin mb-2" />
              <p className="text-sm text-muted-foreground">
                Evaluating your solution...
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  if (result?.error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription className="font-mono whitespace-pre-wrap">
          {result.error}
        </AlertDescription>
      </Alert>
    );
  }

  if (submitted && result) {
    return <PracticeResultCard result={result} />;
  }

  return (
    <Alert className="mt-4">
      <InfoIcon className="h-4 w-4" />
      <AlertTitle>Submit your solution</AlertTitle>
      <AlertDescription>
        Write your SQL query and submit it for evaluation.
      </AlertDescription>
    </Alert>
  );
}
