/**
 * Execution Authority
 *
 * Defines who is authorized to perform work.
 */
export type ExecutionAuthority =
  | "ObserveOnly"
  | "RecommendOnly"
  | "Autonomous"
  | "HumanApproval"
  | "HumanExecution"
  | "MultiPartyApproval";

/**
 * Execution Risk
 */
export type ExecutionRisk = "Low" | "Medium" | "High" | "Critical";

/**
 * Execution Request
 */
export interface ExecutionRequest {
  id: string;

  title: string;

  description: string;

  authority: ExecutionAuthority;

  risk: ExecutionRisk;

  requiresVerification: boolean;

  requiresLearning: boolean;

  createdAt: string;
}
