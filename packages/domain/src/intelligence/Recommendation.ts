import { Entity, Identifier, Percentage } from "../common/index.js";

export class Recommendation extends Entity {
  readonly #organizationId: Identifier;
  readonly #intelligenceIds: readonly Identifier[];
  readonly #priorityProfileId: Identifier;
  readonly #title: string;
  readonly #description: string;
  readonly #expectedImpact: string;
  readonly #confidence: Percentage;
  readonly #assumptions: readonly string[];
  readonly #limitations: readonly string[];

  constructor(
    id: Identifier,
    organizationId: Identifier,
    intelligenceIds: readonly Identifier[],
    priorityProfileId: Identifier,
    title: string,
    description: string,
    expectedImpact: string,
    confidence: Percentage,
    assumptions: readonly string[],
    limitations: readonly string[],
  ) {
    super(id);
    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();
    const normalizedImpact = expectedImpact.trim();
    if (!(priorityProfileId instanceof Identifier)) {
      throw new Error(
        "Recommendation requires a priority-profile identifier.",
      );
    }
    if (intelligenceIds.length === 0) {
      throw new Error(
        "Recommendation requires at least one intelligence identifier.",
      );
    }
    if (
      normalizedTitle.length === 0 ||
      normalizedDescription.length === 0 ||
      normalizedImpact.length === 0
    ) {
      throw new Error(
        "Recommendation title, description, and expected impact cannot be empty.",
      );
    }

    this.#organizationId = organizationId;
    this.#intelligenceIds = Object.freeze([...intelligenceIds]);
    this.#priorityProfileId = priorityProfileId;
    this.#title = normalizedTitle;
    this.#description = normalizedDescription;
    this.#expectedImpact = normalizedImpact;
    this.#confidence = confidence;
    this.#assumptions = Object.freeze(assumptions.map((value) => value.trim()));
    this.#limitations = Object.freeze(limitations.map((value) => value.trim()));
    Object.freeze(this);
  }

  get organizationId(): Identifier { return this.#organizationId; }
  get intelligenceIds(): readonly Identifier[] {
    return this.#intelligenceIds;
  }
  get priorityProfileId(): Identifier { return this.#priorityProfileId; }
  get title(): string { return this.#title; }
  get description(): string { return this.#description; }
  get expectedImpact(): string { return this.#expectedImpact; }
  get confidence(): Percentage { return this.#confidence; }
  get assumptions(): readonly string[] { return this.#assumptions; }
  get limitations(): readonly string[] { return this.#limitations; }
}
