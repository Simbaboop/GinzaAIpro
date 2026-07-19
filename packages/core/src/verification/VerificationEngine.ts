import type {
  Identifier,
  Verification,
  VerificationSubjectType,
} from "@ginzaaipro/domain";
import type { Engine } from "../shared/index.js";

/**
 * Identifies a verification request before a completed Verification exists.
 */
export class VerificationInput {
  readonly #organizationId: Identifier;
  readonly #subjectType: VerificationSubjectType;
  readonly #subjectId: Identifier;
  readonly #method: string;
  readonly #evidenceIds: readonly Identifier[];
  readonly #verifierId: Identifier | undefined;
  readonly #notes: string | undefined;

  constructor(
    organizationId: Identifier,
    subjectType: VerificationSubjectType,
    subjectId: Identifier,
    method: string,
    evidenceIds: readonly Identifier[],
    verifierId?: Identifier,
    notes?: string,
  ) {
    const normalizedMethod = method.trim();
    const normalizedNotes = notes?.trim();
    if (normalizedMethod.length === 0) {
      throw new Error("VerificationInput method cannot be empty.");
    }
    if (evidenceIds.length === 0) {
      throw new Error(
        "VerificationInput requires at least one evidence identifier.",
      );
    }
    if (notes !== undefined && normalizedNotes?.length === 0) {
      throw new Error("VerificationInput notes cannot be empty when supplied.");
    }

    this.#organizationId = organizationId;
    this.#subjectType = subjectType;
    this.#subjectId = subjectId;
    this.#method = normalizedMethod;
    this.#evidenceIds = Object.freeze([...evidenceIds]);
    this.#verifierId = verifierId;
    this.#notes = normalizedNotes;
    Object.freeze(this);
  }

  get organizationId(): Identifier { return this.#organizationId; }
  get subjectType(): VerificationSubjectType { return this.#subjectType; }
  get subjectId(): Identifier { return this.#subjectId; }
  get method(): string { return this.#method; }
  get evidenceIds(): readonly Identifier[] { return this.#evidenceIds; }
  get verifierId(): Identifier | undefined { return this.#verifierId; }
  get notes(): string | undefined { return this.#notes; }
}

export interface VerificationEngine
  extends Engine<VerificationInput, Verification> {}
