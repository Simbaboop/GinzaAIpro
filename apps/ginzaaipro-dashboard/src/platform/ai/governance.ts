import { createAIAuditRecord } from "./audit";
import { evaluateAIBudgetPolicy } from "./budget-policy";
import { evaluateAIPurposePolicy } from "./policies";
import { requiresAIApproval } from "./approval-policy";

import type { AIRequest } from "./types";

export interface AIGovernanceDecision {
  allowed: boolean;

  requiresApproval: boolean;

  auditId: string;

  reason: string;
}

/**
 * AIGovernance
 *
 * Central entry point for AI Governance.
 *
 * Every AI request must pass here
 * before AI routing.
 */
export function evaluateAIGovernance(request: AIRequest): AIGovernanceDecision {
  const purposeDecision = evaluateAIPurposePolicy(request.purpose);

  const budgetDecision = evaluateAIBudgetPolicy();

  const allowed = purposeDecision.allowed && budgetDecision.allowed;

  const reason = allowed
    ? "AI Governance approved."
    : `${purposeDecision.reason} ${budgetDecision.reason}`;

  const audit = createAIAuditRecord({
    purpose: request.purpose,
    allowed,
    reason,
  });

  return {
    allowed,

    requiresApproval: requiresAIApproval(request.purpose),

    auditId: audit.id,

    reason,
  };
}
