import {
  Identifier,
  OperationalLeakagePriority,
  OperationalRecommendation,
  PolicyReference,
  RecommendationRule,
  type DeclarativeRuleRecord,
  type OperationalLeakageCategory,
  type PriorityDimension,
  type PriorityLevel,
} from "@ginzaaipro/domain";
import { describe, expect, it } from "vitest";
import {
  RecommendationRuleEngine,
  RecommendationRuleEngineError,
  type RecommendationRuleEngineFailureCode,
  type RecommendationRuleEngineInput,
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

type PriorityValues = {
  id: Identifier;
  organizationId: Identifier;
  priorityLevel: PriorityLevel;
  traceId: Identifier;
  category: OperationalLeakageCategory;
  createdAt: string;
};

const priorityArtifact = (
  overrides: Partial<PriorityValues> = {},
): OperationalLeakagePriority =>
  new OperationalLeakagePriority(
    overrides.id ?? id("priority_001"),
    overrides.organizationId ?? id("organization_001"),
    overrides.priorityLevel ?? "Critical",
    new PolicyReference("priority-policy", "2026.07", "PRIORITY-001"),
    id("leakage_001"),
    overrides.category ?? "Revenue",
    dimensions(),
    overrides.traceId ?? id("trace_001"),
    "1.0.0",
    overrides.createdAt ?? "2026-07-21T12:00:00Z",
  );

const engineInput = (
  overrides: Partial<{
    operationalLeakagePriority: OperationalLeakagePriority;
    evaluationTime: string;
  }> = {},
): RecommendationRuleEngineInput =>
  Object.freeze({
    operationalLeakagePriority:
      overrides.operationalLeakagePriority ?? priorityArtifact(),
    evaluationTime: overrides.evaluationTime ?? "2026-07-21T13:00:00Z",
  });

const defaultPredicate = (): DeclarativeRuleRecord => ({
  priorityFilter: ["Critical", "High"],
  categoryFilter: ["Revenue", "Cost"],
  conditions: {
    all: [
      {
        field: "dimensions.Urgency",
        operator: "equals",
        value: "Critical",
      },
      {
        field: "createdAt",
        operator: "greaterThanOrEqual",
        value: "2026-01-01T00:00:00.000Z",
      },
    ],
  },
});

const defaultOutputTemplate = (): DeclarativeRuleRecord => ({
  objective: "Reduce unresolved overdue invoices",
  intervention: "Contact the customer to resolve the constraint",
  rationale: "The priority artifact identifies urgent revenue leakage",
  expectedOutcome: "The invoice is resolved or assigned a documented cause.",
  successMetric: "Invoice resolution status recorded within two business days.",
  requiredEvidence: ["Customer response", "Updated invoice status"],
  preconditions: ["Customer contact details are available"],
  constraints: ["Follow the approved contact policy"],
});

type RuleValues = {
  ruleId: string;
  ruleVersion: string;
  policyId: string;
  policyVersion: string;
  enabled: boolean;
  effectiveFrom: string;
  effectiveTo: string | undefined;
  priority: number;
  predicate: DeclarativeRuleRecord;
  outputTemplate: DeclarativeRuleRecord;
};

const rule = (overrides: Partial<RuleValues> = {}): RecommendationRule =>
  new RecommendationRule(
    overrides.ruleId ?? "RECOMMEND-001",
    overrides.ruleVersion ?? "1.0.0",
    overrides.policyId ?? "recommendation-policy",
    overrides.policyVersion ?? "2026.07",
    overrides.enabled ?? true,
    overrides.effectiveFrom ?? "2026-01-01T00:00:00Z",
    "effectiveTo" in overrides
      ? overrides.effectiveTo
      : "2026-12-31T23:59:59Z",
    overrides.priority ?? 10,
    overrides.predicate ?? defaultPredicate(),
    overrides.outputTemplate ?? defaultOutputTemplate(),
    { owner: "revenue-operations" },
  );

const resultSnapshot = (result: OperationalRecommendation) => ({
  recommendationId: result.recommendationId.value,
  organizationId: result.organizationId.value,
  ruleId: result.ruleId,
  ruleVersion: result.ruleVersion,
  policyId: result.policyId,
  policyVersion: result.policyVersion,
  sourceOperationalLeakagePriorityId:
    result.sourceOperationalLeakagePriorityId.value,
  traceId: result.traceId.value,
  objective: result.objective,
  intervention: result.intervention,
  rationale: result.rationale,
  expectedOutcome: result.expectedOutcome,
  successMetric: result.successMetric,
  requiredEvidence: result.requiredEvidence,
  preconditions: result.preconditions,
  constraints: result.constraints,
  createdAt: result.createdAt,
  schemaVersion: result.schemaVersion,
});

const expectFailureCode = (
  operation: () => unknown,
  code: RecommendationRuleEngineFailureCode,
): void => {
  try {
    operation();
    throw new Error("Expected RecommendationRuleEngineError.");
  } catch (error) {
    expect(error).toBeInstanceOf(RecommendationRuleEngineError);
    expect((error as RecommendationRuleEngineError).code).toBe(code);
  }
};

describe("RecommendationRuleEngine", () => {
  it("generates a deterministic recommendation result for a matching rule", () => {
    const source = priorityArtifact();
    const results = new RecommendationRuleEngine().execute(
      [rule()],
      engineInput({ operationalLeakagePriority: source }),
    );

    expect(results).toHaveLength(1);
    expect(results[0]).toBeInstanceOf(OperationalRecommendation);
    expect(resultSnapshot(results[0]!)).toEqual({
      recommendationId: expect.stringMatching(
        /^operational-recommendation:v1:/u,
      ),
      organizationId: "organization_001",
      ruleId: "RECOMMEND-001",
      ruleVersion: "1.0.0",
      policyId: "recommendation-policy",
      policyVersion: "2026.07",
      sourceOperationalLeakagePriorityId: "priority_001",
      traceId: "trace_001",
      objective: "Reduce unresolved overdue invoices",
      intervention: "Contact the customer to resolve the constraint",
      rationale: "The priority artifact identifies urgent revenue leakage",
      expectedOutcome: "The invoice is resolved or assigned a documented cause.",
      successMetric:
        "Invoice resolution status recorded within two business days.",
      requiredEvidence: ["Customer response", "Updated invoice status"],
      preconditions: ["Customer contact details are available"],
      constraints: ["Follow the approved contact policy"],
      createdAt: "2026-07-21T13:00:00.000Z",
      schemaVersion: "1.0.0",
    });
  });

  it("ignores disabled rules", () => {
    const results = new RecommendationRuleEngine().execute(
      [rule({ enabled: false })],
      engineInput(),
    );

    expect(results).toEqual([]);
  });

  it("ignores expired rules", () => {
    const results = new RecommendationRuleEngine().execute(
      [rule({ effectiveTo: "2026-07-21T12:59:59Z" })],
      engineInput(),
    );

    expect(results).toEqual([]);
  });

  it("ignores future rules", () => {
    const results = new RecommendationRuleEngine().execute(
      [rule({ effectiveFrom: "2026-07-21T13:00:01Z" })],
      engineInput(),
    );

    expect(results).toEqual([]);
  });

  it("ignores unmatched predicates", () => {
    const unmatched = rule({
      predicate: {
        priorityFilter: ["Critical"],
        categoryFilter: ["Revenue"],
        conditions: {
          all: [
            {
              field: "dimensions.Urgency",
              operator: "equals",
              value: "Low",
            },
          ],
        },
      },
    });

    expect(
      new RecommendationRuleEngine().execute([unmatched], engineInput()),
    ).toEqual([]);
  });

  it("orders multiple matches by numeric priority then ordinal rule id", () => {
    const rules = [
      rule({ ruleId: "RULE-B", priority: 20 }),
      rule({ ruleId: "RULE-Z", priority: 10 }),
      rule({ ruleId: "RULE-A", priority: 10 }),
    ];
    const results = new RecommendationRuleEngine().execute(
      rules,
      engineInput(),
    );

    expect(results.map(({ ruleId }) => ruleId)).toEqual([
      "RULE-A",
      "RULE-Z",
      "RULE-B",
    ]);
  });

  it("returns deeply immutable canonical recommendations", () => {
    const results = new RecommendationRuleEngine().execute(
      [rule()],
      engineInput(),
    );
    const result = results[0]!;

    expect(Object.isFrozen(results)).toBe(true);
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.requiredEvidence)).toBe(true);
    expect(Object.isFrozen(result.preconditions)).toBe(true);
    expect(Object.isFrozen(result.constraints)).toBe(true);
    expect(() =>
      (results as unknown as OperationalRecommendation[]).push(result),
    ).toThrow();
    expect(() =>
      (result.requiredEvidence as string[]).push("Changed"),
    ).toThrow();
  });

  it("does not mutate rule arrays, rules, or input artifacts", () => {
    const second = rule({ ruleId: "RULE-B", priority: 20 });
    const first = rule({ ruleId: "RULE-A", priority: 10 });
    const rules = [second, first];
    const input = engineInput();
    const beforeRuleIds = rules.map(({ ruleId }) => ruleId);
    const beforeInput = {
      sourceId: input.operationalLeakagePriority.id.value,
      organizationId:
        input.operationalLeakagePriority.organizationId.value,
      traceId: input.operationalLeakagePriority.traceId.value,
      category: input.operationalLeakagePriority.category,
      evaluationTime: input.evaluationTime,
    };

    new RecommendationRuleEngine().execute(rules, input);

    expect(rules.map(({ ruleId }) => ruleId)).toEqual(beforeRuleIds);
    expect(Object.isFrozen(second)).toBe(true);
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(input)).toBe(true);
    expect({
      sourceId: input.operationalLeakagePriority.id.value,
      organizationId:
        input.operationalLeakagePriority.organizationId.value,
      traceId: input.operationalLeakagePriority.traceId.value,
      category: input.operationalLeakagePriority.category,
      evaluationTime: input.evaluationTime,
    }).toEqual(beforeInput);
  });

  it("is replayable and idempotent", () => {
    const engine = new RecommendationRuleEngine();
    const rules = [rule()];
    const input = engineInput();

    const first = engine.execute(rules, input).map(resultSnapshot);
    const second = engine.execute(rules, input).map(resultSnapshot);

    expect(second).toEqual(first);
  });

  it("produces equivalent output for equivalent independent inputs", () => {
    const first = new RecommendationRuleEngine().execute(
      [rule()],
      engineInput({
        operationalLeakagePriority: priorityArtifact(),
      }),
    );
    const second = new RecommendationRuleEngine().execute(
      [rule()],
      engineInput({
        operationalLeakagePriority: priorityArtifact(),
      }),
    );

    expect(first.map(resultSnapshot)).toEqual(second.map(resultSnapshot));
  });

  it("derives identity only from stable source, rule, and policy material", () => {
    const engine = new RecommendationRuleEngine();
    const baseline = engine.execute([rule()], engineInput())[0]!;
    const replayAtAnotherTime = engine.execute(
      [rule()],
      engineInput({ evaluationTime: "2026-07-21T14:00:00Z" }),
    )[0]!;
    const changedSource = engine.execute(
      [rule()],
      engineInput({
        operationalLeakagePriority: priorityArtifact({
          id: id("priority_002"),
        }),
      }),
    )[0]!;
    const changedRule = engine.execute(
      [rule({ ruleVersion: "1.0.1" })],
      engineInput(),
    )[0]!;

    expect(replayAtAnotherTime.recommendationId.equals(
      baseline.recommendationId,
    )).toBe(true);
    expect(changedSource.recommendationId.equals(
      baseline.recommendationId,
    )).toBe(false);
    expect(changedRule.recommendationId.equals(
      baseline.recommendationId,
    )).toBe(false);
  });

  it("rejects invalid rule and input structures with governed failures", () => {
    const engine = new RecommendationRuleEngine();

    expectFailureCode(
      () =>
        engine.execute(
          [undefined as unknown as RecommendationRule],
          engineInput(),
        ),
      "RejectedInput",
    );
    expectFailureCode(
      () =>
        engine.execute([rule()], {
          ...engineInput(),
          operationalLeakagePriority:
            undefined as unknown as OperationalLeakagePriority,
        }),
      "RejectedInput",
    );
    expectFailureCode(
      () =>
        engine.execute(
          [rule()],
          engineInput({ evaluationTime: "not-a-date" }),
        ),
      "RejectedInput",
    );
    expectFailureCode(
      () =>
        engine.execute(
          [rule()],
          engineInput({ evaluationTime: "July 21, 2026 1:00 PM" }),
        ),
      "RejectedInput",
    );
    expectFailureCode(
      () =>
        engine.execute(
          [
            rule({
              predicate: {
                priorityFilter: ["Critical"],
                categoryFilter: ["Revenue"],
                conditions: {
                  all: [
                    {
                      field: "dimensions.Urgency",
                      operator: "contains",
                      value: "Critical",
                    },
                  ],
                },
              },
            }),
          ],
          engineInput(),
        ),
      "ValidationFailure",
    );
  });

  it("rejects matched rules that cannot materialize canonical content", () => {
    const engine = new RecommendationRuleEngine();
    const withoutObjective = {
      intervention: "Contact the customer",
      rationale: "The priority artifact identifies leakage",
      expectedOutcome: "The invoice is resolved",
      successMetric: "Resolution status recorded",
      requiredEvidence: ["Customer response"],
      preconditions: [],
      constraints: [],
    } satisfies DeclarativeRuleRecord;
    const invalidEvidence = {
      ...defaultOutputTemplate(),
      requiredEvidence: "Customer response",
    } satisfies DeclarativeRuleRecord;

    expectFailureCode(
      () =>
        engine.execute(
          [rule({ outputTemplate: withoutObjective })],
          engineInput(),
        ),
      "ValidationFailure",
    );
    expectFailureCode(
      () =>
        engine.execute(
          [rule({ outputTemplate: invalidEvidence })],
          engineInput(),
        ),
      "ValidationFailure",
    );
  });

  it("preserves source and trace identifiers by identity", () => {
    const organizationId = id("organization_exact");
    const sourceId = id("priority_exact");
    const traceId = id("trace_exact");
    const source = priorityArtifact({ organizationId, id: sourceId, traceId });
    const result = new RecommendationRuleEngine().execute(
      [rule()],
      engineInput({ operationalLeakagePriority: source }),
    )[0]!;

    expect(result.organizationId).toBe(organizationId);
    expect(result.sourceOperationalLeakagePriorityId).toBe(sourceId);
    expect(result.traceId).toBe(traceId);
  });
});
