import { Diagnostic } from "@ginzaaipro/core";
import {
  CaptureDiagnosticCodes,
  type CaptureDiagnosticCode,
} from "../diagnostics/index.js";

const messages: Readonly<Record<CaptureDiagnosticCode, string>> = {
  [CaptureDiagnosticCodes.OrganizationMismatch]:
    "Capture input organization does not match the engine context.",
  [CaptureDiagnosticCodes.CategoryInvalid]:
    "Capture input category is not a canonical business signal category.",
  [CaptureDiagnosticCodes.SourceEmpty]:
    "Capture input source cannot be empty.",
  [CaptureDiagnosticCodes.SourceReferenceEmpty]:
    "Capture input source reference cannot be empty.",
  [CaptureDiagnosticCodes.OccurrenceInvalid]:
    "Capture input occurrence time must be a valid explicitly zoned RFC 3339 date-time.",
  [CaptureDiagnosticCodes.TimeOrderInvalid]:
    "Capture time cannot precede the occurrence time.",
  [CaptureDiagnosticCodes.ValueInvalid]:
    "Capture input value must be a supported non-empty canonical business signal value.",
  [CaptureDiagnosticCodes.SubjectInvalid]:
    "Capture input subject must be an Identifier when supplied.",
  [CaptureDiagnosticCodes.ConfidenceInvalid]:
    "Capture input confidence must be a Percentage when supplied.",
  [CaptureDiagnosticCodes.IdentityMaterialEmpty]:
    "Capture input deterministic identity material cannot be empty.",
  [CaptureDiagnosticCodes.ConfidenceDefaulted]:
    "Initial confidence was not supplied and defaulted to zero basis points.",
  [CaptureDiagnosticCodes.Succeeded]:
    "Canonical intake was captured as an unvalidated business signal.",
};

export class DiagnosticFactory {
  createFailure(code: CaptureDiagnosticCode): Diagnostic {
    return new Diagnostic("error", code, messages[code]);
  }

  createConfidenceDefaulted(): Diagnostic {
    return new Diagnostic(
      "info",
      CaptureDiagnosticCodes.ConfidenceDefaulted,
      messages[CaptureDiagnosticCodes.ConfidenceDefaulted],
    );
  }

  createSuccess(): Diagnostic {
    return new Diagnostic(
      "info",
      CaptureDiagnosticCodes.Succeeded,
      messages[CaptureDiagnosticCodes.Succeeded],
    );
  }
}
