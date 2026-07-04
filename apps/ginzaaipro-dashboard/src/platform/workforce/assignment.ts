import type { WorkerProfile } from "./types";

/**
 * WorkAssignment
 *
 * Represents work assigned to a human,
 * digital worker, automation, partner, or team.
 */
export interface WorkAssignment {
  id: string;

  title: string;

  description: string;

  assignedTo: WorkerProfile;

  requiredCapabilityIds: string[];

  priority: "Low" | "Medium" | "High" | "Critical";

  status:
    | "Proposed"
    | "Assigned"
    | "In Progress"
    | "Completed"
    | "Verified"
    | "Failed";

  createdAt: string;

  completedAt?: string;

  verifiedAt?: string;
}
