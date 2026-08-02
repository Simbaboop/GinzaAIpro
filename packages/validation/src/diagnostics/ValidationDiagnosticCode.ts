export const ValidationDiagnosticCodes = {
  IdentityInvalid: "IDENTITY_INVALID",
  IntegrityFailed: "INTEGRITY_FAILED",
  IncompleteSignal: "INCOMPLETE_SIGNAL",
  ConsistencyFailed: "CONSISTENCY_FAILED",
  QualificationFailed: "QUALIFICATION_FAILED",
  EvidenceComponentsMissing: "EVIDENCE_COMPONENTS_MISSING",
  EvidenceComponentUnsupported: "EVIDENCE_COMPONENT_UNSUPPORTED",
  EvidenceComponentDuplicate: "EVIDENCE_COMPONENT_DUPLICATE",
  EvidenceComponentValueInvalid: "EVIDENCE_COMPONENT_VALUE_INVALID",
  EvidenceComponentSubjectInvalid: "EVIDENCE_COMPONENT_SUBJECT_INVALID",
  EvidenceComponentRelationInvalid: "EVIDENCE_COMPONENT_RELATION_INVALID",
  EvidenceComponentQualifierInvalid:
    "EVIDENCE_COMPONENT_QUALIFIER_INVALID",
  EvidenceComponentProvenanceInvalid:
    "EVIDENCE_COMPONENT_PROVENANCE_INVALID",
  EvidenceStatementRenderFailed: "EVIDENCE_STATEMENT_RENDER_FAILED",
  EvidenceStatementComponentMismatch:
    "EVIDENCE_STATEMENT_COMPONENT_MISMATCH",
  EvidenceOrganizationMismatch: "EVIDENCE_ORGANIZATION_MISMATCH",
  EvidenceConstructionRuleUnsupported:
    "EVIDENCE_CONSTRUCTION_RULE_UNSUPPORTED",
  EvidenceDomainReasoningRequired: "EVIDENCE_DOMAIN_REASONING_REQUIRED",
  EvidenceStructuredCreated: "EVIDENCE_STRUCTURED_CREATED",
} as const;

export type ValidationDiagnosticCode =
  (typeof ValidationDiagnosticCodes)[keyof typeof ValidationDiagnosticCodes];
