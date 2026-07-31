export type DeclarativeRuleValue =
  | string
  | number
  | boolean
  | null
  | readonly DeclarativeRuleValue[]
  | DeclarativeRuleRecord;

export type DeclarativeRuleRecord = Readonly<{
  [key: string]: DeclarativeRuleValue;
}>;

const normalizeRequiredString = (value: string, field: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`RecommendationRule ${field} cannot be empty.`);
  }

  return value.trim();
};

const normalizeDate = (value: string, field: string): string => {
  if (typeof value !== "string") {
    throw new Error(
      `RecommendationRule ${field} must be a valid date-time value.`,
    );
  }

  const time = Date.parse(value);
  if (!Number.isFinite(time)) {
    throw new Error(
      `RecommendationRule ${field} must be a valid date-time value.`,
    );
  }

  return new Date(time).toISOString();
};

const copyDeclarativeValue = (
  value: unknown,
  field: string,
  ancestors: ReadonlySet<object>,
): DeclarativeRuleValue => {
  if (value === null) {
    return null;
  }

  if (typeof value === "string" || typeof value === "boolean") {
    return value;
  }

  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new Error(
        `RecommendationRule ${field} must contain only deterministic declarative data.`,
      );
    }
    return value;
  }

  if (typeof value !== "object") {
    throw new Error(
      `RecommendationRule ${field} must contain only deterministic declarative data and cannot contain functions.`,
    );
  }

  if (ancestors.has(value)) {
    throw new Error(
      `RecommendationRule ${field} cannot contain circular declarative data.`,
    );
  }

  const nextAncestors = new Set(ancestors);
  nextAncestors.add(value);

  if (Array.isArray(value)) {
    return Object.freeze(
      value.map((item) => copyDeclarativeValue(item, field, nextAncestors)),
    );
  }

  const prototype = Object.getPrototypeOf(value);
  if (prototype !== Object.prototype && prototype !== null) {
    throw new Error(
      `RecommendationRule ${field} must contain only plain declarative data.`,
    );
  }

  const entries = Reflect.ownKeys(value).map((key) => {
    if (typeof key !== "string") {
      throw new Error(
        `RecommendationRule ${field} must contain only string-keyed declarative data.`,
      );
    }

    const descriptor = Object.getOwnPropertyDescriptor(value, key);
    if (
      descriptor === undefined ||
      !("value" in descriptor) ||
      !descriptor.enumerable
    ) {
      throw new Error(
        `RecommendationRule ${field} must contain only plain declarative data.`,
      );
    }

    return [
      key,
      copyDeclarativeValue(descriptor.value, field, nextAncestors),
    ] as const;
  });

  return Object.freeze(Object.fromEntries(entries)) as DeclarativeRuleRecord;
};

const copyDeclarativeRecord = (
  value: DeclarativeRuleRecord,
  field: string,
): DeclarativeRuleRecord => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    throw new Error(
      `RecommendationRule ${field} must be a declarative object.`,
    );
  }

  return copyDeclarativeValue(value, field, new Set()) as DeclarativeRuleRecord;
};

export class RecommendationRule {
  readonly #ruleId: string;
  readonly #ruleVersion: string;
  readonly #policyId: string;
  readonly #policyVersion: string;
  readonly #enabled: boolean;
  readonly #effectiveFrom: string;
  readonly #effectiveTo: string | undefined;
  readonly #priority: number;
  readonly #predicate: DeclarativeRuleRecord;
  readonly #outputTemplate: DeclarativeRuleRecord;
  readonly #metadata: DeclarativeRuleRecord;

  constructor(
    ruleId: string,
    ruleVersion: string,
    policyId: string,
    policyVersion: string,
    enabled: boolean,
    effectiveFrom: string,
    effectiveTo: string | undefined,
    priority: number,
    predicate: DeclarativeRuleRecord,
    outputTemplate: DeclarativeRuleRecord,
    metadata: DeclarativeRuleRecord,
  ) {
    const normalizedRuleId = normalizeRequiredString(
      ruleId,
      "rule identifier",
    );
    const normalizedRuleVersion = normalizeRequiredString(
      ruleVersion,
      "rule version",
    );
    const normalizedPolicyId = normalizeRequiredString(
      policyId,
      "policy identifier",
    );
    const normalizedPolicyVersion = normalizeRequiredString(
      policyVersion,
      "policy version",
    );

    if (typeof enabled !== "boolean") {
      throw new Error("RecommendationRule enabled must be a boolean value.");
    }

    const normalizedEffectiveFrom = normalizeDate(
      effectiveFrom,
      "effective-from date",
    );
    const normalizedEffectiveTo =
      effectiveTo === undefined
        ? undefined
        : normalizeDate(effectiveTo, "effective-to date");

    if (
      normalizedEffectiveTo !== undefined &&
      Date.parse(normalizedEffectiveTo) < Date.parse(normalizedEffectiveFrom)
    ) {
      throw new Error(
        "RecommendationRule effective-to date cannot precede its effective-from date.",
      );
    }

    if (!Number.isSafeInteger(priority) || priority < 0) {
      throw new Error(
        "RecommendationRule priority must be a non-negative safe integer.",
      );
    }

    this.#ruleId = normalizedRuleId;
    this.#ruleVersion = normalizedRuleVersion;
    this.#policyId = normalizedPolicyId;
    this.#policyVersion = normalizedPolicyVersion;
    this.#enabled = enabled;
    this.#effectiveFrom = normalizedEffectiveFrom;
    this.#effectiveTo = normalizedEffectiveTo;
    this.#priority = priority;
    this.#predicate = copyDeclarativeRecord(predicate, "predicate");
    this.#outputTemplate = copyDeclarativeRecord(
      outputTemplate,
      "output template",
    );
    this.#metadata = copyDeclarativeRecord(metadata, "metadata");
    Object.freeze(this);
  }

  get ruleId(): string {
    return this.#ruleId;
  }

  get ruleVersion(): string {
    return this.#ruleVersion;
  }

  get policyId(): string {
    return this.#policyId;
  }

  get policyVersion(): string {
    return this.#policyVersion;
  }

  get enabled(): boolean {
    return this.#enabled;
  }

  get effectiveFrom(): string {
    return this.#effectiveFrom;
  }

  get effectiveTo(): string | undefined {
    return this.#effectiveTo;
  }

  get priority(): number {
    return this.#priority;
  }

  get predicate(): DeclarativeRuleRecord {
    return this.#predicate;
  }

  get outputTemplate(): DeclarativeRuleRecord {
    return this.#outputTemplate;
  }

  get metadata(): DeclarativeRuleRecord {
    return this.#metadata;
  }
}
