import { selectActiveModel, type AIModelRecord } from "./model-selection";

import type { AIRequest } from "./types";

/**
 * AIRoutingPlan
 *
 * Result of routing an AI request to an approved model.
 */
export interface AIRoutingPlan {
  request: AIRequest;
  model: AIModelRecord;
}

/**
 * routeAIRequest
 *
 * Selects an active AI model for the request purpose.
 */
export function routeAIRequest(
  request: AIRequest,
  models: AIModelRecord[],
): AIRoutingPlan {
  const model = selectActiveModel(request.purpose, models);

  if (!model) {
    throw new Error(
      `No active AI model available for purpose: ${request.purpose}`,
    );
  }

  return {
    request,
    model,
  };
}
