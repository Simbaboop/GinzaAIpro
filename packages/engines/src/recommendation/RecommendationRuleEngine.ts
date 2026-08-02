import {
  Identifier,
  OperationalLeakagePriority,
  OperationalRecommendation,
  RecommendationRule,
  type DeclarativeRuleRecord,
  type DeclarativeRuleValue,
  type OperationalLeakageCategory,
  type PriorityDimension,
  type PriorityLevel,
} from "@ginzaaipro/domain";

export type RecommendationRuleEngineFailureCode =
  | "RejectedInput"
  | "RuleConflict"
  | "ValidationFailure"
  | "PolicyConflict"
  | "SystemFailure";

export type RecommendationRuleEngineInput = Readonly<{
  operationalLeakagePriority: OperationalLeakagePriority;
  evaluationTime: string;
}>;

type PredicateOperator =
  | "equals"
  | "notEquals"
  | "greaterThan"
  | "greaterThanOrEqual"
  | "lessThan"
  | "lessThanOrEqual";

type ComparableValue = string | number | boolean | null;

type SupportedField =
  | "priorityLevel"
  | "category"
  | "schemaVersion"
  | "createdAt"
  | "sourceOperationalLeakageId"
  | "policyReference.policyId"
  | "policyReference.policyVersion"
  | "policyReference.ruleId"
  | "dimensions.EconomicImpact"
  | "dimensions.CustomerImpact"
  | "dimensions.OperationalImpact"
  | "dimensions.ComplianceImpact"
  | "dimensions.StrategicAlignment"
  | "dimensions.Urgency"
  | "dimensions.Frequency"
  | "dimensions.Detectability"
  | "dimensions.Recoverability";

type PredicateCondition = Readonly<{
  field: SupportedField;
  operator: PredicateOperator;
  value: ComparableValue;
}>;

const priorityLevels: readonly PriorityLevel[] = Object.freeze([
  "Critical",
  "High",
  "Medium",
  "Low",
  "Informational",
]);

const leakageCategories: readonly OperationalLeakageCategory[] = Object.freeze([
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

const dimensionNames: readonly (keyof PriorityDimension)[] = Object.freeze([
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

const predicateOperators: readonly PredicateOperator[] = Object.freeze([
  "equals",
  "notEquals",
  "greaterThan",
  "greaterThanOrEqual",
  "lessThan",
  "lessThanOrEqual",
]);

const baseFields: readonly SupportedField[] = Object.freeze([
  "priorityLevel",
  "category",
  "schemaVersion",
  "createdAt",
  "sourceOperationalLeakageId",
  "policyReference.policyId",
  "policyReference.policyVersion",
  "policyReference.ruleId",
]);

const offsetDateTimePattern =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/u;

const isPlainRecord = (value: unknown): value is DeclarativeRuleRecord => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const compareOrdinal = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const isSupportedField = (value: unknown): value is SupportedField => {
  if (typeof value !== "string") {
    return false;
  }
  if (baseFields.includes(value as SupportedField)) {
    return true;
  }
  if (!value.startsWith("dimensions.")) {
    return false;
  }
  return dimensionNames.includes(
    value.slice("dimensions.".length) as keyof PriorityDimension,
  );
};

const isComparableValue = (value: unknown): value is ComparableValue =>
  value === null ||
  typeof value === "string" ||
  typeof value === "boolean" ||
  (typeof value === "number" && Number.isFinite(value));

export class RecommendationRuleEngineError extends Error {
  readonly #code: RecommendationRuleEngineFailureCode;

  constructor(code: RecommendationRuleEngineFailureCode, message: string) {
    super(message);
    this.name = "RecommendationRuleEngineError";
    this.#code = code;
    Object.freeze(this);
  }

  get code(): RecommendationRuleEngineFailureCode {
    return this.#code;
  }
}

const fail = (
  code: RecommendationRuleEngineFailureCode,
  message: string,
): never => {
  throw new RecommendationRuleEngineError(code, message);
};

const validateInput = (input: RecommendationRuleEngineInput): number => {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return fail("RejectedInput", "Recommendation input must be an object.");
  }
  if (!(input.operationalLeakagePriority instanceof OperationalLeakagePriority)) {
    return fail(
      "RejectedInput",
      "Recommendation input requires an OperationalLeakagePriority.",
    );
  }
  if (
    typeof input.evaluationTime !== "string" ||
    !offsetDateTimePattern.test(input.evaluationTime)
  ) {
    return fail(
      "RejectedInput",
      "Recommendation input evaluation time must be valid.",
    );
  }
  const evaluationTime = Date.parse(input.evaluationTime);
  if (!Number.isFinite(evaluationTime)) {
    return fail(
      "RejectedInput",
      "Recommendation input evaluation time must be valid.",
    );
  }
  return evaluationTime;
};

const validateRules = (
  rules: readonly RecommendationRule[],
): readonly RecommendationRule[] => {
  if (
    !Array.isArray(rules) ||
    rules.some((rule) => !(rule instanceof RecommendationRule))
  ) {
    return fail(
      "RejectedInput",
      "Recommendation rules must contain only RecommendationRule records.",
    );
  }
  return rules;
};

const requireFilter = <T extends string>(
  value: DeclarativeRuleValue | undefined,
  allowed: readonly T[],
  field: string,
): readonly T[] => {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some(
      (entry) => typeof entry !== "string" || !allowed.includes(entry as T),
    )
  ) {
    return fail(
      "ValidationFailure",
      `RecommendationRule ${field} must be a non-empty supported filter.`,
    );
  }
  return value as readonly T[];
};

const parseCondition = (value: DeclarativeRuleValue): PredicateCondition => {
  if (!isPlainRecord(value)) {
    return fail(
      "ValidationFailure",
      "RecommendationRule conditions must contain declarative objects.",
    );
  }
  const keys = Object.keys(value);
  if (
    keys.length !== 3 ||
    !Object.prototype.hasOwnProperty.call(value, "field") ||
    !Object.prototype.hasOwnProperty.call(value, "operator") ||
    !Object.prototype.hasOwnProperty.call(value, "value")
  ) {
    return fail(
      "ValidationFailure",
      "RecommendationRule condition must contain field, operator, and value only.",
    );
  }
  const field = value.field;
  const operator = value.operator;
  const expected = value.value;
  if (!isSupportedField(field)) {
    return fail(
      "ValidationFailure",
      "RecommendationRule condition field is not supported.",
    );
  }
  if (
    typeof operator !== "string" ||
    !predicateOperators.includes(operator as PredicateOperator)
  ) {
    return fail(
      "ValidationFailure",
      "RecommendationRule condition operator is not supported.",
    );
  }
  if (!isComparableValue(expected)) {
    return fail(
      "ValidationFailure",
      "RecommendationRule condition value must be a comparable scalar.",
    );
  }
  return Object.freeze({
    field,
    operator: operator as PredicateOperator,
    value: expected,
  });
};

const parseConditions = (
  predicate: DeclarativeRuleRecord,
): readonly PredicateCondition[] => {
  const conditions = predicate.conditions;
  if (
    !isPlainRecord(conditions) ||
    Object.keys(conditions).length !== 1 ||
    !Object.prototype.hasOwnProperty.call(conditions, "all") ||
    !Array.isArray(conditions.all)
  ) {
    return fail(
      "ValidationFailure",
      "RecommendationRule predicate conditions must define one all array.",
    );
  }
  return Object.freeze(conditions.all.map(parseCondition));
};

const readField = (
  input: RecommendationRuleEngineInput,
  field: SupportedField,
): ComparableValue => {
  const source = input.operationalLeakagePriority;
  switch (field) {
    case "priorityLevel":
      return source.priorityLevel;
    case "category":
      return source.category;
    case "schemaVersion":
      return source.schemaVersion;
    case "createdAt":
      return source.createdAt;
    case "sourceOperationalLeakageId":
      return source.sourceOperationalLeakageId.value;
    case "policyReference.policyId":
      return source.policyReference.policyId;
    case "policyReference.policyVersion":
      return source.policyReference.policyVersion;
    case "policyReference.ruleId":
      return source.policyReference.ruleId;
    default: {
      const name = field.slice("dimensions.".length) as keyof PriorityDimension;
      return source.dimensions[name];
    }
  }
};

const evaluateCondition = (
  actual: ComparableValue,
  condition: PredicateCondition,
): boolean => {
  const expected = condition.value;
  switch (condition.operator) {
    case "equals":
      return Object.is(actual, expected);
    case "notEquals":
      return !Object.is(actual, expected);
    default:
      if (
        typeof actual !== typeof expected ||
        (typeof actual !== "string" && typeof actual !== "number")
      ) {
        return fail(
          "ValidationFailure",
          "RecommendationRule comparison operands must be strings or finite numbers of the same type.",
        );
      }
      if (condition.operator === "greaterThan") {
        return actual > (expected as string | number);
      }
      if (condition.operator === "greaterThanOrEqual") {
        return actual >= (expected as string | number);
      }
      if (condition.operator === "lessThan") {
        return actual < (expected as string | number);
      }
      return actual <= (expected as string | number);
  }
};

const matchesPredicate = (
  rule: RecommendationRule,
  input: RecommendationRuleEngineInput,
): boolean => {
  const priorityFilter = requireFilter(
    rule.predicate.priorityFilter,
    priorityLevels,
    "priority filter",
  );
  const categoryFilter = requireFilter(
    rule.predicate.categoryFilter,
    leakageCategories,
    "category filter",
  );
  const conditions = parseConditions(rule.predicate);
  const source = input.operationalLeakagePriority;

  return (
    priorityFilter.includes(source.priorityLevel) &&
    categoryFilter.includes(source.category) &&
    conditions.every((condition) =>
      evaluateCondition(readField(input, condition.field), condition),
    )
  );
};

type RecommendationMaterial = Readonly<{
  objective: string;
  intervention: string;
  rationale: string;
  expectedOutcome: string;
  successMetric: string;
  requiredEvidence: readonly string[];
  preconditions: readonly string[];
  constraints: readonly string[];
}>;

const recommendationSchemaVersion = "1.0.0";
const recommendationIdentityNamespace =
  "ginzaaipro:operational-recommendation:v1";
const identityEncoder = new TextEncoder();

const identityComponent = (value: string): string => {
  const normalized = value.normalize("NFC");
  return `${identityEncoder.encode(normalized).byteLength}:${normalized}`;
};

const createRecommendationIdentifier = (
  source: OperationalLeakagePriority,
  rule: RecommendationRule,
): Identifier => {
  const canonicalIdentity = [
    recommendationIdentityNamespace,
    recommendationSchemaVersion,
    source.id.value,
    source.traceId.value,
    rule.ruleId,
    rule.ruleVersion,
    rule.policyId,
    rule.policyVersion,
  ]
    .map(identityComponent)
    .join("");

  return new Identifier(
    `operational-recommendation:v1:${canonicalIdentity}`,
  );
};

const requireTemplateText = (
  value: DeclarativeRuleValue | undefined,
  field: string,
): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    return fail(
      "ValidationFailure",
      `RecommendationRule output requires ${field}.`,
    );
  }
  return value;
};

const requireTemplateTextItems = (
  value: DeclarativeRuleValue | undefined,
  field: string,
): readonly string[] => {
  if (
    !Array.isArray(value) ||
    value.some((item) => typeof item !== "string" || item.trim().length === 0)
  ) {
    return fail(
      "ValidationFailure",
      `RecommendationRule output ${field} must be a declarative string array.`,
    );
  }
  return value as readonly string[];
};

const readRecommendationMaterial = (
  outputTemplate: DeclarativeRuleRecord,
): RecommendationMaterial =>
  Object.freeze({
    objective: requireTemplateText(outputTemplate.objective, "an objective"),
    intervention: requireTemplateText(
      outputTemplate.intervention,
      "an intervention",
    ),
    rationale: requireTemplateText(outputTemplate.rationale, "a rationale"),
    expectedOutcome: requireTemplateText(
      outputTemplate.expectedOutcome,
      "an expected outcome",
    ),
    successMetric: requireTemplateText(
      outputTemplate.successMetric,
      "a success metric",
    ),
    requiredEvidence: requireTemplateTextItems(
      outputTemplate.requiredEvidence,
      "required evidence",
    ),
    preconditions: requireTemplateTextItems(
      outputTemplate.preconditions,
      "preconditions",
    ),
    constraints: requireTemplateTextItems(
      outputTemplate.constraints,
      "constraints",
    ),
  });

const materializeRecommendation = (
  source: OperationalLeakagePriority,
  rule: RecommendationRule,
  createdAt: string,
): OperationalRecommendation => {
  const material = readRecommendationMaterial(rule.outputTemplate);
  return new OperationalRecommendation(
    createRecommendationIdentifier(source, rule),
    source.organizationId,
    source.id,
    source.traceId,
    rule.ruleId,
    rule.ruleVersion,
    rule.policyId,
    rule.policyVersion,
    material.objective,
    material.intervention,
    material.rationale,
    material.expectedOutcome,
    material.successMetric,
    material.requiredEvidence,
    material.preconditions,
    material.constraints,
    createdAt,
    recommendationSchemaVersion,
  );
};

const isEffective = (
  rule: RecommendationRule,
  evaluationTime: number,
): boolean =>
  evaluationTime >= Date.parse(rule.effectiveFrom) &&
  (rule.effectiveTo === undefined ||
    evaluationTime <= Date.parse(rule.effectiveTo));

const compareRules = (
  left: RecommendationRule,
  right: RecommendationRule,
): number =>
  left.priority - right.priority ||
  compareOrdinal(left.ruleId, right.ruleId) ||
  compareOrdinal(left.ruleVersion, right.ruleVersion) ||
  compareOrdinal(left.policyId, right.policyId) ||
  compareOrdinal(left.policyVersion, right.policyVersion);

export class RecommendationRuleEngine {
  constructor() {
    Object.freeze(this);
  }

  execute(
    rules: readonly RecommendationRule[],
    input: RecommendationRuleEngineInput,
  ): readonly OperationalRecommendation[] {
    const validatedRules = validateRules(rules);
    const evaluationTime = validateInput(input);
    const applicableRules = validatedRules
      .filter((rule) => rule.enabled && isEffective(rule, evaluationTime))
      .slice()
      .sort(compareRules);
    const results: OperationalRecommendation[] = [];

    for (const rule of applicableRules) {
      if (matchesPredicate(rule, input)) {
        results.push(
          materializeRecommendation(
            input.operationalLeakagePriority,
            rule,
            input.evaluationTime,
          ),
        );
      }
    }

    return Object.freeze(results);
  }
}
