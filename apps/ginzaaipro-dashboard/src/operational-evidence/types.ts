/**
 * Operational Evidence Types
 */

export type EvidenceType =
  | "Observation"
  | "Runtime Event"
  | "Operational Signal"
  | "Customer Communication"
  | "Financial Record"
  | "System Log"
  | "Document"
  | "AI Output"
  | "External Integration";

export interface OperationalEvidence {
  id: string;

  type: EvidenceType;

  source: string;

  summary: string;

  referenceId?: string;

  capturedAt: string;

  metadata?: Record<string, unknown>;
}
