import { Entity, Identifier, Money, Percentage } from "../common/index.js";

export class Leakage extends Entity {
  readonly #organizationId: Identifier;
  readonly #findingId: Identifier;
  readonly #estimatedImpact: Money;
  readonly #confidence: Percentage;
  readonly #evidenceIds: readonly Identifier[];

  constructor(
    id: Identifier,
    organizationId: Identifier,
    findingId: Identifier,
    estimatedImpact: Money,
    confidence: Percentage,
    evidenceIds: readonly Identifier[],
  ) {
    super(id);
    this.#organizationId = organizationId;
    this.#findingId = findingId;
    this.#estimatedImpact = estimatedImpact;
    this.#confidence = confidence;
    this.#evidenceIds = Object.freeze([...evidenceIds]);
    Object.freeze(this);
  }

  get organizationId(): Identifier {
    return this.#organizationId;
  }

  get findingId(): Identifier {
    return this.#findingId;
  }

  get estimatedImpact(): Money {
    return this.#estimatedImpact;
  }

  get confidence(): Percentage {
    return this.#confidence;
  }

  get evidenceIds(): readonly Identifier[] {
    return this.#evidenceIds;
  }
}
