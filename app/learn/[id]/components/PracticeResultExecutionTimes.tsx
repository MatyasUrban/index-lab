"use client";

import React from "react";

interface PracticeResultExecutionTimesProps {
  userTime?: number;
  referenceTime?: number;
}

export function PracticeResultExecutionTimes({
  userTime = 0,
  referenceTime = 0,
}: PracticeResultExecutionTimesProps) {
  // Calculate the maximum time for scaling the bars
  const maxTime = Math.max(userTime, referenceTime);

  return (
    <div className="mt-4">
      <h4 className="text-sm font-medium mb-2">Execution time</h4>
      <div className="grid grid-cols-2 gap-4 w-full max-w-[300px] mx-auto">
        <div className="h-32 flex items-end justify-center">
          <div
            className="w-16 bg-blue-500"
            style={{
              height: `${(userTime / maxTime) * 100}%`,
            }}
          ></div>
        </div>
        <div className="h-32 flex items-end justify-center">
          <div
            className="w-16 bg-blue-500"
            style={{
              height: `${(referenceTime / maxTime) * 100}%`,
            }}
          ></div>
        </div>
        <div className="text-center">
          <p className="font-bold">{userTime.toFixed(3)}ms</p>
          <p className="text-sm">Your solution</p>
        </div>
        <div className="text-center">
          <p className="font-bold">{referenceTime.toFixed(3)}ms</p>
          <p className="text-sm">Reference solution</p>
        </div>
      </div>
    </div>
  );
}
