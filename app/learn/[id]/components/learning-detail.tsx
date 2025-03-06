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
import { ChevronDown, ChevronUp, CheckCircle2, XCircle, Loader2, Database } from "lucide-react"
import { ResultType } from "@/app/types/sql-practice"
import { Progress } from "@/components/ui/progress"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Database schema data
type ColumnConstraint = "PK" | "FK->employee" | "FK->department" | "-";
type TableColumn = [string, string, ColumnConstraint[]];
type DatabaseSchema = {
    [tableName: string]: TableColumn[];
};

const databaseSchema: DatabaseSchema = {
    "department": [
        ["id", "int", ["PK"]],
        ["dept_name", "varchar(40)", ["-"]]
    ],
    "department_employee": [
        ["employee_id", "int", ["PK", "FK->employee"]],
        ["department_id", "int", ["PK", "FK->department"]],
        ["from_date", "date", ["-"]],
        ["to_date", "date", ["-"]]
    ],
    "department_manager": [
        ["employee_id", "int", ["PK", "FK->employee"]],
        ["department_id", "int", ["PK", "FK->department"]],
        ["from_date", "date", ["-"]],
        ["to_date", "date", ["-"]]
    ],
    "employee": [
        ["id", "int", ["PK"]],
        ["birth_date", "date", ["-"]],
        ["first_name", "varchar(14)", ["-"]],
        ["gender", "enum('M', 'F', 'X')", ["-"]],
        ["hire_date", "date", ["-"]],
        ["last_name", "varchar(16)", ["-"]]
    ],
    "salary": [
        ["employee_id", "int", ["PK", "FK->employee"]],
        ["amount", "int", ["-"]],
        ["from_date", "date", ["PK"]],
        ["to_date", "date", ["-"]]
    ],
    "title": [
        ["employee_id", "int", ["PK", "FK->employee"]],
        ["title", "varchar(50)", ["PK"]],
        ["from_date", "date", ["PK"]],
        ["to_date", "date", ["-"]]
    ]
};

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
    const [query, setQuery] = useState<string>("")
    const [preQuery, setPreQuery] = useState<string>("")
    const [result, setResult] = useState<ResultType | null>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [submitted, setSubmitted] = useState<boolean>(false)
    const [showHint, setShowHint] = useState<boolean>(false)
    const [showSolution, setShowSolution] = useState<boolean>(false)
    const [showPlanDialog, setShowPlanDialog] = useState<boolean>(false)

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
  const [preQuery, setPreQuery] = useState("")
  const [query, setQuery] = useState("")
  const [hintStates, setHintStates] = useState<boolean[]>(Array(item.hints.length).fill(false))
  const [showDiagram, setShowDiagram] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ResultType | null>(null)
  const [showPlan, setShowPlan] = useState(false)
  const [progress, setProgress] = useState<{ value: number; message: string } | null>(null)

  // Dynamically import MDX file based on the item ID
  const MDXContent = lazy(() => import(`@/markdown/learn/${item.id}.mdx`).catch(() => {
    console.error(`MDX file for ID ${item.id} not found`)
    return { default: () => <p>Task description not available.</p> }
  }))

  const toggleHint = (index: number) => {
    setHintStates(prev => {
      const newStates = [...prev]
      newStates[index] = !newStates[index]
      return newStates
    })
  }

  const handleSubmit = async () => {
    setSubmitted(true)
    setLoading(true)
    setResult(null)
    setProgress({ value: 0, message: "Starting evaluation..." })

    try {
      const response = await fetch(`/api/evaluate/${item.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'text/event-stream',
        },
        body: JSON.stringify({
          preparationQuery: preQuery,
          selectQuery: query,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Handle streaming response
      const reader = response.body?.getReader();
      if (!reader) {
        throw new Error('Response body is not readable');
      }

      // Process the stream
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }
        
        // Decode the chunk and add it to our buffer
        buffer += decoder.decode(value, { stream: true });
        
        // Process complete events in the buffer
        const lines = buffer.split('\n\n');
        buffer = lines.pop() || ''; // Keep the last incomplete chunk in the buffer
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const eventData = JSON.parse(line.substring(6));
              
              if (eventData.type === 'error') {
                // Handle error event
                setProgress(null);
                setResult({ error: eventData.message });
                setLoading(false);
              } 
              else if (eventData.type === 'completed' && eventData.progress === 100) {
                // Final result received
                setProgress(null);
                setResult(eventData.result);
                setLoading(false);
              }
              else if (eventData.type === 'progress') {
                // Handle progress updates
                setProgress({ 
                  value: eventData.progress || 0, 
                  message: eventData.message || 'Processing...' 
                });
              }
            } catch (e) {
              console.error('Error parsing event data:', e, line);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error evaluating query:', error);
      setProgress(null);
      setResult({ error: 'Failed to evaluate query. Please try again.' });
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
            <div className="prose max-w-none">
              <Suspense fallback={<p>Loading task description...</p>}>
                <MDXContent />
              </Suspense>
            </div>
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

        {/* Hints */}
        {item.hints.map((hint, index) => (
          <Collapsible 
            key={`hint-${index}`} 
            open={hintStates[index]} 
            onOpenChange={() => toggleHint(index)} 
            className="border rounded-md"
          >
            <CollapsibleTrigger className="flex w-full justify-between items-center p-4 font-medium">
              <span>Hint {index + 1}</span>
              {hintStates[index] ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </CollapsibleTrigger>
            <CollapsibleContent className="p-4 pt-0 border-t">{hint}</CollapsibleContent>
          </Collapsible>
        ))}
      </div>

      {/* Right Column */}
      <div className="flex flex-col gap-4">
        {/* Pre-query Input */}
        <div className="flex flex-col gap-2">
          <label htmlFor="pre-query" className="text-sm font-medium">
            Preparation Query
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
            Select Query
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
          {loading ? (
            <CardContent className="p-6 flex flex-col items-center justify-center min-h-[150px]">
              {progress ? (
                <>
                  <Progress value={progress.value} className="w-full mb-2" />
                  <p className="text-sm text-muted-foreground">{progress.message}</p>
                </>
              ) : (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-8 w-8 animate-spin mb-2" />
                  <p className="text-sm text-muted-foreground">Evaluating your solution...</p>
                </div>
              )}
            </CardContent>
          ) : result?.error ? (
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First 3 tables (left side) */}
              <div className="space-y-6">
                {Object.entries(databaseSchema).slice(0, 3).map(([tableName, columns]) => (
                  <Card key={tableName} className="overflow-hidden">
                    <CardHeader className="bg-slate-50 py-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        {tableName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[30%]">Column</TableHead>
                            <TableHead className="w-[30%]">Type</TableHead>
                            <TableHead className="w-[40%]">Constraints</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {columns.map(([columnName, dataType, constraints], rowIndex) => (
                            <TableRow key={`${tableName}-${columnName}-${rowIndex}`}>
                              <TableCell className="font-medium">{columnName}</TableCell>
                              <TableCell>{dataType}</TableCell>
                              <TableCell>
                                {constraints.map((constraint, i) => 
                                  constraint !== "-" ? (
                                    <Badge key={`${constraint}-${i}`} variant="outline" className="mr-1">
                                      {constraint}
                                    </Badge>
                                  ) : null
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              {/* Next 3 tables (right side) */}
              <div className="space-y-6">
                {Object.entries(databaseSchema).slice(3, 6).map(([tableName, columns]) => (
                  <Card key={tableName} className="overflow-hidden">
                    <CardHeader className="bg-slate-50 py-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Database className="h-4 w-4" />
                        {tableName}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-[30%]">Column</TableHead>
                            <TableHead className="w-[30%]">Type</TableHead>
                            <TableHead className="w-[40%]">Constraints</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {columns.map(([columnName, dataType, constraints], rowIndex) => (
                            <TableRow key={`${tableName}-${columnName}-${rowIndex}`}>
                              <TableCell className="font-medium">{columnName}</TableCell>
                              <TableCell>{dataType}</TableCell>
                              <TableCell>
                                {constraints.map((constraint, i) => 
                                  constraint !== "-" ? (
                                    <Badge key={`${constraint}-${i}`} variant="outline" className="mr-1">
                                      {constraint}
                                    </Badge>
                                  ) : null
                                )}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>
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

