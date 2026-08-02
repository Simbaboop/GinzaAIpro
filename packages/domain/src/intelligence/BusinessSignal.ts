import {
  Entity,
  Identifier,
  Money,
  Percentage,
} from "../common/index.js";

export type BusinessSignalCategory =
  | "operational"
  | "financial"
  | "human"
  | "system"
  | "external";

export type BusinessSignalValidationStatus =
  | "unvalidated"
  | "valid"
  | "invalid"
  | "conflicted"
  | "insufficient";

export type BusinessSignalValue =
  | string
  | number
  | bigint
  | boolean
  | Money
  | Percentage;

export class BusinessSignal extends Entity {
  readonly #organizationId: Identifier;
  readonly #category: BusinessSignalCategory;
  readonly #source: string;
  readonly #occurredAt: string;
  readonly #capturedAt: string;
  readonly #subjectId: Identifier | undefined;
  readonly #value: BusinessSignalValue;
  readonly #confidence: Percentage;
  readonly #validationStatus: BusinessSignalValidationStatus;
  readonly #validationNotes: string | undefined;

  constructor(
    id: Identifier,
    organizationId: Identifier,
    category: BusinessSignalCategory,
    source: string,
    occurredAt: string,
    capturedAt: string,
    value: BusinessSignalValue,
    confidence: Percentage,
    validationStatus: BusinessSignalValidationStatus,
    subjectId?: Identifier,
    validationNotes?: string,
  ) {
    super(id);
    const normalizedSource = source.trim();
    const occurredTime = Date.parse(occurredAt);
    const capturedTime = Date.parse(capturedAt);
    if (normalizedSource.length === 0) {
      throw new Error("BusinessSignal source cannot be empty.");
    }
    if (!Number.isFinite(occurredTime) || !Number.isFinite(capturedTime)) {
      throw new Error("BusinessSignal timestamps must be valid date-time values.");
    }
    if (capturedTime < occurredTime) {
      throw new Error("BusinessSignal cannot be captured before it occurred.");
    }

    this.#organizationId = organizationId;
    this.#category = category;
    this.#source = normalizedSource;
    this.#occurredAt = new Date(occurredTime).toISOString();
    this.#capturedAt = new Date(capturedTime).toISOString();
    this.#subjectId = subjectId;
    this.#value = value;
    this.#confidence = confidence;
    this.#validationStatus = validationStatus;
    this.#validationNotes = validationNotes?.trim() || undefined;
    Object.freeze(this);
  }

  get organizationId(): Identifier { return this.#organizationId; }
  get category(): BusinessSignalCategory { return this.#category; }
  get source(): string { return this.#source; }
  get occurredAt(): string { return this.#occurredAt; }
  get capturedAt(): string { return this.#capturedAt; }
  get subjectId(): Identifier | undefined { return this.#subjectId; }
  get value(): BusinessSignalValue { return this.#value; }
  get confidence(): Percentage { return this.#confidence; }
  get validationStatus(): BusinessSignalValidationStatus {
    return this.#validationStatus;
  }
  get validationNotes(): string | undefined { return this.#validationNotes; }
}
