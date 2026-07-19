import type {
  BusinessSignalCategory,
  BusinessSignalValue,
  Identifier,
  Percentage,
} from "@ginzaaipro/domain";

export class CaptureInput {
  readonly #organizationId: Identifier;
  readonly #category: BusinessSignalCategory;
  readonly #source: string;
  readonly #sourceReference: string;
  readonly #occurredAt: string;
  readonly #value: BusinessSignalValue;
  readonly #deterministicIdentityMaterial: string;
  readonly #subjectId: Identifier | undefined;
  readonly #confidence: Percentage | undefined;

  constructor(
    organizationId: Identifier,
    category: BusinessSignalCategory,
    source: string,
    sourceReference: string,
    occurredAt: string,
    value: BusinessSignalValue,
    deterministicIdentityMaterial: string,
    subjectId?: Identifier,
    confidence?: Percentage,
  ) {
    this.#organizationId = organizationId;
    this.#category = category;
    this.#source = source;
    this.#sourceReference = sourceReference;
    this.#occurredAt = occurredAt;
    this.#value = value;
    this.#deterministicIdentityMaterial = deterministicIdentityMaterial;
    this.#subjectId = subjectId;
    this.#confidence = confidence;
    Object.freeze(this);
  }

  get organizationId(): Identifier { return this.#organizationId; }
  get category(): BusinessSignalCategory { return this.#category; }
  get source(): string { return this.#source; }
  get sourceReference(): string { return this.#sourceReference; }
  get occurredAt(): string { return this.#occurredAt; }
  get value(): BusinessSignalValue { return this.#value; }
  get deterministicIdentityMaterial(): string {
    return this.#deterministicIdentityMaterial;
  }
  get subjectId(): Identifier | undefined { return this.#subjectId; }
  get confidence(): Percentage | undefined { return this.#confidence; }
}
