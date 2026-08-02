import { Entity, Identifier } from "../common/index.js";

const normalizeRequiredText = (value: string, field: string): string => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new Error(`OperationalRecommendation ${field} cannot be empty.`);
  }

  return value.trim();
};

const copyTextItems = (
  values: readonly string[],
  field: string,
): readonly string[] => {
  if (!Array.isArray(values)) {
    throw new Error(
      `OperationalRecommendation ${field} must be a declarative string array.`,
    );
  }

  const copied = values.map((value) => {
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new Error(
        `OperationalRecommendation ${field} must contain only non-empty declarative strings.`,
      );
    }
    return value.trim();
  });

  return Object.freeze(copied);
};

export class OperationalRecommendation extends Entity {
  readonly #organizationId: Identifier;
  readonly #sourceOperationalLeakagePriorityId: Identifier;
  readonly #traceId: Identifier;
  readonly #ruleId: string;
  readonly #ruleVersion: string;
  readonly #policyId: string;
  readonly #policyVersion: string;
  readonly #objective: string;
  readonly #intervention: string;
  readonly #rationale: string;
  readonly #expectedOutcome: string;
  readonly #successMetric: string;
  readonly #requiredEvidence: readonly string[];
  readonly #preconditions: readonly string[];
  readonly #constraints: readonly string[];
  readonly #createdAt: string;
  readonly #schemaVersion: string;

  constructor(
    recommendationId: Identifier,
    organizationId: Identifier,
    sourceOperationalLeakagePriorityId: Identifier,
    traceId: Identifier,
    ruleId: string,
    ruleVersion: string,
    policyId: string,
    policyVersion: string,
    objective: string,
    intervention: string,
    rationale: string,
    expectedOutcome: string,
    successMetric: string,
    requiredEvidence: readonly string[],
    preconditions: readonly string[],
    constraints: readonly string[],
    createdAt: string,
    schemaVersion: string,
  ) {
    super(recommendationId);

    if (!(recommendationId instanceof Identifier)) {
      throw new Error(
        "OperationalRecommendation requires a valid recommendation identifier.",
      );
    }
    if (!(organizationId instanceof Identifier)) {
      throw new Error(
        "OperationalRecommendation requires a valid organization identifier.",
      );
    }
    if (!(sourceOperationalLeakagePriorityId instanceof Identifier)) {
      throw new Error(
        "OperationalRecommendation requires a valid source-priority identifier.",
      );
    }
    if (!(traceId instanceof Identifier)) {
      throw new Error(
        "OperationalRecommendation requires a valid trace identifier.",
      );
    }

    const normalizedRuleId = normalizeRequiredText(
      ruleId,
      "rule identifier",
    );
    const normalizedRuleVersion = normalizeRequiredText(
      ruleVersion,
      "rule version",
    );
    const normalizedPolicyId = normalizeRequiredText(
      policyId,
      "policy identifier",
    );
    const normalizedPolicyVersion = normalizeRequiredText(
      policyVersion,
      "policy version",
    );
    const normalizedObjective = normalizeRequiredText(objective, "objective");
    const normalizedIntervention = normalizeRequiredText(
      intervention,
      "intervention",
    );
    const normalizedRationale = normalizeRequiredText(rationale, "rationale");
    const normalizedExpectedOutcome = normalizeRequiredText(
      expectedOutcome,
      "expected outcome",
    );
    const normalizedSuccessMetric = normalizeRequiredText(
      successMetric,
      "success metric",
    );
    const normalizedSchemaVersion = normalizeRequiredText(
      schemaVersion,
      "schema version",
    );

    if (typeof createdAt !== "string") {
      throw new Error(
        "OperationalRecommendation creation time must be a valid date-time value.",
      );
    }
    const createdTime = Date.parse(createdAt);
    if (!Number.isFinite(createdTime)) {
      throw new Error(
        "OperationalRecommendation creation time must be a valid date-time value.",
      );
    }

    this.#organizationId = organizationId;
    this.#sourceOperationalLeakagePriorityId =
      sourceOperationalLeakagePriorityId;
    this.#traceId = traceId;
    this.#ruleId = normalizedRuleId;
    this.#ruleVersion = normalizedRuleVersion;
    this.#policyId = normalizedPolicyId;
    this.#policyVersion = normalizedPolicyVersion;
    this.#objective = normalizedObjective;
    this.#intervention = normalizedIntervention;
    this.#rationale = normalizedRationale;
    this.#expectedOutcome = normalizedExpectedOutcome;
    this.#successMetric = normalizedSuccessMetric;
    this.#requiredEvidence = copyTextItems(
      requiredEvidence,
      "required evidence",
    );
    this.#preconditions = copyTextItems(preconditions, "preconditions");
    this.#constraints = copyTextItems(constraints, "constraints");
    this.#createdAt = new Date(createdTime).toISOString();
    this.#schemaVersion = normalizedSchemaVersion;
    Object.freeze(this);
  }

  get recommendationId(): Identifier {
    return this.id;
  }

  get organizationId(): Identifier {
    return this.#organizationId;
  }

  get sourceOperationalLeakagePriorityId(): Identifier {
    return this.#sourceOperationalLeakagePriorityId;
  }

  get traceId(): Identifier {
    return this.#traceId;
  }

  get ruleId(): string {
    return this.#ruleId;
  }

  get ruleVersion(): string {
    return this.#ruleVersion;
  }

  get policyId(): string {
    return this.#policyId;
  }

  get policyVersion(): string {
    return this.#policyVersion;
  }

  get objective(): string {
    return this.#objective;
  }

  get intervention(): string {
    return this.#intervention;
  }

  get rationale(): string {
    return this.#rationale;
  }

  get expectedOutcome(): string {
    return this.#expectedOutcome;
  }

  get successMetric(): string {
    return this.#successMetric;
  }

  get requiredEvidence(): readonly string[] {
    return this.#requiredEvidence;
  }

  get preconditions(): readonly string[] {
    return this.#preconditions;
  }

  get constraints(): readonly string[] {
    return this.#constraints;
  }

  get createdAt(): string {
    return this.#createdAt;
  }

  get schemaVersion(): string {
    return this.#schemaVersion;
  }
}
