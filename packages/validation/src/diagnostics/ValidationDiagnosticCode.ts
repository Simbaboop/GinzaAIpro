export const ValidationDiagnosticCodes = {
  IdentityInvalid: "IDENTITY_INVALID",
  IntegrityFailed: "INTEGRITY_FAILED",
  IncompleteSignal: "INCOMPLETE_SIGNAL",
  ConsistencyFailed: "CONSISTENCY_FAILED",
  QualificationFailed: "QUALIFICATION_FAILED",
} as const;

export type ValidationDiagnosticCode =
  (typeof ValidationDiagnosticCodes)[keyof typeof ValidationDiagnosticCodes];
