/**
 * Business Recommendation Types
 */

export type RecommendationPriority = "Low" | "Medium" | "High" | "Critical";

export interface BusinessRecommendation {
  id: string;

  title: string;

  summary: string;

  rationale: string;

  priority: RecommendationPriority;

  expectedImpact: string;

  governanceRequired: boolean;

  evidenceIds: string[];

  graphNodeIds: string[];

  createdAt: string;
}
