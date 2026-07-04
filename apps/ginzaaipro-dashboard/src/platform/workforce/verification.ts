import type { WorkAssignment } from "./assignment";

/**
 * WorkVerification
 *
 * Records whether assigned work was verified.
 */
export interface WorkVerification {
  id: string;

  assignment: WorkAssignment;

  verified: boolean;

  verifiedBy: string;

  notes?: string;

  verifiedAt: string;
}
