/**
 * AIBudgetPolicy
 *
 * Evaluates whether an AI request is allowed
 * under cost policy.
 *
 * This is a placeholder policy.
 * Future versions will use tenant budgets,
 * provider costs, usage history, and model pricing.
 */

export interface AIBudgetDecision {
  allowed: boolean;
  reason: string;
}

export function evaluateAIBudgetPolicy(): AIBudgetDecision {
  return {
    allowed: true,
    reason: "AI budget policy allowed request.",
  };
}
