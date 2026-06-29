import type { BusinessHealth } from "./business-health";

/**
 * Immutable snapshot of Business Health at a point in time.
 */
export interface BusinessHealthSnapshot {
  id: string;

  businessHealth: BusinessHealth;

  createdAt: string;
}
