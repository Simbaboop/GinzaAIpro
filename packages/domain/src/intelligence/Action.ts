import { Entity, Identifier } from "../common/index.js";

export type ActionStatus =
  | "planned"
  | "in_progress"
  | "blocked"
  | "completed"
  | "cancelled";

/**
 * A canonical unit of business execution within a RuntimeExecutionPlan.
 * Kernel Action remains the runtime execution and audit record.
 */
export class Action extends Entity {
  readonly #organizationId: Identifier;
  readonly #executionPlanId: Identifier;
  readonly #description: string;
  readonly #ownerId: Identifier | undefined;
  readonly #dueAt: string | undefined;
  readonly #status: ActionStatus;
  readonly #completedAt: string | undefined;
  readonly #evidenceIds: readonly Identifier[];

  constructor(
    id: Identifier,
    organizationId: Identifier,
    executionPlanId: Identifier,
    description: string,
    status: ActionStatus,
    ownerId?: Identifier,
    dueAt?: string,
    completedAt?: string,
    evidenceIds: readonly Identifier[] = [],
  ) {
    super(id);
    const normalizedDescription = description.trim();
    if (normalizedDescription.length === 0) {
      throw new Error("Action description cannot be empty.");
    }

    const normalizedDueAt = this.normalizeTimestamp(dueAt, "due");
    const normalizedCompletedAt = this.normalizeTimestamp(
      completedAt,
      "completion",
    );
    if (status === "completed" && normalizedCompletedAt === undefined) {
      throw new Error("A completed Action requires a completion timestamp.");
    }
    if (status !== "completed" && normalizedCompletedAt !== undefined) {
      throw new Error(
        "An Action completion timestamp requires completed status.",
      );
    }

    this.#organizationId = organizationId;
    this.#executionPlanId = executionPlanId;
    this.#description = normalizedDescription;
    this.#ownerId = ownerId;
    this.#dueAt = normalizedDueAt;
    this.#status = status;
    this.#completedAt = normalizedCompletedAt;
    this.#evidenceIds = Object.freeze([...evidenceIds]);
    Object.freeze(this);
  }

  get organizationId(): Identifier { return this.#organizationId; }
  get executionPlanId(): Identifier { return this.#executionPlanId; }
  get description(): string { return this.#description; }
  get ownerId(): Identifier | undefined { return this.#ownerId; }
  get dueAt(): string | undefined { return this.#dueAt; }
  get status(): ActionStatus { return this.#status; }
  get completedAt(): string | undefined { return this.#completedAt; }
  get evidenceIds(): readonly Identifier[] { return this.#evidenceIds; }

  private normalizeTimestamp(
    value: string | undefined,
    label: string,
  ): string | undefined {
    if (value === undefined) {
      return undefined;
    }
    const time = Date.parse(value);
    if (!Number.isFinite(time)) {
      throw new Error(`Action ${label} time must be a valid date-time value.`);
    }
    return new Date(time).toISOString();
  }
}
