import * as Domain from "@ginzaaipro/domain";
import {
  ExecutionPlan,
  ExecutionPlanningRule,
  Identifier,
  OperationalRecommendation,
  RuntimeExecutionPlan,
  type ExecutionPlanningOutputTemplate,
  type ExecutionPlanningPredicate,
  type ExecutionPlanningWorkPackageTemplate,
} from "@ginzaaipro/domain";
import { describe, expect, it, vi } from "vitest";
import * as Engines from "../src/index.js";
import {
  ExecutionPlanningEngine,
  ExecutionPlanningEngineError,
  type ExecutionPlanningEngineFailureCode,
  type ExecutionPlanningEngineInput,
} from "../src/index.js";

const id = (value: string): Identifier => new Identifier(value);

type RecommendationValues = {
  recommendationId: Identifier;
  organizationId: Identifier;
  sourcePriorityId: Identifier;
  traceId: Identifier;
  ruleId: string;
  ruleVersion: string;
  policyId: string;
  policyVersion: string;
  createdAt: string;
  schemaVersion: string;
};

const recommendation = (
  overrides: Partial<RecommendationValues> = {},
): OperationalRecommendation =>
  new OperationalRecommendation(
    overrides.recommendationId ?? id("recommendation_001"),
    overrides.organizationId ?? id("organization_001"),
    overrides.sourcePriorityId ?? id("priority_001"),
    overrides.traceId ?? id("trace_001"),
    overrides.ruleId ?? "RECOMMEND-001",
    overrides.ruleVersion ?? "1.0.0",
    overrides.policyId ?? "recommendation-policy",
    overrides.policyVersion ?? "2026.07",
    "Resolve the observed operational constraint",
    "Apply the governed intervention",
    "The released rule identified a correctable condition",
    "The operational condition improves measurably",
    "The expected outcome is recorded",
    ["Released evidence remains available"],
    ["The recommendation remains admissible"],
    ["Preserve canonical provenance"],
    overrides.createdAt ?? "2026-07-21T12:00:00Z",
    overrides.schemaVersion ?? "1.0.0",
  );

const predicate = (
  overrides: Partial<ExecutionPlanningPredicate> = {},
): ExecutionPlanningPredicate => ({
  recommendationRuleIds: overrides.recommendationRuleIds ?? [
    "RECOMMEND-001",
  ],
  recommendationRuleVersions: overrides.recommendationRuleVersions ?? [
    "1.0.0",
  ],
  recommendationPolicyIds: overrides.recommendationPolicyIds ?? [
    "recommendation-policy",
  ],
  recommendationPolicyVersions: overrides.recommendationPolicyVersions ?? [
    "2026.07",
  ],
  recommendationSchemaVersions: overrides.recommendationSchemaVersions ?? [
    "1.0.0",
  ],
  ...(overrides.requiredRecommendationCount === undefined
    ? {}
    : { requiredRecommendationCount: overrides.requiredRecommendationCount }),
  ...(overrides.minimumRecommendationCount === undefined
    ? {}
    : { minimumRecommendationCount: overrides.minimumRecommendationCount }),
  ...(overrides.maximumRecommendationCount === undefined
    ? {}
    : { maximumRecommendationCount: overrides.maximumRecommendationCount }),
  requireSharedTrace: overrides.requireSharedTrace ?? false,
  requireSharedRuleVersion: overrides.requireSharedRuleVersion ?? false,
  requireSharedPolicyVersion: overrides.requireSharedPolicyVersion ?? false,
  requireSharedSchemaVersion: overrides.requireSharedSchemaVersion ?? false,
});

const workPackage = (
  overrides: Partial<ExecutionPlanningWorkPackageTemplate> = {},
): ExecutionPlanningWorkPackageTemplate => ({
  templateId: overrides.templateId ?? "WORK-001",
  recommendationBinding: overrides.recommendationBinding ?? { kind: "all" },
  objective: overrides.objective ?? "Establish the planned target state",
  intervention:
    overrides.intervention ?? "Apply the approved operational change",
  entryCriteria: overrides.entryCriteria ?? ["Recommendation is admissible"],
  exitCriteria: overrides.exitCriteria ?? ["Planned change is documented"],
  requiredCapabilities: overrides.requiredCapabilities ?? [
    "operational-review",
  ],
  requiredResources: overrides.requiredResources ?? ["canonical-record"],
  executionConstraints: overrides.executionConstraints ?? [
    "Preserve source records",
  ],
  validationCheckpoints: overrides.validationCheckpoints ?? [
    "Confirm recommendation lineage",
  ],
  completionCriteria: overrides.completionCriteria ?? [
    "Work-package exit criteria are satisfied",
  ],
  rollbackConsiderations: overrides.rollbackConsiderations ?? [
    "Restore the prior documented state",
  ],
});

const canonicalTextUnion = (values: readonly string[]): readonly string[] =>
  [...new Set(values)].sort();

const outputTemplate = (
  overrides: Partial<ExecutionPlanningOutputTemplate> = {},
): ExecutionPlanningOutputTemplate => {
  const workPackages = overrides.workPackages ?? [workPackage()];
  return {
    schemaVersion: overrides.schemaVersion ?? "1.0.0",
    requiredCapabilities:
      overrides.requiredCapabilities ??
      canonicalTextUnion(
        workPackages.flatMap((item) => [...item.requiredCapabilities]),
      ),
    requiredResources:
      overrides.requiredResources ??
      canonicalTextUnion(
        workPackages.flatMap((item) => [...item.requiredResources]),
      ),
    executionAssumptions: overrides.executionAssumptions ?? [
      "Recommendation facts remain current",
    ],
    executionConstraints: overrides.executionConstraints ?? [
      "Use governed operational data",
    ],
    admissibilityChecks: overrides.admissibilityChecks ?? [
      "Confirm upstream admissibility",
    ],
    riskControls: overrides.riskControls ?? ["Stop on provenance conflict"],
    approvalGates: overrides.approvalGates ?? [
      "Record required human authorization",
    ],
    rollbackConsiderations: overrides.rollbackConsiderations ?? [
      "Preserve the original operational state",
    ],
    completionCriteria: overrides.completionCriteria ?? [
      "All work packages meet completion criteria",
    ],
    successCriteria: overrides.successCriteria ?? [
      "The expected operational improvement is measurable",
    ],
    workPackages,
    dependencies: overrides.dependencies ?? [],
  };
};

type RuleValues = {
  ruleId: string;
  ruleVersion: string;
  policyId: string;
  policyVersion: string;
  enabled: boolean;
  effectiveFrom: string;
  effectiveTo: string | undefined;
  priority: number;
  predicate: ExecutionPlanningPredicate;
  outputTemplate: ExecutionPlanningOutputTemplate;
};

const rule = (overrides: Partial<RuleValues> = {}): ExecutionPlanningRule =>
  new ExecutionPlanningRule(
    overrides.ruleId ?? "PLAN-001",
    overrides.ruleVersion ?? "1.0.0",
    overrides.policyId ?? "planning-policy",
    overrides.policyVersion ?? "2026.07",
    overrides.enabled ?? true,
    overrides.effectiveFrom ?? "2026-01-01T00:00:00Z",
    "effectiveTo" in overrides
      ? overrides.effectiveTo
      : "2026-12-31T23:59:59Z",
    overrides.priority ?? 100,
    overrides.predicate ?? predicate(),
    overrides.outputTemplate ?? outputTemplate(),
    { owner: "planning-policy-board" },
  );

const input = (
  overrides: Partial<ExecutionPlanningEngineInput> = {},
): ExecutionPlanningEngineInput =>
  Object.freeze({
    recommendations: overrides.recommendations ?? [recommendation()],
    rules: overrides.rules ?? [rule()],
    generationTimestamp:
      overrides.generationTimestamp ?? "2026-07-21T13:00:00Z",
  });

const plan = (
  overrides: Partial<ExecutionPlanningEngineInput> = {},
): ExecutionPlan => new ExecutionPlanningEngine().plan(input(overrides));

const expectFailureCode = (
  operation: () => unknown,
  code: ExecutionPlanningEngineFailureCode,
): void => {
  try {
    operation();
    throw new Error("Expected ExecutionPlanningEngineError.");
  } catch (error) {
    expect(error).toBeInstanceOf(ExecutionPlanningEngineError);
    expect((error as ExecutionPlanningEngineError).code).toBe(code);
  }
};

const forgeRule = (
  source: ExecutionPlanningRule,
  overrides: Partial<RuleValues>,
): ExecutionPlanningRule => {
  const forged = Object.create(
    ExecutionPlanningRule.prototype,
  ) as ExecutionPlanningRule;
  const values: RuleValues = {
    ruleId: overrides.ruleId ?? source.ruleId,
    ruleVersion: overrides.ruleVersion ?? source.ruleVersion,
    policyId: overrides.policyId ?? source.policyId,
    policyVersion: overrides.policyVersion ?? source.policyVersion,
    enabled: overrides.enabled ?? source.enabled,
    effectiveFrom: overrides.effectiveFrom ?? source.effectiveFrom,
    effectiveTo:
      "effectiveTo" in overrides ? overrides.effectiveTo : source.effectiveTo,
    priority: overrides.priority ?? source.priority,
    predicate: overrides.predicate ?? source.predicate,
    outputTemplate: overrides.outputTemplate ?? source.outputTemplate,
  };
  for (const [key, value] of Object.entries(values)) {
    Object.defineProperty(forged, key, {
      configurable: false,
      enumerable: true,
      value,
      writable: false,
    });
  }
  Object.freeze(forged);
  return forged;
};

const identityEncoder = new TextEncoder();
const identityComponent = (value: string): string => {
  const normalized = value.normalize("NFC");
  return `${identityEncoder.encode(normalized).byteLength}:${normalized}`;
};

const expectedWorkPackageId = (
  selectedRule: ExecutionPlanningRule,
  templateId: string,
  recommendations: readonly OperationalRecommendation[],
): string => {
  const recommendationIds = recommendations
    .map((item) => item.recommendationId.value)
    .sort();
  const material = [
    "ginzaaipro:execution-plan-work-package:v1",
    selectedRule.outputTemplate.schemaVersion,
    recommendations[0]!.organizationId.value,
    selectedRule.ruleId,
    selectedRule.ruleVersion,
    selectedRule.policyId,
    selectedRule.policyVersion,
    templateId,
    recommendationIds.length.toString(10),
    ...recommendationIds,
  ]
    .map(identityComponent)
    .join("");
  return `execution-plan-work-package:v1:${material}`;
};

describe("ExecutionPlanningEngine", () => {
  it("creates a canonical plan from one valid recommendation", () => {
    expect(plan()).toBeInstanceOf(ExecutionPlan);
  });

  it("creates one plan from multiple valid recommendations", () => {
    const recommendations = [
      recommendation(),
      recommendation({
        recommendationId: id("recommendation_002"),
        sourcePriorityId: id("priority_002"),
        traceId: id("trace_002"),
      }),
    ];
    const result = plan({
      recommendations,
      rules: [
        rule({ predicate: predicate({ minimumRecommendationCount: 2 }) }),
      ],
    });

    expect(result.sourceRecommendationIds.map((item) => item.value)).toEqual([
      "recommendation_001",
      "recommendation_002",
    ]);
  });

  it("is invariant to recommendation input order", () => {
    const first = recommendation();
    const second = recommendation({
      recommendationId: id("recommendation_002"),
      sourcePriorityId: id("priority_002"),
      traceId: id("trace_002"),
    });
    const planningRule = rule({
      predicate: predicate({ minimumRecommendationCount: 2 }),
    });

    expect(
      plan({ recommendations: [first, second], rules: [planningRule] }).toJSON(),
    ).toEqual(
      plan({ recommendations: [second, first], rules: [planningRule] }).toJSON(),
    );
  });

  it("is invariant to rule input order", () => {
    const preferred = rule({ ruleId: "PLAN-A" });
    const alternate = rule({ ruleId: "PLAN-B" });

    expect(plan({ rules: [preferred, alternate] }).toJSON()).toEqual(
      plan({ rules: [alternate, preferred] }).toJSON(),
    );
  });

  it("preserves the explicit normalized generation timestamp", () => {
    expect(
      plan({ generationTimestamp: "2026-07-21T09:00:00-04:00" }).createdAt,
    ).toBe("2026-07-21T13:00:00.000Z");
  });

  it("does not consult the system clock", () => {
    const clock = vi.spyOn(Date, "now").mockImplementation(() => {
      throw new Error("System time consulted.");
    });
    try {
      expect(plan().createdAt).toBe("2026-07-21T13:00:00.000Z");
      expect(clock).not.toHaveBeenCalled();
    } finally {
      clock.mockRestore();
    }
  });

  it("excludes disabled rules", () => {
    expectFailureCode(
      () => plan({ rules: [rule({ enabled: false })] }),
      "NO_MATCHING_EXECUTION_PLANNING_RULE",
    );
  });

  it("excludes rules outside the inclusive effective period", () => {
    expectFailureCode(
      () =>
        plan({
          rules: [rule({ effectiveTo: "2026-07-21T12:59:59Z" })],
        }),
      "NO_MATCHING_EXECUTION_PLANNING_RULE",
    );
    expect(
      plan({
        generationTimestamp: "2026-12-31T23:59:59Z",
      }),
    ).toBeInstanceOf(ExecutionPlan);
  });

  it("evaluates exact recommendation counts", () => {
    expect(
      plan({
        rules: [
          rule({ predicate: predicate({ requiredRecommendationCount: 1 }) }),
        ],
      }),
    ).toBeInstanceOf(ExecutionPlan);
    expectFailureCode(
      () =>
        plan({
          rules: [
            rule({ predicate: predicate({ requiredRecommendationCount: 2 }) }),
          ],
        }),
      "NO_MATCHING_EXECUTION_PLANNING_RULE",
    );
  });

  it("evaluates minimum recommendation counts", () => {
    expectFailureCode(
      () =>
        plan({
          rules: [
            rule({ predicate: predicate({ minimumRecommendationCount: 2 }) }),
          ],
        }),
      "NO_MATCHING_EXECUTION_PLANNING_RULE",
    );
  });

  it("evaluates maximum recommendation counts", () => {
    const recommendations = [
      recommendation(),
      recommendation({ recommendationId: id("recommendation_002") }),
    ];
    expectFailureCode(
      () =>
        plan({
          recommendations,
          rules: [
            rule({ predicate: predicate({ maximumRecommendationCount: 1 }) }),
          ],
        }),
      "NO_MATCHING_EXECUTION_PLANNING_RULE",
    );
  });

  it("evaluates recommendation-rule identifier and version allowlists", () => {
    expect(plan()).toBeInstanceOf(ExecutionPlan);
    expectFailureCode(
      () =>
        plan({
          rules: [
            rule({
              predicate: predicate({ recommendationRuleIds: ["OTHER"] }),
            }),
          ],
        }),
      "NO_MATCHING_EXECUTION_PLANNING_RULE",
    );
  });

  it("evaluates recommendation-policy identifier and version allowlists", () => {
    expectFailureCode(
      () =>
        plan({
          rules: [
            rule({
              predicate: predicate({ recommendationPolicyIds: ["OTHER"] }),
            }),
          ],
        }),
      "NO_MATCHING_EXECUTION_PLANNING_RULE",
    );
  });

  it("evaluates recommendation-schema allowlists", () => {
    expectFailureCode(
      () =>
        plan({
          rules: [
            rule({
              predicate: predicate({ recommendationSchemaVersions: ["2.0.0"] }),
            }),
          ],
        }),
      "NO_MATCHING_EXECUTION_PLANNING_RULE",
    );
  });

  it("enforces the shared-trace predicate", () => {
    const recommendations = [
      recommendation(),
      recommendation({
        recommendationId: id("recommendation_002"),
        traceId: id("trace_002"),
      }),
    ];
    expectFailureCode(
      () =>
        plan({
          recommendations,
          rules: [
            rule({ predicate: predicate({ requireSharedTrace: true }) }),
          ],
        }),
      "INCOMPATIBLE_RECOMMENDATION_PROVENANCE",
    );
  });

  it("enforces the shared rule-version predicate", () => {
    const recommendations = [
      recommendation(),
      recommendation({
        recommendationId: id("recommendation_002"),
        ruleVersion: "2.0.0",
      }),
    ];
    expectFailureCode(
      () =>
        plan({
          recommendations,
          rules: [
            rule({
              predicate: predicate({
                recommendationRuleVersions: ["1.0.0", "2.0.0"],
                requireSharedRuleVersion: true,
              }),
            }),
          ],
        }),
      "INCOMPATIBLE_RECOMMENDATION_PROVENANCE",
    );
  });

  it("enforces the shared policy-version predicate", () => {
    const recommendations = [
      recommendation(),
      recommendation({
        recommendationId: id("recommendation_002"),
        policyVersion: "2026.08",
      }),
    ];
    expectFailureCode(
      () =>
        plan({
          recommendations,
          rules: [
            rule({
              predicate: predicate({
                recommendationPolicyVersions: ["2026.07", "2026.08"],
                requireSharedPolicyVersion: true,
              }),
            }),
          ],
        }),
      "INCOMPATIBLE_RECOMMENDATION_PROVENANCE",
    );
  });

  it("enforces the shared schema-version predicate", () => {
    const recommendations = [
      recommendation(),
      recommendation({
        recommendationId: id("recommendation_002"),
        schemaVersion: "2.0.0",
      }),
    ];
    expectFailureCode(
      () =>
        plan({
          recommendations,
          rules: [
            rule({
              predicate: predicate({
                recommendationSchemaVersions: ["1.0.0", "2.0.0"],
                requireSharedSchemaVersion: true,
              }),
            }),
          ],
        }),
      "INCOMPATIBLE_RECOMMENDATION_PROVENANCE",
    );
  });

  it("rejects zero matching rules", () => {
    expectFailureCode(
      () => plan({ rules: [] }),
      "NO_MATCHING_EXECUTION_PLANNING_RULE",
    );
  });

  it("selects the sole matching rule", () => {
    expect(plan().planningRuleProvenance).toEqual([
      { ruleId: "PLAN-001", ruleVersion: "1.0.0" },
    ]);
  });

  it("selects the highest-priority matching rule", () => {
    const result = plan({
      rules: [
        rule({ ruleId: "PLAN-LOW", priority: 10 }),
        rule({ ruleId: "PLAN-HIGH", priority: 20 }),
      ],
    });
    expect(result.planningRuleProvenance[0]!.ruleId).toBe("PLAN-HIGH");
  });

  it("uses later effectiveFrom as the second precedence", () => {
    const result = plan({
      rules: [
        rule({ ruleId: "PLAN-OLD", effectiveFrom: "2026-01-01T00:00:00Z" }),
        rule({ ruleId: "PLAN-NEW", effectiveFrom: "2026-07-01T00:00:00Z" }),
      ],
    });
    expect(result.planningRuleProvenance[0]!.ruleId).toBe("PLAN-NEW");
  });

  it("uses canonical rule identifier as the final valid tie-breaker", () => {
    const result = plan({
      rules: [rule({ ruleId: "PLAN-B" }), rule({ ruleId: "PLAN-A" })],
    });
    expect(result.planningRuleProvenance[0]!.ruleId).toBe("PLAN-A");
  });

  it("rejects equally authoritative semantically conflicting rules", () => {
    expectFailureCode(
      () =>
        plan({
          rules: [
            rule({ ruleVersion: "1.0.0" }),
            rule({ ruleVersion: "2.0.0" }),
          ],
        }),
      "AMBIGUOUS_EXECUTION_PLANNING_RULE",
    );
  });

  it("rejects duplicate recommendation identity", () => {
    const repeated = recommendation();
    expectFailureCode(
      () => plan({ recommendations: [repeated, repeated] }),
      "DUPLICATE_OPERATIONAL_RECOMMENDATION",
    );
  });

  it("rejects cross-organization recommendations", () => {
    expectFailureCode(
      () =>
        plan({
          recommendations: [
            recommendation(),
            recommendation({
              recommendationId: id("recommendation_002"),
              organizationId: id("organization_002"),
            }),
          ],
        }),
      "INCOMPATIBLE_RECOMMENDATION_ORGANIZATIONS",
    );
  });

  it("rejects missing recommendation input as incompatible provenance", () => {
    expectFailureCode(
      () => plan({ recommendations: [] }),
      "INCOMPATIBLE_RECOMMENDATION_PROVENANCE",
    );
  });

  it("binds an all-binding package to every recommendation", () => {
    const recommendations = [
      recommendation(),
      recommendation({
        recommendationId: id("recommendation_002"),
        traceId: id("trace_002"),
      }),
    ];
    const result = plan({
      recommendations,
      rules: [
        rule({ predicate: predicate({ minimumRecommendationCount: 2 }) }),
      ],
    });
    expect(
      result.workPackages[0]!.sourceRecommendationIds.map((item) => item.value),
    ).toEqual(["recommendation_001", "recommendation_002"]);
  });

  it("binds a named package to exactly one recommendation", () => {
    const recommendations = [
      recommendation(),
      recommendation({
        recommendationId: id("recommendation_002"),
        traceId: id("trace_002"),
      }),
    ];
    const selectedRule = rule({
      predicate: predicate({ minimumRecommendationCount: 2 }),
      outputTemplate: outputTemplate({
        workPackages: [
          workPackage({
            recommendationBinding: {
              kind: "recommendation",
              recommendationId: id("recommendation_002"),
            },
          }),
        ],
      }),
    });
    const result = plan({ recommendations, rules: [selectedRule] });
    expect(
      result.workPackages[0]!.sourceRecommendationIds.map((item) => item.value),
    ).toEqual(["recommendation_002"]);
  });

  it("rejects an unknown named recommendation binding", () => {
    const selectedRule = rule({
      outputTemplate: outputTemplate({
        workPackages: [
          workPackage({
            recommendationBinding: {
              kind: "recommendation",
              recommendationId: id("recommendation_missing"),
            },
          }),
        ],
      }),
    });
    expectFailureCode(
      () => plan({ rules: [selectedRule] }),
      "UNKNOWN_EXECUTION_PLANNING_TEMPLATE_BINDING",
    );
  });

  it("derives the exact deterministic work-package identity", () => {
    const source = recommendation();
    const selectedRule = rule();
    const result = plan({ recommendations: [source], rules: [selectedRule] });
    expect(result.workPackages[0]!.workPackageId.value).toBe(
      expectedWorkPackageId(selectedRule, "WORK-001", [source]),
    );
  });

  it("rejects duplicate materialized work-package identity", () => {
    const valid = rule();
    const duplicate = workPackage();
    const forged = forgeRule(valid, {
      outputTemplate: {
        ...valid.outputTemplate,
        workPackages: [duplicate, duplicate],
      },
    });
    expectFailureCode(
      () => plan({ rules: [forged] }),
      "DUPLICATE_EXECUTION_PLAN_WORK_PACKAGE",
    );
  });

  it("translates dependency templates into package identifiers", () => {
    const packages = [
      workPackage({ templateId: "WORK-A" }),
      workPackage({ templateId: "WORK-B" }),
    ];
    const selectedRule = rule({
      outputTemplate: outputTemplate({
        workPackages: packages,
        dependencies: [
          { predecessorTemplateId: "WORK-A", successorTemplateId: "WORK-B" },
        ],
      }),
    });
    const result = plan({ rules: [selectedRule] });
    expect(result.dependencyGraph).toHaveLength(1);
    expect(result.workPackages[1]!.dependencyReferences).toHaveLength(1);
  });

  it("rejects unknown dependency-template references", () => {
    const valid = rule();
    const forged = forgeRule(valid, {
      outputTemplate: {
        ...valid.outputTemplate,
        dependencies: [
          {
            predecessorTemplateId: "WORK-001",
            successorTemplateId: "WORK-MISSING",
          },
        ],
      },
    });
    expectFailureCode(
      () => plan({ rules: [forged] }),
      "UNKNOWN_EXECUTION_PLAN_DEPENDENCY",
    );
  });

  it("rejects cyclic dependency templates", () => {
    const valid = rule();
    const packages = [
      workPackage({ templateId: "WORK-A" }),
      workPackage({ templateId: "WORK-B" }),
    ];
    const forged = forgeRule(valid, {
      outputTemplate: outputTemplate({
        workPackages: packages,
        dependencies: [
          { predecessorTemplateId: "WORK-A", successorTemplateId: "WORK-B" },
          { predecessorTemplateId: "WORK-B", successorTemplateId: "WORK-A" },
        ],
      }),
    });
    expectFailureCode(
      () => plan({ rules: [forged] }),
      "EXECUTION_PLAN_DEPENDENCY_CYCLE",
    );
  });

  it("materializes every plan-level literal output field", () => {
    const result = plan();
    expect(result.executionAssumptions).toEqual([
      "Recommendation facts remain current",
    ]);
    expect(result.executionConstraints).toEqual([
      "Use governed operational data",
    ]);
    expect(result.admissibilityChecks).toEqual([
      "Confirm upstream admissibility",
    ]);
    expect(result.riskControls).toEqual(["Stop on provenance conflict"]);
    expect(result.approvalGates).toEqual([
      "Record required human authorization",
    ]);
    expect(result.rollbackConsiderations).toEqual([
      "Preserve the original operational state",
    ]);
    expect(result.completionCriteria).toEqual([
      "All work packages meet completion criteria",
    ]);
    expect(result.successCriteria).toEqual([
      "The expected operational improvement is measurable",
    ]);
    expect(result.schemaVersion).toBe("1.0.0");
  });

  it("materializes every canonical work-package field", () => {
    const item = plan().workPackages[0]!;
    expect(item.objective).toBe("Establish the planned target state");
    expect(item.intervention).toBe("Apply the approved operational change");
    expect(item.entryCriteria).toEqual(["Recommendation is admissible"]);
    expect(item.exitCriteria).toEqual(["Planned change is documented"]);
    expect(item.validationCheckpoints).toEqual([
      "Confirm recommendation lineage",
    ]);
    expect(item.executionConstraints).toEqual(["Preserve source records"]);
    expect(item.requiredCapabilities).toEqual(["operational-review"]);
    expect(item.requiredResources).toEqual(["canonical-record"]);
    expect(item.completionCriteria).toEqual([
      "Work-package exit criteria are satisfied",
    ]);
    expect(item.rollbackConsiderations).toEqual([
      "Restore the prior documented state",
    ]);
  });

  it("preserves canonical recommendation lineage", () => {
    const result = plan();
    expect(result.sourceRecommendationIds[0]!.value).toBe("recommendation_001");
    expect(result.recommendationProvenance[0]).toMatchObject({
      ruleId: "RECOMMEND-001",
      ruleVersion: "1.0.0",
      policyId: "recommendation-policy",
      policyVersion: "2026.07",
      recommendationSchemaVersion: "1.0.0",
    });
  });

  it("preserves canonical trace lineage", () => {
    const result = plan();
    expect(result.traceIds.map((item) => item.value)).toEqual(["trace_001"]);
    expect(result.workPackages[0]!.traceIds.map((item) => item.value)).toEqual([
      "trace_001",
    ]);
  });

  it("preserves planning rule and policy provenance", () => {
    const result = plan();
    expect(result.planningPolicyId).toBe("planning-policy");
    expect(result.planningPolicyVersion).toBe("2026.07");
    expect(result.planningRuleProvenance).toEqual([
      { ruleId: "PLAN-001", ruleVersion: "1.0.0" },
    ]);
  });

  it("rejects inconsistent capability declarations", () => {
    const valid = rule();
    const forged = forgeRule(valid, {
      outputTemplate: {
        ...valid.outputTemplate,
        requiredCapabilities: ["unrelated-capability"],
      },
    });
    expectFailureCode(
      () => plan({ rules: [forged] }),
      "INCONSISTENT_EXECUTION_PLAN_REQUIREMENTS",
    );
  });

  it("rejects prohibited template placeholders", () => {
    const valid = rule();
    const forged = forgeRule(valid, {
      outputTemplate: {
        ...valid.outputTemplate,
        executionAssumptions: ["Use ${recommendationId}"],
      },
    });
    expectFailureCode(
      () => plan({ rules: [forged] }),
      "UNKNOWN_EXECUTION_PLANNING_TEMPLATE_PLACEHOLDER",
    );
  });

  it("rejects empty required materialized output", () => {
    const valid = rule();
    const forged = forgeRule(valid, {
      outputTemplate: {
        ...valid.outputTemplate,
        riskControls: [],
      },
    });
    expectFailureCode(
      () => plan({ rules: [forged] }),
      "EMPTY_EXECUTION_PLAN_FIELD",
    );
  });

  it("rejects malformed rule artifacts", () => {
    expectFailureCode(
      () => plan({ rules: [{} as ExecutionPlanningRule] }),
      "INVALID_EXECUTION_PLANNING_RULE_TEMPLATE",
    );
  });

  it("rejects invalid generation timestamps", () => {
    expectFailureCode(
      () => plan({ generationTimestamp: "2026-07-21" }),
      "INVALID_EXECUTION_PLANNING_TIMESTAMP",
    );
  });

  it("produces deterministic serialization and stable plan identity", () => {
    const first = plan();
    const second = plan();
    expect(first.toJSON()).toEqual(second.toJSON());
    expect(first.planId.equals(second.planId)).toBe(true);
  });

  it("returns a deeply immutable canonical plan", () => {
    const result = plan();
    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.workPackages)).toBe(true);
    expect(Object.isFrozen(result.workPackages[0])).toBe(true);
    expect(Object.isFrozen(result.recommendationProvenance)).toBe(true);
    expect(Object.isFrozen(result.toJSON())).toBe(true);
  });

  it("does not mutate caller input arrays", () => {
    const recommendations = [
      recommendation({ recommendationId: id("recommendation_002") }),
      recommendation(),
    ];
    const rules = [rule({ ruleId: "PLAN-B" }), rule({ ruleId: "PLAN-A" })];
    const recommendationOrder = recommendations.map(
      (item) => item.recommendationId.value,
    );
    const ruleOrder = rules.map((item) => item.ruleId);
    plan({ recommendations, rules });
    expect(recommendations.map((item) => item.recommendationId.value)).toEqual(
      recommendationOrder,
    );
    expect(rules.map((item) => item.ruleId)).toEqual(ruleOrder);
  });

  it("does not produce RuntimeExecutionPlan", () => {
    const result = plan();
    expect(result).not.toBeInstanceOf(RuntimeExecutionPlan);
    expect(ExecutionPlan).not.toBe(RuntimeExecutionPlan);
  });

  it("does not expose runtime-only planning fields", () => {
    const serialized = plan().toJSON() as unknown as Record<string, unknown>;
    for (const field of [
      "ownerId",
      "scheduledAt",
      "status",
      "progress",
      "retryCount",
      "executionState",
    ]) {
      expect(field in serialized).toBe(false);
    }
  });

  it("exports the engine only from @ginzaaipro/engines", () => {
    expect(Engines.ExecutionPlanningEngine).toBe(ExecutionPlanningEngine);
    expect("ExecutionPlanningEngine" in Domain).toBe(false);
    expect(Domain.ExecutionPlan).toBe(ExecutionPlan);
    expect(Domain.ExecutionPlanningRule).toBe(ExecutionPlanningRule);
    expect(Domain.RuntimeExecutionPlan).toBe(RuntimeExecutionPlan);
  });
});
