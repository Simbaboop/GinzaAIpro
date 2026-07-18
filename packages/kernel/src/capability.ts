import type { Action, BusinessEvent, Decision, Evidence, Finding, ISODateTime, OrganizationId } from "./domain.js";

export interface CapabilityMetadata {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly description: string;
}

export interface AnalysisContext { readonly organizationId: OrganizationId; readonly now: ISODateTime; }
export interface MeasurementContext { readonly organizationId: OrganizationId; readonly now: ISODateTime; readonly events: readonly BusinessEvent[]; }

export interface Capability {
  metadata(): CapabilityMetadata;
  observe(events: readonly BusinessEvent[], context: AnalysisContext): readonly Finding[];
  decide(findings: readonly Finding[], context: AnalysisContext): readonly Decision[];
  measure(actions: readonly Action[], context: MeasurementContext): readonly Evidence[];
}
