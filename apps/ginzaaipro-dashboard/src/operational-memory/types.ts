/**
 * Operational Memory Types
 */

export type MemoryEntryType =
  | "Observation"
  | "Assessment"
  | "Decision"
  | "Execution"
  | "Outcome"
  | "Learning";

export interface MemoryEntrySource {
  id: string;
  type: MemoryEntryType;
}

export interface MemoryEntry {
  id: string;
  type: MemoryEntryType;
  source: MemoryEntrySource;
  summary: string;
  createdAt: string;
}
