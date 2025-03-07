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
import { Insight, learningConcepts } from "./components/Insight"
import { PlanningExecutionInsight } from "./components/PlanningExecutionInsight"
import { NodesInsight } from "./components/NodesInsight"

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
    uniqueNodeTypes: string[]
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
    const nodeTypesSet = new Set<string>();

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
        nodeTypesSet.add(nodeInfo.type);
    }

    // Reverse the edges (swap source and target)
    const reversedEdges = graphEdges.map(edge => ({
        ...edge,
        source: edge.target,
        target: edge.source
    }))
    console.log({graphNodes, reversedEdges})

    const {nodes: layoutedNodes, edges: layoutedEdges} = getLayoutedElements(graphNodes, reversedEdges);

    // Convert the Set of unique node types to an array
    const uniqueNodeTypes = Array.from(nodeTypesSet);

    return {
        nodes,
        planningTime: plan["Planning Time"],
        executionTime: plan["Execution Time"],
        startupTotalCostData,
        actualTimeData,
        graphNodes: layoutedNodes,
        graphEdges: layoutedEdges,
        uniqueNodeTypes,
    }
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

    // Add useEffect to update nodes and edges when props change
    useEffect(() => {
        setNodes(nodes);
        setEdges(edges);
    }, [nodes, edges, setNodes, setEdges]);

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
    const [analyzedPlan, setAnalyzedPlan] = useState<AnalyzedPlan | null>(null)

    useEffect(() => {
        const plan = searchParams.get("plan")
        if (plan) {
            try {
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
        <ResponsiveContainer width="100%" height={400}>
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
                        <PlanningExecutionInsight
                            planningTime={analyzedPlan.planningTime}
                            executionTime={analyzedPlan.executionTime}
                        />
                        <NodesInsight
                            nodes={analyzedPlan.nodes}
                            uniqueNodeTypes={analyzedPlan.uniqueNodeTypes}
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

