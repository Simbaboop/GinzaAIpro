import {
  Entity,
  Identifier,
  Money,
  Percentage,
  TimePeriod,
} from "../common/index.js";

export type OutcomeMeasurement = number | bigint | Money | Percentage;

export class Outcome extends Entity {
  readonly #organizationId: Identifier;
  readonly #executionPlanId: Identifier;
  readonly #metric: string;
  readonly #baseline: OutcomeMeasurement;
  readonly #actual: OutcomeMeasurement;
  readonly #delta: OutcomeMeasurement;
  readonly #unit: string;
  readonly #confidence: Percentage;
  readonly #measurementPeriod: TimePeriod;
  readonly #evidenceIds: readonly Identifier[];

  constructor(
    id: Identifier,
    organizationId: Identifier,
    executionPlanId: Identifier,
    metric: string,
    baseline: OutcomeMeasurement,
    actual: OutcomeMeasurement,
    delta: OutcomeMeasurement,
    unit: string,
    confidence: Percentage,
    measurementPeriod: TimePeriod,
    evidenceIds: readonly Identifier[],
  ) {
    super(id);
    const normalizedMetric = metric.trim();
    const normalizedUnit = unit.trim();
    if (normalizedMetric.length === 0 || normalizedUnit.length === 0) {
      throw new Error("Outcome metric and unit cannot be empty.");
    }
    if (evidenceIds.length === 0) {
      throw new Error(
        "Outcome requires at least one supporting evidence identifier.",
      );
    }

    this.#organizationId = organizationId;
    this.#executionPlanId = executionPlanId;
    this.#metric = normalizedMetric;
    this.#baseline = baseline;
    this.#actual = actual;
    this.#delta = delta;
    this.#unit = normalizedUnit;
    this.#confidence = confidence;
    this.#measurementPeriod = measurementPeriod;
    this.#evidenceIds = Object.freeze([...evidenceIds]);
    Object.freeze(this);
  }

  get organizationId(): Identifier { return this.#organizationId; }
  get executionPlanId(): Identifier { return this.#executionPlanId; }
  get metric(): string { return this.#metric; }
  get baseline(): OutcomeMeasurement { return this.#baseline; }
  get actual(): OutcomeMeasurement { return this.#actual; }
  get delta(): OutcomeMeasurement { return this.#delta; }
  get unit(): string { return this.#unit; }
  get confidence(): Percentage { return this.#confidence; }
  get measurementPeriod(): TimePeriod { return this.#measurementPeriod; }
  get evidenceIds(): readonly Identifier[] { return this.#evidenceIds; }
}
