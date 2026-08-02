import { describe, expect, it } from "vitest";
import {
  InMemoryActionService,
  InMemoryEventService,
  type Decision,
} from "../src/index.js";

describe("GinzaAIpro kernel services", () => {
  it("records a business event with generated identity and timestamp", () => {
    const service = new InMemoryEventService();

    const event = service.record(
      {
        organizationId: "org_test",
        type: "estimate.sent",
        occurredAt: "2026-07-18T12:00:00.000Z",
        source: "test",
        payload: {
          estimateId: "est_001",
        },
        traceId: "trace_001",
        version: 1,
      },
      "2026-07-18T12:00:01.000Z",
    );

    expect(event.id).toMatch(/^evt_/);
    expect(event.recordedAt).toBe("2026-07-18T12:00:01.000Z");
    expect(service.list()).toHaveLength(1);
  });

  it("tracks an action from pending to completed", () => {
    const service = new InMemoryActionService();

    const decision: Decision = {
      id: "dec_001",
      organizationId: "org_test",
      capabilityId: "CAP-001",
      findingId: "fnd_001",
      title: "Contact customer",
      rationale: "Follow-up is overdue.",
      recommendedAction: "Call the customer.",
      priority: "high",
      confidence: 1,
      createdAt: "2026-07-18T12:00:00.000Z",
      traceId: "trace_001",
    };

    const action = service.create(decision);

    expect(action.status).toBe("pending");

    const completed = service.updateStatus(
      action.id,
      "completed",
      "2026-07-18T13:00:00.000Z",
      "Customer contacted.",
    );

    expect(completed.status).toBe("completed");
    expect(completed.completedAt).toBe("2026-07-18T13:00:00.000Z");
    expect(completed.notes).toBe("Customer contacted.");
  });
});
