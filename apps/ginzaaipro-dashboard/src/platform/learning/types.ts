/**
 * Operational Learning Types
 */

export type LearningOutcome = "Successful" | "Failed" | "Inconclusive";

export type KnowledgeType =
  | "Pattern"
  | "Playbook"
  | "Rule"
  | "Lesson"
  | "Model Evaluation";

export interface OutcomeRecord {
  id: string;

  sourceId: string;

  outcome: LearningOutcome;

  summary: string;

  measuredAt: string;
}

export interface KnowledgeEntry {
  id: string;

  type: KnowledgeType;

  title: string;

  summary: string;

  confidence: number;

  evidenceIds: string[];

  outcomeIds: string[];

  createdAt: string;
}
