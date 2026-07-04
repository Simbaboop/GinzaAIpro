import type { WorkerProfile } from "./types";

/**
 * HumanWorker
 *
 * Represents a human member of the workforce.
 */
export interface HumanWorker extends WorkerProfile {
  employeeId: string;

  department?: string;

  managerId?: string;
}
