import { Diagnostic } from "@ginzaaipro/core";
import {
  ValidationDiagnosticCodes,
  type ValidationDiagnosticCode,
} from "../diagnostics/index.js";

const messages: Readonly<Record<ValidationDiagnosticCode, string>> =
  Object.freeze({
    [ValidationDiagnosticCodes.IdentityInvalid]:
      "The signal does not have valid canonical identity.",
    [ValidationDiagnosticCodes.IntegrityFailed]:
      "The signal contains an invalid canonical value or timestamp.",
    [ValidationDiagnosticCodes.IncompleteSignal]:
      "The signal does not contain sufficient canonical content.",
    [ValidationDiagnosticCodes.ConsistencyFailed]:
      "The signal contains internally inconsistent temporal state.",
    [ValidationDiagnosticCodes.QualificationFailed]:
      "The signal has not been validated for evidence qualification.",
  });

export class DiagnosticFactory {
  createFailure(code: ValidationDiagnosticCode): Diagnostic {
    return new Diagnostic("error", code, messages[code]);
  }
}
