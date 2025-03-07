"use client"

import React, { Suspense, lazy } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { LearnItem } from "@/data/learning-path"

interface LearnContentProps {
  item: LearnItem
}

export function LearnContent({ item }: LearnContentProps) {
  const MDXContent = lazy(() => import(`@/markdown/learn/${item.id}.mdx`).catch(() => {
    console.error(`MDX file for ID ${item.id} not found`)
    return { default: () => <p>Content not available.</p> }
  }))

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="prose max-w-none">
          <Suspense fallback={<p>Loading content...</p>}>
            <MDXContent />
          </Suspense>
        </div>
      </CardContent>
    </Card>
  )
} 