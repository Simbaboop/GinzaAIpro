import type { RuntimeState } from "./lifecycle";

/**
 * RuntimeLifecycleManager
 *
 * Owns Runtime state transitions.
 *
 * The Runtime coordinates capabilities.
 * The Lifecycle Manager controls lifecycle state.
 */
export class RuntimeLifecycleManager {
  private state: RuntimeState = "Created";

  getState(): RuntimeState {
    return this.state;
  }

  markInitializing(): void {
    this.state = "Initializing";
  }

  markRunning(): void {
    this.state = "Running";
  }

  markStopping(): void {
    this.state = "Stopping";
  }

  markStopped(): void {
    this.state = "Stopped";
  }

  markFailed(): void {
    this.state = "Failed";
  }
}
