import { createHash } from "node:crypto";
import { describe, expect, it, vi } from "vitest";
import * as domain from "../src/index.js";
import {
  ExecutionEvent,
  ExecutionPlan,
  Identifier,
  ObservedOutcome,
  ObservedOutcomeError,
  RuntimeAdmission,
  type CreateRuntimeAdmissionInput,
  type ExecutionEventInput,
  type ExecutionPlanInput,
  type ExecutionPlanWorkPackage,
  type ObservedOutcomeFailureCode,
  type ObservedOutcomeInput,
  type ObservedOutcomeValue,
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

const planInput = (): ExecutionPlanInput => ({
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
});

const createEvent = async (
  occurredAt = "2026-07-22T09:45:00.250-04:00",
): Promise<ExecutionEvent> => {
  const executionPlan = new ExecutionPlan(planInput());
  const admissionInput: CreateRuntimeAdmissionInput = {
    executionPlan,
    workPackageIds: executionPlan.workPackages.map(
      ({ workPackageId }) => workPackageId,
    ),
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
  };
  const runtimeAdmission = await RuntimeAdmission.create(admissionInput);
  const eventInput: ExecutionEventInput = {
    runtimeAdmission,
    workPackageId: runtimeAdmission.admittedWorkPackages[0]!.workPackageId,
    occurredAt,
    eventProvenance: {
      recorderType: "SERVICE",
      recorderId: "service:execution-recorder",
    },
  };
  return ExecutionEvent.create(eventInput);
};

type ObservedOutcomeOverrides = Omit<
  Partial<ObservedOutcomeInput>,
  "unit" | "measurementContext"
> & {
  unit?: string | undefined;
  measurementContext?: string | undefined;
};

const outcomeInput = async (
  overrides: ObservedOutcomeOverrides = {},
): Promise<ObservedOutcomeInput> => {
  const hasUnit = Object.prototype.hasOwnProperty.call(overrides, "unit");
  const hasContext = Object.prototype.hasOwnProperty.call(
    overrides,
    "measurementContext",
  );
  const {
    unit: unitOverride,
    measurementContext: contextOverride,
    ...remainingOverrides
  } = overrides;
  const unit = hasUnit ? unitOverride : "duration:day";
  const measurementContext = hasContext
    ? contextOverride
    : "Measured from the governed invoice record";

  return {
    executionEvent: overrides.executionEvent ?? (await createEvent()),
    subjectType: "INVOICE",
    subjectId: id("invoice_001"),
    observationCode: "PAYMENT_DELAY_DAYS",
    value: { kind: "QUANTITATIVE", value: "12.5" },
    ...(unit === undefined ? {} : { unit }),
    ...(measurementContext === undefined ? {} : { measurementContext }),
    observedAt: "2026-07-22T14:00:00.250Z",
    provenance: {
      sourceType: "SYSTEM",
      sourceId: "billing:invoice-ledger",
      collectionMethod: "canonical-ledger-read",
      recorderType: "SERVICE",
      recorderId: "service:outcome-recorder",
      recordedAt: "2026-07-22T14:01:00.250Z",
    },
    ...remainingOverrides,
  };
};

const eventWith = (
  event: ExecutionEvent,
  overrides: Readonly<Record<string, unknown>>,
): ExecutionEvent =>
  new Proxy(event, {
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
  input: unknown,
  code: ObservedOutcomeFailureCode,
): Promise<ObservedOutcomeError> => {
  try {
    await ObservedOutcome.create(input as ObservedOutcomeInput);
    throw new Error("Expected ObservedOutcome construction to fail.");
  } catch (error) {
    expect(error).toBeInstanceOf(ObservedOutcomeError);
    const governed = error as ObservedOutcomeError;
    expect(governed.code).toBe(code);
    expect(Object.isFrozen(governed)).toBe(true);
    expect(Object.isFrozen(governed.details)).toBe(true);
    return governed;
  }
};

const digest = (value: string): string =>
  createHash("sha256").update(value, "utf8").digest("hex");

describe("ObservedOutcome construction and atomic semantics", () => {
  it.each([
    [{ kind: "QUANTITATIVE", value: "12.5" }, "duration:day"],
    [{ kind: "CATEGORICAL", value: "Delayed" }, undefined],
    [{ kind: "BOOLEAN", value: true }, undefined],
    [{ kind: "TEXT", value: "Customer confirmed receipt" }, undefined],
  ] as const)("constructs one immutable %s observation", async (value, unit) => {
    const input = await outcomeInput({
      value: value as ObservedOutcomeValue,
      ...(unit === undefined ? { unit: undefined } : { unit }),
    });
    const outcome = await ObservedOutcome.create(input);

    expect(outcome).toBeInstanceOf(ObservedOutcome);
    expect(outcome.observedOutcomeId).toBe(outcome.id);
    expect(outcome.observedOutcomeId.value).toMatch(
      /^observed-outcome:v1:[0-9a-f]{64}$/u,
    );
    expect(outcome.value).toEqual(value);
    expect(outcome.unit).toBe(unit);
    expect(outcome.version).toBe("1.0.0");
    expect(outcome.schemaVersion).toBe("observed-outcome:v1");
    expect(Object.isFrozen(outcome)).toBe(true);
    expect(Object.isFrozen(outcome.value)).toBe(true);
  });

  it("preserves exact canonical ExecutionEvent lineage without retaining caller duplicates", async () => {
    const event = await createEvent();
    const outcome = await ObservedOutcome.create(
      await outcomeInput({ executionEvent: event }),
    );

    expect(outcome.executionEventId).toBe(event.executionEventId);
    expect(outcome.runtimeAdmissionId).toBe(event.runtimeAdmissionId);
    expect(outcome.executionPlanId).toBe(event.executionPlanId);
    expect(outcome.organizationId).toBe(event.organizationId);
    expect(outcome.workPackageId).toBe(event.workPackageId);
    expect(outcome.recommendationIds).toEqual(event.recommendationIds);
    expect(outcome.traceIds).toEqual(event.traceIds);
    expect(outcome.planningRuleProvenance).toEqual(
      event.planningRuleProvenance,
    );
    expect(outcome.planningPolicyProvenance).toEqual(
      event.planningPolicyProvenance,
    );
    expect(outcome.admissionProvenance).toEqual(event.admissionProvenance);
    expect(outcome.executionEventProvenance).toEqual(event.eventProvenance);
    expect(outcome.executionOccurredAt).toBe(event.occurredAt);
  });

  it("normalizes subject, code, offset timestamp, text, context, and provenance", async () => {
    const outcome = await ObservedOutcome.create(
      await outcomeInput({
        subjectType: " INVOICE ",
        observationCode: " PAYMENT_DELAY_DAYS ",
        value: { kind: "TEXT", value: "  Café\r\nconfirmed  " },
        unit: undefined,
        measurementContext: "  First line\rSecond line  ",
        observedAt: "2026-07-22T10:00:00.25-04:00",
        provenance: {
          sourceType: "SYSTEM",
          sourceId: " billing:invoice-ledger ",
          collectionMethod: " canonical-ledger-read ",
          recorderType: "SERVICE",
          recorderId: " service:outcome-recorder ",
          recordedAt: "2026-07-22T10:01:00.25-04:00",
        },
      }),
    );

    expect(outcome.subjectType).toBe("INVOICE");
    expect(outcome.observationCode).toBe("PAYMENT_DELAY_DAYS");
    expect(outcome.value).toEqual({
      kind: "TEXT",
      value: "Café\nconfirmed",
    });
    expect(outcome.measurementContext).toBe("First line\nSecond line");
    expect(outcome.observedAt).toBe("2026-07-22T14:00:00.250Z");
    expect(outcome.provenance.recordedAt).toBe(
      "2026-07-22T14:01:00.250Z",
    );
    expect(outcome.provenance.sourceId).toBe("billing:invoice-ledger");
  });

  it("permits observation and recording equality at the governed millisecond", async () => {
    const event = await createEvent();
    const outcome = await ObservedOutcome.create(
      await outcomeInput({
        executionEvent: event,
        observedAt: event.occurredAt,
        provenance: {
          sourceType: "SYSTEM",
          sourceId: "billing:invoice-ledger",
          collectionMethod: "canonical-ledger-read",
          recorderType: "SERVICE",
          recorderId: "service:outcome-recorder",
          recordedAt: event.occurredAt,
        },
      }),
    );

    expect(outcome.observedAt).toBe(event.occurredAt);
    expect(outcome.provenance.recordedAt).toBe(event.occurredAt);
  });
});

describe("ObservedOutcome governed failures and precedence", () => {
  it("implements all 26 governed failure codes", () => {
    const expected: readonly ObservedOutcomeFailureCode[] = [
      "INVALID_OBSERVED_OUTCOME_INPUT",
      "MISSING_EXECUTION_EVENT",
      "INVALID_EXECUTION_EVENT",
      "INVALID_EXECUTION_EVENT_PROJECTION",
      "MISSING_OBSERVATION_SUBJECT",
      "INVALID_OBSERVATION_SUBJECT_TYPE",
      "INVALID_OBSERVATION_SUBJECT_ID",
      "MISSING_OBSERVATION_CODE",
      "INVALID_OBSERVATION_CODE",
      "MISSING_OBSERVATION_VALUE",
      "INVALID_OBSERVATION_VALUE_KIND",
      "INVALID_QUANTITATIVE_VALUE",
      "INVALID_CATEGORICAL_VALUE",
      "INVALID_BOOLEAN_VALUE",
      "INVALID_TEXT_VALUE",
      "INVALID_OBSERVATION_UNIT",
      "INVALID_MEASUREMENT_CONTEXT",
      "MISSING_OBSERVATION_TIMESTAMP",
      "INVALID_OBSERVATION_TIMESTAMP",
      "OBSERVATION_PRECEDES_EXECUTION",
      "MISSING_OBSERVATION_PROVENANCE",
      "INVALID_OBSERVATION_PROVENANCE",
      "INVALID_RECORDING_TIMESTAMP",
      "RECORDING_PRECEDES_OBSERVATION",
      "OBSERVED_OUTCOME_IDENTITY_DERIVATION_FAILED",
      "OBSERVED_OUTCOME_SERIALIZATION_FAILED",
    ];

    expect(new Set(expected).size).toBe(26);
  });

  it("rejects invalid top-level input first", async () => {
    await expectFailure(null, "INVALID_OBSERVED_OUTCOME_INPUT");
    await expectFailure([], "INVALID_OBSERVED_OUTCOME_INPUT");
  });

  it("distinguishes missing, invalid, and malformed ExecutionEvent", async () => {
    await expectFailure(
      { ...(await outcomeInput()), executionEvent: undefined },
      "MISSING_EXECUTION_EVENT",
    );
    await expectFailure(
      { ...(await outcomeInput()), executionEvent: {} },
      "INVALID_EXECUTION_EVENT",
    );
    const event = await createEvent();
    await expectFailure(
      await outcomeInput({
        executionEvent: eventWith(event, { executionEventId: null }),
      }),
      "INVALID_EXECUTION_EVENT_PROJECTION",
    );
  });

  it("distinguishes missing and invalid subject fields in field order", async () => {
    const missingType = {
      ...(await outcomeInput()),
      subjectType: undefined,
      subjectId: undefined,
    };
    const error = await expectFailure(
      missingType,
      "MISSING_OBSERVATION_SUBJECT",
    );
    expect(error.details).toEqual({ field: "subjectType" });
    await expectFailure(
      await outcomeInput({ subjectType: "invoice" }),
      "INVALID_OBSERVATION_SUBJECT_TYPE",
    );
    await expectFailure(
      { ...(await outcomeInput()), subjectId: {} },
      "INVALID_OBSERVATION_SUBJECT_ID",
    );
  });

  it("distinguishes missing and invalid observation code", async () => {
    await expectFailure(
      { ...(await outcomeInput()), observationCode: undefined },
      "MISSING_OBSERVATION_CODE",
    );
    await expectFailure(
      await outcomeInput({ observationCode: "payment-delay" }),
      "INVALID_OBSERVATION_CODE",
    );
  });

  it("distinguishes missing and unsupported value kinds", async () => {
    await expectFailure(
      { ...(await outcomeInput()), value: undefined },
      "MISSING_OBSERVATION_VALUE",
    );
    await expectFailure(
      {
        ...(await outcomeInput()),
        value: { kind: "OBJECT", value: {} },
      },
      "INVALID_OBSERVATION_VALUE_KIND",
    );
    await expectFailure(
      { ...(await outcomeInput()), value: [] },
      "INVALID_OBSERVATION_VALUE_KIND",
    );
  });

  it.each([
    "01",
    "-0",
    "1.0",
    "1e3",
    "NaN",
    "Infinity",
    "-Infinity",
    " 1",
  ])("rejects non-canonical quantitative value %s", async (value) => {
    await expectFailure(
      await outcomeInput({
        value: { kind: "QUANTITATIVE", value },
      }),
      "INVALID_QUANTITATIVE_VALUE",
    );
  });

  it.each(["0", "-0.5", "1", "-12", "12.5", "0.0001"])(
    "accepts canonical quantitative value %s without numeric conversion",
    async (value) => {
      const outcome = await ObservedOutcome.create(
        await outcomeInput({
          value: { kind: "QUANTITATIVE", value },
        }),
      );
      expect(outcome.value).toEqual({ kind: "QUANTITATIVE", value });
    },
  );

  it("rejects invalid categorical, boolean, and text payloads distinctly", async () => {
    await expectFailure(
      await outcomeInput({
        value: { kind: "CATEGORICAL", value: " \n " },
        unit: undefined,
      }),
      "INVALID_CATEGORICAL_VALUE",
    );
    await expectFailure(
      {
        ...(await outcomeInput({ unit: undefined })),
        value: { kind: "BOOLEAN", value: "true" },
      },
      "INVALID_BOOLEAN_VALUE",
    );
    await expectFailure(
      await outcomeInput({
        value: { kind: "TEXT", value: "\u0000" },
        unit: undefined,
      }),
      "INVALID_TEXT_VALUE",
    );
  });

  it("enforces exact value byte bounds", async () => {
    const category = "a".repeat(129);
    const text = "a".repeat(1_025);
    await expectFailure(
      await outcomeInput({
        value: { kind: "CATEGORICAL", value: category },
        unit: undefined,
      }),
      "INVALID_CATEGORICAL_VALUE",
    );
    await expectFailure(
      await outcomeInput({
        value: { kind: "TEXT", value: text },
        unit: undefined,
      }),
      "INVALID_TEXT_VALUE",
    );
  });

  it("requires units only for quantitative values", async () => {
    await expectFailure(
      await outcomeInput({ unit: undefined }),
      "INVALID_OBSERVATION_UNIT",
    );
    await expectFailure(
      await outcomeInput({ unit: " duration day " }),
      "INVALID_OBSERVATION_UNIT",
    );
    await expectFailure(
      await outcomeInput({
        value: { kind: "BOOLEAN", value: true },
        unit: "count",
      }),
      "INVALID_OBSERVATION_UNIT",
    );
  });

  it("rejects invalid measurement context", async () => {
    await expectFailure(
      await outcomeInput({ measurementContext: " \u0000 " }),
      "INVALID_MEASUREMENT_CONTEXT",
    );
    await expectFailure(
      await outcomeInput({ measurementContext: "a".repeat(513) }),
      "INVALID_MEASUREMENT_CONTEXT",
    );
  });

  it("distinguishes missing, invalid, and pre-execution observation time", async () => {
    await expectFailure(
      { ...(await outcomeInput()), observedAt: undefined },
      "MISSING_OBSERVATION_TIMESTAMP",
    );
    await expectFailure(
      await outcomeInput({ observedAt: "2026-07-22T14:00:00" }),
      "INVALID_OBSERVATION_TIMESTAMP",
    );
    await expectFailure(
      await outcomeInput({ observedAt: "2026-07-22T13:44:59.999Z" }),
      "OBSERVATION_PRECEDES_EXECUTION",
    );
  });

  it.each([
    "2026-02-30T00:00:00Z",
    "2026-07-22T14:00:00.2500Z",
    "2026-07-22T14:00:60Z",
    "2026-07-22T14:00:00+24:00",
  ])("rejects malformed or unsupported timestamp %s", async (observedAt) => {
    await expectFailure(
      await outcomeInput({ observedAt }),
      "INVALID_OBSERVATION_TIMESTAMP",
    );
  });

  it("distinguishes missing and invalid provenance", async () => {
    await expectFailure(
      { ...(await outcomeInput()), provenance: undefined },
      "MISSING_OBSERVATION_PROVENANCE",
    );
    const base = (await outcomeInput()).provenance;
    await expectFailure(
      await outcomeInput({
        provenance: { ...base, sourceType: "MODEL" as "SYSTEM" },
      }),
      "INVALID_OBSERVATION_PROVENANCE",
    );
    await expectFailure(
      await outcomeInput({
        provenance: { ...base, sourceId: " " },
      }),
      "INVALID_OBSERVATION_PROVENANCE",
    );
    await expectFailure(
      await outcomeInput({
        provenance: { ...base, collectionMethod: "\n" },
      }),
      "INVALID_OBSERVATION_PROVENANCE",
    );
    await expectFailure(
      await outcomeInput({
        provenance: { ...base, recorderType: "SENSOR" as "SERVICE" },
      }),
      "INVALID_OBSERVATION_PROVENANCE",
    );
    await expectFailure(
      await outcomeInput({
        provenance: { ...base, recorderId: "" },
      }),
      "INVALID_OBSERVATION_PROVENANCE",
    );
  });

  it("distinguishes invalid and pre-observation recording timestamps", async () => {
    const provenance = (await outcomeInput()).provenance;
    await expectFailure(
      await outcomeInput({
        provenance: { ...provenance, recordedAt: undefined as never },
      }),
      "INVALID_RECORDING_TIMESTAMP",
    );
    await expectFailure(
      await outcomeInput({
        provenance: {
          ...provenance,
          recordedAt: "2026-07-22T13:59:59.999Z",
        },
      }),
      "RECORDING_PRECEDES_OBSERVATION",
    );
  });

  it("maps rejected SHA-256 to the governed identity failure", async () => {
    const input = await outcomeInput();
    const digestSpy = vi
      .spyOn(globalThis.crypto.subtle, "digest")
      .mockRejectedValueOnce(new Error("blocked"));
    const error = await expectFailure(
      input,
      "OBSERVED_OUTCOME_IDENTITY_DERIVATION_FAILED",
    );
    expect(error.details).toEqual({ operation: "SHA-256" });
    digestSpy.mockRestore();
  });

  it("maps canonical JSON failure to the governed serialization failure", async () => {
    const outcome = await ObservedOutcome.create(await outcomeInput());
    const stringifySpy = vi
      .spyOn(JSON, "stringify")
      .mockImplementationOnce(() => {
        throw new Error("blocked");
      });
    let governed: ObservedOutcomeError | undefined;
    try {
      outcome.serialize();
    } catch (error) {
      governed = error as ObservedOutcomeError;
    }
    stringifySpy.mockRestore();
    expect(governed).toBeInstanceOf(ObservedOutcomeError);
    expect(governed?.code).toBe("OBSERVED_OUTCOME_SERIALIZATION_FAILED");
    expect(governed?.details).toEqual({ operation: "canonical-json" });
  });

  it("uses deterministic first-failure precedence for multi-invalid input", async () => {
    const input = {
      ...(await outcomeInput()),
      executionEvent: undefined,
      subjectType: undefined,
      observationCode: undefined,
      value: undefined,
      observedAt: undefined,
      provenance: undefined,
    };
    await expectFailure(input, "MISSING_EXECUTION_EVENT");

    const subjectFirst = {
      ...(await outcomeInput()),
      subjectType: undefined,
      observationCode: undefined,
      value: undefined,
    };
    await expectFailure(subjectFirst, "MISSING_OBSERVATION_SUBJECT");
  });
});

describe("ObservedOutcome deterministic identity and serialization", () => {
  it("produces stable identity and canonical serialization fixed vectors", async () => {
    const first = await ObservedOutcome.create(await outcomeInput());
    const second = await ObservedOutcome.create(await outcomeInput());

    expect(first.observedOutcomeId.value).toBe(
      "observed-outcome:v1:8be1f56e8d31fd93c9b1569e3d73a9f6c623629f96f9d79ae84345d0c2ddb320",
    );
    expect(second.observedOutcomeId.equals(first.observedOutcomeId)).toBe(true);
    expect(first.serialize()).toBe(second.serialize());
    expect(digest(first.serialize())).toBe(
      "feece7d7f9acb90f0ae74c992c811721aa03a0026cf885cb06197a16b3af2c61",
    );
  });

  it("hashes exactly 17 ordered UTF-8 length-framed components", async () => {
    const input = await outcomeInput();
    const originalDigest = globalThis.crypto.subtle.digest.bind(
      globalThis.crypto.subtle,
    );
    let material = "";
    const spy = vi
      .spyOn(globalThis.crypto.subtle, "digest")
      .mockImplementationOnce(async (algorithm, data) => {
        material = new TextDecoder().decode(data as ArrayBuffer);
        return originalDigest(algorithm, data);
      });

    await ObservedOutcome.create(input);
    spy.mockRestore();

    let cursor = 0;
    let components = 0;
    while (cursor < material.length) {
      const colon = material.indexOf(":", cursor);
      expect(colon).toBeGreaterThan(cursor);
      const length = Number(material.slice(cursor, colon));
      expect(Number.isInteger(length)).toBe(true);
      const payloadStart = colon + 1;
      const remainder = material.slice(payloadStart);
      let characters = 0;
      let bytes = 0;
      while (characters < remainder.length && bytes < length) {
        const point = remainder.codePointAt(characters)!;
        const character = String.fromCodePoint(point);
        bytes += new TextEncoder().encode(character).byteLength;
        characters += character.length;
      }
      expect(bytes).toBe(length);
      cursor = payloadStart + characters;
      components += 1;
    }
    expect(components).toBe(17);
  });

  it("normalizes equivalent offsets to identical identity and bytes", async () => {
    const first = await ObservedOutcome.create(
      await outcomeInput({
        observedAt: "2026-07-22T10:00:00.250-04:00",
      }),
    );
    const second = await ObservedOutcome.create(
      await outcomeInput({
        observedAt: "2026-07-22T14:00:00.250Z",
      }),
    );
    expect(first.equals(second)).toBe(true);
    expect(first.serialize()).toBe(second.serialize());
  });

  it("changes identity when the canonical ExecutionEvent identity changes", async () => {
    const first = await ObservedOutcome.create(
      await outcomeInput({ executionEvent: await createEvent() }),
    );
    const second = await ObservedOutcome.create(
      await outcomeInput({
        executionEvent: await createEvent("2026-07-22T09:45:01.250-04:00"),
      }),
    );
    expect(first.executionEventId.equals(second.executionEventId)).toBe(false);
    expect(first.equals(second)).toBe(false);
  });

  it("is independent of caller property insertion order", async () => {
    const input = await outcomeInput();
    const reorderedProvenance = {
      recordedAt: input.provenance.recordedAt,
      recorderId: input.provenance.recorderId,
      recorderType: input.provenance.recorderType,
      collectionMethod: input.provenance.collectionMethod,
      sourceId: input.provenance.sourceId,
      sourceType: input.provenance.sourceType,
    };
    const reordered = {
      provenance: reorderedProvenance,
      observedAt: input.observedAt,
      measurementContext: input.measurementContext,
      unit: input.unit,
      value: input.value,
      observationCode: input.observationCode,
      subjectId: input.subjectId,
      subjectType: input.subjectType,
      executionEvent: input.executionEvent,
    } as ObservedOutcomeInput;
    const first = await ObservedOutcome.create(input);
    const second = await ObservedOutcome.create(reordered);
    expect(first.equals(second)).toBe(true);
    expect(first.serialize()).toBe(second.serialize());
  });

  it("does not consult the current clock", async () => {
    const nowSpy = vi.spyOn(Date, "now");
    await ObservedOutcome.create(await outcomeInput());
    expect(nowSpy).not.toHaveBeenCalled();
    nowSpy.mockRestore();
  });

  it.each([
    ["subject", { subjectId: id("invoice_002") }],
    ["code", { observationCode: "PAYMENT_DELAY_HOURS" }],
    ["kind", { value: { kind: "CATEGORICAL", value: "Delayed" }, unit: undefined }],
    ["value", { value: { kind: "QUANTITATIVE", value: "13" } }],
    ["unit", { unit: "duration:hour" }],
    ["context", { measurementContext: "Alternative governed sample" }],
    ["time", { observedAt: "2026-07-22T14:00:01.250Z" }],
  ] as const)("changes identity when canonical %s changes", async (_name, change) => {
    const baseline = await ObservedOutcome.create(await outcomeInput());
    const changed = await ObservedOutcome.create(
      await outcomeInput(change as ObservedOutcomeOverrides),
    );
    expect(changed.equals(baseline)).toBe(false);
  });

  it("changes identity when provenance changes", async () => {
    const input = await outcomeInput();
    const baseline = await ObservedOutcome.create(input);
    const changed = await ObservedOutcome.create({
      ...input,
      provenance: {
        ...input.provenance,
        recorderId: "service:alternative-recorder",
      },
    });
    expect(changed.equals(baseline)).toBe(false);
  });

  it("uses the exact controlled 26-field canonical projection", async () => {
    const outcome = await ObservedOutcome.create(await outcomeInput());
    const projection = outcome.toJSON();
    expect(Object.keys(projection)).toEqual([
      "observedOutcomeId",
      "executionEventId",
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
      "executionEventSchemaVersion",
      "admissionProvenance",
      "executionEventProvenance",
      "executionOccurredAt",
      "subjectType",
      "subjectId",
      "observationCode",
      "value",
      "unit",
      "measurementContext",
      "observedAt",
      "provenance",
      "version",
      "schemaVersion",
    ]);
    expect(Object.keys(projection.value)).toEqual(["kind", "value"]);
    expect(Object.keys(projection.provenance)).toEqual([
      "sourceType",
      "sourceId",
      "collectionMethod",
      "recorderType",
      "recorderId",
      "recordedAt",
    ]);
  });

  it("omits optional fields rather than serializing null", async () => {
    const outcome = await ObservedOutcome.create(
      await outcomeInput({
        value: { kind: "BOOLEAN", value: false },
        unit: undefined,
        measurementContext: undefined,
      }),
    );
    const projection = outcome.toJSON();
    expect("unit" in projection).toBe(false);
    expect("measurementContext" in projection).toBe(false);
    expect(outcome.serialize()).not.toContain(":null");
  });

  it("uses stable RFC 8259 escaping and normalized Unicode/newlines", async () => {
    const outcome = await ObservedOutcome.create(
      await outcomeInput({
        value: { kind: "TEXT", value: " Café\r\n\"quoted\"\\path " },
        unit: undefined,
      }),
    );
    expect(outcome.serialize()).toContain(
      '"value":{"kind":"TEXT","value":"Café\\n\\"quoted\\"\\\\path"}',
    );
  });

  it("retains JSON-looking text as opaque bounded text", async () => {
    const outcome = await ObservedOutcome.create(
      await outcomeInput({
        value: { kind: "TEXT", value: '{"status":"observed"}' },
        unit: undefined,
      }),
    );
    expect(outcome.value).toEqual({
      kind: "TEXT",
      value: '{"status":"observed"}',
    });
    expect(typeof outcome.value.value).toBe("string");
  });
});

describe("ObservedOutcome deep immutability and equality", () => {
  it("defensively copies and freezes caller-owned nested values", async () => {
    const value = { kind: "TEXT" as const, value: "Original observation" };
    const provenance = {
      sourceType: "SYSTEM" as const,
      sourceId: "billing:invoice-ledger",
      collectionMethod: "canonical-ledger-read",
      recorderType: "SERVICE" as const,
      recorderId: "service:outcome-recorder",
      recordedAt: "2026-07-22T14:01:00.250Z",
    };
    const outcome = await ObservedOutcome.create(
      await outcomeInput({ value, unit: undefined, provenance }),
    );
    const before = outcome.serialize();

    value.value = "Changed";
    provenance.sourceId = "changed";

    expect(outcome.value).toEqual({
      kind: "TEXT",
      value: "Original observation",
    });
    expect(outcome.provenance.sourceId).toBe("billing:invoice-ledger");
    expect(outcome.serialize()).toBe(before);
    expect(Object.isFrozen(outcome.provenance)).toBe(true);
    expect(Object.isFrozen(outcome.recommendationIds)).toBe(true);
    expect(Object.isFrozen(outcome.traceIds)).toBe(true);
    expect(Object.isFrozen(outcome.planningRuleProvenance)).toBe(true);
    expect(
      outcome.planningRuleProvenance.every((record) =>
        Object.isFrozen(record),
      ),
    ).toBe(true);
  });

  it("returns deeply frozen serialization projections", async () => {
    const outcome = await ObservedOutcome.create(await outcomeInput());
    const projection = outcome.toJSON();
    expect(Object.isFrozen(projection)).toBe(true);
    expect(Object.isFrozen(projection.value)).toBe(true);
    expect(Object.isFrozen(projection.provenance)).toBe(true);
    expect(Object.isFrozen(projection.recommendationIds)).toBe(true);
    expect(Object.isFrozen(projection.traceIds)).toBe(true);
    expect(Object.isFrozen(projection.planningRuleProvenance)).toBe(true);
  });

  it("implements reflexive, symmetric, transitive identity equality", async () => {
    const first = await ObservedOutcome.create(await outcomeInput());
    const second = await ObservedOutcome.create(await outcomeInput());
    const third = await ObservedOutcome.create(await outcomeInput());

    expect(first.equals(first)).toBe(true);
    expect(first.equals(second)).toBe(true);
    expect(second.equals(first)).toBe(true);
    expect(second.equals(third)).toBe(true);
    expect(first.equals(third)).toBe(true);
  });
});

describe("ObservedOutcome public and architectural boundary", () => {
  it("exports exactly the governed runtime surface and no helpers", () => {
    expect(domain.ObservedOutcome).toBe(ObservedOutcome);
    expect(domain.ObservedOutcomeError).toBe(ObservedOutcomeError);
    for (const privateName of [
      "normalizeObservedOutcome",
      "createObservedOutcomeId",
      "identityComponent",
      "stringifyCanonical",
      "projectExecutionEvent",
      "normalizeValue",
    ]) {
      expect(privateName in domain).toBe(false);
    }
  });

  it("contains no execution, evaluation, evidence, confidence, or mutable-status API", async () => {
    const outcome = await ObservedOutcome.create(await outcomeInput());
    for (const forbidden of [
      "execute",
      "persist",
      "schedule",
      "retry",
      "status",
      "success",
      "failure",
      "confidence",
      "evidence",
      "causedBy",
      "evaluate",
    ]) {
      expect(forbidden in outcome).toBe(false);
    }
  });
});
