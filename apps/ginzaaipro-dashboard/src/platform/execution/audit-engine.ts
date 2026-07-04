/**
 * ExecutionAuditRecord
 *
 * Auditable record for execution lifecycle activity.
 */
export interface ExecutionAuditRecord {
  id: string;

  executionRequestId: string;

  event: string;

  actor: string;

  timestamp: string;

  notes?: string;
}

/**
 * ExecutionAuditEngine
 *
 * Creates execution audit records.
 */
export class ExecutionAuditEngine {
  record(params: {
    executionRequestId: string;
    event: string;
    actor: string;
    notes?: string;
  }): ExecutionAuditRecord {
    return {
      id: crypto.randomUUID(),
      executionRequestId: params.executionRequestId,
      event: params.event,
      actor: params.actor,
      timestamp: new Date().toISOString(),
      notes: params.notes,
    };
  }
}
