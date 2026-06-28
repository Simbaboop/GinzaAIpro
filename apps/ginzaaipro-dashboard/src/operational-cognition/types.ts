/**
 * Operational Cognition Types
 */

export type AssessmentSeverity = "Low" | "Medium" | "High" | "Critical";

export type AssessmentConfidence = "Low" | "Medium" | "High";

export type AssessmentCategory =
  | "Diagnostics"
  | "Revenue Leakage"
  | "Business Health"
  | "Operational Risk"
  | "Opportunity"
  | "Capture Gap";

export interface AssessmentEvidence {
  id: string;
  source: string;
  summary: string;
}

export interface OperationalAssessment {
  id: string;
  category: AssessmentCategory;
  finding: string;
  severity: AssessmentSeverity;
  confidence: AssessmentConfidence;
  evidence: AssessmentEvidence[];
  recommendation?: string;
  createdAt: string;
}
