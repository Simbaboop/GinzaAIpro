import type {
  AssessmentCategory,
  AssessmentConfidence,
  AssessmentSeverity,
  OperationalAssessment,
} from "./types";

import type {
  AssessmentInput,
  AssessmentPipeline,
} from "./assessment-pipeline";

/**
 * AssessmentEngine
 *
 * Basic implementation of the AssessmentPipeline contract.
 *
 * This is intentionally simple for now.
 * Future specialized engines will extend this pattern.
 */
export class AssessmentEngine implements AssessmentPipeline {
  assess(input: AssessmentInput): OperationalAssessment {
    return {
      id: crypto.randomUUID(),
      category: this.inferCategory(input.question),
      finding: input.question,
      severity: this.inferSeverity(input.evidence.length),
      confidence: this.inferConfidence(input.evidence.length),
      evidence: input.evidence,
      recommendation: "Review supporting evidence and determine next action.",
      createdAt: new Date().toISOString(),
    };
  }

  private inferCategory(question: string): AssessmentCategory {
    const normalized = question.toLowerCase();

    if (normalized.includes("revenue")) return "Revenue Leakage";
    if (normalized.includes("health")) return "Business Health";
    if (normalized.includes("risk")) return "Operational Risk";
    if (normalized.includes("opportunity")) return "Opportunity";
    if (normalized.includes("capture")) return "Capture Gap";

    return "Diagnostics";
  }

  private inferSeverity(evidenceCount: number): AssessmentSeverity {
    if (evidenceCount >= 5) return "High";
    if (evidenceCount >= 3) return "Medium";

    return "Low";
  }

  private inferConfidence(evidenceCount: number): AssessmentConfidence {
    if (evidenceCount >= 5) return "High";
    if (evidenceCount >= 2) return "Medium";

    return "Low";
  }
}
