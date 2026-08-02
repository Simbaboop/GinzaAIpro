import {
  EvidenceComponentProvenance,
  EvidenceConstructionRuleReference,
  EvidenceQualifier,
  EvidenceRelation,
  Identifier,
} from "@ginzaaipro/domain";
import { describe, expect, it } from "vitest";
import {
  createEvidenceComponentIdentifier,
  createEvidenceIdentifier,
} from "../src/identity/evidenceIdentity.js";

const id = (value: string): Identifier => new Identifier(value);
const organizationId = id("org_001");
const categoryQualifier = new EvidenceQualifier(
  new EvidenceRelation("ginzaaipro.business-signal", "category"),
  { kind: "text", value: "operational" },
);
const occurredQualifier = new EvidenceQualifier(
  new EvidenceRelation("ginzaaipro.business-signal", "occurred-at"),
  { kind: "instant", value: "2026-07-18T10:00:00.000Z" },
);
const provenance = new EvidenceComponentProvenance(
  id("sig_001"),
  "dispatch-system",
  "value",
);
const rule = new EvidenceConstructionRuleReference(
  "VAL-EVIDENCE-INTEGER-001",
  "1.0.0",
);

const componentInput = (
  qualifiers = [categoryQualifier, occurredQualifier],
  provenanceEntries = [provenance],
) => ({
  organizationId,
  subjectId: id("job_001"),
  relation: new EvidenceRelation(
    "ginzaaipro.business-signal",
    "value",
  ),
  value: { kind: "integer", value: "42" } as const,
  qualifiers,
  provenance: provenanceEntries,
  constructionRule: rule,
});

describe("canonical Evidence identity vectors", () => {
  it("matches the normative component vector exactly", async () => {
    const componentId = await createEvidenceComponentIdentifier(
      componentInput(),
    );

    expect(componentId.value).toBe(
      "evidence-component:v1:ec0abcfac9e3056c4161dd77bae5303802236a003c5c1c9dd794cd57ea9cd133",
    );
  });

  it("matches the normative Evidence vector exactly", async () => {
    const componentId = await createEvidenceComponentIdentifier(
      componentInput(),
    );
    const evidenceId = await createEvidenceIdentifier({
      organizationId,
      signalIds: [id("sig_001")],
      componentIds: [componentId],
    });

    expect(evidenceId.value).toBe(
      "evidence:v2:0154d32c5270a28ac7ba5775f611bfad65abe689e2aeb2809817e5de551156bc",
    );
  });

  it("is invariant to qualifier, provenance, signal, and component permutations", async () => {
    const secondProvenance = new EvidenceComponentProvenance(
      id("sig_002"),
      "dispatch-system",
      "value",
      "record_002",
    );
    const first = await createEvidenceComponentIdentifier(
      componentInput(
        [categoryQualifier, occurredQualifier],
        [provenance, secondProvenance],
      ),
    );
    const second = await createEvidenceComponentIdentifier(
      componentInput(
        [occurredQualifier, categoryQualifier],
        [secondProvenance, provenance],
      ),
    );

    expect(second.equals(first)).toBe(true);

    const otherComponent = id(
      "evidence-component:v1:ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
    );
    const firstEvidence = await createEvidenceIdentifier({
      organizationId,
      signalIds: [id("sig_001"), id("sig_002")],
      componentIds: [first, otherComponent],
    });
    const secondEvidence = await createEvidenceIdentifier({
      organizationId,
      signalIds: [id("sig_002"), id("sig_001")],
      componentIds: [otherComponent, second],
    });

    expect(secondEvidence.equals(firstEvidence)).toBe(true);
  });

  it("includes governed factual identity fields and excludes statement context", async () => {
    const baseline = await createEvidenceComponentIdentifier(
      componentInput(),
    );
    const changedValue = await createEvidenceComponentIdentifier({
      ...componentInput(),
      value: { kind: "integer", value: "43" },
    });
    const changedRule = await createEvidenceComponentIdentifier({
      ...componentInput(),
      constructionRule: new EvidenceConstructionRuleReference(
        "VAL-EVIDENCE-INTEGER-001",
        "1.0.1",
      ),
    });

    expect(changedValue.equals(baseline)).toBe(false);
    expect(changedRule.equals(baseline)).toBe(false);

    const evidenceId = await createEvidenceIdentifier({
      organizationId,
      signalIds: [id("sig_001")],
      componentIds: [baseline],
    });
    expect(evidenceId.value).not.toContain("statement");
    expect(evidenceId.value).toMatch(/^evidence:v2:[0-9a-f]{64}$/);
  });
});
