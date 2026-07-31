import { Identifier } from "../common/index.js";
import type {
  DeclarativeRuleRecord,
  DeclarativeRuleValue,
} from "./RecommendationRule.js";

export type ExecutionPlanningPredicate = Readonly<{
  recommendationRuleIds: readonly string[];
  recommendationRuleVersions: readonly string[];
  recommendationPolicyIds: readonly string[];
  recommendationPolicyVersions: readonly string[];
  recommendationSchemaVersions: readonly string[];
  requiredRecommendationCount?: number;
  minimumRecommendationCount?: number;
  maximumRecommendationCount?: number;
  requireSharedTrace: boolean;
  requireSharedRuleVersion: boolean;
  requireSharedPolicyVersion: boolean;
  requireSharedSchemaVersion: boolean;
}>;

export type ExecutionPlanningRecommendationBinding =
  | Readonly<{ kind: "all" }>
  | Readonly<{
      kind: "recommendation";
      recommendationId: Identifier;
    }>;

export type ExecutionPlanningWorkPackageTemplate = Readonly<{
  templateId: string;
  recommendationBinding: ExecutionPlanningRecommendationBinding;
  objective: string;
  intervention: string;
  entryCriteria: readonly string[];
  exitCriteria: readonly string[];
  requiredCapabilities: readonly string[];
  requiredResources: readonly string[];
  executionConstraints: readonly string[];
  validationCheckpoints: readonly string[];
  completionCriteria: readonly string[];
  rollbackConsiderations: readonly string[];
}>;

export type ExecutionPlanningDependencyTemplate = Readonly<{
  predecessorTemplateId: string;
  successorTemplateId: string;
}>;

export type ExecutionPlanningOutputTemplate = Readonly<{
  schemaVersion: string;
  requiredCapabilities: readonly string[];
  requiredResources: readonly string[];
  executionAssumptions: readonly string[];
  executionConstraints: readonly string[];
  admissibilityChecks: readonly string[];
  riskControls: readonly string[];
  approvalGates: readonly string[];
  rollbackConsiderations: readonly string[];
  completionCriteria: readonly string[];
  successCriteria: readonly string[];
  workPackages: readonly ExecutionPlanningWorkPackageTemplate[];
  dependencies: readonly ExecutionPlanningDependencyTemplate[];
}>;

export type SerializedExecutionPlanningRule = Readonly<{
  ruleId: string;
  ruleVersion: string;
  policyId: string;
  policyVersion: string;
  enabled: boolean;
  effectiveFrom: string;
  effectiveTo: string | null;
  priority: number;
  predicate: Readonly<{
    recommendationRuleIds: readonly string[];
    recommendationRuleVersions: readonly string[];
    recommendationPolicyIds: readonly string[];
    recommendationPolicyVersions: readonly string[];
    recommendationSchemaVersions: readonly string[];
    requiredRecommendationCount: number | null;
    minimumRecommendationCount: number | null;
    maximumRecommendationCount: number | null;
    requireSharedTrace: boolean;
    requireSharedRuleVersion: boolean;
    requireSharedPolicyVersion: boolean;
    requireSharedSchemaVersion: boolean;
  }>;
  outputTemplate: Readonly<{
    schemaVersion: string;
    requiredCapabilities: readonly string[];
    requiredResources: readonly string[];
    executionAssumptions: readonly string[];
    executionConstraints: readonly string[];
    admissibilityChecks: readonly string[];
    riskControls: readonly string[];
    approvalGates: readonly string[];
    rollbackConsiderations: readonly string[];
    completionCriteria: readonly string[];
    successCriteria: readonly string[];
    workPackages: readonly Readonly<{
      templateId: string;
      recommendationBinding:
        | Readonly<{ kind: "all" }>
        | Readonly<{
            kind: "recommendation";
            recommendationId: string;
          }>;
      objective: string;
      intervention: string;
      entryCriteria: readonly string[];
      exitCriteria: readonly string[];
      requiredCapabilities: readonly string[];
      requiredResources: readonly string[];
      executionConstraints: readonly string[];
      validationCheckpoints: readonly string[];
      completionCriteria: readonly string[];
      rollbackConsiderations: readonly string[];
    }>[];
    dependencies: readonly Readonly<{
      predecessorTemplateId: string;
      successorTemplateId: string;
    }>[];
  }>;
  metadata: DeclarativeRuleRecord;
}>;

const compareText = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const isPlainRecord = (value: unknown): value is Record<string, unknown> => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
};

const assertOnlyKeys = (
  value: Record<string, unknown>,
  allowedKeys: readonly string[],
  field: string,
): void => {
  const unknownKey = Object.keys(value)
    .filter((key) => !allowedKeys.includes(key))
    .sort(compareText)[0];
  if (unknownKey !== undefined) {
    throw new Error(
      `ExecutionPlanningRule ${field} field ${unknownKey} is not supported.`,
    );
  }
};

const normalizeRequiredText = (value: unknown, field: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`ExecutionPlanningRule ${field} cannot be empty.`);
  }

  const normalized = value.trim();
  if (
    normalized.includes("${") ||
    normalized.includes("{{") ||
    normalized.includes("}}")
  ) {
    throw new Error(
      `ExecutionPlanningRule ${field} cannot contain template placeholders.`,
    );
  }

  return normalized;
};

const normalizeDate = (value: unknown, field: string): string => {
  if (typeof value !== "string") {
    throw new Error(
      `ExecutionPlanningRule ${field} must be a valid date-time value.`,
    );
  }

  const time = Date.parse(value);
  if (!Number.isFinite(time)) {
    throw new Error(
      `ExecutionPlanningRule ${field} must be a valid date-time value.`,
    );
  }

  return new Date(time).toISOString();
};

const copyTextSet = (values: unknown, field: string): readonly string[] => {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error(
      `ExecutionPlanningRule ${field} must contain at least one value.`,
    );
  }

  const copied = values.map((value) => normalizeRequiredText(value, field));
  copied.sort(compareText);

  for (let index = 1; index < copied.length; index += 1) {
    if (copied[index - 1] === copied[index]) {
      throw new Error(
        `ExecutionPlanningRule ${field} cannot contain duplicates.`,
      );
    }
  }

  return Object.freeze(copied);
};

const copyDeclarativeValue = (
  value: unknown,
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
        "ExecutionPlanningRule metadata must contain deterministic data.",
      );
    }
    return value;
  }
  if (typeof value !== "object") {
    throw new Error(
      "ExecutionPlanningRule metadata cannot contain functions or symbols.",
    );
  }
  if (ancestors.has(value)) {
    throw new Error(
      "ExecutionPlanningRule metadata cannot contain circular data.",
    );
  }

  const nextAncestors = new Set(ancestors);
  nextAncestors.add(value);
  if (Array.isArray(value)) {
    return Object.freeze(
      value.map((item) => copyDeclarativeValue(item, nextAncestors)),
    );
  }
  if (!isPlainRecord(value)) {
    throw new Error(
      "ExecutionPlanningRule metadata must contain only plain data.",
    );
  }

  const entries = Object.keys(value)
    .sort(compareText)
    .map(
      (key) =>
        [key, copyDeclarativeValue(value[key], nextAncestors)] as const,
    );
  return Object.freeze(Object.fromEntries(entries)) as DeclarativeRuleRecord;
};

const copyMetadata = (value: unknown): DeclarativeRuleRecord => {
  if (!isPlainRecord(value)) {
    throw new Error(
      "ExecutionPlanningRule metadata must be a declarative object.",
    );
  }

  return copyDeclarativeValue(value, new Set()) as DeclarativeRuleRecord;
};

const requireBoolean = (value: unknown, field: string): boolean => {
  if (typeof value !== "boolean") {
    throw new Error(`ExecutionPlanningRule ${field} must be a boolean.`);
  }
  return value;
};

const optionalPositiveInteger = (
  value: unknown,
  field: string,
): number | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (!Number.isSafeInteger(value) || (value as number) < 1) {
    throw new Error(
      `ExecutionPlanningRule ${field} must be a positive safe integer.`,
    );
  }
  return value as number;
};

const predicateKeys = Object.freeze([
  "recommendationRuleIds",
  "recommendationRuleVersions",
  "recommendationPolicyIds",
  "recommendationPolicyVersions",
  "recommendationSchemaVersions",
  "requiredRecommendationCount",
  "minimumRecommendationCount",
  "maximumRecommendationCount",
  "requireSharedTrace",
  "requireSharedRuleVersion",
  "requireSharedPolicyVersion",
  "requireSharedSchemaVersion",
]);

const copyPredicate = (value: unknown): ExecutionPlanningPredicate => {
  if (!isPlainRecord(value)) {
    throw new Error(
      "ExecutionPlanningRule predicate must be a declarative object.",
    );
  }
  assertOnlyKeys(value, predicateKeys, "predicate");

  const requiredRecommendationCount = optionalPositiveInteger(
    value.requiredRecommendationCount,
    "required recommendation count",
  );
  const minimumRecommendationCount = optionalPositiveInteger(
    value.minimumRecommendationCount,
    "minimum recommendation count",
  );
  const maximumRecommendationCount = optionalPositiveInteger(
    value.maximumRecommendationCount,
    "maximum recommendation count",
  );

  if (
    requiredRecommendationCount !== undefined &&
    (minimumRecommendationCount !== undefined ||
      maximumRecommendationCount !== undefined)
  ) {
    throw new Error(
      "ExecutionPlanningRule required recommendation count cannot be " +
        "combined with minimum or maximum count.",
    );
  }
  if (
    minimumRecommendationCount !== undefined &&
    maximumRecommendationCount !== undefined &&
    minimumRecommendationCount > maximumRecommendationCount
  ) {
    throw new Error(
      "ExecutionPlanningRule minimum recommendation count cannot exceed maximum count.",
    );
  }

  const predicate = {
    recommendationRuleIds: copyTextSet(
      value.recommendationRuleIds,
      "predicate recommendation rule identifiers",
    ),
    recommendationRuleVersions: copyTextSet(
      value.recommendationRuleVersions,
      "predicate recommendation rule versions",
    ),
    recommendationPolicyIds: copyTextSet(
      value.recommendationPolicyIds,
      "predicate recommendation policy identifiers",
    ),
    recommendationPolicyVersions: copyTextSet(
      value.recommendationPolicyVersions,
      "predicate recommendation policy versions",
    ),
    recommendationSchemaVersions: copyTextSet(
      value.recommendationSchemaVersions,
      "predicate recommendation schema versions",
    ),
    requireSharedTrace: requireBoolean(
      value.requireSharedTrace,
      "shared-trace requirement",
    ),
    requireSharedRuleVersion: requireBoolean(
      value.requireSharedRuleVersion,
      "shared-rule-version requirement",
    ),
    requireSharedPolicyVersion: requireBoolean(
      value.requireSharedPolicyVersion,
      "shared-policy-version requirement",
    ),
    requireSharedSchemaVersion: requireBoolean(
      value.requireSharedSchemaVersion,
      "shared-schema-version requirement",
    ),
    ...(requiredRecommendationCount === undefined
      ? {}
      : { requiredRecommendationCount }),
    ...(minimumRecommendationCount === undefined
      ? {}
      : { minimumRecommendationCount }),
    ...(maximumRecommendationCount === undefined
      ? {}
      : { maximumRecommendationCount }),
  };

  return Object.freeze(predicate);
};

const copyBinding = (
  value: unknown,
): ExecutionPlanningRecommendationBinding => {
  if (!isPlainRecord(value)) {
    throw new Error(
      "ExecutionPlanningRule recommendation binding must be an object.",
    );
  }
  if (value.kind === "all" && Object.keys(value).length === 1) {
    return Object.freeze({ kind: "all" });
  }
  if (
    value.kind === "recommendation" &&
    Object.keys(value).length === 2 &&
    value.recommendationId instanceof Identifier
  ) {
    return Object.freeze({
      kind: "recommendation",
      recommendationId: value.recommendationId,
    });
  }

  throw new Error(
    "ExecutionPlanningRule recommendation binding is not supported.",
  );
};

const copyWorkPackages = (
  values: unknown,
): readonly ExecutionPlanningWorkPackageTemplate[] => {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error(
      "ExecutionPlanningRule output requires at least one work package.",
    );
  }

  const copied = values.map((value) => {
    if (!isPlainRecord(value)) {
      throw new Error(
        "ExecutionPlanningRule work package must be a declarative object.",
      );
    }
    assertOnlyKeys(
      value,
      [
        "templateId",
        "recommendationBinding",
        "objective",
        "intervention",
        "entryCriteria",
        "exitCriteria",
        "requiredCapabilities",
        "requiredResources",
        "executionConstraints",
        "validationCheckpoints",
        "completionCriteria",
        "rollbackConsiderations",
      ],
      "work-package template",
    );

    return Object.freeze({
      templateId: normalizeRequiredText(
        value.templateId,
        "work-package template identifier",
      ),
      recommendationBinding: copyBinding(value.recommendationBinding),
      objective: normalizeRequiredText(
        value.objective,
        "work-package objective",
      ),
      intervention: normalizeRequiredText(
        value.intervention,
        "work-package intervention",
      ),
      entryCriteria: copyTextSet(
        value.entryCriteria,
        "work-package entry criteria",
      ),
      exitCriteria: copyTextSet(
        value.exitCriteria,
        "work-package exit criteria",
      ),
      requiredCapabilities: copyTextSet(
        value.requiredCapabilities,
        "work-package required capabilities",
      ),
      requiredResources: copyTextSet(
        value.requiredResources,
        "work-package required resources",
      ),
      executionConstraints: copyTextSet(
        value.executionConstraints,
        "work-package execution constraints",
      ),
      validationCheckpoints: copyTextSet(
        value.validationCheckpoints,
        "work-package validation checkpoints",
      ),
      completionCriteria: copyTextSet(
        value.completionCriteria,
        "work-package completion criteria",
      ),
      rollbackConsiderations: copyTextSet(
        value.rollbackConsiderations,
        "work-package rollback considerations",
      ),
    });
  });

  copied.sort((left, right) =>
    compareText(left.templateId, right.templateId),
  );
  for (let index = 1; index < copied.length; index += 1) {
    if (copied[index - 1]!.templateId === copied[index]!.templateId) {
      throw new Error(
        "ExecutionPlanningRule work-package template identifiers cannot be duplicated.",
      );
    }
  }

  return Object.freeze(copied);
};

const copyDependencies = (
  values: unknown,
  workPackages: readonly ExecutionPlanningWorkPackageTemplate[],
): readonly ExecutionPlanningDependencyTemplate[] => {
  if (!Array.isArray(values)) {
    throw new Error(
      "ExecutionPlanningRule dependencies must be a declarative array.",
    );
  }

  const templateIds = new Set(
    workPackages.map((workPackage) => workPackage.templateId),
  );
  const copied = values.map((value) => {
    if (!isPlainRecord(value)) {
      throw new Error(
        "ExecutionPlanningRule dependency must be a declarative object.",
      );
    }
    assertOnlyKeys(
      value,
      ["predecessorTemplateId", "successorTemplateId"],
      "dependency template",
    );
    const predecessorTemplateId = normalizeRequiredText(
      value.predecessorTemplateId,
      "dependency predecessor template identifier",
    );
    const successorTemplateId = normalizeRequiredText(
      value.successorTemplateId,
      "dependency successor template identifier",
    );

    if (
      !templateIds.has(predecessorTemplateId) ||
      !templateIds.has(successorTemplateId)
    ) {
      throw new Error(
        "ExecutionPlanningRule dependency references an unknown work-package template.",
      );
    }
    if (predecessorTemplateId === successorTemplateId) {
      throw new Error(
        "ExecutionPlanningRule work-package template cannot depend on itself.",
      );
    }

    return Object.freeze({
      predecessorTemplateId,
      successorTemplateId,
    });
  });

  copied.sort(
    (left, right) =>
      compareText(left.predecessorTemplateId, right.predecessorTemplateId) ||
      compareText(left.successorTemplateId, right.successorTemplateId),
  );
  for (let index = 1; index < copied.length; index += 1) {
    const previous = copied[index - 1]!;
    const current = copied[index]!;
    if (
      previous.predecessorTemplateId === current.predecessorTemplateId &&
      previous.successorTemplateId === current.successorTemplateId
    ) {
      throw new Error(
        "ExecutionPlanningRule dependencies cannot contain duplicate edges.",
      );
    }
  }

  const indegree = new Map(workPackages.map((item) => [item.templateId, 0]));
  const successors = new Map(
    workPackages.map((item) => [item.templateId, [] as string[]]),
  );
  for (const dependency of copied) {
    indegree.set(
      dependency.successorTemplateId,
      indegree.get(dependency.successorTemplateId)! + 1,
    );
    successors
      .get(dependency.predecessorTemplateId)!
      .push(dependency.successorTemplateId);
  }
  const ready = [...indegree.entries()]
    .filter(([, count]) => count === 0)
    .map(([templateId]) => templateId)
    .sort(compareText);
  let visited = 0;
  while (ready.length > 0) {
    const templateId = ready.shift()!;
    visited += 1;
    for (const successor of successors.get(templateId)!.sort(compareText)) {
      const next = indegree.get(successor)! - 1;
      indegree.set(successor, next);
      if (next === 0) {
        ready.push(successor);
        ready.sort(compareText);
      }
    }
  }
  if (visited !== workPackages.length) {
    throw new Error(
      "ExecutionPlanningRule dependencies cannot contain a cycle.",
    );
  }

  return Object.freeze(copied);
};

const textUnion = (values: readonly string[]): readonly string[] =>
  Object.freeze([...new Set(values)].sort(compareText));

const sameTextSet = (
  left: readonly string[],
  right: readonly string[],
): boolean =>
  left.length === right.length &&
  left.every((value, index) => value === right[index]);

const copyOutputTemplate = (
  value: unknown,
): ExecutionPlanningOutputTemplate => {
  if (!isPlainRecord(value)) {
    throw new Error(
      "ExecutionPlanningRule output template must be a declarative object.",
    );
  }
  assertOnlyKeys(
    value,
    [
      "schemaVersion",
      "requiredCapabilities",
      "requiredResources",
      "executionAssumptions",
      "executionConstraints",
      "admissibilityChecks",
      "riskControls",
      "approvalGates",
      "rollbackConsiderations",
      "completionCriteria",
      "successCriteria",
      "workPackages",
      "dependencies",
    ],
    "output template",
  );

  const workPackages = copyWorkPackages(value.workPackages);
  const dependencies = copyDependencies(value.dependencies, workPackages);
  const requiredCapabilities = copyTextSet(
    value.requiredCapabilities,
    "output required capabilities",
  );
  const packageCapabilities = textUnion(
    workPackages.flatMap((item) => [...item.requiredCapabilities]),
  );
  if (!sameTextSet(requiredCapabilities, packageCapabilities)) {
    throw new Error(
      "ExecutionPlanningRule output required capabilities must match its work packages.",
    );
  }

  const requiredResources = copyTextSet(
    value.requiredResources,
    "output required resources",
  );
  const packageResources = textUnion(
    workPackages.flatMap((item) => [...item.requiredResources]),
  );
  if (!sameTextSet(requiredResources, packageResources)) {
    throw new Error(
      "ExecutionPlanningRule output required resources must match its work packages.",
    );
  }

  return Object.freeze({
    schemaVersion: normalizeRequiredText(
      value.schemaVersion,
      "output schema version",
    ),
    requiredCapabilities,
    requiredResources,
    executionAssumptions: copyTextSet(
      value.executionAssumptions,
      "output execution assumptions",
    ),
    executionConstraints: copyTextSet(
      value.executionConstraints,
      "output execution constraints",
    ),
    admissibilityChecks: copyTextSet(
      value.admissibilityChecks,
      "output admissibility checks",
    ),
    riskControls: copyTextSet(value.riskControls, "output risk controls"),
    approvalGates: copyTextSet(
      value.approvalGates,
      "output approval gates",
    ),
    rollbackConsiderations: copyTextSet(
      value.rollbackConsiderations,
      "output rollback considerations",
    ),
    completionCriteria: copyTextSet(
      value.completionCriteria,
      "output completion criteria",
    ),
    successCriteria: copyTextSet(
      value.successCriteria,
      "output success criteria",
    ),
    workPackages,
    dependencies,
  });
};

const serializeBinding = (
  binding: ExecutionPlanningRecommendationBinding,
):
  | Readonly<{ kind: "all" }>
  | Readonly<{ kind: "recommendation"; recommendationId: string }> =>
  binding.kind === "all"
    ? Object.freeze({ kind: "all" })
    : Object.freeze({
        kind: "recommendation",
        recommendationId: binding.recommendationId.value,
      });

export class ExecutionPlanningRule {
  readonly #ruleId: string;
  readonly #ruleVersion: string;
  readonly #policyId: string;
  readonly #policyVersion: string;
  readonly #enabled: boolean;
  readonly #effectiveFrom: string;
  readonly #effectiveTo: string | undefined;
  readonly #priority: number;
  readonly #predicate: ExecutionPlanningPredicate;
  readonly #outputTemplate: ExecutionPlanningOutputTemplate;
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
    predicate: ExecutionPlanningPredicate,
    outputTemplate: ExecutionPlanningOutputTemplate,
    metadata: DeclarativeRuleRecord,
  ) {
    this.#ruleId = normalizeRequiredText(ruleId, "rule identifier");
    this.#ruleVersion = normalizeRequiredText(ruleVersion, "rule version");
    this.#policyId = normalizeRequiredText(policyId, "policy identifier");
    this.#policyVersion = normalizeRequiredText(
      policyVersion,
      "policy version",
    );
    if (typeof enabled !== "boolean") {
      throw new Error(
        "ExecutionPlanningRule enabled must be a boolean value.",
      );
    }
    this.#enabled = enabled;
    this.#effectiveFrom = normalizeDate(
      effectiveFrom,
      "effective-from date",
    );
    this.#effectiveTo =
      effectiveTo === undefined
        ? undefined
        : normalizeDate(effectiveTo, "effective-to date");
    if (
      this.#effectiveTo !== undefined &&
      Date.parse(this.#effectiveTo) < Date.parse(this.#effectiveFrom)
    ) {
      throw new Error(
        "ExecutionPlanningRule effective-to date cannot precede its effective-from date.",
      );
    }
    if (!Number.isSafeInteger(priority) || priority < 0) {
      throw new Error(
        "ExecutionPlanningRule priority must be a non-negative safe integer.",
      );
    }
    this.#priority = priority;
    this.#predicate = copyPredicate(predicate);
    this.#outputTemplate = copyOutputTemplate(outputTemplate);
    this.#metadata = copyMetadata(metadata);
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

  get planningPredicates(): ExecutionPlanningPredicate {
    return this.#predicate;
  }

  get predicate(): ExecutionPlanningPredicate {
    return this.#predicate;
  }

  get outputTemplate(): ExecutionPlanningOutputTemplate {
    return this.#outputTemplate;
  }

  get metadata(): DeclarativeRuleRecord {
    return this.#metadata;
  }

  toJSON(): SerializedExecutionPlanningRule {
    return Object.freeze({
      ruleId: this.#ruleId,
      ruleVersion: this.#ruleVersion,
      policyId: this.#policyId,
      policyVersion: this.#policyVersion,
      enabled: this.#enabled,
      effectiveFrom: this.#effectiveFrom,
      effectiveTo: this.#effectiveTo ?? null,
      priority: this.#priority,
      predicate: Object.freeze({
        recommendationRuleIds: Object.freeze([
          ...this.#predicate.recommendationRuleIds,
        ]),
        recommendationRuleVersions: Object.freeze([
          ...this.#predicate.recommendationRuleVersions,
        ]),
        recommendationPolicyIds: Object.freeze([
          ...this.#predicate.recommendationPolicyIds,
        ]),
        recommendationPolicyVersions: Object.freeze([
          ...this.#predicate.recommendationPolicyVersions,
        ]),
        recommendationSchemaVersions: Object.freeze([
          ...this.#predicate.recommendationSchemaVersions,
        ]),
        requiredRecommendationCount:
          this.#predicate.requiredRecommendationCount ?? null,
        minimumRecommendationCount:
          this.#predicate.minimumRecommendationCount ?? null,
        maximumRecommendationCount:
          this.#predicate.maximumRecommendationCount ?? null,
        requireSharedTrace: this.#predicate.requireSharedTrace,
        requireSharedRuleVersion: this.#predicate.requireSharedRuleVersion,
        requireSharedPolicyVersion: this.#predicate.requireSharedPolicyVersion,
        requireSharedSchemaVersion: this.#predicate.requireSharedSchemaVersion,
      }),
      outputTemplate: Object.freeze({
        schemaVersion: this.#outputTemplate.schemaVersion,
        requiredCapabilities: Object.freeze([
          ...this.#outputTemplate.requiredCapabilities,
        ]),
        requiredResources: Object.freeze([
          ...this.#outputTemplate.requiredResources,
        ]),
        executionAssumptions: Object.freeze([
          ...this.#outputTemplate.executionAssumptions,
        ]),
        executionConstraints: Object.freeze([
          ...this.#outputTemplate.executionConstraints,
        ]),
        admissibilityChecks: Object.freeze([
          ...this.#outputTemplate.admissibilityChecks,
        ]),
        riskControls: Object.freeze([...this.#outputTemplate.riskControls]),
        approvalGates: Object.freeze([
          ...this.#outputTemplate.approvalGates,
        ]),
        rollbackConsiderations: Object.freeze([
          ...this.#outputTemplate.rollbackConsiderations,
        ]),
        completionCriteria: Object.freeze([
          ...this.#outputTemplate.completionCriteria,
        ]),
        successCriteria: Object.freeze([
          ...this.#outputTemplate.successCriteria,
        ]),
        workPackages: Object.freeze(
          this.#outputTemplate.workPackages.map((workPackage) =>
            Object.freeze({
              templateId: workPackage.templateId,
              recommendationBinding: serializeBinding(
                workPackage.recommendationBinding,
              ),
              objective: workPackage.objective,
              intervention: workPackage.intervention,
              entryCriteria: Object.freeze([...workPackage.entryCriteria]),
              exitCriteria: Object.freeze([...workPackage.exitCriteria]),
              requiredCapabilities: Object.freeze([
                ...workPackage.requiredCapabilities,
              ]),
              requiredResources: Object.freeze([
                ...workPackage.requiredResources,
              ]),
              executionConstraints: Object.freeze([
                ...workPackage.executionConstraints,
              ]),
              validationCheckpoints: Object.freeze([
                ...workPackage.validationCheckpoints,
              ]),
              completionCriteria: Object.freeze([
                ...workPackage.completionCriteria,
              ]),
              rollbackConsiderations: Object.freeze([
                ...workPackage.rollbackConsiderations,
              ]),
            }),
          ),
        ),
        dependencies: Object.freeze(
          this.#outputTemplate.dependencies.map((dependency) =>
            Object.freeze({
              predecessorTemplateId: dependency.predecessorTemplateId,
              successorTemplateId: dependency.successorTemplateId,
            }),
          ),
        ),
      }),
      metadata: this.#metadata,
    });
  }
}
