import { AIProviderRegistry } from "./registry";

import type { AIRequest, AIResponse } from "./types";

/**
 * AIClient
 *
 * Provider-agnostic client used by intelligence capabilities.
 */
export class AIClient {
  constructor(private readonly registry = new AIProviderRegistry()) {}

  registerProvider(provider: {
    name: string;
    generate(request: AIRequest): Promise<AIResponse>;
  }): void {
    this.registry.register(provider);
  }

  async generate(
    providerName: string,
    request: AIRequest,
  ): Promise<AIResponse> {
    const provider = this.registry.get(providerName);

    if (!provider) {
      throw new Error(`AI provider not registered: ${providerName}`);
    }

    return provider.generate(request);
  }
}
