/**
 * Shared runtime core types.
 *
 * These types belong to the Runtime Core only.
 * They should not contain business-domain concepts.
 */

export type RuntimeEnvironment =
  | "development"
  | "testing"
  | "staging"
  | "production";

export type RuntimeSeverity = "Info" | "Warning" | "Error" | "Critical";

export type RuntimeId = string;

export type TraceId = string;

export type TenantId = string;

export type CapabilityName = string;
