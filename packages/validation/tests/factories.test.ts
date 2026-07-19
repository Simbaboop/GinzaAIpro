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
  it("creates deterministic immutable Evidence with source linkage", () => {
    const factory = new EvidenceFactory();
    const first = factory.create(signal, context);
    const second = factory.create(signal, context);

    expect(first.id.value).toBe("evidence:sig_001:cor_001");
    expect(first.id.equals(second.id)).toBe(true);
    expect(first.organizationId).toBe(signal.organizationId);
    expect(first.signalIds).toEqual([signal.id]);
    expect(first.statement).toBe(
      "Validated financial signal from billing-ledger.",
    );
    expect(first.createdAt).toBe("2026-07-18T12:00:00.000Z");
    expect(Object.isFrozen(first)).toBe(true);
    expect(Object.isFrozen(first.signalIds)).toBe(true);
  });

  it("creates stable diagnostics without exposing signal payloads", () => {
    const factory = new DiagnosticFactory();
    const diagnostics = Object.values(ValidationDiagnosticCodes).map((code) =>
      factory.createFailure(code),
    );

    expect(diagnostics.map(({ code }) => code)).toEqual([
      "IDENTITY_INVALID",
      "INTEGRITY_FAILED",
      "INCOMPLETE_SIGNAL",
      "CONSISTENCY_FAILED",
      "QUALIFICATION_FAILED",
    ]);
    expect(diagnostics.every(({ severity }) => severity === "error")).toBe(
      true,
    );
    expect(
      diagnostics.every(({ message }) => !message.includes("12500")),
    ).toBe(true);
  });

  it("creates concise outcome-specific explanations", () => {
    const factory = new ExplanationFactory();
    const evidence = new EvidenceFactory().create(signal, context);
    const success = factory.createSuccess(signal, evidence);
    const failure = factory.createGateFailure(
      signal,
      ValidationDiagnosticCodes.IntegrityFailed,
    );

    expect(success.reasoning).toContain("qualified");
    expect(success.evidenceIds).toEqual([evidence.id]);
    expect(failure.reasoning).toContain("INTEGRITY_FAILED");
    expect(failure.reasoning.length).toBeLessThan(100);
    expect(failure.reasoning).not.toMatch(/prompt|token|chain-of-thought/i);
  });
});
