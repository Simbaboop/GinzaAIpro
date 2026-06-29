import type { BusinessHealth } from "./business-health";

import { businessHealthStatusFromScore } from "./business-health-score";

/**
 * BusinessHealthEngine
 *
 * Computes customer-facing Business Health.
 */
export class BusinessHealthEngine {
  calculate(score: number, summary: string): BusinessHealth {
    return {
      score,
      status: businessHealthStatusFromScore(score),
      summary,
      measuredAt: new Date().toISOString(),
    };
  }
}
