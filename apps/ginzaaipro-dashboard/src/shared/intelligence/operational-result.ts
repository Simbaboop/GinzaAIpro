/**
 * OperationalResult
 *
 * Canonical result envelope produced by
 * Operational Intelligence capabilities.
 */
export interface OperationalResult<T> {
  /**
   * Unique result identifier.
   */
  id: string;

  /**
   * Capability that produced the result.
   */
  capability: string;

  /**
   * Human-readable summary.
   */
  summary: string;

  /**
   * Confidence score (0.0–1.0).
   */
  confidence: number;

  /**
   * Supporting Operational Evidence.
   */
  evidenceIds: string[];

  /**
   * Related Operational Knowledge Graph nodes.
   */
  graphNodeIds: string[];

  /**
   * Related Operational Memory entries.
   */
  memoryEntryIds: string[];

  /**
   * Time the result was created.
   */
  createdAt: string;

  /**
   * Domain-specific payload.
   */
  payload: T;
}
