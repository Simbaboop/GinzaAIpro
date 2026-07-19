import { Entity, Identifier, Percentage } from "../common/index.js";

export type IntelligenceCategory =
  | "leakage"
  | "opportunity"
  | "risk"
  | "strength";

export class Intelligence extends Entity {
  readonly #organizationId: Identifier;
  readonly #category: IntelligenceCategory;
  readonly #title: string;
  readonly #explanation: string;
  readonly #evidenceIds: readonly Identifier[];
  readonly #confidence: Percentage;
  readonly #assumptions: readonly string[];
  readonly #limitations: readonly string[];
  readonly #createdAt: string;

  constructor(
    id: Identifier,
    organizationId: Identifier,
    category: IntelligenceCategory,
    title: string,
    explanation: string,
    evidenceIds: readonly Identifier[],
    confidence: Percentage,
    assumptions: readonly string[],
    limitations: readonly string[],
    createdAt: string,
  ) {
    super(id);
    const normalizedTitle = title.trim();
    const normalizedExplanation = explanation.trim();
    const createdTime = Date.parse(createdAt);
    if (normalizedTitle.length === 0 || normalizedExplanation.length === 0) {
      throw new Error("Intelligence title and explanation cannot be empty.");
    }
    if (evidenceIds.length === 0) {
      throw new Error("Intelligence requires at least one evidence identifier.");
    }
    if (!Number.isFinite(createdTime)) {
      throw new Error(
        "Intelligence creation time must be a valid date-time value.",
      );
    }

    this.#organizationId = organizationId;
    this.#category = category;
    this.#title = normalizedTitle;
    this.#explanation = normalizedExplanation;
    this.#evidenceIds = Object.freeze([...evidenceIds]);
    this.#confidence = confidence;
    this.#assumptions = Object.freeze(assumptions.map((value) => value.trim()));
    this.#limitations = Object.freeze(limitations.map((value) => value.trim()));
    this.#createdAt = new Date(createdTime).toISOString();
    Object.freeze(this);
  }

  get organizationId(): Identifier { return this.#organizationId; }
  get category(): IntelligenceCategory { return this.#category; }
  get title(): string { return this.#title; }
  get explanation(): string { return this.#explanation; }
  get evidenceIds(): readonly Identifier[] { return this.#evidenceIds; }
  get confidence(): Percentage { return this.#confidence; }
  get assumptions(): readonly string[] { return this.#assumptions; }
  get limitations(): readonly string[] { return this.#limitations; }
  get createdAt(): string { return this.#createdAt; }
}
