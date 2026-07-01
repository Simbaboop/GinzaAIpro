import type { RuntimeCapability } from "@/runtime/core/capability";

import { RevenueLeakageEngine } from "./revenue-leakage-engine";

/**
 * RevenueLeakageCapability
 *
 * Runtime capability that exposes Revenue Leakage Intelligence.
 */
export class RevenueLeakageCapability implements RuntimeCapability {
  readonly name = "revenue-leakage";

  readonly version = "0.1.0";

  readonly description = "Detects and explains likely revenue leakage.";

  private readonly engine = new RevenueLeakageEngine();

  async initialize(): Promise<void> {
    return Promise.resolve();
  }

  async shutdown(): Promise<void> {
    return Promise.resolve();
  }

  isHealthy(): boolean {
    const finding = this.engine.detect({
      title: "Revenue Leakage capability health check",
      summary: "Revenue Leakage capability is operational.",
      estimatedImpact: 0,
    });
    return finding.payload.severity === "Low";
  }
}
