import type { KnowledgeEntry } from "./types";

/**
 * KnowledgeBase
 *
 * Canonical repository for validated operational knowledge.
 *
 * Only validated knowledge should be stored here.
 */
export class KnowledgeBase {
  private readonly entries: KnowledgeEntry[] = [];

  add(entry: KnowledgeEntry): void {
    this.entries.push(entry);
  }

  getAll(): KnowledgeEntry[] {
    return [...this.entries];
  }

  findByType(type: KnowledgeEntry["type"]): KnowledgeEntry[] {
    return this.entries.filter((entry) => entry.type === type);
  }

  findByConfidence(minimum: number): KnowledgeEntry[] {
    return this.entries.filter((entry) => entry.confidence >= minimum);
  }
}
