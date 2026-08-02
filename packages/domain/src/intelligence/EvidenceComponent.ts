import { Identifier } from "../common/index.js";

export type EvidenceValue =
  | Readonly<{ kind: "text"; value: string }>
  | Readonly<{ kind: "boolean"; value: boolean }>
  | Readonly<{ kind: "integer"; value: string }>
  | Readonly<{ kind: "decimal"; value: string }>
  | Readonly<{ kind: "instant"; value: string }>
  | Readonly<{ kind: "money"; minorUnits: string; currency: string }>
  | Readonly<{ kind: "percentage"; basisPoints: number }>;

const relationTokenPattern =
  /^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$/;
const canonicalIntegerPattern = /^(?:0|-?[1-9][0-9]*)$/;
const canonicalDecimalPattern =
  /^-?(?:0|[1-9][0-9]*)\.[0-9]*[1-9]$/;
const instantPattern =
  /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d+)?(Z|[+-]\d{2}:\d{2})$/;
const semanticVersionPattern =
  /^(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)\.(?:0|[1-9][0-9]*)$/;
const utf8Encoder = new TextEncoder();

const normalizeText = (value: string): string =>
  value.trim().normalize("NFC");

const assertCanonicalIdentifier: (
  value: unknown,
  field: string,
) => asserts value is Identifier = (value, field) => {
  if (
    !(value instanceof Identifier) ||
    value.value !== value.value.normalize("NFC")
  ) {
    throw new Error(`${field} must be a canonical Identifier.`);
  }
};

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

const evidenceValueScalars = (value: EvidenceValue): readonly string[] => {
  switch (value.kind) {
    case "text":
    case "integer":
    case "decimal":
    case "instant":
      return [value.kind, value.value];
    case "boolean":
      return [value.kind, String(value.value)];
    case "money":
      return [value.kind, value.minorUnits, value.currency];
    case "percentage":
      return [value.kind, String(value.basisPoints)];
  }
};

const evidenceValueKey = (value: EvidenceValue): string =>
  JSON.stringify(evidenceValueScalars(value));

const normalizeInstant = (value: string): string => {
  const match = instantPattern.exec(value);
  if (match === null) {
    throw new Error(
      "Evidence instant value must include an explicit RFC 3339 timezone.",
    );
  }

  const [, yearText, monthText, dayText, hourText, minuteText, secondText, zone] =
    match;
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const hour = Number(hourText);
  const minute = Number(minuteText);
  const second = Number(secondText);
  const zoneText = zone!;
  const leapYear =
    year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const daysInMonth = [
    31,
    leapYear ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ][month - 1];
  const zoneHour =
    zoneText === "Z" ? 0 : Number(zoneText.slice(1, 3));
  const zoneMinute =
    zoneText === "Z" ? 0 : Number(zoneText.slice(4, 6));
  if (
    daysInMonth === undefined ||
    day < 1 ||
    day > daysInMonth ||
    hour > 23 ||
    minute > 59 ||
    second > 59 ||
    zoneHour > 23 ||
    zoneMinute > 59
  ) {
    throw new Error("Evidence instant value must be valid.");
  }

  const time = Date.parse(value);
  if (!Number.isFinite(time)) {
    throw new Error("Evidence instant value must be valid.");
  }
  return new Date(time).toISOString();
};

const normalizeEvidenceValue = (input: EvidenceValue): EvidenceValue => {
  if (typeof input !== "object" || input === null || !("kind" in input)) {
    throw new Error("Evidence value must use a supported structural kind.");
  }

  switch (input.kind) {
    case "text": {
      if (typeof input.value !== "string") {
        throw new Error("Evidence text value must be a string.");
      }
      const value = normalizeText(input.value);
      if (value.length === 0) {
        throw new Error("Evidence text value cannot be empty.");
      }
      return Object.freeze({ kind: "text", value });
    }
    case "boolean":
      if (typeof input.value !== "boolean") {
        throw new Error("Evidence boolean value must be boolean.");
      }
      return Object.freeze({ kind: "boolean", value: input.value });
    case "integer":
      if (
        typeof input.value !== "string" ||
        !canonicalIntegerPattern.test(input.value)
      ) {
        throw new Error("Evidence integer value is not canonical.");
      }
      return Object.freeze({ kind: "integer", value: input.value });
    case "decimal":
      if (
        typeof input.value !== "string" ||
        !canonicalDecimalPattern.test(input.value)
      ) {
        throw new Error("Evidence decimal value is not canonical.");
      }
      return Object.freeze({ kind: "decimal", value: input.value });
    case "instant": {
      if (typeof input.value !== "string") {
        throw new Error("Evidence instant value must be a string.");
      }
      return Object.freeze({
        kind: "instant",
        value: normalizeInstant(input.value),
      });
    }
    case "money":
      if (
        typeof input.minorUnits !== "string" ||
        !canonicalIntegerPattern.test(input.minorUnits) ||
        typeof input.currency !== "string" ||
        !/^[A-Z]{3}$/.test(input.currency)
      ) {
        throw new Error("Evidence money value is not canonical.");
      }
      return Object.freeze({
        kind: "money",
        minorUnits: input.minorUnits,
        currency: input.currency,
      });
    case "percentage":
      if (
        typeof input.basisPoints !== "number" ||
        !Number.isInteger(input.basisPoints) ||
        input.basisPoints < 0 ||
        input.basisPoints > 10_000
      ) {
        throw new Error("Evidence percentage value is not canonical.");
      }
      return Object.freeze({
        kind: "percentage",
        basisPoints: input.basisPoints,
      });
    default:
      throw new Error("Evidence value kind is unsupported.");
  }
};

export class EvidenceRelation {
  readonly #namespace: string;
  readonly #name: string;

  constructor(namespace: string, name: string) {
    const normalizedNamespace = normalizeText(namespace);
    const normalizedName = normalizeText(name);
    if (
      !relationTokenPattern.test(normalizedNamespace) ||
      !relationTokenPattern.test(normalizedName)
    ) {
      throw new Error("Evidence relation is invalid.");
    }

    this.#namespace = normalizedNamespace;
    this.#name = normalizedName;
    Object.freeze(this);
  }

  get namespace(): string { return this.#namespace; }
  get name(): string { return this.#name; }
}

export class EvidenceQualifier {
  readonly #relation: EvidenceRelation;
  readonly #value: EvidenceValue;

  constructor(relation: EvidenceRelation, value: EvidenceValue) {
    if (!(relation instanceof EvidenceRelation)) {
      throw new Error("Evidence qualifier relation is invalid.");
    }

    this.#relation = relation;
    this.#value = normalizeEvidenceValue(value);
    Object.freeze(this);
  }

  get relation(): EvidenceRelation { return this.#relation; }
  get value(): EvidenceValue { return this.#value; }
}

export class EvidenceComponentProvenance {
  readonly #signalId: Identifier;
  readonly #source: string;
  readonly #sourceField: string;
  readonly #sourceLocator: string | undefined;

  constructor(
    signalId: Identifier,
    source: string,
    sourceField: string,
    sourceLocator?: string,
  ) {
    assertCanonicalIdentifier(signalId, "Evidence provenance signal");
    const normalizedSource = normalizeText(source);
    const normalizedSourceField = normalizeText(sourceField);
    const normalizedSourceLocator =
      sourceLocator === undefined ? undefined : normalizeText(sourceLocator);
    if (normalizedSource.length === 0) {
      throw new Error("Evidence provenance source cannot be empty.");
    }
    if (!relationTokenPattern.test(normalizedSourceField)) {
      throw new Error("Evidence provenance source field is invalid.");
    }
    if (
      sourceLocator !== undefined &&
      normalizedSourceLocator?.length === 0
    ) {
      throw new Error(
        "Evidence provenance source locator cannot be empty when supplied.",
      );
    }

    this.#signalId = signalId;
    this.#source = normalizedSource;
    this.#sourceField = normalizedSourceField;
    this.#sourceLocator = normalizedSourceLocator;
    Object.freeze(this);
  }

  get signalId(): Identifier { return this.#signalId; }
  get source(): string { return this.#source; }
  get sourceField(): string { return this.#sourceField; }
  get sourceLocator(): string | undefined { return this.#sourceLocator; }
}

export class EvidenceConstructionRuleReference {
  readonly #id: string;
  readonly #version: string;

  constructor(id: string, version: string) {
    const normalizedId = normalizeText(id);
    const normalizedVersion = normalizeText(version);
    if (normalizedId.length === 0) {
      throw new Error("Evidence construction rule identifier cannot be empty.");
    }
    if (!semanticVersionPattern.test(normalizedVersion)) {
      throw new Error(
        "Evidence construction rule version must be a semantic version.",
      );
    }

    this.#id = normalizedId;
    this.#version = normalizedVersion;
    Object.freeze(this);
  }

  get id(): string { return this.#id; }
  get version(): string { return this.#version; }
}

export class EvidenceComponent {
  readonly #id: Identifier;
  readonly #subjectId: Identifier | undefined;
  readonly #relation: EvidenceRelation;
  readonly #value: EvidenceValue;
  readonly #qualifiers: readonly EvidenceQualifier[];
  readonly #provenance: readonly EvidenceComponentProvenance[];
  readonly #constructionRule: EvidenceConstructionRuleReference;

  constructor(
    id: Identifier,
    subjectId: Identifier | undefined,
    relation: EvidenceRelation,
    value: EvidenceValue,
    qualifiers: readonly EvidenceQualifier[],
    provenance: readonly EvidenceComponentProvenance[],
    constructionRule: EvidenceConstructionRuleReference,
  ) {
    assertCanonicalIdentifier(id, "Evidence component identity");
    if (subjectId !== undefined) {
      assertCanonicalIdentifier(subjectId, "Evidence component subject");
    }
    if (!(relation instanceof EvidenceRelation)) {
      throw new Error("Evidence component relation is invalid.");
    }
    if (!(constructionRule instanceof EvidenceConstructionRuleReference)) {
      throw new Error("Evidence component construction rule is invalid.");
    }

    const normalizedQualifiers = qualifiers.map((qualifier) => {
      if (!(qualifier instanceof EvidenceQualifier)) {
        throw new Error("Evidence component qualifier is invalid.");
      }
      return qualifier;
    });
    normalizedQualifiers.sort((left, right) => {
      const namespaceOrder = compareUtf8(
        left.relation.namespace,
        right.relation.namespace,
      );
      if (namespaceOrder !== 0) {
        return namespaceOrder;
      }
      const nameOrder = compareUtf8(
        left.relation.name,
        right.relation.name,
      );
      return nameOrder !== 0
        ? nameOrder
        : compareUtf8(evidenceValueKey(left.value), evidenceValueKey(right.value));
    });
    for (let index = 1; index < normalizedQualifiers.length; index += 1) {
      const previous = normalizedQualifiers[index - 1]!;
      const current = normalizedQualifiers[index]!;
      if (
        previous.relation.namespace === current.relation.namespace &&
        previous.relation.name === current.relation.name &&
        evidenceValueKey(previous.value) === evidenceValueKey(current.value)
      ) {
        throw new Error("Evidence component qualifier cannot be duplicated.");
      }
    }

    const normalizedProvenance = provenance.map((entry) => {
      if (!(entry instanceof EvidenceComponentProvenance)) {
        throw new Error("Evidence component provenance is invalid.");
      }
      return entry;
    });
    if (normalizedProvenance.length === 0) {
      throw new Error(
        "Evidence component requires at least one provenance entry.",
      );
    }
    normalizedProvenance.sort((left, right) => {
      for (const order of [
        compareUtf8(left.signalId.value, right.signalId.value),
        compareUtf8(left.source, right.source),
        compareUtf8(left.sourceField, right.sourceField),
        Number(left.sourceLocator !== undefined) -
          Number(right.sourceLocator !== undefined),
        compareUtf8(left.sourceLocator ?? "", right.sourceLocator ?? ""),
      ]) {
        if (order !== 0) {
          return order;
        }
      }
      return 0;
    });
    for (let index = 1; index < normalizedProvenance.length; index += 1) {
      const previous = normalizedProvenance[index - 1]!;
      const current = normalizedProvenance[index]!;
      if (
        previous.signalId.equals(current.signalId) &&
        previous.source === current.source &&
        previous.sourceField === current.sourceField &&
        previous.sourceLocator === current.sourceLocator
      ) {
        throw new Error("Evidence component provenance cannot be duplicated.");
      }
    }

    this.#id = id;
    this.#subjectId = subjectId;
    this.#relation = relation;
    this.#value = normalizeEvidenceValue(value);
    this.#qualifiers = Object.freeze([...normalizedQualifiers]);
    this.#provenance = Object.freeze([...normalizedProvenance]);
    this.#constructionRule = constructionRule;
    Object.freeze(this);
  }

  get id(): Identifier { return this.#id; }
  get subjectId(): Identifier | undefined { return this.#subjectId; }
  get relation(): EvidenceRelation { return this.#relation; }
  get value(): EvidenceValue { return this.#value; }
  get qualifiers(): readonly EvidenceQualifier[] { return this.#qualifiers; }
  get provenance(): readonly EvidenceComponentProvenance[] {
    return this.#provenance;
  }
  get constructionRule(): EvidenceConstructionRuleReference {
    return this.#constructionRule;
  }
}
