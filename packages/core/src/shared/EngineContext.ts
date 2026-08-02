import type { Identifier } from "@ginzaaipro/domain";

export class EngineContext {
  readonly #organizationId: Identifier;
  readonly #correlationId: Identifier;
  readonly #executionTimeMs: number;
  readonly #initiatedBy: Identifier | undefined;

  constructor(
    organizationId: Identifier,
    correlationId: Identifier,
    executionTime: Date,
    initiatedBy?: Identifier,
  ) {
    const executionTimeMs = executionTime.getTime();
    if (!Number.isFinite(executionTimeMs)) {
      throw new Error("EngineContext execution time must be valid.");
    }

    this.#organizationId = organizationId;
    this.#correlationId = correlationId;
    this.#executionTimeMs = executionTimeMs;
    this.#initiatedBy = initiatedBy;
    Object.freeze(this);
  }

  get organizationId(): Identifier { return this.#organizationId; }
  get correlationId(): Identifier { return this.#correlationId; }
  get executionTime(): Date { return new Date(this.#executionTimeMs); }
  get initiatedBy(): Identifier | undefined { return this.#initiatedBy; }
}
