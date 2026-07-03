import type { AIModelMetadata } from "./model-metadata";
import type { AIProviderHealth } from "./provider-health";

/**
 * AIProviderDiscovery
 *
 * Contract implemented by provider-specific discovery adapters.
 */
export interface AIProviderDiscovery {
  readonly provider: string;

  discoverModels(): Promise<AIModelMetadata[]>;

  checkHealth(): Promise<AIProviderHealth>;
}
