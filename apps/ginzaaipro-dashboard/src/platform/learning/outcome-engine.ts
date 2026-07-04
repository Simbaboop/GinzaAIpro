import type { LearningOutcome, OutcomeRecord } from "./types";

/**
 * OutcomeEngine
 *
 * Records operational outcomes that may become
 * learning inputs.
 */
export class OutcomeEngine {
  createOutcome(params: {
    sourceId: string;
    outcome: LearningOutcome;
    summary: string;
  }): OutcomeRecord {
    return {
      id: crypto.randomUUID(),
      sourceId: params.sourceId,
      outcome: params.outcome,
      summary: params.summary,
      measuredAt: new Date().toISOString(),
    };
  }
}
