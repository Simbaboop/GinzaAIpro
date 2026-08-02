import {
  EvidenceComponent,
  EvidenceComponentProvenance,
  EvidenceConstructionRuleReference,
  EvidenceQualifier,
  EvidenceRelation,
  Identifier,
  Money,
  Percentage,
  type BusinessSignal,
  type EvidenceValue,
} from "@ginzaaipro/domain";
import {
  ValidationDiagnosticCodes,
  type ValidationDiagnosticCode,
} from "../diagnostics/index.js";
import { createEvidenceComponentIdentifier } from "../identity/evidenceIdentity.js";

export const evidenceConstructionPolicyId =
  "VALIDATION_EVIDENCE_CONSTRUCTION";
export const evidenceConstructionPolicyVersion = "1.0.0";

const ruleVersion = "1.0.0";

type ConstructionRule = Readonly<{
  id: string;
  kind: EvidenceValue["kind"];
}>;

export const evidenceConstructionRules: readonly ConstructionRule[] =
  Object.freeze([
    Object.freeze({
      id: "VAL-EVIDENCE-MONEY-001",
      kind: "money",
    }),
    Object.freeze({
      id: "VAL-EVIDENCE-PERCENTAGE-001",
      kind: "percentage",
    }),
    Object.freeze({
      id: "VAL-EVIDENCE-TEXT-001",
      kind: "text",
    }),
    Object.freeze({
      id: "VAL-EVIDENCE-BOOLEAN-001",
      kind: "boolean",
    }),
    Object.freeze({
      id: "VAL-EVIDENCE-INTEGER-001",
      kind: "integer",
    }),
    Object.freeze({
      id: "VAL-EVIDENCE-DECIMAL-001",
      kind: "decimal",
    }),
  ]);

export type EvidenceConstructionResult =
  | Readonly<{
      success: true;
      component: EvidenceComponent;
      rule: EvidenceConstructionRuleReference;
    }>
  | Readonly<{
      success: false;
      code: ValidationDiagnosticCode;
    }>;

const invalidValue = (): EvidenceConstructionResult =>
  Object.freeze({
    success: false,
    code: ValidationDiagnosticCodes.EvidenceComponentValueInvalid,
  });

export const canonicalizeDecimal = (value: number): string | undefined => {
  if (!Number.isFinite(value) || Number.isInteger(value)) {
    return undefined;
  }

  let lexical = Number.prototype.toString.call(value);
  let negative = false;
  if (lexical.startsWith("-")) {
    negative = true;
    lexical = lexical.slice(1);
  }

  const [coefficient = "", exponentText] = lexical.split("e");
  const exponent =
    exponentText === undefined ? 0 : Number.parseInt(exponentText, 10);
  if (!Number.isInteger(exponent)) {
    return undefined;
  }

  const [integerDigits = "", fractionDigits = ""] = coefficient.split(".");
  if (
    !/^[0-9]+$/.test(integerDigits) ||
    (fractionDigits.length > 0 && !/^[0-9]+$/.test(fractionDigits))
  ) {
    return undefined;
  }

  const digits = integerDigits + fractionDigits;
  const decimalPosition = integerDigits.length + exponent;
  let expanded: string;
  if (decimalPosition <= 0) {
    expanded = `0.${"0".repeat(-decimalPosition)}${digits}`;
  } else if (decimalPosition >= digits.length) {
    expanded = `${digits}${"0".repeat(decimalPosition - digits.length)}`;
  } else {
    expanded =
      `${digits.slice(0, decimalPosition)}.` +
      digits.slice(decimalPosition);
  }

  const [expandedInteger = "", expandedFraction = ""] = expanded.split(".");
  const normalizedInteger = expandedInteger.replace(/^0+(?=[0-9])/, "");
  const normalizedFraction = expandedFraction.replace(/0+$/, "");
  const magnitude =
    normalizedFraction.length === 0
      ? normalizedInteger
      : `${normalizedInteger}.${normalizedFraction}`;
  if (/^0(?:\.0*)?$/.test(magnitude)) {
    return "0";
  }
  return negative ? `-${magnitude}` : magnitude;
};

const normalizeValue = (
  value: unknown,
): EvidenceValue | undefined => {
  if (value instanceof Money) {
    return Object.freeze({
      kind: "money",
      minorUnits: value.minorUnits.toString(10),
      currency: value.currency,
    });
  }
  if (value instanceof Percentage) {
    return Object.freeze({
      kind: "percentage",
      basisPoints: value.basisPoints,
    });
  }
  if (typeof value === "string") {
    const normalized = value.trim().normalize("NFC");
    return normalized.length === 0
      ? undefined
      : Object.freeze({ kind: "text", value: normalized });
  }
  if (typeof value === "boolean") {
    return Object.freeze({ kind: "boolean", value });
  }
  if (typeof value === "bigint") {
    return Object.freeze({
      kind: "integer",
      value: value.toString(10),
    });
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      return undefined;
    }
    if (Number.isInteger(value)) {
      return Number.isSafeInteger(value)
        ? Object.freeze({
            kind: "integer",
            value: Object.is(value, -0) ? "0" : value.toString(10),
          })
        : undefined;
    }
    const canonical = canonicalizeDecimal(value);
    return canonical === undefined
      ? undefined
      : Object.freeze({ kind: "decimal", value: canonical });
  }
  return undefined;
};

export class EvidenceConstructionPolicy {
  async construct(signal: BusinessSignal): Promise<EvidenceConstructionResult> {
    const normalized = normalizeValue(signal.value);
    if (normalized === undefined) {
      return invalidValue();
    }
    const selectedRule = evidenceConstructionRules.find(
      ({ kind }) => kind === normalized.kind,
    );
    if (selectedRule === undefined) {
      return Object.freeze({
        success: false,
        code:
          ValidationDiagnosticCodes.EvidenceConstructionRuleUnsupported,
      });
    }
    if (
      signal.subjectId !== undefined &&
      !(signal.subjectId instanceof Identifier)
    ) {
      return Object.freeze({
        success: false,
        code: ValidationDiagnosticCodes.EvidenceComponentSubjectInvalid,
      });
    }

    try {
      const relation = new EvidenceRelation(
        "ginzaaipro.business-signal",
        "value",
      );
      const qualifiers = Object.freeze([
        new EvidenceQualifier(
          new EvidenceRelation(
            "ginzaaipro.business-signal",
            "category",
          ),
          { kind: "text", value: signal.category },
        ),
        new EvidenceQualifier(
          new EvidenceRelation(
            "ginzaaipro.business-signal",
            "occurred-at",
          ),
          { kind: "instant", value: signal.occurredAt },
        ),
      ]);
      const provenance = Object.freeze([
        new EvidenceComponentProvenance(
          signal.id,
          signal.source,
          "value",
        ),
      ]);
      const rule = new EvidenceConstructionRuleReference(
        selectedRule.id,
        ruleVersion,
      );
      const componentId = await createEvidenceComponentIdentifier({
        organizationId: signal.organizationId,
        subjectId: signal.subjectId,
        relation,
        value: normalized,
        qualifiers,
        provenance,
        constructionRule: rule,
      });
      const component = new EvidenceComponent(
        componentId,
        signal.subjectId,
        relation,
        normalized,
        qualifiers,
        provenance,
        rule,
      );

      return Object.freeze({
        success: true,
        component,
        rule,
      });
    } catch {
      return Object.freeze({
        success: false,
        code: ValidationDiagnosticCodes.EvidenceComponentUnsupported,
      });
    }
  }
}
