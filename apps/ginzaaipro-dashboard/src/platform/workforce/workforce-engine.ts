import type { WorkAssignment } from "./assignment";
import type { WorkloadSnapshot } from "./workload";
import type { WorkerProfile } from "./types";

/**
 * WorkforceEngine
 *
 * Coordinates workers, assignments, and workload.
 */
export class WorkforceEngine {
  assign(params: {
    title: string;
    description: string;
    worker: WorkerProfile;
    requiredCapabilityIds: string[];
    priority: WorkAssignment["priority"];
  }): WorkAssignment {
    return {
      id: crypto.randomUUID(),
      title: params.title,
      description: params.description,
      assignedTo: params.worker,
      requiredCapabilityIds: params.requiredCapabilityIds,
      priority: params.priority,
      status: "Assigned",
      createdAt: new Date().toISOString(),
    };
  }

  measureWorkload(params: {
    worker: WorkerProfile;
    activeAssignments: number;
    capacity: number;
  }): WorkloadSnapshot {
    return {
      worker: params.worker,
      activeAssignments: params.activeAssignments,
      capacity: params.capacity,
      utilization:
        params.capacity === 0 ? 0 : params.activeAssignments / params.capacity,
      measuredAt: new Date().toISOString(),
    };
  }
}
