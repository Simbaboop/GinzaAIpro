import type {
  Verification,
  VerificationCreateInput,
} from "@ginzaaipro/domain";
import type { Engine } from "../shared/index.js";

/**
 * Carries the canonical Domain construction contract into a VerificationEngine.
 *
 * Validation, normalization, identity, and serialization remain owned by the
 * Domain Verification factory.
 */
export type VerificationRequest = VerificationCreateInput;

export interface VerificationEngine
  extends Engine<VerificationRequest, Verification> {}
