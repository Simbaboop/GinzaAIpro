import type { RuntimeCapability } from "@/runtime/core/capability";

import { RevenueLeakageEngine } from "@/revenue-leakage/revenue-leakage-engine";
import { BusinessRecommendationEngine } from "./business-recommendation-engine";

/**
 * BusinessRecommendationCapability
 *
 * Runtime capability that converts findings into
 * governed business recommendations.
 */
export class BusinessRecommendationCapability implements RuntimeCapability {
  readonly name = "business-recommendations";

  readonly version = "0.1.0";

  readonly description =
    "Converts operational findings into evidence-backed recommendations.";

  private readonly leakageEngine = new RevenueLeakageEngine();

  private readonly recommendationEngine = new BusinessRecommendationEngine();

  async initialize(): Promise<void> {
    return Promise.resolve();
  }

  async shutdown(): Promise<void> {
    return Promise.resolve();
  }

  isHealthy(): boolean {
    const finding = this.leakageEngine.detect({
      title: "Recommendation capability health check",
      summary: "Business Recommendation capability is operational.",
      estimatedImpact: 0,
    });

    const recommendation = this.recommendationEngine.recommend(finding);

    return recommendation.governanceRequired === true;
  }
}
