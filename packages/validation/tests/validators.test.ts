import {
  Diagnostic,
  EngineContext,
  Explanation,
} from "@ginzaaipro/core";
import {
  BusinessSignal,
  Identifier,
  Percentage,
  type BusinessSignal as BusinessSignalContract,
} from "@ginzaaipro/domain";
import { describe, expect, it } from "vitest";
import { ValidationResult } from "../src/models/index.js";
import {
  CompletenessValidator,
  ConsistencyValidator,
  IdentityValidator,
  IntegrityValidator,
  QualificationValidator,
  runValidationPipeline,
  type Validator,
} from "../src/validators/index.js";

const confidence = Percentage.fromBasisPoints(8_000);
const context = new EngineContext(
  new Identifier("org_001"),
  new Identifier("cor_001"),
  new Date("2026-07-18T12:00:00.000Z"),
);
const signal = (
  value: string | number = 42,
  status: "valid" | "unvalidated" = "valid",
) =>
  new BusinessSignal(
    new Identifier("sig_001"),
    context.organizationId,
    "system",
    "scheduler",
    "2026-07-18T10:00:00.000Z",
    "2026-07-18T10:01:00.000Z",
    value,
    confidence,
    status,
  );
const pass = () =>
  new ValidationResult(
    true,
    [],
    new Explanation([], [], [], confidence, "Gate passed."),
  );

describe("deterministic validators", () => {
  it("reports identity failure for corrupted runtime identity", () => {
    const input = signal();
    const corrupted = new Proxy(input, {
      get(target, property) {
        return property === "organizationId"
          ? undefined
          : Reflect.get(target, property, target);
      },
    }) as BusinessSignalContract;
    const result = new IdentityValidator().validate(corrupted, context, []);

    expect(result.passed).toBe(false);
    expect(result.diagnostics.map(({ code }) => code)).toEqual([
      "IDENTITY_INVALID",
    ]);
  });

  it("reports integrity failure for a non-finite numeric value", () => {
    const result = new IntegrityValidator().validate(
      signal(Number.NaN),
      context,
      [pass()],
    );

    expect(result.passed).toBe(false);
    expect(result.diagnostics[0]?.code).toBe("INTEGRITY_FAILED");
  });

  it("reports completeness failure for empty textual content", () => {
    const result = new CompletenessValidator().validate(
      signal("   "),
      context,
      [pass(), pass()],
    );

    expect(result.passed).toBe(false);
    expect(result.diagnostics[0]?.code).toBe("INCOMPLETE_SIGNAL");
  });

  it("reports consistency failure for corrupted temporal ordering", () => {
    const input = signal();
    const corrupted = new Proxy(input, {
      get(target, property) {
        if (property === "occurredAt") {
          return "2026-07-18T11:00:00.000Z";
        }
        if (property === "capturedAt") {
          return "2026-07-18T10:00:00.000Z";
        }
        return Reflect.get(target, property, target);
      },
    }) as BusinessSignalContract;
    const result = new ConsistencyValidator().validate(
      corrupted,
      context,
      [pass(), pass(), pass()],
    );

    expect(result.passed).toBe(false);
    expect(result.diagnostics[0]?.code).toBe("CONSISTENCY_FAILED");
  });

  it("reports qualification failure without repeating earlier gates", () => {
    const result = new QualificationValidator().validate(
      signal(42, "unvalidated"),
      context,
      [pass(), pass(), pass(), pass()],
    );

    expect(result.passed).toBe(false);
    expect(result.diagnostics[0]?.code).toBe("QUALIFICATION_FAILED");
  });

  it("runs gates in order and stops after the first failure", () => {
    const calls: string[] = [];
    class TrackingValidator implements Validator {
      constructor(
        readonly gate: string,
        readonly shouldPass: boolean,
      ) {}

      validate(): ValidationResult {
        calls.push(this.gate);
        return this.shouldPass
          ? pass()
          : new ValidationResult(
              false,
              [new Diagnostic("error", "STOP", "Stop at this gate.")],
              new Explanation([], [], [], confidence, "Gate failed."),
            );
      }
    }

    const results = runValidationPipeline(
      [
        new TrackingValidator("Identity", true),
        new TrackingValidator("Integrity", false),
        new TrackingValidator("Completeness", true),
      ],
      signal(),
      context,
    );

    expect(calls).toEqual(["Identity", "Integrity"]);
    expect(results).toHaveLength(2);
    expect(results[1]?.diagnostics[0]?.code).toBe("STOP");
    expect(Object.isFrozen(results)).toBe(true);
  });
});
