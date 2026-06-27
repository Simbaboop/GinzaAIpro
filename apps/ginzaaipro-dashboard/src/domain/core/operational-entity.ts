/**
 * OperationalEntity
 *
 * Base type for all governed operational objects inside GinzaAIpro.
 *
 * Every first-class domain object inherits these common capabilities.
 */

export type OperationalEntity = {
  /**
   * Globally unique identifier.
   */
  id: string;

  /**
   * Tenant ownership.
   * Future multi-tenant support.
   */
  tenantId?: string;

  /**
   * Distributed trace identifier.
   * Connects Events → Observations → Decisions → Execution.
   */
  traceId?: string;

  /**
   * Version for optimistic concurrency
   * and future event replay.
   */
  version?: number;

  /**
   * UTC creation timestamp.
   */
  createdAt: string;

  /**
   * UTC modification timestamp.
   */
  updatedAt?: string;
};
