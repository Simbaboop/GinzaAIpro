import {
  ExecutionPlan,
  ExecutionPlanningRule,
  Identifier,
  OperationalRecommendation,
  type ExecutionPlanDependency,
  type ExecutionPlanRecommendationProvenance,
  type ExecutionPlanWorkPackage,
  type ExecutionPlanningOutputTemplate,
  type ExecutionPlanningPredicate,
  type ExecutionPlanningWorkPackageTemplate,
} from "@ginzaaipro/domain";

export type ExecutionPlanningEngineFailureCode =
  | "NO_MATCHING_EXECUTION_PLANNING_RULE"
  | "AMBIGUOUS_EXECUTION_PLANNING_RULE"
  | "DUPLICATE_OPERATIONAL_RECOMMENDATION"
  | "INCOMPATIBLE_RECOMMENDATION_ORGANIZATIONS"
  | "INCOMPATIBLE_RECOMMENDATION_PROVENANCE"
  | "INVALID_EXECUTION_PLANNING_RULE_TEMPLATE"
  | "UNKNOWN_EXECUTION_PLANNING_TEMPLATE_BINDING"
  | "UNKNOWN_EXECUTION_PLANNING_TEMPLATE_PLACEHOLDER"
  | "EMPTY_EXECUTION_PLAN_FIELD"
  | "DUPLICATE_EXECUTION_PLAN_WORK_PACKAGE"
  | "UNKNOWN_EXECUTION_PLAN_DEPENDENCY"
  | "EXECUTION_PLAN_DEPENDENCY_CYCLE"
  | "INCONSISTENT_EXECUTION_PLAN_REQUIREMENTS"
  | "INVALID_EXECUTION_PLANNING_TIMESTAMP"
  | "SYSTEM_FAILURE";

export type ExecutionPlanningEngineInput = Readonly<{
  recommendations: readonly OperationalRecommendation[];
  rules: readonly ExecutionPlanningRule[];
  generationTimestamp: string;
}>;

export class ExecutionPlanningEngineError extends Error {
  readonly #code: ExecutionPlanningEngineFailureCode;

  constructor(code: ExecutionPlanningEngineFailureCode, message: string) {
    super(message);
    this.name = "ExecutionPlanningEngineError";
    this.#code = code;
    Object.freeze(this);
  }

  get code(): ExecutionPlanningEngineFailureCode {
    return this.#code;
  }
}

type BoundWorkPackage = Readonly<{
  template: ExecutionPlanningWorkPackageTemplate;
  workPackageId: Identifier;
  recommendations: readonly OperationalRecommendation[];
}>;

const offsetDateTimePattern =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/u;
const placeholderPattern = /\$\{[^}]*\}|\{\{[^}]*\}\}/u;
const identityEncoder = new TextEncoder();
const workPackageIdentityNamespace =
  "ginzaaipro:execution-plan-work-package:v1";
const workPackageIdentityPrefix = "execution-plan-work-package:v1:";

const compareText = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const compareIdentifiers = (left: Identifier, right: Identifier): number =>
  compareText(left.value, right.value);

const fail = (
  code: ExecutionPlanningEngineFailureCode,
  message: string,
): never => {
  throw new ExecutionPlanningEngineError(code, message);
};

const normalizeTimestamp = (value: unknown): string => {
  if (typeof value !== "string" || !offsetDateTimePattern.test(value)) {
    return fail(
      "INVALID_EXECUTION_PLANNING_TIMESTAMP",
      "Execution planning generation timestamp must be an offset date-time.",
    );
  }

  const instant = Date.parse(value);
  if (!Number.isFinite(instant)) {
    return fail(
      "INVALID_EXECUTION_PLANNING_TIMESTAMP",
      "Execution planning generation timestamp must identify a finite instant.",
    );
  }

  return new Date(instant).toISOString();
};

const isRequiredText = (value: unknown): value is string =>
  typeof value === "string" && value.trim().length > 0;

const validateRecommendationProvenance = (
  recommendation: OperationalRecommendation,
): void => {
  if (
    !(recommendation.recommendationId instanceof Identifier) ||
    !(recommendation.organizationId instanceof Identifier) ||
    !(recommendation.traceId instanceof Identifier) ||
    !isRequiredText(recommendation.ruleId) ||
    !isRequiredText(recommendation.ruleVersion) ||
    !isRequiredText(recommendation.policyId) ||
    !isRequiredText(recommendation.policyVersion) ||
    !isRequiredText(recommendation.schemaVersion)
  ) {
    return fail(
      "INCOMPATIBLE_RECOMMENDATION_PROVENANCE",
      "Execution planning recommendations require complete canonical provenance.",
    );
  }
};

const normalizeRecommendations = (
  values: unknown,
): readonly OperationalRecommendation[] => {
  if (!Array.isArray(values) || values.length === 0) {
    return fail(
      "INCOMPATIBLE_RECOMMENDATION_PROVENANCE",
      "Execution planning requires at least one admissible recommendation.",
    );
  }

  if (values.some((value) => !(value instanceof OperationalRecommendation))) {
    return fail(
      "INCOMPATIBLE_RECOMMENDATION_PROVENANCE",
      "Execution planning accepts only OperationalRecommendation artifacts.",
    );
  }

  const recommendations = (values as OperationalRecommendation[]).slice();
  for (const recommendation of recommendations) {
    validateRecommendationProvenance(recommendation);
  }
  recommendations.sort((left, right) =>
    compareIdentifiers(left.recommendationId, right.recommendationId),
  );

  for (let index = 1; index < recommendations.length; index += 1) {
    if (
      recommendations[index - 1]!.recommendationId.equals(
        recommendations[index]!.recommendationId,
      )
    ) {
      return fail(
        "DUPLICATE_OPERATIONAL_RECOMMENDATION",
        "Execution planning recommendations cannot contain duplicate identifiers.",
      );
    }
  }

  const organizationId = recommendations[0]!.organizationId;
  if (
    recommendations.some(
      (recommendation) =>
        !recommendation.organizationId.equals(organizationId),
    )
  ) {
    return fail(
      "INCOMPATIBLE_RECOMMENDATION_ORGANIZATIONS",
      "Execution planning recommendations must belong to one organization.",
    );
  }

  return Object.freeze(recommendations);
};

const normalizeRules = (values: unknown): readonly ExecutionPlanningRule[] => {
  if (!Array.isArray(values)) {
    return fail(
      "INVALID_EXECUTION_PLANNING_RULE_TEMPLATE",
      "Execution planning rules must be supplied as an array.",
    );
  }
  if (values.some((value) => !(value instanceof ExecutionPlanningRule))) {
    return fail(
      "INVALID_EXECUTION_PLANNING_RULE_TEMPLATE",
      "Execution planning accepts only ExecutionPlanningRule artifacts.",
    );
  }

  return Object.freeze((values as ExecutionPlanningRule[]).slice());
};

const isEffective = (
  rule: ExecutionPlanningRule,
  generationInstant: number,
): boolean =>
  generationInstant >= Date.parse(rule.effectiveFrom) &&
  (rule.effectiveTo === undefined ||
    generationInstant <= Date.parse(rule.effectiveTo));

const everyRecommendationAllowed = (
  recommendations: readonly OperationalRecommendation[],
  allowed: readonly string[],
  select: (recommendation: OperationalRecommendation) => string,
): boolean =>
  recommendations.every((recommendation) =>
    allowed.includes(select(recommendation)),
  );

const matchesStructuralPredicate = (
  predicate: ExecutionPlanningPredicate,
  recommendations: readonly OperationalRecommendation[],
): boolean => {
  const count = recommendations.length;
  return (
    everyRecommendationAllowed(
      recommendations,
      predicate.recommendationRuleIds,
      (recommendation) => recommendation.ruleId,
    ) &&
    everyRecommendationAllowed(
      recommendations,
      predicate.recommendationRuleVersions,
      (recommendation) => recommendation.ruleVersion,
    ) &&
    everyRecommendationAllowed(
      recommendations,
      predicate.recommendationPolicyIds,
      (recommendation) => recommendation.policyId,
    ) &&
    everyRecommendationAllowed(
      recommendations,
      predicate.recommendationPolicyVersions,
      (recommendation) => recommendation.policyVersion,
    ) &&
    everyRecommendationAllowed(
      recommendations,
      predicate.recommendationSchemaVersions,
      (recommendation) => recommendation.schemaVersion,
    ) &&
    (predicate.requiredRecommendationCount === undefined ||
      count === predicate.requiredRecommendationCount) &&
    (predicate.minimumRecommendationCount === undefined ||
      count >= predicate.minimumRecommendationCount) &&
    (predicate.maximumRecommendationCount === undefined ||
      count <= predicate.maximumRecommendationCount)
  );
};

const sharesValue = (
  recommendations: readonly OperationalRecommendation[],
  select: (recommendation: OperationalRecommendation) => string,
): boolean => {
  const expected = select(recommendations[0]!);
  return recommendations.every(
    (recommendation) => select(recommendation) === expected,
  );
};

const matchesSharedProvenance = (
  predicate: ExecutionPlanningPredicate,
  recommendations: readonly OperationalRecommendation[],
): boolean =>
  (!predicate.requireSharedTrace ||
    sharesValue(recommendations, (item) => item.traceId.value)) &&
  (!predicate.requireSharedRuleVersion ||
    sharesValue(
      recommendations,
      (item) => `${item.ruleId}\u0000${item.ruleVersion}`,
    )) &&
  (!predicate.requireSharedPolicyVersion ||
    sharesValue(
      recommendations,
      (item) => `${item.policyId}\u0000${item.policyVersion}`,
    )) &&
  (!predicate.requireSharedSchemaVersion ||
    sharesValue(recommendations, (item) => item.schemaVersion));

const compareRules = (
  left: ExecutionPlanningRule,
  right: ExecutionPlanningRule,
): number =>
  right.priority - left.priority ||
  Date.parse(right.effectiveFrom) - Date.parse(left.effectiveFrom) ||
  compareText(left.ruleId, right.ruleId);

const outputFingerprint = (rule: ExecutionPlanningRule): string =>
  JSON.stringify(rule.outputTemplate);

const rulesConflict = (
  left: ExecutionPlanningRule,
  right: ExecutionPlanningRule,
): boolean =>
  left.ruleVersion !== right.ruleVersion ||
  left.policyId !== right.policyId ||
  left.policyVersion !== right.policyVersion ||
  outputFingerprint(left) !== outputFingerprint(right);

const selectRule = (
  rules: readonly ExecutionPlanningRule[],
  recommendations: readonly OperationalRecommendation[],
  generationTimestamp: string,
): ExecutionPlanningRule => {
  const generationInstant = Date.parse(generationTimestamp);
  const effective = rules.filter(
    (rule) => rule.enabled && isEffective(rule, generationInstant),
  );
  const structurallyMatching = effective.filter((rule) =>
    matchesStructuralPredicate(rule.predicate, recommendations),
  );
  const matching = structurallyMatching.filter((rule) =>
    matchesSharedProvenance(rule.predicate, recommendations),
  );

  if (matching.length === 0) {
    if (structurallyMatching.length > 0) {
      return fail(
        "INCOMPATIBLE_RECOMMENDATION_PROVENANCE",
        "Execution planning recommendations violate required shared provenance.",
      );
    }
    return fail(
      "NO_MATCHING_EXECUTION_PLANNING_RULE",
      "No effective execution-planning rule matches the recommendations.",
    );
  }

  const ordered = matching.slice().sort(compareRules);
  const selected = ordered[0]!;
  const equallyAuthoritative = ordered.filter(
    (rule) =>
      rule.priority === selected.priority &&
      rule.effectiveFrom === selected.effectiveFrom &&
      rule.ruleId === selected.ruleId,
  );

  if (equallyAuthoritative.some((rule) => rulesConflict(selected, rule))) {
    return fail(
      "AMBIGUOUS_EXECUTION_PLANNING_RULE",
      "Equally authoritative execution-planning rules conflict.",
    );
  }

  return selected;
};

const containsPlaceholder = (value: unknown): boolean => {
  if (typeof value === "string") {
    return placeholderPattern.test(value);
  }
  if (Array.isArray(value)) {
    return value.some(containsPlaceholder);
  }
  if (value !== null && typeof value === "object") {
    return Object.values(value).some(containsPlaceholder);
  }
  return false;
};

const requireTextArray = (value: unknown): readonly string[] => {
  if (
    !Array.isArray(value) ||
    value.length === 0 ||
    value.some((item) => !isRequiredText(item))
  ) {
    return fail(
      "EMPTY_EXECUTION_PLAN_FIELD",
      "Execution planning cannot materialize an empty required field.",
    );
  }
  return value as readonly string[];
};

const textUnion = (values: readonly string[]): readonly string[] =>
  Object.freeze([...new Set(values)].sort(compareText));

const sameTextSet = (
  left: readonly string[],
  right: readonly string[],
): boolean =>
  left.length === right.length &&
  left.every((value, index) => value === right[index]);

const validateOutputTemplate = (
  output: ExecutionPlanningOutputTemplate,
): void => {
  if (containsPlaceholder(output)) {
    return fail(
      "UNKNOWN_EXECUTION_PLANNING_TEMPLATE_PLACEHOLDER",
      "Execution-planning templates cannot contain placeholders.",
    );
  }
  if (!isRequiredText(output.schemaVersion)) {
    return fail(
      "EMPTY_EXECUTION_PLAN_FIELD",
      "Execution planning output schema version cannot be empty.",
    );
  }

  requireTextArray(output.requiredCapabilities);
  requireTextArray(output.requiredResources);
  requireTextArray(output.executionAssumptions);
  requireTextArray(output.executionConstraints);
  requireTextArray(output.admissibilityChecks);
  requireTextArray(output.riskControls);
  requireTextArray(output.approvalGates);
  requireTextArray(output.rollbackConsiderations);
  requireTextArray(output.completionCriteria);
  requireTextArray(output.successCriteria);

  if (!Array.isArray(output.workPackages) || output.workPackages.length === 0) {
    return fail(
      "EMPTY_EXECUTION_PLAN_FIELD",
      "Execution planning output requires at least one work package.",
    );
  }
  if (!Array.isArray(output.dependencies)) {
    return fail(
      "INVALID_EXECUTION_PLANNING_RULE_TEMPLATE",
      "Execution planning dependencies must be declarative records.",
    );
  }

  const packageCapabilities = textUnion(
    output.workPackages.flatMap((item) => [
      ...requireTextArray(item.requiredCapabilities),
    ]),
  );
  const packageResources = textUnion(
    output.workPackages.flatMap((item) => [
      ...requireTextArray(item.requiredResources),
    ]),
  );
  if (
    !sameTextSet(output.requiredCapabilities, packageCapabilities) ||
    !sameTextSet(output.requiredResources, packageResources)
  ) {
    return fail(
      "INCONSISTENT_EXECUTION_PLAN_REQUIREMENTS",
      "Execution planning requirements must match the work-package union.",
    );
  }
};

const identifierUnion = (
  identifiers: readonly Identifier[],
): readonly Identifier[] => {
  const byValue = new Map(
    identifiers.map((identifier) => [identifier.value, identifier]),
  );
  return Object.freeze([...byValue.values()].sort(compareIdentifiers));
};

const resolveBinding = (
  template: ExecutionPlanningWorkPackageTemplate,
  recommendations: readonly OperationalRecommendation[],
): readonly OperationalRecommendation[] => {
  const binding = template.recommendationBinding;
  if (binding.kind === "all") {
    return recommendations;
  }
  if (
    binding.kind !== "recommendation" ||
    !(binding.recommendationId instanceof Identifier)
  ) {
    return fail(
      "UNKNOWN_EXECUTION_PLANNING_TEMPLATE_BINDING",
      "Execution-planning work-package binding is not supported.",
    );
  }

  const matches = recommendations.filter((recommendation) =>
    recommendation.recommendationId.equals(binding.recommendationId),
  );
  if (matches.length !== 1) {
    return fail(
      "UNKNOWN_EXECUTION_PLANNING_TEMPLATE_BINDING",
      "Execution-planning named binding must resolve exactly one recommendation.",
    );
  }
  return Object.freeze(matches);
};

const identityComponent = (value: string): string => {
  const normalized = value.normalize("NFC");
  return `${identityEncoder.encode(normalized).byteLength}:${normalized}`;
};

const createWorkPackageIdentifier = (
  rule: ExecutionPlanningRule,
  output: ExecutionPlanningOutputTemplate,
  organizationId: Identifier,
  template: ExecutionPlanningWorkPackageTemplate,
  recommendations: readonly OperationalRecommendation[],
): Identifier => {
  const recommendationIds = recommendations
    .map((recommendation) => recommendation.recommendationId.value)
    .sort(compareText);
  const canonicalMaterial = [
    workPackageIdentityNamespace,
    output.schemaVersion,
    organizationId.value,
    rule.ruleId,
    rule.ruleVersion,
    rule.policyId,
    rule.policyVersion,
    template.templateId,
    recommendationIds.length.toString(10),
    ...recommendationIds,
  ]
    .map(identityComponent)
    .join("");

  return new Identifier(`${workPackageIdentityPrefix}${canonicalMaterial}`);
};

const bindWorkPackages = (
  rule: ExecutionPlanningRule,
  recommendations: readonly OperationalRecommendation[],
): readonly BoundWorkPackage[] => {
  const output = rule.outputTemplate;
  const organizationId = recommendations[0]!.organizationId;
  const bound = output.workPackages.map((template) => {
    const selectedRecommendations = resolveBinding(template, recommendations);
    return Object.freeze({
      template,
      workPackageId: createWorkPackageIdentifier(
        rule,
        output,
        organizationId,
        template,
        selectedRecommendations,
      ),
      recommendations: selectedRecommendations,
    });
  });

  const identities = new Set<string>();
  for (const workPackage of bound) {
    if (identities.has(workPackage.workPackageId.value)) {
      return fail(
        "DUPLICATE_EXECUTION_PLAN_WORK_PACKAGE",
        "Execution planning produced duplicate work-package identity.",
      );
    }
    identities.add(workPackage.workPackageId.value);
  }

  return Object.freeze(bound);
};

const assertAcyclic = (
  workPackageIds: readonly string[],
  dependencies: readonly ExecutionPlanDependency[],
): void => {
  const indegree = new Map(workPackageIds.map((identifier) => [identifier, 0]));
  const successors = new Map(
    workPackageIds.map((identifier) => [identifier, [] as string[]]),
  );

  for (const dependency of dependencies) {
    const predecessor = dependency.predecessorWorkPackageId.value;
    const successor = dependency.successorWorkPackageId.value;
    indegree.set(successor, indegree.get(successor)! + 1);
    successors.get(predecessor)!.push(successor);
  }

  const ready = [...indegree.entries()]
    .filter(([, count]) => count === 0)
    .map(([identifier]) => identifier)
    .sort(compareText);
  let visited = 0;
  while (ready.length > 0) {
    const identifier = ready.shift()!;
    visited += 1;
    for (const successor of successors.get(identifier)!.sort(compareText)) {
      const next = indegree.get(successor)! - 1;
      indegree.set(successor, next);
      if (next === 0) {
        ready.push(successor);
        ready.sort(compareText);
      }
    }
  }

  if (visited !== workPackageIds.length) {
    return fail(
      "EXECUTION_PLAN_DEPENDENCY_CYCLE",
      "Execution-planning dependencies cannot contain a cycle.",
    );
  }
};

const materializeDependencies = (
  rule: ExecutionPlanningRule,
  bound: readonly BoundWorkPackage[],
): readonly ExecutionPlanDependency[] => {
  const byTemplateId = new Map(
    bound.map((item) => [item.template.templateId, item.workPackageId]),
  );
  const dependencies = rule.outputTemplate.dependencies.map((dependency) => {
    const predecessorWorkPackageId = byTemplateId.get(
      dependency.predecessorTemplateId,
    );
    const successorWorkPackageId = byTemplateId.get(
      dependency.successorTemplateId,
    );
    if (
      predecessorWorkPackageId === undefined ||
      successorWorkPackageId === undefined
    ) {
      return fail(
        "UNKNOWN_EXECUTION_PLAN_DEPENDENCY",
        "Execution-planning dependency references an unknown work package.",
      );
    }
    if (predecessorWorkPackageId.equals(successorWorkPackageId)) {
      return fail(
        "UNKNOWN_EXECUTION_PLAN_DEPENDENCY",
        "Execution-planning work package cannot depend on itself.",
      );
    }
    return Object.freeze({
      predecessorWorkPackageId,
      successorWorkPackageId,
    });
  });

  dependencies.sort(
    (left, right) =>
      compareIdentifiers(
        left.predecessorWorkPackageId,
        right.predecessorWorkPackageId,
      ) ||
      compareIdentifiers(
        left.successorWorkPackageId,
        right.successorWorkPackageId,
      ),
  );
  for (let index = 1; index < dependencies.length; index += 1) {
    const previous = dependencies[index - 1]!;
    const current = dependencies[index]!;
    if (
      previous.predecessorWorkPackageId.equals(
        current.predecessorWorkPackageId,
      ) && previous.successorWorkPackageId.equals(current.successorWorkPackageId)
    ) {
      return fail(
        "UNKNOWN_EXECUTION_PLAN_DEPENDENCY",
        "Execution-planning dependencies cannot contain duplicate edges.",
      );
    }
  }

  assertAcyclic(
    bound.map((item) => item.workPackageId.value),
    dependencies,
  );
  return Object.freeze(dependencies);
};

const materializeWorkPackages = (
  bound: readonly BoundWorkPackage[],
  dependencies: readonly ExecutionPlanDependency[],
): readonly ExecutionPlanWorkPackage[] =>
  Object.freeze(
    bound.map((item) => {
      const sourceRecommendationIds = Object.freeze(
        item.recommendations
          .map((recommendation) => recommendation.recommendationId)
          .sort(compareIdentifiers),
      );
      const traceIds = identifierUnion(
        item.recommendations.map((recommendation) => recommendation.traceId),
      );
      const dependencyReferences = Object.freeze(
        dependencies
          .filter((dependency) =>
            dependency.successorWorkPackageId.equals(item.workPackageId),
          )
          .map((dependency) => dependency.predecessorWorkPackageId)
          .sort(compareIdentifiers),
      );

      return Object.freeze({
        workPackageId: item.workPackageId,
        sourceRecommendationIds,
        traceIds,
        objective: item.template.objective,
        intervention: item.template.intervention,
        entryCriteria: item.template.entryCriteria,
        exitCriteria: item.template.exitCriteria,
        requiredCapabilities: item.template.requiredCapabilities,
        requiredResources: item.template.requiredResources,
        executionConstraints: item.template.executionConstraints,
        validationCheckpoints: item.template.validationCheckpoints,
        completionCriteria: item.template.completionCriteria,
        dependencyReferences,
        rollbackConsiderations: item.template.rollbackConsiderations,
      });
    }),
  );

const recommendationProvenance = (
  recommendations: readonly OperationalRecommendation[],
): readonly ExecutionPlanRecommendationProvenance[] =>
  Object.freeze(
    recommendations.map((recommendation) =>
      Object.freeze({
        recommendationId: recommendation.recommendationId,
        organizationId: recommendation.organizationId,
        traceId: recommendation.traceId,
        recommendationSchemaVersion: recommendation.schemaVersion,
        ruleId: recommendation.ruleId,
        ruleVersion: recommendation.ruleVersion,
        policyId: recommendation.policyId,
        policyVersion: recommendation.policyVersion,
      }),
    ),
  );

const mapExecutionPlanError = (error: Error): never => {
  const message = error.message;
  if (message.includes("required capabilities") || message.includes("required resources")) {
    return fail("INCONSISTENT_EXECUTION_PLAN_REQUIREMENTS", message);
  }
  if (message.includes("duplicate identifiers") && message.includes("work packages")) {
    return fail("DUPLICATE_EXECUTION_PLAN_WORK_PACKAGE", message);
  }
  if (message.includes("unknown work package") || message.includes("depend on itself")) {
    return fail("UNKNOWN_EXECUTION_PLAN_DEPENDENCY", message);
  }
  if (message.includes("cycles")) {
    return fail("EXECUTION_PLAN_DEPENDENCY_CYCLE", message);
  }
  if (message.includes("cannot be empty") || message.includes("at least one")) {
    return fail("EMPTY_EXECUTION_PLAN_FIELD", message);
  }
  return fail("INVALID_EXECUTION_PLANNING_RULE_TEMPLATE", message);
};

const constructPlan = (
  recommendations: readonly OperationalRecommendation[],
  rule: ExecutionPlanningRule,
  generationTimestamp: string,
): ExecutionPlan => {
  validateOutputTemplate(rule.outputTemplate);
  const bound = bindWorkPackages(rule, recommendations);
  const dependencyGraph = materializeDependencies(rule, bound);
  const workPackages = materializeWorkPackages(bound, dependencyGraph);
  const output = rule.outputTemplate;

  try {
    return new ExecutionPlan({
      organizationId: recommendations[0]!.organizationId,
      sourceRecommendationIds: recommendations.map(
        (recommendation) => recommendation.recommendationId,
      ),
      traceIds: identifierUnion(
        recommendations.map((recommendation) => recommendation.traceId),
      ),
      recommendationProvenance: recommendationProvenance(recommendations),
      planningPolicyId: rule.policyId,
      planningPolicyVersion: rule.policyVersion,
      planningRuleProvenance: Object.freeze([
        Object.freeze({ ruleId: rule.ruleId, ruleVersion: rule.ruleVersion }),
      ]),
      workPackages,
      dependencyGraph,
      requiredCapabilities: output.requiredCapabilities,
      requiredResources: output.requiredResources,
      executionAssumptions: output.executionAssumptions,
      executionConstraints: output.executionConstraints,
      admissibilityChecks: output.admissibilityChecks,
      riskControls: output.riskControls,
      approvalGates: output.approvalGates,
      rollbackConsiderations: output.rollbackConsiderations,
      completionCriteria: output.completionCriteria,
      successCriteria: output.successCriteria,
      createdAt: generationTimestamp,
      schemaVersion: output.schemaVersion,
    });
  } catch (error) {
    if (error instanceof ExecutionPlanningEngineError) {
      throw error;
    }
    if (error instanceof Error) {
      return mapExecutionPlanError(error);
    }
    return fail(
      "SYSTEM_FAILURE",
      "Execution planning failed with an unexpected internal value.",
    );
  }
};

export class ExecutionPlanningEngine {
  constructor() {
    Object.freeze(this);
  }

  plan(input: ExecutionPlanningEngineInput): ExecutionPlan {
    try {
      if (
        input === null ||
        typeof input !== "object" ||
        Array.isArray(input)
      ) {
        return fail(
          "INCOMPATIBLE_RECOMMENDATION_PROVENANCE",
          "Execution planning input must be a declarative record.",
        );
      }

      const generationTimestamp = normalizeTimestamp(
        input.generationTimestamp,
      );
      const recommendations = normalizeRecommendations(input.recommendations);
      const rules = normalizeRules(input.rules);
      const selectedRule = selectRule(
        rules,
        recommendations,
        generationTimestamp,
      );

      return constructPlan(
        recommendations,
        selectedRule,
        generationTimestamp,
      );
    } catch (error) {
      if (error instanceof ExecutionPlanningEngineError) {
        throw error;
      }
      return fail(
        "SYSTEM_FAILURE",
        "Execution planning encountered an unexpected internal failure.",
      );
    }
  }
}
