import { EngineContext } from "@ginzaaipro/core";
import {
  BusinessSignal,
  Identifier,
  Percentage,
} from "@ginzaaipro/domain";
import { describe, expect, it } from "vitest";
import { ValidationDiagnosticCodes } from "../src/index.js";
import {
  DiagnosticFactory,
  EvidenceFactory,
  ExplanationFactory,
} from "../src/factories/index.js";

const confidence = Percentage.fromBasisPoints(9_000);
const context = new EngineContext(
  new Identifier("org_001"),
  new Identifier("cor_001"),
  new Date("2026-07-18T12:00:00.000Z"),
);
const signal = new BusinessSignal(
  new Identifier("sig_001"),
  context.organizationId,
  "financial",
  "billing-ledger",
  "2026-07-18T10:00:00.000Z",
  "2026-07-18T10:01:00.000Z",
  125_00n,
  confidence,
  "valid",
);

describe("validation factories", () => {
  it("creates deterministic immutable Evidence with source linkage", async () => {
    const factory = new EvidenceFactory();
    const first = await factory.create(signal, context);
    const second = await factory.create(signal, context);

    expect(first.success).toBe(true);
    expect(second.success).toBe(true);
    if (!first.success || !second.success) {
      throw new Error("Expected Evidence factory success.");
    }

    expect(first.evidence.id.value).toMatch(/^evidence:v2:[0-9a-f]{64}$/);
    expect(first.evidence.id.equals(second.evidence.id)).toBe(true);
    expect(first.evidence.organizationId).toBe(signal.organizationId);
    expect(first.evidence.signalIds).toEqual([signal.id]);
    expect(first.evidence.components).toHaveLength(1);
    expect(first.evidence.statement).toBe(
      `Validated component ${JSON.stringify(first.evidence.components[0]!.id.value)}: subject=null; relation="ginzaaipro.business-signal:value"; value=integer(12500); qualifiers=["ginzaaipro.business-signal:category"=text("financial"), "ginzaaipro.business-signal:occurred-at"=instant("2026-07-18T10:00:00.000Z")]; provenance=[{signal="sig_001"; source="billing-ledger"; field="value"; locator=null}]; rule="VAL-EVIDENCE-INTEGER-001@1.0.0".`,
    );
    expect(first.evidence.createdAt).toBe("2026-07-18T12:00:00.000Z");
    expect(Object.isFrozen(first.evidence)).toBe(true);
    expect(Object.isFrozen(first.evidence.signalIds)).toBe(true);
    expect(Object.isFrozen(first.evidence.components)).toBe(true);
  });

  it("admits exact materialized statements and rejects mismatches", async () => {
    const factory = new EvidenceFactory();
    const canonical = await factory.create(signal, context);
    if (!canonical.success) {
      throw new Error("Expected canonical Evidence.");
    }

    const matching = await factory.create(
      signal,
      context,
      canonical.evidence.statement,
    );
    const mismatch = await factory.create(
      signal,
      context,
      `${canonical.evidence.statement} `,
    );

    expect(matching.success).toBe(true);
    expect(mismatch).toEqual({
      success: false,
      code: "EVIDENCE_STATEMENT_COMPONENT_MISMATCH",
    });
  });

  it("rejects organization mismatch at the construction boundary", async () => {
    const result = await new EvidenceFactory().create(
      signal,
      new EngineContext(
        new Identifier("org_002"),
        context.correlationId,
        context.executionTime,
      ),
    );

    expect(result).toEqual({
      success: false,
      code: "EVIDENCE_ORGANIZATION_MISMATCH",
    });
  });

  it("creates stable diagnostics without exposing signal payloads", () => {
    const factory = new DiagnosticFactory();
    const failureCodes = Object.values(ValidationDiagnosticCodes).filter(
      (code) => code !== ValidationDiagnosticCodes.EvidenceStructuredCreated,
    );
    const diagnostics = failureCodes.map((code) =>
      factory.createFailure(code),
    );
    const success = factory.createSuccess();

    expect(diagnostics.every(({ severity }) => severity === "error")).toBe(
      true,
    );
    expect(success.severity).toBe("info");
    expect(success.code).toBe("EVIDENCE_STRUCTURED_CREATED");
    expect(
      diagnostics.every(({ message }) => !message.includes("12500")),
    ).toBe(true);
    expect(
      diagnostics.every(({ message }) => !message.includes(signal.source)),
    ).toBe(true);
  });

  it("creates deterministic construction explanations", async () => {
    const factory = new ExplanationFactory();
    const result = await new EvidenceFactory().create(signal, context);
    if (!result.success) {
      throw new Error("Expected Evidence factory success.");
    }
    const success = factory.createConstructionSuccess(
      signal,
      result.evidence,
      result.rule,
    );
    const failure = factory.createConstructionFailure(
      signal,
      ValidationDiagnosticCodes.EvidenceComponentValueInvalid,
    );

    expect(success.reasoning).toContain(
      "VALIDATION_EVIDENCE_CONSTRUCTION@1.0.0",
    );
    expect(success.reasoning).toContain(result.rule.id);
    expect(success.reasoning).toContain("No semantic extraction");
    expect(success.evidenceIds).toEqual([result.evidence.id]);
    expect(failure.reasoning).toBe(
      "Evidence construction failed at EVIDENCE_COMPONENT_VALUE_INVALID; no Evidence was created.",
    );
    expect(failure.reasoning).not.toContain("12500");
    expect(failure.reasoning).not.toMatch(/prompt|token|chain-of-thought/i);
  });
});
