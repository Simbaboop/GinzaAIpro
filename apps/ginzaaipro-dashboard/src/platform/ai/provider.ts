import type { AIRequest, AIResponse } from "./types";

/**
 * AIProvider
 *
 * Every LLM provider must implement this interface.
 *
 * Intelligence engines never talk directly to OpenAI,
 * Anthropic, Gemini, etc.
 */
export interface AIProvider {
  readonly name: string;

  generate(request: AIRequest): Promise<AIResponse>;
}
