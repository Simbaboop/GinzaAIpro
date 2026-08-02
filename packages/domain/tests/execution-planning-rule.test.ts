import { describe, expect, it } from "vitest";
import {
  ExecutionPlanningRule,
  Identifier,
  type DeclarativeRuleRecord,
  type ExecutionPlanningOutputTemplate,
  type ExecutionPlanningPredicate,
  type ExecutionPlanningWorkPackageTemplate,
} from "../src/index.js";

const id = (value: string): Identifier => new Identifier(value);

type ExecutionPlanningRuleValues = {
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
  metadata: DeclarativeRuleRecord;
};

const predicate = (): ExecutionPlanningPredicate => ({
  recommendationRuleIds: ["RECOMMEND-B", "RECOMMEND-A"],
  recommendationRuleVersions: ["2.0.0", "1.0.0"],
  recommendationPolicyIds: ["recommendation-policy"],
  recommendationPolicyVersions: ["2026.07"],
  recommendationSchemaVersions: ["1.0.0"],
  minimumRecommendationCount: 1,
  maximumRecommendationCount: 3,
  requireSharedTrace: false,
  requireSharedRuleVersion: false,
  requireSharedPolicyVersion: true,
  requireSharedSchemaVersion: true,
});

const workPackages = (): ExecutionPlanningWorkPackageTemplate[] => [
  {
    templateId: "  CONTACT-CUSTOMER  ",
    recommendationBinding: { kind: "all" },
    objective: "  Resolve the documented customer constraint  ",
    intervention: "  Contact the customer through the approved channel  ",
    entryCriteria: ["  Invoice state is confirmed  "],
    exitCriteria: ["  Customer response is recorded  "],
    requiredCapabilities: ["  customer-contact  "],
    requiredResources: ["  customer-record  "],
    executionConstraints: ["  Follow the approved contact policy  "],
    validationCheckpoints: ["  Contact channel is authorized  "],
    completionCriteria: ["  Customer response is documented  "],
    rollbackConsiderations: ["  Stop if consent is withdrawn  "],
  },
  {
    templateId: "  VERIFY-INVOICE  ",
    recommendationBinding: {
      kind: "recommendation",
      recommendationId: id("recommendation_001"),
    },
    objective: "  Verify the current invoice state  ",
    intervention: "  Review the canonical invoice record  ",
    entryCriteria: ["  Invoice record is available  "],
    exitCriteria: ["  Invoice state is confirmed  "],
    requiredCapabilities: ["  invoice-review  "],
    requiredResources: ["  invoice-record  "],
    executionConstraints: ["  Use released invoice data only  "],
    validationCheckpoints: ["  Invoice identity is confirmed  "],
    completionCriteria: ["  Invoice state is documented  "],
    rollbackConsiderations: ["  Rollback is not applicable  "],
  },
];

const outputTemplate = (): ExecutionPlanningOutputTemplate => ({
  schemaVersion: "  1.0.0  ",
  requiredCapabilities: ["invoice-review", "customer-contact"],
  requiredResources: ["invoice-record", "customer-record"],
  executionAssumptions: ["  Contact details remain current  "],
  executionConstraints: ["  Preserve customer consent  "],
  admissibilityChecks: ["  Recommendations remain admissible  "],
  riskControls: ["  Stop on a consent conflict  "],
  approvalGates: ["  Released planning policy is present  "],
  rollbackConsiderations: ["  Preserve the original invoice record  "],
  completionCriteria: ["  Every work package satisfies exit criteria  "],
  successCriteria: ["  Invoice disposition is measurably improved  "],
  workPackages: workPackages(),
  dependencies: [
    {
      predecessorTemplateId: "  VERIFY-INVOICE  ",
      successorTemplateId: "  CONTACT-CUSTOMER  ",
    },
  ],
});

const metadata = (): DeclarativeRuleRecord => ({
  tags: ["planning", "released"],
  audit: { approvedBy: "planning-policy-board" },
});

const createRule = (
  overrides: Partial<ExecutionPlanningRuleValues> = {},
): ExecutionPlanningRule =>
  new ExecutionPlanningRule(
    overrides.ruleId ?? "  PLAN-001  ",
    overrides.ruleVersion ?? "  1.2.3+released  ",
    overrides.policyId ?? "  execution-planning-policy  ",
    overrides.policyVersion ?? "  2026.07  ",
    overrides.enabled ?? true,
    overrides.effectiveFrom ?? "2026-07-21T08:00:00-04:00",
    "effectiveTo" in overrides
      ? overrides.effectiveTo
      : "2026-12-31T23:59:59Z",
    overrides.priority ?? 100,
    overrides.predicate ?? predicate(),
    overrides.outputTemplate ?? outputTemplate(),
    overrides.metadata ?? metadata(),
  );

describe("ExecutionPlanningRule", () => {
  it("constructs an immutable governed planning rule", () => {
    const rule = createRule();

    expect(rule).toBeInstanceOf(ExecutionPlanningRule);
    expect(Object.isFrozen(rule)).toBe(true);
  });

  it("preserves rule and planning-policy provenance", () => {
    const rule = createRule();

    expect(rule.ruleId).toBe("PLAN-001");
    expect(rule.ruleVersion).toBe("1.2.3+released");
    expect(rule.policyId).toBe("execution-planning-policy");
    expect(rule.policyVersion).toBe("2026.07");
    expect(rule.enabled).toBe(true);
    expect(rule.priority).toBe(100);
    expect(rule.effectiveFrom).toBe("2026-07-21T12:00:00.000Z");
    expect(rule.effectiveTo).toBe("2026-12-31T23:59:59.000Z");
  });

  it("constructs the minimum closed predicate grammar", () => {
    const rule = createRule();

    expect(rule.planningPredicates).toBe(rule.predicate);
    expect(rule.predicate).toEqual({
      recommendationRuleIds: ["RECOMMEND-A", "RECOMMEND-B"],
      recommendationRuleVersions: ["1.0.0", "2.0.0"],
      recommendationPolicyIds: ["recommendation-policy"],
      recommendationPolicyVersions: ["2026.07"],
      recommendationSchemaVersions: ["1.0.0"],
      minimumRecommendationCount: 1,
      maximumRecommendationCount: 3,
      requireSharedTrace: false,
      requireSharedRuleVersion: false,
      requireSharedPolicyVersion: true,
      requireSharedSchemaVersion: true,
    });
  });

  it("constructs the complete output-template grammar", () => {
    const output = createRule().outputTemplate;

    expect(output.schemaVersion).toBe("1.0.0");
    expect(output.requiredCapabilities).toEqual([
      "customer-contact",
      "invoice-review",
    ]);
    expect(output.requiredResources).toEqual([
      "customer-record",
      "invoice-record",
    ]);
    expect(output.executionAssumptions).toEqual([
      "Contact details remain current",
    ]);
    expect(output.executionConstraints).toEqual([
      "Preserve customer consent",
    ]);
    expect(output.admissibilityChecks).toEqual([
      "Recommendations remain admissible",
    ]);
    expect(output.riskControls).toEqual(["Stop on a consent conflict"]);
    expect(output.approvalGates).toEqual([
      "Released planning policy is present",
    ]);
    expect(output.rollbackConsiderations).toEqual([
      "Preserve the original invoice record",
    ]);
    expect(output.completionCriteria).toEqual([
      "Every work package satisfies exit criteria",
    ]);
    expect(output.successCriteria).toEqual([
      "Invoice disposition is measurably improved",
    ]);
  });

  it("normalizes work packages and dependencies canonically", () => {
    const output = createRule().outputTemplate;

    expect(output.workPackages.map((item) => item.templateId)).toEqual([
      "CONTACT-CUSTOMER",
      "VERIFY-INVOICE",
    ]);
    expect(output.dependencies).toEqual([
      {
        predecessorTemplateId: "VERIFY-INVOICE",
        successorTemplateId: "CONTACT-CUSTOMER",
      },
    ]);
    expect(output.workPackages[0]!.recommendationBinding).toEqual({
      kind: "all",
    });
    expect(output.workPackages[1]!.recommendationBinding).toEqual({
      kind: "recommendation",
      recommendationId: id("recommendation_001"),
    });
  });

  it("exposes state through getters only", () => {
    for (const property of [
      "ruleId",
      "ruleVersion",
      "policyId",
      "policyVersion",
      "enabled",
      "effectiveFrom",
      "effectiveTo",
      "priority",
      "planningPredicates",
      "predicate",
      "outputTemplate",
      "metadata",
    ]) {
      const descriptor = Object.getOwnPropertyDescriptor(
        ExecutionPlanningRule.prototype,
        property,
      );
      expect(descriptor?.get).toBeTypeOf("function");
      expect(descriptor?.set).toBeUndefined();
    }
  });

  it("deeply freezes predicate, output, bindings, dependencies, and metadata", () => {
    const rule = createRule();
    const namedBinding = rule.outputTemplate.workPackages[1]!
      .recommendationBinding;

    for (const value of [
      rule.predicate,
      rule.predicate.recommendationRuleIds,
      rule.outputTemplate,
      rule.outputTemplate.workPackages,
      rule.outputTemplate.workPackages[0],
      rule.outputTemplate.workPackages[0]!.entryCriteria,
      namedBinding,
      rule.outputTemplate.dependencies,
      rule.outputTemplate.dependencies[0],
      rule.metadata,
      rule.metadata.audit,
    ]) {
      expect(Object.isFrozen(value)).toBe(true);
    }
  });

  it("defensively copies every mutable constructor input", () => {
    const sourcePredicate = predicate();
    const sourceOutput = outputTemplate();
    const sourceMetadata = metadata();
    const rule = createRule({
      predicate: sourcePredicate,
      outputTemplate: sourceOutput,
      metadata: sourceMetadata,
    });

    (sourcePredicate.recommendationRuleIds as string[])[0] = "CHANGED";
    (sourceOutput.workPackages as ExecutionPlanningWorkPackageTemplate[])[0] = {
      ...sourceOutput.workPackages[0]!,
      objective: "Changed",
    };
    (sourceOutput.executionAssumptions as string[])[0] = "Changed";
    (sourceMetadata.audit as { approvedBy: string }).approvedBy = "changed";

    expect(rule.predicate.recommendationRuleIds).toEqual([
      "RECOMMEND-A",
      "RECOMMEND-B",
    ]);
    expect(rule.outputTemplate.workPackages[0]!.objective).toBe(
      "Resolve the documented customer constraint",
    );
    expect(rule.outputTemplate.executionAssumptions).toEqual([
      "Contact details remain current",
    ]);
    expect(rule.metadata).toEqual({
      audit: { approvedBy: "planning-policy-board" },
      tags: ["planning", "released"],
    });
  });

  it("serializes deterministically with immutable canonical data", () => {
    const first = createRule().toJSON();
    const second = createRule({
      predicate: {
        ...predicate(),
        recommendationRuleIds: ["RECOMMEND-A", "RECOMMEND-B"],
        recommendationRuleVersions: ["1.0.0", "2.0.0"],
      },
      outputTemplate: {
        ...outputTemplate(),
        workPackages: [...workPackages()].reverse(),
        requiredCapabilities: ["customer-contact", "invoice-review"],
        requiredResources: ["customer-record", "invoice-record"],
      },
    }).toJSON();

    expect(first).toEqual(second);
    expect(JSON.stringify(first)).toBe(JSON.stringify(second));
    expect(first.outputTemplate.workPackages[1]!.recommendationBinding).toEqual(
      {
        kind: "recommendation",
        recommendationId: "recommendation_001",
      },
    );
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.outputTemplate.workPackages[0])).toBe(true);
  });

  it("rejects unknown predicate fields", () => {
    expect(() =>
      createRule({
        predicate: {
          ...predicate(),
          arbitraryExpression: "x > 1",
        } as unknown as ExecutionPlanningPredicate,
      }),
    ).toThrow("predicate field arbitraryExpression is not supported");
  });

  it("rejects empty predicate filters and invalid shared constraints", () => {
    expect(() =>
      createRule({
        predicate: { ...predicate(), recommendationRuleIds: [] },
      }),
    ).toThrow("recommendation rule identifiers");
    expect(() =>
      createRule({
        predicate: {
          ...predicate(),
          requireSharedTrace: "yes" as unknown as boolean,
        },
      }),
    ).toThrow("shared-trace requirement must be a boolean");
  });

  it("rejects invalid recommendation-count predicates", () => {
    expect(() =>
      createRule({
        predicate: {
          ...predicate(),
          requiredRecommendationCount: 2,
          minimumRecommendationCount: 1,
        },
      }),
    ).toThrow("cannot be combined");
    expect(() =>
      createRule({
        predicate: {
          ...predicate(),
          minimumRecommendationCount: 4,
          maximumRecommendationCount: 3,
        },
      }),
    ).toThrow("cannot exceed maximum");
    expect(() =>
      createRule({
        predicate: { ...predicate(), minimumRecommendationCount: 0 },
      }),
    ).toThrow("positive safe integer");
  });

  it("rejects empty required output-template fields", () => {
    expect(() =>
      createRule({
        outputTemplate: { ...outputTemplate(), riskControls: [] },
      }),
    ).toThrow("output risk controls");

    const packages = workPackages();
    packages[0] = { ...packages[0]!, validationCheckpoints: [] };
    expect(() =>
      createRule({
        outputTemplate: { ...outputTemplate(), workPackages: packages },
      }),
    ).toThrow("work-package validation checkpoints");
  });

  it("rejects duplicate work-package template identifiers", () => {
    const packages = workPackages();
    packages[1] = {
      ...packages[1]!,
      templateId: "CONTACT-CUSTOMER",
    };

    expect(() =>
      createRule({
        outputTemplate: { ...outputTemplate(), workPackages: packages },
      }),
    ).toThrow("template identifiers cannot be duplicated");
  });

  it("rejects invalid recommendation bindings", () => {
    const packages = workPackages();
    packages[0] = {
      ...packages[0]!,
      recommendationBinding: {
        kind: "each",
      } as unknown as ExecutionPlanningWorkPackageTemplate["recommendationBinding"],
    };
    expect(() =>
      createRule({
        outputTemplate: { ...outputTemplate(), workPackages: packages },
      }),
    ).toThrow("recommendation binding is not supported");

    packages[0] = {
      ...workPackages()[0]!,
      recommendationBinding: {
        kind: "recommendation",
        recommendationId: "recommendation_001",
      } as unknown as ExecutionPlanningWorkPackageTemplate["recommendationBinding"],
    };
    expect(() =>
      createRule({
        outputTemplate: { ...outputTemplate(), workPackages: packages },
      }),
    ).toThrow("recommendation binding is not supported");
  });

  it("rejects unknown, self, duplicate, and cyclic dependencies", () => {
    expect(() =>
      createRule({
        outputTemplate: {
          ...outputTemplate(),
          dependencies: [
            {
              predecessorTemplateId: "UNKNOWN",
              successorTemplateId: "CONTACT-CUSTOMER",
            },
          ],
        },
      }),
    ).toThrow("unknown work-package template");
    expect(() =>
      createRule({
        outputTemplate: {
          ...outputTemplate(),
          dependencies: [
            {
              predecessorTemplateId: "VERIFY-INVOICE",
              successorTemplateId: "VERIFY-INVOICE",
            },
          ],
        },
      }),
    ).toThrow("cannot depend on itself");

    const edge = outputTemplate().dependencies[0]!;
    expect(() =>
      createRule({
        outputTemplate: {
          ...outputTemplate(),
          dependencies: [edge, { ...edge }],
        },
      }),
    ).toThrow("duplicate edges");
    expect(() =>
      createRule({
        outputTemplate: {
          ...outputTemplate(),
          dependencies: [
            edge,
            {
              predecessorTemplateId: "CONTACT-CUSTOMER",
              successorTemplateId: "VERIFY-INVOICE",
            },
          ],
        },
      }),
    ).toThrow("cannot contain a cycle");
  });

  it("rejects inconsistent capability and resource declarations", () => {
    expect(() =>
      createRule({
        outputTemplate: {
          ...outputTemplate(),
          requiredCapabilities: ["invoice-review"],
        },
      }),
    ).toThrow("required capabilities must match");
    expect(() =>
      createRule({
        outputTemplate: {
          ...outputTemplate(),
          requiredResources: ["invoice-record"],
        },
      }),
    ).toThrow("required resources must match");
  });

  it("rejects template interpolation", () => {
    const packages = workPackages();
    packages[0] = {
      ...packages[0]!,
      objective: "Contact {{recommendation.objective}}",
    };
    expect(() =>
      createRule({
        outputTemplate: { ...outputTemplate(), workPackages: packages },
      }),
    ).toThrow("cannot contain template placeholders");
  });

  it("rejects invalid effective periods and permits an open-ended rule", () => {
    expect(() => createRule({ effectiveFrom: "not-a-date" })).toThrow(
      "effective-from date",
    );
    expect(() =>
      createRule({
        effectiveFrom: "2026-07-22T12:00:00Z",
        effectiveTo: "2026-07-22T11:59:59Z",
      }),
    ).toThrow("effective-to date cannot precede");
    expect(createRule({ effectiveTo: undefined }).effectiveTo).toBeUndefined();
  });

  it("rejects executable or nondeterministic metadata", () => {
    expect(() =>
      createRule({
        metadata: { evaluate: () => true } as unknown as DeclarativeRuleRecord,
      }),
    ).toThrow("cannot contain functions");
    expect(() =>
      createRule({ metadata: { weight: Number.NaN } }),
    ).toThrow("deterministic data");
  });

  it("contains no predicate execution, engine, persistence, or AI behavior", () => {
    const rule = createRule() as unknown as Record<string, unknown>;

    for (const prohibited of [
      "evaluate",
      "execute",
      "matches",
      "save",
      "repository",
      "invokeAI",
      "schedule",
    ]) {
      expect(prohibited in rule).toBe(false);
    }
  });
});
