import type { KnowledgeEntry, OutcomeRecord } from "./types";

/**
 * PatternEngine
 *
 * Converts repeated or validated outcomes into
 * reusable operational knowledge.
 */
export class PatternEngine {
  createPattern(params: {
    title: string;
    summary: string;
    confidence: number;
    evidenceIds: string[];
    outcomes: OutcomeRecord[];
  }): KnowledgeEntry {
    return {
      id: crypto.randomUUID(),
      type: "Pattern",
      title: params.title,
      summary: params.summary,
      confidence: params.confidence,
      evidenceIds: params.evidenceIds,
      outcomeIds: params.outcomes.map((outcome) => outcome.id),
      createdAt: new Date().toISOString(),
    };
  }
}
