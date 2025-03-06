"use client"

import React from 'react'
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResultType } from "@/app/types/sql-practice"
import { PracticeResultSummary } from "./PracticeResultSummary"
import { PracticeResultExecutionTimes } from "./PracticeResultExecutionTimes"
import { PracticePlanButtons } from "./PracticePlanButtons"
import { PracticeResultCardTable } from "./PracticeResultCardTable"

interface PracticeResultCardProps {
  result: ResultType
  className?: string
}

export function PracticeResultCard({ 
  result,
  className = ""
}: PracticeResultCardProps) {
  return (
    <Card className={`mt-4 ${className}`}>
      <Tabs defaultValue="evaluation">
        <TabsList className="w-full grid grid-cols-3">
          <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
          <TabsTrigger value="expected">Expected Recordset</TabsTrigger>
          <TabsTrigger value="received">Received Recordset</TabsTrigger>
        </TabsList>

        {/* Evaluation Tab */}
        <TabsContent value="evaluation" className="p-4">
          <div className="flex flex-col gap-4">
            <PracticeResultSummary 
              isCorrect={result.correct} 
              isPerformant={result.performant} 
            />

            {result.correct && result.usersTime !== undefined && result.referenceTime !== undefined && (
              <PracticeResultExecutionTimes 
                userTime={result.usersTime} 
                referenceTime={result.referenceTime} 
              />
            )}
            <PracticePlanButtons usersPlan={result?.usersPlan} />
          </div>
        </TabsContent>

        {/* Expected Recordset Tab */}
        <TabsContent value="expected">
          <PracticeResultCardTable 
            rows={result.referenceRows || []} 
            emptyMessage="No expected results available"
          />
        </TabsContent>

        {/* Received Recordset Tab */}
        <TabsContent value="received">
          <PracticeResultCardTable 
            rows={result.usersRows || []} 
            emptyMessage="No results received from your query"
          />
        </TabsContent>
      </Tabs>
    </Card>
  )
} 