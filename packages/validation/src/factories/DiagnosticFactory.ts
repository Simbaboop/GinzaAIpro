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
    [ValidationDiagnosticCodes.EvidenceComponentsMissing]:
      "Canonical Evidence requires at least one structured factual component.",
    [ValidationDiagnosticCodes.EvidenceComponentUnsupported]:
      "The structured factual component is not supported by the canonical Evidence contract.",
    [ValidationDiagnosticCodes.EvidenceComponentDuplicate]:
      "Canonical Evidence cannot contain duplicate component identity.",
    [ValidationDiagnosticCodes.EvidenceComponentValueInvalid]:
      "The Evidence component contains an invalid structural value.",
    [ValidationDiagnosticCodes.EvidenceComponentSubjectInvalid]:
      "The Evidence component subject is not a valid canonical identifier.",
    [ValidationDiagnosticCodes.EvidenceComponentRelationInvalid]:
      "The Evidence component relation is invalid or unsupported.",
    [ValidationDiagnosticCodes.EvidenceComponentQualifierInvalid]:
      "The Evidence component contains an invalid or duplicate qualifier.",
    [ValidationDiagnosticCodes.EvidenceComponentProvenanceInvalid]:
      "The Evidence component provenance is incomplete or invalid.",
    [ValidationDiagnosticCodes.EvidenceStatementRenderFailed]:
      "The Evidence statement could not be derived from canonical structured factual components.",
    [ValidationDiagnosticCodes.EvidenceStatementComponentMismatch]:
      "The materialized Evidence statement does not match the canonical derived statement.",
    [ValidationDiagnosticCodes.EvidenceOrganizationMismatch]:
      "The Evidence source and execution context must belong to the same Organization.",
    [ValidationDiagnosticCodes.EvidenceConstructionRuleUnsupported]:
      "No canonical Evidence construction rule supports the validated signal structure.",
    [ValidationDiagnosticCodes.EvidenceDomainReasoningRequired]:
      "Canonical Evidence construction cannot require semantic or operational reasoning.",
    [ValidationDiagnosticCodes.EvidenceStructuredCreated]:
      "Canonical Evidence with structured factual components was created.",
  });

export class DiagnosticFactory {
  createFailure(code: ValidationDiagnosticCode): Diagnostic {
    return new Diagnostic("error", code, messages[code]);
  }

  createSuccess(): Diagnostic {
    return new Diagnostic(
      "info",
      ValidationDiagnosticCodes.EvidenceStructuredCreated,
      messages[ValidationDiagnosticCodes.EvidenceStructuredCreated],
    );
  }
}
