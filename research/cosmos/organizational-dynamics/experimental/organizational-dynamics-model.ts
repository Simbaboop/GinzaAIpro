export type EvidenceStrength = "A" | "B" | "C" | "D";

export type ModelMaturity =
  | "exploratory"
  | "candidate_hypothesis"
  | "validated_hypothesis"
  | "established_heuristic"
  | "established";

export type OrganizationalDynamicsCategory =
  | "capacity"
  | "coordination"
  | "decision"
  | "finance"
  | "quality"
  | "governance"
  | "learning"
  | "risk";

export type MeasurementUnit = {
  symbol: string;
  description: string;
};

export type ResearchProvenance = {
  source: string;
  collectedAt: string;
  collectedBy?: string;
  method?: string;
};

/** Experimental COSMOS research; neither canonical policy nor executable authority. */
export type OrganizationalDynamicsModel = {
  id: string;
  version: string;
  name: string;
  maturity: ModelMaturity;
  evidenceStrength: EvidenceStrength;
  category: OrganizationalDynamicsCategory;
  hypothesis: string;
  measurableOutcomes: string[];
  measurementUnits: Record<string, MeasurementUnit>;
  evidenceIds: string[];
  tenantScope: string[];
  confidence: number;
  provenance: ResearchProvenance[];
  createdAt: string;
  updatedAt: string;
  sourceNotes?: string;
};
