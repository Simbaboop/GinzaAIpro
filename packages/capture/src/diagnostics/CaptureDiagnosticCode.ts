export const CaptureDiagnosticCodes = {
  OrganizationMismatch: "CAPTURE_ORGANIZATION_MISMATCH",
  CategoryInvalid: "CAPTURE_CATEGORY_INVALID",
  SourceEmpty: "CAPTURE_SOURCE_EMPTY",
  SourceReferenceEmpty: "CAPTURE_SOURCE_REFERENCE_EMPTY",
  OccurrenceInvalid: "CAPTURE_OCCURRENCE_INVALID",
  TimeOrderInvalid: "CAPTURE_TIME_ORDER_INVALID",
  ValueInvalid: "CAPTURE_VALUE_INVALID",
  SubjectInvalid: "CAPTURE_SUBJECT_INVALID",
  ConfidenceInvalid: "CAPTURE_CONFIDENCE_INVALID",
  IdentityMaterialEmpty: "CAPTURE_IDENTITY_MATERIAL_EMPTY",
  ConfidenceDefaulted: "CAPTURE_CONFIDENCE_DEFAULTED",
  Succeeded: "CAPTURE_SUCCEEDED",
} as const;

export type CaptureDiagnosticCode =
  (typeof CaptureDiagnosticCodes)[keyof typeof CaptureDiagnosticCodes];
