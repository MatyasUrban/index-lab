"use client";

import type React from "react";

import { useState, useEffect, Suspense } from "react";
import { AlertCircle } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { PlanningExecutionInsight } from "./components/PlanningExecutionInsight";
import { NodesInsight } from "./components/NodesInsight";
import { FlowInsight } from "./components/FlowInsight";
import { CostInsight } from "./components/CostInsight";

type NodeInfo = {
  id: number;
  type: string;
  relation: string;
  index: string;
  loops: number;
  children: number[];
  details: Record<string, any>;
};

type GraphNode = {
  id: string;
  data: { label: string };
  position: { x: number; y: number };
};

type GraphEdge = {
  id: string;
  source: string;
  target: string;
  animated: boolean;
};

type AnalyzedPlan = {
  nodes: NodeInfo[];
  planningTime: number;
  executionTime: number;
  startupTotalCostData: costData[];
  actualTimeData: costData[];
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
  uniqueNodeTypes: string[];
};

type costData = { node: string; startupCost: number; totalCost: number };

function analyzePlan(plan: any): AnalyzedPlan {
  let nextId = 0;
  const nodes: NodeInfo[] = [];
  const queue: [any, number, number[]][] = [[plan.Plan, nextId++, []]];
  const startupTotalCostData: costData[] = [];
  const actualTimeData: costData[] = [];
  const graphNodes: AnalyzedPlan["graphNodes"] = [];
  const graphEdges: AnalyzedPlan["graphEdges"] = [];
  const position = { x: 0, y: 0 };
  const animated = true;
  const nodeTypesSet = new Set<string>();

  while (queue.length > 0) {
    const [node, id, parentChildren] = queue.shift()!;

    const nodeInfo: NodeInfo = {
      id,
      type: node["Node Type"],
      relation: "Relation Name" in node ? node["Relation Name"] : "",
      index: "Index Name" in node ? node["Index Name"] : "",
      loops: "Actual Loops" in node ? node["Actual Loops"] : 0,
      children: [],
      details: { ...node },
    };

    // Construct the label based on the specified format
    let label = `Node ${id} | ${nodeInfo.type}`;
    if (nodeInfo.type.toLowerCase().includes("only")) {
      label += ` on ${nodeInfo.index}`;
    } else {
      if (nodeInfo.relation) {
        label += ` on ${nodeInfo.relation}`;
      }
      if (nodeInfo.index) {
        label += ` using ${nodeInfo.index}`;
      }
    }

    delete nodeInfo.details["Plans"];
    nodes.push(nodeInfo);

    parentChildren.push(id);

    startupTotalCostData.push({
      node: id.toString(),
      startupCost: node["Startup Cost"],
      totalCost: node["Total Cost"],
    });
    actualTimeData.push({
      node: id.toString(),
      startupCost: node["Actual Startup Time"],
      totalCost: node["Actual Total Time"],
    });

    if (node.Plans) {
      for (const childPlan of node.Plans) {
        const childId = nextId++;
        // Add edge from current node to child
        graphEdges.push({
          id: `e${id}${childId}`,
          source: id.toString(),
          target: childId.toString(),
          animated,
        });
        queue.push([childPlan, childId, nodes[id].children]);
      }
    }
    graphNodes.push({
      id: id.toString(),
      data: { label },
      position,
    });
    nodeTypesSet.add(nodeInfo.type);
  }

  const reversedEdges = graphEdges.map((edge) => ({
    ...edge,
    source: edge.target,
    target: edge.source,
  }));
  console.log({ graphNodes, reversedEdges });

  const uniqueNodeTypes = Array.from(nodeTypesSet);

  return {
    nodes,
    planningTime: plan["Planning Time"],
    executionTime: plan["Execution Time"],
    startupTotalCostData,
    actualTimeData,
    graphNodes,
    graphEdges: reversedEdges,
    uniqueNodeTypes,
  };
}

function AnalyzeContent() {
  const searchParams = useSearchParams();
  const [planInput, setPlanInput] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [analyzedPlan, setAnalyzedPlan] = useState<AnalyzedPlan | null>(null);

  useEffect(() => {
    const plan = searchParams.get("plan");

    if (plan) {
      try {
        // Decode using base64 only
        const decodedPlan = atob(plan);
        console.log("Decoded from base64:", decodedPlan);

        // Parse the JSON
        JSON.parse(decodedPlan); // Validate JSON
        setPlanInput(decodedPlan);
      } catch (err) {
        console.error("Error handling plan:", err);
        setError("Invalid data format. Please check the execution plan.");
      }
    }
  }, [searchParams]);

  const handleDigestPlan = () => {
    setError(null);
    setAnalyzedPlan(null);

    try {
      if (!planInput.trim()) {
        setError("Please enter a PostgreSQL execution plan");
        return;
      }

      const parsed = JSON.parse(planInput);
      if (!Array.isArray(parsed) || parsed.length === 0) {
        setError("Input must be a valid PostgreSQL execution plan JSON array");
        return;
      }

      const analyzed = analyzePlan(parsed[0]);
      setAnalyzedPlan(analyzed);
    } catch (err) {
      setError(
        "Invalid JSON format or execution plan structure. Please check your input.",
      );
    }
  };

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
            <FlowInsight
              graphNodes={analyzedPlan.graphNodes}
              graphEdges={analyzedPlan.graphEdges}
            />
            <CostInsight
              title="Expected Node Startup & Total Cost"
              description="This insight helps you understand the cost distribution across different nodes in your query execution plan. By comparing startup and total costs, you can identify potential bottlenecks and optimization opportunities."
              data={analyzedPlan.startupTotalCostData}
            />
            <CostInsight
              title="Actual Node Startup & Total Time (in ms)"
              description="This insight helps you understand the actual time distribution across different nodes in your query execution plan. By comparing startup and total times, you can identify real bottlenecks in your query execution."
              data={analyzedPlan.actualTimeData}
              total={true}
            />
          </div>
        )}

        {!error && !analyzedPlan && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-muted-foreground">
              <p>
                Click &quot;Digest Plan&quot; to generate insights from your
                execution plan
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AnalyzeContent />
    </Suspense>
  );
}
