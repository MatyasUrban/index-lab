"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PracticeExecutionPlanProps {
  usersPlan: string | undefined;
  usersExplain: string | undefined;
}

export function PracticePlanButtons({
  usersPlan,
  usersExplain,
}: PracticeExecutionPlanProps) {
  const [showPlan, setShowPlan] = useState(false);

  return (
    <div className="flex gap-2 mt-4 w-full">
      <Button className="w-1/2" onClick={() => setShowPlan(true)}>
        Read your execution plan
      </Button>

      <Button
        className="w-1/2"
        onClick={() => {
          if (usersPlan) {
            console.log("Original usersPlan:", usersPlan);
            const stringified = JSON.stringify(usersPlan);
            console.log("After stringify:", stringified);

            const base64Plan = btoa(stringified);
            window.open(`/analyze?plan=${base64Plan}`, "_blank");
          }
        }}
        disabled={!usersPlan}
      >
        Analyze your execution plan
      </Button>

      {/* Query Execution Plan Dialog */}
      <Dialog open={showPlan} onOpenChange={setShowPlan}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-[90vw] h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Query Execution Plan</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <div className="border p-4 rounded-md bg-white">
              <pre className="text-xs overflow-auto whitespace-pre-wrap">
                {usersExplain}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
