"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Mermaid from "@/components/mermaid"
// import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "@/components/ui/chart"

interface QueryPlanNode {
    id: number
    name: string
    startup_cost: number
    total_cost: number
    description: string
    next_id: number | null
}

const sampleData: QueryPlanNode[] = [
    { id: 1, name: "hash_join", startup_cost: 1, total_cost: 2, description: "large", next_id: 2 },
    { id: 2, name: "left_join", startup_cost: 1, total_cost: 2, description: "large", next_id: 3 },
    { id: 3, name: "right_join", startup_cost: 1, total_cost: 2, description: "large", next_id: null },
]

export function QueryPlanVisualizer({ queryPlan }: { queryPlan: string }) {
    // const [selectedNode, setSelectedNode] = useState<QueryPlanNode | null>(null)

    if (!queryPlan) {
        return (
            <div className="h-full flex items-center justify-center">
                <p className="text-gray-500">Please provide a query plan to analyze.</p>
            </div>
        )
    }

    const mermaidDefinition = `
    graph TD
    ${sampleData.map((node) => `${node.id}[${node.name}]`).join("\n")}
    ${sampleData
        .filter((node) => node.next_id)
        .map((node) => `${node.id} --> ${node.next_id}`)
        .join("\n")}
    click ${sampleData.map((node) => node.id).join(" ")} callback
  `

    return (
        <ScrollArea className="h-full">
            <div className="p-4 space-y-8">
                <section>
                    <h2 className="text-2xl font-semibold mb-4">Query Plan Nodes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {sampleData.map((node) => (
                            <Dialog key={node.id}>
                                <DialogTrigger asChild>
                                    <Card className="cursor-pointer hover:bg-gray-100">
                                        <CardHeader>
                                            <CardTitle>{node.name}</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-gray-500">{node.description}</p>
                                        </CardContent>
                                    </Card>
                                </DialogTrigger>
                                <DialogContent>
                                    <DialogHeader>
                                        <DialogTitle>{node.name}</DialogTitle>
                                    </DialogHeader>
                                    <div>
                                        <p>
                                            <strong>Description:</strong> {node.description}
                                        </p>
                                        <p>
                                            <strong>Startup Cost:</strong> {node.startup_cost}
                                        </p>
                                        <p>
                                            <strong>Total Cost:</strong> {node.total_cost}
                                        </p>
                                    </div>
                                </DialogContent>
                            </Dialog>
                        ))}
                    </div>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-4">Query Plan Diagram</h2>
                    <Mermaid
                        chart={mermaidDefinition}
                        config={{
                            startOnLoad: true,
                            securityLevel: "loose",
                            flowchart: { useMaxWidth: true },
                        }}
                    />
                </section>

                {/*<section>*/}
                {/*    <h2 className="text-2xl font-semibold mb-4">Query Plan Costs</h2>*/}
                {/*    <ResponsiveContainer width="100%" height={300}>*/}
                {/*        <BarChart data={sampleData}>*/}
                {/*            <XAxis dataKey="name" />*/}
                {/*            <YAxis />*/}
                {/*            <Bar dataKey="startup_cost" stackId="a" fill="#8884d8" name="Startup Cost" />*/}
                {/*            <Bar dataKey="total_cost" stackId="a" fill="#82ca9d" name="Total Cost" />*/}
                {/*        </BarChart>*/}
                {/*    </ResponsiveContainer>*/}
                {/*</section>*/}
            </div>
        </ScrollArea>
    )
}

