"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import {AlertCircle, ChevronUp, Info, Database, MousePointerClick, Repeat} from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { useSearchParams } from "next/navigation"
import ReactFlow, { 
    useNodesState, 
    useEdgesState, 
    addEdge, 
    ConnectionLineType, 
    Background, 
    Panel 
} from 'reactflow'
import dagre from '@dagrejs/dagre'
import 'reactflow/dist/style.css'

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Define types for learning concepts
type LearningConcept = {
    title: string
    description: string
}

type LearningConcepts = {
    [key: string]: LearningConcept
}

// Define learning concepts
const learningConcepts: LearningConcepts = {
    startupCost: {
        title: "Startup Cost",
        description:
          "The estimated cost to get to the first row of output. This includes the cost of initialization and preparation before actual data retrieval begins.",
      },
      totalCost: {
        title: "Total Cost",
        description:
          "The estimated total cost to retrieve all rows. This includes the startup cost plus the cost of processing all rows.",
      },
      planningTime: {
        title: "Planning Time",
        description: "The time taken by the PostgreSQL query planner to generate an execution plan for the query.",
      },
      executionTime: {
        title: "Execution Time",
        description: "The actual time taken to execute the query and retrieve the results.",
      },
      indexOnlyScan: {
        title: "Index Only Scan",
        description:
          "A scan that can retrieve all needed data from the index without accessing the table. This is typically faster than a regular index scan.",
      },
      seqScan: {
        title: "Sequential Scan",
        description:
          "A scan that reads all rows from a table sequentially. This can be slow for large tables if an appropriate index is not used.",
      },
    // Add more concepts as needed
}

type InsightProps = {
    title: string
    description: string
    learnings: string[]
    content: React.ReactNode
}

function Insight({ title, description, learnings, content }: InsightProps) {
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="mb-4">
                    <h4 className="text-sm font-semibold mb-2">Key Concepts:</h4>
                    <div className="flex gap-2 flex-wrap">
                        {learnings.map((concept) => (
                            <Dialog key={concept}>
                                <DialogTrigger asChild>
                                    <Badge variant="secondary" className="cursor-pointer">
                                        <Info className="mr-1 h-3 w-3" />
                                        {learningConcepts[concept].title}
                                    </Badge>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{learningConcepts[concept].title}</DialogTitle>
                                        <DialogDescription>{learningConcepts[concept].description}</DialogDescription>
                                    </DialogHeader>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>
                </div>
                {content}
            </CardContent>
        </Card>
    )
}

type NodeInfo = {
    id: number
    type: string
    relation: string
    index: string
    loops: number
    children: number[]
    details: Record<string, any>
}

type GraphNode = {
    id: string,
    data: { label: string },
    position: { x: number, y: number }
}

type GraphEdge = {
    id: string,
    source: string,
    target: string
    animated: boolean
}

type AnalyzedPlan = {
    nodes: NodeInfo[]
    planningTime: number
    executionTime: number
    startupTotalCostData: costData[],
    actualTimeData: costData[],
    graphNodes: GraphNode[],
    graphEdges: GraphEdge[]
}

type costData = { node: string; startupCost: number; totalCost: number }
  
function analyzePlan(plan: any): AnalyzedPlan {
    let nextId = 0
    const nodes: NodeInfo[] = []
    const queue: [any, number, number[]][] = [[plan.Plan, nextId++, []]]
    const startupTotalCostData: costData[] = []
    const actualTimeData: costData[] = []
    const graphNodes: AnalyzedPlan['graphNodes'] = []
    const graphEdges: AnalyzedPlan['graphEdges'] = []
    const position = { x: 0, y: 0 }
    const animated = true;

    while (queue.length > 0) {
        const [node, id, parentChildren] = queue.shift()!

        const nodeInfo: NodeInfo = {
            id,
            type: node["Node Type"],
            relation: "Relation Name" in node ? node["Relation Name"] : "",
            index: "Index Name" in node ? node["Index Name"] : "",
            loops: "Actual Loops" in node ? node["Actual Loops"] : 0,
            children: [],
            details: { ...node },
        }

        // Construct the label based on the specified format
        let label = `Node ${id} | ${nodeInfo.type}`
        if (nodeInfo.type.toLowerCase().includes('only')) {
            label += ` on ${nodeInfo.index}`
        } else {
            if (nodeInfo.relation) {
                label += ` on ${nodeInfo.relation}`
            }
            if (nodeInfo.index) {
                label += ` using ${nodeInfo.index}`
            }
        }

        delete nodeInfo.details["Plans"]
        nodes.push(nodeInfo)

        parentChildren.push(id)

        startupTotalCostData.push({
            node: id.toString(),
            startupCost: node["Startup Cost"],
            totalCost: node["Total Cost"],
        })
        actualTimeData.push({
            node: id.toString(),
            startupCost: node["Actual Startup Time"],
            totalCost: node["Actual Total Time"],
        })

        if (node.Plans) {
            for (const childPlan of node.Plans) {
                const childId = nextId++
                // Add edge from current node to child
                graphEdges.push({
                    id: `e${id}${childId}`,
                    source: id.toString(),
                    target: childId.toString(),
                    animated
                })
                queue.push([childPlan, childId, nodes[id].children])
            }
        }
        graphNodes.push({
            id: id.toString(),
            data: { label },
            position
        })
    }

    // Reverse the edges (swap source and target)
    const reversedEdges = graphEdges.map(edge => ({
        ...edge,
        source: edge.target,
        target: edge.source
    }))
    console.log({graphNodes, reversedEdges})

    const {nodes: layoutedNodes, edges: layoutedEdges} = getLayoutedElements(graphNodes, reversedEdges);

    return {
        nodes,
        planningTime: plan["Planning Time"],
        executionTime: plan["Execution Time"],
        startupTotalCostData,
        actualTimeData,
        graphNodes: layoutedNodes,
        graphEdges: layoutedEdges,
    }
}

  function NodeDetailsDialog({ node }: { node: NodeInfo }) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="icon">
            <Info className="h-4 w-4" />
            <span className="sr-only">View node details</span>
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>
              Node {node.id} Details: {node.type}
            </DialogTitle>
          </DialogHeader>
          <div className="overflow-auto flex-1">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-1/3 sticky top-0 bg-background z-10">Property</TableHead>
                  <TableHead className="sticky top-0 bg-background z-10">Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(node.details).map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell className="font-medium">{key}</TableCell>
                    <TableCell>{JSON.stringify(value)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

const nodeWidth = 300
const nodeHeight = 100

const getLayoutedElements = (nodes: any[], edges: any[]) => {
    const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}))
    dagreGraph.setGraph({ rankdir: 'TB' })

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight })
    })

    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target)
    })

    dagre.layout(dagreGraph)

    const newNodes = nodes.map((node) => {
        const nodeWithPosition = dagreGraph.node(node.id)
        return {
            ...node,
            targetPosition: 'top',
            sourcePosition: 'bottom',
            position: {
                x: nodeWithPosition.x - nodeWidth / 2,
                y: nodeWithPosition.y - nodeHeight / 2,
            },
        }
    })
    console.log({newNodes, edges})
    return { nodes: newNodes, edges }
}

function DataFlow({ nodes, edges }: { nodes: any[], edges: any[] }) {
    const [flowNodes, setNodes, onNodesChange] = useNodesState(nodes)
    const [flowEdges, setEdges, onEdgesChange] = useEdgesState(edges)

    return (
        <div style={{ width: '100%', height: '500px' }}>
            <ReactFlow
                nodes={flowNodes}
                edges={flowEdges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                connectionLineType={ConnectionLineType.SmoothStep}
                fitView
                style={{ backgroundColor: "#F7F9FB" }}
            >
                <Background />
            </ReactFlow>
        </div>
    )
}

export default function AnalyzePage() {
    const searchParams = useSearchParams()
    const [planInput, setPlanInput] = useState("")
    const [error, setError] = useState<string | null>(null)
    const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null)
    const [analyzedPlan, setAnalyzedPlan] = useState<AnalyzedPlan | null>(null)

    useEffect(() => {
        const plan = searchParams.get("plan")
        if (plan) {
            try {
                // Decode and parse to validate it's proper JSON
                const decodedPlan = decodeURIComponent(plan)
                JSON.parse(decodedPlan) // Validate JSON
                setPlanInput(decodedPlan)
            } catch (err) {
                setError("Invalid JSON in URL parameter")
            }
        }
    }, [searchParams])

    const handleDigestPlan = () => {
        setError(null)
        setAnalyzedPlan(null)

        try {
            if (!planInput.trim()) {
                setError("Please enter a PostgreSQL execution plan")
                return
            }

            const parsed = JSON.parse(planInput)
            if (!Array.isArray(parsed) || parsed.length === 0) {
                setError("Input must be a valid PostgreSQL execution plan JSON array")
                return
            }

            const analyzed = analyzePlan(parsed[0])
            setAnalyzedPlan(analyzed)
        } catch (err) {
            setError("Invalid JSON format or execution plan structure. Please check your input.")
        }
    }

    const nodeExpectedCostAnalysisContent = analyzedPlan && (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyzedPlan.startupTotalCostData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="node" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="startupCost" stackId="a" fill="hsl(var(--chart-1))" />
                <Bar dataKey="totalCost" stackId="a" fill="hsl(var(--chart-2))" />
            </BarChart>
        </ResponsiveContainer>
    )

    const nodeActualTimeAnalysisContent = analyzedPlan && (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={analyzedPlan.actualTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="node" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="startupCost" stackId="a" fill="hsl(var(--chart-1))" />
                <Bar dataKey="totalCost" stackId="a" fill="hsl(var(--chart-2))" />
            </BarChart>
        </ResponsiveContainer>
    )

    const planningExecutionTimeContent = analyzedPlan && (
        <div className="flex gap-4">
            <div className="flex-1 bg-blue-100 dark:bg-blue-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Planning Time</h3>
                <p className="text-3xl font-bold">{analyzedPlan.planningTime.toFixed(3)} ms</p>
            </div>
            <div className="flex-1 bg-green-100 dark:bg-green-900 p-4 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Execution Time</h3>
                <p className="text-3xl font-bold">{analyzedPlan.executionTime.toFixed(3)} ms</p>
            </div>
        </div>
    )

    const nodesContent = analyzedPlan && (
        <div className="flex flex-wrap gap-4">
            {analyzedPlan.nodes.map((node) => (
                <div
                    key={node.id}
                    className={`bg-gray-100 dark:bg-gray-800 p-4 rounded-lg flex flex-col transition-all duration-200 ${
                        hoveredNodeId === node.id
                            ? "outline outline-4 outline-pink-500"
                            : hoveredNodeId !== null && node.children.includes(hoveredNodeId)
                                ? "bg-pink-200 dark:bg-pink-800"
                                : ""
                    }`}
                    onMouseEnter={() => setHoveredNodeId(node.id)}
                    onMouseLeave={() => setHoveredNodeId(null)}
                >
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-black text-gray-200 border-black">
                                Node {node.id}
                            </Badge>
                            <Badge variant="outline" className="flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 border-indigo-100 dark:border-indigo-900">
                                <Repeat className="h-3 w-3" />
                                <span className="text-xs font-medium">{node.loops}</span>
                            </Badge>
                        </div>
                        <NodeDetailsDialog node={node} />
                    </div>
                    <h3 className="text-lg font-semibold">{node.type}</h3>
                    <div className="min-h-6 text-sm mt-1">
                        {node.relation && <div className="flex items-center gap-2"><Database className="h-4 w-4" /><span>{node.relation}</span></div>}
                    </div>
                    <div className="min-h-6 text-sm mt-1 mb-2">
                        {node.index && <div className="flex items-center gap-2"><MousePointerClick className="h-4 w-4" /><span>{node.index}</span></div>}
                    </div>
                    {node.children.length > 0 && (
                        <div className="flex gap-2 mt-auto">
                            <ChevronUp className="h-4 w-4 mr-1" />
                            {node.children.map((childId) => (
                                <Badge
                                    key={childId}
                                    variant="outline"
                                    className={`transition-all duration-200`}
                                >
                                    Node {childId}
                                </Badge>
                            ))}
                        </div>
                    )}
                </div>
            ))}
        </div>
    )

    const dataFlowContent = analyzedPlan && (
        <DataFlow nodes={analyzedPlan.graphNodes} edges={analyzedPlan.graphEdges} />
    )

    return (
        <div className="flex flex-col md:flex-row">
            <div className="w-full md:w-1/5 p-4 bg-background">
                <div className="flex flex-col space-y-4">
                    <div className="border rounded-md p-1">
                        <Textarea
                            placeholder="Paste the result of your 'explain (analyze, format json)' here..."
                            value={planInput}
                            onChange={(e) => setPlanInput(e.target.value)}
                            className="resize-none font-mono text-sm h-64 border-0 focus-visible:ring-0 p-2"
                        />
                        <div className="border-t p-2">
                            <Button onClick={handleDigestPlan} className="w-full">
                                Digest Plan
                            </Button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full md:w-4/5 p-4 overflow-auto">
                {error && (
                    <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {analyzedPlan && (
                    <div className="space-y-4">
                        <Insight
                            title="Planning and Execution Time"
                            description="Understanding the time spent on planning versus execution can help you optimize your queries and database structure."
                            learnings={["planningTime", "executionTime"]}
                            content={planningExecutionTimeContent}
                        />
                        <Insight
                            title="Query Plan Nodes"
                            description="These nodes represent the steps taken to execute your query. Understanding the node types and their relationships can help you optimize your query structure and indexing strategy."
                            learnings={["indexOnlyScan", "seqScan"]}
                            content={nodesContent}
                        />
                        <Insight
                            title="Data Flow"
                            description="Visual representation of how data flows through different nodes in your query execution plan. This helps understand the relationships and dependencies between different operations."
                            learnings={["indexOnlyScan", "seqScan"]}
                            content={dataFlowContent}
                        />
                        <Insight
                            title="Expected Node Startup & Total Cost"
                            description="This insight helps you understand the cost distribution across different nodes in your query execution plan. By comparing startup and total costs, you can identify potential bottlenecks and optimization opportunities."
                            learnings={["startupCost", "totalCost"]}
                            content={nodeExpectedCostAnalysisContent}
                        />
                        <Insight
                            title="Actual Node Startup & Total Time (in ms)"
                            description="This insight helps you understand the cost distribution across different nodes in your query execution plan. By comparing startup and total costs, you can identify potential bottlenecks and optimization opportunities."
                            learnings={["startupCost", "totalCost"]}
                            content={nodeActualTimeAnalysisContent}
                        />
                    </div>
                )}

                {!error && !analyzedPlan && (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center text-muted-foreground">
                            <p>Click "Digest Plan" to generate insights from your execution plan</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

