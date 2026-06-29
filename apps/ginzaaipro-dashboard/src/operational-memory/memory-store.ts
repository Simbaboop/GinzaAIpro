import type { MemoryEntry } from "./types";

/**
 * OperationalMemoryStore
 *
 * In-memory store for operational memory entries.
 *
 * This is intentionally temporary.
 * Future versions will persist memory to a database.
 */
export class OperationalMemoryStore {
  private readonly entries: MemoryEntry[] = [];

  append(entry: MemoryEntry): void {
    this.entries.push(entry);
  }

  getAll(): MemoryEntry[] {
    return [...this.entries];
  }

  findBySourceId(sourceId: string): MemoryEntry[] {
    return this.entries.filter((entry) => entry.source.id === sourceId);
  }
}
