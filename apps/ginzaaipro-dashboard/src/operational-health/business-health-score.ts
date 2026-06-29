import type { BusinessHealthStatus } from "./business-health";

/**
 * Convert numeric Business Health score into status.
 */
export function businessHealthStatusFromScore(
  score: number,
): BusinessHealthStatus {
  if (score >= 90) return "Excellent";
  if (score >= 75) return "Healthy";
  if (score >= 50) return "At Risk";

  return "Critical";
}
