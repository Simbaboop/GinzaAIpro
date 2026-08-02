import { Identifier } from "@ginzaaipro/domain";
import { sha256Hex } from "./sha256.js";

const encoder = new TextEncoder();
const identityVersion = "ginzaaipro:business-signal:capture:v1";

export interface CaptureIdentityInput {
  readonly organizationId: Identifier;
  readonly source: string;
  readonly sourceReference: string;
  readonly deterministicIdentityMaterial: string;
}

const lengthPrefixed = (value: string): string =>
  `${encoder.encode(value).byteLength}:${value}`;

export const createBusinessSignalIdentifier = async (
  input: CaptureIdentityInput,
): Promise<Identifier> => {
  const canonicalSequence = [
    identityVersion,
    input.organizationId.value,
    input.source,
    input.sourceReference,
    input.deterministicIdentityMaterial,
  ]
    .map(lengthPrefixed)
    .join("");
  const digest = await sha256Hex(canonicalSequence);

  return new Identifier(`business-signal:capture:v1:${digest}`);
};
