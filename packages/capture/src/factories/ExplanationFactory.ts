import { Explanation, type CaptureInput } from "@ginzaaipro/core";
import { Percentage } from "@ginzaaipro/domain";
import { defaultCaptureConfidence } from "../defaults.js";
import type { CaptureDiagnosticCode } from "../diagnostics/index.js";

const defaultConfidenceLimitation =
  "Initial confidence was not supplied; zero basis points was applied.";

const failureLimitations: Readonly<Record<CaptureDiagnosticCode, string>> = {
  CAPTURE_ORGANIZATION_MISMATCH:
    "The capture input crossed the engine context organization boundary.",
  CAPTURE_CATEGORY_INVALID:
    "The category was outside the canonical BusinessSignal category set.",
  CAPTURE_SOURCE_EMPTY: "The normalized source was empty.",
  CAPTURE_SOURCE_REFERENCE_EMPTY:
    "The normalized source reference was empty.",
  CAPTURE_OCCURRENCE_INVALID:
    "The occurrence time was not a valid explicitly zoned RFC 3339 instant.",
  CAPTURE_TIME_ORDER_INVALID:
    "The engine execution time preceded the occurrence time.",
  CAPTURE_VALUE_INVALID:
    "The value was not a supported non-empty canonical BusinessSignal value.",
  CAPTURE_SUBJECT_INVALID:
    "The supplied subject was not a canonical Identifier.",
  CAPTURE_CONFIDENCE_INVALID:
    "The supplied confidence was not a canonical Percentage.",
  CAPTURE_IDENTITY_MATERIAL_EMPTY:
    "The normalized deterministic identity material was empty.",
  CAPTURE_CONFIDENCE_DEFAULTED: defaultConfidenceLimitation,
  CAPTURE_SUCCEEDED: "No capture limitation was recorded.",
};

export class ExplanationFactory {
  createFailure(
    input: CaptureInput,
    code: CaptureDiagnosticCode,
  ): Explanation {
    const confidence =
      input.confidence instanceof Percentage
        ? input.confidence
        : defaultCaptureConfidence();

    return new Explanation(
      [],
      [],
      [failureLimitations[code]],
      confidence,
      `Capture failed at ${code}; no BusinessSignal was created.`,
    );
  }

  createSuccess(
    confidence: Percentage,
    confidenceDefaulted: boolean,
  ): Explanation {
    const limitations = confidenceDefaulted
      ? [defaultConfidenceLimitation]
      : [];
    const reasoning = confidenceDefaulted
      ? "Canonical intake was deterministically transformed into an immutable, unvalidated BusinessSignal using the documented zero-basis-point confidence default. Capture made no truth, reliability, or Evidence claim."
      : "Canonical intake was deterministically transformed into an immutable, unvalidated BusinessSignal using the supplied initial confidence. Capture made no truth, reliability, or Evidence claim.";

    return new Explanation(
      [],
      [],
      limitations,
      confidence,
      reasoning,
    );
  }
}
