import type { AIProvider } from "./provider";

/**
 * AIProviderRegistry
 *
 * Registers and retrieves AI providers.
 */
export class AIProviderRegistry {
  private readonly providers = new Map<string, AIProvider>();

  register(provider: AIProvider): void {
    this.providers.set(provider.name, provider);
  }

  get(name: string): AIProvider | undefined {
    return this.providers.get(name);
  }

  getAll(): AIProvider[] {
    return [...this.providers.values()];
  }
}
