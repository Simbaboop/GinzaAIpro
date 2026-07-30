import { describe, expect, it } from "vitest";
import {
  Identifier,
  OperationalRecommendation,
} from "../src/index.js";

const id = (value: string): Identifier => new Identifier(value);

type RecommendationValues = {
  recommendationId: Identifier;
  organizationId: Identifier;
  sourceOperationalLeakagePriorityId: Identifier;
  traceId: Identifier;
  ruleId: string;
  ruleVersion: string;
  policyId: string;
  policyVersion: string;
  objective: string;
  intervention: string;
  rationale: string;
  expectedOutcome: string;
  successMetric: string;
  requiredEvidence: readonly string[];
  preconditions: readonly string[];
  constraints: readonly string[];
  createdAt: string;
  schemaVersion: string;
};

const createRecommendation = (
  overrides: Partial<RecommendationValues> = {},
): OperationalRecommendation =>
  new OperationalRecommendation(
    "recommendationId" in overrides
      ? (overrides.recommendationId as Identifier)
      : id("recommendation_001"),
    "organizationId" in overrides
      ? (overrides.organizationId as Identifier)
      : id("organization_001"),
    "sourceOperationalLeakagePriorityId" in overrides
      ? (overrides.sourceOperationalLeakagePriorityId as Identifier)
      : id("priority_001"),
    "traceId" in overrides
      ? (overrides.traceId as Identifier)
      : id("trace_001"),
    overrides.ruleId ?? "  RECOMMEND-001  ",
    overrides.ruleVersion ?? "1.2.3+released",
    overrides.policyId ?? "  recommendation-policy  ",
    overrides.policyVersion ?? "2026.07+approved",
    overrides.objective ?? "  Reduce unresolved overdue invoices  ",
    overrides.intervention ?? "  Contact the customer to resolve the constraint  ",
    overrides.rationale ?? "  The priority artifact identifies urgent revenue leakage  ",
    overrides.expectedOutcome ?? "  The invoice is resolved or receives a documented cause  ",
    overrides.successMetric ?? "  Resolution status recorded within two business days  ",
    overrides.requiredEvidence ?? [
      "  Customer response  ",
      "  Updated invoice status  ",
    ],
    overrides.preconditions ?? ["  Customer contact details are available  "],
    overrides.constraints ?? ["  Follow the approved contact policy  "],
    overrides.createdAt ?? "2026-07-21T09:30:00-04:00",
    overrides.schemaVersion ?? "  1.0.0  ",
  );

const snapshot = (recommendation: OperationalRecommendation) => ({
  recommendationId: recommendation.recommendationId.value,
  organizationId: recommendation.organizationId.value,
  sourceOperationalLeakagePriorityId:
    recommendation.sourceOperationalLeakagePriorityId.value,
  traceId: recommendation.traceId.value,
  ruleId: recommendation.ruleId,
  ruleVersion: recommendation.ruleVersion,
  policyId: recommendation.policyId,
  policyVersion: recommendation.policyVersion,
  objective: recommendation.objective,
  intervention: recommendation.intervention,
  rationale: recommendation.rationale,
  expectedOutcome: recommendation.expectedOutcome,
  successMetric: recommendation.successMetric,
  requiredEvidence: recommendation.requiredEvidence,
  preconditions: recommendation.preconditions,
  constraints: recommendation.constraints,
  createdAt: recommendation.createdAt,
  schemaVersion: recommendation.schemaVersion,
});

describe("OperationalRecommendation", () => {
  it("constructs a canonical operational recommendation", () => {
    const recommendation = createRecommendation();

    expect(recommendation).toBeInstanceOf(OperationalRecommendation);
    expect(Object.isFrozen(recommendation)).toBe(true);
  });

  it("preserves and normalizes every field", () => {
    expect(snapshot(createRecommendation())).toEqual({
      recommendationId: "recommendation_001",
      organizationId: "organization_001",
      sourceOperationalLeakagePriorityId: "priority_001",
      traceId: "trace_001",
      ruleId: "RECOMMEND-001",
      ruleVersion: "1.2.3+released",
      policyId: "recommendation-policy",
      policyVersion: "2026.07+approved",
      objective: "Reduce unresolved overdue invoices",
      intervention: "Contact the customer to resolve the constraint",
      rationale: "The priority artifact identifies urgent revenue leakage",
      expectedOutcome: "The invoice is resolved or receives a documented cause",
      successMetric: "Resolution status recorded within two business days",
      requiredEvidence: ["Customer response", "Updated invoice status"],
      preconditions: ["Customer contact details are available"],
      constraints: ["Follow the approved contact policy"],
      createdAt: "2026-07-21T13:30:00.000Z",
      schemaVersion: "1.0.0",
    });
  });

  it("preserves provenance and trace identifiers by identity", () => {
    const organizationId = id("organization_exact");
    const sourceId = id("priority_exact");
    const traceId = id("trace_exact");
    const recommendation = createRecommendation({
      organizationId,
      sourceOperationalLeakagePriorityId: sourceId,
      traceId,
    });

    expect(recommendation.organizationId).toBe(organizationId);
    expect(recommendation.sourceOperationalLeakagePriorityId).toBe(sourceId);
    expect(recommendation.traceId).toBe(traceId);
    expect(Object.isFrozen(recommendation.organizationId)).toBe(true);
  });

  it("preserves exact rule and policy versions", () => {
    const recommendation = createRecommendation({
      ruleVersion: "v1.0.0+release.42",
      policyVersion: "2026.07/governed",
    });

    expect(recommendation.ruleVersion).toBe("v1.0.0+release.42");
    expect(recommendation.policyVersion).toBe("2026.07/governed");
  });

  it("exposes getter-only state", () => {
    const properties = [
      "recommendationId",
      "organizationId",
      "sourceOperationalLeakagePriorityId",
      "traceId",
      "ruleId",
      "ruleVersion",
      "policyId",
      "policyVersion",
      "objective",
      "intervention",
      "rationale",
      "expectedOutcome",
      "successMetric",
      "requiredEvidence",
      "preconditions",
      "constraints",
      "createdAt",
      "schemaVersion",
    ];

    for (const property of properties) {
      const descriptor = Object.getOwnPropertyDescriptor(
        OperationalRecommendation.prototype,
        property,
      );
      expect(descriptor?.get).toBeTypeOf("function");
      expect(descriptor?.set).toBeUndefined();
    }
  });

  it("enforces top-level immutability", () => {
    const recommendation = createRecommendation();

    expect(Object.isFrozen(recommendation)).toBe(true);
    expect(() =>
      Object.defineProperty(recommendation, "objective", { value: "Changed" }),
    ).toThrow();
  });

  it("deeply freezes structured fields", () => {
    const recommendation = createRecommendation();

    expect(Object.isFrozen(recommendation.requiredEvidence)).toBe(true);
    expect(Object.isFrozen(recommendation.preconditions)).toBe(true);
    expect(Object.isFrozen(recommendation.constraints)).toBe(true);
    expect(() =>
      (recommendation.requiredEvidence as string[]).push("Changed"),
    ).toThrow();
  });

  it("defensively copies every mutable constructor input", () => {
    const requiredEvidence = ["Customer response"];
    const preconditions = ["Contact details available"];
    const constraints = ["Approved contact policy"];
    const recommendation = createRecommendation({
      requiredEvidence,
      preconditions,
      constraints,
    });

    requiredEvidence.push("Changed");
    preconditions[0] = "Changed";
    constraints.splice(0, 1);

    expect(recommendation.requiredEvidence).toEqual(["Customer response"]);
    expect(recommendation.preconditions).toEqual([
      "Contact details available",
    ]);
    expect(recommendation.constraints).toEqual([
      "Approved contact policy",
    ]);
  });

  it("rejects invalid identifiers", () => {
    expect(() =>
      createRecommendation({
        recommendationId: undefined as unknown as Identifier,
      }),
    ).toThrow("valid recommendation identifier");
    expect(() =>
      createRecommendation({
        organizationId: undefined as unknown as Identifier,
      }),
    ).toThrow("valid organization identifier");
    expect(() =>
      createRecommendation({
        sourceOperationalLeakagePriorityId:
          undefined as unknown as Identifier,
      }),
    ).toThrow("valid source-priority identifier");
    expect(() =>
      createRecommendation({ traceId: undefined as unknown as Identifier }),
    ).toThrow("valid trace identifier");
  });

  it.each([
    ["objective", "objective"],
    ["intervention", "intervention"],
    ["rationale", "rationale"],
    ["expectedOutcome", "expected outcome"],
    ["successMetric", "success metric"],
  ] as const)("rejects a blank %s", (field, message) => {
    expect(() => createRecommendation({ [field]: "   " })).toThrow(message);
  });

  it.each([
    ["ruleId", "rule identifier"],
    ["ruleVersion", "rule version"],
    ["policyId", "policy identifier"],
    ["policyVersion", "policy version"],
    ["schemaVersion", "schema version"],
  ] as const)("rejects a blank %s", (field, message) => {
    expect(() => createRecommendation({ [field]: "   " })).toThrow(message);
  });

  it("rejects an invalid creation time", () => {
    expect(() => createRecommendation({ createdAt: "not-a-date" })).toThrow(
      "creation time",
    );
  });

  it("rejects invalid structured values", () => {
    const circular: { self?: unknown } = {};
    circular.self = circular;

    expect(() =>
      createRecommendation({
        requiredEvidence: [Number.NaN] as unknown as readonly string[],
      }),
    ).toThrow("required evidence");
    expect(() =>
      createRecommendation({
        preconditions: [new Date()] as unknown as readonly string[],
      }),
    ).toThrow("preconditions");
    expect(() =>
      createRecommendation({
        constraints: [circular] as unknown as readonly string[],
      }),
    ).toThrow("constraints");
    expect(() =>
      createRecommendation({
        requiredEvidence: [Symbol("evidence")] as unknown as readonly string[],
      }),
    ).toThrow("required evidence");
  });

  it("rejects functions in structured fields", () => {
    const callback = (() => true) as unknown as string;

    expect(() =>
      createRecommendation({ requiredEvidence: [callback] }),
    ).toThrow("required evidence");
    expect(() =>
      createRecommendation({ preconditions: [callback] }),
    ).toThrow("preconditions");
    expect(() => createRecommendation({ constraints: [callback] })).toThrow(
      "constraints",
    );
  });

  it("constructs equivalent state deterministically", () => {
    expect(snapshot(createRecommendation())).toEqual(
      snapshot(createRecommendation()),
    );
  });

  it("uses canonical identifier-based entity equality", () => {
    const recommendationId = id("recommendation_equal");
    const first = createRecommendation({ recommendationId });
    const sameIdentity = createRecommendation({
      recommendationId: id("recommendation_equal"),
      organizationId: id("organization_other"),
      objective: "Different descriptive content",
    });
    const differentIdentity = createRecommendation({
      recommendationId: id("recommendation_other"),
    });

    expect(first.equals(sameIdentity)).toBe(true);
    expect(first.equals(differentIdentity)).toBe(false);
  });

  it("contains no execution-oriented fields or behavior", () => {
    const recommendation = createRecommendation() as unknown as Record<
      string,
      unknown
    >;

    for (const prohibited of [
      "tasks",
      "taskStatus",
      "assignee",
      "owner",
      "dueAt",
      "schedule",
      "workflowSteps",
      "resources",
      "execute",
      "automation",
    ]) {
      expect(prohibited in recommendation).toBe(false);
    }
  });
});
