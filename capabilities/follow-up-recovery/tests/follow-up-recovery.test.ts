import { describe, expect, it } from "vitest";
import { InMemoryActionService, InMemoryEventService, KernelRunner } from "@ginzaaipro/kernel";
import { FollowUpRecoveryCapability } from "../src/index.js";

describe("FollowUpRecoveryCapability", () => {
  it("creates a finding and decision for an unresolved estimate older than five days", () => {
    const events = new InMemoryEventService();
    const event = events.record({ organizationId: "org_gtm", type: "estimate.sent", occurredAt: "2026-07-10T14:00:00.000Z", source: "manual", payload: { estimateId: "est_1001", customerId: "cus_1001", amountMinor: 240000, currency: "USD" }, traceId: "trace_1001", version: 1 }, "2026-07-10T14:00:01.000Z");
    const result = new KernelRunner().runAnalysis(new FollowUpRecoveryCapability(), [event], { organizationId: "org_gtm", now: "2026-07-17T14:00:00.000Z" });
    expect(result.findings).toHaveLength(1);
    expect(result.decisions).toHaveLength(1);
    expect(result.decisions[0]?.expectedValue?.amountMinor).toBe(240000);
  });

  it("does not flag an accepted estimate", () => {
    const events = new InMemoryEventService();
    const sent = events.record({ organizationId: "org_gtm", type: "estimate.sent", occurredAt: "2026-07-10T14:00:00.000Z", source: "manual", payload: { estimateId: "est_1002", customerId: "cus_1002", amountMinor: 180000, currency: "USD" }, traceId: "trace_1002", version: 1 }, "2026-07-10T14:00:01.000Z");
    const accepted = events.record({ organizationId: "org_gtm", type: "estimate.accepted", occurredAt: "2026-07-12T14:00:00.000Z", source: "manual", payload: { estimateId: "est_1002" }, traceId: "trace_1002", version: 1 }, "2026-07-12T14:00:01.000Z");
    const result = new KernelRunner().runAnalysis(new FollowUpRecoveryCapability(), [sent, accepted], { organizationId: "org_gtm", now: "2026-07-17T14:00:00.000Z" });
    expect(result.findings).toHaveLength(0);
  });

  it("records verified revenue evidence after completion and booking", () => {
    const events = new InMemoryEventService();
    const capability = new FollowUpRecoveryCapability();
    const runner = new KernelRunner();
    const sent = events.record({ organizationId: "org_gtm", type: "estimate.sent", occurredAt: "2026-07-10T14:00:00.000Z", source: "manual", payload: { estimateId: "est_1003", customerId: "cus_1003", amountMinor: 320000, currency: "USD" }, traceId: "trace_1003", version: 1 }, "2026-07-10T14:00:01.000Z");
    const analysis = runner.runAnalysis(capability, [sent], { organizationId: "org_gtm", now: "2026-07-17T14:00:00.000Z" });
    const actions = new InMemoryActionService();
    const completed = actions.updateStatus(actions.create(analysis.decisions[0]!).id, "completed", "2026-07-17T15:00:00.000Z");
    const booked = events.record({ organizationId: "org_gtm", type: "job.booked", occurredAt: "2026-07-17T16:00:00.000Z", source: "manual", payload: { estimateId: "est_1003", amountMinor: 320000, currency: "USD" }, traceId: "trace_1003", version: 1 }, "2026-07-17T16:00:01.000Z");
    const evidence = runner.runMeasurement(capability, [completed], { organizationId: "org_gtm", now: "2026-07-17T17:00:00.000Z", events: [sent, booked] });
    expect(evidence).toHaveLength(1);
    expect(evidence[0]?.verified).toBe(true);
  });
});
