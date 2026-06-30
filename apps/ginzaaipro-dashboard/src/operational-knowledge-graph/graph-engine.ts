import { OperationalGraphStore } from "./graph-store";

import type { GraphEdge, GraphNode } from "./types";

/**
 * OperationalGraphEngine
 *
 * Provides basic graph operations over operational relationships.
 */
export class OperationalGraphEngine {
  constructor(private readonly store = new OperationalGraphStore()) {}

  addNode(node: GraphNode): void {
    this.store.addNode(node);
  }

  addEdge(edge: GraphEdge): void {
    this.store.addEdge(edge);
  }

  getNodes(): GraphNode[] {
    return this.store.getNodes();
  }

  getEdges(): GraphEdge[] {
    return this.store.getEdges();
  }

  findOutgoing(nodeId: string): GraphEdge[] {
    return this.store.findEdgesFrom(nodeId);
  }

  findIncoming(nodeId: string): GraphEdge[] {
    return this.store.findEdgesTo(nodeId);
  }
}
