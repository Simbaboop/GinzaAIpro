import type { RuntimeState } from "./lifecycle";
import type { RuntimeContext } from "./context";

/**
 * RuntimeSession
 *
 * Represents a single running instance
 * of the GinzaAIpro Runtime.
 */
export interface RuntimeSession {
  /**
   * Unique runtime session identifier.
   */
  id: string;

  /**
   * Current runtime state.
   */
  state: RuntimeState;

  /**
   * Runtime execution context.
   */
  context: RuntimeContext;

  /**
   * UTC start time.
   */
  startedAt: string;
}
