import { describe, expect, it, vi } from "vitest";
import * as domain from "../src/index.js";
import {
  BusinessSignal,
  Evidence,
  EvidenceComponent,
  EvidenceComponentProvenance,
  EvidenceConstructionRuleReference,
  EvidenceRelation,
  ExecutionEvent,
  ExecutionPlan,
  Identifier,
  ObservedOutcome,
  Percentage,
  RuntimeAdmission,
  Verification,
  VerificationError,
  type CreateRuntimeAdmissionInput,
  type ExecutionEventInput,
  type ExecutionPlanInput,
  type ExecutionPlanWorkPackage,
  type ObservedOutcomeInput,
  type VerificationCreateInput,
  type VerificationFailureCode,
} from "../src/index.js";

const id = (value: string): Identifier => new Identifier(value);

const score = (basisPoints = 8_000): Percentage =>
  Percentage.fromBasisPoints(basisPoints);

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
  sourceRecommendationIds: [
    id("recommendation_b"),
    id("recommendation_a"),
  ],
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
  requiredCapabilities: [
    "customer-contact",
    "invoice-review",
  ],
  requiredResources: [
    "customer-record",
    "invoice-record",
  ],
  executionAssumptions: [
    "Customer details remain current",
  ],
  executionConstraints: [
    "Preserve customer consent",
  ],
  admissibilityChecks: [
    "Recommendations remain admissible",
  ],
  riskControls: [
    "Stop on a consent conflict",
  ],
  approvalGates: [
    "Planning policy is released",
  ],
  rollbackConsiderations: [
    "Preserve the original record",
  ],
  completionCriteria: [
    "Every package meets its exit criteria",
  ],
  successCriteria: [
    "Invoice disposition improves",
  ],
  createdAt: "2026-07-22T13:00:00.000Z",
  schemaVersion: "execution-plan:v1",
});

const createObservedOutcome = async (): Promise<ObservedOutcome> => {
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
      message:
        "The governed work packages are approved for runtime.",
    },
    admissionProvenance: {
      admissionPolicyId: "runtime-admission-policy",
      admissionPolicyVersion: "1.0.0",
      admissionSchemaVersion: "runtime-admission:v1",
    },
  };

  const runtimeAdmission =
    await RuntimeAdmission.create(admissionInput);

  const eventInput: ExecutionEventInput = {
    runtimeAdmission,
    workPackageId:
      runtimeAdmission.admittedWorkPackages[0]!.workPackageId,
    occurredAt: "2026-07-22T09:45:00.250-04:00",
    eventProvenance: {
      recorderType: "SERVICE",
      recorderId: "service:execution-recorder",
    },
  };

  const executionEvent =
    await ExecutionEvent.create(eventInput);

  const outcomeInput: ObservedOutcomeInput = {
    executionEvent,
    subjectType: "INVOICE",
    subjectId: id("invoice_001"),
    observationCode: "PAYMENT_DELAY_DAYS",
    value: {
      kind: "QUANTITATIVE",
      value: "12.5",
    },
    unit: "duration:day",
    measurementContext:
      "Measured from the governed invoice record",
    observedAt: "2026-07-22T14:00:00.250Z",
    provenance: {
      sourceType: "SYSTEM",
      sourceId: "billing:invoice-ledger",
      collectionMethod: "canonical-ledger-read",
      recorderType: "SERVICE",
      recorderId: "service:outcome-recorder",
      recordedAt: "2026-07-22T14:01:00.250Z",
    },
  };

  return ObservedOutcome.create(outcomeInput);
};

const createEvidence = (
  organizationId: Identifier,
  evidenceId = "evidence_001",
  createdAt = "2026-07-22T14:02:00.250Z",
): Evidence => {
  const signal = new BusinessSignal(
    id(`signal_${evidenceId}`),
    organizationId,
    "operational",
    "invoice",
    "2026-07-22T13:58:00.000Z",
    "2026-07-22T13:59:00.000Z",
    12.5,
    score(),
    "valid",
    id("invoice_001"),
    "Matched canonical invoice record.",
  );

  const component = new EvidenceComponent(
    id(`component_${evidenceId}`),
    undefined,
    new EvidenceRelation(
      "ginzaaipro.business-signal",
      "value",
    ),
    {
      kind: "text",
      value: "Invoice payment delay was 12.5 days.",
    },
    [],
    [
      new EvidenceComponentProvenance(
        signal.id,
        "verification-domain-test",
        "value",
      ),
    ],
    new EvidenceConstructionRuleReference(
      "VAL-EVIDENCE-TEXT-001",
      "1.0.0",
    ),
  );

  return new Evidence(
    id(evidenceId),
    organizationId,
    [signal.id],
    signal.source,
    signal.validationStatus,
    "Canonical invoice reconciliation",
    score(9_000),
    [component],
    score(8_500),
    createdAt,
  );
};

type VerificationInputOverrides = Omit<
  Partial<VerificationCreateInput>,
  "confidence"
> &
  Readonly<{
    confidence?: unknown;
  }>;

const verificationInput = async (
  overrides: VerificationInputOverrides = {},
): Promise<VerificationCreateInput> => {
  const observedOutcome =
    overrides.observedOutcome ?? (await createObservedOutcome());

  const confidence = Object.prototype.hasOwnProperty.call(
    overrides,
    "confidence",
  )
    ? overrides.confidence
    : {
        calibrationStatus: "uncalibrated",
        value: score(8_500),
        basis:
          "Confidence reflects direct canonical record reconciliation.",
      };

  return {
    observedOutcome,
    evidence:
      overrides.evidence ??
      [createEvidence(observedOutcome.organizationId)],
    method:
      overrides.method ?? "Canonical invoice reconciliation",
    judgment: overrides.judgment ?? "confirmed",
    verifiedAt:
      overrides.verifiedAt ?? "2026-07-22T14:03:00.250Z",
    limitations:
      overrides.limitations ??
      ["Verification confirms the recorded delay, not causality."],
    verifierId: overrides.verifierId ?? id("verifier_001"),
    notes:
      overrides.notes ??
      "Evidence was evaluated against the observed proposition.",
    ...(confidence === undefined
      ? {}
      : {
          confidence:
            confidence as NonNullable<VerificationCreateInput["confidence"]>,
        }),
  };
};

const expectVerificationFailure = async (
  input: VerificationCreateInput,
  code: VerificationFailureCode,
): Promise<VerificationError> => {
  try {
    await Verification.create(input);
    throw new Error("Expected Verification construction to fail.");
  } catch (error) {
    expect(error).toBeInstanceOf(VerificationError);
    const governed = error as VerificationError;
    expect(governed.code).toBe(code);
    expect(Object.isFrozen(governed)).toBe(true);
    expect(Object.isFrozen(governed.details)).toBe(true);
    return governed;
  }
};

describe("Verification canonical construction", () => {
  it("constructs one immutable judgment for one ObservedOutcome", async () => {
    const input = await verificationInput();
    const verification = await Verification.create(input);

    expect(domain.Verification).toBe(Verification);
    expect(verification).toBeInstanceOf(Verification);
    expect(verification.verificationId).toBe(verification.id);
    expect(verification.verificationId.value).toMatch(
      /^verification:v1:[0-9a-f]{64}$/u,
    );
    expect(verification.organizationId).toBe(
      input.observedOutcome.organizationId,
    );
    expect(verification.observedOutcomeId).toBe(
      input.observedOutcome.observedOutcomeId,
    );
    expect(verification.subjectType).toBe("observed_outcome");
    expect(verification.evidenceIds).toHaveLength(1);
    expect(verification.judgment).toBe("confirmed");
    expect(verification.version).toBe("1.0.0");
    expect(verification.schemaVersion).toBe("verification:v1");
    expect(Object.isFrozen(verification)).toBe(true);
    expect(Object.isFrozen(verification.evidenceIds)).toBe(true);
    expect(Object.isFrozen(verification.limitations)).toBe(true);
    expect(Object.isFrozen(verification.confidence)).toBe(true);
  });
  it("canonicalizes collection order into one deterministic identity", async () => {
    const observedOutcome = await createObservedOutcome();
    const evidenceA = createEvidence(
      observedOutcome.organizationId,
      "evidence_a",
    );
    const evidenceB = createEvidence(
      observedOutcome.organizationId,
      "evidence_b",
    );

    const first = await Verification.create(
      await verificationInput({
        observedOutcome,
        evidence: [evidenceB, evidenceA],
        limitations: [
          "Secondary limitation.",
          "Primary limitation.",
        ],
      }),
    );

    const second = await Verification.create(
      await verificationInput({
        observedOutcome,
        evidence: [evidenceA, evidenceB],
        limitations: [
          "Primary limitation.",
          "Secondary limitation.",
        ],
      }),
    );

    expect(first.verificationId.value).toBe(
      second.verificationId.value,
    );
    expect(first.equals(second)).toBe(true);
    expect(first.evidenceIds.map(({ value }) => value)).toEqual([
      "evidence_a",
      "evidence_b",
    ]);
    expect(first.limitations).toEqual([
      "Primary limitation.",
      "Secondary limitation.",
    ]);
  });
  it("rejects an empty Evidence collection deterministically", async () => {
    const error = await expectVerificationFailure(
      await verificationInput({ evidence: [] }),
      "INVALID_VERIFICATION_EVIDENCE_COLLECTION",
    );

    expect(error.details).toEqual({
      field: "evidence",
    });
  });
  it("reports Evidence temporal failure in caller order", async () => {
    const observedOutcome = await createObservedOutcome();

    const firstCallerEvidence = createEvidence(
      observedOutcome.organizationId,
      "evidence_later",
      "2026-07-22T14:05:00.250Z",
    );

    const secondCallerEvidence = createEvidence(
      observedOutcome.organizationId,
      "evidence_earlier",
      "2026-07-22T14:04:00.250Z",
    );

    const error = await expectVerificationFailure(
      await verificationInput({
        observedOutcome,
        evidence: [
          firstCallerEvidence,
          secondCallerEvidence,
        ],
        verifiedAt: "2026-07-22T14:03:00.250Z",
      }),
      "VERIFICATION_PRECEDES_EVIDENCE",
    );

    expect(error.details).toEqual({
      field: "verifiedAt",
      index: "0",
    });
  });
  it("omits absent optional fields from canonical serialization", async () => {
    const input = await verificationInput();
    const {
      verifierId: _verifierId,
      notes: _notes,
      confidence: _confidence,
      ...requiredInput
    } = input;

    const verification = await Verification.create(requiredInput);
    const serialized = verification.toJSON();

    expect(Object.keys(serialized)).toEqual([
      "verificationId",
      "organizationId",
      "observedOutcomeId",
      "subjectType",
      "evidenceIds",
      "method",
      "judgment",
      "verifiedAt",
      "limitations",
      "version",
      "schemaVersion",
    ]);
    expect(serialized).not.toHaveProperty("verifierId");
    expect(serialized).not.toHaveProperty("notes");
    expect(serialized).not.toHaveProperty("confidence");
    expect(verification.serialize()).toBe(JSON.stringify(serialized));
    expect(Object.isFrozen(serialized)).toBe(true);
    expect(Object.isFrozen(serialized.evidenceIds)).toBe(true);
    expect(Object.isFrozen(serialized.limitations)).toBe(true);
  });

  it("preserves calibrated confidence authority canonically", async () => {
    const verification = await Verification.create(
      await verificationInput({
        confidence: {
          calibrationStatus: "calibrated",
          value: score(9_000),
          basis: "Validated against the released calibration record.",
          calibrationRecordId: id("calibration_record_001"),
        },
      }),
    );

    expect(verification.confidence).toEqual({
      calibrationStatus: "calibrated",
      value: score(9_000),
      basis: "Validated against the released calibration record.",
      calibrationRecordId: id("calibration_record_001"),
    });

    expect(verification.toJSON().confidence).toEqual({
      calibrationStatus: "calibrated",
      valueBasisPoints: 9_000,
      basis: "Validated against the released calibration record.",
      calibrationRecordId: "calibration_record_001",
    });
    expect(Object.isFrozen(verification.toJSON().confidence)).toBe(true);
  });
  it("enforces confidence calibration states deterministically", async () => {
    const cases: readonly Readonly<{
      confidence: unknown;
      code: VerificationFailureCode;
      field: string;
    }>[] = [
      {
        confidence: null,
        code: "INVALID_VERIFICATION_CONFIDENCE",
        field: "confidence",
      },
      {
        confidence: {
          calibrationStatus: "estimated",
          value: score(),
          basis: "Unsupported calibration state.",
        },
        code: "INVALID_CONFIDENCE_CALIBRATION_STATUS",
        field: "confidence.calibrationStatus",
      },
      {
        confidence: {
          calibrationStatus: "uncalibrated",
          value: score(),
          basis: "No calibration authority exists.",
          calibrationRecordId: id("calibration_record_001"),
        },
        code: "UNEXPECTED_CALIBRATION_RECORD_ID",
        field: "confidence.calibrationRecordId",
      },
      {
        confidence: {
          calibrationStatus: "calibrated",
          value: score(),
          basis: "Calibration authority is required.",
        },
        code: "MISSING_CALIBRATION_RECORD_ID",
        field: "confidence.calibrationRecordId",
      },
    ];

    for (const testCase of cases) {
      const error = await expectVerificationFailure(
        await verificationInput({
          confidence: testCase.confidence,
        }),
        testCase.code,
      );

      expect(error.details).toEqual({
        field: testCase.field,
      });
    }
  });
  it("enforces required-field validation stages deterministically", async () => {
    const valid = await verificationInput();

    const {
      observedOutcome: _observedOutcome,
      ...withoutObservedOutcome
    } = valid;
    const {
      evidence: _evidence,
      ...withoutEvidence
    } = valid;
    const {
      method: _method,
      ...withoutMethod
    } = valid;
    const {
      judgment: _judgment,
      ...withoutJudgment
    } = valid;
    const {
      verifiedAt: _verifiedAt,
      ...withoutVerifiedAt
    } = valid;
    const {
      limitations: _limitations,
      ...withoutLimitations
    } = valid;

    const cases: readonly Readonly<{
      input: VerificationCreateInput;
      code: VerificationFailureCode;
      field: string;
    }>[] = [
      {
        input: null as unknown as VerificationCreateInput,
        code: "INVALID_VERIFICATION_INPUT",
        field: "input",
      },
      {
        input: withoutObservedOutcome as VerificationCreateInput,
        code: "MISSING_OBSERVED_OUTCOME",
        field: "observedOutcome",
      },
      {
        input: withoutEvidence as VerificationCreateInput,
        code: "MISSING_VERIFICATION_EVIDENCE",
        field: "evidence",
      },
      {
        input: withoutMethod as VerificationCreateInput,
        code: "MISSING_VERIFICATION_METHOD",
        field: "method",
      },
      {
        input: withoutJudgment as VerificationCreateInput,
        code: "MISSING_VERIFICATION_JUDGMENT",
        field: "judgment",
      },
      {
        input: withoutVerifiedAt as VerificationCreateInput,
        code: "MISSING_VERIFICATION_TIMESTAMP",
        field: "verifiedAt",
      },
      {
        input: withoutLimitations as VerificationCreateInput,
        code: "MISSING_VERIFICATION_LIMITATIONS",
        field: "limitations",
      },
    ];

    for (const testCase of cases) {
      const error = await expectVerificationFailure(
        testCase.input,
        testCase.code,
      );

      expect(error.details).toEqual({
        field: testCase.field,
      });
    }
  });
  it("enforces observation and Evidence temporal boundaries", async () => {
    const beforeObservation = await expectVerificationFailure(
      await verificationInput({
        verifiedAt: "2026-07-22T13:59:59.999Z",
      }),
      "VERIFICATION_PRECEDES_OBSERVATION",
    );

    expect(beforeObservation.details).toEqual({
      field: "verifiedAt",
    });

    const beforeEvidence = await expectVerificationFailure(
      await verificationInput({
        verifiedAt: "2026-07-22T14:01:00.250Z",
      }),
      "VERIFICATION_PRECEDES_EVIDENCE",
    );

    expect(beforeEvidence.details).toEqual({
      field: "verifiedAt",
      index: "0",
    });

    const equalToEvidenceTime = await Verification.create(
      await verificationInput({
        verifiedAt: "2026-07-22T14:02:00.250Z",
      }),
    );

    expect(equalToEvidenceTime.verifiedAt).toBe(
      "2026-07-22T14:02:00.250Z",
    );
  });
  it("rejects invalid governed fields with stable diagnostics", async () => {
    const valid = await verificationInput();

    const cases: readonly Readonly<{
      input: VerificationCreateInput;
      code: VerificationFailureCode;
      details: Readonly<Record<string, string>>;
    }>[] = [
      {
        input: {
          ...valid,
          method: "   ",
        },
        code: "INVALID_VERIFICATION_METHOD",
        details: { field: "method" },
      },
      {
        input: {
          ...valid,
          judgment: "approved" as VerificationCreateInput["judgment"],
        },
        code: "INVALID_VERIFICATION_JUDGMENT",
        details: { field: "judgment" },
      },
      {
        input: {
          ...valid,
          verifiedAt: "2026-07-22T14:03:00.2500Z",
        },
        code: "INVALID_VERIFICATION_TIMESTAMP",
        details: { field: "verifiedAt" },
      },
      {
        input: {
          ...valid,
          limitations:
            "Not a collection" as unknown as readonly string[],
        },
        code: "INVALID_VERIFICATION_LIMITATIONS",
        details: { field: "limitations" },
      },
      {
        input: {
          ...valid,
          limitations: ["Valid limitation.", "   "],
        },
        code: "INVALID_VERIFICATION_LIMITATION",
        details: {
          field: "limitations",
          index: "1",
        },
      },
      {
        input: {
          ...valid,
          limitations: ["Duplicate limitation.", " Duplicate limitation. "],
        },
        code: "DUPLICATE_VERIFICATION_LIMITATION",
        details: {
          field: "limitations",
          index: "1",
        },
      },
      {
        input: {
          ...valid,
          verifierId: "verifier_001" as unknown as Identifier,
        },
        code: "INVALID_VERIFIER_ID",
        details: { field: "verifierId" },
      },
      {
        input: {
          ...valid,
          notes: "   ",
        },
        code: "INVALID_VERIFICATION_NOTES",
        details: { field: "notes" },
      },
    ];

    for (const testCase of cases) {
      const error = await expectVerificationFailure(
        testCase.input,
        testCase.code,
      );

      expect(error.details).toEqual(testCase.details);
    }
  });
  it("enforces canonical Verification lineage deterministically", async () => {
    const valid = await verificationInput();
    const foreignEvidence = createEvidence(
      id("org_foreign"),
      "evidence_foreign",
    );
    const duplicateEvidence = valid.evidence[0]!;

    const cases: readonly Readonly<{
      input: VerificationCreateInput;
      code: VerificationFailureCode;
      details: Readonly<Record<string, string>>;
    }>[] = [
      {
        input: {
          ...valid,
          observedOutcome:
            {} as VerificationCreateInput["observedOutcome"],
        },
        code: "INVALID_OBSERVED_OUTCOME",
        details: { field: "observedOutcome" },
      },
      {
        input: {
          ...valid,
          evidence: [
            {} as VerificationCreateInput["evidence"][number],
          ],
        },
        code: "INVALID_VERIFICATION_EVIDENCE",
        details: {
          field: "evidence",
          index: "0",
        },
      },
      {
        input: {
          ...valid,
          evidence: [foreignEvidence],
        },
        code: "EVIDENCE_ORGANIZATION_MISMATCH",
        details: {
          field: "evidence",
          index: "0",
        },
      },
      {
        input: {
          ...valid,
          evidence: [
            duplicateEvidence,
            duplicateEvidence,
          ],
        },
        code: "DUPLICATE_VERIFICATION_EVIDENCE",
        details: {
          field: "evidence",
          index: "1",
        },
      },
    ];

    for (const testCase of cases) {
      const error = await expectVerificationFailure(
        testCase.input,
        testCase.code,
      );

      expect(error.details).toEqual(testCase.details);
    }
  });
  it("maps SHA-256 rejection to the governed identity failure", async () => {
    const input = await verificationInput();
    const digestSpy = vi
      .spyOn(globalThis.crypto.subtle, "digest")
      .mockRejectedValueOnce(new Error("blocked"));

    try {
      const error = await expectVerificationFailure(
        input,
        "VERIFICATION_IDENTITY_DERIVATION_FAILED",
      );

      expect(error.details).toEqual({
        operation: "SHA-256",
      });
    } finally {
      digestSpy.mockRestore();
    }
  });

  it("maps canonical JSON rejection to the governed serialization failure", async () => {
    const input = await verificationInput();
    const stringifySpy = vi
      .spyOn(JSON, "stringify")
      .mockImplementationOnce(() => {
        throw new Error("blocked");
      });

    try {
      const error = await expectVerificationFailure(
        input,
        "VERIFICATION_SERIALIZATION_FAILED",
      );

      expect(error.details).toEqual({
        operation: "canonical-json",
      });
    } finally {
      stringifySpy.mockRestore();
    }
  });
});
