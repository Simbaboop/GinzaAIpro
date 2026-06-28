import type { OperationalAssessment } from "./types";

/**
 * AssessmentInput
 *
 * Canonical input for operational reasoning.
 */
export interface AssessmentInput {
  question: string;
  evidence: {
    id: string;
    source: string;
    summary: string;
  }[];
}

/**
 * AssessmentPipeline
 *
 * Defines the standard reasoning lifecycle used by
 * Operational Cognition capabilities.
 */
export interface AssessmentPipeline {
  assess(input: AssessmentInput): OperationalAssessment;
}
