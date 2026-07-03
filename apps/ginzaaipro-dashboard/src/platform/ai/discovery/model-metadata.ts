/**
 * AIModelMetadata
 *
 * Describes discovered AI model capabilities.
 */
export interface AIModelMetadata {
  id: string;

  provider: string;

  model: string;

  displayName: string;

  supportsStructuredOutput: boolean;

  supportsVision: boolean;

  supportsTools: boolean;

  supportsStreaming: boolean;

  contextWindow?: number;

  discoveredAt: string;

  deprecatedAt?: string;
}
