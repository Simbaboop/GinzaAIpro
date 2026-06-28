/**
 * Runtime Health Types
 */

/**
 * Overall runtime health classification.
 */
export type RuntimeHealthStatus =
  | "Healthy"
  | "Degraded"
  | "Unhealthy"
  | "Critical";

/**
 * Individual capability health.
 */
export interface CapabilityHealth {
  capability: string;

  healthy: boolean;

  status: RuntimeHealthStatus;

  message?: string;
}

/**
 * Overall runtime health snapshot.
 */
export interface RuntimeHealthSnapshot {
  status: RuntimeHealthStatus;

  timestamp: string;

  capabilities: CapabilityHealth[];
}
