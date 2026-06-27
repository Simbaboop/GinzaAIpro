import type { RuntimeCapability } from "./capability";

/**
 * Runtime Capability Registry
 *
 * Maintains the collection of runtime capabilities
 * available to the GinzaAIpro Runtime.
 */
export class CapabilityRegistry {
  private readonly capabilities = new Map<string, RuntimeCapability>();

  register(capability: RuntimeCapability): void {
    this.capabilities.set(capability.name, capability);
  }

  get(name: string): RuntimeCapability | undefined {
    return this.capabilities.get(name);
  }

  has(name: string): boolean {
    return this.capabilities.has(name);
  }

  getAll(): RuntimeCapability[] {
    return Array.from(this.capabilities.values());
  }
}
