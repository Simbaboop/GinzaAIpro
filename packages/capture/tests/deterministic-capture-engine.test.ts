import {
  CaptureInput,
  EngineContext,
  type EngineResult,
} from "@ginzaaipro/core";
import {
  BusinessSignal,
  Identifier,
  Money,
  Percentage,
  type BusinessSignalCategory,
  type BusinessSignalValue,
} from "@ginzaaipro/domain";
import { describe, expect, it, vi } from "vitest";
import {
  CaptureDiagnosticCodes,
  DeterministicCaptureEngine,
} from "../src/index.js";

interface CaptureInputValues {
  readonly organizationId: Identifier;
  readonly category: BusinessSignalCategory;
  readonly source: string;
  readonly sourceReference: string;
  readonly occurredAt: string;
  readonly value: BusinessSignalValue;
  readonly deterministicIdentityMaterial: string;
  readonly subjectId: Identifier | undefined;
  readonly confidence: Percentage | undefined;
}

const id = (value: string): Identifier => new Identifier(value);
const suppliedConfidence = Percentage.fromBasisPoints(8_000);
const organizationId = id("org_001");
const executionTime = new Date("2026-07-18T12:00:00.000Z");

const defaults = (): CaptureInputValues => ({
  organizationId,
  category: "operational",
  source: "dispatch",
  sourceReference: "job_001",
  occurredAt: "2026-07-18T11:00:00.000Z",
  value: "scheduled",
  deterministicIdentityMaterial: "dispatch-job-001",
  subjectId: undefined,
  confidence: suppliedConfidence,
});

const captureInput = (
  overrides: Partial<CaptureInputValues> = {},
): CaptureInput => {
  const values = { ...defaults(), ...overrides };
  return new CaptureInput(
    values.organizationId,
    values.category,
    values.source,
    values.sourceReference,
    values.occurredAt,
    values.value,
    values.deterministicIdentityMaterial,
    values.subjectId,
    values.confidence,
  );
};

const context = (
  organization: Identifier = organizationId,
  at: Date = executionTime,
): EngineContext =>
  new EngineContext(organization, id("cor_001"), at, id("employee_001"));

const execute = (
  input: CaptureInput = captureInput(),
  engineContext: EngineContext = context(),
): Promise<EngineResult<BusinessSignal>> =>
  new DeterministicCaptureEngine().execute(input, engineContext);

const expectFailure = (
  result: EngineResult<BusinessSignal>,
  code: string,
): void => {
  expect(result.success).toBe(false);
  expect(result.value).toBeUndefined();
  expect(result.diagnostics).toHaveLength(1);
  expect(result.diagnostics[0]?.severity).toBe("error");
  expect(result.diagnostics[0]?.code).toBe(code);
  expect(result.explanation.evidenceIds).toEqual([]);
  expect(result.explanation.reasoning).toBe(
    `Capture failed at ${code}; no BusinessSignal was created.`,
  );
};

const signalSnapshot = (signal: BusinessSignal) => ({
  id: signal.id.value,
  organizationId: signal.organizationId.value,
  category: signal.category,
  source: signal.source,
  occurredAt: signal.occurredAt,
  capturedAt: signal.capturedAt,
  subjectId: signal.subjectId?.value,
  value:
    signal.value instanceof Percentage
      ? { percentageBasisPoints: signal.value.basisPoints }
      : signal.value instanceof Money
        ? {
            moneyMinorUnits: signal.value.minorUnits,
            moneyCurrency: signal.value.currency,
          }
        : signal.value,
  confidence: signal.confidence.basisPoints,
  validationStatus: signal.validationStatus,
  validationNotes: signal.validationNotes,
});

describe("DeterministicCaptureEngine success behavior", () => {
  it("produces a canonically mapped immutable BusinessSignal", async () => {
    const subjectId = id("customer_001");
    const result = await execute(
      captureInput({
        source: " dispa\u0301tch ",
        sourceReference: " job_001 ",
        occurredAt: "2026-07-18T07:00:00-04:00",
        value: " sche\u0301duled ",
        deterministicIdentityMaterial: " dispatch-job-001 ",
        subjectId,
      }),
    );

    expect(result.success).toBe(true);
    expect(result.value).toBeInstanceOf(BusinessSignal);
    expect(result.value?.organizationId).toBe(organizationId);
    expect(result.value?.category).toBe("operational");
    expect(result.value?.source).toBe("dispátch");
    expect(result.value?.occurredAt).toBe("2026-07-18T11:00:00.000Z");
    expect(result.value?.capturedAt).toBe("2026-07-18T12:00:00.000Z");
    expect(result.value?.value).toBe("schéduled");
    expect(result.value?.subjectId).toBe(subjectId);
    expect(result.value?.confidence).toBe(suppliedConfidence);
    expect(result.value?.validationStatus).toBe("unvalidated");
    expect(result.value?.validationNotes).toBeUndefined();
    expect(result.diagnostics.map(({ code }) => code)).toEqual([
      CaptureDiagnosticCodes.Succeeded,
    ]);
    expect(result.explanation.evidenceIds).toEqual([]);
    expect(result.explanation.assumptions).toEqual([]);
    expect(result.explanation.limitations).toEqual([]);
    expect(result.explanation.confidence).toBe(suppliedConfidence);
    expect(result.explanation.reasoning).toContain(
      "Capture made no truth, reliability, or Evidence claim.",
    );
  });

  it("constructs the exact deterministic SHA-256 identity", async () => {
    const first = await execute();
    const second = await execute();

    expect(first.value?.id.value).toBe(
      "business-signal:capture:v1:1933fb36179b17ae2c822c15f6ba97773a9bd320e467d2bcd94702ffaad3eb15",
    );
    expect(second.value?.id.equals(first.value!.id)).toBe(true);
  });

  it("changes identity when source reference or identity material changes", async () => {
    const baseline = await execute();
    const changedReference = await execute(
      captureInput({ sourceReference: "job_002" }),
    );
    const changedMaterial = await execute(
      captureInput({ deterministicIdentityMaterial: "dispatch-job-002" }),
    );

    expect(changedReference.value?.id.equals(baseline.value!.id)).toBe(false);
    expect(changedMaterial.value?.id.equals(baseline.value!.id)).toBe(false);
  });

  it("preserves supplied confidence", async () => {
    const confidence = Percentage.fromBasisPoints(6_750);
    const result = await execute(captureInput({ confidence }));

    expect(result.value?.confidence).toBe(confidence);
    expect(result.explanation.confidence).toBe(confidence);
    expect(result.diagnostics.map(({ code }) => code)).toEqual([
      CaptureDiagnosticCodes.Succeeded,
    ]);
  });

  it("uses the documented zero-basis-point confidence default", async () => {
    const result = await execute(captureInput({ confidence: undefined }));

    expect(result.success).toBe(true);
    expect(result.value?.confidence.basisPoints).toBe(0);
    expect(result.explanation.confidence.basisPoints).toBe(0);
    expect(result.explanation.limitations).toEqual([
      "Initial confidence was not supplied; zero basis points was applied.",
    ]);
    expect(result.diagnostics.map(({ code }) => code)).toEqual([
      CaptureDiagnosticCodes.ConfidenceDefaulted,
      CaptureDiagnosticCodes.Succeeded,
    ]);
    expect(result.diagnostics.every(({ severity }) => severity === "info"))
      .toBe(true);
  });

  it("always initializes unvalidated status and undefined notes", async () => {
    const result = await execute();

    expect(result.value?.validationStatus).toBe("unvalidated");
    expect(result.value?.validationNotes).toBeUndefined();
  });

  it("preserves an optional subject and leaves an absent subject undefined", async () => {
    const subject = id("customer_001");
    const withSubject = await execute(captureInput({ subjectId: subject }));
    const withoutSubject = await execute(
      captureInput({ subjectId: undefined }),
    );

    expect(withSubject.value?.subjectId).toBe(subject);
    expect(withoutSubject.value?.subjectId).toBeUndefined();
  });

  it("preserves every canonical non-string value type", async () => {
    const values: readonly BusinessSignalValue[] = [
      42,
      -0,
      42n,
      true,
      new Money(12_345n, "usd"),
      Percentage.fromBasisPoints(2_500),
    ];

    for (const value of values) {
      const result = await execute(captureInput({ value }));
      expect(result.success).toBe(true);
      if (Object.is(value, -0)) {
        expect(Object.is(result.value?.value, 0)).toBe(true);
      } else {
        expect(result.value?.value).toBe(value);
      }
    }
  });

  it("uses EngineContext execution time without consulting Date.now", async () => {
    const dateNow = vi.spyOn(Date, "now");
    const result = await execute();

    expect(dateNow).not.toHaveBeenCalled();
    expect(result.value?.capturedAt).toBe(executionTime.toISOString());
    expect(result.durationMs).toBe(0);
    dateNow.mockRestore();
  });
});

describe("DeterministicCaptureEngine failure behavior", () => {
  it("rejects organization mismatch with no value", async () => {
    const result = await execute(captureInput(), context(id("org_002")));

    expectFailure(result, CaptureDiagnosticCodes.OrganizationMismatch);
  });

  it("rejects a non-canonical category", async () => {
    const result = await execute(
      captureInput({
        category: "unknown" as BusinessSignalCategory,
      }),
    );

    expectFailure(result, CaptureDiagnosticCodes.CategoryInvalid);
  });

  it("rejects an empty source", async () => {
    const result = await execute(captureInput({ source: " \t " }));

    expectFailure(result, CaptureDiagnosticCodes.SourceEmpty);
  });

  it("rejects an empty source reference", async () => {
    const result = await execute(
      captureInput({ sourceReference: " \t " }),
    );

    expectFailure(result, CaptureDiagnosticCodes.SourceReferenceEmpty);
  });

  it.each([
    "not-a-date",
    "2026-07-18T11:00:00",
    "2026-02-30T11:00:00Z",
    "2026-07-18T24:00:00Z",
    "2026-07-18T11:00:60Z",
    "2026-07-18T11:00:00+24:00",
  ])("rejects invalid occurrence timestamp %s", async (occurredAt) => {
    const result = await execute(captureInput({ occurredAt }));

    expectFailure(result, CaptureDiagnosticCodes.OccurrenceInvalid);
  });

  it("rejects capture time before occurrence", async () => {
    const result = await execute(
      captureInput({ occurredAt: "2026-07-18T12:00:00.001Z" }),
    );

    expectFailure(result, CaptureDiagnosticCodes.TimeOrderInvalid);
  });

  it.each([" ", Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY])(
    "rejects invalid value %s",
    async (value) => {
      const result = await execute(
        captureInput({ value: value as BusinessSignalValue }),
      );

      expectFailure(result, CaptureDiagnosticCodes.ValueInvalid);
    },
  );

  it("rejects an invalid runtime subject", async () => {
    const result = await execute(
      captureInput({
        subjectId: "customer_001" as unknown as Identifier,
      }),
    );

    expectFailure(result, CaptureDiagnosticCodes.SubjectInvalid);
  });

  it("rejects an invalid runtime confidence", async () => {
    const result = await execute(
      captureInput({
        confidence: 8_000 as unknown as Percentage,
      }),
    );

    expectFailure(result, CaptureDiagnosticCodes.ConfidenceInvalid);
    expect(result.explanation.confidence.basisPoints).toBe(0);
  });

  it("rejects empty deterministic identity material", async () => {
    const result = await execute(
      captureInput({ deterministicIdentityMaterial: " \t " }),
    );

    expectFailure(result, CaptureDiagnosticCodes.IdentityMaterialEmpty);
  });

  it("returns only the first error in the normative fail-fast order", async () => {
    const result = await execute(
      captureInput({
        organizationId: id("org_002"),
        category: "unknown" as BusinessSignalCategory,
        source: "",
        sourceReference: "",
        occurredAt: "invalid",
        value: "",
        deterministicIdentityMaterial: "",
      }),
    );

    expectFailure(result, CaptureDiagnosticCodes.OrganizationMismatch);
  });
});

describe("Determinism and immutability", () => {
  it("produces equivalent substantive outputs for equivalent normalized inputs", async () => {
    const first = await execute(
      captureInput({
        source: " café ",
        sourceReference: " re\u0301f-001 ",
        value: " re\u0301sult ",
        deterministicIdentityMaterial: " mate\u0301rial ",
      }),
    );
    const second = await execute(
      captureInput({
        source: "café",
        sourceReference: "réf-001",
        value: "résult",
        deterministicIdentityMaterial: "matérial",
      }),
    );

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    expect(signalSnapshot(first.value!)).toEqual(signalSnapshot(second.value!));
    expect(first.diagnostics).toEqual(second.diagnostics);
    expect(first.explanation).toEqual(second.explanation);
  });

  it("keeps input and domain value objects immutable", async () => {
    const money = new Money(12_345n, "usd");
    const input = captureInput({ value: money });
    const before = {
      source: input.source,
      sourceReference: input.sourceReference,
      occurredAt: input.occurredAt,
      value: input.value,
    };

    await execute(input);

    expect(Object.isFrozen(input)).toBe(true);
    expect(Object.isFrozen(money)).toBe(true);
    expect({
      source: input.source,
      sourceReference: input.sourceReference,
      occurredAt: input.occurredAt,
      value: input.value,
    }).toEqual(before);
  });

  it("returns deeply immutable canonical result records", async () => {
    const result = await execute(captureInput({ confidence: undefined }));

    expect(Object.isFrozen(result)).toBe(true);
    expect(Object.isFrozen(result.value)).toBe(true);
    expect(Object.isFrozen(result.value?.id)).toBe(true);
    expect(Object.isFrozen(result.diagnostics)).toBe(true);
    expect(result.diagnostics.every(Object.isFrozen)).toBe(true);
    expect(Object.isFrozen(result.explanation)).toBe(true);
    expect(Object.isFrozen(result.explanation.evidenceIds)).toBe(true);
    expect(Object.isFrozen(result.explanation.assumptions)).toBe(true);
    expect(Object.isFrozen(result.explanation.limitations)).toBe(true);
    expect(() =>
      (result.diagnostics as unknown as unknown[]).push("mutation"),
    ).toThrow();
    expect(() =>
      (result.explanation.limitations as unknown as string[]).push(
        "mutation",
      ),
    ).toThrow();
  });
});
