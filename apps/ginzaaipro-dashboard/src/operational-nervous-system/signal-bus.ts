import type { OperationalSignal } from "./signal";
import type { OperationalSignalSubscriber } from "./signal-subscriber";

/**
 * OperationalSignalBus
 *
 * Publishes Operational Signals to subscribers.
 */
export class OperationalSignalBus {
  private readonly subscribers: OperationalSignalSubscriber[] = [];

  subscribe(subscriber: OperationalSignalSubscriber): void {
    this.subscribers.push(subscriber);
  }

  publish(signal: OperationalSignal): void {
    for (const subscriber of this.subscribers) {
      subscriber.handle(signal);
    }
  }
}
