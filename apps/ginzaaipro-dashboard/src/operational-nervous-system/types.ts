/**
 * Operational Nervous System Types
 */

/**
 * Signal priority.
 */
export type SignalPriority = "Low" | "Medium" | "High" | "Critical";

/**
 * Operational signal category.
 */
export type SignalCategory =
  | "Runtime"
  | "Health"
  | "Diagnostics"
  | "Recovery"
  | "Governance"
  | "Execution";

/**
 * Canonical Operational Signal.
 */
export interface OperationalSignal {
  id: string;

  category: SignalCategory;

  priority: SignalPriority;

  timestamp: string;

  source: string;

  message: string;
}
