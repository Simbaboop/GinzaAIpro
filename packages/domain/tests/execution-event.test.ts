import { describe, expect, it, vi } from "vitest";
import * as domain from "../src/index.js";
import {
  ExecutionEvent,
  ExecutionEventError,
  ExecutionPlan,
  Identifier,
  RuntimeAdmission,
  type CreateRuntimeAdmissionInput,
  type ExecutionEventFailureCode,
  type ExecutionEventInput,
  type ExecutionEventProvenance,
  type ExecutionPlanInput,
  type ExecutionPlanWorkPackage,
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

const createPlan = (
  overrides: Partial<ExecutionPlanInput> = {},
): ExecutionPlan => new ExecutionPlan(planInput(overrides));

const admissionInput = (
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

const createAdmission = async (
  overrides: Partial<CreateRuntimeAdmissionInput> = {},
): Promise<RuntimeAdmission> =>
  RuntimeAdmission.create(admissionInput(overrides));

const eventInput = async (
  overrides: Partial<ExecutionEventInput> = {},
): Promise<ExecutionEventInput> => {
  const runtimeAdmission =
    overrides.runtimeAdmission ?? (await createAdmission());
  return {
    runtimeAdmission,
    workPackageId:
      overrides.workPackageId ??
      runtimeAdmission.admittedWorkPackages[0]!.workPackageId,
    occurredAt: "2026-07-22T09:45:00.25-04:00",
    eventProvenance: {
      recorderType: "SERVICE",
      recorderId: "service:execution-recorder",
    },
    ...overrides,
  };
};

const admissionWith = (
  admission: RuntimeAdmission,
  overrides: Readonly<Record<string, unknown>>,
): RuntimeAdmission =>
  new Proxy(admission, {
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
  input: ExecutionEventInput,
  code: ExecutionEventFailureCode,
): Promise<ExecutionEventError> => {
  try {
    await ExecutionEvent.create(input);
    throw new Error("Expected ExecutionEvent creation to fail.");
  } catch (error) {
    expect(error).toBeInstanceOf(ExecutionEventError);
    const governed = error as ExecutionEventError;
    expect(governed.code).toBe(code);
    expect(Object.isFrozen(governed)).toBe(true);
    expect(Object.isFrozen(governed.details)).toBe(true);
    return governed;
  }
};

describe("ExecutionEvent construction and lineage", () => {
  it("constructs one immutable atomic execution occurrence", async () => {
    const event = await ExecutionEvent.create(await eventInput());

    expect(event).toBeInstanceOf(ExecutionEvent);
    expect(Object.isFrozen(event)).toBe(true);
    expect(event.executionEventId).toBe(event.id);
    expect(event.eventType).toBe("EXECUTION_OCCURRED");
    expect(event.version).toBe("1.0.0");
    expect(event.schemaVersion).toBe("execution-event:v1");
    expect(event.executionEventId.value).toMatch(
      /^execution-event:v1:[0-9a-f]{64}$/u,
    );
  });

  it("preserves the exact released RuntimeAdmission lineage", async () => {
    const admission = await createAdmission();
    const selected = admission.admittedWorkPackages[0]!;
    const event = await ExecutionEvent.create(
      await eventInput({
        runtimeAdmission: admission,
        workPackageId: selected.workPackageId,
      }),
    );

    expect(event.runtimeAdmissionId).toBe(admission.runtimeAdmissionId);
    expect(event.executionPlanId).toBe(admission.executionPlanId);
    expect(event.organizationId).toBe(admission.organizationId);
    expect(event.workPackageId).toBe(selected.workPackageId);
    expect(event.recommendationIds).toEqual(selected.recommendationIds);
    expect(event.traceIds).toEqual(selected.traceIds);
    expect(event.planningRuleProvenance).toEqual(
      admission.planningRuleProvenance,
    );
    expect(event.planningPolicyProvenance).toEqual(
      admission.planningPolicyProvenance,
    );
    expect(event.executionPlanSchemaVersion).toBe(
      admission.executionPlanSchemaVersion,
    );
    expect(event.runtimeAdmissionSchemaVersion).toBe(admission.schemaVersion);
    expect(event.admissionProvenance).toEqual(admission.admissionProvenance);
  });

  it("selects exactly one admitted work package", async () => {
    const admission = await createAdmission();
    const selected = admission.admittedWorkPackages[1]!;
    const event = await ExecutionEvent.create(
      await eventInput({
        runtimeAdmission: admission,
        workPackageId: selected.workPackageId,
      }),
    );

    expect(event.workPackageId).toBe(selected.workPackageId);
    expect(event.recommendationIds).toEqual(selected.recommendationIds);
    expect(event.traceIds).toEqual(selected.traceIds);
  });

  it("normalizes execution time and recorder identity canonically", async () => {
    const event = await ExecutionEvent.create(
      await eventInput({
        occurredAt: "2026-07-22T09:45:00.2-04:00",
        eventProvenance: {
          recorderType: "SERVICE",
          recorderId: "cafe\u0301-recorder",
        },
      }),
    );

    expect(event.occurredAt).toBe("2026-07-22T13:45:00.200Z");
    expect(event.eventProvenance).toEqual({
      recorderType: "SERVICE",
      recorderId: "caf\u00e9-recorder",
    });
  });

  it.each([
    "HUMAN",
    "SYSTEM",
    "SERVICE",
    "GOVERNED_AUTOMATION",
  ] as const)("accepts the closed %s recorder type", async (recorderType) => {
    const event = await ExecutionEvent.create(
      await eventInput({
        eventProvenance: { recorderType, recorderId: "stable-recorder" },
      }),
    );
    expect(event.eventProvenance.recorderType).toBe(recorderType);
  });

  it("exposes no execution, workflow, status, outcome, or evidence behavior", async () => {
    const surface = (await ExecutionEvent.create(
      await eventInput(),
    )) as unknown as Record<string, unknown>;
    for (const name of [
      "execute",
      "schedule",
      "enqueue",
      "retry",
      "orchestrate",
      "persist",
      "publish",
      "setStatus",
      "status",
      "outcome",
      "evidence",
      "recommendationQuality",
      "settle",
      "compensate",
    ]) {
      expect(surface[name]).toBeUndefined();
    }
  });
});

describe("ExecutionEvent deterministic identity and equality", () => {
  it("replays equivalent input to equal identity and serialization", async () => {
    const admission = await createAdmission();
    const input = await eventInput({ runtimeAdmission: admission });
    const left = await ExecutionEvent.create(input);
    const right = await ExecutionEvent.create(input);

    expect(left.executionEventId.value).toBe(right.executionEventId.value);
    expect(left.equals(right)).toBe(true);
    expect(left.serialize()).toBe(right.serialize());
  });

  it("normalizes equivalent timezone representations to equal events", async () => {
    const admission = await createAdmission();
    const left = await ExecutionEvent.create(
      await eventInput({
        runtimeAdmission: admission,
        occurredAt: "2026-07-22T09:45:00.250-04:00",
      }),
    );
    const right = await ExecutionEvent.create(
      await eventInput({
        runtimeAdmission: admission,
        occurredAt: "2026-07-22T13:45:00.250Z",
      }),
    );

    expect(left.occurredAt).toBe(right.occurredAt);
    expect(left.equals(right)).toBe(true);
    expect(left.serialize()).toBe(right.serialize());
  });

  it("ignores event-provenance source property insertion order", async () => {
    const admission = await createAdmission();
    const canonical: ExecutionEventProvenance = {
      recorderType: "SERVICE",
      recorderId: "service:execution-recorder",
    };
    const reversed = {
      recorderId: "service:execution-recorder",
      recorderType: "SERVICE" as const,
    };
    const left = await ExecutionEvent.create(
      await eventInput({ runtimeAdmission: admission, eventProvenance: canonical }),
    );
    const right = await ExecutionEvent.create(
      await eventInput({ runtimeAdmission: admission, eventProvenance: reversed }),
    );

    expect(left.equals(right)).toBe(true);
    expect(left.serialize()).toBe(right.serialize());
  });

  it("changes identity for every materially different event input", async () => {
    const admission = await createAdmission();
    const baseline = await ExecutionEvent.create(
      await eventInput({ runtimeAdmission: admission }),
    );
    const secondWorkPackage = admission.admittedWorkPackages[1]!.workPackageId;
    const differentAdmission = await createAdmission({ admissionOrdinal: 2 });
    const variants = [
      await eventInput({
        runtimeAdmission: admission,
        workPackageId: secondWorkPackage,
      }),
      await eventInput({
        runtimeAdmission: admission,
        occurredAt: "2026-07-22T13:45:01.250Z",
      }),
      await eventInput({
        runtimeAdmission: admission,
        eventProvenance: {
          recorderType: "SYSTEM",
          recorderId: "system:execution-recorder",
        },
      }),
      await eventInput({ runtimeAdmission: differentAdmission }),
    ];

    for (const input of variants) {
      const variant = await ExecutionEvent.create(input);
      expect(variant.executionEventId.value).not.toBe(
        baseline.executionEventId.value,
      );
      expect(variant.equals(baseline)).toBe(false);
    }
  });

  it("satisfies reflexive, symmetric, and transitive equality", async () => {
    const admission = await createAdmission();
    const input = await eventInput({ runtimeAdmission: admission });
    const first = await ExecutionEvent.create(input);
    const second = await ExecutionEvent.create(input);
    const third = await ExecutionEvent.create(input);

    expect(first.equals(first)).toBe(true);
    expect(first.equals(second)).toBe(second.equals(first));
    expect(first.equals(second)).toBe(true);
    expect(second.equals(third)).toBe(true);
    expect(first.equals(third)).toBe(true);
  });
});

describe("ExecutionEvent canonical serialization", () => {
  it("matches the fixed version 1 identity and serialization vector", async () => {
    const event = await ExecutionEvent.create(await eventInput());
    const digest = await globalThis.crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(event.serialize()),
    );
    const serializedDigest = Array.from(
      new Uint8Array(digest),
      (byte) => byte.toString(16).padStart(2, "0"),
    ).join("");

    expect(event.executionEventId.value).toBe(
      "execution-event:v1:55e01a6052bb97dcfb25a4a3831fe0c86c4b5b583666bac48cb0dbd8067bf9cb",
    );
    expect(serializedDigest).toBe(
      "95c7044850bfb4d60283a99f380fa1a091de70385411cb818c077b46781cc273",
    );
  });

  it("serializes the exact top-level and nested field order", async () => {
    const serialized = (await ExecutionEvent.create(await eventInput())).toJSON();

    expect(Object.keys(serialized)).toEqual([
      "executionEventId",
      "eventType",
      "runtimeAdmissionId",
      "executionPlanId",
      "organizationId",
      "workPackageId",
      "recommendationIds",
      "traceIds",
      "planningRuleProvenance",
      "planningPolicyProvenance",
      "executionPlanSchemaVersion",
      "runtimeAdmissionSchemaVersion",
      "admissionProvenance",
      "eventProvenance",
      "occurredAt",
      "version",
      "schemaVersion",
    ]);
    expect(Object.keys(serialized.planningRuleProvenance[0]!)).toEqual([
      "ruleId",
      "ruleVersion",
    ]);
    expect(Object.keys(serialized.planningPolicyProvenance)).toEqual([
      "planningPolicyId",
      "planningPolicyVersion",
    ]);
    expect(Object.keys(serialized.admissionProvenance)).toEqual([
      "admissionPolicyId",
      "admissionPolicyVersion",
      "admissionSchemaVersion",
    ]);
    expect(Object.keys(serialized.eventProvenance)).toEqual([
      "recorderType",
      "recorderId",
    ]);
  });

  it("emits compact stable JSON without null or omitted fields", async () => {
    const event = await ExecutionEvent.create(await eventInput());
    const canonical = event.serialize();

    expect(canonical).toBe(event.serialize());
    expect(canonical).toBe(JSON.stringify(event.toJSON()));
    expect(canonical).not.toMatch(/[\n\r\t]/u);
    expect(canonical).not.toContain(": ");
    expect(canonical).not.toContain(", ");
    expect(canonical).not.toContain("null");
    expect(canonical).not.toContain("undefined");
    expect(Object.keys(event.toJSON())).toHaveLength(17);
  });

  it("preserves canonical collection ordering", async () => {
    const event = await ExecutionEvent.create(await eventInput());
    expect(event.toJSON().recommendationIds).toEqual(["recommendation_a"]);
    expect(event.toJSON().traceIds).toEqual(["trace_a"]);
    expect(event.toJSON().planningRuleProvenance).toEqual([
      { ruleId: "PLAN-A", ruleVersion: "1.0.0" },
      { ruleId: "PLAN-B", ruleVersion: "2.0.0" },
    ]);
  });
});

describe("ExecutionEvent deep immutability", () => {
  it("deeply freezes the entity, nested state, and serialized projection", async () => {
    const event = await ExecutionEvent.create(await eventInput());
    const serialized = event.toJSON();
    for (const value of [
      event,
      event.recommendationIds,
      event.traceIds,
      event.planningRuleProvenance,
      event.planningRuleProvenance[0],
      event.planningPolicyProvenance,
      event.admissionProvenance,
      event.eventProvenance,
      serialized,
      serialized.recommendationIds,
      serialized.traceIds,
      serialized.planningRuleProvenance,
      serialized.planningRuleProvenance[0],
      serialized.planningPolicyProvenance,
      serialized.admissionProvenance,
      serialized.eventProvenance,
    ]) {
      expect(Object.isFrozen(value)).toBe(true);
    }
  });

  it("defensively copies mutable event provenance", async () => {
    const eventProvenance = {
      recorderType: "SERVICE" as const,
      recorderId: "service:original",
    };
    const input = await eventInput({ eventProvenance });
    const event = await ExecutionEvent.create(input);
    const originalId = event.executionEventId.value;

    eventProvenance.recorderId = "service:mutated";

    expect(event.eventProvenance.recorderId).toBe("service:original");
    expect(event.executionEventId.value).toBe(originalId);
  });

  it("prevents returned collections from mutating internal state", async () => {
    const event = await ExecutionEvent.create(await eventInput());

    expect(() => {
      (event.traceIds as Identifier[]).push(id("trace_mutated"));
    }).toThrow();
    expect(() => {
      (
        event.planningPolicyProvenance as {
          planningPolicyId: string;
        }
      ).planningPolicyId = "mutated";
    }).toThrow();
    expect(event.traceIds.map(({ value }) => value)).toEqual(["trace_a"]);
    expect(event.planningPolicyProvenance.planningPolicyId).toBe(
      "execution-planning-policy",
    );
  });

  it("isolates internal state from serialized-output mutation attempts", async () => {
    const event = await ExecutionEvent.create(await eventInput());
    const first = event.toJSON();
    const canonical = event.serialize();

    expect(() => {
      (first.traceIds as string[]).push("trace_mutated");
    }).toThrow();
    expect(() => {
      (
        first.eventProvenance as {
          recorderId: string;
        }
      ).recorderId = "mutated";
    }).toThrow();
    expect(event.serialize()).toBe(canonical);
  });

  it("cannot mutate the released RuntimeAdmission source", async () => {
    const admission = await createAdmission();
    const before = admission.serialize();
    await ExecutionEvent.create(await eventInput({ runtimeAdmission: admission }));

    expect(admission.serialize()).toBe(before);
    expect(Object.isFrozen(admission)).toBe(true);
  });
});

describe("ExecutionEvent governed failures", () => {
  it("covers INVALID_EXECUTION_EVENT_INPUT", async () => {
    await expectFailure(
      null as unknown as ExecutionEventInput,
      "INVALID_EXECUTION_EVENT_INPUT",
    );
  });

  it("covers MISSING_RUNTIME_ADMISSION", async () => {
    await expectFailure(
      {
        ...(await eventInput()),
        runtimeAdmission: undefined as unknown as RuntimeAdmission,
      },
      "MISSING_RUNTIME_ADMISSION",
    );
  });

  it("covers INVALID_RUNTIME_ADMISSION", async () => {
    await expectFailure(
      {
        ...(await eventInput()),
        runtimeAdmission: {} as RuntimeAdmission,
      },
      "INVALID_RUNTIME_ADMISSION",
    );
  });

  it("covers INVALID_RUNTIME_ADMISSION_PROJECTION", async () => {
    const admission = await createAdmission();
    await expectFailure(
      await eventInput({
        runtimeAdmission: admissionWith(admission, {
          organizationId: "invalid",
        }),
      }),
      "INVALID_RUNTIME_ADMISSION_PROJECTION",
    );
  });

  it("covers MISSING_WORK_PACKAGE_ID", async () => {
    await expectFailure(
      {
        ...(await eventInput()),
        workPackageId: undefined as unknown as Identifier,
      },
      "MISSING_WORK_PACKAGE_ID",
    );
  });

  it("covers INVALID_WORK_PACKAGE_ID", async () => {
    await expectFailure(
      {
        ...(await eventInput()),
        workPackageId: "invalid" as unknown as Identifier,
      },
      "INVALID_WORK_PACKAGE_ID",
    );
  });

  it("covers WORK_PACKAGE_NOT_ADMITTED with stable details", async () => {
    const error = await expectFailure(
      {
        ...(await eventInput()),
        workPackageId: id("work_package_not_admitted"),
      },
      "WORK_PACKAGE_NOT_ADMITTED",
    );
    expect(error.details).toEqual({
      workPackageId: "work_package_not_admitted",
    });
  });

  it("covers MISSING_EXECUTION_TIMESTAMP", async () => {
    await expectFailure(
      {
        ...(await eventInput()),
        occurredAt: undefined as unknown as string,
      },
      "MISSING_EXECUTION_TIMESTAMP",
    );
  });

  it.each([
    "",
    "not-a-date",
    "2026-07-22T13:45:00",
    "2026-02-30T13:45:00Z",
    "2026-07-22T24:00:00Z",
    "2026-07-22T13:45:00.1234Z",
    " 2026-07-22T13:45:00.000Z",
  ])("covers INVALID_EXECUTION_TIMESTAMP for %j", async (occurredAt) => {
    await expectFailure(
      { ...(await eventInput()), occurredAt },
      "INVALID_EXECUTION_TIMESTAMP",
    );
  });

  it("covers EXECUTION_PRECEDES_ADMISSION", async () => {
    const error = await expectFailure(
      {
        ...(await eventInput()),
        occurredAt: "2026-07-22T13:42:31.124Z",
      },
      "EXECUTION_PRECEDES_ADMISSION",
    );
    expect(Object.keys(error.details)).toEqual(["admittedAt", "occurredAt"]);
  });

  it("allows execution at the same canonical millisecond as admission", async () => {
    const event = await ExecutionEvent.create(
      await eventInput({ occurredAt: "2026-07-22T13:42:31.125Z" }),
    );
    expect(event.occurredAt).toBe("2026-07-22T13:42:31.125Z");
  });

  it("covers MISSING_EVENT_PROVENANCE", async () => {
    await expectFailure(
      {
        ...(await eventInput()),
        eventProvenance: undefined as unknown as ExecutionEventProvenance,
      },
      "MISSING_EVENT_PROVENANCE",
    );
  });

  it("covers INVALID_EVENT_PROVENANCE_TYPE", async () => {
    await expectFailure(
      {
        ...(await eventInput()),
        eventProvenance: {
          recorderType: "AGENT" as "SERVICE",
          recorderId: "valid-recorder",
        },
      },
      "INVALID_EVENT_PROVENANCE_TYPE",
    );
  });

  it.each([
    "",
    " leading",
    "trailing ",
    "x".repeat(257),
  ])("covers INVALID_EVENT_PROVENANCE_ID for %j", async (recorderId) => {
    await expectFailure(
      {
        ...(await eventInput()),
        eventProvenance: { recorderType: "SERVICE", recorderId },
      },
      "INVALID_EVENT_PROVENANCE_ID",
    );
  });

  it("covers EXECUTION_EVENT_IDENTITY_DERIVATION_FAILED", async () => {
    const input = await eventInput();
    const digest = vi
      .spyOn(globalThis.crypto.subtle, "digest")
      .mockRejectedValueOnce(new Error("blocked"));
    await expectFailure(
      input,
      "EXECUTION_EVENT_IDENTITY_DERIVATION_FAILED",
    );
    digest.mockRestore();
  });

  it("covers EXECUTION_EVENT_SERIALIZATION_FAILED", async () => {
    const input = await eventInput();
    const stringify = vi
      .spyOn(JSON, "stringify")
      .mockImplementationOnce(() => {
        throw new Error("blocked");
      });
    await expectFailure(input, "EXECUTION_EVENT_SERIALIZATION_FAILED");
    stringify.mockRestore();
  });

  it("sorts and freezes public error details deterministically", () => {
    const error = new ExecutionEventError(
      "INVALID_EXECUTION_EVENT_INPUT",
      "ExecutionEvent input must be a declarative record.",
      { zeta: 2, alpha: 1 },
    );
    expect(error.name).toBe("ExecutionEventError");
    expect(Object.keys(error.details)).toEqual(["alpha", "zeta"]);
    expect(Object.isFrozen(error)).toBe(true);
    expect(Object.isFrozen(error.details)).toBe(true);
  });
});

describe("ExecutionEvent deterministic failure precedence", () => {
  it("rejects the invalid input container before every field", async () => {
    await expectFailure(
      [] as unknown as ExecutionEventInput,
      "INVALID_EXECUTION_EVENT_INPUT",
    );
  });

  it("rejects missing RuntimeAdmission before downstream defects", async () => {
    await expectFailure(
      {
        runtimeAdmission: undefined as unknown as RuntimeAdmission,
        workPackageId: undefined as unknown as Identifier,
        occurredAt: "invalid",
        eventProvenance: undefined as unknown as ExecutionEventProvenance,
      },
      "MISSING_RUNTIME_ADMISSION",
    );
  });

  it("rejects an invalid admission projection before work-package defects", async () => {
    const admission = await createAdmission();
    await expectFailure(
      {
        runtimeAdmission: admissionWith(admission, {
          executionPlanSchemaVersion: "",
        }),
        workPackageId: undefined as unknown as Identifier,
        occurredAt: "invalid",
        eventProvenance: undefined as unknown as ExecutionEventProvenance,
      },
      "INVALID_RUNTIME_ADMISSION_PROJECTION",
    );
  });

  it("rejects missing work-package identity before temporal defects", async () => {
    await expectFailure(
      {
        ...(await eventInput()),
        workPackageId: undefined as unknown as Identifier,
        occurredAt: "invalid",
        eventProvenance: undefined as unknown as ExecutionEventProvenance,
      },
      "MISSING_WORK_PACKAGE_ID",
    );
  });

  it("rejects unadmitted work before temporal defects", async () => {
    await expectFailure(
      {
        ...(await eventInput()),
        workPackageId: id("not_admitted"),
        occurredAt: "invalid",
        eventProvenance: undefined as unknown as ExecutionEventProvenance,
      },
      "WORK_PACKAGE_NOT_ADMITTED",
    );
  });

  it("rejects invalid execution time before provenance defects", async () => {
    await expectFailure(
      {
        ...(await eventInput()),
        occurredAt: "invalid",
        eventProvenance: undefined as unknown as ExecutionEventProvenance,
      },
      "INVALID_EXECUTION_TIMESTAMP",
    );
  });

  it("rejects pre-admission execution before provenance defects", async () => {
    await expectFailure(
      {
        ...(await eventInput()),
        occurredAt: "2026-07-22T13:42:31.124Z",
        eventProvenance: undefined as unknown as ExecutionEventProvenance,
      },
      "EXECUTION_PRECEDES_ADMISSION",
    );
  });

  it("rejects recorder type before recorder identity", async () => {
    await expectFailure(
      {
        ...(await eventInput()),
        eventProvenance: {
          recorderType: "INVALID" as "SERVICE",
          recorderId: "",
        },
      },
      "INVALID_EVENT_PROVENANCE_TYPE",
    );
  });
});

describe("ExecutionEvent package API", () => {
  it("exports only the canonical contract and error, not internal helpers", () => {
    expect(domain.ExecutionEvent).toBe(ExecutionEvent);
    expect(domain.ExecutionEventError).toBe(ExecutionEventError);
    const surface = domain as unknown as Record<string, unknown>;
    for (const internal of [
      "normalizeExecutionEvent",
      "projectRuntimeAdmission",
      "createExecutionEventId",
      "stringifyCanonical",
      "identityComponent",
      "serializeState",
    ]) {
      expect(surface[internal]).toBeUndefined();
    }
  });
});
