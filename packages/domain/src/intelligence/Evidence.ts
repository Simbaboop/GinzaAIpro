import { Entity, Identifier, Percentage } from "../common/index.js";
import type { BusinessSignalValidationStatus } from "./BusinessSignal.js";

export class Evidence extends Entity {
  readonly #organizationId: Identifier;
  readonly #signalIds: readonly Identifier[];
  readonly #source: string;
  readonly #signalValidationStatus: "valid";
  readonly #verificationMethod: string;
  readonly #materialRelevance: Percentage;
  readonly #statement: string;
  readonly #confidence: Percentage;
  readonly #createdAt: string;

  constructor(
    id: Identifier,
    organizationId: Identifier,
    signalIds: readonly Identifier[],
    source: string,
    signalValidationStatus: BusinessSignalValidationStatus,
    verificationMethod: string,
    materialRelevance: Percentage,
    statement: string,
    confidence: Percentage,
    createdAt: string,
  ) {
    super(id);
    const normalizedSource = source.trim();
    const normalizedMethod = verificationMethod.trim();
    const normalizedStatement = statement.trim();
    const createdTime = Date.parse(createdAt);
    if (signalIds.length === 0) {
      throw new Error("Evidence requires at least one originating signal.");
    }
    if (signalValidationStatus !== "valid") {
      throw new Error("Evidence requires validated originating signals.");
    }
    if (
      normalizedSource.length === 0 ||
      normalizedMethod.length === 0 ||
      normalizedStatement.length === 0
    ) {
      throw new Error(
        "Evidence source, verification method, and statement cannot be empty.",
      );
    }
    if (materialRelevance.basisPoints === 0) {
      throw new Error("Evidence must be materially relevant.");
    }
    if (!Number.isFinite(createdTime)) {
      throw new Error("Evidence creation time must be a valid date-time value.");
    }

    this.#organizationId = organizationId;
    this.#signalIds = Object.freeze([...signalIds]);
    this.#source = normalizedSource;
    this.#signalValidationStatus = signalValidationStatus;
    this.#verificationMethod = normalizedMethod;
    this.#materialRelevance = materialRelevance;
    this.#statement = normalizedStatement;
    this.#confidence = confidence;
    this.#createdAt = new Date(createdTime).toISOString();
    Object.freeze(this);
  }

  get organizationId(): Identifier { return this.#organizationId; }
  get signalIds(): readonly Identifier[] { return this.#signalIds; }
  get source(): string { return this.#source; }
  get signalValidationStatus(): "valid" {
    return this.#signalValidationStatus;
  }
  get verificationMethod(): string { return this.#verificationMethod; }
  get materialRelevance(): Percentage { return this.#materialRelevance; }
  get statement(): string { return this.#statement; }
  get confidence(): Percentage { return this.#confidence; }
  get createdAt(): string { return this.#createdAt; }
}
