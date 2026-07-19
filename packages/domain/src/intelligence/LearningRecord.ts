import { Entity, Identifier, Percentage } from "../common/index.js";

export class LearningRecord extends Entity {
  readonly #organizationId: Identifier;
  readonly #outcomeIds: readonly Identifier[];
  readonly #recommendationIds: readonly Identifier[];
  readonly #intelligenceIds: readonly Identifier[];
  readonly #conclusion: string;
  readonly #capabilityAffected: string;
  readonly #expectedFutureImprovement: string;
  readonly #confirmedAssumptions: readonly string[];
  readonly #rejectedAssumptions: readonly string[];
  readonly #unresolvedQuestions: readonly string[];
  readonly #futureDecisionImplications: readonly string[];
  readonly #confidence: Percentage;
  readonly #recordedAt: string;

  constructor(
    id: Identifier,
    organizationId: Identifier,
    outcomeIds: readonly Identifier[],
    recommendationIds: readonly Identifier[],
    intelligenceIds: readonly Identifier[],
    conclusion: string,
    capabilityAffected: string,
    expectedFutureImprovement: string,
    confirmedAssumptions: readonly string[],
    rejectedAssumptions: readonly string[],
    unresolvedQuestions: readonly string[],
    futureDecisionImplications: readonly string[],
    confidence: Percentage,
    recordedAt: string,
  ) {
    super(id);
    const normalizedConclusion = conclusion.trim();
    const normalizedCapability = capabilityAffected.trim();
    const normalizedImprovement = expectedFutureImprovement.trim();
    const recordedTime = Date.parse(recordedAt);
    if (outcomeIds.length === 0) {
      throw new Error("LearningRecord requires at least one measured outcome.");
    }
    if (
      normalizedConclusion.length === 0 ||
      normalizedCapability.length === 0 ||
      normalizedImprovement.length === 0
    ) {
      throw new Error(
        "LearningRecord conclusion, capability affected, and expected future improvement cannot be empty.",
      );
    }
    if (!Number.isFinite(recordedTime)) {
      throw new Error(
        "LearningRecord time must be a valid date-time value.",
      );
    }

    this.#organizationId = organizationId;
    this.#outcomeIds = Object.freeze([...outcomeIds]);
    this.#recommendationIds = Object.freeze([...recommendationIds]);
    this.#intelligenceIds = Object.freeze([...intelligenceIds]);
    this.#conclusion = normalizedConclusion;
    this.#capabilityAffected = normalizedCapability;
    this.#expectedFutureImprovement = normalizedImprovement;
    this.#confirmedAssumptions = Object.freeze(
      confirmedAssumptions.map((value) => value.trim()),
    );
    this.#rejectedAssumptions = Object.freeze(
      rejectedAssumptions.map((value) => value.trim()),
    );
    this.#unresolvedQuestions = Object.freeze(
      unresolvedQuestions.map((value) => value.trim()),
    );
    this.#futureDecisionImplications = Object.freeze(
      futureDecisionImplications.map((value) => value.trim()),
    );
    this.#confidence = confidence;
    this.#recordedAt = new Date(recordedTime).toISOString();
    Object.freeze(this);
  }

  get organizationId(): Identifier { return this.#organizationId; }
  get outcomeIds(): readonly Identifier[] { return this.#outcomeIds; }
  get recommendationIds(): readonly Identifier[] {
    return this.#recommendationIds;
  }
  get intelligenceIds(): readonly Identifier[] {
    return this.#intelligenceIds;
  }
  get conclusion(): string { return this.#conclusion; }
  get capabilityAffected(): string { return this.#capabilityAffected; }
  get expectedFutureImprovement(): string {
    return this.#expectedFutureImprovement;
  }
  get confirmedAssumptions(): readonly string[] {
    return this.#confirmedAssumptions;
  }
  get rejectedAssumptions(): readonly string[] {
    return this.#rejectedAssumptions;
  }
  get unresolvedQuestions(): readonly string[] {
    return this.#unresolvedQuestions;
  }
  get futureDecisionImplications(): readonly string[] {
    return this.#futureDecisionImplications;
  }
  get confidence(): Percentage { return this.#confidence; }
  get recordedAt(): string { return this.#recordedAt; }
}
