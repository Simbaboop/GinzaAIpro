import type { WorkerProfile } from "./types";

/**
 * WorkloadSnapshot
 *
 * Represents current workload for a worker.
 */
export interface WorkloadSnapshot {
  worker: WorkerProfile;

  activeAssignments: number;

  capacity: number;

  utilization: number;

  measuredAt: string;
}
