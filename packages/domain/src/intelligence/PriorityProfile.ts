import { Entity, Identifier, Percentage } from "../common/index.js";

export class PriorityProfile extends Entity {
  readonly #organizationId: Identifier;
  readonly #intelligenceId: Identifier;
  readonly #impact: Percentage;
  readonly #urgency: Percentage;
  readonly #confidence: Percentage;
  readonly #feasibility: Percentage;
  readonly #strategicAlignment: Percentage;
  readonly #rationale: string | undefined;

  constructor(
    id: Identifier,
    organizationId: Identifier,
    intelligenceId: Identifier,
    impact: Percentage,
    urgency: Percentage,
    confidence: Percentage,
    feasibility: Percentage,
    strategicAlignment: Percentage,
    rationale?: string,
  ) {
    super(id);
    this.#organizationId = organizationId;
    this.#intelligenceId = intelligenceId;
    this.#impact = impact;
    this.#urgency = urgency;
    this.#confidence = confidence;
    this.#feasibility = feasibility;
    this.#strategicAlignment = strategicAlignment;
    this.#rationale = rationale?.trim() || undefined;
    Object.freeze(this);
  }

  get organizationId(): Identifier { return this.#organizationId; }
  get intelligenceId(): Identifier { return this.#intelligenceId; }
  get impact(): Percentage { return this.#impact; }
  get urgency(): Percentage { return this.#urgency; }
  get confidence(): Percentage { return this.#confidence; }
  get feasibility(): Percentage { return this.#feasibility; }
  get strategicAlignment(): Percentage { return this.#strategicAlignment; }
  get rationale(): string | undefined { return this.#rationale; }
}
