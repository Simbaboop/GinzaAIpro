import type { RuntimeEvent } from "./event";

/**
 * RuntimeEventSubscriber
 *
 * Implemented by components that consume
 * Runtime Events.
 */
export interface RuntimeEventSubscriber {
  /**
   * Handle a Runtime Event.
   */
  handle(event: RuntimeEvent): void;
}
