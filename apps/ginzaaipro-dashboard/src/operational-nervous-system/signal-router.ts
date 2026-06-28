import type { OperationalSignal } from "./signal";
import type { OperationalSignalSubscriber } from "./signal-subscriber";
import type { SignalCategory } from "./types";

/**
 * OperationalSignalRouter
 *
 * Routes Operational Signals to subscribers
 * based on signal category.
 */
export class OperationalSignalRouter {
  private readonly subscribers = new Map<
    SignalCategory,
    OperationalSignalSubscriber[]
  >();

  subscribe(
    category: SignalCategory,
    subscriber: OperationalSignalSubscriber,
  ): void {
    const subscribers = this.subscribers.get(category) ?? [];

    subscribers.push(subscriber);

    this.subscribers.set(category, subscribers);
  }

  route(signal: OperationalSignal): void {
    const subscribers = this.subscribers.get(signal.category) ?? [];

    for (const subscriber of subscribers) {
      subscriber.handle(signal);
    }
  }
}
