import { describe, expect, it } from "vitest";
import {
  Evidence,
  EvidenceComponent,
  EvidenceComponentProvenance,
  EvidenceConstructionRuleReference,
  EvidenceQualifier,
  EvidenceRelation,
  Identifier,
  Percentage,
  type EvidenceValue,
} from "../src/index.js";

const id = (value: string): Identifier => new Identifier(value);
const timestamp = "2026-07-18T12:00:00.000Z";
const organizationId = id("org_001");
const signalId = id("sig_001");
const rules: Readonly<Record<EvidenceValue["kind"], string>> = {
  text: "VAL-EVIDENCE-TEXT-001",
  boolean: "VAL-EVIDENCE-BOOLEAN-001",
  integer: "VAL-EVIDENCE-INTEGER-001",
  decimal: "VAL-EVIDENCE-DECIMAL-001",
  instant: "VAL-EVIDENCE-TEXT-001",
  money: "VAL-EVIDENCE-MONEY-001",
  percentage: "VAL-EVIDENCE-PERCENTAGE-001",
};

const component = (
  componentId: string,
  value: EvidenceValue = { kind: "text", value: "validated fact" },
  qualifiers: readonly EvidenceQualifier[] = [],
  provenance: readonly EvidenceComponentProvenance[] = [
    new EvidenceComponentProvenance(
      signalId,
      "dispatch-system",
      "value",
    ),
  ],
  subjectId?: Identifier,
): EvidenceComponent =>
  new EvidenceComponent(
    id(componentId),
    subjectId,
    new EvidenceRelation("ginzaaipro.business-signal", "value"),
    value,
    qualifiers,
    provenance,
    new EvidenceConstructionRuleReference(rules[value.kind], "1.0.0"),
  );

const evidence = (
  components: readonly EvidenceComponent[],
  signalIds: readonly Identifier[] = [signalId],
): Evidence =>
  new Evidence(
    id("evidence_001"),
    organizationId,
    signalIds,
    "dispatch-system",
    "valid",
    "deterministic-five-gate-validation",
    Percentage.fromBasisPoints(10_000),
    components,
    Percentage.fromBasisPoints(8_000),
    timestamp,
  );

describe("canonical Evidence component contracts", () => {
  it("preserves every closed EvidenceValue variant immutably", () => {
    const values: readonly EvidenceValue[] = [
      { kind: "text", value: " fact " },
      { kind: "boolean", value: true },
      { kind: "integer", value: "-42" },
      { kind: "decimal", value: "0.125" },
      { kind: "instant", value: "2026-07-18T08:00:00-04:00" },
      { kind: "money", minorUnits: "12500", currency: "USD" },
      { kind: "percentage", basisPoints: 2_500 },
    ];

    const contracts = values.map((value, index) => {
      const ruleKind = value.kind === "instant" ? "text" : value.kind;
      return new EvidenceComponent(
        id(`component_${String(index)}`),
        undefined,
        new EvidenceRelation("ginzaaipro.business-signal", "value"),
        value,
        [],
        [
          new EvidenceComponentProvenance(
            signalId,
            "dispatch-system",
            "value",
          ),
        ],
        new EvidenceConstructionRuleReference(
          rules[ruleKind],
          "1.0.0",
        ),
      );
    });

    expect(contracts.map(({ value }) => value)).toEqual([
      { kind: "text", value: "fact" },
      { kind: "boolean", value: true },
      { kind: "integer", value: "-42" },
      { kind: "decimal", value: "0.125" },
      { kind: "instant", value: timestamp },
      { kind: "money", minorUnits: "12500", currency: "USD" },
      { kind: "percentage", basisPoints: 2_500 },
    ]);
    expect(contracts.every(Object.isFrozen)).toBe(true);
    expect(contracts.every(({ value }) => Object.isFrozen(value))).toBe(true);
  });

  it("requires valid instant values with an explicit RFC 3339 timezone", () => {
    const relation = new EvidenceRelation("source.system", "occurred-at");

    expect(
      () =>
        new EvidenceQualifier(relation, {
          kind: "instant",
          value: "2026-07-18T12:00:00",
        }),
    ).toThrow(/timezone/);
    expect(
      () =>
        new EvidenceQualifier(relation, {
          kind: "instant",
          value: "2026-02-30T12:00:00Z",
        }),
    ).toThrow(/valid/);
  });

  it("sorts qualifiers and provenance canonically with defensive copies", () => {
    const qualifiers = [
      new EvidenceQualifier(
        new EvidenceRelation("zeta", "value"),
        { kind: "text", value: "z" },
      ),
      new EvidenceQualifier(
        new EvidenceRelation("alpha", "value"),
        { kind: "text", value: "a" },
      ),
    ];
    const provenance = [
      new EvidenceComponentProvenance(
        id("sig_002"),
        "source",
        "value",
        "two",
      ),
      new EvidenceComponentProvenance(
        signalId,
        "source",
        "value",
      ),
    ];
    const contract = component(
      "component_001",
      { kind: "text", value: "fact" },
      qualifiers,
      provenance,
    );

    qualifiers.reverse();
    provenance.reverse();

    expect(
      contract.qualifiers.map(({ relation }) => relation.namespace),
    ).toEqual(["alpha", "zeta"]);
    expect(contract.provenance.map(({ signalId: sourceId }) => sourceId.value))
      .toEqual(["sig_001", "sig_002"]);
    expect(Object.isFrozen(contract.qualifiers)).toBe(true);
    expect(Object.isFrozen(contract.provenance)).toBe(true);
  });

  it("rejects invalid and duplicate nested component data", () => {
    const qualifier = new EvidenceQualifier(
      new EvidenceRelation("source", "scope"),
      { kind: "text", value: "current" },
    );
    const provenance = new EvidenceComponentProvenance(
      signalId,
      "source",
      "value",
    );

    expect(() =>
      component(
        "component_001",
        { kind: "text", value: "fact" },
        [qualifier, qualifier],
      ),
    ).toThrow("qualifier cannot be duplicated");
    expect(() =>
      component(
        "component_001",
        { kind: "text", value: "fact" },
        [],
        [provenance, provenance],
      ),
    ).toThrow("provenance cannot be duplicated");
    expect(() =>
      component("component_001", {
        kind: "integer",
        value: "01",
      }),
    ).toThrow("integer value is not canonical");
    expect(() =>
      component("component_001", {
        kind: "decimal",
        value: "1.230",
      }),
    ).toThrow("decimal value is not canonical");
  });
});

describe("canonical Evidence aggregate and statement rendering", () => {
  it("derives the exact one-component statement", () => {
    const contract = evidence([
      component(
        "component_001",
        { kind: "integer", value: "42" },
        [
          new EvidenceQualifier(
            new EvidenceRelation(
              "ginzaaipro.business-signal",
              "category",
            ),
            { kind: "text", value: "operational" },
          ),
        ],
        [
          new EvidenceComponentProvenance(
            signalId,
            "dispatch-system",
            "value",
          ),
        ],
        id("job_001"),
      ),
    ]);

    expect(contract.statement).toBe(
      'Validated component "component_001": subject="job_001"; relation="ginzaaipro.business-signal:value"; value=integer(42); qualifiers=["ginzaaipro.business-signal:category"=text("operational")]; provenance=[{signal="sig_001"; source="dispatch-system"; field="value"; locator=null}]; rule="VAL-EVIDENCE-INTEGER-001@1.0.0".',
    );
  });

  it("uses UTF-8 identifier order and exactly one U+000A delimiter", () => {
    const contract = evidence([
      component("component_\u00e9"),
      component("component_z"),
    ]);

    expect(contract.components.map(({ id: componentId }) => componentId.value))
      .toEqual(["component_z", "component_\u00e9"]);
    expect(contract.statement.split("\n")).toHaveLength(2);
    expect(contract.statement).not.toMatch(/^\n|\n$/);
    expect(contract.statement.endsWith(".")).toBe(true);
  });

  it("renders qualifiers, provenance, absent subject, and JSON escaping", () => {
    const contract = evidence([
      component(
        "component_\"quoted",
        { kind: "text", value: "line\nvalue" },
        [],
        [
          new EvidenceComponentProvenance(
            signalId,
            "source\nname",
            "value",
            "record\"1",
          ),
        ],
      ),
    ]);

    expect(contract.statement).toContain(
      'Validated component "component_\\"quoted": subject=null;',
    );
    expect(contract.statement).toContain('value=text("line\\nvalue")');
    expect(contract.statement).toContain("qualifiers=[]");
    expect(contract.statement).toContain('source="source\\nname"');
    expect(contract.statement).toContain('locator="record\\"1"');
  });

  it("rejects zero, duplicate, foreign, and unsupported components", () => {
    expect(() => evidence([])).toThrow("structured factual component");

    const duplicate = component("component_001");
    expect(() => evidence([duplicate, duplicate])).toThrow(
      "component identity cannot be duplicated",
    );
    expect(() =>
      evidence([
        component(
          "component_001",
          { kind: "text", value: "fact" },
          [],
          [
            new EvidenceComponentProvenance(
              id("sig_foreign"),
              "source",
              "value",
            ),
          ],
        ),
      ]),
    ).toThrow("originating signal");
    expect(() =>
      evidence([
        new EvidenceComponent(
          id("component_001"),
          undefined,
          new EvidenceRelation("source", "value"),
          { kind: "instant", value: timestamp },
          [],
          [
            new EvidenceComponentProvenance(
              signalId,
              "source",
              "value",
            ),
          ],
          new EvidenceConstructionRuleReference(
            "UNKNOWN-RULE",
            "1.0.0",
          ),
        ),
      ]),
    ).toThrow("statement rendering failed");
  });

  it("keeps the aggregate and its graph immutable", () => {
    const callerComponents = [component("component_001")];
    const contract = evidence(callerComponents);
    callerComponents.push(component("component_002"));

    expect(contract.components).toHaveLength(1);
    expect(Object.isFrozen(contract)).toBe(true);
    expect(Object.isFrozen(contract.components)).toBe(true);
    expect(Object.isFrozen(contract.signalIds)).toBe(true);
    expect(Object.isFrozen(contract.components[0])).toBe(true);
    expect(() =>
      (contract.components as EvidenceComponent[]).push(
        component("component_003"),
      ),
    ).toThrow();
  });

  it("does not accept caller-authored statement text", () => {
    expect(() =>
      Reflect.construct(
        Evidence,
        [
        id("evidence_legacy"),
        organizationId,
        [signalId],
        "source",
        "valid",
        "validation",
        Percentage.fromBasisPoints(10_000),
        "caller-authored statement",
        [component("component_001")],
        Percentage.fromBasisPoints(8_000),
        timestamp,
        ],
      ),
    ).toThrow();

    expect(Evidence.length).toBe(10);
  });
});
