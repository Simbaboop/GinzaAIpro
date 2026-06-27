import type { OperationalEntity } from "@/domain/core/operational-entity";

export type ExecutorType = "Human" | "Agent" | "System" | "External";

export type ExecutionStatus =
  | "Not Started"
  | "In Progress"
  | "Completed"
  | "Failed"
  | "Blocked";

export type VerificationStatus =
  | "Unverified"
  | "Verified"
  | "Needs Review"
  | "Failed Verification";

export type Execution = OperationalEntity & {
  decisionId: string;

  executorType: ExecutorType;

  executionStatus: ExecutionStatus;

  verificationStatus: VerificationStatus;

  executionEvidence: string;

  startedAt?: string;

  completedAt?: string;
};
