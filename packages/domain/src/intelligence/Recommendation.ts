import { Entity, Identifier, Percentage } from "../common/index.js";

export class Recommendation extends Entity {
  readonly #organizationId: Identifier;
  readonly #findingId: Identifier;
  readonly #proposedAction: string;
  readonly #rationale: string;
  readonly #confidence: Percentage;

  constructor(
    id: Identifier,
    organizationId: Identifier,
    findingId: Identifier,
    proposedAction: string,
    rationale: string,
    confidence: Percentage,
  ) {
    super(id);
    if (proposedAction.trim().length === 0 || rationale.trim().length === 0) {
      throw new Error("Recommendation action and rationale cannot be empty.");
    }

    this.#organizationId = organizationId;
    this.#findingId = findingId;
    this.#proposedAction = proposedAction.trim();
    this.#rationale = rationale.trim();
    this.#confidence = confidence;
    Object.freeze(this);
  }

  get organizationId(): Identifier { return this.#organizationId; }
  get findingId(): Identifier { return this.#findingId; }
  get proposedAction(): string { return this.#proposedAction; }
  get rationale(): string { return this.#rationale; }
  get confidence(): Percentage { return this.#confidence; }
}
