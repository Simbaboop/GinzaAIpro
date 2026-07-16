import type {
  MeasurementUnit,
  ResearchProvenance,
} from "./organizational-dynamics-model";

export type OrganizationalStateMeasurements = {
  demand: number;
  capacity: number;
  arrivalRate: number;
  cycleTime: number;
  workInProcess: number;
  utilization: number;
  revenue: number;
  expenses: number;
  cashBalance: number;
  qualityScore: number;
  customerSatisfaction: number;
  errorRate: number;
  handoffs: number;
  trustScore: number;
  exceptionRate: number;
};

type OrganizationalStateBase = {
  id: string;
  tenantId: string;
  measurements: OrganizationalStateMeasurements;
  units: Record<keyof OrganizationalStateMeasurements, MeasurementUnit>;
  confidence: number;
  provenance: ResearchProvenance[];
};

export type ObservedOrganizationalState = OrganizationalStateBase & {
  kind: "observed";
  observedAt: string;
  evidenceIds: string[];
};

export type SimulatedOrganizationalState = OrganizationalStateBase & {
  kind: "simulated";
  simulatedAt: string;
  sourceStateId: string;
  modelIds: string[];
  horizon: string;
};

export type ForecastOrganizationalState = OrganizationalStateBase & {
  kind: "forecast";
  generatedAt: string;
  sourceStateId: string;
  modelIds: string[];
  forecastFor: string;
};

export type TargetOrganizationalState = OrganizationalStateBase & {
  kind: "target";
  proposedAt: string;
  targetFor: string;
  rationale: string;
  governanceDecisionId?: string;
};

export type OrganizationalState =
  | ObservedOrganizationalState
  | SimulatedOrganizationalState
  | ForecastOrganizationalState
  | TargetOrganizationalState;
