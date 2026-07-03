import type { AIModelPurpose } from "./types";

/**
 * AICostPolicy
 *
 * Defines cost sensitivity for each AI purpose.
 */
export type AICostSensitivity = "low" | "medium" | "high";

export function costSensitivityForPurpose(
  purpose: AIModelPurpose,
): AICostSensitivity {
  switch (purpose) {
    case "classification":
    case "extraction":
    case "embedding":
      return "high";

    case "summarization":
    case "speech":
      return "medium";

    case "reasoning":
    case "recommendation":
    case "supervision":
    case "vision":
      return "low";
  }
}
