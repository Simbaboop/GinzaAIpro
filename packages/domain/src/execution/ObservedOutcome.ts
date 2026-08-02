import { Entity, Identifier } from "../common/index.js";
import type { ExecutionPlanRuleProvenance } from "../intelligence/ExecutionPlan.js";
import {
  ExecutionEvent,
  type ExecutionEventProvenance,
} from "./ExecutionEvent.js";
import type { RuntimeAdmissionProvenance } from "./RuntimeAdmission.js";

export type ObservedOutcomeId = Identifier;

type QuantitativeObservedOutcomeValue = Readonly<{
  kind: "QUANTITATIVE";
  value: string;
}>;

type CategoricalObservedOutcomeValue = Readonly<{
  kind: "CATEGORICAL";
  value: string;
}>;

type BooleanObservedOutcomeValue = Readonly<{
  kind: "BOOLEAN";
  value: boolean;
}>;

type TextObservedOutcomeValue = Readonly<{
  kind: "TEXT";
  value: string;
}>;

export type ObservedOutcomeValue =
  | QuantitativeObservedOutcomeValue
  | CategoricalObservedOutcomeValue
  | BooleanObservedOutcomeValue
  | TextObservedOutcomeValue;

export type ObservedOutcomeProvenance = Readonly<{
  sourceType:
    | "HUMAN"
    | "SYSTEM"
    | "SERVICE"
    | "SENSOR"
    | "GOVERNED_AUTOMATION";
  sourceId: string;
  collectionMethod: string;
  recorderType: "HUMAN" | "SYSTEM" | "SERVICE" | "GOVERNED_AUTOMATION";
  recorderId: string;
  recordedAt: string;
}>;

export type ObservedOutcomeInput = Readonly<{
  executionEvent: ExecutionEvent;
  subjectType: string;
  subjectId: Identifier;
  observationCode: string;
  value: ObservedOutcomeValue;
  unit?: string;
  measurementContext?: string;
  observedAt: string;
  provenance: ObservedOutcomeProvenance;
}>;

export type ObservedOutcomeFailureCode =
  | "INVALID_OBSERVED_OUTCOME_INPUT"
  | "MISSING_EXECUTION_EVENT"
  | "INVALID_EXECUTION_EVENT"
  | "INVALID_EXECUTION_EVENT_PROJECTION"
  | "MISSING_OBSERVATION_SUBJECT"
  | "INVALID_OBSERVATION_SUBJECT_TYPE"
  | "INVALID_OBSERVATION_SUBJECT_ID"
  | "MISSING_OBSERVATION_CODE"
  | "INVALID_OBSERVATION_CODE"
  | "MISSING_OBSERVATION_VALUE"
  | "INVALID_OBSERVATION_VALUE_KIND"
  | "INVALID_QUANTITATIVE_VALUE"
  | "INVALID_CATEGORICAL_VALUE"
  | "INVALID_BOOLEAN_VALUE"
  | "INVALID_TEXT_VALUE"
  | "INVALID_OBSERVATION_UNIT"
  | "INVALID_MEASUREMENT_CONTEXT"
  | "MISSING_OBSERVATION_TIMESTAMP"
  | "INVALID_OBSERVATION_TIMESTAMP"
  | "OBSERVATION_PRECEDES_EXECUTION"
  | "MISSING_OBSERVATION_PROVENANCE"
  | "INVALID_OBSERVATION_PROVENANCE"
  | "INVALID_RECORDING_TIMESTAMP"
  | "RECORDING_PRECEDES_OBSERVATION"
  | "OBSERVED_OUTCOME_IDENTITY_DERIVATION_FAILED"
  | "OBSERVED_OUTCOME_SERIALIZATION_FAILED";

type ObservedOutcomeErrorDetails = Readonly<{
  field?: string;
  operation?: string;
}>;

export class ObservedOutcomeError extends Error {
  readonly #code: ObservedOutcomeFailureCode;
  readonly #details: ObservedOutcomeErrorDetails;

  constructor(
    code: ObservedOutcomeFailureCode,
    message: string,
    details: ObservedOutcomeErrorDetails = {},
  ) {
    super(message);
    this.name = "ObservedOutcomeError";
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

  get code(): ObservedOutcomeFailureCode {
    return this.#code;
  }

  get details(): ObservedOutcomeErrorDetails {
    return this.#details;
  }
}

type SerializedRuleProvenance = Readonly<{
  ruleId: string;
  ruleVersion: string;
}>;

type PlanningPolicyProvenance = Readonly<{
  planningPolicyId: string;
  planningPolicyVersion: string;
}>;

export type SerializedObservedOutcome = Readonly<{
  observedOutcomeId: string;
  executionEventId: string;
  runtimeAdmissionId: string;
  executionPlanId: string;
  organizationId: string;
  workPackageId: string;
  recommendationIds: readonly string[];
  traceIds: readonly string[];
  planningRuleProvenance: readonly SerializedRuleProvenance[];
  planningPolicyProvenance: PlanningPolicyProvenance;
  executionPlanSchemaVersion: string;
  runtimeAdmissionSchemaVersion: "runtime-admission:v1";
  executionEventSchemaVersion: "execution-event:v1";
  admissionProvenance: RuntimeAdmissionProvenance;
  executionEventProvenance: ExecutionEventProvenance;
  executionOccurredAt: string;
  subjectType: string;
  subjectId: string;
  observationCode: string;
  value: ObservedOutcomeValue;
  unit?: string;
  measurementContext?: string;
  observedAt: string;
  provenance: ObservedOutcomeProvenance;
  version: "1.0.0";
  schemaVersion: "observed-outcome:v1";
}>;

type ExecutionEventProjection = Readonly<{
  executionEventId: Identifier;
  runtimeAdmissionId: Identifier;
  executionPlanId: Identifier;
  organizationId: Identifier;
  workPackageId: Identifier;
  recommendationIds: readonly Identifier[];
  traceIds: readonly Identifier[];
  planningRuleProvenance: readonly ExecutionPlanRuleProvenance[];
  planningPolicyProvenance: PlanningPolicyProvenance;
  executionPlanSchemaVersion: string;
  runtimeAdmissionSchemaVersion: "runtime-admission:v1";
  executionEventSchemaVersion: "execution-event:v1";
  admissionProvenance: RuntimeAdmissionProvenance;
  executionEventProvenance: ExecutionEventProvenance;
  executionOccurredAt: string;
}>;

type NormalizedObservedOutcome = Readonly<{
  executionEventId: Identifier;
  runtimeAdmissionId: Identifier;
  executionPlanId: Identifier;
  organizationId: Identifier;
  workPackageId: Identifier;
  recommendationIds: readonly Identifier[];
  traceIds: readonly Identifier[];
  planningRuleProvenance: readonly ExecutionPlanRuleProvenance[];
  planningPolicyProvenance: PlanningPolicyProvenance;
  executionPlanSchemaVersion: string;
  runtimeAdmissionSchemaVersion: "runtime-admission:v1";
  executionEventSchemaVersion: "execution-event:v1";
  admissionProvenance: RuntimeAdmissionProvenance;
  executionEventProvenance: ExecutionEventProvenance;
  executionOccurredAt: string;
  subjectType: string;
  subjectId: Identifier;
  observationCode: string;
  value: ObservedOutcomeValue;
  unit?: string;
  measurementContext?: string;
  observedAt: string;
  provenance: ObservedOutcomeProvenance;
  version: "1.0.0";
  schemaVersion: "observed-outcome:v1";
}>;

const version = "1.0.0" as const;
const schemaVersion = "observed-outcome:v1" as const;
const identityPrefix = "observed-outcome:v1:";
const textEncoder = new TextEncoder();
const canonicalTokenPattern = /^[A-Z][A-Z0-9_]{0,63}$/u;
const decimalPattern =
  /^(?:0|-?(?:0\.[0-9]*[1-9]|[1-9][0-9]*(?:\.[0-9]*[1-9])?))$/u;
const unitPattern = /^[A-Za-z][A-Za-z0-9._:/%-]{0,63}$/u;
const offsetDateTimePattern =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})$/u;
const c0ControlPattern = /[\u0000-\u001f]/u;
const disallowedTextControlPattern =
  /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u;
const sourceTypes: readonly ObservedOutcomeProvenance["sourceType"][] =
  Object.freeze([
    "HUMAN",
    "SYSTEM",
    "SERVICE",
    "SENSOR",
    "GOVERNED_AUTOMATION",
  ]);
const recorderTypes: readonly ObservedOutcomeProvenance["recorderType"][] =
  Object.freeze(["HUMAN", "SYSTEM", "SERVICE", "GOVERNED_AUTOMATION"]);

const compareText = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

const fail = (
  code: ObservedOutcomeFailureCode,
  message: string,
  details: ObservedOutcomeErrorDetails = {},
): never => {
  throw new ObservedOutcomeError(code, message, details);
};

const projectionFailure = (): never =>
  fail(
    "INVALID_EXECUTION_EVENT_PROJECTION",
    "ExecutionEvent does not expose a valid canonical observation projection.",
    { field: "executionEvent" },
  );

const identifierValue = (
  value: unknown,
  code: ObservedOutcomeFailureCode,
  field: string,
): string => {
  if (!(value instanceof Identifier)) {
    return fail(code, `ObservedOutcome ${field} must be a valid Identifier.`, {
      field,
    });
  }
  let raw: unknown;
  try {
    raw = value.value;
  } catch {
    return fail(code, `ObservedOutcome ${field} must be a valid Identifier.`, {
      field,
    });
  }
  if (
    typeof raw !== "string" ||
    raw.length === 0 ||
    raw !== raw.trim()
  ) {
    return fail(code, `ObservedOutcome ${field} must be a valid Identifier.`, {
      field,
    });
  }
  return raw;
};

const projectIdentifier = (value: unknown): Identifier => {
  identifierValue(
    value,
    "INVALID_EXECUTION_EVENT_PROJECTION",
    "executionEvent",
  );
  return value as Identifier;
};

const projectText = (value: unknown): string => {
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

const projectIdentifierArray = (value: unknown): readonly Identifier[] => {
  if (!Array.isArray(value) || value.length === 0) {
    return projectionFailure();
  }
  const copied = value.map(projectIdentifier);
  for (let index = 1; index < copied.length; index += 1) {
    if (
      compareText(copied[index - 1]!.value, copied[index]!.value) >= 0
    ) {
      return projectionFailure();
    }
  }
  return Object.freeze(copied);
};

const projectRuleProvenance = (
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
      ruleId: projectText(record.ruleId),
      ruleVersion: projectText(record.ruleVersion),
    });
  });
  for (let index = 1; index < copied.length; index += 1) {
    const previous = copied[index - 1]!;
    const current = copied[index]!;
    const byId = compareText(previous.ruleId, current.ruleId);
    if (
      byId > 0 ||
      (byId === 0 &&
        compareText(previous.ruleVersion, current.ruleVersion) >= 0)
    ) {
      return projectionFailure();
    }
  }
  return Object.freeze(copied);
};

const projectPlanningPolicy = (value: unknown): PlanningPolicyProvenance => {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return projectionFailure();
  }
  const record = value as Readonly<Record<string, unknown>>;
  return Object.freeze({
    planningPolicyId: projectText(record.planningPolicyId),
    planningPolicyVersion: projectText(record.planningPolicyVersion),
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
  const record = value as Readonly<Record<string, unknown>>;
  const admissionSchemaVersion = projectText(record.admissionSchemaVersion);
  if (admissionSchemaVersion !== "runtime-admission:v1") {
    return projectionFailure();
  }
  return Object.freeze({
    admissionPolicyId: projectText(record.admissionPolicyId),
    admissionPolicyVersion: projectText(record.admissionPolicyVersion),
    admissionSchemaVersion,
  });
};

const projectEventProvenance = (
  value: unknown,
): ExecutionEventProvenance => {
  if (
    value === null ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return projectionFailure();
  }
  const record = value as Readonly<Record<string, unknown>>;
  const recorderType = projectText(record.recorderType);
  if (
    recorderType !== "HUMAN" &&
    recorderType !== "SYSTEM" &&
    recorderType !== "SERVICE" &&
    recorderType !== "GOVERNED_AUTOMATION"
  ) {
    return projectionFailure();
  }
  return Object.freeze({
    recorderType,
    recorderId: projectText(record.recorderId),
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

const parseTimestamp = (
  value: unknown,
  code: "INVALID_OBSERVATION_TIMESTAMP" | "INVALID_RECORDING_TIMESTAMP",
  field: string,
): string => {
  if (typeof value !== "string") {
    return fail(code, `ObservedOutcome ${field} is not a valid date-time.`, {
      field,
    });
  }
  const match = offsetDateTimePattern.exec(value);
  if (match === null) {
    return fail(code, `ObservedOutcome ${field} is not a valid date-time.`, {
      field,
    });
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
    return fail(code, `ObservedOutcome ${field} is not a valid date-time.`, {
      field,
    });
  }
  if (timezone !== "Z") {
    const offsetHour = Number(timezone.slice(1, 3));
    const offsetMinute = Number(timezone.slice(4, 6));
    if (offsetHour > 23 || offsetMinute > 59) {
      return fail(code, `ObservedOutcome ${field} is not a valid date-time.`, {
        field,
      });
    }
  }
  const instant = Date.parse(value);
  if (!Number.isFinite(instant)) {
    return fail(code, `ObservedOutcome ${field} is not a valid date-time.`, {
      field,
    });
  }
  return new Date(instant).toISOString();
};

const projectTimestamp = (value: unknown): string => {
  if (
    typeof value !== "string" ||
    value.length !== 24 ||
    !value.endsWith("Z")
  ) {
    return projectionFailure();
  }
  const instant = Date.parse(value);
  if (!Number.isFinite(instant) || new Date(instant).toISOString() !== value) {
    return projectionFailure();
  }
  return value;
};

const projectExecutionEvent = (
  executionEvent: ExecutionEvent,
): ExecutionEventProjection => {
  try {
    const executionEventId = projectIdentifier(
      executionEvent.executionEventId,
    );
    if (!executionEventId.equals(executionEvent.id)) {
      return projectionFailure();
    }
    const runtimeAdmissionId = projectIdentifier(
      executionEvent.runtimeAdmissionId,
    );
    const executionPlanId = projectIdentifier(executionEvent.executionPlanId);
    const organizationId = projectIdentifier(executionEvent.organizationId);
    const workPackageId = projectIdentifier(executionEvent.workPackageId);
    const recommendationIds = projectIdentifierArray(
      executionEvent.recommendationIds,
    );
    const traceIds = projectIdentifierArray(executionEvent.traceIds);
    const planningRuleProvenance = projectRuleProvenance(
      executionEvent.planningRuleProvenance,
    );
    const planningPolicyProvenance = projectPlanningPolicy(
      executionEvent.planningPolicyProvenance,
    );
    const executionPlanSchemaVersion = projectText(
      executionEvent.executionPlanSchemaVersion,
    );
    if (
      executionEvent.runtimeAdmissionSchemaVersion !==
        "runtime-admission:v1" ||
      executionEvent.schemaVersion !== "execution-event:v1" ||
      executionEvent.version !== "1.0.0" ||
      executionEvent.eventType !== "EXECUTION_OCCURRED"
    ) {
      return projectionFailure();
    }
    const admissionProvenance = projectAdmissionProvenance(
      executionEvent.admissionProvenance,
    );
    const executionEventProvenance = projectEventProvenance(
      executionEvent.eventProvenance,
    );
    const executionOccurredAt = projectTimestamp(executionEvent.occurredAt);

    return Object.freeze({
      executionEventId,
      runtimeAdmissionId,
      executionPlanId,
      organizationId,
      workPackageId,
      recommendationIds,
      traceIds,
      planningRuleProvenance,
      planningPolicyProvenance,
      executionPlanSchemaVersion,
      runtimeAdmissionSchemaVersion: "runtime-admission:v1",
      executionEventSchemaVersion: "execution-event:v1",
      admissionProvenance,
      executionEventProvenance,
      executionOccurredAt,
    });
  } catch (error) {
    if (
      error instanceof ObservedOutcomeError &&
      error.code === "INVALID_EXECUTION_EVENT_PROJECTION"
    ) {
      throw error;
    }
    return projectionFailure();
  }
};

const normalizeToken = (
  value: unknown,
  missingCode:
    | "MISSING_OBSERVATION_SUBJECT"
    | "MISSING_OBSERVATION_CODE",
  invalidCode:
    | "INVALID_OBSERVATION_SUBJECT_TYPE"
    | "INVALID_OBSERVATION_CODE",
  field: string,
): string => {
  if (value === null || value === undefined) {
    return fail(missingCode, `ObservedOutcome requires ${field}.`, { field });
  }
  if (typeof value !== "string") {
    return fail(invalidCode, `ObservedOutcome ${field} is invalid.`, { field });
  }
  const normalized = value.trim().normalize("NFC");
  if (!canonicalTokenPattern.test(normalized)) {
    return fail(invalidCode, `ObservedOutcome ${field} is invalid.`, { field });
  }
  return normalized;
};

const normalizeSubjectId = (value: unknown): Identifier => {
  if (value === null || value === undefined) {
    return fail(
      "MISSING_OBSERVATION_SUBJECT",
      "ObservedOutcome requires subjectId.",
      { field: "subjectId" },
    );
  }
  identifierValue(
    value,
    "INVALID_OBSERVATION_SUBJECT_ID",
    "subjectId",
  );
  return value as Identifier;
};

const hasValidByteLength = (value: string, maximum: number): boolean =>
  textEncoder.encode(value).byteLength <= maximum;

const normalizeLineEndings = (value: string): string =>
  value.replace(/\r\n?/gu, "\n");

const normalizeValue = (value: unknown): ObservedOutcomeValue => {
  if (value === null || value === undefined) {
    return fail(
      "MISSING_OBSERVATION_VALUE",
      "ObservedOutcome requires one observation value.",
      { field: "value" },
    );
  }
  if (
    typeof value !== "object" ||
    Array.isArray(value) ||
    typeof (value as Readonly<Record<string, unknown>>).kind !== "string"
  ) {
    return fail(
      "INVALID_OBSERVATION_VALUE_KIND",
      "ObservedOutcome value kind is not supported.",
      { field: "value.kind" },
    );
  }
  const candidate = value as Readonly<Record<string, unknown>>;
  switch (candidate.kind) {
    case "QUANTITATIVE": {
      if (
        typeof candidate.value !== "string" ||
        !decimalPattern.test(candidate.value) ||
        !hasValidByteLength(candidate.value, 128)
      ) {
        return fail(
          "INVALID_QUANTITATIVE_VALUE",
          "ObservedOutcome quantitative value is not canonical.",
          { field: "value.value" },
        );
      }
      return Object.freeze({
        kind: "QUANTITATIVE",
        value: candidate.value,
      });
    }
    case "CATEGORICAL": {
      if (typeof candidate.value !== "string") {
        return fail(
          "INVALID_CATEGORICAL_VALUE",
          "ObservedOutcome categorical value is invalid.",
          { field: "value.value" },
        );
      }
      const normalized = candidate.value.trim().normalize("NFC");
      if (
        normalized.length === 0 ||
        c0ControlPattern.test(normalized) ||
        !hasValidByteLength(normalized, 128)
      ) {
        return fail(
          "INVALID_CATEGORICAL_VALUE",
          "ObservedOutcome categorical value is invalid.",
          { field: "value.value" },
        );
      }
      return Object.freeze({ kind: "CATEGORICAL", value: normalized });
    }
    case "BOOLEAN": {
      if (typeof candidate.value !== "boolean") {
        return fail(
          "INVALID_BOOLEAN_VALUE",
          "ObservedOutcome boolean value is invalid.",
          { field: "value.value" },
        );
      }
      return Object.freeze({ kind: "BOOLEAN", value: candidate.value });
    }
    case "TEXT": {
      if (typeof candidate.value !== "string") {
        return fail(
          "INVALID_TEXT_VALUE",
          "ObservedOutcome text value is invalid.",
          { field: "value.value" },
        );
      }
      const normalized = normalizeLineEndings(candidate.value)
        .trim()
        .normalize("NFC");
      if (
        normalized.length === 0 ||
        disallowedTextControlPattern.test(normalized) ||
        !hasValidByteLength(normalized, 1_024)
      ) {
        return fail(
          "INVALID_TEXT_VALUE",
          "ObservedOutcome text value is invalid.",
          { field: "value.value" },
        );
      }
      return Object.freeze({ kind: "TEXT", value: normalized });
    }
    default:
      return fail(
        "INVALID_OBSERVATION_VALUE_KIND",
        "ObservedOutcome value kind is not supported.",
        { field: "value.kind" },
      );
  }
};

const normalizeUnit = (
  value: unknown,
  valueKind: ObservedOutcomeValue["kind"],
): string | undefined => {
  if (valueKind !== "QUANTITATIVE") {
    if (value !== undefined) {
      return fail(
        "INVALID_OBSERVATION_UNIT",
        "ObservedOutcome unit is permitted only for quantitative values.",
        { field: "unit" },
      );
    }
    return undefined;
  }
  if (typeof value !== "string") {
    return fail(
      "INVALID_OBSERVATION_UNIT",
      "ObservedOutcome quantitative value requires a canonical unit.",
      { field: "unit" },
    );
  }
  const normalized = value.trim().normalize("NFC");
  if (!unitPattern.test(normalized)) {
    return fail(
      "INVALID_OBSERVATION_UNIT",
      "ObservedOutcome quantitative value requires a canonical unit.",
      { field: "unit" },
    );
  }
  return normalized;
};

const normalizeMeasurementContext = (value: unknown): string | undefined => {
  if (value === undefined) {
    return undefined;
  }
  if (typeof value !== "string") {
    return fail(
      "INVALID_MEASUREMENT_CONTEXT",
      "ObservedOutcome measurementContext is invalid.",
      { field: "measurementContext" },
    );
  }
  const normalized = normalizeLineEndings(value).trim().normalize("NFC");
  if (
    normalized.length === 0 ||
    disallowedTextControlPattern.test(normalized) ||
    !hasValidByteLength(normalized, 512)
  ) {
    return fail(
      "INVALID_MEASUREMENT_CONTEXT",
      "ObservedOutcome measurementContext is invalid.",
      { field: "measurementContext" },
    );
  }
  return normalized;
};

const normalizeProvenanceText = (
  value: unknown,
  field: string,
  maximum: number,
): string => {
  if (typeof value !== "string") {
    return fail(
      "INVALID_OBSERVATION_PROVENANCE",
      `ObservedOutcome ${field} is invalid.`,
      { field: `provenance.${field}` },
    );
  }
  const normalized = value.trim().normalize("NFC");
  if (
    normalized.length === 0 ||
    c0ControlPattern.test(normalized) ||
    !hasValidByteLength(normalized, maximum)
  ) {
    return fail(
      "INVALID_OBSERVATION_PROVENANCE",
      `ObservedOutcome ${field} is invalid.`,
      { field: `provenance.${field}` },
    );
  }
  return normalized;
};

const normalizeProvenance = (
  value: unknown,
  observedAt: string,
): ObservedOutcomeProvenance => {
  if (
    value === null ||
    value === undefined ||
    typeof value !== "object" ||
    Array.isArray(value)
  ) {
    return fail(
      "MISSING_OBSERVATION_PROVENANCE",
      "ObservedOutcome requires observation provenance.",
      { field: "provenance" },
    );
  }
  const candidate = value as Readonly<Record<string, unknown>>;
  if (
    typeof candidate.sourceType !== "string" ||
    !sourceTypes.includes(
      candidate.sourceType as ObservedOutcomeProvenance["sourceType"],
    )
  ) {
    return fail(
      "INVALID_OBSERVATION_PROVENANCE",
      "ObservedOutcome provenance sourceType is invalid.",
      { field: "provenance.sourceType" },
    );
  }
  const sourceId = normalizeProvenanceText(candidate.sourceId, "sourceId", 256);
  const collectionMethod = normalizeProvenanceText(
    candidate.collectionMethod,
    "collectionMethod",
    128,
  );
  if (
    typeof candidate.recorderType !== "string" ||
    !recorderTypes.includes(
      candidate.recorderType as ObservedOutcomeProvenance["recorderType"],
    )
  ) {
    return fail(
      "INVALID_OBSERVATION_PROVENANCE",
      "ObservedOutcome provenance recorderType is invalid.",
      { field: "provenance.recorderType" },
    );
  }
  const recorderId = normalizeProvenanceText(
    candidate.recorderId,
    "recorderId",
    256,
  );
  const recordedAt = parseTimestamp(
    candidate.recordedAt,
    "INVALID_RECORDING_TIMESTAMP",
    "provenance.recordedAt",
  );
  if (Date.parse(recordedAt) < Date.parse(observedAt)) {
    return fail(
      "RECORDING_PRECEDES_OBSERVATION",
      "ObservedOutcome recording timestamp cannot precede observation time.",
      { field: "provenance.recordedAt" },
    );
  }
  return Object.freeze({
    sourceType:
      candidate.sourceType as ObservedOutcomeProvenance["sourceType"],
    sourceId,
    collectionMethod,
    recorderType:
      candidate.recorderType as ObservedOutcomeProvenance["recorderType"],
    recorderId,
    recordedAt,
  });
};

const normalizeObservedOutcome = (
  input: ObservedOutcomeInput,
): NormalizedObservedOutcome => {
  if (input === null || typeof input !== "object" || Array.isArray(input)) {
    return fail(
      "INVALID_OBSERVED_OUTCOME_INPUT",
      "ObservedOutcome input must be a declarative record.",
      { field: "input" },
    );
  }
  const executionEvent = input.executionEvent;
  if (executionEvent === null || executionEvent === undefined) {
    return fail(
      "MISSING_EXECUTION_EVENT",
      "ObservedOutcome requires one ExecutionEvent.",
      { field: "executionEvent" },
    );
  }
  if (!(executionEvent instanceof ExecutionEvent)) {
    return fail(
      "INVALID_EXECUTION_EVENT",
      "ObservedOutcome requires a canonical ExecutionEvent.",
      { field: "executionEvent" },
    );
  }
  const projection = projectExecutionEvent(executionEvent);
  const subjectType = normalizeToken(
    input.subjectType,
    "MISSING_OBSERVATION_SUBJECT",
    "INVALID_OBSERVATION_SUBJECT_TYPE",
    "subjectType",
  );
  const subjectId = normalizeSubjectId(input.subjectId);
  const observationCode = normalizeToken(
    input.observationCode,
    "MISSING_OBSERVATION_CODE",
    "INVALID_OBSERVATION_CODE",
    "observationCode",
  );
  const value = normalizeValue(input.value);
  const unit = normalizeUnit(input.unit, value.kind);
  const measurementContext = normalizeMeasurementContext(
    input.measurementContext,
  );
  if (input.observedAt === null || input.observedAt === undefined) {
    return fail(
      "MISSING_OBSERVATION_TIMESTAMP",
      "ObservedOutcome requires an explicit observation timestamp.",
      { field: "observedAt" },
    );
  }
  const observedAt = parseTimestamp(
    input.observedAt,
    "INVALID_OBSERVATION_TIMESTAMP",
    "observedAt",
  );
  if (Date.parse(observedAt) < Date.parse(projection.executionOccurredAt)) {
    return fail(
      "OBSERVATION_PRECEDES_EXECUTION",
      "ObservedOutcome timestamp cannot precede ExecutionEvent occurrence.",
      { field: "observedAt" },
    );
  }
  const provenance = normalizeProvenance(input.provenance, observedAt);

  return Object.freeze({
    executionEventId: projection.executionEventId,
    runtimeAdmissionId: projection.runtimeAdmissionId,
    executionPlanId: projection.executionPlanId,
    organizationId: projection.organizationId,
    workPackageId: projection.workPackageId,
    recommendationIds: Object.freeze([...projection.recommendationIds]),
    traceIds: Object.freeze([...projection.traceIds]),
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
    executionEventSchemaVersion: projection.executionEventSchemaVersion,
    admissionProvenance: Object.freeze({ ...projection.admissionProvenance }),
    executionEventProvenance: Object.freeze({
      ...projection.executionEventProvenance,
    }),
    executionOccurredAt: projection.executionOccurredAt,
    subjectType,
    subjectId,
    observationCode,
    value,
    ...(unit === undefined ? {} : { unit }),
    ...(measurementContext === undefined ? {} : { measurementContext }),
    observedAt,
    provenance,
    version,
    schemaVersion,
  });
};

const serializeRules = (
  values: readonly ExecutionPlanRuleProvenance[],
): readonly SerializedRuleProvenance[] =>
  Object.freeze(
    values.map((record) =>
      Object.freeze({
        ruleId: record.ruleId,
        ruleVersion: record.ruleVersion,
      }),
    ),
  );

const serializeValue = (
  value: ObservedOutcomeValue,
): ObservedOutcomeValue => {
  switch (value.kind) {
    case "QUANTITATIVE":
      return Object.freeze({ kind: value.kind, value: value.value });
    case "CATEGORICAL":
      return Object.freeze({ kind: value.kind, value: value.value });
    case "BOOLEAN":
      return Object.freeze({ kind: value.kind, value: value.value });
    case "TEXT":
      return Object.freeze({ kind: value.kind, value: value.value });
  }
};

const serializeState = (
  id: ObservedOutcomeId,
  state: NormalizedObservedOutcome,
): SerializedObservedOutcome =>
  Object.freeze({
    observedOutcomeId: id.value,
    executionEventId: state.executionEventId.value,
    runtimeAdmissionId: state.runtimeAdmissionId.value,
    executionPlanId: state.executionPlanId.value,
    organizationId: state.organizationId.value,
    workPackageId: state.workPackageId.value,
    recommendationIds: Object.freeze(
      state.recommendationIds.map(({ value }) => value),
    ),
    traceIds: Object.freeze(state.traceIds.map(({ value }) => value)),
    planningRuleProvenance: serializeRules(state.planningRuleProvenance),
    planningPolicyProvenance: Object.freeze({
      planningPolicyId: state.planningPolicyProvenance.planningPolicyId,
      planningPolicyVersion:
        state.planningPolicyProvenance.planningPolicyVersion,
    }),
    executionPlanSchemaVersion: state.executionPlanSchemaVersion,
    runtimeAdmissionSchemaVersion: state.runtimeAdmissionSchemaVersion,
    executionEventSchemaVersion: state.executionEventSchemaVersion,
    admissionProvenance: Object.freeze({
      admissionPolicyId: state.admissionProvenance.admissionPolicyId,
      admissionPolicyVersion: state.admissionProvenance.admissionPolicyVersion,
      admissionSchemaVersion: state.admissionProvenance.admissionSchemaVersion,
    }),
    executionEventProvenance: Object.freeze({
      recorderType: state.executionEventProvenance.recorderType,
      recorderId: state.executionEventProvenance.recorderId,
    }),
    executionOccurredAt: state.executionOccurredAt,
    subjectType: state.subjectType,
    subjectId: state.subjectId.value,
    observationCode: state.observationCode,
    value: serializeValue(state.value),
    ...(state.unit === undefined ? {} : { unit: state.unit }),
    ...(state.measurementContext === undefined
      ? {}
      : { measurementContext: state.measurementContext }),
    observedAt: state.observedAt,
    provenance: Object.freeze({
      sourceType: state.provenance.sourceType,
      sourceId: state.provenance.sourceId,
      collectionMethod: state.provenance.collectionMethod,
      recorderType: state.provenance.recorderType,
      recorderId: state.provenance.recorderId,
      recordedAt: state.provenance.recordedAt,
    }),
    version: state.version,
    schemaVersion: state.schemaVersion,
  });

const stringifyCanonical = (value: unknown): string => {
  try {
    const serialized = JSON.stringify(value);
    if (serialized === undefined) {
      return fail(
        "OBSERVED_OUTCOME_SERIALIZATION_FAILED",
        "ObservedOutcome canonical serialization failed.",
        { operation: "canonical-json" },
      );
    }
    return serialized;
  } catch (error) {
    if (error instanceof ObservedOutcomeError) {
      throw error;
    }
    return fail(
      "OBSERVED_OUTCOME_SERIALIZATION_FAILED",
      "ObservedOutcome canonical serialization failed.",
      { operation: "canonical-json" },
    );
  }
};

const identityComponent = (value: string): string => {
  const normalized = value.normalize("NFC");
  return `${textEncoder.encode(normalized).byteLength}:${normalized}`;
};

const identityValue = (value: ObservedOutcomeValue): string => {
  switch (value.kind) {
    case "QUANTITATIVE":
    case "CATEGORICAL":
    case "TEXT":
      return value.value;
    case "BOOLEAN":
      return value.value ? "true" : "false";
  }
};

const optionalIdentityValue = (value: string | undefined): string =>
  value === undefined ? "0" : `1:${value}`;

const createObservedOutcomeId = async (
  state: NormalizedObservedOutcome,
): Promise<ObservedOutcomeId> => {
  const components = [
    state.schemaVersion,
    state.version,
    state.executionEventId.value,
    state.subjectType,
    state.subjectId.value,
    state.observationCode,
    state.value.kind,
    identityValue(state.value),
    optionalIdentityValue(state.unit),
    optionalIdentityValue(state.measurementContext),
    state.observedAt,
    state.provenance.sourceType,
    state.provenance.sourceId,
    state.provenance.collectionMethod,
    state.provenance.recorderType,
    state.provenance.recorderId,
    state.provenance.recordedAt,
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
      "OBSERVED_OUTCOME_IDENTITY_DERIVATION_FAILED",
      "ObservedOutcome identity derivation failed.",
      { operation: "SHA-256" },
    );
  }
  const hexadecimal = Array.from(
    new Uint8Array(digest),
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("");
  return new Identifier(`${identityPrefix}${hexadecimal}`);
};

export class ObservedOutcome extends Entity {
  readonly #state: NormalizedObservedOutcome;

  private constructor(
    observedOutcomeId: ObservedOutcomeId,
    state: NormalizedObservedOutcome,
  ) {
    super(observedOutcomeId);
    this.#state = state;
    Object.freeze(this);
  }

  static async create(input: ObservedOutcomeInput): Promise<ObservedOutcome> {
    const state = normalizeObservedOutcome(input);
    const observedOutcomeId = await createObservedOutcomeId(state);
    return new ObservedOutcome(observedOutcomeId, state);
  }

  get observedOutcomeId(): ObservedOutcomeId {
    return this.id;
  }

  get executionEventId(): Identifier {
    return this.#state.executionEventId;
  }

  get runtimeAdmissionId(): Identifier {
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

  get executionEventSchemaVersion(): "execution-event:v1" {
    return this.#state.executionEventSchemaVersion;
  }

  get admissionProvenance(): RuntimeAdmissionProvenance {
    return this.#state.admissionProvenance;
  }

  get executionEventProvenance(): ExecutionEventProvenance {
    return this.#state.executionEventProvenance;
  }

  get executionOccurredAt(): string {
    return this.#state.executionOccurredAt;
  }

  get subjectType(): string {
    return this.#state.subjectType;
  }

  get subjectId(): Identifier {
    return this.#state.subjectId;
  }

  get observationCode(): string {
    return this.#state.observationCode;
  }

  get value(): ObservedOutcomeValue {
    return this.#state.value;
  }

  get unit(): string | undefined {
    return this.#state.unit;
  }

  get measurementContext(): string | undefined {
    return this.#state.measurementContext;
  }

  get observedAt(): string {
    return this.#state.observedAt;
  }

  get provenance(): ObservedOutcomeProvenance {
    return this.#state.provenance;
  }

  get version(): "1.0.0" {
    return this.#state.version;
  }

  get schemaVersion(): "observed-outcome:v1" {
    return this.#state.schemaVersion;
  }

  toJSON(): SerializedObservedOutcome {
    return serializeState(this.observedOutcomeId, this.#state);
  }

  serialize(): string {
    return stringifyCanonical(this.toJSON());
  }
}
