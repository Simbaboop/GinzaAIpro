import type { CaptureInput } from "@ginzaaipro/core";
import {
  Identifier,
  Money,
  Percentage,
  type BusinessSignalCategory,
  type BusinessSignalValue,
} from "@ginzaaipro/domain";
import { defaultCaptureConfidence } from "../defaults.js";
import {
  CaptureDiagnosticCodes,
  type CaptureDiagnosticCode,
} from "../diagnostics/index.js";

const categories: readonly BusinessSignalCategory[] = [
  "operational",
  "financial",
  "human",
  "system",
  "external",
];

const rfc3339Pattern =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d+))?(Z|([+-])(\d{2}):(\d{2}))$/;

export interface NormalizedCaptureInput {
  readonly organizationId: Identifier;
  readonly category: BusinessSignalCategory;
  readonly source: string;
  readonly sourceReference: string;
  readonly occurredAt: string;
  readonly occurredAtMs: number;
  readonly value: BusinessSignalValue;
  readonly deterministicIdentityMaterial: string;
  readonly subjectId: Identifier | undefined;
  readonly confidence: Percentage;
  readonly confidenceDefaulted: boolean;
}

export type CaptureInputNormalizationResult =
  | {
      readonly success: true;
      readonly value: NormalizedCaptureInput;
    }
  | {
      readonly success: false;
      readonly code: CaptureDiagnosticCode;
    };

const normalizeText = (value: string): string =>
  value.trim().normalize("NFC");

const isCategory = (value: unknown): value is BusinessSignalCategory =>
  categories.includes(value as BusinessSignalCategory);

const daysInMonth = (year: number, month: number): number => {
  switch (month) {
    case 2:
      return year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)
        ? 29
        : 28;
    case 4:
    case 6:
    case 9:
    case 11:
      return 30;
    default:
      return 31;
  }
};

const normalizeOccurrence = (
  value: unknown,
): { readonly iso: string; readonly timeMs: number } | undefined => {
  if (typeof value !== "string") {
    return undefined;
  }

  const match = rfc3339Pattern.exec(value);
  if (match === null) {
    return undefined;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const hour = Number(match[4]);
  const minute = Number(match[5]);
  const second = Number(match[6]);
  const offsetHour = match[8] === "Z" ? 0 : Number(match[10]);
  const offsetMinute = match[8] === "Z" ? 0 : Number(match[11]);

  if (
    month < 1 ||
    month > 12 ||
    day < 1 ||
    day > daysInMonth(year, month) ||
    hour > 23 ||
    minute > 59 ||
    second > 59 ||
    offsetHour > 23 ||
    offsetMinute > 59
  ) {
    return undefined;
  }

  const timeMs = Date.parse(value);
  if (!Number.isFinite(timeMs)) {
    return undefined;
  }

  return {
    iso: new Date(timeMs).toISOString(),
    timeMs,
  };
};

const normalizeValue = (
  value: unknown,
): BusinessSignalValue | undefined => {
  if (typeof value === "string") {
    const normalized = normalizeText(value);
    return normalized.length > 0 ? normalized : undefined;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return undefined;
    }
    return Object.is(value, -0) ? 0 : value;
  }
  if (typeof value === "bigint" || typeof value === "boolean") {
    return value;
  }
  if (value instanceof Money || value instanceof Percentage) {
    return value;
  }
  return undefined;
};

export const normalizeCaptureInput = (
  input: CaptureInput,
  contextOrganizationId: Identifier,
  executionTimeMs: number,
): CaptureInputNormalizationResult => {
  if (
    !(input.organizationId instanceof Identifier) ||
    !input.organizationId.equals(contextOrganizationId)
  ) {
    return {
      success: false,
      code: CaptureDiagnosticCodes.OrganizationMismatch,
    };
  }

  if (!isCategory(input.category)) {
    return {
      success: false,
      code: CaptureDiagnosticCodes.CategoryInvalid,
    };
  }

  const source =
    typeof input.source === "string" ? normalizeText(input.source) : "";
  if (source.length === 0) {
    return {
      success: false,
      code: CaptureDiagnosticCodes.SourceEmpty,
    };
  }

  const sourceReference =
    typeof input.sourceReference === "string"
      ? normalizeText(input.sourceReference)
      : "";
  if (sourceReference.length === 0) {
    return {
      success: false,
      code: CaptureDiagnosticCodes.SourceReferenceEmpty,
    };
  }

  const occurrence = normalizeOccurrence(input.occurredAt);
  if (occurrence === undefined) {
    return {
      success: false,
      code: CaptureDiagnosticCodes.OccurrenceInvalid,
    };
  }

  if (executionTimeMs < occurrence.timeMs) {
    return {
      success: false,
      code: CaptureDiagnosticCodes.TimeOrderInvalid,
    };
  }

  const value = normalizeValue(input.value);
  if (value === undefined) {
    return {
      success: false,
      code: CaptureDiagnosticCodes.ValueInvalid,
    };
  }

  if (
    input.subjectId !== undefined &&
    !(input.subjectId instanceof Identifier)
  ) {
    return {
      success: false,
      code: CaptureDiagnosticCodes.SubjectInvalid,
    };
  }

  if (
    input.confidence !== undefined &&
    !(input.confidence instanceof Percentage)
  ) {
    return {
      success: false,
      code: CaptureDiagnosticCodes.ConfidenceInvalid,
    };
  }

  const deterministicIdentityMaterial =
    typeof input.deterministicIdentityMaterial === "string"
      ? normalizeText(input.deterministicIdentityMaterial)
      : "";
  if (deterministicIdentityMaterial.length === 0) {
    return {
      success: false,
      code: CaptureDiagnosticCodes.IdentityMaterialEmpty,
    };
  }

  const confidenceDefaulted = input.confidence === undefined;

  return {
    success: true,
    value: {
      organizationId: input.organizationId,
      category: input.category,
      source,
      sourceReference,
      occurredAt: occurrence.iso,
      occurredAtMs: occurrence.timeMs,
      value,
      deterministicIdentityMaterial,
      subjectId: input.subjectId,
      confidence: input.confidence ?? defaultCaptureConfidence(),
      confidenceDefaulted,
    },
  };
};
