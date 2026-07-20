import {
  Identifier,
  type EvidenceComponentProvenance,
  type EvidenceConstructionRuleReference,
  type EvidenceQualifier,
  type EvidenceRelation,
  type EvidenceValue,
} from "@ginzaaipro/domain";

const encoder = new TextEncoder();
const componentIdentityVersion = "ginzaaipro:evidence-component:v1";
const evidenceIdentityVersion = "ginzaaipro:evidence:v2";

export const evidenceConstructionPolicyId =
  "VALIDATION_EVIDENCE_CONSTRUCTION";
export const evidenceConstructionPolicyVersion = "1.0.0";

const compareUtf8 = (left: string, right: string): number => {
  const leftBytes = encoder.encode(left.normalize("NFC"));
  const rightBytes = encoder.encode(right.normalize("NFC"));
  const length = Math.min(leftBytes.length, rightBytes.length);

  for (let index = 0; index < length; index += 1) {
    const difference = leftBytes[index]! - rightBytes[index]!;
    if (difference !== 0) {
      return difference;
    }
  }

  return leftBytes.length - rightBytes.length;
};

const lengthPrefixed = (value: string): string =>
  `${encoder.encode(value).byteLength}:${value}`;

const canonicalSequence = (scalars: readonly string[]): string =>
  scalars.map(lengthPrefixed).join("");

const sha256Hex = async (value: string): Promise<string> => {
  const digest = await globalThis.crypto.subtle.digest(
    "SHA-256",
    encoder.encode(value),
  );
  return Array.from(
    new Uint8Array(digest),
    (byte) => byte.toString(16).padStart(2, "0"),
  ).join("");
};

const valuePayload = (value: EvidenceValue): readonly string[] => {
  switch (value.kind) {
    case "text":
    case "integer":
    case "decimal":
    case "instant":
      return [value.value];
    case "boolean":
      return [String(value.value)];
    case "money":
      return [value.minorUnits, value.currency];
    case "percentage":
      return [String(value.basisPoints)];
  }
};

const valueScalars = (value: EvidenceValue): readonly string[] => [
  value.kind,
  ...valuePayload(value),
];

const valueSortKey = (value: EvidenceValue): string =>
  canonicalSequence(valueScalars(value));

const sortedQualifiers = (
  qualifiers: readonly EvidenceQualifier[],
): readonly EvidenceQualifier[] =>
  [...qualifiers].sort((left, right) => {
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
      : compareUtf8(valueSortKey(left.value), valueSortKey(right.value));
  });

const sortedProvenance = (
  provenance: readonly EvidenceComponentProvenance[],
): readonly EvidenceComponentProvenance[] =>
  [...provenance].sort((left, right) => {
    for (const result of [
      compareUtf8(left.signalId.value, right.signalId.value),
      compareUtf8(left.source, right.source),
      compareUtf8(left.sourceField, right.sourceField),
      Number(left.sourceLocator !== undefined) -
        Number(right.sourceLocator !== undefined),
      compareUtf8(left.sourceLocator ?? "", right.sourceLocator ?? ""),
    ]) {
      if (result !== 0) {
        return result;
      }
    }
    return 0;
  });

export interface EvidenceComponentIdentityInput {
  readonly organizationId: Identifier;
  readonly subjectId: Identifier | undefined;
  readonly relation: EvidenceRelation;
  readonly value: EvidenceValue;
  readonly qualifiers: readonly EvidenceQualifier[];
  readonly provenance: readonly EvidenceComponentProvenance[];
  readonly constructionRule: EvidenceConstructionRuleReference;
}

export const createEvidenceComponentIdentifier = async (
  input: EvidenceComponentIdentityInput,
): Promise<Identifier> => {
  const scalars: string[] = [
    componentIdentityVersion,
    input.organizationId.value,
    input.subjectId === undefined ? "absent" : "present",
    input.subjectId?.value ?? "",
    input.relation.namespace,
    input.relation.name,
    input.value.kind,
    ...valuePayload(input.value),
  ];

  const qualifiers = sortedQualifiers(input.qualifiers);
  scalars.push(String(qualifiers.length));
  for (const qualifier of qualifiers) {
    scalars.push(
      qualifier.relation.namespace,
      qualifier.relation.name,
      qualifier.value.kind,
      ...valuePayload(qualifier.value),
    );
  }

  const provenance = sortedProvenance(input.provenance);
  scalars.push(String(provenance.length));
  for (const entry of provenance) {
    scalars.push(
      entry.signalId.value,
      entry.source,
      entry.sourceField,
      entry.sourceLocator === undefined ? "absent" : "present",
      entry.sourceLocator ?? "",
    );
  }

  scalars.push(input.constructionRule.id, input.constructionRule.version);
  const digest = await sha256Hex(canonicalSequence(scalars));
  return new Identifier(`evidence-component:v1:${digest}`);
};

export interface EvidenceIdentityInput {
  readonly organizationId: Identifier;
  readonly signalIds: readonly Identifier[];
  readonly componentIds: readonly Identifier[];
}

export const createEvidenceIdentifier = async (
  input: EvidenceIdentityInput,
): Promise<Identifier> => {
  const signalIds = [...input.signalIds].sort((left, right) =>
    compareUtf8(left.value, right.value),
  );
  const componentIds = [...input.componentIds].sort((left, right) =>
    compareUtf8(left.value, right.value),
  );
  const scalars = [
    evidenceIdentityVersion,
    input.organizationId.value,
    evidenceConstructionPolicyId,
    evidenceConstructionPolicyVersion,
    String(signalIds.length),
    ...signalIds.map(({ value }) => value),
    String(componentIds.length),
    ...componentIds.map(({ value }) => value),
  ];
  const digest = await sha256Hex(canonicalSequence(scalars));
  return new Identifier(`evidence:v2:${digest}`);
};
