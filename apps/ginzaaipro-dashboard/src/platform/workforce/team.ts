import type { WorkerProfile } from "./types";

/**
 * WorkforceTeam
 *
 * Represents a coordinated group of workers.
 */
export interface WorkforceTeam {
  id: string;

  name: string;

  members: WorkerProfile[];

  capabilities: string[];
}
