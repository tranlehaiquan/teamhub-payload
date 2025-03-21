'use client';
import React from 'react';
import { ReactFlow, Edge, Node } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import SectionCard from '@/components/SectionCard/SectionCard';
import { api } from '@/trpc/react';
import { User, Profile } from '@/payload-types';
import dagre from 'dagre';

const edgeType = 'smoothstep';

// This helper function uses dagre to calculate node positions
const getLayoutedElements = (nodes: Node[], edges: Edge[], direction = 'TB') => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));

  // Set graph direction and node dimensions
  dagreGraph.setGraph({ rankdir: direction, ranksep: 80, nodesep: 50 });

  // Add nodes to the graph with their dimensions
  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: 180, height: 50 });
  });

  // Add edges to the graph
  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  // Layout the graph
  dagre.layout(dagreGraph);

  // Apply calculated positions to the nodes
  const layoutedNodes = nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);

    return {
      ...node,
      position: {
        x: nodeWithPosition.x - 90, // Centering: width / 2
        y: nodeWithPosition.y - 25, // Centering: height / 2
      },
    };
  });

  return { nodes: layoutedNodes, edges };
};

export default function OrgChart() {
  const [{ docs: users }] = api.user.getUsers.useSuspenseQuery({
    page: 1,
    limit: 100,
  });

  const edges = users
    .filter((i) => i.reportTo)
    .map((user) => {
      const reportTo = user.reportTo as User;

      return {
        id: `e${user.id}-${reportTo.id}`,
        source: String(reportTo.id),
        target: String(user.id),
        type: edgeType,
        animated: true,
      };
    });

  // Create basic nodes with placeholder positions
  const initialNodes = users.map((user) => {
    const profile = user.profile as Profile | undefined;
    const displayName = profile
      ? `${profile.firstName || ''} ${profile.lastName || ''}`.trim()
      : user.email;

    return {
      id: String(user.id),
      position: { x: 0, y: 0 },
      data: {
        label: displayName || user.email,
      },
    };
  });

  // Apply the layout algorithm
  const { nodes, edges: layoutedEdges } = getLayoutedElements(initialNodes, edges);

  return (
    <div className="h-screen p-4">
      <SectionCard className="h-full">
        <ReactFlow nodes={nodes} edges={layoutedEdges} fitView attributionPosition="bottom-right" />
      </SectionCard>
    </div>
  );
}
