import { CapabilityRegistry } from "./registry";
import { RuntimeLifecycleManager } from "./lifecycle-manager";

import type { RuntimeCapability } from "./capability";

/**
 * GinzaAIpro Runtime
 *
 * Coordinates runtime capabilities.
 */
export class Runtime {
  private readonly registry = new CapabilityRegistry();

  private readonly lifecycle = new RuntimeLifecycleManager();

  register(capability: RuntimeCapability): void {
    this.registry.register(capability);
  }

  hasCapability(name: string): boolean {
    return this.registry.has(name);
  }

  capabilities(): RuntimeCapability[] {
    return this.registry.getAll();
  }

  state() {
    return this.lifecycle.getState();
  }
  initialize(): void {
    this.lifecycle.transitionTo("Initializing");
  }

  start(): void {
    this.lifecycle.transitionTo("Running");
  }

  stop(): void {
    this.lifecycle.transitionTo("Stopping");
  }

  completeStop(): void {
    this.lifecycle.transitionTo("Stopped");
  }

  fail(): void {
    this.lifecycle.transitionTo("Failed");
  }
}
