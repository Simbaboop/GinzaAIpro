import { Entity, Identifier, Money } from "../common/index.js";

export type InvoiceStatus = "draft" | "issued" | "paid" | "overdue" | "void";

export class Invoice extends Entity {
  readonly #organizationId: Identifier;
  readonly #customerId: Identifier;
  readonly #amountDue: Money;
  readonly #status: InvoiceStatus;
  readonly #dueAt: string;

  constructor(
    id: Identifier,
    organizationId: Identifier,
    customerId: Identifier,
    amountDue: Money,
    status: InvoiceStatus,
    dueAt: string,
  ) {
    super(id);
    const dueTime = Date.parse(dueAt);
    if (!Number.isFinite(dueTime)) {
      throw new Error("Invoice due time must be a valid date-time value.");
    }

    this.#organizationId = organizationId;
    this.#customerId = customerId;
    this.#amountDue = amountDue;
    this.#status = status;
    this.#dueAt = new Date(dueTime).toISOString();
    Object.freeze(this);
  }

  get organizationId(): Identifier { return this.#organizationId; }
  get customerId(): Identifier { return this.#customerId; }
  get amountDue(): Money { return this.#amountDue; }
  get status(): InvoiceStatus { return this.#status; }
  get dueAt(): string { return this.#dueAt; }
}
