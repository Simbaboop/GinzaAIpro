/**
 * AI Platform Types
 */

export type AIProviderName =
  | "openai"
  | "anthropic"
  | "google"
  | "azure-openai"
  | "openrouter"
  | "local";

export type AIModelPurpose =
  | "classification"
  | "extraction"
  | "summarization"
  | "reasoning"
  | "recommendation"
  | "supervision"
  | "embedding"
  | "vision"
  | "speech";

export interface AIRequest {
  prompt: string;
  purpose: AIModelPurpose;
  metadata?: Record<string, unknown>;
}

export interface AIResponse {
  output: string;
  provider: AIProviderName;
  model: string;
  createdAt: string;
}
