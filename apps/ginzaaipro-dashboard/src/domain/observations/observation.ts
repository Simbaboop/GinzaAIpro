export type OutcomeStatus = "Open" | "Improving" | "Resolved" | "Escalated";

export type WorkflowState =
  | "Draft"
  | "Ready"
  | "Executing"
  | "Completed"
  | "Escalated";

export type VerificationStatus =
  | "Unverified"
  | "Verified"
  | "Needs Review"
  | "Failed Verification";

export type Observation = {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  outcome: string;
  decisionNote: string;
  owner: string;
  nextAction: string;
  outcomeStatus: OutcomeStatus;
  workflowState: WorkflowState;
  verificationStatus: VerificationStatus;
  createdAt: string;
};
