import {
  BusinessSignal,
  Identifier,
  Money,
  Percentage,
  type BusinessSignalValue,
  type EvidenceValue,
} from "@ginzaaipro/domain";
import { describe, expect, it } from "vitest";
import {
  EvidenceConstructionPolicy,
  canonicalizeDecimal,
  evidenceConstructionPolicyId,
  evidenceConstructionPolicyVersion,
  evidenceConstructionRules,
} from "../src/construction/EvidenceConstructionPolicy.js";

const organizationId = new Identifier("org_001");
const confidence = Percentage.fromBasisPoints(8_000);

const signal = (
  value: BusinessSignalValue,
  signalId = "sig_001",
): BusinessSignal =>
  new BusinessSignal(
    new Identifier(signalId),
    organizationId,
    "operational",
    "dispatch-system",
    "2026-07-18T10:00:00.000Z",
    "2026-07-18T10:01:00.000Z",
    value,
    confidence,
    "valid",
    new Identifier("job_001"),
  );

const construct = (value: BusinessSignalValue) =>
  new EvidenceConstructionPolicy().construct(signal(value));

describe("VALIDATION_EVIDENCE_CONSTRUCTION@1.0.0", () => {
  it("uses the exact closed policy and deterministic rule order", () => {
    expect(evidenceConstructionPolicyId).toBe(
      "VALIDATION_EVIDENCE_CONSTRUCTION",
    );
    expect(evidenceConstructionPolicyVersion).toBe("1.0.0");
    expect(evidenceConstructionRules).toEqual([
      { id: "VAL-EVIDENCE-MONEY-001", kind: "money" },
      { id: "VAL-EVIDENCE-PERCENTAGE-001", kind: "percentage" },
      { id: "VAL-EVIDENCE-TEXT-001", kind: "text" },
      { id: "VAL-EVIDENCE-BOOLEAN-001", kind: "boolean" },
      { id: "VAL-EVIDENCE-INTEGER-001", kind: "integer" },
      { id: "VAL-EVIDENCE-DECIMAL-001", kind: "decimal" },
    ]);
    expect(Object.isFrozen(evidenceConstructionRules)).toBe(true);
    expect(evidenceConstructionRules.every(Object.isFrozen)).toBe(true);
  });

  it.each<{
    name: string;
    input: BusinessSignalValue;
    rule: string;
    expected: EvidenceValue;
  }>([
    {
      name: "Money",
      input: new Money(12_500n, "usd"),
      rule: "VAL-EVIDENCE-MONEY-001",
      expected: {
        kind: "money",
        minorUnits: "12500",
        currency: "USD",
      },
    },
    {
      name: "Percentage",
      input: Percentage.fromBasisPoints(2_500),
      rule: "VAL-EVIDENCE-PERCENTAGE-001",
      expected: { kind: "percentage", basisPoints: 2_500 },
    },
    {
      name: "Text",
      input: " validated ",
      rule: "VAL-EVIDENCE-TEXT-001",
      expected: { kind: "text", value: "validated" },
    },
    {
      name: "Boolean",
      input: true,
      rule: "VAL-EVIDENCE-BOOLEAN-001",
      expected: { kind: "boolean", value: true },
    },
    {
      name: "Integer bigint",
      input: 42n,
      rule: "VAL-EVIDENCE-INTEGER-001",
      expected: { kind: "integer", value: "42" },
    },
    {
      name: "Integer number",
      input: -42,
      rule: "VAL-EVIDENCE-INTEGER-001",
      expected: { kind: "integer", value: "-42" },
    },
    {
      name: "Decimal",
      input: 0.125,
      rule: "VAL-EVIDENCE-DECIMAL-001",
      expected: { kind: "decimal", value: "0.125" },
    },
  ])("constructs the $name rule exactly", async ({ input, rule, expected }) => {
    const result = await construct(input);

    expect(result.success).toBe(true);
    if (!result.success) {
      throw new Error("Expected construction success.");
    }
    expect(result.rule.id).toBe(rule);
    expect(result.rule.version).toBe("1.0.0");
    expect(result.component.value).toEqual(expected);
    expect(result.component.subjectId?.value).toBe("job_001");
    expect(
      result.component.qualifiers.map(
        ({ relation }) => `${relation.namespace}:${relation.name}`,
      ),
    ).toEqual([
      "ginzaaipro.business-signal:category",
      "ginzaaipro.business-signal:occurred-at",
    ]);
    expect(result.component.provenance).toHaveLength(1);
    expect(result.component.provenance[0]?.signalId.value).toBe("sig_001");
    expect(result.component.provenance[0]?.sourceField).toBe("value");
    expect(result.component.provenance[0]?.sourceLocator).toBeUndefined();
  });

  it("implements exact decimal canonicalization", () => {
    expect(canonicalizeDecimal(0.1)).toBe("0.1");
    expect(canonicalizeDecimal(-0.1)).toBe("-0.1");
    expect(canonicalizeDecimal(1e-7)).toBe("0.0000001");
    expect(canonicalizeDecimal(-1e-7)).toBe("-0.0000001");
    expect(canonicalizeDecimal(1.25e-3)).toBe("0.00125");
    expect(canonicalizeDecimal(1000.5)).toBe("1000.5");
    expect(canonicalizeDecimal(1.0000000000000002)).toBe(
      "1.0000000000000002",
    );
    expect(canonicalizeDecimal(1.2300)).toBe("1.23");
    expect(canonicalizeDecimal(Number.MIN_VALUE)).toBe(
      `0.${"0".repeat(323)}5`,
    );
  });

  it("normalizes negative zero and integer-valued numbers as Integer", async () => {
    const negativeZero = await construct(-0);
    const integerValued = await construct(1.0);

    expect(negativeZero.success && negativeZero.component.value).toEqual({
      kind: "integer",
      value: "0",
    });
    expect(integerValued.success && integerValued.component.value).toEqual({
      kind: "integer",
      value: "1",
    });
    expect(canonicalizeDecimal(-0)).toBeUndefined();
    expect(canonicalizeDecimal(1.0)).toBeUndefined();
  });

  it.each([
    Number.NaN,
    Number.POSITIVE_INFINITY,
    Number.NEGATIVE_INFINITY,
    9_007_199_254_740_992,
  ])(
    "returns component-value-invalid for direct-policy numeric input %s",
    async (value) => {
      const result = await construct(value);

      expect(result).toEqual({
        success: false,
        code: "EVIDENCE_COMPONENT_VALUE_INVALID",
      });
    },
  );

  it("does not classify inadmissible runtime values as unsupported rules", async () => {
    const result = await new EvidenceConstructionPolicy().construct(
      signal({ kind: "quantity" } as unknown as BusinessSignalValue),
    );

    expect(result).toEqual({
      success: false,
      code: "EVIDENCE_COMPONENT_VALUE_INVALID",
    });
  });

  it("produces deterministic component identity without mutating input", async () => {
    const input = signal(42);
    const before = {
      id: input.id,
      organizationId: input.organizationId,
      value: input.value,
      subjectId: input.subjectId,
    };
    const first = await new EvidenceConstructionPolicy().construct(input);
    const second = await new EvidenceConstructionPolicy().construct(input);

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    if (!first.success || !second.success) {
      throw new Error("Expected construction success.");
    }
    expect(first.component.id.equals(second.component.id)).toBe(true);
    expect(Object.isFrozen(first.component)).toBe(true);
    expect(Object.isFrozen(first.component.qualifiers)).toBe(true);
    expect(Object.isFrozen(first.component.provenance)).toBe(true);
    expect({
      id: input.id,
      organizationId: input.organizationId,
      value: input.value,
      subjectId: input.subjectId,
    }).toEqual(before);
  });
});
