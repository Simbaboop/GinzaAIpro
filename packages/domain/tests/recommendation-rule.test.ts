import { describe, expect, it } from "vitest";
import {
  RecommendationRule,
  type DeclarativeRuleRecord,
} from "../src/index.js";

type RecommendationRuleValues = {
  ruleId: string;
  ruleVersion: string;
  policyId: string;
  policyVersion: string;
  enabled: boolean;
  effectiveFrom: string;
  effectiveTo: string | undefined;
  priority: number;
  predicate: DeclarativeRuleRecord;
  outputTemplate: DeclarativeRuleRecord;
  metadata: DeclarativeRuleRecord;
};

const predicate = (): DeclarativeRuleRecord => ({
  priorityFilter: ["Critical", "High"],
  categoryFilter: ["Revenue"],
  conditions: {
    all: [
      {
        field: "dimensions.Urgency",
        operator: "equals",
        value: "Critical",
      },
    ],
  },
});

const outputTemplate = (): DeclarativeRuleRecord => ({
  interventionTemplate: {
    code: "CONTACT-CUSTOMER",
    objective: "Resolve the overdue invoice constraint",
  },
  expectedOutcome: "The invoice is resolved or assigned a documented cause.",
  successMetric: "Invoice resolution status recorded within two business days.",
});

const metadata = (): DeclarativeRuleRecord => ({
  owner: "revenue-operations",
  tags: ["collections", "customer-contact"],
  audit: { approvedBy: "policy-board" },
});

const createRule = (
  overrides: Partial<RecommendationRuleValues> = {},
): RecommendationRule =>
  new RecommendationRule(
    overrides.ruleId ?? "  RECOMMEND-001  ",
    overrides.ruleVersion ?? "  1.2.3+approved  ",
    overrides.policyId ?? "  customer-protection  ",
    overrides.policyVersion ?? "  2026.07  ",
    overrides.enabled ?? true,
    overrides.effectiveFrom ?? "2026-07-21T08:00:00-04:00",
    "effectiveTo" in overrides
      ? overrides.effectiveTo
      : "2026-12-31T23:59:59Z",
    overrides.priority ?? 10,
    "predicate" in overrides
      ? (overrides.predicate as DeclarativeRuleRecord)
      : predicate(),
    "outputTemplate" in overrides
      ? (overrides.outputTemplate as DeclarativeRuleRecord)
      : outputTemplate(),
    "metadata" in overrides
      ? (overrides.metadata as DeclarativeRuleRecord)
      : metadata(),
  );

const valuesOf = (rule: RecommendationRule): RecommendationRuleValues => ({
  ruleId: rule.ruleId,
  ruleVersion: rule.ruleVersion,
  policyId: rule.policyId,
  policyVersion: rule.policyVersion,
  enabled: rule.enabled,
  effectiveFrom: rule.effectiveFrom,
  effectiveTo: rule.effectiveTo,
  priority: rule.priority,
  predicate: rule.predicate,
  outputTemplate: rule.outputTemplate,
  metadata: rule.metadata,
});

describe("RecommendationRule", () => {
  it("creates a valid governed recommendation rule", () => {
    const rule = createRule();

    expect(rule).toBeInstanceOf(RecommendationRule);
    expect(Object.isFrozen(rule)).toBe(true);
  });

  it("preserves and normalizes every field", () => {
    expect(valuesOf(createRule())).toEqual({
      ruleId: "RECOMMEND-001",
      ruleVersion: "1.2.3+approved",
      policyId: "customer-protection",
      policyVersion: "2026.07",
      enabled: true,
      effectiveFrom: "2026-07-21T12:00:00.000Z",
      effectiveTo: "2026-12-31T23:59:59.000Z",
      priority: 10,
      predicate: predicate(),
      outputTemplate: outputTemplate(),
      metadata: metadata(),
    });
  });

  it("exposes getter-only state", () => {
    const properties = [
      "ruleId",
      "ruleVersion",
      "policyId",
      "policyVersion",
      "enabled",
      "effectiveFrom",
      "effectiveTo",
      "priority",
      "predicate",
      "outputTemplate",
      "metadata",
    ];

    for (const property of properties) {
      const descriptor = Object.getOwnPropertyDescriptor(
        RecommendationRule.prototype,
        property,
      );
      expect(descriptor?.get).toBeTypeOf("function");
      expect(descriptor?.set).toBeUndefined();
    }
  });

  it("enforces top-level immutability", () => {
    const rule = createRule();

    expect(Object.isFrozen(rule)).toBe(true);
    expect(() =>
      Object.defineProperty(rule, "priority", { value: 1 }),
    ).toThrow();
  });

  it("deeply freezes nested declarative structures", () => {
    const rule = createRule();
    const conditions = rule.predicate.conditions as DeclarativeRuleRecord;
    const all = conditions.all as readonly DeclarativeRuleRecord[];
    const intervention = rule.outputTemplate
      .interventionTemplate as DeclarativeRuleRecord;
    const audit = rule.metadata.audit as DeclarativeRuleRecord;

    expect(Object.isFrozen(rule.predicate)).toBe(true);
    expect(Object.isFrozen(conditions)).toBe(true);
    expect(Object.isFrozen(all)).toBe(true);
    expect(Object.isFrozen(all[0])).toBe(true);
    expect(Object.isFrozen(rule.outputTemplate)).toBe(true);
    expect(Object.isFrozen(intervention)).toBe(true);
    expect(Object.isFrozen(rule.metadata)).toBe(true);
    expect(Object.isFrozen(audit)).toBe(true);
  });

  it("defensively copies predicate, output template, and metadata", () => {
    const callerPredicate = {
      priorityFilter: ["Critical"],
      nested: { threshold: 1 },
    };
    const callerOutputTemplate = {
      interventionTemplate: { code: "CONTACT-CUSTOMER" },
      expectedOutcome: "Resolved",
      successMetric: "Resolution recorded",
    };
    const callerMetadata = {
      tags: ["collections"],
      audit: { approvedBy: "policy-board" },
    };
    const rule = createRule({
      predicate: callerPredicate,
      outputTemplate: callerOutputTemplate,
      metadata: callerMetadata,
    });

    callerPredicate.priorityFilter.push("Low");
    callerPredicate.nested.threshold = 2;
    callerOutputTemplate.interventionTemplate.code = "CHANGED";
    callerMetadata.tags.push("changed");
    callerMetadata.audit.approvedBy = "changed";

    expect(rule.predicate).toEqual({
      priorityFilter: ["Critical"],
      nested: { threshold: 1 },
    });
    expect(rule.outputTemplate.interventionTemplate).toEqual({
      code: "CONTACT-CUSTOMER",
    });
    expect(rule.metadata).toEqual({
      tags: ["collections"],
      audit: { approvedBy: "policy-board" },
    });
  });

  it.each([
    ["ruleId", "rule identifier"],
    ["ruleVersion", "rule version"],
    ["policyId", "policy identifier"],
    ["policyVersion", "policy version"],
  ] as const)("rejects a blank %s", (field, message) => {
    expect(() => createRule({ [field]: "   " })).toThrow(message);
  });

  it.each([-1, 1.5, Number.NaN, Number.POSITIVE_INFINITY])(
    "rejects invalid priority %s",
    (priority) => {
      expect(() => createRule({ priority })).toThrow(
        "priority must be a non-negative safe integer",
      );
    },
  );

  it("rejects invalid effective dates", () => {
    expect(() => createRule({ effectiveFrom: "not-a-date" })).toThrow(
      "effective-from date",
    );
    expect(() => createRule({ effectiveTo: "not-a-date" })).toThrow(
      "effective-to date",
    );
  });

  it("rejects an effective-to date before effective-from", () => {
    expect(() =>
      createRule({
        effectiveFrom: "2026-07-21T12:00:00Z",
        effectiveTo: "2026-07-21T11:59:59Z",
      }),
    ).toThrow("effective-to date cannot precede");
  });

  it("allows an omitted effective-to date for an open-ended rule", () => {
    expect(createRule({ effectiveTo: undefined }).effectiveTo).toBeUndefined();
  });

  it("constructs equivalent state deterministically", () => {
    expect(valuesOf(createRule())).toEqual(valuesOf(createRule()));
  });

  it("rejects function-valued predicate and output-template fields", () => {
    const predicateCallback = (() => true) as unknown as DeclarativeRuleRecord;
    const outputTemplateCallback = (() => ({
      interventionTemplate: "CONTACT-CUSTOMER",
    })) as unknown as DeclarativeRuleRecord;
    const functionPredicate = {
      evaluate: () => true,
    } as unknown as DeclarativeRuleRecord;
    const functionOutputTemplate = {
      interventionTemplate: {
        create: () => ({ code: "CONTACT-CUSTOMER" }),
      },
    } as unknown as DeclarativeRuleRecord;

    expect(() => createRule({ predicate: predicateCallback })).toThrow(
      "predicate must be a declarative object",
    );
    expect(() =>
      createRule({ outputTemplate: outputTemplateCallback }),
    ).toThrow("output template must be a declarative object");
    expect(() => createRule({ predicate: functionPredicate })).toThrow(
      "cannot contain functions",
    );
    expect(() =>
      createRule({ outputTemplate: functionOutputTemplate }),
    ).toThrow("cannot contain functions");
  });

  it("rejects missing or non-declarative required objects", () => {
    expect(() =>
      createRule({ predicate: undefined as unknown as DeclarativeRuleRecord }),
    ).toThrow("predicate must be a declarative object");
    expect(() =>
      createRule({
        outputTemplate: new Date() as unknown as DeclarativeRuleRecord,
      }),
    ).toThrow("output template must contain only plain declarative data");
    expect(() =>
      createRule({ metadata: [] as unknown as DeclarativeRuleRecord }),
    ).toThrow("metadata must be a declarative object");
  });
});
