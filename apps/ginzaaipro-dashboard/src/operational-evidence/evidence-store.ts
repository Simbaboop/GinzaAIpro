import type { OperationalEvidence } from "./types";

/**
 * OperationalEvidenceStore
 *
 * In-memory store for operational evidence.
 *
 * This is intentionally temporary.
 * Future versions will persist evidence to durable storage.
 */
export class OperationalEvidenceStore {
  private readonly evidence: OperationalEvidence[] = [];

  append(record: OperationalEvidence): void {
    this.evidence.push(record);
  }

  getAll(): OperationalEvidence[] {
    return [...this.evidence];
  }

  findByReferenceId(referenceId: string): OperationalEvidence[] {
    return this.evidence.filter((record) => record.referenceId === referenceId);
  }
}
