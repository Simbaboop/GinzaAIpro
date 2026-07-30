import { Entity, Identifier, Percentage } from "../common/index.js";
import { ObservedOutcome } from "../execution/ObservedOutcome.js";
import { Evidence } from "../intelligence/Evidence.js";

export type VerificationId = Identifier;

export type VerificationJudgment =
  | "confirmed"
  | "refuted"
  | "inconclusive";

type UncalibratedVerificationConfidence = Readonly<{
  calibrationStatus: "uncalibrated";
  value: Percentage;
  basis: string;
}>;

type CalibratedVerificationConfidence = Readonly<{
  calibrationStatus: "calibrated";
  value: Percentage;
  basis: string;
  calibrationRecordId: Identifier;
}>;

export type VerificationConfidence =
  | UncalibratedVerificationConfidence
  | CalibratedVerificationConfidence;

export type VerificationCreateInput = Readonly<{
  observedOutcome: ObservedOutcome;
  evidence: readonly Evidence[];
  method: string;
  judgment: VerificationJudgment;
  verifiedAt: string;
  limitations: readonly string[];
  verifierId?: Identifier;
  notes?: string;
  confidence?: VerificationConfidence;
}>;

type SerializedUncalibratedVerificationConfidence = Readonly<{
  calibrationStatus: "uncalibrated";
  valueBasisPoints: number;
  basis: string;
}>;

type SerializedCalibratedVerificationConfidence = Readonly<{
  calibrationStatus: "calibrated";
  valueBasisPoints: number;
  basis: string;
  calibrationRecordId: string;
}>;

export type SerializedVerificationConfidence =
  | SerializedUncalibratedVerificationConfidence
  | SerializedCalibratedVerificationConfidence;

export type SerializedVerification = Readonly<{
  verificationId: string;
  organizationId: string;
  observedOutcomeId: string;
  subjectType: "observed_outcome";
  evidenceIds: readonly string[];
  method: string;
  judgment: VerificationJudgment;
  verifiedAt: string;
  verifierId?: string;
  limitations: readonly string[];
  notes?: string;
  confidence?: SerializedVerificationConfidence;
  version: "1.0.0";
  schemaVersion: "verification:v1";
}>;

export type VerificationFailureCode =
  | "INVALID_VERIFICATION_INPUT"
  | "MISSING_OBSERVED_OUTCOME"
  | "INVALID_OBSERVED_OUTCOME"
  | "INVALID_OBSERVED_OUTCOME_PROJECTION"
  | "MISSING_VERIFICATION_EVIDENCE"
  | "INVALID_VERIFICATION_EVIDENCE_COLLECTION"
  | "INVALID_VERIFICATION_EVIDENCE"
  | "EVIDENCE_ORGANIZATION_MISMATCH"
  | "DUPLICATE_VERIFICATION_EVIDENCE"
  | "MISSING_VERIFICATION_METHOD"
  | "INVALID_VERIFICATION_METHOD"
  | "MISSING_VERIFICATION_JUDGMENT"
  | "INVALID_VERIFICATION_JUDGMENT"
  | "MISSING_VERIFICATION_TIMESTAMP"
  | "INVALID_VERIFICATION_TIMESTAMP"
  | "VERIFICATION_PRECEDES_OBSERVATION"
  | "VERIFICATION_PRECEDES_EVIDENCE"
  | "MISSING_VERIFICATION_LIMITATIONS"
  | "INVALID_VERIFICATION_LIMITATIONS"
  | "INVALID_VERIFICATION_LIMITATION"
  | "DUPLICATE_VERIFICATION_LIMITATION"
  | "INVALID_VERIFIER_ID"
  | "INVALID_VERIFICATION_NOTES"
  | "INVALID_VERIFICATION_CONFIDENCE"
  | "INVALID_CONFIDENCE_CALIBRATION_STATUS"
  | "INVALID_CONFIDENCE_VALUE"
  | "MISSING_CONFIDENCE_BASIS"
  | "INVALID_CONFIDENCE_BASIS"
  | "MISSING_CALIBRATION_RECORD_ID"
  | "UNEXPECTED_CALIBRATION_RECORD_ID"
  | "INVALID_CALIBRATION_RECORD_ID"
  | "VERIFICATION_IDENTITY_DERIVATION_FAILED"
  | "VERIFICATION_SERIALIZATION_FAILED";

export type VerificationErrorDetails = Readonly<{
  field?: string;
  index?: string;
  operation?: string;
}>;

const compareText = (left: string, right: string): number =>
  left < right ? -1 : left > right ? 1 : 0;

export class VerificationError extends Error {
  readonly #code: VerificationFailureCode;
  readonly #details: VerificationErrorDetails;

  constructor(
    code: VerificationFailureCode,
    message: string,
    details: VerificationErrorDetails = {},
  ) {
    super(message);
    this.name = "VerificationError";
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

  get code(): VerificationFailureCode {
    return this.#code;
  }

  get details(): VerificationErrorDetails {
    return this.#details;
  }
}

const version = "1.0.0" as const;
const schemaVersion = "verification:v1" as const;
const subjectType = "observed_outcome" as const;
const identityPrefix = "verification:v1:";
const textEncoder = new TextEncoder();

const offsetDateTimePattern =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,3}))?(Z|[+-]\d{2}:\d{2})$/u;

const disallowedTextControlPattern =
  /[\u0000-\u0008\u000b\u000c\u000e-\u001f]/u;

const judgments: readonly VerificationJudgment[] = Object.freeze([
  "confirmed",
  "refuted",
  "inconclusive",
]);

const fail = (
  code: VerificationFailureCode,
  message: string,
  details: VerificationErrorDetails = {},
): never => {
  throw new VerificationError(code, message, details);
};

const compareUtf8 = (left: string, right: string): number => {
  const leftBytes = textEncoder.encode(left.normalize("NFC"));
  const rightBytes = textEncoder.encode(right.normalize("NFC"));
  const length = Math.min(leftBytes.length, rightBytes.length);

  for (let index = 0; index < length; index += 1) {
    const difference = leftBytes[index]! - rightBytes[index]!;
    if (difference !== 0) {
      return difference;
    }
  }

  return leftBytes.length - rightBytes.length;
};

const hasValidByteLength = (value: string, maximum: number): boolean =>
  textEncoder.encode(value).byteLength <= maximum;

const normalizeLineEndings = (value: string): string =>
  value.replace(/\r\n?/gu, "\n");

const normalizeBoundedText = (
  value: unknown,
  code: VerificationFailureCode,
  field: string,
  maximumBytes: number,
): string => {
  if (typeof value !== "string") {
    return fail(code, `Verification ${field} must be text.`, { field });
  }

  const normalized = normalizeLineEndings(value).trim().normalize("NFC");

  if (
    normalized.length === 0 ||
    disallowedTextControlPattern.test(normalized) ||
    !hasValidByteLength(normalized, maximumBytes)
  ) {
    return fail(code, `Verification ${field} is invalid.`, { field });
  }

  return normalized;
};

const identifierValue = (
  value: unknown,
  code: VerificationFailureCode,
  field: string,
): string => {
  if (!(value instanceof Identifier)) {
    return fail(code, `Verification ${field} must be a canonical Identifier.`, {
      field,
    });
  }

  let raw: unknown;

  try {
    raw = value.value;
  } catch {
    return fail(code, `Verification ${field} must be a canonical Identifier.`, {
      field,
    });
  }

  if (
    typeof raw !== "string" ||
    raw.length === 0 ||
    raw !== raw.trim() ||
    raw !== raw.normalize("NFC")
  ) {
    return fail(code, `Verification ${field} must be a canonical Identifier.`, {
      field,
    });
  }

  return raw;
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
  code: VerificationFailureCode,
  field: string,
): string => {
  if (typeof value !== "string") {
    return fail(code, `Verification ${field} is not a valid date-time.`, {
      field,
    });
  }

  const match = offsetDateTimePattern.exec(value);

  if (match === null) {
    return fail(code, `Verification ${field} is not a valid date-time.`, {
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
    return fail(code, `Verification ${field} is not a valid date-time.`, {
      field,
    });
  }

  if (timezone !== "Z") {
    const offsetHour = Number(timezone.slice(1, 3));
    const offsetMinute = Number(timezone.slice(4, 6));

    if (offsetHour > 23 || offsetMinute > 59) {
      return fail(code, `Verification ${field} is not a valid date-time.`, {
        field,
      });
    }
  }

  const instant = Date.parse(value);

  if (!Number.isFinite(instant)) {
    return fail(code, `Verification ${field} is not a valid date-time.`, {
      field,
    });
  }

  return new Date(instant).toISOString();
};

const isVerificationJudgment = (
  value: unknown,
): value is VerificationJudgment =>
  typeof value === "string" &&
  judgments.includes(value as VerificationJudgment);
type ObservedOutcomeProjection = Readonly<{
  observedOutcomeId: Identifier;
  organizationId: Identifier;
  observedAt: string;
}>;

type EvidenceProjection = Readonly<{
  evidenceId: Identifier;
  organizationId: Identifier;
  createdAt: string;
  originalIndex: number;
}>;

const projectionTimestamp = (
  value: unknown,
  code: VerificationFailureCode,
  field: string,
  details: VerificationErrorDetails,
): string => {
  if (
    typeof value !== "string" ||
    value.length !== 24 ||
    !value.endsWith("Z")
  ) {
    return fail(code, `Verification ${field} projection is invalid.`, details);
  }

  const instant = Date.parse(value);

  if (
    !Number.isFinite(instant) ||
    new Date(instant).toISOString() !== value
  ) {
    return fail(code, `Verification ${field} projection is invalid.`, details);
  }

  return value;
};

const projectObservedOutcome = (
  observedOutcome: ObservedOutcome,
): ObservedOutcomeProjection => {
  const details = Object.freeze({ field: "observedOutcome" });

  try {
    const observedOutcomeId = observedOutcome.observedOutcomeId;
    const organizationId = observedOutcome.organizationId;

    identifierValue(
      observedOutcomeId,
      "INVALID_OBSERVED_OUTCOME_PROJECTION",
      "observedOutcome",
    );

    identifierValue(
      organizationId,
      "INVALID_OBSERVED_OUTCOME_PROJECTION",
      "observedOutcome",
    );

    if (
      !observedOutcomeId.equals(observedOutcome.id) ||
      observedOutcome.version !== "1.0.0" ||
      observedOutcome.schemaVersion !== "observed-outcome:v1"
    ) {
      return fail(
        "INVALID_OBSERVED_OUTCOME_PROJECTION",
        "ObservedOutcome does not expose canonical verification lineage.",
        details,
      );
    }

    const observedAt = projectionTimestamp(
      observedOutcome.observedAt,
      "INVALID_OBSERVED_OUTCOME_PROJECTION",
      "observedOutcome",
      details,
    );

    return Object.freeze({
      observedOutcomeId,
      organizationId,
      observedAt,
    });
  } catch (error) {
    if (
      error instanceof VerificationError &&
      error.code === "INVALID_OBSERVED_OUTCOME_PROJECTION"
    ) {
      throw error;
    }

    return fail(
      "INVALID_OBSERVED_OUTCOME_PROJECTION",
      "ObservedOutcome does not expose canonical verification lineage.",
      details,
    );
  }
};

const projectEvidence = (
  evidence: Evidence,
  originalIndex: number,
): EvidenceProjection => {
  const details = Object.freeze({
    field: "evidence",
    index: String(originalIndex),
  });

  try {
    const evidenceId = evidence.id;
    const organizationId = evidence.organizationId;

    identifierValue(
      evidenceId,
      "INVALID_VERIFICATION_EVIDENCE",
      "evidence",
    );

    identifierValue(
      organizationId,
      "INVALID_VERIFICATION_EVIDENCE",
      "evidence",
    );

    const createdAt = projectionTimestamp(
      evidence.createdAt,
      "INVALID_VERIFICATION_EVIDENCE",
      "evidence",
      details,
    );

    return Object.freeze({
      evidenceId,
      organizationId,
      createdAt,
      originalIndex,
    });
  } catch (error) {
    if (
      error instanceof VerificationError &&
      error.code === "INVALID_VERIFICATION_EVIDENCE"
    ) {
      return fail(
        error.code,
        error.message,
        details,
      );
    }

    return fail(
      "INVALID_VERIFICATION_EVIDENCE",
      "Evidence does not expose a valid canonical projection.",
      details,
    );
  }
};
type NormalizedVerificationLineage = Readonly<{
  observedOutcome: ObservedOutcomeProjection;
  evidence: readonly EvidenceProjection[];
}>;

const normalizeVerificationLineage = (
  input: VerificationCreateInput,
): NormalizedVerificationLineage => {
  if (
    input === null ||
    typeof input !== "object" ||
    Array.isArray(input)
  ) {
    return fail(
      "INVALID_VERIFICATION_INPUT",
      "Verification input must be a declarative record.",
      { field: "input" },
    );
  }

  const candidate =
    input as unknown as Readonly<Record<string, unknown>>;

  const observedOutcomeValue = candidate.observedOutcome;

  if (observedOutcomeValue === undefined) {
    return fail(
      "MISSING_OBSERVED_OUTCOME",
      "Verification requires one ObservedOutcome.",
      { field: "observedOutcome" },
    );
  }

  if (!(observedOutcomeValue instanceof ObservedOutcome)) {
    return fail(
      "INVALID_OBSERVED_OUTCOME",
      "Verification requires a canonical ObservedOutcome.",
      { field: "observedOutcome" },
    );
  }

  const observedOutcome = projectObservedOutcome(observedOutcomeValue);
  const evidenceValue = candidate.evidence;

  if (evidenceValue === undefined) {
    return fail(
      "MISSING_VERIFICATION_EVIDENCE",
      "Verification requires an Evidence collection.",
      { field: "evidence" },
    );
  }

  if (
    !Array.isArray(evidenceValue) ||
    evidenceValue.length === 0 ||
    evidenceValue.length > 128
  ) {
    return fail(
      "INVALID_VERIFICATION_EVIDENCE_COLLECTION",
      "Verification Evidence must contain from 1 through 128 records.",
      { field: "evidence" },
    );
  }

  const projectedEvidence: EvidenceProjection[] = [];

  for (let index = 0; index < evidenceValue.length; index += 1) {
    const evidence = evidenceValue[index];

    if (!(evidence instanceof Evidence)) {
      return fail(
        "INVALID_VERIFICATION_EVIDENCE",
        "Verification Evidence item is not canonical.",
        {
          field: "evidence",
          index: String(index),
        },
      );
    }

    projectedEvidence.push(projectEvidence(evidence, index));
  }

  for (const projection of projectedEvidence) {
    if (
      !projection.organizationId.equals(
        observedOutcome.organizationId,
      )
    ) {
      return fail(
        "EVIDENCE_ORGANIZATION_MISMATCH",
        "Verification Evidence belongs to a different Organization.",
        {
          field: "evidence",
          index: String(projection.originalIndex),
        },
      );
    }
  }

  const seenEvidenceIds = new Set<string>();

  for (const projection of projectedEvidence) {
    const evidenceId = projection.evidenceId.value;

    if (seenEvidenceIds.has(evidenceId)) {
      return fail(
        "DUPLICATE_VERIFICATION_EVIDENCE",
        "Verification Evidence identity cannot be duplicated.",
        {
          field: "evidence",
          index: String(projection.originalIndex),
        },
      );
    }

    seenEvidenceIds.add(evidenceId);
  }

  const canonicalEvidence = [...projectedEvidence].sort(
    (left, right) =>
      compareUtf8(left.evidenceId.value, right.evidenceId.value),
  );

  return Object.freeze({
    observedOutcome,
    evidence: Object.freeze(canonicalEvidence),
  });
};
type NormalizedVerificationFields = Readonly<{
  method: string;
  judgment: VerificationJudgment;
  verifiedAt: string;
  limitations: readonly string[];
  verifierId?: Identifier;
  notes?: string;
}>;

const normalizeVerificationFields = (
  input: VerificationCreateInput,
  lineage: NormalizedVerificationLineage,
): NormalizedVerificationFields => {
  const candidate =
    input as unknown as Readonly<Record<string, unknown>>;

  if (candidate.method === undefined) {
    return fail(
      "MISSING_VERIFICATION_METHOD",
      "Verification requires a governed method.",
      { field: "method" },
    );
  }

  const method = normalizeBoundedText(
    candidate.method,
    "INVALID_VERIFICATION_METHOD",
    "method",
    128,
  );

  if (candidate.judgment === undefined) {
    return fail(
      "MISSING_VERIFICATION_JUDGMENT",
      "Verification requires a judgment.",
      { field: "judgment" },
    );
  }

  if (!isVerificationJudgment(candidate.judgment)) {
    return fail(
      "INVALID_VERIFICATION_JUDGMENT",
      "Verification judgment is not supported.",
      { field: "judgment" },
    );
  }

  const judgment = candidate.judgment;

  if (candidate.verifiedAt === undefined) {
    return fail(
      "MISSING_VERIFICATION_TIMESTAMP",
      "Verification requires an explicit timestamp.",
      { field: "verifiedAt" },
    );
  }

  const verifiedAt = parseTimestamp(
    candidate.verifiedAt,
    "INVALID_VERIFICATION_TIMESTAMP",
    "verifiedAt",
  );

  if (
    Date.parse(verifiedAt) <
    Date.parse(lineage.observedOutcome.observedAt)
  ) {
    return fail(
      "VERIFICATION_PRECEDES_OBSERVATION",
      "Verification time cannot precede the observation time.",
      { field: "verifiedAt" },
    );
  }

  const evidenceInCallerOrder = [...lineage.evidence].sort(
    (left, right) => left.originalIndex - right.originalIndex,
  );

  for (const evidence of evidenceInCallerOrder) {
    if (Date.parse(verifiedAt) < Date.parse(evidence.createdAt)) {
      return fail(
        "VERIFICATION_PRECEDES_EVIDENCE",
        "Verification time cannot precede Evidence creation time.",
        {
          field: "verifiedAt",
          index: String(evidence.originalIndex),
        },
      );
    }
  }

  if (candidate.limitations === undefined) {
    return fail(
      "MISSING_VERIFICATION_LIMITATIONS",
      "Verification requires an explicit limitations collection.",
      { field: "limitations" },
    );
  }

  if (
    !Array.isArray(candidate.limitations) ||
    candidate.limitations.length > 64
  ) {
    return fail(
      "INVALID_VERIFICATION_LIMITATIONS",
      "Verification limitations must be an array of at most 64 entries.",
      { field: "limitations" },
    );
  }

  const normalizedLimitations: string[] = [];

  for (
    let index = 0;
    index < candidate.limitations.length;
    index += 1
  ) {
    const value = candidate.limitations[index];

    if (typeof value !== "string") {
      return fail(
        "INVALID_VERIFICATION_LIMITATION",
        "Verification limitation must be text.",
        {
          field: "limitations",
          index: String(index),
        },
      );
    }

    const normalized = normalizeLineEndings(value)
      .trim()
      .normalize("NFC");

    if (
      normalized.length === 0 ||
      disallowedTextControlPattern.test(normalized) ||
      !hasValidByteLength(normalized, 1_024)
    ) {
      return fail(
        "INVALID_VERIFICATION_LIMITATION",
        "Verification limitation is invalid.",
        {
          field: "limitations",
          index: String(index),
        },
      );
    }

    normalizedLimitations.push(normalized);
  }

  const seenLimitations = new Set<string>();

  for (
    let index = 0;
    index < normalizedLimitations.length;
    index += 1
  ) {
    const limitation = normalizedLimitations[index]!;

    if (seenLimitations.has(limitation)) {
      return fail(
        "DUPLICATE_VERIFICATION_LIMITATION",
        "Verification limitation cannot be duplicated.",
        {
          field: "limitations",
          index: String(index),
        },
      );
    }

    seenLimitations.add(limitation);
  }

  const limitations = Object.freeze(
    [...normalizedLimitations].sort(compareUtf8),
  );

  let verifierId: Identifier | undefined;

  if (candidate.verifierId !== undefined) {
    identifierValue(
      candidate.verifierId,
      "INVALID_VERIFIER_ID",
      "verifierId",
    );

    verifierId = candidate.verifierId as Identifier;
  }

  let notes: string | undefined;

  if (candidate.notes !== undefined) {
    notes = normalizeBoundedText(
      candidate.notes,
      "INVALID_VERIFICATION_NOTES",
      "notes",
      4_096,
    );
  }

  return Object.freeze({
    method,
    judgment,
    verifiedAt,
    limitations,
    ...(verifierId === undefined ? {} : { verifierId }),
    ...(notes === undefined ? {} : { notes }),
  });
};
const normalizeVerificationConfidence = (
  input: VerificationCreateInput,
): VerificationConfidence | undefined => {
  const candidate =
    input as unknown as Readonly<Record<string, unknown>>;

  if (candidate.confidence === undefined) {
    return undefined;
  }

  const confidence = candidate.confidence;

  if (
    confidence === null ||
    typeof confidence !== "object" ||
    Array.isArray(confidence)
  ) {
    return fail(
      "INVALID_VERIFICATION_CONFIDENCE",
      "Verification confidence must be a declarative record.",
      { field: "confidence" },
    );
  }

  const record = confidence as Readonly<Record<string, unknown>>;
  const permittedFields = new Set([
    "calibrationStatus",
    "value",
    "basis",
    "calibrationRecordId",
  ]);

  if (
    Object.keys(record).some((field) => !permittedFields.has(field))
  ) {
    return fail(
      "INVALID_VERIFICATION_CONFIDENCE",
      "Verification confidence contains unsupported fields.",
      { field: "confidence" },
    );
  }

  if (
    record.calibrationStatus !== "uncalibrated" &&
    record.calibrationStatus !== "calibrated"
  ) {
    return fail(
      "INVALID_CONFIDENCE_CALIBRATION_STATUS",
      "Verification confidence calibration status is invalid.",
      { field: "confidence.calibrationStatus" },
    );
  }

  if (!(record.value instanceof Percentage)) {
    return fail(
      "INVALID_CONFIDENCE_VALUE",
      "Verification confidence value must be a canonical Percentage.",
      { field: "confidence.value" },
    );
  }

  if (record.basis === undefined) {
    return fail(
      "MISSING_CONFIDENCE_BASIS",
      "Verification confidence requires an explicit basis.",
      { field: "confidence.basis" },
    );
  }

  const basis = normalizeBoundedText(
    record.basis,
    "INVALID_CONFIDENCE_BASIS",
    "confidence.basis",
    1_024,
  );

  if (record.calibrationStatus === "uncalibrated") {
    if (record.calibrationRecordId !== undefined) {
      return fail(
        "UNEXPECTED_CALIBRATION_RECORD_ID",
        "Uncalibrated confidence cannot include calibration authority.",
        { field: "confidence.calibrationRecordId" },
      );
    }

    return Object.freeze({
      calibrationStatus: "uncalibrated",
      value: record.value,
      basis,
    });
  }

  if (record.calibrationRecordId === undefined) {
    return fail(
      "MISSING_CALIBRATION_RECORD_ID",
      "Calibrated confidence requires calibration authority.",
      { field: "confidence.calibrationRecordId" },
    );
  }

  identifierValue(
    record.calibrationRecordId,
    "INVALID_CALIBRATION_RECORD_ID",
    "confidence.calibrationRecordId",
  );

  return Object.freeze({
    calibrationStatus: "calibrated",
    value: record.value,
    basis,
    calibrationRecordId: record.calibrationRecordId as Identifier,
  });
};
type NormalizedVerificationState = Readonly<{
  organizationId: Identifier;
  observedOutcomeId: Identifier;
  subjectType: "observed_outcome";
  evidenceIds: readonly Identifier[];
  method: string;
  judgment: VerificationJudgment;
  verifiedAt: string;
  verifierId?: Identifier;
  limitations: readonly string[];
  notes?: string;
  confidence?: VerificationConfidence;
  version: "1.0.0";
  schemaVersion: "verification:v1";
}>;

const normalizeVerificationState = (
  input: VerificationCreateInput,
): NormalizedVerificationState => {
  const lineage = normalizeVerificationLineage(input);
  const fields = normalizeVerificationFields(input, lineage);
  const confidence = normalizeVerificationConfidence(input);

  return Object.freeze({
    organizationId: lineage.observedOutcome.organizationId,
    observedOutcomeId: lineage.observedOutcome.observedOutcomeId,
    subjectType,
    evidenceIds: Object.freeze(
      lineage.evidence.map(({ evidenceId }) => evidenceId),
    ),
    method: fields.method,
    judgment: fields.judgment,
    verifiedAt: fields.verifiedAt,
    ...(fields.verifierId === undefined
      ? {}
      : { verifierId: fields.verifierId }),
    limitations: Object.freeze([...fields.limitations]),
    ...(fields.notes === undefined ? {} : { notes: fields.notes }),
    ...(confidence === undefined ? {} : { confidence }),
    version,
    schemaVersion,
  });
};

const identityComponent = (value: string): string => {
  const normalized = value.normalize("NFC");
  return `${textEncoder.encode(normalized).byteLength}:${normalized}`;
};

const optionalIdentityValue = (
  value: string | undefined,
): string =>
  value === undefined ? "0" : `1:${value}`;

const createVerificationId = async (
  state: NormalizedVerificationState,
): Promise<VerificationId> => {
  const components: string[] = [
    state.schemaVersion,
    state.version,
    state.organizationId.value,
    state.observedOutcomeId.value,
    state.subjectType,
    String(state.evidenceIds.length),
    ...state.evidenceIds.map(({ value }) => value),
    state.method,
    state.judgment,
    state.verifiedAt,
    optionalIdentityValue(state.verifierId?.value),
    String(state.limitations.length),
    ...state.limitations,
    optionalIdentityValue(state.notes),
  ];

  if (state.confidence === undefined) {
    components.push("0");
  } else {
    components.push(
      "1",
      state.confidence.calibrationStatus,
      String(state.confidence.value.basisPoints),
      state.confidence.basis,
      optionalIdentityValue(
        state.confidence.calibrationStatus === "calibrated"
          ? state.confidence.calibrationRecordId.value
          : undefined,
      ),
    );
  }

  const material = components.map(identityComponent).join("");

  try {
    const digest = await globalThis.crypto.subtle.digest(
      "SHA-256",
      textEncoder.encode(material),
    );

    if (digest.byteLength !== 32) {
      return fail(
        "VERIFICATION_IDENTITY_DERIVATION_FAILED",
        "Verification identity derivation produced an invalid digest.",
        { operation: "SHA-256" },
      );
    }

    const hexadecimal = Array.from(
      new Uint8Array(digest),
      (byte) => byte.toString(16).padStart(2, "0"),
    ).join("");

    return new Identifier(`${identityPrefix}${hexadecimal}`);
  } catch (error) {
    if (
      error instanceof VerificationError &&
      error.code === "VERIFICATION_IDENTITY_DERIVATION_FAILED"
    ) {
      throw error;
    }

    return fail(
      "VERIFICATION_IDENTITY_DERIVATION_FAILED",
      "Verification identity derivation failed.",
      { operation: "SHA-256" },
    );
  }
};
const serializeConfidence = (
  confidence: VerificationConfidence,
): SerializedVerificationConfidence => {
  if (confidence.calibrationStatus === "uncalibrated") {
    return Object.freeze({
      calibrationStatus: "uncalibrated",
      valueBasisPoints: confidence.value.basisPoints,
      basis: confidence.basis,
    });
  }

  return Object.freeze({
    calibrationStatus: "calibrated",
    valueBasisPoints: confidence.value.basisPoints,
    basis: confidence.basis,
    calibrationRecordId: confidence.calibrationRecordId.value,
  });
};

const serializeVerificationState = (
  verificationId: VerificationId,
  state: NormalizedVerificationState,
): SerializedVerification =>
  Object.freeze({
    verificationId: verificationId.value,
    organizationId: state.organizationId.value,
    observedOutcomeId: state.observedOutcomeId.value,
    subjectType: state.subjectType,
    evidenceIds: Object.freeze(
      state.evidenceIds.map(({ value }) => value),
    ),
    method: state.method,
    judgment: state.judgment,
    verifiedAt: state.verifiedAt,
    ...(state.verifierId === undefined
      ? {}
      : { verifierId: state.verifierId.value }),
    limitations: Object.freeze([...state.limitations]),
    ...(state.notes === undefined ? {} : { notes: state.notes }),
    ...(state.confidence === undefined
      ? {}
      : { confidence: serializeConfidence(state.confidence) }),
    version: state.version,
    schemaVersion: state.schemaVersion,
  });

const stringifyCanonical = (value: SerializedVerification): string => {
  try {
    const serialized = JSON.stringify(value);

    if (serialized === undefined) {
      return fail(
        "VERIFICATION_SERIALIZATION_FAILED",
        "Verification canonical serialization failed.",
        { operation: "canonical-json" },
      );
    }

    return serialized;
  } catch (error) {
    if (
      error instanceof VerificationError &&
      error.code === "VERIFICATION_SERIALIZATION_FAILED"
    ) {
      throw error;
    }

    return fail(
      "VERIFICATION_SERIALIZATION_FAILED",
      "Verification canonical serialization failed.",
      { operation: "canonical-json" },
    );
  }
};
/**
 * Canonical immutable evidentiary judgment for one ObservedOutcome.
 */
export class Verification extends Entity {
  readonly #state: NormalizedVerificationState;

  private constructor(
    verificationId: VerificationId,
    state: NormalizedVerificationState,
  ) {
    super(verificationId);
    this.#state = state;
    Object.freeze(this);
  }

  static async create(
    input: VerificationCreateInput,
  ): Promise<Verification> {
    const state = normalizeVerificationState(input);
    const verificationId = await createVerificationId(state);

    // Validate canonical serialization before exposing the completed entity.
    stringifyCanonical(
      serializeVerificationState(verificationId, state),
    );

    return new Verification(verificationId, state);
  }

  get verificationId(): VerificationId {
    return this.id;
  }

  get organizationId(): Identifier {
    return this.#state.organizationId;
  }

  get observedOutcomeId(): Identifier {
    return this.#state.observedOutcomeId;
  }

  get subjectType(): "observed_outcome" {
    return this.#state.subjectType;
  }

  get evidenceIds(): readonly Identifier[] {
    return this.#state.evidenceIds;
  }

  get method(): string {
    return this.#state.method;
  }

  get judgment(): VerificationJudgment {
    return this.#state.judgment;
  }

  get verifiedAt(): string {
    return this.#state.verifiedAt;
  }

  get verifierId(): Identifier | undefined {
    return this.#state.verifierId;
  }

  get limitations(): readonly string[] {
    return this.#state.limitations;
  }

  get notes(): string | undefined {
    return this.#state.notes;
  }

  get confidence(): VerificationConfidence | undefined {
    return this.#state.confidence;
  }

  get version(): "1.0.0" {
    return this.#state.version;
  }

  get schemaVersion(): "verification:v1" {
    return this.#state.schemaVersion;
  }

  toJSON(): SerializedVerification {
    return serializeVerificationState(
      this.verificationId,
      this.#state,
    );
  }

  serialize(): string {
    return stringifyCanonical(this.toJSON());
  }
}