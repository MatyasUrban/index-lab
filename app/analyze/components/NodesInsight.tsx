import React, { useState } from "react";
import {
  ChevronUp,
  Database,
  MousePointerClick,
  Repeat,
  Info,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Insight } from "./Insight";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type NodeInfo = {
  id: number;
  type: string;
  relation: string;
  index: string;
  loops: number;
  children: number[];
  details: Record<string, any>;
};

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
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/3 sticky top-0 bg-background z-10">
                  Property
                </TableHead>
                <TableHead className="sticky top-0 bg-background z-10">
                  Value
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(node.details).map(([key, value]) => (
                <TableRow key={key}>
                  <TableCell className="font-medium">{key}</TableCell>
                  <TableCell>
                    {typeof value === "object"
                      ? JSON.stringify(value)
                      : String(value)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
              <Badge
                variant="outline"
                className="bg-black text-gray-200 border-black"
              >
                Node {node.id}
              </Badge>
              <Badge
                variant="outline"
                className="flex items-center gap-1 bg-indigo-100 dark:bg-indigo-900 text-indigo-900 dark:text-indigo-100 border-indigo-100 dark:border-indigo-900"
              >
                <Repeat className="h-3 w-3" />
                <span className="text-xs font-medium">{node.loops}</span>
              </Badge>
            </div>
            <NodeDetailsDialog node={node} />
          </div>
          <h3 className="text-lg font-semibold">{node.type}</h3>
          <div className="min-h-6 text-sm mt-1">
            {node.relation && (
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span>{node.relation}</span>
              </div>
            )}
          </div>
          <div className="min-h-6 text-sm mt-1 mb-2">
            {node.index && (
              <div className="flex items-center gap-2">
                <MousePointerClick className="h-4 w-4" />
                <span>{node.index}</span>
              </div>
            )}
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
      description="This insight showcases all the nodes that contributed to producing your query result, displayed in structured boxes. Node 0 is the final node that returns the output. Each node includes (1) The node ID, (2) number of loops (how many times the node was executed), and (3) an info icon that reveals full details when clicked. (4) In the bottom, child nodes are listed, dependecies that the current node had to wait for before being able to pruduce any rows. (5) Hovering over a node highlights its parent, showing which node consumes its results."
      learnings={uniqueNodeTypes}
      content={nodesContent}
    />
  );
}
