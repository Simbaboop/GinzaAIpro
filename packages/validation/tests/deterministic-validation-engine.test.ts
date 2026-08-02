import { EngineContext } from "@ginzaaipro/core";
import {
  BusinessSignal,
  Identifier,
  Percentage,
  type BusinessSignalValidationStatus,
  type BusinessSignalValue,
} from "@ginzaaipro/domain";
import { describe, expect, it } from "vitest";
import { DeterministicValidationEngine } from "../src/index.js";
import { EvidenceFactory } from "../src/factories/index.js";

const confidence = Percentage.fromBasisPoints(8_500);
const context = new EngineContext(
  new Identifier("org_001"),
  new Identifier("cor_001"),
  new Date("2026-07-18T12:00:00.000Z"),
  new Identifier("emp_001"),
);

const signal = (
  value: BusinessSignalValue = 42,
  status: BusinessSignalValidationStatus = "valid",
) =>
  new BusinessSignal(
    new Identifier("sig_001"),
    context.organizationId,
    "operational",
    "dispatch-system",
    "2026-07-18T10:00:00.000Z",
    "2026-07-18T10:01:00.000Z",
    value,
    confidence,
    status,
    new Identifier("job_001"),
  );

describe("DeterministicValidationEngine", () => {
  it("promotes an eligible signal into immutable traceable Evidence", async () => {
    const input = signal();
    const before = {
      id: input.id,
      organizationId: input.organizationId,
      value: input.value,
      status: input.validationStatus,
    };
    const result = await new DeterministicValidationEngine().execute(
      input,
      context,
    );

    expect(result.success).toBe(true);
    expect(result.diagnostics.map(({ code }) => code)).toEqual([
      "EVIDENCE_STRUCTURED_CREATED",
    ]);
    expect(result.diagnostics[0]?.severity).toBe("info");
    expect(result.value).toBeDefined();
    expect(result.value?.organizationId).toBe(input.organizationId);
    expect(result.value?.signalIds).toEqual([input.id]);
    expect(result.value?.source).toBe(input.source);
    expect(result.value?.createdAt).toBe(context.executionTime.toISOString());
    expect(Object.isFrozen(result.value)).toBe(true);
    expect(Object.isFrozen(result.value?.signalIds)).toBe(true);
    expect(Object.isFrozen(result.value?.components)).toBe(true);
    expect(result.explanation.reasoning).toContain(
      "VALIDATION_EVIDENCE_CONSTRUCTION@1.0.0",
    );
    expect(result.explanation.evidenceIds).toEqual([result.value?.id]);
    expect({
      id: input.id,
      organizationId: input.organizationId,
      value: input.value,
      status: input.validationStatus,
    }).toEqual(before);
  });

  it("fails qualification without constructing Evidence", async () => {
    class CountingEvidenceFactory extends EvidenceFactory {
      calls = 0;

      override async create(
        input: Parameters<EvidenceFactory["create"]>[0],
        executionContext: Parameters<EvidenceFactory["create"]>[1],
      ): ReturnType<EvidenceFactory["create"]> {
        this.calls += 1;
        return super.create(input, executionContext);
      }
    }

    const factory = new CountingEvidenceFactory();
    const result = await new DeterministicValidationEngine(factory).execute(
      signal(42, "unvalidated"),
      context,
    );

    expect(result.success).toBe(false);
    expect(result.value).toBeUndefined();
    expect(result.diagnostics.map(({ code }) => code)).toEqual([
      "QUALIFICATION_FAILED",
    ]);
    expect(result.explanation.reasoning).toContain("QUALIFICATION_FAILED");
    expect(factory.calls).toBe(0);
  });

  it("rejects Organization mismatch as the second gate", async () => {
    const result = await new DeterministicValidationEngine().execute(
      signal(),
      new EngineContext(
        new Identifier("org_002"),
        new Identifier("cor_001"),
        context.executionTime,
      ),
    );

    expect(result.success).toBe(false);
    expect(result.value).toBeUndefined();
    expect(result.diagnostics.map(({ code }) => code)).toEqual([
      "EVIDENCE_ORGANIZATION_MISMATCH",
    ]);
  });

  it("retains Integrity authority for non-finite full-engine input", async () => {
    class CountingEvidenceFactory extends EvidenceFactory {
      calls = 0;

      override async create(
        input: Parameters<EvidenceFactory["create"]>[0],
        executionContext: Parameters<EvidenceFactory["create"]>[1],
      ): ReturnType<EvidenceFactory["create"]> {
        this.calls += 1;
        return super.create(input, executionContext);
      }
    }

    const factory = new CountingEvidenceFactory();
    const result = await new DeterministicValidationEngine(factory).execute(
      signal(Number.NaN),
      context,
    );

    expect(result.success).toBe(false);
    expect(result.value).toBeUndefined();
    expect(result.diagnostics).toHaveLength(1);
    expect(result.diagnostics[0]?.code).toBe("INTEGRITY_FAILED");
    expect(factory.calls).toBe(0);
  });

  it("rejects unsafe integers once they reach construction", async () => {
    const result = await new DeterministicValidationEngine().execute(
      signal(9_007_199_254_740_992),
      context,
    );

    expect(result.success).toBe(false);
    expect(result.value).toBeUndefined();
    expect(result.diagnostics).toHaveLength(1);
    expect(result.diagnostics[0]?.code).toBe(
      "EVIDENCE_COMPONENT_VALUE_INVALID",
    );
    expect(result.diagnostics[0]?.severity).toBe("error");
  });

  it("produces identical substantive output across repeated executions", async () => {
    const engine = new DeterministicValidationEngine();
    const input = signal();
    const substantiveResults: Array<{
      success: boolean;
      evidence:
        | {
            id: string;
            organizationId: string;
            signalIds: string[];
            componentIds: string[];
            source: string;
            verificationMethod: string;
            materialRelevance: number;
            statement: string;
            confidence: number;
            createdAt: string;
          }
        | undefined;
      diagnostics: Array<{
        severity: "info" | "warning" | "error";
        code: string;
        message: string;
      }>;
      explanation: {
        evidenceIds: string[];
        assumptions: readonly string[];
        limitations: readonly string[];
        confidence: number;
        reasoning: string;
      };
    }> = [];

    for (let iteration = 0; iteration < 100; iteration += 1) {
      const result = await engine.execute(input, context);
      substantiveResults.push({
        success: result.success,
        evidence: result.value && {
          id: result.value.id.value,
          organizationId: result.value.organizationId.value,
          signalIds: result.value.signalIds.map(({ value }) => value),
          componentIds: result.value.components.map(({ id }) => id.value),
          source: result.value.source,
          verificationMethod: result.value.verificationMethod,
          materialRelevance: result.value.materialRelevance.basisPoints,
          statement: result.value.statement,
          confidence: result.value.confidence.basisPoints,
          createdAt: result.value.createdAt,
        },
        diagnostics: result.diagnostics.map((diagnostic) => ({
          severity: diagnostic.severity,
          code: diagnostic.code,
          message: diagnostic.message,
        })),
        explanation: {
          evidenceIds: result.explanation.evidenceIds.map(
            ({ value }) => value,
          ),
          assumptions: result.explanation.assumptions,
          limitations: result.explanation.limitations,
          confidence: result.explanation.confidence.basisPoints,
          reasoning: result.explanation.reasoning,
        },
      });
    }

    expect(
      substantiveResults.every(
        (result) =>
          JSON.stringify(result) === JSON.stringify(substantiveResults[0]),
      ),
    ).toBe(true);
  });
});
