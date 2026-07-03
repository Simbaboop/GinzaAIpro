import type { AIModelPurpose } from "./types";

/**
 * AIPolicyDecision
 *
 * Allows or blocks an AI request before routing.
 */
export interface AIPolicyDecision {
  allowed: boolean;
  reason: string;
}

export function evaluateAIPurposePolicy(
  purpose: AIModelPurpose,
): AIPolicyDecision {
  switch (purpose) {
    case "recommendation":
    case "supervision":
      return {
        allowed: true,
        reason: "Allowed, but downstream business action requires Governance.",
      };

    default:
      return {
        allowed: true,
        reason: "Allowed AI purpose.",
      };
  }
}
