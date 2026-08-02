import { Entity, Identifier, TimePeriod } from "../common/index.js";

export type JobStatus =
  | "planned"
  | "in_progress"
  | "completed"
  | "cancelled";

export class Job extends Entity {
  readonly #organizationId: Identifier;
  readonly #customerId: Identifier;
  readonly #description: string;
  readonly #status: JobStatus;
  readonly #scheduledFor: TimePeriod | undefined;

  constructor(
    id: Identifier,
    organizationId: Identifier,
    customerId: Identifier,
    description: string,
    status: JobStatus,
    scheduledFor?: TimePeriod,
  ) {
    super(id);
    const normalizedDescription = description.trim();
    if (normalizedDescription.length === 0) {
      throw new Error("Job description cannot be empty.");
    }

    this.#organizationId = organizationId;
    this.#customerId = customerId;
    this.#description = normalizedDescription;
    this.#status = status;
    this.#scheduledFor = scheduledFor;
    Object.freeze(this);
  }

  get organizationId(): Identifier { return this.#organizationId; }
  get customerId(): Identifier { return this.#customerId; }
  get description(): string { return this.#description; }
  get status(): JobStatus { return this.#status; }
  get scheduledFor(): TimePeriod | undefined { return this.#scheduledFor; }
}
