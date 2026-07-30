import {
  type ExecutionPlanRuleProvenance,
} from "../intelligence/ExecutionPlan.js";
import { Entity, Identifier } from "../common/index.js";
import {
  RuntimeAdmission,
  type RuntimeAdmissionId,
  type RuntimeAdmissionProvenance,
} from "./RuntimeAdmission.js";

export type ExecutionEventId = Identifier;

export type ExecutionEventProvenance = Readonly<{
  recorderType: "HUMAN" | "SYSTEM" | "SERVICE" | "GOVERNED_AUTOMATION";
  recorderId: string;
}>;

export type ExecutionEventInput = Readonly<{
  runtimeAdmission: RuntimeAdmission;
  workPackageId: Identifier;
  occurredAt: string;
  eventProvenance: ExecutionEventProvenance;
}>;

export type ExecutionEventFailureCode =
  | "INVALID_EXECUTION_EVENT_INPUT"
  | "MISSING_RUNTIME_ADMISSION"
  | "INVALID_RUNTIME_ADMISSION"
  | "INVALID_RUNTIME_ADMISSION_PROJECTION"
  | "MISSING_WORK_PACKAGE_ID"
  | "INVALID_WORK_PACKAGE_ID"
  | "WORK_PACKAGE_NOT_ADMITTED"
  | "MISSING_EXECUTION_TIMESTAMP"
  | "INVALID_EXECUTION_TIMESTAMP"
  | "EXECUTION_PRECEDES_ADMISSION"
  | "MISSING_EVENT_PROVENANCE"
  | "INVALID_EVENT_PROVENANCE_TYPE"
  | "INVALID_EVENT_PROVENANCE_ID"
  | "EXECUTION_EVENT_IDENTITY_DERIVATION_FAILED"
  | "EXECUTION_EVENT_SERIALIZATION_FAILED";

type ErrorDetailValue = string | number | boolean | null;
type ErrorDetails = Readonly<Record<string, ErrorDetailValue>>;

export class ExecutionEventError extends Error {
  readonly #code: ExecutionEventFailureCode;
  readonly #details: ErrorDetails;

  constructor(
    code: ExecutionEventFailureCode,
    message: string,
    details: Readonly<Record<string, ErrorDetailValue>> = {},
  ) {
    super(message);
    this.name = "ExecutionEventError";
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

  get code(): ExecutionEventFailureCode {
    return this.#code;
  }

  get details(): ErrorDetails {
    return this.#details;
  }
}

export type SerializedExecutionEvent = Readonly<{
  executionEventId: string;
  eventType: "EXECUTION_OCCURRED";
  runtimeAdmissionId: string;
  executionPlanId: string;
  organizationId: string;
  workPackageId: string;
  recommendationIds: readonly string[];
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
  runtimeAdmissionSchemaVersion: "runtime-admission:v1";
  admissionProvenance: RuntimeAdmissionProvenance;
  eventProvenance: ExecutionEventProvenance;
  occurredAt: string;
  version: "1.0.0";
  schemaVersion: "execution-event:v1";
}>;

type PlanningPolicyProvenance = Readonly<{
  planningPolicyId: string;
  planningPolicyVersion: string;
}>;

type ProjectedWorkPackage = Readonly<{
  workPackageId: Identifier;
  recommendationIds: readonly Identifier[];
  traceIds: readonly Identifier[];
}>;

type RuntimeAdmissionProjection = Readonly<{
  runtimeAdmissionId: RuntimeAdmissionId;
  executionPlanId: Identifier;
  organizationId: Identifier;
  admittedWorkPackages: readonly ProjectedWorkPackage[];
  planningRuleProvenance: readonly ExecutionPlanRuleProvenance[];
  planningPolicyProvenance: PlanningPolicyProvenance;
  executionPlanSchemaVersion: string;
  runtimeAdmissionSchemaVersion: "runtime-admission:v1";
  admissionProvenance: RuntimeAdmissionProvenance;
  admittedAt: string;
}>;

type NormalizedExecutionEvent = Readonly<{
  eventType: "EXECUTION_OCCURRED";
  runtimeAdmissionId: RuntimeAdmissionId;
  executionPlanId: Identifier;
  organizationId: Identifier;
  workPackageId: Identifier;
  recommendationIds: readonly Identifier[];
  traceIds: readonly Identifier[];
  planningRuleProvenance: readonly ExecutionPlanRuleProvenance[];
  planningPolicyProvenance: PlanningPolicyProvenance;
  executionPlanSchemaVersion: string;
  runtimeAdmissionSchemaVersion: "runtime-admission:v1";
  admissionProvenance: RuntimeAdmissionProvenance;
  eventProvenance: ExecutionEventProvenance;
  occurredAt: string;
  version: "1.0.0";
  schemaVersion: "execution-event:v1";
}>;

const eventType = "EXECUTION_OCCURRED" as const;
const version = "1.0.0" as const;
const schemaVersion = "execution-event:v1" as const;
const runtimeAdmissionSchemaVersion = "runtime-admission:v1" as const;
const identityPrefix = "execution-event:v1:";
const textEncoder = new TextEncoder();
const offsetDateTimePattern =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})$/u;
const recorderTypes: readonly ExecutionEventProvenance["recorderType"][] =
  Object.freeze(["HUMAN", "SYSTEM", "SERVICE", "GOVERNED_AUTOMATION"]);

const compareText = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const fail = (
  code: ExecutionEventFailureCode,
  message: string,
  details: Readonly<Record<string, ErrorDetailValue>> = {},
): never => {
  throw new ExecutionEventError(code, message, details);
};

const projectionFailure = (): never =>
  fail(
    "INVALID_RUNTIME_ADMISSION_PROJECTION",
    "RuntimeAdmission does not expose a valid canonical execution projection.",
  );

const identifierValue = (
  value: unknown,
  code: ExecutionEventFailureCode,
  message: string,
): string => {
  if (!(value instanceof Identifier)) {
    return fail(code, message);
  }
  let raw: unknown;
  try {
    raw = value.value;
  } catch {
    return fail(code, message);
  }
  if (
    typeof raw !== "string" ||
    raw.length === 0 ||
    raw !== raw.trim()
  ) {
    return fail(code, message);
  }
  return raw;
};

const projectionIdentifier = (value: unknown): Identifier => {
  identifierValue(
    value,
    "INVALID_RUNTIME_ADMISSION_PROJECTION",
    "RuntimeAdmission does not expose a valid canonical execution projection.",
  );
  return value as Identifier;
};

const projectionText = (value: unknown): string => {
  if (
    typeof value !== "string" ||
    value.length === 0 ||
    value !== value.trim() ||
    value !== value.normalize("NFC")
  ) {
    return projectionFailure();
  }
  return value;
};

const copyCanonicalIdentifierArray = (
  value: unknown,
): readonly Identifier[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return projectionFailure();
  }
  const copied = value.map(projectionIdentifier);
  for (let index = 1; index < copied.length; index += 1) {
    if (
      compareText(copied[index - 1]!.value, copied[index]!.value) >= 0
    ) {
      return projectionFailure();
    }
  }
  return Object.freeze(copied);
};

const projectWorkPackages = (
  value: unknown,
): readonly ProjectedWorkPackage[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return projectionFailure();
  }
  const copied = value.map((candidate) => {
    if (
      candidate === null ||
      typeof candidate !== "object" ||
      Array.isArray(candidate)
    ) {
      return projectionFailure();
    }
    const workPackage = candidate as Readonly<Record<string, unknown>>;
    return Object.freeze({
      workPackageId: projectionIdentifier(workPackage.workPackageId),
      recommendationIds: copyCanonicalIdentifierArray(
        workPackage.recommendationIds,
      ),
      traceIds: copyCanonicalIdentifierArray(workPackage.traceIds),
    });
  });
  for (let index = 1; index < copied.length; index += 1) {
    if (
      compareText(
        copied[index - 1]!.workPackageId.value,
        copied[index]!.workPackageId.value,
      ) >= 0
    ) {
      return projectionFailure();
    }
  }
  return Object.freeze(copied);
};

const projectPlanningRules = (
  value: unknown,
): readonly ExecutionPlanRuleProvenance[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return projectionFailure();
  }
  const copied = value.map((candidate) => {
    if (
      candidate === null ||
      typeof candidate !== "object" ||
      Array.isArray(candidate)
    ) {
      return projectionFailure();
    }
    const record = candidate as Readonly<Record<string, unknown>>;
    return Object.freeze({
      ruleId: projectionText(record.ruleId),
      ruleVersion: projectionText(record.ruleVersion),
    });
  });
  for (let index = 1; index < copied.length; index += 1) {
    const previous = copied[index - 1]!;
    const current = copied[index]!;
    if (
      compareText(previous.ruleId, current.ruleId) > 0 ||
      (previous.ruleId === current.ruleId &&
        compareText(previous.ruleVersion, current.ruleVersion) >= 0)
    ) {
      return projectionFailure();
    }
  }
  return Object.freeze(copied);
};

const projectPlanningPolicy = (
  value: unknown,
): PlanningPolicyProvenance => {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return projectionFailure();
  }
  const policy = value as Readonly<Record<string, unknown>>;
  return Object.freeze({
    planningPolicyId: projectionText(policy.planningPolicyId),
    planningPolicyVersion: projectionText(policy.planningPolicyVersion),
  });
};

const projectAdmissionProvenance = (
  value: unknown,
): RuntimeAdmissionProvenance => {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return projectionFailure();
  }
  const provenance = value as Readonly<Record<string, unknown>>;
  const admissionSchemaVersion = projectionText(
    provenance.admissionSchemaVersion,
  );
  if (admissionSchemaVersion !== runtimeAdmissionSchemaVersion) {
    return projectionFailure();
  }
  return Object.freeze({
    admissionPolicyId: projectionText(provenance.admissionPolicyId),
    admissionPolicyVersion: projectionText(provenance.admissionPolicyVersion),
    admissionSchemaVersion,
  });
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
      "INVALID_EXECUTION_TIMESTAMP",
      "ExecutionEvent timestamp must be a valid offset date-time.",
    );
  }
  const match = offsetDateTimePattern.exec(value);
  if (match === null) {
    return fail(
      "INVALID_EXECUTION_TIMESTAMP",
      "ExecutionEvent timestamp must be a valid offset date-time.",
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
      "INVALID_EXECUTION_TIMESTAMP",
      "ExecutionEvent timestamp must be a valid offset date-time.",
    );
  }
  if (timezone !== "Z") {
    const offsetHour = Number(timezone.slice(1, 3));
    const offsetMinute = Number(timezone.slice(4, 6));
    if (offsetHour > 23 || offsetMinute > 59) {
      return fail(
        "INVALID_EXECUTION_TIMESTAMP",
        "ExecutionEvent timestamp must be a valid offset date-time.",
      );
    }
  }
  const instant = Date.parse(value);
  if (!Number.isFinite(instant)) {
    return fail(
      "INVALID_EXECUTION_TIMESTAMP",
      "ExecutionEvent timestamp must be a valid offset date-time.",
    );
  }
  return new Date(instant).toISOString();
};

const projectAdmissionTimestamp = (value: unknown): string => {
  if (typeof value !== "string") {
    return projectionFailure();
  }
  const match = offsetDateTimePattern.exec(value);
  if (match === null || !value.endsWith("Z") || value.length !== 24) {
    return projectionFailure();
  }
  const instant = Date.parse(value);
  if (!Number.isFinite(instant) || new Date(instant).toISOString() !== value) {
    return projectionFailure();
  }
  return value;
};

const projectRuntimeAdmission = (
  runtimeAdmission: RuntimeAdmission,
): RuntimeAdmissionProjection => {
  try {
    const runtimeAdmissionId = projectionIdentifier(
      runtimeAdmission.runtimeAdmissionId,
    );
    if (!runtimeAdmissionId.equals(runtimeAdmission.id)) {
      return projectionFailure();
    }
    const executionPlanId = projectionIdentifier(
      runtimeAdmission.executionPlanId,
    );
    const organizationId = projectionIdentifier(
      runtimeAdmission.organizationId,
    );
    const admittedWorkPackages = projectWorkPackages(
      runtimeAdmission.admittedWorkPackages,
    );
    const planningRuleProvenance = projectPlanningRules(
      runtimeAdmission.planningRuleProvenance,
    );
    const planningPolicyProvenance = projectPlanningPolicy(
      runtimeAdmission.planningPolicyProvenance,
    );
    const executionPlanSchemaVersion = projectionText(
      runtimeAdmission.executionPlanSchemaVersion,
    );
    if (
      runtimeAdmission.schemaVersion !== runtimeAdmissionSchemaVersion ||
      runtimeAdmission.version !== version
    ) {
      return projectionFailure();
    }
    const admissionProvenance = projectAdmissionProvenance(
      runtimeAdmission.admissionProvenance,
    );
    const admittedAt = projectAdmissionTimestamp(runtimeAdmission.admittedAt);

    return Object.freeze({
      runtimeAdmissionId,
      executionPlanId,
      organizationId,
      admittedWorkPackages,
      planningRuleProvenance,
      planningPolicyProvenance,
      executionPlanSchemaVersion,
      runtimeAdmissionSchemaVersion,
      admissionProvenance,
      admittedAt,
    });
  } catch (error) {
    if (
      error instanceof ExecutionEventError &&
      error.code === "INVALID_RUNTIME_ADMISSION_PROJECTION"
    ) {
      throw error;
    }
    return projectionFailure();
  }
};

const normalizeEventProvenance = (
  value: unknown,
): ExecutionEventProvenance => {
  if (
    value === null ||
    value === undefined ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return fail(
      "MISSING_EVENT_PROVENANCE",
      "ExecutionEvent requires event provenance.",
    );
  }
  const provenance = value as Readonly<Record<string, unknown>>;
  if (
    typeof provenance.recorderType !== "string" ||
    !recorderTypes.includes(
      provenance.recorderType as ExecutionEventProvenance["recorderType"],
    )
  ) {
    return fail(
      "INVALID_EVENT_PROVENANCE_TYPE",
      "ExecutionEvent recorder type is not supported.",
    );
  }
  if (typeof provenance.recorderId !== "string") {
    return fail(
      "INVALID_EVENT_PROVENANCE_ID",
      "ExecutionEvent recorder identity is invalid.",
    );
  }
  const recorderId = provenance.recorderId.normalize("NFC");
  if (
    provenance.recorderId.length === 0 ||
    provenance.recorderId !== provenance.recorderId.trim() ||
    recorderId.length === 0 ||
    textEncoder.encode(recorderId).byteLength > 256
  ) {
    return fail(
      "INVALID_EVENT_PROVENANCE_ID",
      "ExecutionEvent recorder identity is invalid.",
    );
  }
  return Object.freeze({
    recorderType:
      provenance.recorderType as ExecutionEventProvenance["recorderType"],
    recorderId,
  });
};

const normalizeExecutionEvent = (
  input: ExecutionEventInput,
): NormalizedExecutionEvent => {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return fail(
      "INVALID_EXECUTION_EVENT_INPUT",
      "ExecutionEvent input must be a declarative record.",
    );
  }
  const runtimeAdmission = input.runtimeAdmission;
  if (runtimeAdmission === null || runtimeAdmission === undefined) {
    return fail(
      "MISSING_RUNTIME_ADMISSION",
      "ExecutionEvent requires one RuntimeAdmission.",
    );
  }
  if (!(runtimeAdmission instanceof RuntimeAdmission)) {
    return fail(
      "INVALID_RUNTIME_ADMISSION",
      "ExecutionEvent requires a canonical admitted RuntimeAdmission.",
    );
  }
  try {
    if (runtimeAdmission.decision !== "ADMITTED") {
      return fail(
        "INVALID_RUNTIME_ADMISSION",
        "ExecutionEvent requires a canonical admitted RuntimeAdmission.",
      );
    }
  } catch {
    return fail(
      "INVALID_RUNTIME_ADMISSION",
      "ExecutionEvent requires a canonical admitted RuntimeAdmission.",
    );
  }

  const projection = projectRuntimeAdmission(runtimeAdmission);

  if (input.workPackageId === null || input.workPackageId === undefined) {
    return fail(
      "MISSING_WORK_PACKAGE_ID",
      "ExecutionEvent requires one admitted work-package identifier.",
    );
  }
  const requestedWorkPackageId = identifierValue(
    input.workPackageId,
    "INVALID_WORK_PACKAGE_ID",
    "ExecutionEvent work-package identity must be a valid Identifier.",
  );
  const selected = projection.admittedWorkPackages.find(
    ({ workPackageId }) => workPackageId.value === requestedWorkPackageId,
  );
  if (selected === undefined) {
    return fail(
      "WORK_PACKAGE_NOT_ADMITTED",
      "ExecutionEvent work package is not present in the RuntimeAdmission.",
      { workPackageId: requestedWorkPackageId },
    );
  }

  if (input.occurredAt === null || input.occurredAt === undefined) {
    return fail(
      "MISSING_EXECUTION_TIMESTAMP",
      "ExecutionEvent requires an explicit execution timestamp.",
    );
  }
  const occurredAt = normalizeTimestamp(input.occurredAt);
  if (Date.parse(occurredAt) < Date.parse(projection.admittedAt)) {
    return fail(
      "EXECUTION_PRECEDES_ADMISSION",
      "ExecutionEvent timestamp cannot precede RuntimeAdmission admission time.",
      {
        admittedAt: projection.admittedAt,
        occurredAt,
      },
    );
  }
  const eventProvenance = normalizeEventProvenance(input.eventProvenance);

  return Object.freeze({
    eventType,
    runtimeAdmissionId: projection.runtimeAdmissionId,
    executionPlanId: projection.executionPlanId,
    organizationId: projection.organizationId,
    workPackageId: selected.workPackageId,
    recommendationIds: Object.freeze([...selected.recommendationIds]),
    traceIds: Object.freeze([...selected.traceIds]),
    planningRuleProvenance: Object.freeze(
      projection.planningRuleProvenance.map((record) =>
        Object.freeze({ ...record }),
      ),
    ),
    planningPolicyProvenance: Object.freeze({
      ...projection.planningPolicyProvenance,
    }),
    executionPlanSchemaVersion: projection.executionPlanSchemaVersion,
    runtimeAdmissionSchemaVersion: projection.runtimeAdmissionSchemaVersion,
    admissionProvenance: Object.freeze({
      ...projection.admissionProvenance,
    }),
    eventProvenance,
    occurredAt,
    version,
    schemaVersion,
  });
};

const serializePlanningRules = (
  values: readonly ExecutionPlanRuleProvenance[],
): SerializedExecutionEvent["planningRuleProvenance"] =>
  Object.freeze(
    values.map((record) =>
      Object.freeze({
        ruleId: record.ruleId,
        ruleVersion: record.ruleVersion,
      }),
    ),
  );

const serializeState = (
  id: ExecutionEventId,
  state: NormalizedExecutionEvent,
): SerializedExecutionEvent =>
  Object.freeze({
    executionEventId: id.value,
    eventType: state.eventType,
    runtimeAdmissionId: state.runtimeAdmissionId.value,
    executionPlanId: state.executionPlanId.value,
    organizationId: state.organizationId.value,
    workPackageId: state.workPackageId.value,
    recommendationIds: Object.freeze(
      state.recommendationIds.map(({ value }) => value),
    ),
    traceIds: Object.freeze(state.traceIds.map(({ value }) => value)),
    planningRuleProvenance: serializePlanningRules(
      state.planningRuleProvenance,
    ),
    planningPolicyProvenance: Object.freeze({
      planningPolicyId: state.planningPolicyProvenance.planningPolicyId,
      planningPolicyVersion:
        state.planningPolicyProvenance.planningPolicyVersion,
    }),
    executionPlanSchemaVersion: state.executionPlanSchemaVersion,
    runtimeAdmissionSchemaVersion: state.runtimeAdmissionSchemaVersion,
    admissionProvenance: Object.freeze({
      admissionPolicyId: state.admissionProvenance.admissionPolicyId,
      admissionPolicyVersion: state.admissionProvenance.admissionPolicyVersion,
      admissionSchemaVersion: state.admissionProvenance.admissionSchemaVersion,
    }),
    eventProvenance: Object.freeze({
      recorderType: state.eventProvenance.recorderType,
      recorderId: state.eventProvenance.recorderId,
    }),
    occurredAt: state.occurredAt,
    version: state.version,
    schemaVersion: state.schemaVersion,
  });

const stringifyCanonical = (value: unknown): string => {
  try {
    const serialized = JSON.stringify(value);
    if (serialized === undefined) {
      return fail(
        "EXECUTION_EVENT_SERIALIZATION_FAILED",
        "ExecutionEvent canonical serialization failed.",
      );
    }
    return serialized;
  } catch (error) {
    if (error instanceof ExecutionEventError) {
      throw error;
    }
    return fail(
      "EXECUTION_EVENT_SERIALIZATION_FAILED",
      "ExecutionEvent canonical serialization failed.",
    );
  }
};

const identityComponent = (value: string): string => {
  const normalized = value.normalize("NFC");
  return `${textEncoder.encode(normalized).byteLength}:${normalized}`;
};

const createExecutionEventId = async (
  state: NormalizedExecutionEvent,
): Promise<ExecutionEventId> => {
  const components = [
    state.schemaVersion,
    state.version,
    state.eventType,
    state.runtimeAdmissionId.value,
    state.executionPlanId.value,
    state.organizationId.value,
    state.workPackageId.value,
    stringifyCanonical(
      state.recommendationIds.map(({ value }) => value),
    ),
    stringifyCanonical(state.traceIds.map(({ value }) => value)),
    stringifyCanonical(
      serializePlanningRules(state.planningRuleProvenance),
    ),
    stringifyCanonical({
      planningPolicyId: state.planningPolicyProvenance.planningPolicyId,
      planningPolicyVersion:
        state.planningPolicyProvenance.planningPolicyVersion,
    }),
    state.executionPlanSchemaVersion,
    state.runtimeAdmissionSchemaVersion,
    stringifyCanonical({
      admissionPolicyId: state.admissionProvenance.admissionPolicyId,
      admissionPolicyVersion: state.admissionProvenance.admissionPolicyVersion,
      admissionSchemaVersion: state.admissionProvenance.admissionSchemaVersion,
    }),
    stringifyCanonical({
      recorderType: state.eventProvenance.recorderType,
      recorderId: state.eventProvenance.recorderId,
    }),
    state.occurredAt,
  ];
  const material = components.map(identityComponent).join("");

  let digest: ArrayBuffer;
  try {
    digest = await globalThis.crypto.subtle.digest(
      "SHA-256",
      textEncoder.encode(material),
    );
  } catch {
    return fail(
      "EXECUTION_EVENT_IDENTITY_DERIVATION_FAILED",
      "ExecutionEvent identity derivation failed.",
    );
  }
  const hexadecimal = Array.from(
    new Uint8Array(digest),
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("");
  return new Identifier(`${identityPrefix}${hexadecimal}`);
};

export class ExecutionEvent extends Entity {
  readonly #state: NormalizedExecutionEvent;

  private constructor(
    executionEventId: ExecutionEventId,
    state: NormalizedExecutionEvent,
  ) {
    super(executionEventId);
    this.#state = state;
    Object.freeze(this);
  }

  static async create(input: ExecutionEventInput): Promise<ExecutionEvent> {
    const state = normalizeExecutionEvent(input);
    const executionEventId = await createExecutionEventId(state);
    return new ExecutionEvent(executionEventId, state);
  }

  get executionEventId(): ExecutionEventId {
    return this.id;
  }

  get eventType(): "EXECUTION_OCCURRED" {
    return this.#state.eventType;
  }

  get runtimeAdmissionId(): RuntimeAdmissionId {
    return this.#state.runtimeAdmissionId;
  }

  get executionPlanId(): Identifier {
    return this.#state.executionPlanId;
  }

  get organizationId(): Identifier {
    return this.#state.organizationId;
  }

  get workPackageId(): Identifier {
    return this.#state.workPackageId;
  }

  get recommendationIds(): readonly Identifier[] {
    return this.#state.recommendationIds;
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

  get runtimeAdmissionSchemaVersion(): "runtime-admission:v1" {
    return this.#state.runtimeAdmissionSchemaVersion;
  }

  get admissionProvenance(): RuntimeAdmissionProvenance {
    return this.#state.admissionProvenance;
  }

  get eventProvenance(): ExecutionEventProvenance {
    return this.#state.eventProvenance;
  }

  get occurredAt(): string {
    return this.#state.occurredAt;
  }

  get version(): "1.0.0" {
    return this.#state.version;
  }

  get schemaVersion(): "execution-event:v1" {
    return this.#state.schemaVersion;
  }

  toJSON(): SerializedExecutionEvent {
    return serializeState(this.executionEventId, this.#state);
  }

  serialize(): string {
    return stringifyCanonical(this.toJSON());
  }
}
