import type { KnowledgeEntry } from "./types";

/**
 * RetrievalEngine
 *
 * Retrieves reusable operational knowledge.
 *
 * This is intentionally simple for now.
 * Future versions may use embeddings, graph retrieval,
 * semantic search, tenant memory, and industry knowledge.
 */
export class RetrievalEngine {
  searchByText(entries: KnowledgeEntry[], query: string): KnowledgeEntry[] {
    const normalized = query.toLowerCase();

    return entries.filter((entry) =>
      `${entry.title} ${entry.summary}`.toLowerCase().includes(normalized),
    );
  }

  searchByMinimumConfidence(
    entries: KnowledgeEntry[],
    minimumConfidence: number,
  ): KnowledgeEntry[] {
    return entries.filter((entry) => entry.confidence >= minimumConfidence);
  }
}
