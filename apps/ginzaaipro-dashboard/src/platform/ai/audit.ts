/**
 * AIAuditRecord
 *
 * Captures auditable metadata for AI requests.
 *
 * This does not store prompts or responses yet.
 * Future versions may support secure prompt/response logging
 * with privacy controls.
 */
export interface AIAuditRecord {
  id: string;

  purpose: string;

  provider?: string;

  model?: string;

  allowed: boolean;

  reason: string;

  createdAt: string;
}

export function createAIAuditRecord(params: {
  purpose: string;
  provider?: string;
  model?: string;
  allowed: boolean;
  reason: string;
}): AIAuditRecord {
  return {
    id: crypto.randomUUID(),
    ...params,
    createdAt: new Date().toISOString(),
  };
}
