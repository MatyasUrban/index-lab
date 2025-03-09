import React, { useEffect, useMemo } from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  ConnectionLineType,
  Background,
} from "reactflow";
import "reactflow/dist/style.css";
import dagre from "@dagrejs/dagre";
import { Insight } from "./Insight";

const nodeWidth = 300;
const nodeHeight = 100;

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

type FlowInsightProps = {
  graphNodes: GraphNode[];
  graphEdges: GraphEdge[];
};

// Update the layout calculation function to use the constants
const getLayoutedElements = (nodes: any[], edges: any[]) => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: "TB" });

  nodes.forEach((node: any) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge: any) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  const layoutedNodes = nodes.map((node: any) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      targetPosition: "top",
      sourcePosition: "bottom",
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export function FlowInsight({ graphNodes, graphEdges }: FlowInsightProps) {
  // Use useMemo to only recalculate when graphNodes or graphEdges change
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(graphNodes, graphEdges),
    [graphNodes, graphEdges],
  );

  const [flowNodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [flowEdges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  // Update nodes and edges when layoutedNodes or layoutedEdges change
  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, layoutedEdges, setNodes, setEdges]);

  // Memoize the content to prevent unnecessary re-renders
  const dataFlowContent = useMemo(
    () => (
      <div style={{ width: "100%", height: "500px" }}>
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
    ),
    [flowNodes, flowEdges, onNodesChange, onEdgesChange],
  );

  return (
    <Insight
      title="Data Flow"
      description="Visual representation of how data flows through different nodes in your query execution plan. This helps understand the relationships and dependencies between different operations."
      learnings={["indexOnlyScan", "seqScan"]}
      content={dataFlowContent}
    />
  );
}
