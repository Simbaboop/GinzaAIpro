import type { RuntimeCapability } from "@/runtime/core/capability";

import { RuntimeHealthService } from "./health-service";

/**
 * RuntimeHealthCapability
 *
 * Runtime capability responsible for platform health assessment.
 */
export class RuntimeHealthCapability implements RuntimeCapability {
  readonly name = "runtime.health";

  readonly version = "0.1.0";

  readonly description = "Assesses GinzaAIpro runtime health.";

  private readonly service = new RuntimeHealthService();

  async initialize(): Promise<void> {
    return Promise.resolve();
  }

  async shutdown(): Promise<void> {
    return Promise.resolve();
  }

  isHealthy(): boolean {
    const snapshot = this.service.createSnapshot([]);

    return snapshot.status === "Healthy";
  }
}
