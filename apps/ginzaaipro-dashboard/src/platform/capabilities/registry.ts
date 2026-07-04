import type { Capability } from "./capability";

/**
 * CapabilityRegistry
 *
 * Registers and retrieves business capabilities.
 */
export class CapabilityRegistry {
  private readonly capabilities = new Map<string, Capability>();

  register(capability: Capability): void {
    this.capabilities.set(capability.definition.id, capability);
  }

  get(id: string): Capability | undefined {
    return this.capabilities.get(id);
  }

  getAll(): Capability[] {
    return [...this.capabilities.values()];
  }
}
