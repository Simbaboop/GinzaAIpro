import {
  Identifier,
  Intelligence,
  Percentage,
  PriorityProfile,
  type BusinessSignal,
  type Evidence,
  type RuntimeExecutionPlan,
  type LearningRecord,
  type Outcome,
  type Recommendation,
  type Verification,
} from "@ginzaaipro/domain";
import { describe, expect, it } from "vitest";
import {
  Diagnostic,
  CaptureInput,
  EngineContext,
  EngineResult,
  Explanation,
  RecommendationInput,
  VerificationInput,
  type CaptureEngine,
  type ExecutionEngine,
  type IntelligenceEngine,
  type LearningEngine,
  type PrioritizationEngine,
  type RecommendationEngine,
  type ValidationEngine,
  type VerificationEngine,
} from "../src/index.js";

const id = (value: string): Identifier => new Identifier(value);
const confidence = Percentage.fromBasisPoints(8_000);
const explanation = () =>
  new Explanation([], [], [], confidence, "Test-only contract result.");

describe("shared core contracts", () => {
  it("constructs an immutable context and defensively copies execution time", () => {
    const sourceTime = new Date("2026-07-18T12:00:00.000Z");
    const context = new EngineContext(
      id("org_001"),
      id("cor_001"),
      sourceTime,
      id("emp_001"),
    );

    sourceTime.setUTCFullYear(2030);
    const exposedTime = context.executionTime;
    exposedTime.setUTCFullYear(2040);

    expect(context.executionTime.toISOString()).toBe(
      "2026-07-18T12:00:00.000Z",
    );
    expect(Object.isFrozen(context)).toBe(true);
  });

  it("rejects an invalid context execution time", () => {
    expect(
      () =>
        new EngineContext(
          id("org_001"),
          id("cor_001"),
          new Date("invalid"),
        ),
    ).toThrow("execution time");
  });

  it("constructs normalized immutable diagnostics", () => {
    const diagnostic = new Diagnostic(
      "warning",
      " SIGNAL_DELAY ",
      " Signal capture was delayed. ",
      " Review the source clock. ",
    );

    expect(diagnostic.code).toBe("SIGNAL_DELAY");
    expect(diagnostic.message).toBe("Signal capture was delayed.");
    expect(diagnostic.recommendation).toBe("Review the source clock.");
    expect(Object.isFrozen(diagnostic)).toBe(true);
    expect(() => new Diagnostic("error", " ", "Message")).toThrow("code");
    expect(() => new Diagnostic("error", "CODE", " ")).toThrow("message");
    expect(() => new Diagnostic("info", "CODE", "Message", " ")).toThrow(
      "recommendation",
    );
  });

  it("constructs explanations with defensively copied collections", () => {
    const evidenceIds = [id("evd_001")];
    const assumptions = [" Complete source data. "];
    const limitations = [" Seasonality is not isolated. "];
    const record = new Explanation(
      evidenceIds,
      assumptions,
      limitations,
      confidence,
      " The evidence consistently supports the result. ",
    );

    evidenceIds.push(id("evd_002"));
    assumptions.push("Later mutation");
    limitations.push("Later mutation");

    expect(record.evidenceIds).toHaveLength(1);
    expect(record.assumptions).toEqual(["Complete source data."]);
    expect(record.limitations).toEqual(["Seasonality is not isolated."]);
    expect(record.reasoning).toBe(
      "The evidence consistently supports the result.",
    );
    expect(Object.isFrozen(record.evidenceIds)).toBe(true);
    expect(Object.isFrozen(record.assumptions)).toBe(true);
    expect(Object.isFrozen(record.limitations)).toBe(true);
    expect(() => new Explanation([], [], [], confidence, " ")).toThrow(
      "reasoning",
    );
  });

  it("enforces successful result invariants and immutable diagnostics", () => {
    const diagnostics = [
      new Diagnostic("info", "CAPTURED", "Signal captured."),
    ];
    const result = new EngineResult(
      true,
      "value",
      diagnostics,
      explanation(),
      12.5,
    );
    diagnostics.push(new Diagnostic("warning", "LATE", "Signal was late."));

    expect(result.success).toBe(true);
    expect(result.value).toBe("value");
    expect(result.diagnostics).toHaveLength(1);
    expect(Object.isFrozen(result.diagnostics)).toBe(true);
    expect(Object.isFrozen(result)).toBe(true);
    expect(
      () => new EngineResult<string>(true, undefined, [], explanation(), 0),
    ).toThrow("requires a value");
  });

  it("enforces failed result invariants without partial values", () => {
    const error = new Diagnostic(
      "error",
      "VALIDATION_FAILED",
      "The signal could not support evidence.",
    );
    const result = new EngineResult<string>(
      false,
      undefined,
      [error],
      explanation(),
      4,
    );

    expect(result.success).toBe(false);
    expect(result.value).toBeUndefined();
    expect(
      () =>
        new EngineResult<string>(
          false,
          undefined,
          [new Diagnostic("warning", "WARN", "Expected condition.")],
          explanation(),
          1,
        ),
    ).toThrow("error diagnostic");
    expect(
      () =>
        new EngineResult(false, "partial", [error], explanation(), 1),
    ).toThrow("cannot contain a value");
  });

  it("rejects negative and non-finite result durations", () => {
    for (const duration of [-1, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(
        () =>
          new EngineResult(true, "value", [], explanation(), duration),
      ).toThrow("finite and non-negative");
    }
  });
});

describe("specialized engine contracts", () => {
  it("constructs an immutable canonical capture input", () => {
    const organizationId = id("org_001");
    const subjectId = id("customer_001");
    const input = new CaptureInput(
      organizationId,
      "operational",
      " dispatch ",
      " job_001 ",
      "2026-07-18T11:00:00.000Z",
      "scheduled",
      "dispatch-job-001",
      subjectId,
      confidence,
    );

    expect(input.organizationId).toBe(organizationId);
    expect(input.category).toBe("operational");
    expect(input.source).toBe(" dispatch ");
    expect(input.sourceReference).toBe(" job_001 ");
    expect(input.occurredAt).toBe("2026-07-18T11:00:00.000Z");
    expect(input.value).toBe("scheduled");
    expect(input.deterministicIdentityMaterial).toBe("dispatch-job-001");
    expect(input.subjectId).toBe(subjectId);
    expect(input.confidence).toBe(confidence);
    expect(Object.isFrozen(input)).toBe(true);
  });

  it("retains intelligence and priorities without mutating source collections", () => {
    const organizationId = id("org_001");
    const intelligence = new Intelligence(
      id("int_001"),
      organizationId,
      "opportunity",
      "Scheduling opportunity",
      "Grouped work reduces travel.",
      [id("evd_001")],
      confidence,
      [],
      [],
      "2026-07-18T12:00:00.000Z",
    );
    const priority = new PriorityProfile(
      id("pri_001"),
      organizationId,
      intelligence.id,
      confidence,
      confidence,
      confidence,
      confidence,
      confidence,
    );
    const intelligenceSource = [intelligence];
    const prioritySource = [priority];
    const input = new RecommendationInput(
      intelligenceSource,
      prioritySource,
    );

    intelligenceSource.push(intelligence);
    prioritySource.push(priority);

    expect(input.intelligence).toEqual([intelligence]);
    expect(input.priorities).toEqual([priority]);
    expect(Object.isFrozen(input.intelligence)).toBe(true);
    expect(Object.isFrozen(input.priorities)).toBe(true);
    expect(Object.isFrozen(input)).toBe(true);
  });

  it("models verification as a request that precedes the result", () => {
    const evidenceIds = [id("evd_001")];
    const input = new VerificationInput(
      id("org_001"),
      "action",
      id("act_001"),
      "Configuration audit",
      evidenceIds,
      id("emp_001"),
      "Confirm the completed configuration.",
    );
    evidenceIds.push(id("evd_002"));

    expect(input.evidenceIds).toHaveLength(1);
    expect(input).not.toHaveProperty("result");
    expect(input).not.toHaveProperty("verifiedAt");
    expect(Object.isFrozen(input.evidenceIds)).toBe(true);
    expect(Object.isFrozen(input)).toBe(true);
  });

  it("supports every specialized Engine interface", () => {
    const successful = <TOutput>(value: TOutput): EngineResult<TOutput> =>
      new EngineResult(true, value, [], explanation(), 0);

    const signal = {} as BusinessSignal;
    const evidence = {} as Evidence;
    const intelligence = {} as Intelligence;
    const priority = {} as PriorityProfile;
    const recommendation = {} as Recommendation;
    const plan = {} as RuntimeExecutionPlan;
    const verification = {} as Verification;
    const outcome = {} as Outcome;
    const learning = {} as LearningRecord;
    const captureInput = new CaptureInput(
      id("org_001"),
      "operational",
      "dispatch",
      "job_001",
      "2026-07-18T11:00:00.000Z",
      "scheduled",
      "dispatch-job-001",
    );

    const capture: CaptureEngine = {
      execute: async () => successful(signal),
    };
    const validation: ValidationEngine = {
      execute: async () => successful(evidence),
    };
    const intelligenceEngine: IntelligenceEngine = {
      execute: async () => successful([intelligence]),
    };
    const prioritization: PrioritizationEngine = {
      execute: async () => successful([priority]),
    };
    const recommendationEngine: RecommendationEngine = {
      execute: async () => successful([recommendation]),
    };
    const execution: ExecutionEngine = {
      execute: async () => successful(plan),
    };
    const verificationEngine: VerificationEngine = {
      execute: async () => successful(verification),
    };
    const learningEngine: LearningEngine = {
      execute: async () => successful([learning]),
    };

    expect([
      capture,
      validation,
      intelligenceEngine,
      prioritization,
      recommendationEngine,
      execution,
      verificationEngine,
      learningEngine,
      signal,
      outcome,
      captureInput,
    ]).toHaveLength(11);
  });
});
