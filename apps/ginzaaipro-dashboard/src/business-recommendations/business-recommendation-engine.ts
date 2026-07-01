import type { BusinessRecommendation } from "./types";

import type { RevenueLeakageFinding } from "@/revenue-leakage/types";

/**
 * BusinessRecommendationEngine
 *
 * Converts operational findings into
 * prioritized business recommendations.
 */
export class BusinessRecommendationEngine {
  recommend(finding: RevenueLeakageFinding): BusinessRecommendation {
    return {
      id: crypto.randomUUID(),

      title: `Address: ${finding.title}`,

      summary: finding.summary,

      rationale: "Recommendation generated from Revenue Leakage Intelligence.",

      priority: finding.severity,

      expectedImpact: `Estimated recovery opportunity: $${finding.estimatedImpact.toLocaleString()}`,

      governanceRequired: true,

      evidenceIds: [...finding.evidenceIds],

      graphNodeIds: [...finding.graphNodeIds],

      createdAt: new Date().toISOString(),
    };
  }
}
