/**
 * Operational Knowledge Graph Types
 */

export type GraphNodeType =
  | "Customer"
  | "Lead"
  | "Invoice"
  | "Appointment"
  | "Employee"
  | "Asset"
  | "Evidence"
  | "Assessment"
  | "Decision"
  | "Execution"
  | "Outcome"
  | "Learning";

export type GraphEdgeType =
  | "GENERATED"
  | "CAUSED"
  | "RELATED_TO"
  | "PRODUCED"
  | "EXECUTED"
  | "VERIFIED"
  | "LEARNED_FROM";

export interface GraphNode {
  id: string;
  type: GraphNodeType;
  label: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface GraphEdge {
  id: string;
  type: GraphEdgeType;
  fromNodeId: string;
  toNodeId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}
