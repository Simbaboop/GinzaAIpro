import type { RuntimeState } from "./lifecycle";

/**
 * RuntimeLifecycleManager
 *
 * Owns controlled Runtime state transitions.
 */
export class RuntimeLifecycleManager {
  private state: RuntimeState = "Created";

  getState(): RuntimeState {
    return this.state;
  }

  transitionTo(nextState: RuntimeState): void {
    if (!this.canTransitionTo(nextState)) {
      throw new Error(
        `Invalid runtime transition: ${this.state} -> ${nextState}`,
      );
    }

    this.state = nextState;
  }

  private canTransitionTo(nextState: RuntimeState): boolean {
    const allowedTransitions: Record<RuntimeState, RuntimeState[]> = {
      Created: ["Initializing", "Failed"],
      Initializing: ["Running", "Failed"],
      Running: ["Stopping", "Failed"],
      Stopping: ["Stopped", "Failed"],
      Stopped: [],
      Failed: [],
    };

    return allowedTransitions[this.state].includes(nextState);
  }
}
