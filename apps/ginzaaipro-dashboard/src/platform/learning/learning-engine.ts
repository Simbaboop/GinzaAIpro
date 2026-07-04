import { KnowledgeBase } from "./knowledge-base";
import { PatternEngine } from "./pattern-engine";

import type { OutcomeRecord } from "./types";

/**
 * LearningEngine
 *
 * Converts validated operational outcomes into
 * reusable organizational knowledge.
 *
 * This is the primary entry point into the
 * Operational Learning subsystem.
 */
export class LearningEngine {
  constructor(
    private readonly knowledgeBase = new KnowledgeBase(),
    private readonly patternEngine = new PatternEngine(),
  ) {}

  learn(params: {
    title: string;
    summary: string;
    confidence: number;
    evidenceIds: string[];
    outcomes: OutcomeRecord[];
  }) {
    const pattern = this.patternEngine.createPattern({
      title: params.title,
      summary: params.summary,
      confidence: params.confidence,
      evidenceIds: params.evidenceIds,
      outcomes: params.outcomes,
    });

    this.knowledgeBase.add(pattern);

    return pattern;
  }

  knowledge(): KnowledgeBase {
    return this.knowledgeBase;
  }
}
