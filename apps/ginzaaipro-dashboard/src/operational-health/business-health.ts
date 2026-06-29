/**
 * Business Health
 *
 * Customer-facing operational health model.
 */

export type BusinessHealthStatus =
  | "Excellent"
  | "Healthy"
  | "At Risk"
  | "Critical";

export interface BusinessHealth {
  score: number;
  status: BusinessHealthStatus;
  summary: string;
  measuredAt: string;
}
