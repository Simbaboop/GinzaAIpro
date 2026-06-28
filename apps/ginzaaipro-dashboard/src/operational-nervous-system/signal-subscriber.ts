import type { OperationalSignal } from "./signal";

/**
 * OperationalSignalSubscriber
 *
 * Implemented by components that consume
 * Operational Signals.
 */
export interface OperationalSignalSubscriber {
  /**
   * Handle an Operational Signal.
   */
  handle(signal: OperationalSignal): void;
}
