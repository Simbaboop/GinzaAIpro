import { AssessmentEngine } from "./assessment-engine";

import type { AssessmentInput } from "./assessment-pipeline";
import type { OperationalAssessment } from "./types";

/**
 * DiagnosticEngine
 *
 * Produces diagnostic assessments from operational evidence.
 */
export class DiagnosticEngine {
  private readonly assessmentEngine = new AssessmentEngine();

  diagnose(input: AssessmentInput): OperationalAssessment {
    return this.assessmentEngine.assess({
      ...input,
      question: input.question || "What operational issue requires diagnosis?",
    });
  }
}
