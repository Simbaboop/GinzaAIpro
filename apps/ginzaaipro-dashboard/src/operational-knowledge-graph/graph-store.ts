import type { GraphEdge, GraphNode } from "./types";

/**
 * OperationalGraphStore
 *
 * In-memory store for graph nodes and edges.
 *
 * This is intentionally temporary.
 * Future versions may persist to relational,
 * graph, or hybrid storage.
 */
export class OperationalGraphStore {
  private readonly nodes: GraphNode[] = [];

  private readonly edges: GraphEdge[] = [];

  addNode(node: GraphNode): void {
    this.nodes.push(node);
  }

  addEdge(edge: GraphEdge): void {
    this.edges.push(edge);
  }

  getNodes(): GraphNode[] {
    return [...this.nodes];
  }

  getEdges(): GraphEdge[] {
    return [...this.edges];
  }

  findEdgesFrom(nodeId: string): GraphEdge[] {
    return this.edges.filter((edge) => edge.fromNodeId === nodeId);
  }

  findEdgesTo(nodeId: string): GraphEdge[] {
    return this.edges.filter((edge) => edge.toNodeId === nodeId);
  }
}
