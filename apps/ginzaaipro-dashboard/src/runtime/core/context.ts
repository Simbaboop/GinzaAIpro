/**
 * RuntimeContext
 *
 * Shared execution context supplied to every
 * runtime capability.
 *
 * Context represents the current operational
 * environment—not business data.
 */

export interface RuntimeContext {
  /**
   * Unique execution trace.
   */
  traceId: string;

  /**
   * Tenant currently executing.
   */
  tenantId?: string;

  /**
   * UTC execution timestamp.
   */
  timestamp: string;

  /**
   * Runtime environment.
   */
  environment: "development" | "testing" | "staging" | "production";
}
