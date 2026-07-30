import { Entity, Identifier } from "../common/index.js";

export type OperationalConditionStatus =
  | "active"
  | "resolved"
  | "suppressed";

export type OperationalSubjectType =
  | "organization"
  | "customer"
  | "employee"
  | "job"
  | "invoice";

export type OperationalConditionCode = string;

const operationalConditionStatuses: readonly OperationalConditionStatus[] =
  Object.freeze(["active", "resolved", "suppressed"]);
const operationalSubjectTypes: readonly OperationalSubjectType[] =
  Object.freeze(["organization", "customer", "employee", "job", "invoice"]);

export class OperationalCondition extends Entity {
  readonly #organizationId: Identifier;
  readonly #semanticFactIds: readonly Identifier[];
  readonly #conditionCode: OperationalConditionCode;
  readonly #subjectType: OperationalSubjectType;
  readonly #subjectId: Identifier;
  readonly #status: OperationalConditionStatus;
  readonly #ruleId: string;
  readonly #ruleSetVersion: string;
  readonly #observedAt: string;
  readonly #createdAt: string;
  readonly #traceId: Identifier;

  constructor(
    id: Identifier,
    organizationId: Identifier,
    semanticFactIds: readonly Identifier[],
    conditionCode: OperationalConditionCode,
    subjectType: OperationalSubjectType,
    subjectId: Identifier,
    status: OperationalConditionStatus,
    ruleId: string,
    ruleSetVersion: string,
    observedAt: string,
    createdAt: string,
    traceId: Identifier,
  ) {
    super(id);

    if (
      semanticFactIds.length === 0 ||
      semanticFactIds.some((value) => !(value instanceof Identifier))
    ) {
      throw new Error(
        "OperationalCondition requires at least one semantic-fact identifier.",
      );
    }

    const normalizedConditionCode = conditionCode.trim();
    const normalizedSubjectType = subjectType.trim();
    const normalizedStatus = status.trim();
    const normalizedRuleId = ruleId.trim();
    const normalizedRuleSetVersion = ruleSetVersion.trim();

    if (normalizedConditionCode.length === 0) {
      throw new Error("OperationalCondition condition code cannot be empty.");
    }
    if (
      !operationalSubjectTypes.includes(
        normalizedSubjectType as OperationalSubjectType,
      )
    ) {
      throw new Error("OperationalCondition subject type is not supported.");
    }
    if (
      !operationalConditionStatuses.includes(
        normalizedStatus as OperationalConditionStatus,
      )
    ) {
      throw new Error("OperationalCondition status is not supported.");
    }
    if (normalizedRuleId.length === 0) {
      throw new Error("OperationalCondition rule identifier cannot be empty.");
    }
    if (normalizedRuleSetVersion.length === 0) {
      throw new Error(
        "OperationalCondition rule-set version cannot be empty.",
      );
    }

    const observedTime = Date.parse(observedAt);
    const createdTime = Date.parse(createdAt);
    if (!Number.isFinite(observedTime)) {
      throw new Error(
        "OperationalCondition observation time must be a valid date-time value.",
      );
    }
    if (!Number.isFinite(createdTime)) {
      throw new Error(
        "OperationalCondition creation time must be a valid date-time value.",
      );
    }

    this.#organizationId = organizationId;
    this.#semanticFactIds = Object.freeze([...semanticFactIds]);
    this.#conditionCode = normalizedConditionCode;
    this.#subjectType = normalizedSubjectType as OperationalSubjectType;
    this.#subjectId = subjectId;
    this.#status = normalizedStatus as OperationalConditionStatus;
    this.#ruleId = normalizedRuleId;
    this.#ruleSetVersion = normalizedRuleSetVersion;
    this.#observedAt = new Date(observedTime).toISOString();
    this.#createdAt = new Date(createdTime).toISOString();
    this.#traceId = traceId;
    Object.freeze(this);
  }

  get organizationId(): Identifier {
    return this.#organizationId;
  }

  get semanticFactIds(): readonly Identifier[] {
    return this.#semanticFactIds;
  }

  get conditionCode(): OperationalConditionCode {
    return this.#conditionCode;
  }

  get subjectType(): OperationalSubjectType {
    return this.#subjectType;
  }

  get subjectId(): Identifier {
    return this.#subjectId;
  }

  get status(): OperationalConditionStatus {
    return this.#status;
  }

  get ruleId(): string {
    return this.#ruleId;
  }

  get ruleSetVersion(): string {
    return this.#ruleSetVersion;
  }

  get observedAt(): string {
    return this.#observedAt;
  }

  get createdAt(): string {
    return this.#createdAt;
  }

  get traceId(): Identifier {
    return this.#traceId;
  }
}
