import type { AIModelPurpose } from "./types";

/**
 * AIApprovalPolicy
 *
 * Determines whether human approval is required
 * before an AI request may be executed.
 *
 * This is AI Governance only.
 * It is NOT Business Governance.
 */

export function requiresAIApproval(purpose: AIModelPurpose): boolean {
  switch (purpose) {
    case "recommendation":
    case "supervision":
      return true;

    case "reasoning":
      return false;

    case "classification":
    case "extraction":
    case "embedding":
    case "summarization":
    case "vision":
    case "speech":
      return false;
  }
}
