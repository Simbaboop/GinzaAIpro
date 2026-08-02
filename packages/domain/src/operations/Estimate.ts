import { Entity, Identifier, Money, TimePeriod } from "../common/index.js";

export type EstimateStatus = "draft" | "sent" | "accepted" | "declined" | "expired";

export class Estimate extends Entity {
  readonly #organizationId: Identifier;
  readonly #customerId: Identifier;
  readonly #amount: Money;
  readonly #status: EstimateStatus;
  readonly #validFor: TimePeriod;

  constructor(
    id: Identifier,
    organizationId: Identifier,
    customerId: Identifier,
    amount: Money,
    status: EstimateStatus,
    validFor: TimePeriod,
  ) {
    super(id);
    this.#organizationId = organizationId;
    this.#customerId = customerId;
    this.#amount = amount;
    this.#status = status;
    this.#validFor = validFor;
    Object.freeze(this);
  }

  get organizationId(): Identifier { return this.#organizationId; }
  get customerId(): Identifier { return this.#customerId; }
  get amount(): Money { return this.#amount; }
  get status(): EstimateStatus { return this.#status; }
  get validFor(): TimePeriod { return this.#validFor; }
}
