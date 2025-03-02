"use client"

import { useRouter } from "next/navigation"
import { type LearningItem, learningPath } from "@/data/learning-path"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Suspense, lazy } from "react"

// Dynamic imports for MDX content
const MDXComponents = {
    "introduction-to-indexes": lazy(() => import("@/markdown/learn/introduction-to-indexes.mdx")),
    "index-types": lazy(() => import("@/markdown/learn/index-types.mdx")),
    "query-planning": lazy(() => import("@/markdown/learn/query-planning.mdx")),
}

interface LearningDetailProps {
    currentItemId: number
}

export function LearningDetail({ currentItemId }: LearningDetailProps) {
    const router = useRouter()
    const currentIndex = learningPath.findIndex((item) => item.id === currentItemId)
    const currentItem = learningPath[currentIndex]
    const previousItem = currentIndex > 0 ? learningPath[currentIndex - 1] : null
    const nextItem = currentIndex < learningPath.length - 1 ? learningPath[currentIndex + 1] : null

    if (!currentItem) {
        return <div>Item not found</div>
    }

    const handleClose = () => {
        router.push("/learn")
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-bold">{currentItem.title}</h1>
                    <Badge variant={currentItem.type === "learn" ? "default" : "secondary"} className="mt-2">
                        {currentItem.type === "learn" ? "Learn" : "Practice"}
                    </Badge>
                </div>
                <div className="flex space-x-2">
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={!previousItem}
                        onClick={() => previousItem && router.push(`/learn/${previousItem.id}`)}
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="icon"
                        disabled={!nextItem}
                        onClick={() => nextItem && router.push(`/learn/${nextItem.id}`)}
                    >
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={handleClose}>
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            <Card className="mb-8">
                {currentItem.type === "learn" ? <LearnContent item={currentItem} /> : <PracticeContent item={currentItem} />}
            </Card>
        </div>
    )
}

function LearnContent({ item }: { item: LearningItem & { type: "learn" } }) {
    // Check if we have an MDX component for this content
    const MDXContent = item.content in MDXComponents 
        ? MDXComponents[item.content as keyof typeof MDXComponents]
        : null

    return (
        <CardContent className="pt-6">
            <div className="prose max-w-none">
                {MDXContent ? (
                    <Suspense fallback={<p>Loading content...</p>}>
                        <MDXContent />
                    </Suspense>
                ) : (
                    <p>Content for "{item.content}" is not available.</p>
                )}
            </div>
        </CardContent>
    )
}

function PracticeContent({ item }: { item: LearningItem & { type: "practice" } }) {
    return (
        <>
            <CardHeader>
                <CardTitle>Practice Task</CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-gray-700">{item.taskDescription}</p>
            </CardContent>
        </>
    )
} 