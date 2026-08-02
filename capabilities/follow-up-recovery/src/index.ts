import type { Action, AnalysisContext, BusinessEvent, Capability, CapabilityMetadata, Decision, Evidence, Finding, MeasurementContext, Money } from "@ginzaaipro/kernel";

interface EstimateSentPayload extends Record<string, unknown> { estimateId: string; customerId: string; amountMinor: number; currency: string; }
interface EstimateResolvedPayload extends Record<string, unknown> { estimateId: string; }
interface JobBookedPayload extends Record<string, unknown> { estimateId: string; amountMinor: number; currency: string; }
const DAY_MS = 86_400_000;
const createId = (prefix: string) => `${prefix}_${crypto.randomUUID()}`;
const daysBetween = (earlier: string, later: string) => (new Date(later).getTime() - new Date(earlier).getTime()) / DAY_MS;
function isType<TPayload extends Record<string, unknown>>(event: BusinessEvent, type: string): event is BusinessEvent<TPayload> { return event.type === type; }

export class FollowUpRecoveryCapability implements Capability {
  metadata(): CapabilityMetadata {
    return { id: "CAP-001", name: "Follow-up Recovery", version: "0.1.0", description: "Identifies estimates lacking timely follow-up." };
  }

  observe(events: readonly BusinessEvent[], context: AnalysisContext): readonly Finding[] {
    const sent = events.filter((event) => isType<EstimateSentPayload>(event, "estimate.sent"));
    const resolvedIds = new Set(events.filter((event) => isType<EstimateResolvedPayload>(event, "estimate.accepted") || isType<EstimateResolvedPayload>(event, "estimate.declined")).map((event) => event.payload.estimateId));
    return sent.filter((event) => !resolvedIds.has(event.payload.estimateId) && daysBetween(event.occurredAt, context.now) >= 5).map((event) => ({
      id: createId("fnd"), organizationId: context.organizationId, capabilityId: this.metadata().id,
      type: "estimate.follow_up_overdue", title: "Estimate follow-up is overdue",
      description: `Estimate ${event.payload.estimateId} has been open for at least five days without acceptance or decline.`,
      severity: "warning", confidence: 1, detectedAt: context.now, sourceEventIds: [event.id], traceId: event.traceId,
      attributes: { estimateId: event.payload.estimateId, customerId: event.payload.customerId, expectedValue: { amountMinor: event.payload.amountMinor, currency: event.payload.currency } }
    }));
  }

  decide(findings: readonly Finding[], context: AnalysisContext): readonly Decision[] {
    return findings.map((finding) => {
      const expectedValue = finding.attributes?.expectedValue as Money | undefined;
      return { id: createId("dec"), organizationId: context.organizationId, capabilityId: this.metadata().id, findingId: finding.id,
        title: "Contact the customer today", rationale: finding.description,
        recommendedAction: "Call or message the customer, confirm whether the estimate is still active, and record the outcome.",
        priority: "high", confidence: finding.confidence, ...(expectedValue ? { expectedValue } : {}), createdAt: context.now, traceId: finding.traceId };
    });
  }

  measure(actions: readonly Action[], context: MeasurementContext): readonly Evidence[] {
    const completed = actions.find((action) => action.status === "completed");
    if (!completed) return [];
    return context.events.filter((event) => isType<JobBookedPayload>(event, "job.booked")).map((event) => ({
      id: createId("evd"), organizationId: context.organizationId, actionId: completed.id, kind: "financial",
      observedAt: context.now, description: `A job was booked from estimate ${event.payload.estimateId}.`,
      value: { amountMinor: event.payload.amountMinor, currency: event.payload.currency }, source: event.source,
      verified: true, traceId: event.traceId
    }));
  }
}
