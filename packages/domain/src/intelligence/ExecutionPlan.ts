import { Entity, Identifier } from "../common/index.js";

export type ExecutionPlanRecommendationProvenance = Readonly<{
  recommendationId: Identifier;
  organizationId: Identifier;
  traceId: Identifier;
  recommendationSchemaVersion: string;
  ruleId: string;
  ruleVersion: string;
  policyId: string;
  policyVersion: string;
}>;

export type ExecutionPlanRuleProvenance = Readonly<{
  ruleId: string;
  ruleVersion: string;
}>;

export type ExecutionPlanWorkPackage = Readonly<{
  workPackageId: Identifier;
  sourceRecommendationIds: readonly Identifier[];
  traceIds: readonly Identifier[];
  objective: string;
  intervention: string;
  entryCriteria: readonly string[];
  exitCriteria: readonly string[];
  requiredCapabilities: readonly string[];
  requiredResources: readonly string[];
  executionConstraints: readonly string[];
  validationCheckpoints: readonly string[];
  completionCriteria: readonly string[];
  dependencyReferences: readonly Identifier[];
  rollbackConsiderations: readonly string[];
}>;

export type ExecutionPlanDependency = Readonly<{
  predecessorWorkPackageId: Identifier;
  successorWorkPackageId: Identifier;
}>;

export type ExecutionPlanInput = Readonly<{
  organizationId: Identifier;
  sourceRecommendationIds: readonly Identifier[];
  traceIds: readonly Identifier[];
  recommendationProvenance: readonly ExecutionPlanRecommendationProvenance[];
  planningPolicyId: string;
  planningPolicyVersion: string;
  planningRuleProvenance: readonly ExecutionPlanRuleProvenance[];
  workPackages: readonly ExecutionPlanWorkPackage[];
  dependencyGraph: readonly ExecutionPlanDependency[];
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
  createdAt: string;
  schemaVersion: string;
}>;

export type SerializedExecutionPlan = Readonly<{
  planId: string;
  organizationId: string;
  sourceRecommendationIds: readonly string[];
  traceIds: readonly string[];
  recommendationProvenance: readonly Readonly<{
    recommendationId: string;
    organizationId: string;
    traceId: string;
    recommendationSchemaVersion: string;
    ruleId: string;
    ruleVersion: string;
    policyId: string;
    policyVersion: string;
  }>[];
  planningPolicyId: string;
  planningPolicyVersion: string;
  planningRuleProvenance: readonly Readonly<{
    ruleId: string;
    ruleVersion: string;
  }>[];
  workPackages: readonly Readonly<{
    workPackageId: string;
    sourceRecommendationIds: readonly string[];
    traceIds: readonly string[];
    objective: string;
    intervention: string;
    entryCriteria: readonly string[];
    exitCriteria: readonly string[];
    requiredCapabilities: readonly string[];
    requiredResources: readonly string[];
    executionConstraints: readonly string[];
    validationCheckpoints: readonly string[];
    completionCriteria: readonly string[];
    dependencyReferences: readonly string[];
    rollbackConsiderations: readonly string[];
  }>[];
  dependencyGraph: readonly Readonly<{
    predecessorWorkPackageId: string;
    successorWorkPackageId: string;
  }>[];
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
  createdAt: string;
  schemaVersion: string;
}>;

type NormalizedExecutionPlan = Readonly<{
  organizationId: Identifier;
  sourceRecommendationIds: readonly Identifier[];
  traceIds: readonly Identifier[];
  recommendationProvenance: readonly ExecutionPlanRecommendationProvenance[];
  planningPolicyId: string;
  planningPolicyVersion: string;
  planningRuleProvenance: readonly ExecutionPlanRuleProvenance[];
  workPackages: readonly ExecutionPlanWorkPackage[];
  dependencyGraph: readonly ExecutionPlanDependency[];
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
  createdAt: string;
  schemaVersion: string;
}>;

const identityNamespace = "ginzaaipro:execution-plan:v1";
const identityEncoder = new TextEncoder();

const compareText = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const compareIdentifiers = (left: Identifier, right: Identifier): number =>
  compareText(left.value, right.value);

const requireIdentifier = (value: unknown, field: string): Identifier => {
  if (!(value instanceof Identifier)) {
    throw new Error(`ExecutionPlan requires a valid ${field} identifier.`);
  }

  return value;
};

const normalizeRequiredText = (value: unknown, field: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`ExecutionPlan ${field} cannot be empty.`);
  }

  return value.trim();
};

const copyIdentifierSet = (
  values: unknown,
  field: string,
  allowEmpty = false,
): readonly Identifier[] => {
  if (!Array.isArray(values) || (!allowEmpty && values.length === 0)) {
    const requirement = allowEmpty ? "only" : "at least one";
    throw new Error(
      `ExecutionPlan ${field} must contain ${requirement} valid identifier.`,
    );
  }

  const copied = values.map((value) => requireIdentifier(value, field));
  copied.sort(compareIdentifiers);

  for (let index = 1; index < copied.length; index += 1) {
    if (copied[index - 1]!.equals(copied[index]!)) {
      throw new Error(`ExecutionPlan ${field} cannot contain duplicates.`);
    }
  }

  return Object.freeze(copied);
};

const copyTextSet = (
  values: unknown,
  field: string,
  allowEmpty = false,
): readonly string[] => {
  if (!Array.isArray(values) || (!allowEmpty && values.length === 0)) {
    const requirement = allowEmpty ? "only" : "at least one";
    throw new Error(
      `ExecutionPlan ${field} must contain ${requirement} non-empty value.`,
    );
  }

  const copied = values.map((value) => normalizeRequiredText(value, field));
  copied.sort(compareText);

  for (let index = 1; index < copied.length; index += 1) {
    if (copied[index - 1] === copied[index]) {
      throw new Error(`ExecutionPlan ${field} cannot contain duplicates.`);
    }
  }

  return Object.freeze(copied);
};

const sameIdentifierSet = (
  left: readonly Identifier[],
  right: readonly Identifier[],
): boolean =>
  left.length === right.length &&
  left.every((value, index) => value.equals(right[index]!));

const identifierUnion = (
  values: readonly Identifier[],
): readonly Identifier[] => {
  const byValue = new Map(values.map((value) => [value.value, value]));
  return Object.freeze([...byValue.values()].sort(compareIdentifiers));
};

const textUnion = (values: readonly string[]): readonly string[] =>
  Object.freeze([...new Set(values)].sort(compareText));

const copyRecommendationProvenance = (
  values: unknown,
  organizationId: Identifier,
): readonly ExecutionPlanRecommendationProvenance[] => {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error(
      "ExecutionPlan recommendation provenance must contain at least one record.",
    );
  }

  const copied = values.map((value) => {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(
        "ExecutionPlan recommendation provenance contains an invalid record.",
      );
    }

    const record = value as ExecutionPlanRecommendationProvenance;
    const recommendationId = requireIdentifier(
      record.recommendationId,
      "source recommendation",
    );
    const recordOrganizationId = requireIdentifier(
      record.organizationId,
      "recommendation organization",
    );
    const traceId = requireIdentifier(record.traceId, "recommendation trace");

    if (!recordOrganizationId.equals(organizationId)) {
      throw new Error(
        "ExecutionPlan source recommendations must belong to the plan organization.",
      );
    }

    return Object.freeze({
      recommendationId,
      organizationId: recordOrganizationId,
      traceId,
      recommendationSchemaVersion: normalizeRequiredText(
        record.recommendationSchemaVersion,
        "recommendation schema version",
      ),
      ruleId: normalizeRequiredText(
        record.ruleId,
        "recommendation rule identifier",
      ),
      ruleVersion: normalizeRequiredText(
        record.ruleVersion,
        "recommendation rule version",
      ),
      policyId: normalizeRequiredText(
        record.policyId,
        "recommendation policy identifier",
      ),
      policyVersion: normalizeRequiredText(
        record.policyVersion,
        "recommendation policy version",
      ),
    });
  });

  copied.sort((left, right) =>
    compareIdentifiers(left.recommendationId, right.recommendationId),
  );

  for (let index = 1; index < copied.length; index += 1) {
    if (
      copied[index - 1]!.recommendationId.equals(
        copied[index]!.recommendationId,
      )
    ) {
      throw new Error(
        "ExecutionPlan recommendation provenance cannot contain duplicate " +
          "recommendation identifiers.",
      );
    }
  }

  return Object.freeze(copied);
};

const copyPlanningRuleProvenance = (
  values: unknown,
): readonly ExecutionPlanRuleProvenance[] => {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error(
      "ExecutionPlan planning rule provenance must contain at least one record.",
    );
  }

  const copied = values.map((value) => {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      throw new Error(
        "ExecutionPlan planning rule provenance contains an invalid record.",
      );
    }

    const record = value as ExecutionPlanRuleProvenance;
    return Object.freeze({
      ruleId: normalizeRequiredText(
        record.ruleId,
        "planning rule identifier",
      ),
      ruleVersion: normalizeRequiredText(
        record.ruleVersion,
        "planning rule version",
      ),
    });
  });

  copied.sort(
    (left, right) =>
      compareText(left.ruleId, right.ruleId) ||
      compareText(left.ruleVersion, right.ruleVersion),
  );

  for (let index = 1; index < copied.length; index += 1) {
    if (copied[index - 1]!.ruleId === copied[index]!.ruleId) {
      throw new Error(
        "ExecutionPlan planning rule provenance cannot contain duplicate rule identifiers.",
      );
    }
  }

  return Object.freeze(copied);
};

const copyWorkPackages = (
  values: unknown,
  sourceRecommendationIds: readonly Identifier[],
  recommendationProvenance: readonly ExecutionPlanRecommendationProvenance[],
): readonly ExecutionPlanWorkPackage[] => {
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error(
      "ExecutionPlan work packages must contain at least one declarative package.",
    );
  }

  const provenanceByRecommendation = new Map(
    recommendationProvenance.map((record) => [
      record.recommendationId.value,
      record,
    ]),
  );

  const copied = values.map((value) => {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("ExecutionPlan contains an invalid work package.");
    }

    const record = value as ExecutionPlanWorkPackage;
    const workPackageId = requireIdentifier(
      record.workPackageId,
      "work-package",
    );
    const packageSourceIds = copyIdentifierSet(
      record.sourceRecommendationIds,
      "work-package source recommendations",
    );

    for (const sourceId of packageSourceIds) {
      if (!sourceRecommendationIds.some((id) => id.equals(sourceId))) {
        throw new Error(
          "ExecutionPlan work-package lineage references an unknown source recommendation.",
        );
      }
    }

    const expectedTraceIds = identifierUnion(
      packageSourceIds.map(
        (sourceId) => provenanceByRecommendation.get(sourceId.value)!.traceId,
      ),
    );
    const packageTraceIds = copyIdentifierSet(
      record.traceIds,
      "work-package traces",
    );
    if (!sameIdentifierSet(expectedTraceIds, packageTraceIds)) {
      throw new Error(
        "ExecutionPlan work-package trace lineage must match its source recommendations.",
      );
    }

    return Object.freeze({
      workPackageId,
      sourceRecommendationIds: packageSourceIds,
      traceIds: packageTraceIds,
      objective: normalizeRequiredText(
        record.objective,
        "work-package objective",
      ),
      intervention: normalizeRequiredText(
        record.intervention,
        "work-package intervention",
      ),
      entryCriteria: copyTextSet(
        record.entryCriteria,
        "work-package entry criteria",
      ),
      exitCriteria: copyTextSet(
        record.exitCriteria,
        "work-package exit criteria",
      ),
      requiredCapabilities: copyTextSet(
        record.requiredCapabilities,
        "work-package required capabilities",
      ),
      requiredResources: copyTextSet(
        record.requiredResources,
        "work-package required resources",
      ),
      executionConstraints: copyTextSet(
        record.executionConstraints,
        "work-package execution constraints",
      ),
      validationCheckpoints: copyTextSet(
        record.validationCheckpoints,
        "work-package validation checkpoints",
      ),
      completionCriteria: copyTextSet(
        record.completionCriteria,
        "work-package completion criteria",
      ),
      dependencyReferences: copyIdentifierSet(
        record.dependencyReferences,
        "work-package dependency references",
        true,
      ),
      rollbackConsiderations: copyTextSet(
        record.rollbackConsiderations,
        "work-package rollback considerations",
      ),
    });
  });

  copied.sort((left, right) =>
    compareIdentifiers(left.workPackageId, right.workPackageId),
  );
  for (let index = 1; index < copied.length; index += 1) {
    if (copied[index - 1]!.workPackageId.equals(copied[index]!.workPackageId)) {
      throw new Error(
        "ExecutionPlan work packages cannot contain duplicate identifiers.",
      );
    }
  }

  return Object.freeze(copied);
};

const copyDependencyGraph = (
  values: unknown,
  workPackages: readonly ExecutionPlanWorkPackage[],
): readonly ExecutionPlanDependency[] => {
  if (!Array.isArray(values)) {
    throw new Error(
      "ExecutionPlan dependency graph must be a declarative dependency array.",
    );
  }

  const workPackageIds = new Set(
    workPackages.map((workPackage) => workPackage.workPackageId.value),
  );
  const copied = values.map((value) => {
    if (value === null || typeof value !== "object" || Array.isArray(value)) {
      throw new Error("ExecutionPlan dependency graph contains an invalid edge.");
    }

    const record = value as ExecutionPlanDependency;
    const predecessorWorkPackageId = requireIdentifier(
      record.predecessorWorkPackageId,
      "dependency predecessor work-package",
    );
    const successorWorkPackageId = requireIdentifier(
      record.successorWorkPackageId,
      "dependency successor work-package",
    );

    if (
      !workPackageIds.has(predecessorWorkPackageId.value) ||
      !workPackageIds.has(successorWorkPackageId.value)
    ) {
      throw new Error(
        "ExecutionPlan dependency graph references an unknown work package.",
      );
    }
    if (predecessorWorkPackageId.equals(successorWorkPackageId)) {
      throw new Error(
        "ExecutionPlan work package cannot depend on itself.",
      );
    }

    return Object.freeze({
      predecessorWorkPackageId,
      successorWorkPackageId,
    });
  });

  copied.sort(
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

  for (let index = 1; index < copied.length; index += 1) {
    const previous = copied[index - 1]!;
    const current = copied[index]!;
    if (
      previous.predecessorWorkPackageId.equals(
        current.predecessorWorkPackageId,
      ) &&
      previous.successorWorkPackageId.equals(current.successorWorkPackageId)
    ) {
      throw new Error(
        "ExecutionPlan dependency graph cannot contain duplicate edges.",
      );
    }
  }

  return Object.freeze(copied);
};

const orderWorkPackages = (
  workPackages: readonly ExecutionPlanWorkPackage[],
  dependencyGraph: readonly ExecutionPlanDependency[],
): readonly ExecutionPlanWorkPackage[] => {
  const byId = new Map(
    workPackages.map((workPackage) => [
      workPackage.workPackageId.value,
      workPackage,
    ]),
  );
  const indegree = new Map(
    workPackages.map((workPackage) => [workPackage.workPackageId.value, 0]),
  );
  const successors = new Map(
    workPackages.map((workPackage) => [
      workPackage.workPackageId.value,
      [] as string[],
    ]),
  );

  for (const edge of dependencyGraph) {
    const successorId = edge.successorWorkPackageId.value;
    indegree.set(successorId, indegree.get(successorId)! + 1);
    successors
      .get(edge.predecessorWorkPackageId.value)!
      .push(successorId);
  }
  for (const values of successors.values()) {
    values.sort(compareText);
  }

  const ready = [...indegree.entries()]
    .filter(([, count]) => count === 0)
    .map(([workPackageId]) => workPackageId)
    .sort(compareText);
  const ordered: ExecutionPlanWorkPackage[] = [];

  while (ready.length > 0) {
    const workPackageId = ready.shift()!;
    ordered.push(byId.get(workPackageId)!);

    for (const successorId of successors.get(workPackageId)!) {
      const nextIndegree = indegree.get(successorId)! - 1;
      indegree.set(successorId, nextIndegree);
      if (nextIndegree === 0) {
        ready.push(successorId);
        ready.sort(compareText);
      }
    }
  }

  if (ordered.length !== workPackages.length) {
    throw new Error("ExecutionPlan dependency graph cannot contain cycles.");
  }

  return Object.freeze(ordered);
};

const validateDependencyReferences = (
  workPackages: readonly ExecutionPlanWorkPackage[],
  dependencyGraph: readonly ExecutionPlanDependency[],
): void => {
  for (const workPackage of workPackages) {
    const graphPredecessors = Object.freeze(
      dependencyGraph
        .filter((edge) =>
          edge.successorWorkPackageId.equals(workPackage.workPackageId),
        )
        .map((edge) => edge.predecessorWorkPackageId)
        .sort(compareIdentifiers),
    );

    if (!sameIdentifierSet(graphPredecessors, workPackage.dependencyReferences)) {
      throw new Error(
        "ExecutionPlan work-package dependency references must match the " +
          "authoritative dependency graph.",
      );
    }
  }
};

const unionWorkPackageText = (
  workPackages: readonly ExecutionPlanWorkPackage[],
  selector: (workPackage: ExecutionPlanWorkPackage) => readonly string[],
): readonly string[] =>
  textUnion(
    workPackages.flatMap((workPackage) => [...selector(workPackage)]),
  );

const normalizeExecutionPlan = (input: ExecutionPlanInput): NormalizedExecutionPlan => {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    throw new Error("ExecutionPlan input must be a declarative planning record.");
  }

  const organizationId = requireIdentifier(
    input.organizationId,
    "organization",
  );
  const sourceRecommendationIds = copyIdentifierSet(
    input.sourceRecommendationIds,
    "source recommendations",
  );
  const traceIds = copyIdentifierSet(input.traceIds, "traces");
  const recommendationProvenance = copyRecommendationProvenance(
    input.recommendationProvenance,
    organizationId,
  );

  const provenanceRecommendationIds = Object.freeze(
    recommendationProvenance.map((record) => record.recommendationId),
  );
  if (!sameIdentifierSet(sourceRecommendationIds, provenanceRecommendationIds)) {
    throw new Error(
      "ExecutionPlan source recommendation identifiers must match recommendation provenance.",
    );
  }

  const provenanceTraceIds = identifierUnion(
    recommendationProvenance.map((record) => record.traceId),
  );
  if (!sameIdentifierSet(traceIds, provenanceTraceIds)) {
    throw new Error(
      "ExecutionPlan trace identifiers must match recommendation provenance.",
    );
  }

  const planningPolicyId = normalizeRequiredText(
    input.planningPolicyId,
    "planning policy identifier",
  );
  const planningPolicyVersion = normalizeRequiredText(
    input.planningPolicyVersion,
    "planning policy version",
  );
  const planningRuleProvenance = copyPlanningRuleProvenance(
    input.planningRuleProvenance,
  );
  const unorderedWorkPackages = copyWorkPackages(
    input.workPackages,
    sourceRecommendationIds,
    recommendationProvenance,
  );
  const dependencyGraph = copyDependencyGraph(
    input.dependencyGraph,
    unorderedWorkPackages,
  );
  validateDependencyReferences(unorderedWorkPackages, dependencyGraph);
  const workPackages = orderWorkPackages(
    unorderedWorkPackages,
    dependencyGraph,
  );

  const requiredCapabilities = copyTextSet(
    input.requiredCapabilities,
    "required capabilities",
  );
  const packageCapabilities = unionWorkPackageText(
    workPackages,
    (workPackage) => workPackage.requiredCapabilities,
  );
  if (
    requiredCapabilities.length !== packageCapabilities.length ||
    requiredCapabilities.some(
      (value, index) => value !== packageCapabilities[index],
    )
  ) {
    throw new Error(
      "ExecutionPlan required capabilities must match its work packages.",
    );
  }

  const requiredResources = copyTextSet(
    input.requiredResources,
    "required resources",
  );
  const packageResources = unionWorkPackageText(
    workPackages,
    (workPackage) => workPackage.requiredResources,
  );
  if (
    requiredResources.length !== packageResources.length ||
    requiredResources.some((value, index) => value !== packageResources[index])
  ) {
    throw new Error(
      "ExecutionPlan required resources must match its work packages.",
    );
  }

  if (typeof input.createdAt !== "string") {
    throw new Error(
      "ExecutionPlan creation time must be a valid date-time value.",
    );
  }
  const creationTime = Date.parse(input.createdAt);
  if (!Number.isFinite(creationTime)) {
    throw new Error(
      "ExecutionPlan creation time must be a valid date-time value.",
    );
  }

  return Object.freeze({
    organizationId,
    sourceRecommendationIds,
    traceIds,
    recommendationProvenance,
    planningPolicyId,
    planningPolicyVersion,
    planningRuleProvenance,
    workPackages,
    dependencyGraph,
    requiredCapabilities,
    requiredResources,
    executionAssumptions: copyTextSet(
      input.executionAssumptions,
      "execution assumptions",
    ),
    executionConstraints: copyTextSet(
      input.executionConstraints,
      "execution constraints",
    ),
    admissibilityChecks: copyTextSet(
      input.admissibilityChecks,
      "admissibility checks",
    ),
    riskControls: copyTextSet(input.riskControls, "risk controls"),
    approvalGates: copyTextSet(input.approvalGates, "approval gates"),
    rollbackConsiderations: copyTextSet(
      input.rollbackConsiderations,
      "rollback considerations",
    ),
    completionCriteria: copyTextSet(
      input.completionCriteria,
      "completion criteria",
    ),
    successCriteria: copyTextSet(input.successCriteria, "success criteria"),
    createdAt: new Date(creationTime).toISOString(),
    schemaVersion: normalizeRequiredText(input.schemaVersion, "schema version"),
  });
};

const serializeState = (
  state: NormalizedExecutionPlan,
): Omit<SerializedExecutionPlan, "planId"> =>
  Object.freeze({
    organizationId: state.organizationId.value,
    sourceRecommendationIds: Object.freeze(
      state.sourceRecommendationIds.map((identifier) => identifier.value),
    ),
    traceIds: Object.freeze(
      state.traceIds.map((identifier) => identifier.value),
    ),
    recommendationProvenance: Object.freeze(
      state.recommendationProvenance.map((record) =>
        Object.freeze({
          recommendationId: record.recommendationId.value,
          organizationId: record.organizationId.value,
          traceId: record.traceId.value,
          recommendationSchemaVersion: record.recommendationSchemaVersion,
          ruleId: record.ruleId,
          ruleVersion: record.ruleVersion,
          policyId: record.policyId,
          policyVersion: record.policyVersion,
        }),
      ),
    ),
    planningPolicyId: state.planningPolicyId,
    planningPolicyVersion: state.planningPolicyVersion,
    planningRuleProvenance: Object.freeze(
      state.planningRuleProvenance.map((record) =>
        Object.freeze({
          ruleId: record.ruleId,
          ruleVersion: record.ruleVersion,
        }),
      ),
    ),
    workPackages: Object.freeze(
      state.workPackages.map((workPackage) =>
        Object.freeze({
          workPackageId: workPackage.workPackageId.value,
          sourceRecommendationIds: Object.freeze(
            workPackage.sourceRecommendationIds.map(
              (identifier) => identifier.value,
            ),
          ),
          traceIds: Object.freeze(
            workPackage.traceIds.map((identifier) => identifier.value),
          ),
          objective: workPackage.objective,
          intervention: workPackage.intervention,
          entryCriteria: Object.freeze([...workPackage.entryCriteria]),
          exitCriteria: Object.freeze([...workPackage.exitCriteria]),
          requiredCapabilities: Object.freeze([
            ...workPackage.requiredCapabilities,
          ]),
          requiredResources: Object.freeze([...workPackage.requiredResources]),
          executionConstraints: Object.freeze([
            ...workPackage.executionConstraints,
          ]),
          validationCheckpoints: Object.freeze([
            ...workPackage.validationCheckpoints,
          ]),
          completionCriteria: Object.freeze([
            ...workPackage.completionCriteria,
          ]),
          dependencyReferences: Object.freeze(
            workPackage.dependencyReferences.map(
              (identifier) => identifier.value,
            ),
          ),
          rollbackConsiderations: Object.freeze([
            ...workPackage.rollbackConsiderations,
          ]),
        }),
      ),
    ),
    dependencyGraph: Object.freeze(
      state.dependencyGraph.map((edge) =>
        Object.freeze({
          predecessorWorkPackageId: edge.predecessorWorkPackageId.value,
          successorWorkPackageId: edge.successorWorkPackageId.value,
        }),
      ),
    ),
    requiredCapabilities: Object.freeze([...state.requiredCapabilities]),
    requiredResources: Object.freeze([...state.requiredResources]),
    executionAssumptions: Object.freeze([...state.executionAssumptions]),
    executionConstraints: Object.freeze([...state.executionConstraints]),
    admissibilityChecks: Object.freeze([...state.admissibilityChecks]),
    riskControls: Object.freeze([...state.riskControls]),
    approvalGates: Object.freeze([...state.approvalGates]),
    rollbackConsiderations: Object.freeze([...state.rollbackConsiderations]),
    completionCriteria: Object.freeze([...state.completionCriteria]),
    successCriteria: Object.freeze([...state.successCriteria]),
    createdAt: state.createdAt,
    schemaVersion: state.schemaVersion,
  });

const identityComponent = (value: string): string =>
  `${identityEncoder.encode(value).byteLength}:${value}`;

const createExecutionPlanIdentifier = (
  state: NormalizedExecutionPlan,
): Identifier => {
  const canonicalState = JSON.stringify(serializeState(state));
  const canonicalIdentity = [identityNamespace, canonicalState]
    .map(identityComponent)
    .join("");

  return new Identifier(`execution-plan:v1:${canonicalIdentity}`);
};

export class ExecutionPlan extends Entity {
  readonly #state: NormalizedExecutionPlan;

  constructor(input: ExecutionPlanInput) {
    const state = normalizeExecutionPlan(input);
    super(createExecutionPlanIdentifier(state));
    this.#state = state;
    Object.freeze(this);
  }

  get planId(): Identifier {
    return this.id;
  }

  get organizationId(): Identifier {
    return this.#state.organizationId;
  }

  get sourceRecommendationIds(): readonly Identifier[] {
    return this.#state.sourceRecommendationIds;
  }

  get traceIds(): readonly Identifier[] {
    return this.#state.traceIds;
  }

  get recommendationProvenance(): readonly ExecutionPlanRecommendationProvenance[] {
    return this.#state.recommendationProvenance;
  }

  get planningPolicyId(): string {
    return this.#state.planningPolicyId;
  }

  get planningPolicyVersion(): string {
    return this.#state.planningPolicyVersion;
  }

  get planningRuleProvenance(): readonly ExecutionPlanRuleProvenance[] {
    return this.#state.planningRuleProvenance;
  }

  get workPackages(): readonly ExecutionPlanWorkPackage[] {
    return this.#state.workPackages;
  }

  get dependencyGraph(): readonly ExecutionPlanDependency[] {
    return this.#state.dependencyGraph;
  }

  get requiredCapabilities(): readonly string[] {
    return this.#state.requiredCapabilities;
  }

  get requiredResources(): readonly string[] {
    return this.#state.requiredResources;
  }

  get executionAssumptions(): readonly string[] {
    return this.#state.executionAssumptions;
  }

  get executionConstraints(): readonly string[] {
    return this.#state.executionConstraints;
  }

  get admissibilityChecks(): readonly string[] {
    return this.#state.admissibilityChecks;
  }

  get riskControls(): readonly string[] {
    return this.#state.riskControls;
  }

  get approvalGates(): readonly string[] {
    return this.#state.approvalGates;
  }

  get rollbackConsiderations(): readonly string[] {
    return this.#state.rollbackConsiderations;
  }

  get completionCriteria(): readonly string[] {
    return this.#state.completionCriteria;
  }

  get successCriteria(): readonly string[] {
    return this.#state.successCriteria;
  }

  get createdAt(): string {
    return this.#state.createdAt;
  }

  get schemaVersion(): string {
    return this.#state.schemaVersion;
  }

  toJSON(): SerializedExecutionPlan {
    return Object.freeze({
      planId: this.planId.value,
      ...serializeState(this.#state),
    });
  }
}
