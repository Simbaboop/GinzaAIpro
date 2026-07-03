import type { AIModelMetadata } from "./model-metadata";

/**
 * AIModelRegistry
 *
 * Stores discovered AI model metadata.
 *
 * This is intentionally in-memory for now.
 * Future versions should persist to durable storage.
 */
export class AIModelRegistry {
  private readonly models: AIModelMetadata[] = [];

  register(model: AIModelMetadata): void {
    this.models.push(model);
  }

  getAll(): AIModelMetadata[] {
    return [...this.models];
  }

  findByProvider(provider: string): AIModelMetadata[] {
    return this.models.filter((model) => model.provider === provider);
  }

  findByModel(modelName: string): AIModelMetadata | undefined {
    return this.models.find((model) => model.model === modelName);
  }
}
