import { Entity, Identifier } from "../common/index.js";
import type { OperationalLeakageCategory } from "./OperationalLeakage.js";

export type PriorityLevel =
  | "Critical"
  | "High"
  | "Medium"
  | "Low"
  | "Informational";

export type PriorityDimension = Readonly<{
  EconomicImpact: PriorityLevel;
  CustomerImpact: PriorityLevel;
  OperationalImpact: PriorityLevel;
  ComplianceImpact: PriorityLevel;
  StrategicAlignment: PriorityLevel;
  Urgency: PriorityLevel;
  Frequency: PriorityLevel;
  Detectability: PriorityLevel;
  Recoverability: PriorityLevel;
}>;

const priorityLevels: readonly PriorityLevel[] = Object.freeze([
  "Critical",
  "High",
  "Medium",
  "Low",
  "Informational",
]);

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

const priorityDimensionNames: readonly (keyof PriorityDimension)[] =
  Object.freeze([
    "EconomicImpact",
    "CustomerImpact",
    "OperationalImpact",
    "ComplianceImpact",
    "StrategicAlignment",
    "Urgency",
    "Frequency",
    "Detectability",
    "Recoverability",
  ]);

const isPriorityLevel = (value: unknown): value is PriorityLevel =>
  typeof value === "string" && priorityLevels.includes(value as PriorityLevel);

const copyDimensions = (dimensions: PriorityDimension): PriorityDimension => {
  if (
    dimensions === null ||
    typeof dimensions !== "object" ||
    Array.isArray(dimensions)
  ) {
    throw new Error("OperationalLeakagePriority dimensions are invalid.");
  }

  const keys = Object.keys(dimensions);
  if (
    keys.length !== priorityDimensionNames.length ||
    priorityDimensionNames.some(
      (name) =>
        !Object.prototype.hasOwnProperty.call(dimensions, name) ||
        !isPriorityLevel(dimensions[name]),
    )
  ) {
    throw new Error("OperationalLeakagePriority dimensions are invalid.");
  }

  return Object.freeze({ ...dimensions });
};

export class PolicyReference {
  readonly #policyId: string;
  readonly #policyVersion: string;
  readonly #ruleId: string;

  constructor(policyId: string, policyVersion: string, ruleId: string) {
    const normalizedPolicyId = policyId.trim();
    const normalizedPolicyVersion = policyVersion.trim();
    const normalizedRuleId = ruleId.trim();

    if (normalizedPolicyId.length === 0) {
      throw new Error("PolicyReference policy identifier cannot be empty.");
    }
    if (normalizedPolicyVersion.length === 0) {
      throw new Error("PolicyReference policy version cannot be empty.");
    }
    if (normalizedRuleId.length === 0) {
      throw new Error("PolicyReference rule identifier cannot be empty.");
    }

    this.#policyId = normalizedPolicyId;
    this.#policyVersion = normalizedPolicyVersion;
    this.#ruleId = normalizedRuleId;
    Object.freeze(this);
  }

  get policyId(): string {
    return this.#policyId;
  }

  get policyVersion(): string {
    return this.#policyVersion;
  }

  get ruleId(): string {
    return this.#ruleId;
  }
}

export class OperationalLeakagePriority extends Entity {
  readonly #organizationId: Identifier;
  readonly #priorityLevel: PriorityLevel;
  readonly #policyReference: PolicyReference;
  readonly #sourceOperationalLeakageId: Identifier;
  readonly #category: OperationalLeakageCategory;
  readonly #dimensions: PriorityDimension;
  readonly #traceId: Identifier;
  readonly #schemaVersion: string;
  readonly #createdAt: string;

  constructor(
    id: Identifier,
    organizationId: Identifier,
    priorityLevel: PriorityLevel,
    policyReference: PolicyReference,
    sourceOperationalLeakageId: Identifier,
    category: OperationalLeakageCategory,
    dimensions: PriorityDimension,
    traceId: Identifier,
    schemaVersion: string,
    createdAt: string,
  ) {
    super(id);

    const normalizedPriorityLevel = priorityLevel.trim();
    const normalizedCategory =
      typeof category === "string" ? category.trim() : "";
    const normalizedSchemaVersion = schemaVersion.trim();

    if (!(organizationId instanceof Identifier)) {
      throw new Error(
        "OperationalLeakagePriority requires a valid organization identifier.",
      );
    }
    if (!isPriorityLevel(normalizedPriorityLevel)) {
      throw new Error(
        "OperationalLeakagePriority priority level is not supported.",
      );
    }
    if (!(policyReference instanceof PolicyReference)) {
      throw new Error(
        "OperationalLeakagePriority requires a valid policy reference.",
      );
    }
    if (!(sourceOperationalLeakageId instanceof Identifier)) {
      throw new Error(
        "OperationalLeakagePriority requires a valid source leakage identifier.",
      );
    }
    if (
      !operationalLeakageCategories.includes(
        normalizedCategory as OperationalLeakageCategory,
      )
    ) {
      throw new Error(
        "OperationalLeakagePriority category is not supported.",
      );
    }
    if (!(traceId instanceof Identifier)) {
      throw new Error(
        "OperationalLeakagePriority requires a valid trace identifier.",
      );
    }
    if (normalizedSchemaVersion.length === 0) {
      throw new Error(
        "OperationalLeakagePriority schema version cannot be empty.",
      );
    }

    const createdTime = Date.parse(createdAt);
    if (!Number.isFinite(createdTime)) {
      throw new Error(
        "OperationalLeakagePriority creation time must be a valid date-time value.",
      );
    }

    this.#organizationId = organizationId;
    this.#priorityLevel = normalizedPriorityLevel;
    this.#policyReference = policyReference;
    this.#sourceOperationalLeakageId = sourceOperationalLeakageId;
    this.#category = normalizedCategory as OperationalLeakageCategory;
    this.#dimensions = copyDimensions(dimensions);
    this.#traceId = traceId;
    this.#schemaVersion = normalizedSchemaVersion;
    this.#createdAt = new Date(createdTime).toISOString();
    Object.freeze(this);
  }

  get organizationId(): Identifier {
    return this.#organizationId;
  }

  get priorityLevel(): PriorityLevel {
    return this.#priorityLevel;
  }

  get policyReference(): PolicyReference {
    return this.#policyReference;
  }

  get sourceOperationalLeakageId(): Identifier {
    return this.#sourceOperationalLeakageId;
  }

  get category(): OperationalLeakageCategory {
    return this.#category;
  }

  get dimensions(): PriorityDimension {
    return this.#dimensions;
  }

  get traceId(): Identifier {
    return this.#traceId;
  }

  get schemaVersion(): string {
    return this.#schemaVersion;
  }

  get createdAt(): string {
    return this.#createdAt;
  }
}
