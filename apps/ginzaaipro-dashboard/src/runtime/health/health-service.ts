import type {
  CapabilityHealth,
  RuntimeHealthSnapshot,
  RuntimeHealthStatus,
} from "./types";

/**
 * RuntimeHealthService
 *
 * Computes runtime health snapshots.
 */
export class RuntimeHealthService {
  createSnapshot(capabilities: CapabilityHealth[]): RuntimeHealthSnapshot {
    return {
      status: this.computeOverallStatus(capabilities),
      timestamp: new Date().toISOString(),
      capabilities,
    };
  }

  private computeOverallStatus(
    capabilities: CapabilityHealth[],
  ): RuntimeHealthStatus {
    if (capabilities.some((capability) => capability.status === "Critical")) {
      return "Critical";
    }

    if (capabilities.some((capability) => capability.status === "Unhealthy")) {
      return "Unhealthy";
    }

    if (capabilities.some((capability) => capability.status === "Degraded")) {
      return "Degraded";
    }

    return "Healthy";
  }
}
