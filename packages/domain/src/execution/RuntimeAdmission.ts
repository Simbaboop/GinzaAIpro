import {
  ExecutionPlan,
  type ExecutionPlanRuleProvenance,
  type ExecutionPlanWorkPackage,
} from "../intelligence/ExecutionPlan.js";
import { Entity, Identifier } from "../common/index.js";

export type RuntimeAdmissionId = Identifier;

export type RuntimeAdmissionDecision = "ADMITTED";

export type RuntimeAdmissionActorType =
  | "HUMAN"
  | "SYSTEM"
  | "SERVICE"
  | "GOVERNED_AUTOMATION";

export type RuntimeAdmissionActor = Readonly<{
  actorType: RuntimeAdmissionActorType;
  actorId: string;
}>;

export type RuntimeAdmissionReason = Readonly<{
  code: string;
  message: string;
}>;

export type RuntimeAdmissionProvenance = Readonly<{
  admissionPolicyId: string;
  admissionPolicyVersion: string;
  admissionSchemaVersion: "runtime-admission:v1";
}>;

export type AdmittedWorkPackage = Readonly<{
  workPackageId: Identifier;
  recommendationIds: readonly Identifier[];
  traceIds: readonly Identifier[];
}>;

export type CreateRuntimeAdmissionInput = Readonly<{
  executionPlan: ExecutionPlan;
  workPackageIds: readonly Identifier[];
  admissionOrdinal: number;
  admittedBy: RuntimeAdmissionActor;
  admittedAt: string;
  admissionReason: RuntimeAdmissionReason;
  admissionProvenance: RuntimeAdmissionProvenance;
}>;

export type RuntimeAdmissionFailureCode =
  | "INVALID_RUNTIME_ADMISSION_INPUT"
  | "MISSING_EXECUTION_PLAN"
  | "INVALID_EXECUTION_PLAN_ID"
  | "INVALID_EXECUTION_PLAN_ORGANIZATION"
  | "INVALID_EXECUTION_PLAN_SCHEMA_VERSION"
  | "MISSING_WORK_PACKAGE_IDS"
  | "INVALID_WORK_PACKAGE_ID"
  | "DUPLICATE_WORK_PACKAGE_ID"
  | "WORK_PACKAGE_NOT_FOUND"
  | "INVALID_WORK_PACKAGE_RECOMMENDATION_BINDING"
  | "INVALID_WORK_PACKAGE_TRACE_BINDING"
  | "WORK_PACKAGE_TRACE_NOT_IN_EXECUTION_PLAN"
  | "INVALID_ADMISSION_TRACE_SET"
  | "INVALID_PLANNING_RULE_PROVENANCE"
  | "INVALID_PLANNING_POLICY_PROVENANCE"
  | "INVALID_ADMISSION_ORDINAL"
  | "INVALID_RUNTIME_ADMISSION_ACTOR_TYPE"
  | "INVALID_RUNTIME_ADMISSION_ACTOR_ID"
  | "INVALID_ADMISSION_TIMESTAMP"
  | "INVALID_ADMISSION_REASON_CODE"
  | "INVALID_ADMISSION_REASON_MESSAGE"
  | "INVALID_ADMISSION_POLICY_ID"
  | "INVALID_ADMISSION_POLICY_VERSION"
  | "INVALID_ADMISSION_SCHEMA_VERSION"
  | "RUNTIME_ADMISSION_IDENTITY_DERIVATION_FAILED"
  | "RUNTIME_ADMISSION_SERIALIZATION_FAILED";

type ErrorDetailValue = string | number | boolean | null;
type ErrorDetails = Readonly<Record<string, ErrorDetailValue>>;

export class RuntimeAdmissionError extends Error {
  readonly #code: RuntimeAdmissionFailureCode;
  readonly #details: ErrorDetails;

  constructor(
    code: RuntimeAdmissionFailureCode,
    message: string,
    details: Readonly<Record<string, ErrorDetailValue>> = {},
  ) {
    super(message);
    this.name = "RuntimeAdmissionError";
    this.#code = code;
    this.#details = Object.freeze(
      Object.fromEntries(
        Object.entries(details).sort(([left], [right]) =>
          compareText(left, right),
        ),
      ),
    );
    Object.freeze(this);
  }

  get code(): RuntimeAdmissionFailureCode {
    return this.#code;
  }

  get details(): ErrorDetails {
    return this.#details;
  }
}

export type SerializedRuntimeAdmission = Readonly<{
  runtimeAdmissionId: string;
  admissionOrdinal: number;
  organizationId: string;
  executionPlanId: string;
  admittedWorkPackages: readonly Readonly<{
    workPackageId: string;
    recommendationIds: readonly string[];
    traceIds: readonly string[];
  }>[];
  traceIds: readonly string[];
  planningRuleProvenance: readonly Readonly<{
    ruleId: string;
    ruleVersion: string;
  }>[];
  planningPolicyProvenance: Readonly<{
    planningPolicyId: string;
    planningPolicyVersion: string;
  }>;
  executionPlanSchemaVersion: string;
  decision: RuntimeAdmissionDecision;
  admissionReason: RuntimeAdmissionReason;
  admittedBy: RuntimeAdmissionActor;
  admittedAt: string;
  admissionProvenance: RuntimeAdmissionProvenance;
  version: "1.0.0";
  schemaVersion: "runtime-admission:v1";
}>;

type PlanningPolicyProvenance = Readonly<{
  planningPolicyId: string;
  planningPolicyVersion: string;
}>;

type NormalizedRuntimeAdmission = Readonly<{
  admissionOrdinal: number;
  organizationId: Identifier;
  executionPlanId: Identifier;
  admittedWorkPackages: readonly AdmittedWorkPackage[];
  traceIds: readonly Identifier[];
  planningRuleProvenance: readonly ExecutionPlanRuleProvenance[];
  planningPolicyProvenance: PlanningPolicyProvenance;
  executionPlanSchemaVersion: string;
  decision: RuntimeAdmissionDecision;
  admissionReason: RuntimeAdmissionReason;
  admittedBy: RuntimeAdmissionActor;
  admittedAt: string;
  admissionProvenance: RuntimeAdmissionProvenance;
  version: "1.0.0";
  schemaVersion: "runtime-admission:v1";
}>;

const actorTypes: readonly RuntimeAdmissionActorType[] = Object.freeze([
  "HUMAN",
  "SYSTEM",
  "SERVICE",
  "GOVERNED_AUTOMATION",
]);
const version = "1.0.0" as const;
const schemaVersion = "runtime-admission:v1" as const;
const decision = "ADMITTED" as const;
const identityPrefix = "runtime-admission:v1:";
const textEncoder = new TextEncoder();
const offsetDateTimePattern =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})$/u;

const compareText = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const fail = (
  code: RuntimeAdmissionFailureCode,
  message: string,
  details: Readonly<Record<string, ErrorDetailValue>> = {},
): never => {
  throw new RuntimeAdmissionError(code, message, details);
};

const identifierValue = (
  value: unknown,
  code: RuntimeAdmissionFailureCode,
  label: string,
  details: Readonly<Record<string, ErrorDetailValue>> = {},
): string => {
  if (!(value instanceof Identifier)) {
    return fail(code, `${label} must be a canonical Identifier.`, details);
  }

  try {
    if (value.value.length === 0 || value.value.trim() !== value.value) {
      return fail(code, `${label} must be a valid Identifier.`, details);
    }
    return value.value;
  } catch {
    return fail(code, `${label} must expose a valid Identifier value.`, details);
  }
};

const requireCanonicalPlanText = (
  value: unknown,
  code: RuntimeAdmissionFailureCode,
  label: string,
): string => {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value.trim() !== value
  ) {
    return fail(code, `${label} must be non-empty canonical text.`);
  }
  return value;
};

const normalizeBoundedText = (
  value: unknown,
  code: RuntimeAdmissionFailureCode,
  label: string,
  maximumUtf8Bytes: number,
): string => {
  if (typeof value !== "string") {
    return fail(code, `${label} must be a string.`);
  }

  const normalized = value.normalize("NFC");
  if (normalized.length === 0 || normalized.trim() !== normalized) {
    return fail(code, `${label} cannot be empty or contain boundary whitespace.`);
  }
  if (textEncoder.encode(normalized).byteLength > maximumUtf8Bytes) {
    return fail(code, `${label} exceeds its UTF-8 byte limit.`, {
      maximumUtf8Bytes,
    });
  }
  return normalized;
};

const isLeapYear = (year: number): boolean =>
  year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);

const daysInMonth = (year: number, month: number): number => {
  const values = [
    31,
    isLeapYear(year) ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ] as const;
  return values[month - 1] ?? 0;
};

const normalizeTimestamp = (value: unknown): string => {
  if (typeof value !== "string") {
    return fail(
      "INVALID_ADMISSION_TIMESTAMP",
      "Runtime admission timestamp must be an offset date-time string.",
    );
  }

  const match = offsetDateTimePattern.exec(value);
  if (match === null) {
    return fail(
      "INVALID_ADMISSION_TIMESTAMP",
      "Runtime admission timestamp must include a timezone and valid precision.",
    );
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const timezone = match[8]!;
  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > daysInMonth(year, month) ||
    hour > 23 ||
    minute > 59 ||
    second > 59
  ) {
    return fail(
      "INVALID_ADMISSION_TIMESTAMP",
      "Runtime admission timestamp contains an invalid calendar value.",
    );
  }
  if (timezone !== "Z") {
    const offsetHour = Number(timezone.slice(1, 3));
    const offsetMinute = Number(timezone.slice(4, 6));
    if (offsetHour > 23 || offsetMinute > 59) {
      return fail(
        "INVALID_ADMISSION_TIMESTAMP",
        "Runtime admission timestamp contains an invalid timezone offset.",
      );
    }
  }

  const instant = Date.parse(value);
  if (!Number.isFinite(instant)) {
    return fail(
      "INVALID_ADMISSION_TIMESTAMP",
      "Runtime admission timestamp must identify a finite instant.",
    );
  }
  return new Date(instant).toISOString();
};

const canonicalIdentifierArray = (
  values: unknown,
  code: RuntimeAdmissionFailureCode,
  label: string,
  allowEmpty: boolean,
): readonly Identifier[] => {
  if (!Array.isArray(values) || (!allowEmpty && values.length === 0)) {
    return fail(code, `${label} must contain canonical identifiers.`);
  }

  const copied = values.map((value, index) => {
    identifierValue(value, code, `${label} item`, { index });
    return value as Identifier;
  });
  const seen = new Set<string>();
  for (const value of copied) {
    if (seen.has(value.value)) {
      return fail(code, `${label} cannot contain duplicate identifiers.`, {
        identifier: value.value,
      });
    }
    seen.add(value.value);
  }
  copied.sort((left, right) => compareText(left.value, right.value));
  return Object.freeze(copied);
};

const requestedWorkPackageIds = (
  values: unknown,
): readonly Identifier[] => {
  if (!Array.isArray(values) || values.length === 0) {
    return fail(
      "MISSING_WORK_PACKAGE_IDS",
      "Runtime admission requires at least one work-package identifier.",
    );
  }

  const copied = values.map((value, index) => {
    identifierValue(
      value,
      "INVALID_WORK_PACKAGE_ID",
      "Requested work-package identifier",
      { index },
    );
    return value as Identifier;
  });
  const seen = new Set<string>();
  for (const value of copied) {
    if (seen.has(value.value)) {
      return fail(
        "DUPLICATE_WORK_PACKAGE_ID",
        "Runtime admission cannot request the same work package twice.",
        { workPackageId: value.value },
      );
    }
    seen.add(value.value);
  }
  copied.sort((left, right) => compareText(left.value, right.value));
  return Object.freeze(copied);
};

const resolveWorkPackages = (
  plan: ExecutionPlan,
  requested: readonly Identifier[],
): readonly ExecutionPlanWorkPackage[] => {
  let workPackages: readonly ExecutionPlanWorkPackage[];
  try {
    workPackages = plan.workPackages;
  } catch {
    return fail(
      "WORK_PACKAGE_NOT_FOUND",
      "ExecutionPlan does not expose canonical work packages.",
    );
  }
  if (!Array.isArray(workPackages)) {
    return fail(
      "WORK_PACKAGE_NOT_FOUND",
      "ExecutionPlan work packages must be an immutable array.",
    );
  }

  const byId = new Map<string, ExecutionPlanWorkPackage>();
  for (const workPackage of workPackages) {
    if (workPackage === null || typeof workPackage !== "object") {
      return fail(
        "WORK_PACKAGE_NOT_FOUND",
        "ExecutionPlan contains an invalid work-package record.",
      );
    }
    const value = identifierValue(
      workPackage.workPackageId,
      "WORK_PACKAGE_NOT_FOUND",
      "ExecutionPlan work-package identifier",
    );
    if (byId.has(value)) {
      return fail(
        "WORK_PACKAGE_NOT_FOUND",
        "ExecutionPlan contains duplicate work-package identities.",
        { workPackageId: value },
      );
    }
    byId.set(value, workPackage);
  }

  return Object.freeze(
    requested.map((identifier) => {
      const workPackage = byId.get(identifier.value);
      if (workPackage === undefined) {
        return fail(
          "WORK_PACKAGE_NOT_FOUND",
          "Requested work package does not exist in the ExecutionPlan.",
          { workPackageId: identifier.value },
        );
      }
      return workPackage;
    }),
  );
};

const normalizeAdmittedWorkPackages = (
  workPackages: readonly ExecutionPlanWorkPackage[],
): readonly AdmittedWorkPackage[] =>
  Object.freeze(
    workPackages.map((workPackage) => {
      const recommendationIds = canonicalIdentifierArray(
        workPackage.sourceRecommendationIds,
        "INVALID_WORK_PACKAGE_RECOMMENDATION_BINDING",
        "Work-package recommendation binding",
        false,
      );
      const rawTraceIds = workPackage.traceIds;
      if (Array.isArray(rawTraceIds) && rawTraceIds.length === 0) {
        return fail(
          "INVALID_ADMISSION_TRACE_SET",
          "An admitted work package must preserve at least one trace.",
          { workPackageId: workPackage.workPackageId.value },
        );
      }
      const traceIds = canonicalIdentifierArray(
        rawTraceIds,
        "INVALID_WORK_PACKAGE_TRACE_BINDING",
        "Work-package trace binding",
        false,
      );
      return Object.freeze({
        workPackageId: workPackage.workPackageId,
        recommendationIds,
        traceIds,
      });
    }),
  );

const validatePlanTraceMembership = (
  plan: ExecutionPlan,
  admitted: readonly AdmittedWorkPackage[],
): void => {
  let planTraceIds: readonly Identifier[];
  try {
    planTraceIds = canonicalIdentifierArray(
      plan.traceIds,
      "INVALID_ADMISSION_TRACE_SET",
      "ExecutionPlan trace set",
      false,
    );
  } catch (error) {
    if (error instanceof RuntimeAdmissionError) {
      throw error;
    }
    return fail(
      "INVALID_ADMISSION_TRACE_SET",
      "ExecutionPlan does not expose a valid trace set.",
    );
  }
  const planTraceValues = new Set(planTraceIds.map(({ value }) => value));
  for (const workPackage of admitted) {
    for (const traceId of workPackage.traceIds) {
      if (!planTraceValues.has(traceId.value)) {
        return fail(
          "WORK_PACKAGE_TRACE_NOT_IN_EXECUTION_PLAN",
          "Work-package trace does not belong to the ExecutionPlan trace set.",
          {
            traceId: traceId.value,
            workPackageId: workPackage.workPackageId.value,
          },
        );
      }
    }
  }
};

const traceUnion = (
  admitted: readonly AdmittedWorkPackage[],
): readonly Identifier[] => {
  const byValue = new Map<string, Identifier>();
  for (const workPackage of admitted) {
    for (const traceId of workPackage.traceIds) {
      byValue.set(traceId.value, traceId);
    }
  }
  const values = [...byValue.values()].sort((left, right) =>
    compareText(left.value, right.value),
  );
  if (values.length === 0) {
    return fail(
      "INVALID_ADMISSION_TRACE_SET",
      "Runtime admission must preserve a non-empty trace set.",
    );
  }
  return Object.freeze(values);
};

const planningRuleProvenance = (
  plan: ExecutionPlan,
): readonly ExecutionPlanRuleProvenance[] => {
  let source: readonly ExecutionPlanRuleProvenance[];
  try {
    source = plan.planningRuleProvenance;
  } catch {
    return fail(
      "INVALID_PLANNING_RULE_PROVENANCE",
      "ExecutionPlan does not expose planning-rule provenance.",
    );
  }
  if (!Array.isArray(source) || source.length === 0) {
    return fail(
      "INVALID_PLANNING_RULE_PROVENANCE",
      "Planning-rule provenance must contain at least one record.",
    );
  }

  const copied = source.map((record) => {
    if (record === null || typeof record !== "object") {
      return fail(
        "INVALID_PLANNING_RULE_PROVENANCE",
        "Planning-rule provenance contains an invalid record.",
      );
    }
    return Object.freeze({
      ruleId: requireCanonicalPlanText(
        record.ruleId,
        "INVALID_PLANNING_RULE_PROVENANCE",
        "Planning rule identifier",
      ),
      ruleVersion: requireCanonicalPlanText(
        record.ruleVersion,
        "INVALID_PLANNING_RULE_PROVENANCE",
        "Planning rule version",
      ),
    });
  });

  for (let index = 1; index < copied.length; index += 1) {
    const previous = copied[index - 1]!;
    const current = copied[index]!;
    if (
      previous.ruleId === current.ruleId ||
      compareText(previous.ruleId, current.ruleId) > 0 ||
      (previous.ruleId === current.ruleId &&
        compareText(previous.ruleVersion, current.ruleVersion) > 0)
    ) {
      return fail(
        "INVALID_PLANNING_RULE_PROVENANCE",
        "Planning-rule provenance must preserve canonical ordering and uniqueness.",
      );
    }
  }
  return Object.freeze(copied);
};

const planningPolicyProvenance = (
  plan: ExecutionPlan,
): PlanningPolicyProvenance => {
  let planningPolicyId: unknown;
  let planningPolicyVersion: unknown;
  try {
    planningPolicyId = plan.planningPolicyId;
    planningPolicyVersion = plan.planningPolicyVersion;
  } catch {
    return fail(
      "INVALID_PLANNING_POLICY_PROVENANCE",
      "ExecutionPlan does not expose planning-policy provenance.",
    );
  }
  return Object.freeze({
    planningPolicyId: requireCanonicalPlanText(
      planningPolicyId,
      "INVALID_PLANNING_POLICY_PROVENANCE",
      "Planning policy identifier",
    ),
    planningPolicyVersion: requireCanonicalPlanText(
      planningPolicyVersion,
      "INVALID_PLANNING_POLICY_PROVENANCE",
      "Planning policy version",
    ),
  });
};

const normalizeActor = (value: unknown): RuntimeAdmissionActor => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return fail(
      "INVALID_RUNTIME_ADMISSION_ACTOR_TYPE",
      "Runtime admission actor must be a declarative record.",
    );
  }
  const actor = value as RuntimeAdmissionActor;
  if (!actorTypes.includes(actor.actorType)) {
    return fail(
      "INVALID_RUNTIME_ADMISSION_ACTOR_TYPE",
      "Runtime admission actor type is not supported.",
    );
  }
  return Object.freeze({
    actorType: actor.actorType,
    actorId: normalizeBoundedText(
      actor.actorId,
      "INVALID_RUNTIME_ADMISSION_ACTOR_ID",
      "Runtime admission actor identifier",
      256,
    ),
  });
};

const normalizeReason = (value: unknown): RuntimeAdmissionReason => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return fail(
      "INVALID_ADMISSION_REASON_CODE",
      "Runtime admission reason must be a declarative record.",
    );
  }
  const reason = value as RuntimeAdmissionReason;
  return Object.freeze({
    code: normalizeBoundedText(
      reason.code,
      "INVALID_ADMISSION_REASON_CODE",
      "Runtime admission reason code",
      256,
    ),
    message: normalizeBoundedText(
      reason.message,
      "INVALID_ADMISSION_REASON_MESSAGE",
      "Runtime admission reason message",
      4096,
    ),
  });
};

const normalizeAdmissionProvenance = (
  value: unknown,
): RuntimeAdmissionProvenance => {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return fail(
      "INVALID_ADMISSION_POLICY_ID",
      "Runtime admission provenance must be a declarative record.",
    );
  }
  const provenance = value as RuntimeAdmissionProvenance;
  const admissionPolicyId = normalizeBoundedText(
    provenance.admissionPolicyId,
    "INVALID_ADMISSION_POLICY_ID",
    "Runtime admission policy identifier",
    256,
  );
  const admissionPolicyVersion = normalizeBoundedText(
    provenance.admissionPolicyVersion,
    "INVALID_ADMISSION_POLICY_VERSION",
    "Runtime admission policy version",
    128,
  );
  if (provenance.admissionSchemaVersion !== schemaVersion) {
    return fail(
      "INVALID_ADMISSION_SCHEMA_VERSION",
      "Runtime admission provenance requires the canonical schema version.",
    );
  }
  return Object.freeze({
    admissionPolicyId,
    admissionPolicyVersion,
    admissionSchemaVersion: schemaVersion,
  });
};

const normalizeRuntimeAdmission = (
  input: CreateRuntimeAdmissionInput,
): NormalizedRuntimeAdmission => {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return fail(
      "INVALID_RUNTIME_ADMISSION_INPUT",
      "RuntimeAdmission input must be a declarative record.",
    );
  }

  const plan = input.executionPlan;
  if (plan === null || plan === undefined) {
    return fail(
      "MISSING_EXECUTION_PLAN",
      "RuntimeAdmission requires an ExecutionPlan.",
    );
  }
  if (!(plan instanceof ExecutionPlan)) {
    return fail(
      "INVALID_EXECUTION_PLAN_ID",
      "RuntimeAdmission requires a canonical ExecutionPlan instance.",
    );
  }

  let executionPlanId: Identifier;
  try {
    executionPlanId = plan.planId;
  } catch {
    return fail(
      "INVALID_EXECUTION_PLAN_ID",
      "ExecutionPlan does not expose canonical identity.",
    );
  }
  identifierValue(
    executionPlanId,
    "INVALID_EXECUTION_PLAN_ID",
    "ExecutionPlan identity",
  );

  let organizationId: Identifier;
  try {
    organizationId = plan.organizationId;
  } catch {
    return fail(
      "INVALID_EXECUTION_PLAN_ORGANIZATION",
      "ExecutionPlan does not expose canonical organization identity.",
    );
  }
  identifierValue(
    organizationId,
    "INVALID_EXECUTION_PLAN_ORGANIZATION",
    "ExecutionPlan organization identity",
  );

  let executionPlanSchemaVersion: unknown;
  try {
    executionPlanSchemaVersion = plan.schemaVersion;
  } catch {
    return fail(
      "INVALID_EXECUTION_PLAN_SCHEMA_VERSION",
      "ExecutionPlan does not expose canonical schema version.",
    );
  }
  const canonicalExecutionPlanSchemaVersion = requireCanonicalPlanText(
    executionPlanSchemaVersion,
    "INVALID_EXECUTION_PLAN_SCHEMA_VERSION",
    "ExecutionPlan schema version",
  );

  const requested = requestedWorkPackageIds(input.workPackageIds);
  const resolved = resolveWorkPackages(plan, requested);
  const admittedWorkPackages = normalizeAdmittedWorkPackages(resolved);
  validatePlanTraceMembership(plan, admittedWorkPackages);
  const traceIds = traceUnion(admittedWorkPackages);
  const rules = planningRuleProvenance(plan);
  const policy = planningPolicyProvenance(plan);

  if (!Number.isSafeInteger(input.admissionOrdinal) || input.admissionOrdinal < 1) {
    return fail(
      "INVALID_ADMISSION_ORDINAL",
      "Runtime admission ordinal must be a positive safe integer.",
    );
  }
  const admittedBy = normalizeActor(input.admittedBy);
  const admittedAt = normalizeTimestamp(input.admittedAt);
  const admissionReason = normalizeReason(input.admissionReason);
  const admissionProvenance = normalizeAdmissionProvenance(
    input.admissionProvenance,
  );

  return Object.freeze({
    admissionOrdinal: input.admissionOrdinal,
    organizationId,
    executionPlanId,
    admittedWorkPackages,
    traceIds,
    planningRuleProvenance: rules,
    planningPolicyProvenance: policy,
    executionPlanSchemaVersion: canonicalExecutionPlanSchemaVersion,
    decision,
    admissionReason,
    admittedBy,
    admittedAt,
    admissionProvenance,
    version,
    schemaVersion,
  });
};

const serializeAdmittedWorkPackages = (
  values: readonly AdmittedWorkPackage[],
): SerializedRuntimeAdmission["admittedWorkPackages"] =>
  Object.freeze(
    values.map((workPackage) =>
      Object.freeze({
        workPackageId: workPackage.workPackageId.value,
        recommendationIds: Object.freeze(
          workPackage.recommendationIds.map(({ value }) => value),
        ),
        traceIds: Object.freeze(
          workPackage.traceIds.map(({ value }) => value),
        ),
      }),
    ),
  );

const serializePlanningRuleProvenance = (
  values: readonly ExecutionPlanRuleProvenance[],
): SerializedRuntimeAdmission["planningRuleProvenance"] =>
  Object.freeze(
    values.map((record) =>
      Object.freeze({
        ruleId: record.ruleId,
        ruleVersion: record.ruleVersion,
      }),
    ),
  );

const stringifyCanonical = (value: unknown): string => {
  try {
    const serialized = JSON.stringify(value);
    if (serialized === undefined) {
      return fail(
        "RUNTIME_ADMISSION_SERIALIZATION_FAILED",
        "RuntimeAdmission canonical serialization produced no value.",
      );
    }
    return serialized;
  } catch {
    return fail(
      "RUNTIME_ADMISSION_SERIALIZATION_FAILED",
      "RuntimeAdmission canonical serialization failed.",
    );
  }
};

const identityComponent = (value: string): string => {
  const normalized = value.normalize("NFC");
  return `${textEncoder.encode(normalized).byteLength}:${normalized}`;
};

const createRuntimeAdmissionId = async (
  state: NormalizedRuntimeAdmission,
): Promise<RuntimeAdmissionId> => {
  const admittedWorkPackages = serializeAdmittedWorkPackages(
    state.admittedWorkPackages,
  );
  const traceIds = Object.freeze(state.traceIds.map(({ value }) => value));
  const rules = serializePlanningRuleProvenance(
    state.planningRuleProvenance,
  );
  const policy = Object.freeze({
    planningPolicyId: state.planningPolicyProvenance.planningPolicyId,
    planningPolicyVersion: state.planningPolicyProvenance.planningPolicyVersion,
  });
  const components = [
    state.organizationId.value,
    state.executionPlanId.value,
    state.admissionOrdinal.toString(10),
    stringifyCanonical(admittedWorkPackages),
    stringifyCanonical(traceIds),
    stringifyCanonical(rules),
    stringifyCanonical(policy),
    state.executionPlanSchemaVersion,
    state.decision,
    state.admissionReason.code,
    state.admissionReason.message,
    state.admittedBy.actorType,
    state.admittedBy.actorId,
    state.admittedAt,
    state.admissionProvenance.admissionPolicyId,
    state.admissionProvenance.admissionPolicyVersion,
    state.admissionProvenance.admissionSchemaVersion,
    state.version,
    state.schemaVersion,
  ];
  const identityMaterial = components.map(identityComponent).join("");

  let digest: ArrayBuffer;
  try {
    digest = await globalThis.crypto.subtle.digest(
      "SHA-256",
      textEncoder.encode(identityMaterial),
    );
  } catch {
    return fail(
      "RUNTIME_ADMISSION_IDENTITY_DERIVATION_FAILED",
      "RuntimeAdmission identity derivation failed.",
    );
  }
  const hexadecimal = Array.from(
    new Uint8Array(digest),
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("");
  return new Identifier(`${identityPrefix}${hexadecimal}`);
};

const serializeState = (
  id: RuntimeAdmissionId,
  state: NormalizedRuntimeAdmission,
): SerializedRuntimeAdmission =>
  Object.freeze({
    runtimeAdmissionId: id.value,
    admissionOrdinal: state.admissionOrdinal,
    organizationId: state.organizationId.value,
    executionPlanId: state.executionPlanId.value,
    admittedWorkPackages: serializeAdmittedWorkPackages(
      state.admittedWorkPackages,
    ),
    traceIds: Object.freeze(state.traceIds.map(({ value }) => value)),
    planningRuleProvenance: serializePlanningRuleProvenance(
      state.planningRuleProvenance,
    ),
    planningPolicyProvenance: Object.freeze({
      planningPolicyId: state.planningPolicyProvenance.planningPolicyId,
      planningPolicyVersion:
        state.planningPolicyProvenance.planningPolicyVersion,
    }),
    executionPlanSchemaVersion: state.executionPlanSchemaVersion,
    decision: state.decision,
    admissionReason: Object.freeze({ ...state.admissionReason }),
    admittedBy: Object.freeze({ ...state.admittedBy }),
    admittedAt: state.admittedAt,
    admissionProvenance: Object.freeze({ ...state.admissionProvenance }),
    version: state.version,
    schemaVersion: state.schemaVersion,
  });

export class RuntimeAdmission extends Entity {
  readonly #state: NormalizedRuntimeAdmission;

  private constructor(
    runtimeAdmissionId: RuntimeAdmissionId,
    state: NormalizedRuntimeAdmission,
  ) {
    super(runtimeAdmissionId);
    this.#state = state;
    Object.freeze(this);
  }

  static async create(
    input: CreateRuntimeAdmissionInput,
  ): Promise<RuntimeAdmission> {
    const state = normalizeRuntimeAdmission(input);
    const runtimeAdmissionId = await createRuntimeAdmissionId(state);
    return new RuntimeAdmission(runtimeAdmissionId, state);
  }

  get runtimeAdmissionId(): RuntimeAdmissionId {
    return this.id;
  }

  get admissionOrdinal(): number {
    return this.#state.admissionOrdinal;
  }

  get organizationId(): Identifier {
    return this.#state.organizationId;
  }

  get executionPlanId(): Identifier {
    return this.#state.executionPlanId;
  }

  get admittedWorkPackages(): readonly AdmittedWorkPackage[] {
    return this.#state.admittedWorkPackages;
  }

  get traceIds(): readonly Identifier[] {
    return this.#state.traceIds;
  }

  get planningRuleProvenance(): readonly ExecutionPlanRuleProvenance[] {
    return this.#state.planningRuleProvenance;
  }

  get planningPolicyProvenance(): PlanningPolicyProvenance {
    return this.#state.planningPolicyProvenance;
  }

  get executionPlanSchemaVersion(): string {
    return this.#state.executionPlanSchemaVersion;
  }

  get decision(): RuntimeAdmissionDecision {
    return this.#state.decision;
  }

  get admissionReason(): RuntimeAdmissionReason {
    return this.#state.admissionReason;
  }

  get admittedBy(): RuntimeAdmissionActor {
    return this.#state.admittedBy;
  }

  get admittedAt(): string {
    return this.#state.admittedAt;
  }

  get admissionProvenance(): RuntimeAdmissionProvenance {
    return this.#state.admissionProvenance;
  }

  get version(): "1.0.0" {
    return this.#state.version;
  }

  get schemaVersion(): "runtime-admission:v1" {
    return this.#state.schemaVersion;
  }

  toJSON(): SerializedRuntimeAdmission {
    return serializeState(this.runtimeAdmissionId, this.#state);
  }

  serialize(): string {
    return stringifyCanonical(this.toJSON());
  }
}
