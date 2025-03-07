import React, { useState } from "react";
import { ChevronUp, Database, MousePointerClick, Repeat, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Insight } from "./Insight";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type NodeInfo = {
    id: number
    type: string
    relation: string
    index: string
    loops: number
    children: number[]
    details: Record<string, any>
}

type NodesInsightProps = {
    nodes: NodeInfo[];
    uniqueNodeTypes: string[];
};

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
                        Node {node.id}: {node.type}
                    </DialogTitle>
                    <DialogDescription>
                        Detailed information about this node in the query plan
                    </DialogDescription>
                </DialogHeader>
                <div className="overflow-auto flex-1">
                    <pre className="text-xs p-4 bg-gray-100 dark:bg-gray-800 rounded-md overflow-auto">
                        {JSON.stringify(node.details, null, 2)}
                    </pre>
                </div>
            </DialogContent>
        </Dialog>
    );
}

export function NodesInsight({ nodes, uniqueNodeTypes }: NodesInsightProps) {
    const [hoveredNodeId, setHoveredNodeId] = useState<number | null>(null);
    
    const nodesContent = (
        <div className="flex flex-wrap gap-4">
            {nodes.map((node) => (
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
    );

    return (
        <Insight
            title="Query Plan Nodes"
            description="These nodes represent the steps taken to execute your query. Understanding the node types and their relationships can help you optimize your query structure and indexing strategy."
            learnings={uniqueNodeTypes}
            content={nodesContent}
        />
    );
} 