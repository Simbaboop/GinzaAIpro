import { Entity, Identifier } from "../common/index.js";

export type OperationalLeakageCategory =
  | "Revenue"
  | "Cost"
  | "Capacity"
  | "Time"
  | "Compliance"
  | "Quality"
  | "CustomerExperience"
  | "Opportunity"
  | "Risk";

export type EvidenceStrength =
  | "Verified"
  | "Strong"
  | "Moderate"
  | "Weak";

const operationalLeakageCategories: readonly OperationalLeakageCategory[] =
  Object.freeze([
    "Revenue",
    "Cost",
    "Capacity",
    "Time",
    "Compliance",
    "Quality",
    "CustomerExperience",
    "Opportunity",
    "Risk",
  ]);

const evidenceStrengths: readonly EvidenceStrength[] = Object.freeze([
  "Verified",
  "Strong",
  "Moderate",
  "Weak",
]);

export class OperationalLeakage extends Entity {
  readonly #organizationId: Identifier;
  readonly #category: OperationalLeakageCategory;
  readonly #title: string;
  readonly #description: string;
  readonly #sourceConditionIds: readonly Identifier[];
  readonly #traceId: Identifier;
  readonly #schemaVersion: string;
  readonly #ruleSetVersion: string;
  readonly #ruleId: string;
  readonly #evidenceStrength: EvidenceStrength;
  readonly #createdAt: string;

  constructor(
    id: Identifier,
    organizationId: Identifier,
    category: OperationalLeakageCategory,
    title: string,
    description: string,
    sourceConditionIds: readonly Identifier[],
    traceId: Identifier,
    schemaVersion: string,
    ruleSetVersion: string,
    ruleId: string,
    evidenceStrength: EvidenceStrength,
    createdAt: string,
  ) {
    super(id);

    const normalizedCategory = category.trim();
    const normalizedTitle = title.trim();
    const normalizedDescription = description.trim();
    const normalizedSchemaVersion = schemaVersion.trim();
    const normalizedRuleSetVersion = ruleSetVersion.trim();
    const normalizedRuleId = ruleId.trim();
    const normalizedEvidenceStrength = evidenceStrength.trim();

    if (!(organizationId instanceof Identifier)) {
      throw new Error(
        "OperationalLeakage requires a valid organization identifier.",
      );
    }
    if (
      !operationalLeakageCategories.includes(
        normalizedCategory as OperationalLeakageCategory,
      )
    ) {
      throw new Error("OperationalLeakage category is not supported.");
    }
    if (normalizedTitle.length === 0) {
      throw new Error("OperationalLeakage title cannot be empty.");
    }
    if (normalizedDescription.length === 0) {
      throw new Error("OperationalLeakage description cannot be empty.");
    }
    if (
      sourceConditionIds.length === 0 ||
      sourceConditionIds.some((value) => !(value instanceof Identifier))
    ) {
      throw new Error(
        "OperationalLeakage requires at least one source-condition identifier.",
      );
    }
    if (!(traceId instanceof Identifier)) {
      throw new Error(
        "OperationalLeakage requires a valid trace identifier.",
      );
    }
    if (normalizedSchemaVersion.length === 0) {
      throw new Error("OperationalLeakage schema version cannot be empty.");
    }
    if (normalizedRuleSetVersion.length === 0) {
      throw new Error("OperationalLeakage rule-set version cannot be empty.");
    }
    if (normalizedRuleId.length === 0) {
      throw new Error("OperationalLeakage rule identifier cannot be empty.");
    }
    if (
      !evidenceStrengths.includes(
        normalizedEvidenceStrength as EvidenceStrength,
      )
    ) {
      throw new Error(
        "OperationalLeakage evidence strength is not supported.",
      );
    }

    const createdTime = Date.parse(createdAt);
    if (!Number.isFinite(createdTime)) {
      throw new Error(
        "OperationalLeakage creation time must be a valid date-time value.",
      );
    }

    this.#organizationId = organizationId;
    this.#category = normalizedCategory as OperationalLeakageCategory;
    this.#title = normalizedTitle;
    this.#description = normalizedDescription;
    this.#sourceConditionIds = Object.freeze([...sourceConditionIds]);
    this.#traceId = traceId;
    this.#schemaVersion = normalizedSchemaVersion;
    this.#ruleSetVersion = normalizedRuleSetVersion;
    this.#ruleId = normalizedRuleId;
    this.#evidenceStrength = normalizedEvidenceStrength as EvidenceStrength;
    this.#createdAt = new Date(createdTime).toISOString();
    Object.freeze(this);
  }

  get organizationId(): Identifier {
    return this.#organizationId;
  }

  get category(): OperationalLeakageCategory {
    return this.#category;
  }

  get title(): string {
    return this.#title;
  }

  get description(): string {
    return this.#description;
  }

  get sourceConditionIds(): readonly Identifier[] {
    return this.#sourceConditionIds;
  }

  get traceId(): Identifier {
    return this.#traceId;
  }

  get schemaVersion(): string {
    return this.#schemaVersion;
  }

  get ruleSetVersion(): string {
    return this.#ruleSetVersion;
  }

  get ruleId(): string {
    return this.#ruleId;
  }

  get evidenceStrength(): EvidenceStrength {
    return this.#evidenceStrength;
  }

  get createdAt(): string {
    return this.#createdAt;
  }
}
