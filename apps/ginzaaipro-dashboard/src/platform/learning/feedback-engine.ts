import type { LearningOutcome, OutcomeRecord } from "./types";

import { OutcomeEngine } from "./outcome-engine";

/**
 * FeedbackEngine
 *
 * Converts human or system feedback into
 * operational outcome records.
 */
export class FeedbackEngine {
  private readonly outcomeEngine = new OutcomeEngine();

  recordFeedback(params: {
    sourceId: string;
    accepted: boolean;
    summary: string;
  }): OutcomeRecord {
    const outcome: LearningOutcome = params.accepted ? "Successful" : "Failed";

    return this.outcomeEngine.createOutcome({
      sourceId: params.sourceId,
      outcome,
      summary: params.summary,
    });
  }
}
