import { CapabilityRegistry } from "./registry";
import type { RuntimeCapability } from "./capability";

/**
 * GinzaAIpro Runtime
 *
 * Coordinates runtime capabilities.
 */
export class Runtime {
  private readonly registry = new CapabilityRegistry();

  register(capability: RuntimeCapability): void {
    this.registry.register(capability);
  }

  hasCapability(name: string): boolean {
    return this.registry.has(name);
  }

  capabilities(): RuntimeCapability[] {
    return this.registry.getAll();
  }
}
