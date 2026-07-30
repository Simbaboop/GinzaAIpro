import { describe, expect, it, vi } from "vitest";
import * as domain from "../src/index.js";
import {
  ExecutionPlan,
  Identifier,
  RuntimeAdmission,
  RuntimeAdmissionError,
  type CreateRuntimeAdmissionInput,
  type ExecutionPlanInput,
  type ExecutionPlanWorkPackage,
  type RuntimeAdmissionFailureCode,
} from "../src/index.js";

const id = (value: string): Identifier => new Identifier(value);

const workPackages = (): ExecutionPlanWorkPackage[] => [
  {
    workPackageId: id("work_package_b"),
    sourceRecommendationIds: [id("recommendation_b")],
    traceIds: [id("trace_b")],
    objective: "Contact the customer",
    intervention: "Use the approved contact channel",
    entryCriteria: ["Invoice state is verified"],
    exitCriteria: ["Customer response is recorded"],
    requiredCapabilities: ["customer-contact"],
    requiredResources: ["customer-record"],
    executionConstraints: ["Preserve consent"],
    validationCheckpoints: ["Channel is approved"],
    completionCriteria: ["Response is documented"],
    dependencyReferences: [id("work_package_a")],
    rollbackConsiderations: ["Stop if consent is withdrawn"],
  },
  {
    workPackageId: id("work_package_a"),
    sourceRecommendationIds: [id("recommendation_a")],
    traceIds: [id("trace_a")],
    objective: "Verify the invoice",
    intervention: "Review the canonical invoice record",
    entryCriteria: ["Invoice record is available"],
    exitCriteria: ["Invoice state is confirmed"],
    requiredCapabilities: ["invoice-review"],
    requiredResources: ["invoice-record"],
    executionConstraints: ["Use released data"],
    validationCheckpoints: ["Invoice identity is confirmed"],
    completionCriteria: ["Invoice state is documented"],
    dependencyReferences: [],
    rollbackConsiderations: ["Preserve the original record"],
  },
];

const planInput = (
  overrides: Partial<ExecutionPlanInput> = {},
): ExecutionPlanInput => ({
  organizationId: id("organization_001"),
  sourceRecommendationIds: [id("recommendation_b"), id("recommendation_a")],
  traceIds: [id("trace_b"), id("trace_a")],
  recommendationProvenance: [
    {
      recommendationId: id("recommendation_b"),
      organizationId: id("organization_001"),
      traceId: id("trace_b"),
      recommendationSchemaVersion: "1.0.0",
      ruleId: "RECOMMEND-B",
      ruleVersion: "1.0.0",
      policyId: "recommendation-policy",
      policyVersion: "1.0.0",
    },
    {
      recommendationId: id("recommendation_a"),
      organizationId: id("organization_001"),
      traceId: id("trace_a"),
      recommendationSchemaVersion: "1.0.0",
      ruleId: "RECOMMEND-A",
      ruleVersion: "1.0.0",
      policyId: "recommendation-policy",
      policyVersion: "1.0.0",
    },
  ],
  planningPolicyId: "execution-planning-policy",
  planningPolicyVersion: "2026.07",
  planningRuleProvenance: [
    { ruleId: "PLAN-B", ruleVersion: "2.0.0" },
    { ruleId: "PLAN-A", ruleVersion: "1.0.0" },
  ],
  workPackages: workPackages(),
  dependencyGraph: [
    {
      predecessorWorkPackageId: id("work_package_a"),
      successorWorkPackageId: id("work_package_b"),
    },
  ],
  requiredCapabilities: ["customer-contact", "invoice-review"],
  requiredResources: ["customer-record", "invoice-record"],
  executionAssumptions: ["Customer details remain current"],
  executionConstraints: ["Preserve customer consent"],
  admissibilityChecks: ["Recommendations remain admissible"],
  riskControls: ["Stop on a consent conflict"],
  approvalGates: ["Planning policy is released"],
  rollbackConsiderations: ["Preserve the original record"],
  completionCriteria: ["Every package meets its exit criteria"],
  successCriteria: ["Invoice disposition improves"],
  createdAt: "2026-07-22T13:00:00.000Z",
  schemaVersion: "execution-plan:v1",
  ...overrides,
});

const createPlan = (): ExecutionPlan => new ExecutionPlan(planInput());

const validInput = (
  overrides: Partial<CreateRuntimeAdmissionInput> = {},
): CreateRuntimeAdmissionInput => {
  const executionPlan = overrides.executionPlan ?? createPlan();
  return {
    executionPlan,
    workPackageIds:
      overrides.workPackageIds ??
      [
        executionPlan.workPackages[1]!.workPackageId,
        executionPlan.workPackages[0]!.workPackageId,
      ],
    admissionOrdinal: 1,
    admittedBy: {
      actorType: "HUMAN",
      actorId: "human:user-123",
    },
    admittedAt: "2026-07-22T09:42:31.125-04:00",
    admissionReason: {
      code: "APPROVED_FOR_RUNTIME",
      message: "The governed work packages are approved for runtime.",
    },
    admissionProvenance: {
      admissionPolicyId: "runtime-admission-policy",
      admissionPolicyVersion: "1.0.0",
      admissionSchemaVersion: "runtime-admission:v1",
    },
    ...overrides,
  };
};

const planWith = (
  plan: ExecutionPlan,
  overrides: Readonly<Record<string, unknown>>,
): ExecutionPlan =>
  new Proxy(plan, {
    get(target, property) {
      if (
        typeof property === "string" &&
        Object.prototype.hasOwnProperty.call(overrides, property)
      ) {
        return overrides[property];
      }
      return Reflect.get(target, property, target) as unknown;
    },
  });

const expectFailure = async (
  input: CreateRuntimeAdmissionInput,
  code: RuntimeAdmissionFailureCode,
): Promise<RuntimeAdmissionError> => {
  try {
    await RuntimeAdmission.create(input);
    throw new Error("Expected RuntimeAdmission creation to fail.");
  } catch (error) {
    expect(error).toBeInstanceOf(RuntimeAdmissionError);
    const governed = error as RuntimeAdmissionError;
    expect(governed.code).toBe(code);
    expect(Object.isFrozen(governed)).toBe(true);
    expect(Object.isFrozen(governed.details)).toBe(true);
    return governed;
  }
};

describe("RuntimeAdmission construction and preservation", () => {
  it("constructs one immutable admission from a released ExecutionPlan", async () => {
    const admission = await RuntimeAdmission.create(validInput());

    expect(admission).toBeInstanceOf(RuntimeAdmission);
    expect(Object.isFrozen(admission)).toBe(true);
    expect(admission.runtimeAdmissionId).toBe(admission.id);
    expect(admission.decision).toBe("ADMITTED");
    expect(admission.version).toBe("1.0.0");
    expect(admission.schemaVersion).toBe("runtime-admission:v1");
    expect(admission.runtimeAdmissionId.value).toMatch(
      /^runtime-admission:v1:[0-9a-f]{64}$/u,
    );
  });

  it("derives and preserves every canonical planning field", async () => {
    const plan = createPlan();
    const admission = await RuntimeAdmission.create(
      validInput({ executionPlan: plan }),
    );

    expect(admission.executionPlanId).toBe(plan.planId);
    expect(admission.organizationId).toBe(plan.organizationId);
    expect(admission.executionPlanSchemaVersion).toBe(plan.schemaVersion);
    expect(admission.admittedWorkPackages.map(({ workPackageId }) => workPackageId))
      .toEqual(plan.workPackages.map(({ workPackageId }) => workPackageId));
    expect(admission.traceIds.map(({ value }) => value)).toEqual([
      "trace_a",
      "trace_b",
    ]);
    expect(admission.planningRuleProvenance).toEqual([
      { ruleId: "PLAN-A", ruleVersion: "1.0.0" },
      { ruleId: "PLAN-B", ruleVersion: "2.0.0" },
    ]);
    expect(admission.planningPolicyProvenance).toEqual({
      planningPolicyId: "execution-planning-policy",
      planningPolicyVersion: "2026.07",
    });
  });

  it("admits a deterministic partial work-package selection", async () => {
    const plan = createPlan();
    const selected = plan.workPackages[1]!;
    const admission = await RuntimeAdmission.create(
      validInput({ executionPlan: plan, workPackageIds: [selected.workPackageId] }),
    );

    expect(admission.admittedWorkPackages).toHaveLength(1);
    expect(admission.admittedWorkPackages[0]!.workPackageId).toBe(
      selected.workPackageId,
    );
    expect(admission.admittedWorkPackages[0]!.recommendationIds).toEqual(
      selected.sourceRecommendationIds,
    );
    expect(admission.admittedWorkPackages[0]!.traceIds).toEqual(
      selected.traceIds,
    );
    expect(admission.traceIds).toEqual(selected.traceIds);
  });

  it("normalizes authorized Unicode text and timestamp inputs", async () => {
    const admission = await RuntimeAdmission.create(
      validInput({
        admittedBy: { actorType: "SERVICE", actorId: "cafe\u0301-service" },
        admittedAt: "2026-07-22T09:42:31.1-04:00",
        admissionReason: {
          code: "CAFE\u0301_APPROVAL",
          message: "Cafe\u0301 approval recorded.",
        },
        admissionProvenance: {
          admissionPolicyId: "cafe\u0301-policy",
          admissionPolicyVersion: "1.0.0",
          admissionSchemaVersion: "runtime-admission:v1",
        },
      }),
    );

    expect(admission.admittedBy.actorId).toBe("café-service");
    expect(admission.admissionReason.code).toBe("CAFÉ_APPROVAL");
    expect(admission.admissionProvenance.admissionPolicyId).toBe("café-policy");
    expect(admission.admittedAt).toBe("2026-07-22T13:42:31.100Z");
  });

  it.each(["HUMAN", "SYSTEM", "SERVICE", "GOVERNED_AUTOMATION"] as const)(
    "supports the closed %s admission actor type",
    async (actorType) => {
      const admission = await RuntimeAdmission.create(
        validInput({ admittedBy: { actorType, actorId: "stable-actor" } }),
      );
      expect(admission.admittedBy.actorType).toBe(actorType);
    },
  );

  it("does not expose execution or mutable lifecycle behavior", async () => {
    const admission = await RuntimeAdmission.create(validInput());
    const runtimeSurface = admission as unknown as Record<string, unknown>;

    for (const name of [
      "execute",
      "schedule",
      "assign",
      "retry",
      "revoke",
      "cancel",
      "publish",
      "persist",
      "setStatus",
    ]) {
      expect(runtimeSurface[name]).toBeUndefined();
    }
  });
});

describe("RuntimeAdmission determinism and serialization", () => {
  it("produces equal identity and serialization for equivalent canonical input", async () => {
    const left = await RuntimeAdmission.create(validInput());
    const right = await RuntimeAdmission.create(validInput());

    expect(left.runtimeAdmissionId.value).toBe(right.runtimeAdmissionId.value);
    expect(left.equals(right)).toBe(true);
    expect(left.serialize()).toBe(right.serialize());
    expect(left.serialize()).toBe(left.serialize());
  });

  it("makes caller work-package order semantically irrelevant", async () => {
    const plan = createPlan();
    const canonical = plan.workPackages.map(({ workPackageId }) => workPackageId);
    const reversed = [...canonical].reverse();

    const left = await RuntimeAdmission.create(
      validInput({ executionPlan: plan, workPackageIds: canonical }),
    );
    const right = await RuntimeAdmission.create(
      validInput({ executionPlan: plan, workPackageIds: reversed }),
    );

    expect(left.runtimeAdmissionId.value).toBe(right.runtimeAdmissionId.value);
    expect(left.toJSON()).toEqual(right.toJSON());
  });

  it("changes identity for every materially different admission input", async () => {
    const baseline = await RuntimeAdmission.create(validInput());
    const plan = createPlan();
    const variants = [
      validInput({ admissionOrdinal: 2 }),
      validInput({
        executionPlan: plan,
        workPackageIds: [plan.workPackages[0]!.workPackageId],
      }),
      validInput({ admittedBy: { actorType: "SYSTEM", actorId: "system-a" } }),
      validInput({ admittedAt: "2026-07-22T13:42:32.125Z" }),
      validInput({
        admissionReason: { code: "DIFFERENT", message: "A different reason." },
      }),
      validInput({
        admissionProvenance: {
          admissionPolicyId: "different-policy",
          admissionPolicyVersion: "1.0.0",
          admissionSchemaVersion: "runtime-admission:v1",
        },
      }),
    ];

    for (const input of variants) {
      const variant = await RuntimeAdmission.create(input);
      expect(variant.runtimeAdmissionId.value).not.toBe(
        baseline.runtimeAdmissionId.value,
      );
      expect(variant.equals(baseline)).toBe(false);
    }
  });

  it("serializes fields and nested records in the normative order", async () => {
    const serialized = (await RuntimeAdmission.create(validInput())).toJSON();

    expect(Object.keys(serialized)).toEqual([
      "runtimeAdmissionId",
      "admissionOrdinal",
      "organizationId",
      "executionPlanId",
      "admittedWorkPackages",
      "traceIds",
      "planningRuleProvenance",
      "planningPolicyProvenance",
      "executionPlanSchemaVersion",
      "decision",
      "admissionReason",
      "admittedBy",
      "admittedAt",
      "admissionProvenance",
      "version",
      "schemaVersion",
    ]);
    expect(Object.keys(serialized.admittedWorkPackages[0]!)).toEqual([
      "workPackageId",
      "recommendationIds",
      "traceIds",
    ]);
    expect(Object.keys(serialized.admissionReason)).toEqual(["code", "message"]);
    expect(Object.keys(serialized.admittedBy)).toEqual(["actorType", "actorId"]);
    expect(Object.keys(serialized.admissionProvenance)).toEqual([
      "admissionPolicyId",
      "admissionPolicyVersion",
      "admissionSchemaVersion",
    ]);
    expect(serialized).not.toHaveProperty("undefined");
    const canonicalJson = (await RuntimeAdmission.create(validInput())).serialize();
    expect(canonicalJson).not.toMatch(/[\n\r\t]/u);
    expect(canonicalJson).not.toContain(": ");
    expect(canonicalJson).not.toContain(", ");
  });

  it("uses UTF-8 length framing so ambiguous component concatenations differ", async () => {
    const left = await RuntimeAdmission.create(
      validInput({ admittedBy: { actorType: "SERVICE", actorId: "ab" } }),
    );
    const right = await RuntimeAdmission.create(
      validInput({ admittedBy: { actorType: "SERVICE", actorId: "a" } }),
    );

    expect(left.runtimeAdmissionId.value).not.toBe(right.runtimeAdmissionId.value);
  });
});

describe("RuntimeAdmission deep immutability", () => {
  it("deeply freezes every returned nested structure", async () => {
    const admission = await RuntimeAdmission.create(validInput());
    const serialized = admission.toJSON();

    for (const value of [
      admission.admittedWorkPackages,
      admission.admittedWorkPackages[0],
      admission.admittedWorkPackages[0]!.recommendationIds,
      admission.admittedWorkPackages[0]!.traceIds,
      admission.traceIds,
      admission.planningRuleProvenance,
      admission.planningRuleProvenance[0],
      admission.planningPolicyProvenance,
      admission.admissionReason,
      admission.admittedBy,
      admission.admissionProvenance,
      serialized,
      serialized.admittedWorkPackages,
      serialized.admittedWorkPackages[0],
      serialized.traceIds,
      serialized.planningRuleProvenance,
      serialized.planningPolicyProvenance,
      serialized.admissionReason,
      serialized.admittedBy,
      serialized.admissionProvenance,
    ]) {
      expect(Object.isFrozen(value)).toBe(true);
    }
  });

  it("defensively copies caller-owned objects and arrays", async () => {
    const plan = createPlan();
    const workPackageIds = plan.workPackages.map(({ workPackageId }) => workPackageId);
    const admittedBy = { actorType: "HUMAN" as const, actorId: "human:original" };
    const admissionReason = { code: "ORIGINAL", message: "Original reason." };
    const admissionProvenance = {
      admissionPolicyId: "original-policy",
      admissionPolicyVersion: "1.0.0",
      admissionSchemaVersion: "runtime-admission:v1" as const,
    };
    const admission = await RuntimeAdmission.create(
      validInput({
        executionPlan: plan,
        workPackageIds,
        admittedBy,
        admissionReason,
        admissionProvenance,
      }),
    );

    workPackageIds.reverse();
    admittedBy.actorId = "human:mutated";
    admissionReason.code = "MUTATED";
    admissionProvenance.admissionPolicyId = "mutated-policy";

    expect(admission.admittedWorkPackages.map(({ workPackageId }) => workPackageId.value))
      .toEqual(["work_package_a", "work_package_b"]);
    expect(admission.admittedBy.actorId).toBe("human:original");
    expect(admission.admissionReason.code).toBe("ORIGINAL");
    expect(admission.admissionProvenance.admissionPolicyId).toBe(
      "original-policy",
    );
  });

  it("keeps internal state unchanged when serialized copies are challenged", async () => {
    const admission = await RuntimeAdmission.create(validInput());
    const first = admission.toJSON();

    expect(() => {
      (first.traceIds as string[]).push("trace_mutated");
    }).toThrow();
    expect(admission.toJSON().traceIds).toEqual(["trace_a", "trace_b"]);
  });
});

describe("RuntimeAdmission governed failures", () => {
  it("rejects an invalid input container first", async () => {
    await expectFailure(
      null as unknown as CreateRuntimeAdmissionInput,
      "INVALID_RUNTIME_ADMISSION_INPUT",
    );
  });

  it("rejects a missing ExecutionPlan before all downstream defects", async () => {
    await expectFailure(
      validInput({
        executionPlan: undefined as unknown as ExecutionPlan,
        workPackageIds: [],
        admissionOrdinal: 0,
      }),
      "MISSING_EXECUTION_PLAN",
    );
  });

  it("rejects invalid ExecutionPlan identity", async () => {
    const plan = planWith(createPlan(), { planId: "not-an-identifier" });
    await expectFailure(
      validInput({ executionPlan: plan }),
      "INVALID_EXECUTION_PLAN_ID",
    );
  });

  it("rejects invalid ExecutionPlan organization", async () => {
    const plan = planWith(createPlan(), { organizationId: "invalid" });
    await expectFailure(
      validInput({ executionPlan: plan }),
      "INVALID_EXECUTION_PLAN_ORGANIZATION",
    );
  });

  it("rejects invalid ExecutionPlan schema version", async () => {
    const plan = planWith(createPlan(), { schemaVersion: "" });
    await expectFailure(
      validInput({ executionPlan: plan }),
      "INVALID_EXECUTION_PLAN_SCHEMA_VERSION",
    );
  });

  it("rejects missing work-package identifiers before ordinal validation", async () => {
    await expectFailure(
      validInput({ workPackageIds: [], admissionOrdinal: 0 }),
      "MISSING_WORK_PACKAGE_IDS",
    );
  });

  it("rejects invalid work-package identifiers in caller index order", async () => {
    const error = await expectFailure(
      validInput({ workPackageIds: ["invalid" as unknown as Identifier] }),
      "INVALID_WORK_PACKAGE_ID",
    );
    expect(error.details).toEqual({ index: 0 });
  });

  it("rejects duplicate requested work-package identifiers", async () => {
    const workPackageId = createPlan().workPackages[0]!.workPackageId;
    await expectFailure(
      validInput({ workPackageIds: [workPackageId, workPackageId] }),
      "DUPLICATE_WORK_PACKAGE_ID",
    );
  });

  it("rejects a work package not found in the plan", async () => {
    await expectFailure(
      validInput({ workPackageIds: [id("unknown_work_package")] }),
      "WORK_PACKAGE_NOT_FOUND",
    );
  });

  it("rejects invalid work-package recommendation binding", async () => {
    const plan = createPlan();
    const invalidPackage = {
      ...plan.workPackages[0]!,
      sourceRecommendationIds: [],
    };
    const invalidPlan = planWith(plan, {
      workPackages: [invalidPackage, plan.workPackages[1]!],
    });
    await expectFailure(
      validInput({
        executionPlan: invalidPlan,
        workPackageIds: [invalidPackage.workPackageId],
      }),
      "INVALID_WORK_PACKAGE_RECOMMENDATION_BINDING",
    );
  });

  it("rejects invalid work-package trace binding", async () => {
    const plan = createPlan();
    const invalidPackage = {
      ...plan.workPackages[0]!,
      traceIds: ["invalid" as unknown as Identifier],
    };
    const invalidPlan = planWith(plan, { workPackages: [invalidPackage] });
    await expectFailure(
      validInput({
        executionPlan: invalidPlan,
        workPackageIds: [invalidPackage.workPackageId],
      }),
      "INVALID_WORK_PACKAGE_TRACE_BINDING",
    );
  });

  it("rejects work-package traces absent from the plan trace set", async () => {
    const plan = createPlan();
    const invalidPackage = {
      ...plan.workPackages[0]!,
      traceIds: [id("trace_outside_plan")],
    };
    const invalidPlan = planWith(plan, { workPackages: [invalidPackage] });
    await expectFailure(
      validInput({
        executionPlan: invalidPlan,
        workPackageIds: [invalidPackage.workPackageId],
      }),
      "WORK_PACKAGE_TRACE_NOT_IN_EXECUTION_PLAN",
    );
  });

  it("rejects an empty admission trace set", async () => {
    const plan = createPlan();
    const invalidPackage = { ...plan.workPackages[0]!, traceIds: [] };
    const invalidPlan = planWith(plan, { workPackages: [invalidPackage] });
    await expectFailure(
      validInput({
        executionPlan: invalidPlan,
        workPackageIds: [invalidPackage.workPackageId],
      }),
      "INVALID_ADMISSION_TRACE_SET",
    );
  });

  it("rejects invalid planning-rule provenance", async () => {
    const plan = planWith(createPlan(), { planningRuleProvenance: [] });
    await expectFailure(
      validInput({ executionPlan: plan }),
      "INVALID_PLANNING_RULE_PROVENANCE",
    );
  });

  it("rejects invalid planning-policy provenance", async () => {
    const plan = planWith(createPlan(), { planningPolicyId: "" });
    await expectFailure(
      validInput({ executionPlan: plan }),
      "INVALID_PLANNING_POLICY_PROVENANCE",
    );
  });

  it.each([0, -1, 1.5, Number.NaN, Number.POSITIVE_INFINITY, Number.MAX_SAFE_INTEGER + 1])(
    "rejects invalid admission ordinal %s",
    async (admissionOrdinal) => {
      await expectFailure(
        validInput({ admissionOrdinal }),
        "INVALID_ADMISSION_ORDINAL",
      );
    },
  );

  it("rejects unsupported admission actor type before actor identity", async () => {
    await expectFailure(
      validInput({
        admittedBy: {
          actorType: "UNKNOWN" as "HUMAN",
          actorId: "",
        },
      }),
      "INVALID_RUNTIME_ADMISSION_ACTOR_TYPE",
    );
  });

  it.each(["", " actor ", "a".repeat(257)])(
    "rejects invalid admission actor identity %s",
    async (actorId) => {
      await expectFailure(
        validInput({ admittedBy: { actorType: "HUMAN", actorId } }),
        "INVALID_RUNTIME_ADMISSION_ACTOR_ID",
      );
    },
  );

  it.each([
    "not-a-date",
    "2026-07-22T13:42:31.125",
    "2026-02-30T13:42:31.125Z",
    "2026-07-22T13:42:60.125Z",
    "2026-07-22T13:42:31.1234Z",
  ])("rejects invalid admission timestamp %s", async (admittedAt) => {
    await expectFailure(
      validInput({ admittedAt }),
      "INVALID_ADMISSION_TIMESTAMP",
    );
  });

  it("does not reject a future timestamp using the host clock", async () => {
    const admission = await RuntimeAdmission.create(
      validInput({ admittedAt: "9999-12-31T23:59:59.999Z" }),
    );
    expect(admission.admittedAt).toBe("9999-12-31T23:59:59.999Z");
  });

  it.each(["", " CODE ", "a".repeat(257)])(
    "rejects invalid admission reason code %s",
    async (code) => {
      await expectFailure(
        validInput({ admissionReason: { code, message: "Valid message." } }),
        "INVALID_ADMISSION_REASON_CODE",
      );
    },
  );

  it.each(["", " message ", "a".repeat(4097)])(
    "rejects invalid admission reason message %s",
    async (message) => {
      await expectFailure(
        validInput({ admissionReason: { code: "VALID", message } }),
        "INVALID_ADMISSION_REASON_MESSAGE",
      );
    },
  );

  it.each(["", " policy ", "a".repeat(257)])(
    "rejects invalid admission policy identifier %s",
    async (admissionPolicyId) => {
      await expectFailure(
        validInput({
          admissionProvenance: {
            admissionPolicyId,
            admissionPolicyVersion: "1.0.0",
            admissionSchemaVersion: "runtime-admission:v1",
          },
        }),
        "INVALID_ADMISSION_POLICY_ID",
      );
    },
  );

  it.each(["", " version ", "a".repeat(129)])(
    "rejects invalid admission policy version %s",
    async (admissionPolicyVersion) => {
      await expectFailure(
        validInput({
          admissionProvenance: {
            admissionPolicyId: "valid-policy",
            admissionPolicyVersion,
            admissionSchemaVersion: "runtime-admission:v1",
          },
        }),
        "INVALID_ADMISSION_POLICY_VERSION",
      );
    },
  );

  it("rejects an invalid admission schema literal", async () => {
    await expectFailure(
      validInput({
        admissionProvenance: {
          admissionPolicyId: "valid-policy",
          admissionPolicyVersion: "1.0.0",
          admissionSchemaVersion: "invalid" as "runtime-admission:v1",
        },
      }),
      "INVALID_ADMISSION_SCHEMA_VERSION",
    );
  });

  it("maps cryptographic failure to governed identity failure", async () => {
    const digest = vi
      .spyOn(globalThis.crypto.subtle, "digest")
      .mockRejectedValueOnce(new Error("blocked"));
    await expectFailure(
      validInput(),
      "RUNTIME_ADMISSION_IDENTITY_DERIVATION_FAILED",
    );
    digest.mockRestore();
  });

  it("maps canonical JSON failure to governed serialization failure", async () => {
    const input = validInput();
    const stringify = vi
      .spyOn(JSON, "stringify")
      .mockImplementationOnce(() => {
        throw new Error("blocked");
      });
    await expectFailure(
      input,
      "RUNTIME_ADMISSION_SERIALIZATION_FAILED",
    );
    stringify.mockRestore();
  });
});

describe("RuntimeAdmission package API", () => {
  it("exports the canonical contract and error without internal helpers", () => {
    expect(domain.RuntimeAdmission).toBe(RuntimeAdmission);
    expect(domain.RuntimeAdmissionError).toBe(RuntimeAdmissionError);
    const surface = domain as unknown as Record<string, unknown>;
    expect(surface.stringifyCanonical).toBeUndefined();
    expect(surface.normalizeRuntimeAdmission).toBeUndefined();
    expect(surface.createRuntimeAdmissionId).toBeUndefined();
  });
});
