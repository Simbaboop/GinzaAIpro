import { describe, expect, it } from "vitest";
import {
  Identifier,
  OperationalLeakagePriority,
  PolicyReference,
  type OperationalLeakageCategory,
  type PriorityDimension,
  type PriorityLevel,
} from "../src/index.js";

const id = (value: string): Identifier => new Identifier(value);

const dimensions = (): PriorityDimension => ({
  EconomicImpact: "Critical",
  CustomerImpact: "High",
  OperationalImpact: "High",
  ComplianceImpact: "Medium",
  StrategicAlignment: "High",
  Urgency: "Critical",
  Frequency: "Medium",
  Detectability: "Low",
  Recoverability: "Informational",
});

const createPriority = (
  overrides: Partial<{
    id: Identifier;
    organizationId: Identifier;
    priorityLevel: PriorityLevel;
    policyReference: PolicyReference;
    sourceOperationalLeakageId: Identifier;
    category: OperationalLeakageCategory;
    dimensions: PriorityDimension;
    traceId: Identifier;
    schemaVersion: string;
    createdAt: string;
  }> = {},
): OperationalLeakagePriority =>
  new OperationalLeakagePriority(
    overrides.id ?? id("priority_001"),
    "organizationId" in overrides
      ? (overrides.organizationId as Identifier)
      : id("organization_001"),
    overrides.priorityLevel ?? "Critical",
    "policyReference" in overrides
      ? (overrides.policyReference as PolicyReference)
      : new PolicyReference(
          "  customer-protection  ",
          "  2026.07  ",
          "  PRIORITY-001  ",
        ),
    "sourceOperationalLeakageId" in overrides
      ? (overrides.sourceOperationalLeakageId as Identifier)
      : id("leakage_001"),
    "category" in overrides
      ? (overrides.category as OperationalLeakageCategory)
      : "Revenue",
    overrides.dimensions ?? dimensions(),
    "traceId" in overrides
      ? (overrides.traceId as Identifier)
      : id("trace_001"),
    overrides.schemaVersion ?? "  1.0.0  ",
    overrides.createdAt ?? "2026-07-21T08:30:00-04:00",
  );

describe("OperationalLeakagePriority", () => {
  it("constructs a normalized operational leakage priority", () => {
    const priority = createPriority();

    expect(priority.organizationId.value).toBe("organization_001");
    expect(priority.priorityLevel).toBe("Critical");
    expect(priority.policyReference.policyId).toBe("customer-protection");
    expect(priority.policyReference.policyVersion).toBe("2026.07");
    expect(priority.policyReference.ruleId).toBe("PRIORITY-001");
    expect(priority.sourceOperationalLeakageId.value).toBe("leakage_001");
    expect(priority.category).toBe("Revenue");
    expect(priority.schemaVersion).toBe("1.0.0");
    expect(priority.createdAt).toBe("2026-07-21T12:30:00.000Z");
  });

  it("requires and preserves immutable organization provenance", () => {
    const organizationId = id("organization_exact");
    const priority = createPriority({ organizationId });
    const descriptor = Object.getOwnPropertyDescriptor(
      OperationalLeakagePriority.prototype,
      "organizationId",
    );

    expect(priority.organizationId).toBe(organizationId);
    expect(Object.isFrozen(priority.organizationId)).toBe(true);
    expect(descriptor?.get).toBeTypeOf("function");
    expect(descriptor?.set).toBeUndefined();
    expect(() =>
      createPriority({ organizationId: undefined as unknown as Identifier }),
    ).toThrow("valid organization identifier");
  });

  it("defensively preserves immutable dimensions", () => {
    const callerDimensions = dimensions();
    const priority = createPriority({ dimensions: callerDimensions });

    (callerDimensions as { EconomicImpact: PriorityLevel }).EconomicImpact =
      "Low";

    expect(priority.dimensions.EconomicImpact).toBe("Critical");
    expect(Object.isFrozen(priority.dimensions)).toBe(true);
  });

  it("rejects an invalid priority level", () => {
    expect(() =>
      createPriority({ priorityLevel: "Immediate" as PriorityLevel }),
    ).toThrow("priority level is not supported");
  });

  it("preserves the originating category through a getter-only API", () => {
    const priority = createPriority({ category: "CustomerExperience" });
    const descriptor = Object.getOwnPropertyDescriptor(
      OperationalLeakagePriority.prototype,
      "category",
    );

    expect(priority.category).toBe("CustomerExperience");
    expect(descriptor?.get).toBeTypeOf("function");
    expect(descriptor?.set).toBeUndefined();
  });

  it("requires a supported originating category", () => {
    expect(() =>
      createPriority({
        category: "Unknown" as OperationalLeakageCategory,
      }),
    ).toThrow("category is not supported");
    expect(() =>
      createPriority({
        category: undefined as unknown as OperationalLeakageCategory,
      }),
    ).toThrow("category is not supported");
  });

  it("rejects invalid policy references", () => {
    expect(() => new PolicyReference("   ", "1.0.0", "RULE-001")).toThrow(
      "policy identifier",
    );
    expect(() => new PolicyReference("policy", "   ", "RULE-001")).toThrow(
      "policy version",
    );
    expect(() => new PolicyReference("policy", "1.0.0", "   ")).toThrow(
      "rule identifier",
    );
    expect(() =>
      createPriority({
        policyReference: undefined as unknown as PolicyReference,
      }),
    ).toThrow("valid policy reference");
  });

  it("rejects invalid dimension mappings", () => {
    const invalidValue = {
      ...dimensions(),
      Urgency: "Immediate",
    } as unknown as PriorityDimension;
    const { Recoverability: _removed, ...missingDimension } = dimensions();
    const extraDimension = {
      ...dimensions(),
      OtherImpact: "Low",
    } as unknown as PriorityDimension;

    expect(() => createPriority({ dimensions: invalidValue })).toThrow(
      "dimensions are invalid",
    );
    expect(() =>
      createPriority({
        dimensions: missingDimension as unknown as PriorityDimension,
      }),
    ).toThrow("dimensions are invalid");
    expect(() => createPriority({ dimensions: extraDimension })).toThrow(
      "dimensions are invalid",
    );
  });

  it("preserves entity and source leakage identifiers", () => {
    const priorityId = id("priority_exact");
    const leakageId = id("leakage_exact");
    const priority = createPriority({
      id: priorityId,
      sourceOperationalLeakageId: leakageId,
    });

    expect(priority.id).toBe(priorityId);
    expect(priority.sourceOperationalLeakageId).toBe(leakageId);
    expect(() =>
      createPriority({
        sourceOperationalLeakageId: undefined as unknown as Identifier,
      }),
    ).toThrow("valid source leakage identifier");
  });

  it("requires and preserves a trace identifier", () => {
    const traceId = id("trace_exact");

    expect(createPriority({ traceId }).traceId).toBe(traceId);
    expect(() =>
      createPriority({ traceId: undefined as unknown as Identifier }),
    ).toThrow("valid trace identifier");
  });

  it("retains canonical identifier-based entity equality", () => {
    const first = createPriority({ id: id("priority_equal") });
    const sameIdentity = createPriority({
      id: id("priority_equal"),
      organizationId: id("organization_other"),
    });
    const differentIdentity = createPriority({ id: id("priority_other") });

    expect(first.equals(sameIdentity)).toBe(true);
    expect(first.equals(differentIdentity)).toBe(false);
  });

  it("freezes PolicyReference", () => {
    const reference = new PolicyReference("policy", "1.0.0", "RULE-001");

    expect(Object.isFrozen(reference)).toBe(true);
  });

  it("freezes dimensions", () => {
    const priority = createPriority();

    expect(Object.isFrozen(priority.dimensions)).toBe(true);
    expect(() =>
      Object.defineProperty(priority.dimensions, "Urgency", { value: "Low" }),
    ).toThrow();
  });

  it("enforces remaining constructor validation", () => {
    expect(() => createPriority({ schemaVersion: "   " })).toThrow(
      "schema version",
    );
    expect(() => createPriority({ createdAt: "not-a-date" })).toThrow(
      "creation time",
    );
  });

  it("freezes the entity", () => {
    const priority = createPriority();

    expect(Object.isFrozen(priority)).toBe(true);
    expect(() =>
      Object.defineProperty(priority, "priorityLevel", { value: "Low" }),
    ).toThrow();
    expect(() =>
      Object.defineProperty(priority, "category", { value: "Cost" }),
    ).toThrow();
  });
});
