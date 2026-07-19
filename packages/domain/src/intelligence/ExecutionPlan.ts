import { Entity, Identifier } from "../common/index.js";

export type ExecutionPlanStatus =
  | "planned"
  | "active"
  | "blocked"
  | "completed"
  | "cancelled";

export class ExecutionPlan extends Entity {
  readonly #organizationId: Identifier;
  readonly #recommendationId: Identifier;
  readonly #objective: string;
  readonly #ownerId: Identifier | undefined;
  readonly #actionIds: readonly Identifier[];
  readonly #successCriteria: readonly string[];
  readonly #dueAt: string | undefined;
  readonly #status: ExecutionPlanStatus;
  readonly #verificationRequirements: readonly string[];

  constructor(
    id: Identifier,
    organizationId: Identifier,
    recommendationId: Identifier,
    objective: string,
    actionIds: readonly Identifier[],
    successCriteria: readonly string[],
    status: ExecutionPlanStatus,
    verificationRequirements: readonly string[],
    ownerId?: Identifier,
    dueAt?: string,
  ) {
    super(id);
    const normalizedObjective = objective.trim();
    if (normalizedObjective.length === 0) {
      throw new Error("ExecutionPlan objective cannot be empty.");
    }
    if (actionIds.length === 0) {
      throw new Error("ExecutionPlan requires at least one action identifier.");
    }
    if (successCriteria.length === 0) {
      throw new Error("ExecutionPlan requires at least one success criterion.");
    }
    if (verificationRequirements.length === 0) {
      throw new Error(
        "ExecutionPlan requires at least one verification requirement.",
      );
    }

    let normalizedDueAt: string | undefined;
    if (dueAt !== undefined) {
      const dueTime = Date.parse(dueAt);
      if (!Number.isFinite(dueTime)) {
        throw new Error(
          "ExecutionPlan due time must be a valid date-time value.",
        );
      }
      normalizedDueAt = new Date(dueTime).toISOString();
    }

    this.#organizationId = organizationId;
    this.#recommendationId = recommendationId;
    this.#objective = normalizedObjective;
    this.#ownerId = ownerId;
    this.#actionIds = Object.freeze([...actionIds]);
    this.#successCriteria = Object.freeze(
      successCriteria.map((value) => value.trim()),
    );
    this.#dueAt = normalizedDueAt;
    this.#status = status;
    this.#verificationRequirements = Object.freeze(
      verificationRequirements.map((value) => value.trim()),
    );
    Object.freeze(this);
  }

  get organizationId(): Identifier { return this.#organizationId; }
  get recommendationId(): Identifier { return this.#recommendationId; }
  get objective(): string { return this.#objective; }
  get ownerId(): Identifier | undefined { return this.#ownerId; }
  get actionIds(): readonly Identifier[] { return this.#actionIds; }
  get successCriteria(): readonly string[] { return this.#successCriteria; }
  get dueAt(): string | undefined { return this.#dueAt; }
  get status(): ExecutionPlanStatus { return this.#status; }
  get verificationRequirements(): readonly string[] {
    return this.#verificationRequirements;
  }
}
