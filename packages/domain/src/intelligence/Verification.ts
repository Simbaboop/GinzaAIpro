import { Entity, Identifier, Percentage } from "../common/index.js";

export type VerificationSubjectType = "action" | "execution_plan" | "outcome";
export type VerificationResult = "confirmed" | "refuted" | "inconclusive";

export class Verification extends Entity {
  readonly #organizationId: Identifier;
  readonly #subjectType: VerificationSubjectType;
  readonly #subjectId: Identifier;
  readonly #method: string;
  readonly #evidenceIds: readonly Identifier[];
  readonly #result: VerificationResult;
  readonly #verifierId: Identifier | undefined;
  readonly #verifiedAt: string;
  readonly #confidence: Percentage;
  readonly #notes: string | undefined;
  readonly #limitations: readonly string[];

  constructor(
    id: Identifier,
    organizationId: Identifier,
    subjectType: VerificationSubjectType,
    subjectId: Identifier,
    method: string,
    evidenceIds: readonly Identifier[],
    result: VerificationResult,
    verifiedAt: string,
    confidence: Percentage,
    limitations: readonly string[],
    verifierId?: Identifier,
    notes?: string,
  ) {
    super(id);
    const normalizedMethod = method.trim();
    const verifiedTime = Date.parse(verifiedAt);
    if (normalizedMethod.length === 0) {
      throw new Error("Verification method cannot be empty.");
    }
    if (evidenceIds.length === 0) {
      throw new Error(
        "Verification requires at least one supporting evidence identifier.",
      );
    }
    if (!Number.isFinite(verifiedTime)) {
      throw new Error(
        "Verification time must be a valid date-time value.",
      );
    }

    this.#organizationId = organizationId;
    this.#subjectType = subjectType;
    this.#subjectId = subjectId;
    this.#method = normalizedMethod;
    this.#evidenceIds = Object.freeze([...evidenceIds]);
    this.#result = result;
    this.#verifierId = verifierId;
    this.#verifiedAt = new Date(verifiedTime).toISOString();
    this.#confidence = confidence;
    this.#notes = notes?.trim() || undefined;
    this.#limitations = Object.freeze(limitations.map((value) => value.trim()));
    Object.freeze(this);
  }

  get organizationId(): Identifier { return this.#organizationId; }
  get subjectType(): VerificationSubjectType { return this.#subjectType; }
  get subjectId(): Identifier { return this.#subjectId; }
  get method(): string { return this.#method; }
  get evidenceIds(): readonly Identifier[] { return this.#evidenceIds; }
  get result(): VerificationResult { return this.#result; }
  get verifierId(): Identifier | undefined { return this.#verifierId; }
  get verifiedAt(): string { return this.#verifiedAt; }
  get confidence(): Percentage { return this.#confidence; }
  get notes(): string | undefined { return this.#notes; }
  get limitations(): readonly string[] { return this.#limitations; }
}
