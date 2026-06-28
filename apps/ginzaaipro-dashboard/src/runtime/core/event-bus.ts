import type { RuntimeEvent } from "./event";

/**
 * RuntimeEventBus
 *
 * Publishes Runtime Events to interested subscribers.
 */
export class RuntimeEventBus {
  private readonly subscribers: Array<(event: RuntimeEvent) => void> = [];

  subscribe(handler: (event: RuntimeEvent) => void): void {
    this.subscribers.push(handler);
  }

  publish(event: RuntimeEvent): void {
    for (const handler of this.subscribers) {
      handler(event);
    }
  }
}
