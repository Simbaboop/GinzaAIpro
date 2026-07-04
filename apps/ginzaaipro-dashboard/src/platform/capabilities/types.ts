/**
 * Capability Platform Types
 */

export type CapabilityStatus =
  | "Defined"
  | "Implemented"
  | "Governed"
  | "Learned"
  | "Optimized";

export type CapabilityRisk = "Low" | "Medium" | "High" | "Critical";

export interface BusinessCapability {
  id: string;

  name: string;

  description: string;

  status: CapabilityStatus;

  risk: CapabilityRisk;

  requiredInputs: string[];

  expectedOutcome: string;

  governanceRequired: boolean;

  verificationRequired: boolean;

  learningRequired: boolean;
}
