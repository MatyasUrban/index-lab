"use client"

import { useRouter } from "next/navigation"
import { type LearningItem, learningPath } from "@/data/learning-path"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Suspense, lazy, useState, useRef } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, Loader2, Database } from "lucide-react"
import { ResultType } from "@/app/types/sql-practice"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PracticeInfo } from "./PracticeInfo"
import { PracticePlanButtons } from "./PracticePlanButtons"
import { PracticeResultCardTable } from "./PracticeResultCardTable"
import { PracticeResultExecutionTimes } from "./PracticeResultExecutionTimes"
import { PracticeResultSummary } from "./PracticeResultSummary"
import { PracticeResultDisplay } from "./PracticeResultDisplay"
import { PracticeInputComponent } from "./PracticeInputComponent"
import { PracticeImplementation } from "./PracticeImplementation"

interface LearningDetailProps {
    currentItemId: number
}

export function LearningDetail({ currentItemId }: LearningDetailProps) {
    const router = useRouter()
    const currentIndex = learningPath.findIndex((item) => item.id === currentItemId)
    const currentItem = learningPath[currentIndex]
    const previousItem = currentIndex > 0 ? learningPath[currentIndex - 1] : null
    const nextItem = currentIndex < learningPath.length - 1 ? learningPath[currentIndex + 1] : null

    // State declarations
    const [activeTab, setActiveTab] = useState<string>("learn")
    const [result, setResult] = useState<ResultType | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [showHint, setShowHint] = useState<boolean>(false)
    const [showSolution, setShowSolution] = useState<boolean>(false)
    const [showPlanDialog, setShowPlanDialog] = useState<boolean>(false)
    const [progress, setProgress] = useState<{ value: number; message: string } | null>(null)

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

            <div className="mb-8">
                {currentItem.type === "learn" ? (
                    <LearnContent item={currentItem} />
                ) : (
                    <SQLPracticePage item={currentItem} />
                )}
            </div>
        </div>
    )
}

function LearnContent({ item }: { item: LearningItem & { type: "learn" } }) {
    // Dynamically import MDX file based on the item ID
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

interface SQLPracticePageProps {
  item: LearningItem & { type: "practice" }
}

export default function SQLPracticePage({ item }: SQLPracticePageProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-background">
      {/* Left Column - Practice Info */}
      <PracticeInfo item={item} />

      {/* Right Column - Practice Implementation */}
      <PracticeImplementation item={item} />
    </div>
  )
}

