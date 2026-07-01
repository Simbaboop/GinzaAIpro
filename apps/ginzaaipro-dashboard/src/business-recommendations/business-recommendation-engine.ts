import type { OperationalResult } from "@/shared/intelligence/operational-result";
import type { RevenueLeakageFinding } from "@/revenue-leakage/types";

import type { BusinessRecommendation } from "./types";

/**
 * BusinessRecommendationEngine
 *
 * Converts operational intelligence results into
 * prioritized business recommendations.
 */
export class BusinessRecommendationEngine {
  recommend(
    result: OperationalResult<RevenueLeakageFinding>,
  ): BusinessRecommendation {
    const finding = result.payload;

    return {
      id: crypto.randomUUID(),

      title: `Address: ${finding.title}`,

      summary: finding.summary,

      rationale:
        "Recommendation generated from Revenue Leakage Intelligence result.",

      priority: finding.severity,

      expectedImpact: `Estimated recovery opportunity: $${finding.estimatedImpact.toLocaleString()}`,

      governanceRequired: true,

      evidenceIds: [...result.evidenceIds],

      graphNodeIds: [...result.graphNodeIds],

      createdAt: new Date().toISOString(),
    };
  }
}
