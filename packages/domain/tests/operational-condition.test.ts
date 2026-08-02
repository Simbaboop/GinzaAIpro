import { describe, expect, it } from "vitest";
import {
  Identifier,
  OperationalCondition,
  type OperationalConditionCode,
  type OperationalConditionStatus,
  type OperationalSubjectType,
} from "../src/index.js";

const id = (value: string): Identifier => new Identifier(value);

const createCondition = (
  overrides: Partial<{
    semanticFactIds: readonly Identifier[];
    conditionCode: OperationalConditionCode;
    subjectType: OperationalSubjectType;
    status: OperationalConditionStatus;
    ruleId: string;
    ruleSetVersion: string;
    observedAt: string;
    createdAt: string;
  }> = {},
): OperationalCondition =>
  new OperationalCondition(
    id("condition_001"),
    id("organization_001"),
    overrides.semanticFactIds ?? [id("semantic-fact_001")],
    overrides.conditionCode ?? "  overdue-payment  ",
    overrides.subjectType ?? "invoice",
    id("invoice_001"),
    overrides.status ?? "active",
    overrides.ruleId ?? "  OC-001  ",
    overrides.ruleSetVersion ?? "  1.0.0  ",
    overrides.observedAt ?? "2026-07-20T08:30:00-04:00",
    overrides.createdAt ?? "2026-07-20T12:31:00Z",
    id("trace_001"),
  );

describe("OperationalCondition", () => {
  it("constructs an immutable identifier-linked operational condition", () => {
    const semanticFactIds = [id("semantic-fact_001")];
    const condition = createCondition({ semanticFactIds });

    semanticFactIds.push(id("semantic-fact_002"));

    expect(condition.conditionCode).toBe("overdue-payment");
    expect(condition.subjectType).toBe("invoice");
    expect(condition.status).toBe("active");
    expect(condition.ruleId).toBe("OC-001");
    expect(condition.ruleSetVersion).toBe("1.0.0");
    expect(condition.observedAt).toBe("2026-07-20T12:30:00.000Z");
    expect(condition.createdAt).toBe("2026-07-20T12:31:00.000Z");
    expect(condition.semanticFactIds).toHaveLength(1);
    expect(condition.semanticFactIds[0]?.value).toBe("semantic-fact_001");
    expect(condition.subjectId.value).toBe("invoice_001");
    expect(condition.traceId.value).toBe("trace_001");
    expect(Object.isFrozen(condition)).toBe(true);
    expect(Object.isFrozen(condition.semanticFactIds)).toBe(true);
    expect(() =>
      (condition.semanticFactIds as Identifier[]).push(
        id("semantic-fact_003"),
      ),
    ).toThrow();
  });

  it("requires at least one semantic-fact identifier", () => {
    expect(() => createCondition({ semanticFactIds: [] })).toThrow(
      "at least one semantic-fact identifier",
    );
    expect(() =>
      createCondition({
        semanticFactIds: [undefined as unknown as Identifier],
      }),
    ).toThrow("at least one semantic-fact identifier");
  });

  it.each([
    ["conditionCode", "condition code"],
    ["ruleId", "rule identifier"],
    ["ruleSetVersion", "rule-set version"],
  ] as const)("rejects an empty %s", (field, message) => {
    expect(() => createCondition({ [field]: "   " })).toThrow(message);
  });

  it("requires valid observation and creation date-times", () => {
    expect(() => createCondition({ observedAt: "not-a-date" })).toThrow(
      "observation time",
    );
    expect(() => createCondition({ createdAt: "not-a-date" })).toThrow(
      "creation time",
    );
  });

  it.each<OperationalConditionStatus>([
    "active",
    "resolved",
    "suppressed",
  ])("accepts the %s status", (status) => {
    expect(createCondition({ status }).status).toBe(status);
  });

  it.each<OperationalSubjectType>([
    "organization",
    "customer",
    "employee",
    "job",
    "invoice",
  ])("accepts the %s subject type", (subjectType) => {
    expect(createCondition({ subjectType }).subjectType).toBe(subjectType);
  });

  it("rejects unsupported status and subject-type values", () => {
    expect(() =>
      createCondition({ status: "pending" as OperationalConditionStatus }),
    ).toThrow("status is not supported");
    expect(() =>
      createCondition({
        subjectType: "asset" as OperationalSubjectType,
      }),
    ).toThrow("subject type is not supported");
  });
});
