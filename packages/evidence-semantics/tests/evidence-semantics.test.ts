import { describe, expect, it } from "vitest";
import {
  Evidence,
  EvidenceComponent,
  EvidenceComponentProvenance,
  EvidenceConstructionRuleReference,
  EvidenceRelation,
  Identifier,
  Percentage,
  type EvidenceValue,
} from "@ginzaaipro/domain";
import {
  SEMANTIC_SCHEMA_VERSION,
  resolveEvidenceSemantics,
} from "../src/index.js";

const evidenceId = "evidence:v2:0154d32c5270a28ac7ba5775f611bfad65abe689e2aeb2809817e5de551156bc";
const componentId = "evidence-component:v1:ec0abcfac9e3056c4161dd77bae5303802236a003c5c1c9dd794cd57ea9cd133";
const signalId = new Identifier("signal:v1:test");
const rules: Readonly<Record<EvidenceValue["kind"], string>> = Object.freeze({
  text: "VAL-EVIDENCE-TEXT-001", boolean: "VAL-EVIDENCE-BOOLEAN-001",
  integer: "VAL-EVIDENCE-INTEGER-001", decimal: "VAL-EVIDENCE-DECIMAL-001",
  instant: "VAL-EVIDENCE-TEXT-001", money: "VAL-EVIDENCE-MONEY-001",
  percentage: "VAL-EVIDENCE-PERCENTAGE-001",
});

const makeComponent = (id: string, value: EvidenceValue): EvidenceComponent =>
  new EvidenceComponent(
    new Identifier(id), undefined,
    new EvidenceRelation("ginzaaipro.business-signal", "value"), value, [],
    [new EvidenceComponentProvenance(signalId, "test-source", "value")],
    new EvidenceConstructionRuleReference(rules[value.kind], "1.0.0"),
  );

const makeEvidence = (components: readonly EvidenceComponent[]): Evidence =>
  new Evidence(
    new Identifier(evidenceId), new Identifier("organization:v1:test"),
    [signalId], "test-source", "valid", "deterministic-validation",
    Percentage.fromBasisPoints(10_000), components,
    Percentage.fromBasisPoints(8_000), "2026-08-06T00:00:00.000Z",
  );

describe("resolveEvidenceSemantics", () => {
  it("reproduces the integer fact and aggregate fixed vectors", async () => {
    const result = await resolveEvidenceSemantics({
      evidence: makeEvidence([makeComponent(componentId, { kind: "integer", value: "42" })]),
      semanticSchemaVersion: SEMANTIC_SCHEMA_VERSION,
    });
    expect(result.ok).toBe(true);
    if (!result.ok) return;
    expect(result.value.facts[0]?.id.value).toBe("semantic-fact:v1:6a4c3193692678c1bd8e3c6a07cad870b16969d26a9c2d293775a3f668a0baae");
    expect(result.value.id.value).toBe("evidence-semantics:v1:9edd64a2257cfb47bd4600720cf10cc33f9eff4cebddda0d17ef941b845a21ee");
    expect(result.value.resolutions).toHaveLength(1);
    expect(result.value.resolutions[0]?.status).toBe("RESOLVED");
  });

  it("reproduces the non-ASCII UTF-8 vector", async () => {
    const result = await resolveEvidenceSemantics({
      evidence: makeEvidence([makeComponent(componentId, { kind: "text", value: "café" })]),
      semanticSchemaVersion: SEMANTIC_SCHEMA_VERSION,
    });
    expect(result.ok && result.value.facts[0]?.id.value).toBe("semantic-fact:v1:75dc8425b955d541f801e5e86ffd9f21793a5bec31bf134e60f116fc3eb51e70");
  });

  it("preserves every EvidenceValue variant and exact provenance", async () => {
    const values: readonly EvidenceValue[] = [
      { kind: "text", value: "fact" }, { kind: "boolean", value: true },
      { kind: "integer", value: "-42" }, { kind: "decimal", value: "0.125" },
      { kind: "instant", value: "2026-08-06T00:00:00.000Z" },
      { kind: "money", minorUnits: "12500", currency: "USD" },
      { kind: "percentage", basisPoints: 2500 },
    ];
    for (const [index, value] of values.entries()) {
      const suffix=String(index).padStart(64,"0");
      const result=await resolveEvidenceSemantics({evidence:makeEvidence([makeComponent(`evidence-component:v1:${suffix}`,value)]),semanticSchemaVersion:SEMANTIC_SCHEMA_VERSION});
      expect(result.ok).toBe(true);
      if(result.ok){expect(result.value.facts[0]?.value).toEqual(value);expect(result.value.facts[0]?.provenance.projectionRule.identity).toBe("ES-001");expect(result.value.facts[0]?.provenance.referenceRule.identity).toBe("ES-002")}
    }
  });

  it("is deterministic across repeated and concurrent invocations", async () => {
    const input={evidence:makeEvidence([makeComponent(componentId,{kind:"integer",value:"42"})]),semanticSchemaVersion:SEMANTIC_SCHEMA_VERSION};
    const results=await Promise.all([resolveEvidenceSemantics(input),resolveEvidenceSemantics(input),resolveEvidenceSemantics(input)]);
    expect(results.every((result)=>result.ok&&result.value.id.value===(results[0]?.ok?results[0].value.id.value:""))).toBe(true);
    expect(results[0]).not.toBe(results[1]);
  });

  it("returns typed failures without rejecting", async () => {
    await expect(resolveEvidenceSemantics({evidence:makeEvidence([makeComponent(componentId,{kind:"integer",value:"42"})]),semanticSchemaVersion:"semantic-schema:v2"})).resolves.toEqual({ok:false,diagnostics:[{code:"SEMANTIC_SCHEMA_UNSUPPORTED",message:"Semantic schema is unsupported."}]});
    await expect(resolveEvidenceSemantics(null as unknown as Parameters<typeof resolveEvidenceSemantics>[0])).resolves.toMatchObject({ok:false,diagnostics:[{code:"SEMANTIC_INPUT_INVALID"}]});
  });

  it("returns deeply immutable canonical output", async () => {
    const result=await resolveEvidenceSemantics({evidence:makeEvidence([makeComponent(componentId,{kind:"integer",value:"42"})]),semanticSchemaVersion:SEMANTIC_SCHEMA_VERSION});
    expect(result.ok).toBe(true); if(!result.ok)return;
    expect(Object.isFrozen(result)).toBe(true); expect(Object.isFrozen(result.value)).toBe(true);
    expect(Object.isFrozen(result.value.facts)).toBe(true); expect(Object.isFrozen(result.value.facts[0])).toBe(true);
    expect(Object.isFrozen(result.value.facts[0]?.value)).toBe(true); expect(Object.isFrozen(result.value.resolutions)).toBe(true);
  });
});
