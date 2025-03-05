"use client"

import { useRouter } from "next/navigation"
import { type LearningItem, learningPath } from "@/data/learning-path"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Suspense, lazy, useState } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { ResultType } from "@/app/types/sql-practice"

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
    // Check if we have an MDX component for this content
    const MDXContent = item.content in MDXComponents 
        ? MDXComponents[item.content as keyof typeof MDXComponents]
        : null

    return (
        <Card>
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
        </Card>
    )
}

interface SQLPracticePageProps {
  item: LearningItem & { type: "practice" }
}

export default function SQLPracticePage({ item }: SQLPracticePageProps) {
  const [preQuery, setPreQuery] = useState("")
  const [query, setQuery] = useState("")
  const [showDiagram, setShowDiagram] = useState(false)
  const [hint1Open, setHint1Open] = useState(false)
  const [hint2Open, setHint2Open] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResultType | null>(null)
  const [showPlan, setShowPlan] = useState(false)

  // Use the task description from the item prop
  const taskDescription = item.taskDescription
  // Example hints - replace with your actual content from the item if available
  const hint1 = "You'll need to use a subquery to calculate the average salary."
  const hint2 = "Consider using the AVG() function within a WHERE clause."

  const handleSubmit = async () => {
    setSubmitted(true)
    setLoading(true)

    try {
      const response = await fetch(`/api/evaluate/${item.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          preparationQuery: preQuery,
          selectQuery: query,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error evaluating query:', error);
      setResult({ error: 'Failed to evaluate query. Please try again.' });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-background">
      {/* Left Column */}
      <div className="flex flex-col gap-4">
        {/* Task Description Card */}
        <Card className="flex-grow-0">
          <CardHeader>
            <CardTitle>Task</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{taskDescription}</p>
          </CardContent>
        </Card>

        {/* Diagram Button */}
        <Button
          variant="outline"
          className="w-full bg-white text-primary hover:bg-gray-100"
          onClick={() => setShowDiagram(true)}
        >
          View Database Schema
        </Button>

        {/* Hint 1 */}
        <Collapsible open={hint1Open} onOpenChange={setHint1Open} className="border rounded-md">
          <CollapsibleTrigger className="flex w-full justify-between items-center p-4 font-medium">
            <span>Hint 1</span>
            {hint1Open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 pt-0 border-t">{hint1}</CollapsibleContent>
        </Collapsible>

        {/* Hint 2 */}
        <Collapsible open={hint2Open} onOpenChange={setHint2Open} className="border rounded-md">
          <CollapsibleTrigger className="flex w-full justify-between items-center p-4 font-medium">
            <span>Hint 2</span>
            {hint2Open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </CollapsibleTrigger>
          <CollapsibleContent className="p-4 pt-0 border-t">{hint2}</CollapsibleContent>
        </Collapsible>
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-4">
        {/* Pre-query Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="pre-query" className="text-sm font-medium">
            Pre-query
          </label>
          <Input
            id="pre-query"
            value={preQuery}
            onChange={(e) => setPreQuery(e.target.value)}
            placeholder="Optional: CREATE INDEX..."
            className="font-mono"
          />
        </div>

        {/* Query Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="query" className="text-sm font-medium">
            SQL Query
          </label>
          <div className="relative">
            <Textarea
              id="query"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="SELECT * FROM employees WHERE..."
              className="font-mono resize-none h-32 pr-28"
            />
            <Button 
              disabled={!query.trim() || loading} 
              className="font-medium absolute bottom-2 right-2" 
              onClick={handleSubmit}
              size="sm"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Evaluating...
                </>
              ) : (
                "Evaluate"
              )}
            </Button>
          </div>
        </div>

        {/* Results Card */}
        <Card className={`mt-4 relative ${result?.error ? "bg-red-600 text-white" : ""}`}>
          {loading && (
            <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          )}
          {result?.error ? (
            <CardContent className="p-6">
              <p className="font-mono">{result.error}</p>
            </CardContent>
          ) : submitted && result ? (
            <Tabs defaultValue="evaluation">
              <TabsList className="w-full grid grid-cols-3">
                <TabsTrigger value="evaluation">Evaluation</TabsTrigger>
                <TabsTrigger value="expected">Expected Recordset</TabsTrigger>
                <TabsTrigger value="received">Received Recordset</TabsTrigger>
              </TabsList>

              {/* Evaluation Tab */}
              <TabsContent value="evaluation" className="p-4">
                <div className="flex flex-col gap-4">
                  <div className="flex justify-center">
                    <Badge className={result.correct && result.performant ? "bg-green-600" : "bg-red-600"}>
                      {result.correct && result.performant ? "Passed" : "Failed"}
                    </Badge>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    {result.correct ? (
                      <CheckCircle2 className="text-green-600" size={20} />
                    ) : (
                      <XCircle className="text-red-600" size={20} />
                    )}
                    <span>Query returned {result.correct ? "expected" : "unexpected"} data</span>
                  </div>

                  {result.correct && (
                    <div className="flex items-center gap-2">
                      {result.performant ? (
                        <CheckCircle2 className="text-green-600" size={20} />
                      ) : (
                        <XCircle className="text-red-600" size={20} />
                      )}
                      <span>Query performance is {result.performant ? "sufficient" : "insufficient"}</span>
                    </div>
                  )}

                  {result.correct && result.usersTime !== undefined && result.referenceTime !== undefined && (
                    <div className="mt-4">
                      <h4 className="text-sm font-medium mb-2">Execution time</h4>
                      <div className="grid grid-cols-2 gap-4 w-full max-w-[300px] mx-auto">
                        {/* Bar graphs */}
                        <div className="h-32 flex items-end justify-center">
                          <div
                            className="w-16 bg-blue-500"
                            style={{
                              height: `${(result.usersTime / Math.max(result.usersTime, result.referenceTime)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        <div className="h-32 flex items-end justify-center">
                          <div
                            className="w-16 bg-blue-500"
                            style={{
                              height: `${(result.referenceTime / Math.max(result.usersTime, result.referenceTime)) * 100}%`,
                            }}
                          ></div>
                        </div>
                        {/* Labels */}
                        <div className="text-center">
                          <p className="font-bold">{result.usersTime.toFixed(3)}ms</p>
                          <p className="text-sm">Your solution</p>
                        </div>
                        <div className="text-center">
                          <p className="font-bold">{result.referenceTime.toFixed(3)}ms</p>
                          <p className="text-sm">Reference solution</p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <Button className="w-1/2" onClick={() => setShowPlan(true)}>
                      Read your execution plan
                    </Button>
                    <Button 
                      className="w-1/2" 
                      onClick={() => {
                        if (result?.usersPlan) {
                          const planJson = encodeURIComponent(JSON.stringify(result.usersPlan));
                          window.open(`/analyze?plan=${planJson}`, '_blank');
                        }
                      }}
                    >
                      Analyze your execution plan
                    </Button>
                  </div>
                </div>
              </TabsContent>

              {/* Expected Recordset Tab */}
              <TabsContent value="expected">
                <div className="max-h-[400px] overflow-auto border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        {result.referenceSet &&
                          result.referenceSet.length > 0 &&
                          Object.keys(result.referenceSet[0]).map((key) => (
                            <th
                              key={key}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {key}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {result.referenceSet &&
                        result.referenceSet.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {Object.values(row).map((value, valueIndex) => (
                              <td key={valueIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>

              {/* Received Recordset Tab */}
              <TabsContent value="received">
                <div className="max-h-[400px] overflow-auto border rounded-md">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        {result.usersSet &&
                          result.usersSet.length > 0 &&
                          Object.keys(result.usersSet[0]).map((key) => (
                            <th
                              key={key}
                              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                            >
                              {key}
                            </th>
                          ))}
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {result.usersSet &&
                        result.usersSet.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {Object.values(row).map((value, valueIndex) => (
                              <td key={valueIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {String(value)}
                              </td>
                            ))}
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <CardContent className="p-6 text-center text-gray-500">Submit your solution to see result</CardContent>
          )}
        </Card>
      </div>

      {/* Schema Diagram Dialog */}
      <Dialog open={showDiagram} onOpenChange={setShowDiagram}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-[90vw] h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Database Schema</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <div className="border p-4 rounded-md bg-white">
              {/* Mermaid diagram would be rendered here */}
              <pre className="text-xs overflow-auto">
                {`
graph TD;
  "employees" --> "id:int"
  "employees" --> "name:varchar"
  "employees" --> "department_id:int"
  "employees" --> "salary:decimal"
  "employees" --> "hire_date:date"
  
  "departments" --> "id:int"
  "departments" --> "name:varchar"
  "departments" --> "location:varchar"
  
  "employees" -.-> "departments"
                `}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Query Execution Plan Dialog */}
      <Dialog open={showPlan} onOpenChange={setShowPlan}>
        <DialogContent className="max-w-[90vw] max-h-[90vh] w-[90vw] h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle>Query Execution Plan</DialogTitle>
          </DialogHeader>
          <div className="p-4">
            <div className="border p-4 rounded-md bg-white">
              <pre className="text-xs overflow-auto whitespace-pre-wrap">
                {result?.usersPlan ? JSON.stringify(result.usersPlan, null, 2) : 'No plan available'}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

