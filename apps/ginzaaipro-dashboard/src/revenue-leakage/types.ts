/**
 * Revenue Leakage Types
 */

export type RevenueLeakageSeverity = "Low" | "Medium" | "High" | "Critical";

export type RevenueLeakageConfidence = "Low" | "Medium" | "High";

export interface RevenueLeakageFinding {
  id: string;
  title: string;
  summary: string;
  severity: RevenueLeakageSeverity;
  confidence: RevenueLeakageConfidence;
  estimatedImpact: number;
  evidenceIds: string[];
  graphNodeIds: string[];
  recommendation?: string;
  createdAt: string;
}
