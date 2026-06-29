import type { RuntimeCapability } from "@/runtime/core/capability";

import { BusinessHealthEngine } from "./business-health-engine";

/**
 * BusinessHealthCapability
 *
 * Runtime capability that exposes Business Health computation.
 */
export class BusinessHealthCapability implements RuntimeCapability {
  readonly name = "operational-health.business-health";

  readonly version = "0.1.0";

  readonly description = "Computes customer-facing Business Health.";

  private readonly engine = new BusinessHealthEngine();

  async initialize(): Promise<void> {
    return Promise.resolve();
  }

  async shutdown(): Promise<void> {
    return Promise.resolve();
  }

  isHealthy(): boolean {
    const health = this.engine.calculate(
      100,
      "Business Health capability is operational.",
    );

    return health.status === "Excellent";
  }
}
