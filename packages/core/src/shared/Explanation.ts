import type { Identifier, Percentage } from "@ginzaaipro/domain";

export class Explanation {
  readonly #evidenceIds: readonly Identifier[];
  readonly #assumptions: readonly string[];
  readonly #limitations: readonly string[];
  readonly #confidence: Percentage;
  readonly #reasoning: string;

  constructor(
    evidenceIds: readonly Identifier[],
    assumptions: readonly string[],
    limitations: readonly string[],
    confidence: Percentage,
    reasoning: string,
  ) {
    const normalizedReasoning = reasoning.trim();
    if (normalizedReasoning.length === 0) {
      throw new Error("Explanation reasoning cannot be empty.");
    }

    this.#evidenceIds = Object.freeze([...evidenceIds]);
    this.#assumptions = Object.freeze(
      assumptions.map((value) => value.trim()),
    );
    this.#limitations = Object.freeze(
      limitations.map((value) => value.trim()),
    );
    this.#confidence = confidence;
    this.#reasoning = normalizedReasoning;
    Object.freeze(this);
  }

  get evidenceIds(): readonly Identifier[] { return this.#evidenceIds; }
  get assumptions(): readonly string[] { return this.#assumptions; }
  get limitations(): readonly string[] { return this.#limitations; }
  get confidence(): Percentage { return this.#confidence; }
  get reasoning(): string { return this.#reasoning; }
}
