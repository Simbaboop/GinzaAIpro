import type { GraphEdge, GraphNode } from "./types";

/**
 * OperationalGraph
 *
 * In-memory representation of operational nodes and edges.
 */
export interface OperationalGraph {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
