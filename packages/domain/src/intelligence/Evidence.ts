import { Entity, Identifier, Percentage } from "../common/index.js";
import type { BusinessSignalValidationStatus } from "./BusinessSignal.js";
import {
  EvidenceComponent,
  type EvidenceValue,
} from "./EvidenceComponent.js";

const utf8Encoder = new TextEncoder();

const compareUtf8 = (left: string, right: string): number => {
  const leftBytes = utf8Encoder.encode(left.normalize("NFC"));
  const rightBytes = utf8Encoder.encode(right.normalize("NFC"));
  const length = Math.min(leftBytes.length, rightBytes.length);

  for (let index = 0; index < length; index += 1) {
    const difference = leftBytes[index]! - rightBytes[index]!;
    if (difference !== 0) {
      return difference;
    }
  }

  return leftBytes.length - rightBytes.length;
};

const jsonString = (value: string): string => JSON.stringify(value);

const renderValue = (value: EvidenceValue): string => {
  switch (value.kind) {
    case "text":
      return `text(${jsonString(value.value)})`;
    case "boolean":
      return `boolean(${String(value.value)})`;
    case "integer":
      return `integer(${value.value})`;
    case "decimal":
      return `decimal(${value.value})`;
    case "instant":
      return `instant(${jsonString(value.value)})`;
    case "money":
      return `money(minorUnits=${value.minorUnits},currency=${jsonString(value.currency)})`;
    case "percentage":
      return `percentage(basisPoints=${String(value.basisPoints)})`;
  }
};

const expectedValueKinds: Readonly<Record<string, EvidenceValue["kind"]>> =
  Object.freeze({
    "VAL-EVIDENCE-MONEY-001@1.0.0": "money",
    "VAL-EVIDENCE-PERCENTAGE-001@1.0.0": "percentage",
    "VAL-EVIDENCE-TEXT-001@1.0.0": "text",
    "VAL-EVIDENCE-BOOLEAN-001@1.0.0": "boolean",
    "VAL-EVIDENCE-INTEGER-001@1.0.0": "integer",
    "VAL-EVIDENCE-DECIMAL-001@1.0.0": "decimal",
  });

const renderComponent = (component: EvidenceComponent): string => {
  const ruleReference =
    `${component.constructionRule.id}@${component.constructionRule.version}`;
  const expectedKind = expectedValueKinds[ruleReference];
  const releasedInstantCompatibility =
    ruleReference === "VAL-EVIDENCE-TEXT-001@1.0.0" &&
    component.value.kind === "instant";
  if (expectedKind !== component.value.kind && !releasedInstantCompatibility) {
    throw new Error(
      "Evidence statement rendering failed for the construction rule.",
    );
  }

  const qualifiers = component.qualifiers
    .map(
      (qualifier) =>
        `${jsonString(`${qualifier.relation.namespace}:${qualifier.relation.name}`)}=${renderValue(qualifier.value)}`,
    )
    .join(", ");
  const provenance = component.provenance
    .map(
      (entry) =>
        `{signal=${jsonString(entry.signalId.value)}; source=${jsonString(entry.source)}; field=${jsonString(entry.sourceField)}; locator=${entry.sourceLocator === undefined ? "null" : jsonString(entry.sourceLocator)}}`,
    )
    .join(", ");

  return (
    `Validated component ${jsonString(component.id.value)}: ` +
    `subject=${component.subjectId === undefined ? "null" : jsonString(component.subjectId.value)}; ` +
    `relation=${jsonString(`${component.relation.namespace}:${component.relation.name}`)}; ` +
    `value=${renderValue(component.value)}; ` +
    `qualifiers=[${qualifiers}]; ` +
    `provenance=[${provenance}]; ` +
    `rule=${jsonString(ruleReference)}.`
  );
};

const renderEvidenceStatement = (
  components: readonly EvidenceComponent[],
): string => {
  if (components.length === 0) {
    throw new Error(
      "Evidence statement requires at least one canonical component.",
    );
  }
  return components.map(renderComponent).join("\n");
};

export class Evidence extends Entity {
  readonly #organizationId: Identifier;
  readonly #signalIds: readonly Identifier[];
  readonly #source: string;
  readonly #signalValidationStatus: "valid";
  readonly #verificationMethod: string;
  readonly #materialRelevance: Percentage;
  readonly #components: readonly EvidenceComponent[];
  readonly #confidence: Percentage;
  readonly #createdAt: string;

  constructor(
    id: Identifier,
    organizationId: Identifier,
    signalIds: readonly Identifier[],
    source: string,
    signalValidationStatus: BusinessSignalValidationStatus,
    verificationMethod: string,
    materialRelevance: Percentage,
    components: readonly EvidenceComponent[],
    confidence: Percentage,
    createdAt: string,
  ) {
    super(id);
    const normalizedSource = source.trim().normalize("NFC");
    const normalizedMethod = verificationMethod.trim().normalize("NFC");
    const createdTime = Date.parse(createdAt);
    if (signalIds.length === 0) {
      throw new Error("Evidence requires at least one originating signal.");
    }
    if (signalValidationStatus !== "valid") {
      throw new Error("Evidence requires validated originating signals.");
    }
    if (normalizedSource.length === 0 || normalizedMethod.length === 0) {
      throw new Error(
        "Evidence source and verification method cannot be empty.",
      );
    }
    if (materialRelevance.basisPoints === 0) {
      throw new Error("Evidence must be materially relevant.");
    }
    if (!Number.isFinite(createdTime)) {
      throw new Error("Evidence creation time must be a valid date-time value.");
    }

    const canonicalSignalIds = signalIds.map((signalId) => {
      if (
        !(signalId instanceof Identifier) ||
        signalId.value !== signalId.value.normalize("NFC")
      ) {
        throw new Error("Evidence signal identity must be canonical.");
      }
      return signalId;
    });
    canonicalSignalIds.sort((left, right) =>
      compareUtf8(left.value, right.value),
    );
    for (let index = 1; index < canonicalSignalIds.length; index += 1) {
      if (canonicalSignalIds[index - 1]!.equals(canonicalSignalIds[index]!)) {
        throw new Error("Evidence signal identity cannot be duplicated.");
      }
    }

    const canonicalComponents = components.map((component) => {
      if (!(component instanceof EvidenceComponent)) {
        throw new Error("Evidence component is invalid.");
      }
      return component;
    });
    if (canonicalComponents.length === 0) {
      throw new Error(
        "Evidence requires at least one structured factual component.",
      );
    }
    canonicalComponents.sort((left, right) =>
      compareUtf8(left.id.value, right.id.value),
    );
    for (let index = 1; index < canonicalComponents.length; index += 1) {
      if (canonicalComponents[index - 1]!.id.equals(canonicalComponents[index]!.id)) {
        throw new Error("Evidence component identity cannot be duplicated.");
      }
    }

    const supportedSignalIds = new Set<string>();
    for (const component of canonicalComponents) {
      for (const entry of component.provenance) {
        if (!canonicalSignalIds.some((signalId) => signalId.equals(entry.signalId))) {
          throw new Error(
            "Evidence component provenance must reference an originating signal.",
          );
        }
        supportedSignalIds.add(entry.signalId.value);
      }
    }
    if (
      canonicalSignalIds.some(
        (signalId) => !supportedSignalIds.has(signalId.value),
      )
    ) {
      throw new Error(
        "Every Evidence signal identity must support a component.",
      );
    }

    renderEvidenceStatement(canonicalComponents);

    this.#organizationId = organizationId;
    this.#signalIds = Object.freeze([...canonicalSignalIds]);
    this.#source = normalizedSource;
    this.#signalValidationStatus = signalValidationStatus;
    this.#verificationMethod = normalizedMethod;
    this.#materialRelevance = materialRelevance;
    this.#components = Object.freeze([...canonicalComponents]);
    this.#confidence = confidence;
    this.#createdAt = new Date(createdTime).toISOString();
    Object.freeze(this);
  }

  get organizationId(): Identifier { return this.#organizationId; }
  get signalIds(): readonly Identifier[] { return this.#signalIds; }
  get source(): string { return this.#source; }
  get signalValidationStatus(): "valid" {
    return this.#signalValidationStatus;
  }
  get verificationMethod(): string { return this.#verificationMethod; }
  get materialRelevance(): Percentage { return this.#materialRelevance; }
  get components(): readonly EvidenceComponent[] { return this.#components; }
  get statement(): string { return renderEvidenceStatement(this.#components); }
  get confidence(): Percentage { return this.#confidence; }
  get createdAt(): string { return this.#createdAt; }
}
