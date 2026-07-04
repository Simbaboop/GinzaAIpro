import { CapabilityResolver } from "./resolver";

import type { CapabilityRegistry } from "./registry";

/**
 * CapabilityExecutionService
 *
 * Executes registered business capabilities.
 */
export class CapabilityExecutionService {
  private readonly resolver: CapabilityResolver;

  constructor(registry: CapabilityRegistry) {
    this.resolver = new CapabilityResolver(registry);
  }

  async execute(params: {
    capabilityId: string;
    input: unknown;
  }): Promise<unknown> {
    const capability = this.resolver.resolve(params.capabilityId);

    return capability.execute(params.input);
  }
}
