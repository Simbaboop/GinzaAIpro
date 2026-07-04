/**
 * Workforce Types
 */

export type WorkerType =
  | "Human"
  | "Digital"
  | "Automation"
  | "Contractor"
  | "Partner"
  | "Department";

export type WorkerStatus = "Available" | "Busy" | "Offline" | "Unavailable";

export interface Capability {
  id: string;

  name: string;

  description?: string;

  proficiency: number;
}

export interface WorkerProfile {
  id: string;

  name: string;

  type: WorkerType;

  status: WorkerStatus;

  capabilities: Capability[];

  reliability: number;

  currentWorkload: number;
}
