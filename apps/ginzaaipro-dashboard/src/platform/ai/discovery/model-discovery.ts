import { AIModelRegistry } from "./model-registry";

import type { AIProviderDiscovery } from "./provider-discovery";

/**
 * AIModelDiscoveryService
 *
 * Runs provider discovery and registers discovered models.
 */
export class AIModelDiscoveryService {
  constructor(private readonly registry = new AIModelRegistry()) {}

  async discover(provider: AIProviderDiscovery) {
    const models = await provider.discoverModels();

    for (const model of models) {
      this.registry.register(model);
    }

    return models;
  }

  getRegistry(): AIModelRegistry {
    return this.registry;
  }
}
