/**
 * AIProviderHealth
 *
 * Tracks health state for AI providers.
 */
export type AIProviderHealthStatus =
  | "Healthy"
  | "Degraded"
  | "Unavailable";

export interface AIProviderHealth {
  provider: string;

  status: AIProviderHealthStatus;

  latencyMs?: number;

  errorRate?: number;

  checkedAt: string;
}
