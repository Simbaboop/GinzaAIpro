import { describe, expect, it } from "vitest";
import * as domain from "../src/index.js";
import {
  ExecutionPlan,
  Identifier,
  RuntimeExecutionPlan,
  type ExecutionPlanDependency,
  type ExecutionPlanInput,
  type ExecutionPlanRecommendationProvenance,
  type ExecutionPlanRuleProvenance,
  type ExecutionPlanWorkPackage,
} from "../src/index.js";

const id = (value: string): Identifier => new Identifier(value);

const recommendationProvenance =
  (): ExecutionPlanRecommendationProvenance[] => [
    {
      recommendationId: id("recommendation_b"),
      organizationId: id("organization_001"),
      traceId: id("trace_b"),
      recommendationSchemaVersion: "1.1.0",
      ruleId: "RECOMMEND-B",
      ruleVersion: "2.0.0+released",
      policyId: "recommendation-policy",
      policyVersion: "2026.07",
    },
    {
      recommendationId: id("recommendation_a"),
      organizationId: id("organization_001"),
      traceId: id("trace_a"),
      recommendationSchemaVersion: "1.0.0",
      ruleId: "RECOMMEND-A",
      ruleVersion: "1.0.0+released",
      policyId: "recommendation-policy",
      policyVersion: "2026.07",
    },
  ];

const planningRuleProvenance = (): ExecutionPlanRuleProvenance[] => [
  { ruleId: "PLAN-B", ruleVersion: "2.0.0+released" },
  { ruleId: "PLAN-A", ruleVersion: "1.0.0+released" },
];

const workPackages = (): ExecutionPlanWorkPackage[] => [
  {
    workPackageId: id("work_package_b"),
    sourceRecommendationIds: [id("recommendation_b")],
    traceIds: [id("trace_b")],
    objective: "  Resolve the documented customer constraint  ",
    intervention: "  Contact the customer through the approved channel  ",
    entryCriteria: ["  Invoice state has been verified  "],
    exitCriteria: ["  Customer response is recorded  "],
    requiredCapabilities: ["  customer-contact  "],
    requiredResources: ["  customer-record  "],
    executionConstraints: ["  Follow the approved contact policy  "],
    validationCheckpoints: ["  Contact channel is authorized  "],
    completionCriteria: ["  Customer response is documented  "],
    dependencyReferences: [id("work_package_a")],
    rollbackConsiderations: ["  Stop contact if consent is withdrawn  "],
  },
  {
    workPackageId: id("work_package_a"),
    sourceRecommendationIds: [id("recommendation_a")],
    traceIds: [id("trace_a")],
    objective: "  Verify the current invoice state  ",
    intervention: "  Review the canonical invoice record  ",
    entryCriteria: ["  Current invoice record is available  "],
    exitCriteria: ["  Invoice state is confirmed  "],
    requiredCapabilities: ["  invoice-review  "],
    requiredResources: ["  invoice-record  "],
    executionConstraints: ["  Use released invoice data only  "],
    validationCheckpoints: ["  Invoice identity is confirmed  "],
    completionCriteria: ["  Invoice state is documented  "],
    dependencyReferences: [],
    rollbackConsiderations: ["  Record that rollback is not applicable  "],
  },
];

const dependencyGraph = (): ExecutionPlanDependency[] => [
  {
    predecessorWorkPackageId: id("work_package_a"),
    successorWorkPackageId: id("work_package_b"),
  },
];

const validInput = (
  overrides: Partial<ExecutionPlanInput> = {},
): ExecutionPlanInput => ({
  organizationId: id("organization_001"),
  sourceRecommendationIds: [
    id("recommendation_b"),
    id("recommendation_a"),
  ],
  traceIds: [id("trace_b"), id("trace_a")],
  recommendationProvenance: recommendationProvenance(),
  planningPolicyId: "  execution-planning-policy  ",
  planningPolicyVersion: "  2026.07+approved  ",
  planningRuleProvenance: planningRuleProvenance(),
  workPackages: workPackages(),
  dependencyGraph: dependencyGraph(),
  requiredCapabilities: ["invoice-review", "customer-contact"],
  requiredResources: ["invoice-record", "customer-record"],
  executionAssumptions: ["  Contact details remain current  "],
  executionConstraints: ["  Preserve customer consent  "],
  admissibilityChecks: ["  Recommendations remain admissible  "],
  riskControls: ["  Stop on a consent conflict  "],
  approvalGates: ["  Released planning policy is present  "],
  rollbackConsiderations: ["  Preserve the original invoice record  "],
  completionCriteria: ["  Every work package meets its exit criteria  "],
  successCriteria: ["  Invoice disposition is measurably improved  "],
  createdAt: "2026-07-22T09:30:00-04:00",
  schemaVersion: "  1.0.0  ",
  ...overrides,
});

const createPlan = (
  overrides: Partial<ExecutionPlanInput> = {},
): ExecutionPlan => new ExecutionPlan(validInput(overrides));

describe("ExecutionPlan", () => {
  it("constructs the canonical planning-only entity", () => {
    const plan = createPlan();

    expect(plan).toBeInstanceOf(ExecutionPlan);
    expect(plan).not.toBeInstanceOf(RuntimeExecutionPlan);
    expect(Object.isFrozen(plan)).toBe(true);
    expect(plan.planId).toBe(plan.id);
    expect(plan.planId.value.startsWith("execution-plan:v1:")).toBe(true);
  });

  it("preserves every public canonical field", () => {
    const serialized = createPlan().toJSON();

    expect(serialized).toMatchObject({
      organizationId: "organization_001",
      sourceRecommendationIds: ["recommendation_a", "recommendation_b"],
      traceIds: ["trace_a", "trace_b"],
      planningPolicyId: "execution-planning-policy",
      planningPolicyVersion: "2026.07+approved",
      requiredCapabilities: ["customer-contact", "invoice-review"],
      requiredResources: ["customer-record", "invoice-record"],
      executionAssumptions: ["Contact details remain current"],
      executionConstraints: ["Preserve customer consent"],
      admissibilityChecks: ["Recommendations remain admissible"],
      riskControls: ["Stop on a consent conflict"],
      approvalGates: ["Released planning policy is present"],
      rollbackConsiderations: ["Preserve the original invoice record"],
      completionCriteria: [
        "Every work package meets its exit criteria",
      ],
      successCriteria: ["Invoice disposition is measurably improved"],
      createdAt: "2026-07-22T13:30:00.000Z",
      schemaVersion: "1.0.0",
    });
    expect(serialized.workPackages.map((item) => item.workPackageId)).toEqual([
      "work_package_a",
      "work_package_b",
    ]);
  });

  it("preserves canonical organization provenance", () => {
    const organizationId = id("organization_exact");
    const provenance = recommendationProvenance().map((record) => ({
      ...record,
      organizationId,
    }));
    const plan = createPlan({ organizationId, recommendationProvenance: provenance });

    expect(plan.organizationId).toBe(organizationId);
    expect(
      plan.recommendationProvenance.every(
        (record) => record.organizationId === organizationId,
      ),
    ).toBe(true);
  });

  it("preserves recommendation identity, versions, policies, rules, and traces", () => {
    const plan = createPlan();

    expect(
      plan.recommendationProvenance.map((record) => ({
        recommendationId: record.recommendationId.value,
        schemaVersion: record.recommendationSchemaVersion,
        traceId: record.traceId.value,
        ruleId: record.ruleId,
        ruleVersion: record.ruleVersion,
        policyId: record.policyId,
        policyVersion: record.policyVersion,
      })),
    ).toEqual([
      {
        recommendationId: "recommendation_a",
        schemaVersion: "1.0.0",
        traceId: "trace_a",
        ruleId: "RECOMMEND-A",
        ruleVersion: "1.0.0+released",
        policyId: "recommendation-policy",
        policyVersion: "2026.07",
      },
      {
        recommendationId: "recommendation_b",
        schemaVersion: "1.1.0",
        traceId: "trace_b",
        ruleId: "RECOMMEND-B",
        ruleVersion: "2.0.0+released",
        policyId: "recommendation-policy",
        policyVersion: "2026.07",
      },
    ]);
  });

  it("keeps planning provenance separate and canonical", () => {
    const plan = createPlan();

    expect(plan.planningPolicyId).toBe("execution-planning-policy");
    expect(plan.planningPolicyVersion).toBe("2026.07+approved");
    expect(plan.planningRuleProvenance).toEqual([
      { ruleId: "PLAN-A", ruleVersion: "1.0.0+released" },
      { ruleId: "PLAN-B", ruleVersion: "2.0.0+released" },
    ]);
  });

  it("normalizes equivalent unordered canonical inputs deterministically", () => {
    const first = createPlan();
    const second = createPlan({
      sourceRecommendationIds: [...validInput().sourceRecommendationIds].reverse(),
      traceIds: [...validInput().traceIds].reverse(),
      recommendationProvenance: [...recommendationProvenance()].reverse(),
      planningRuleProvenance: [...planningRuleProvenance()].reverse(),
      workPackages: [...workPackages()].reverse(),
      requiredCapabilities: ["customer-contact", "invoice-review"],
      requiredResources: ["customer-record", "invoice-record"],
      createdAt: "2026-07-22T13:30:00.000Z",
    });

    expect(second.planId.equals(first.planId)).toBe(true);
    expect(second.equals(first)).toBe(true);
    expect(second.toJSON()).toEqual(first.toJSON());
  });

  it("derives different identity when canonical planning content changes", () => {
    const changedPackages = workPackages();
    changedPackages[1] = {
      ...changedPackages[1]!,
      objective: "Verify invoice identity and current state",
    };

    const original = createPlan();
    const changed = createPlan({ workPackages: changedPackages });

    expect(changed.planId.equals(original.planId)).toBe(false);
    expect(changed.equals(original)).toBe(false);
  });

  it("derives different identity when provenance changes", () => {
    const changedProvenance = recommendationProvenance();
    changedProvenance[1] = {
      ...changedProvenance[1]!,
      ruleVersion: "1.0.1+released",
    };

    const original = createPlan();
    const changed = createPlan({
      recommendationProvenance: changedProvenance,
    });

    expect(changed.planId.equals(original.planId)).toBe(false);
    expect(changed.equals(original)).toBe(false);
  });

  it("exposes getter-only state", () => {
    const properties = [
      "planId",
      "organizationId",
      "sourceRecommendationIds",
      "traceIds",
      "recommendationProvenance",
      "planningPolicyId",
      "planningPolicyVersion",
      "planningRuleProvenance",
      "workPackages",
      "dependencyGraph",
      "requiredCapabilities",
      "requiredResources",
      "executionAssumptions",
      "executionConstraints",
      "admissibilityChecks",
      "riskControls",
      "approvalGates",
      "rollbackConsiderations",
      "completionCriteria",
      "successCriteria",
      "createdAt",
      "schemaVersion",
    ];

    for (const property of properties) {
      const descriptor = Object.getOwnPropertyDescriptor(
        ExecutionPlan.prototype,
        property,
      );
      expect(descriptor?.get).toBeTypeOf("function");
      expect(descriptor?.set).toBeUndefined();
    }
  });

  it("deeply freezes the complete entity graph", () => {
    const plan = createPlan();
    const workPackage = plan.workPackages[0]!;

    for (const value of [
      plan,
      plan.sourceRecommendationIds,
      plan.traceIds,
      plan.recommendationProvenance,
      plan.recommendationProvenance[0],
      plan.planningRuleProvenance,
      plan.planningRuleProvenance[0],
      plan.workPackages,
      workPackage,
      workPackage.sourceRecommendationIds,
      workPackage.traceIds,
      workPackage.entryCriteria,
      workPackage.dependencyReferences,
      plan.dependencyGraph,
      plan.dependencyGraph[0],
      plan.requiredCapabilities,
      plan.successCriteria,
    ]) {
      expect(Object.isFrozen(value)).toBe(true);
    }

    expect(() =>
      Object.defineProperty(plan, "schemaVersion", { value: "changed" }),
    ).toThrow();
    expect(() =>
      (plan.workPackages as ExecutionPlanWorkPackage[]).push(workPackage),
    ).toThrow();
  });

  it("defensively copies mutable constructor inputs", () => {
    const input = validInput();
    const sourceIds = input.sourceRecommendationIds as Identifier[];
    const provenance =
      input.recommendationProvenance as ExecutionPlanRecommendationProvenance[];
    const packages = input.workPackages as ExecutionPlanWorkPackage[];
    const constraints = input.executionConstraints as string[];
    const plan = new ExecutionPlan(input);

    sourceIds.push(id("recommendation_changed"));
    provenance[0] = { ...provenance[0]!, ruleVersion: "changed" };
    packages[0] = { ...packages[0]!, objective: "Changed" };
    constraints[0] = "Changed";

    expect(plan.sourceRecommendationIds).toHaveLength(2);
    expect(plan.recommendationProvenance[1]!.ruleVersion).toBe(
      "2.0.0+released",
    );
    expect(plan.workPackages[1]!.objective).toBe(
      "Resolve the documented customer constraint",
    );
    expect(plan.executionConstraints).toEqual(["Preserve customer consent"]);
  });

  it("does not expose mutable state through returned collections", () => {
    const plan = createPlan();

    expect(() =>
      (plan.sourceRecommendationIds as Identifier[]).reverse(),
    ).toThrow();
    expect(() =>
      (plan.workPackages[0]!.entryCriteria as string[]).push("Changed"),
    ).toThrow();
    expect(plan.sourceRecommendationIds.map((value) => value.value)).toEqual([
      "recommendation_a",
      "recommendation_b",
    ]);
  });

  it("serializes deterministically without exposing mutable references", () => {
    const plan = createPlan();
    const first = plan.toJSON();
    const second = plan.toJSON();

    expect(first).toEqual(second);
    expect(first).not.toBe(second);
    expect(JSON.stringify(plan)).toBe(JSON.stringify(plan));
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.workPackages)).toBe(true);
    expect(Object.isFrozen(first.workPackages[0])).toBe(true);
    expect(Object.isFrozen(first.workPackages[0]!.entryCriteria)).toBe(true);
  });

  it("rejects missing or malformed identifiers", () => {
    expect(() =>
      createPlan({ organizationId: undefined as unknown as Identifier }),
    ).toThrow("valid organization identifier");
    expect(() =>
      createPlan({ sourceRecommendationIds: [undefined as unknown as Identifier] }),
    ).toThrow("valid source recommendations identifier");
    expect(() =>
      createPlan({ traceIds: [undefined as unknown as Identifier] }),
    ).toThrow("valid traces identifier");
  });

  it("rejects blank policy, rule, recommendation, and schema versions", () => {
    expect(() => createPlan({ planningPolicyVersion: "   " })).toThrow(
      "planning policy version",
    );
    expect(() => createPlan({ schemaVersion: "   " })).toThrow(
      "schema version",
    );

    const provenance = recommendationProvenance();
    provenance[0] = { ...provenance[0]!, recommendationSchemaVersion: "   " };
    expect(() => createPlan({ recommendationProvenance: provenance })).toThrow(
      "recommendation schema version",
    );

    const rules = planningRuleProvenance();
    rules[0] = { ...rules[0]!, ruleVersion: "   " };
    expect(() => createPlan({ planningRuleProvenance: rules })).toThrow(
      "planning rule version",
    );
  });

  it("rejects empty required planning content", () => {
    expect(() => createPlan({ sourceRecommendationIds: [] })).toThrow(
      "source recommendations",
    );
    expect(() => createPlan({ workPackages: [] })).toThrow("work packages");
    expect(() => createPlan({ executionAssumptions: [] })).toThrow(
      "execution assumptions",
    );
    expect(() => createPlan({ completionCriteria: [] })).toThrow(
      "completion criteria",
    );
    expect(() => createPlan({ successCriteria: [] })).toThrow(
      "success criteria",
    );
  });

  it("rejects duplicate identifiers and required collection entries", () => {
    expect(() =>
      createPlan({
        sourceRecommendationIds: [
          id("recommendation_a"),
          id("recommendation_a"),
        ],
      }),
    ).toThrow("source recommendations cannot contain duplicates");
    expect(() =>
      createPlan({
        executionConstraints: ["Same constraint", "Same constraint"],
      }),
    ).toThrow("execution constraints cannot contain duplicates");

    const rules = planningRuleProvenance();
    rules[1] = { ruleId: "PLAN-B", ruleVersion: "3.0.0" };
    expect(() => createPlan({ planningRuleProvenance: rules })).toThrow(
      "duplicate rule identifiers",
    );
  });

  it("rejects duplicate recommendation provenance and work-package identities", () => {
    const provenance = recommendationProvenance();
    provenance[1] = {
      ...provenance[1]!,
      recommendationId: id("recommendation_b"),
    };
    expect(() => createPlan({ recommendationProvenance: provenance })).toThrow(
      "duplicate recommendation identifiers",
    );

    const packages = workPackages();
    packages[1] = {
      ...packages[1]!,
      workPackageId: id("work_package_b"),
    };
    expect(() => createPlan({ workPackages: packages })).toThrow(
      "duplicate identifiers",
    );
  });

  it("rejects incompatible organization and trace provenance", () => {
    const incompatibleOrganization = recommendationProvenance();
    incompatibleOrganization[0] = {
      ...incompatibleOrganization[0]!,
      organizationId: id("organization_other"),
    };
    expect(() =>
      createPlan({ recommendationProvenance: incompatibleOrganization }),
    ).toThrow("must belong to the plan organization");

    expect(() => createPlan({ traceIds: [id("trace_a")] })).toThrow(
      "trace identifiers must match recommendation provenance",
    );
  });

  it("rejects invalid work-package lineage and planning content", () => {
    const unknownSource = workPackages();
    unknownSource[0] = {
      ...unknownSource[0]!,
      sourceRecommendationIds: [id("recommendation_unknown")],
    };
    expect(() => createPlan({ workPackages: unknownSource })).toThrow(
      "unknown source recommendation",
    );

    const invalidTrace = workPackages();
    invalidTrace[0] = {
      ...invalidTrace[0]!,
      traceIds: [id("trace_a")],
    };
    expect(() => createPlan({ workPackages: invalidTrace })).toThrow(
      "trace lineage must match",
    );

    const blankObjective = workPackages();
    blankObjective[0] = { ...blankObjective[0]!, objective: "   " };
    expect(() => createPlan({ workPackages: blankObjective })).toThrow(
      "work-package objective",
    );
  });

  it("rejects top-level capability and resource inconsistencies", () => {
    expect(() =>
      createPlan({ requiredCapabilities: ["invoice-review"] }),
    ).toThrow("required capabilities must match its work packages");
    expect(() =>
      createPlan({ requiredResources: ["invoice-record"] }),
    ).toThrow("required resources must match its work packages");
  });

  it("rejects invalid creation timestamps", () => {
    expect(() => createPlan({ createdAt: "not-a-date" })).toThrow(
      "creation time must be a valid date-time",
    );
  });

  it("rejects unknown, self, and duplicate dependency edges", () => {
    expect(() =>
      createPlan({
        dependencyGraph: [
          {
            predecessorWorkPackageId: id("work_package_unknown"),
            successorWorkPackageId: id("work_package_b"),
          },
        ],
      }),
    ).toThrow("unknown work package");

    expect(() =>
      createPlan({
        dependencyGraph: [
          {
            predecessorWorkPackageId: id("work_package_a"),
            successorWorkPackageId: id("work_package_a"),
          },
        ],
      }),
    ).toThrow("cannot depend on itself");

    const edge = dependencyGraph()[0]!;
    expect(() => createPlan({ dependencyGraph: [edge, { ...edge }] })).toThrow(
      "duplicate edges",
    );
  });

  it("rejects dependency-reference disagreement and dependency cycles", () => {
    const mismatchedPackages = workPackages();
    mismatchedPackages[0] = {
      ...mismatchedPackages[0]!,
      dependencyReferences: [],
    };
    expect(() => createPlan({ workPackages: mismatchedPackages })).toThrow(
      "must match the authoritative dependency graph",
    );

    const cyclicPackages = workPackages();
    cyclicPackages[1] = {
      ...cyclicPackages[1]!,
      dependencyReferences: [id("work_package_b")],
    };
    expect(() =>
      createPlan({
        workPackages: cyclicPackages,
        dependencyGraph: [
          ...dependencyGraph(),
          {
            predecessorWorkPackageId: id("work_package_b"),
            successorWorkPackageId: id("work_package_a"),
          },
        ],
      }),
    ).toThrow("cannot contain cycles");
  });

  it("keeps completion and success semantics distinct", () => {
    const plan = createPlan();

    expect(plan.completionCriteria).toEqual([
      "Every work package meets its exit criteria",
    ]);
    expect(plan.successCriteria).toEqual([
      "Invoice disposition is measurably improved",
    ]);
    expect(plan.completionCriteria).not.toBe(plan.successCriteria);
  });

  it("exports both planning and legacy runtime contracts without aliasing", () => {
    expect(domain.ExecutionPlan).toBe(ExecutionPlan);
    expect(domain.RuntimeExecutionPlan).toBe(RuntimeExecutionPlan);
    expect(domain.ExecutionPlan).not.toBe(domain.RuntimeExecutionPlan);
    expect("ExecutionPlanStatus" in domain).toBe(false);
  });

  it("contains no runtime-only fields or behavior", () => {
    const plan = createPlan() as unknown as Record<string, unknown>;
    const serialized = createPlan().toJSON() as unknown as Record<
      string,
      unknown
    >;

    for (const prohibited of [
      "ownerId",
      "assignedTo",
      "status",
      "dueAt",
      "startedAt",
      "completedAt",
      "progress",
      "retryCount",
      "workflowState",
      "schedulerId",
      "execute",
      "schedule",
    ]) {
      expect(prohibited in plan).toBe(false);
      expect(prohibited in serialized).toBe(false);
    }
  });
});
