import { describe, expect, it } from "vitest";
import {
  Identifier,
  OperationalLeakage,
  type EvidenceStrength,
  type OperationalLeakageCategory,
} from "../src/index.js";

const id = (value: string): Identifier => new Identifier(value);

const createLeakage = (
  overrides: Partial<{
    id: Identifier;
    organizationId: Identifier;
    category: OperationalLeakageCategory;
    title: string;
    description: string;
    sourceConditionIds: readonly Identifier[];
    traceId: Identifier;
    schemaVersion: string;
    ruleSetVersion: string;
    ruleId: string;
    evidenceStrength: EvidenceStrength;
    createdAt: string;
  }> = {},
): OperationalLeakage =>
  new OperationalLeakage(
    overrides.id ?? id("leakage_001"),
    "organizationId" in overrides
      ? (overrides.organizationId as Identifier)
      : id("organization_001"),
    overrides.category ?? "Revenue",
    overrides.title ?? "  Unbilled completed work  ",
    overrides.description ?? "  Completed work has not been invoiced.  ",
    overrides.sourceConditionIds ?? [id("condition_001")],
    "traceId" in overrides
      ? (overrides.traceId as Identifier)
      : id("trace_001"),
    overrides.schemaVersion ?? "  1.0.0  ",
    overrides.ruleSetVersion ?? "  2026.07  ",
    overrides.ruleId ?? "  LEAK-REVENUE-001  ",
    overrides.evidenceStrength ?? "Verified",
    overrides.createdAt ?? "2026-07-21T08:30:00-04:00",
  );

describe("OperationalLeakage", () => {
  it("constructs a normalized operational leakage", () => {
    const leakage = createLeakage();

    expect(leakage.organizationId.value).toBe("organization_001");
    expect(leakage.category).toBe("Revenue");
    expect(leakage.title).toBe("Unbilled completed work");
    expect(leakage.description).toBe(
      "Completed work has not been invoiced.",
    );
    expect(leakage.schemaVersion).toBe("1.0.0");
    expect(leakage.ruleSetVersion).toBe("2026.07");
    expect(leakage.ruleId).toBe("LEAK-REVENUE-001");
    expect(leakage.evidenceStrength).toBe("Verified");
    expect(leakage.createdAt).toBe("2026-07-21T12:30:00.000Z");
  });

  it("requires and preserves immutable organization provenance", () => {
    const organizationId = id("organization_exact");
    const leakage = createLeakage({ organizationId });
    const descriptor = Object.getOwnPropertyDescriptor(
      OperationalLeakage.prototype,
      "organizationId",
    );

    expect(leakage.organizationId).toBe(organizationId);
    expect(Object.isFrozen(leakage.organizationId)).toBe(true);
    expect(descriptor?.get).toBeTypeOf("function");
    expect(descriptor?.set).toBeUndefined();
    expect(() =>
      createLeakage({ organizationId: undefined as unknown as Identifier }),
    ).toThrow("valid organization identifier");
  });

  it("defensively preserves immutable source-condition identifiers", () => {
    const sourceConditionIds = [id("condition_001")];
    const leakage = createLeakage({ sourceConditionIds });

    sourceConditionIds.push(id("condition_002"));

    expect(leakage.sourceConditionIds).toHaveLength(1);
    expect(leakage.sourceConditionIds[0]?.value).toBe("condition_001");
    expect(Object.isFrozen(leakage.sourceConditionIds)).toBe(true);
    expect(() =>
      (leakage.sourceConditionIds as Identifier[]).push(id("condition_003")),
    ).toThrow();
  });

  it("rejects an invalid category", () => {
    expect(() =>
      createLeakage({ category: "Unknown" as OperationalLeakageCategory }),
    ).toThrow("category is not supported");
  });

  it("rejects an invalid evidence strength", () => {
    expect(() =>
      createLeakage({ evidenceStrength: "Certain" as EvidenceStrength }),
    ).toThrow("evidence strength is not supported");
  });

  it("rejects an empty title", () => {
    expect(() => createLeakage({ title: "   " })).toThrow(
      "title cannot be empty",
    );
  });

  it("rejects an empty description", () => {
    expect(() => createLeakage({ description: "   " })).toThrow(
      "description cannot be empty",
    );
  });

  it("rejects empty or invalid source-condition identifiers", () => {
    expect(() => createLeakage({ sourceConditionIds: [] })).toThrow(
      "at least one source-condition identifier",
    );
    expect(() =>
      createLeakage({
        sourceConditionIds: [undefined as unknown as Identifier],
      }),
    ).toThrow("at least one source-condition identifier");
  });

  it("rejects an empty rule identifier", () => {
    expect(() => createLeakage({ ruleId: "   " })).toThrow(
      "rule identifier cannot be empty",
    );
  });

  it("rejects an empty rule-set version", () => {
    expect(() => createLeakage({ ruleSetVersion: "   " })).toThrow(
      "rule-set version cannot be empty",
    );
  });

  it("rejects an empty schema version", () => {
    expect(() => createLeakage({ schemaVersion: "   " })).toThrow(
      "schema version cannot be empty",
    );
  });

  it("requires and preserves a valid trace identifier", () => {
    const traceId = id("trace_exact");

    expect(createLeakage({ traceId }).traceId).toBe(traceId);
    expect(() =>
      createLeakage({ traceId: undefined as unknown as Identifier }),
    ).toThrow("valid trace identifier");
  });

  it("preserves its identifier", () => {
    const leakageId = id("leakage_exact");

    expect(createLeakage({ id: leakageId }).id).toBe(leakageId);
  });

  it("retains canonical identifier-based entity equality", () => {
    const first = createLeakage({ id: id("leakage_equal") });
    const sameIdentity = createLeakage({
      id: id("leakage_equal"),
      organizationId: id("organization_other"),
    });
    const differentIdentity = createLeakage({ id: id("leakage_other") });

    expect(first.equals(sameIdentity)).toBe(true);
    expect(first.equals(differentIdentity)).toBe(false);
  });

  it("rejects an invalid creation time", () => {
    expect(() => createLeakage({ createdAt: "not-a-date" })).toThrow(
      "creation time",
    );
  });

  it("freezes the entity", () => {
    const leakage = createLeakage();

    expect(Object.isFrozen(leakage)).toBe(true);
    expect(() =>
      Object.defineProperty(leakage, "title", { value: "Changed" }),
    ).toThrow();
  });
});
