import { evaluateAIGovernance } from "./governance";
import { routeAIRequest } from "./routing";

import type { AIClient } from "./client";
import type { AIModelRecord } from "./model-selection";
import type { AIRequest, AIResponse } from "./types";

/**
 * AIExecutionBoundary
 *
 * Controlled entry point for AI execution.
 *
 * All AI requests must pass through:
 * 1. AI Governance
 * 2. AI Routing
 * 3. Provider execution
 */
export class AIExecutionBoundary {
  constructor(
    private readonly client: AIClient,
    private readonly models: AIModelRecord[],
  ) {}

  async execute(request: AIRequest): Promise<AIResponse> {
    const governance = evaluateAIGovernance(request);

    if (!governance.allowed) {
      throw new Error(`AI Governance blocked request: ${governance.reason}`);
    }

    const route = routeAIRequest(request, this.models);

    return this.client.generate(route.model.provider, request);
  }
}
