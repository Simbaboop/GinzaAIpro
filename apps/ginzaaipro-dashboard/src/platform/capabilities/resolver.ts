import type { Capability } from "./capability";
import type { CapabilityRegistry } from "./registry";

/**
 * CapabilityResolver
 *
 * Resolves a requested business capability.
 */
export class CapabilityResolver {
  constructor(private readonly registry: CapabilityRegistry) {}

  resolve(capabilityId: string): Capability {
    const capability = this.registry.get(capabilityId);

    if (!capability) {
      throw new Error(`Capability not registered: ${capabilityId}`);
    }

    return capability;
  }
}
