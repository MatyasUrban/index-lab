"use client"

import { Suspense, lazy } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { type LearningItem } from "@/data/learning-path"

interface PracticeDescriptionProps {
  itemId: number
}

export function PracticeDescription({ itemId }: PracticeDescriptionProps) {
  // Dynamically import MDX file based on the item ID
  const MDXContent = lazy(() => import(`@/markdown/learn/${itemId}.mdx`).catch(() => {
    console.error(`MDX file for ID ${itemId} not found`)
    return { default: () => <p>Task description not available.</p> }
  }))

  return (
    <Card className="flex-grow-0">
      <CardHeader>
        <CardTitle>Task</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          <Suspense fallback={<p>Loading task description...</p>}>
            <MDXContent />
          </Suspense>
        </div>
      </CardContent>
    </Card>
  )
} 