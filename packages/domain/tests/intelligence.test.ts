import { describe, expect, it } from "vitest";
import {
  Action,
  BusinessSignal,
  Evidence,
  ExecutionPlan,
  Identifier,
  Intelligence,
  LearningRecord,
  Outcome,
  Percentage,
  PriorityProfile,
  Recommendation,
  TimePeriod,
  Verification,
} from "../src/index.js";

const id = (value: string): Identifier => new Identifier(value);
const score = (basisPoints = 8_000): Percentage =>
  Percentage.fromBasisPoints(basisPoints);
const timestamp = "2026-07-18T12:00:00.000Z";

describe("canonical intelligence lifecycle", () => {
  it("constructs immutable, identifier-linked contracts", () => {
    const organizationId = id("org_001");
    const signal = new BusinessSignal(
      id("sig_001"),
      organizationId,
      "operational",
      "dispatch",
      "2026-07-18T10:00:00.000Z",
      "2026-07-18T10:01:00.000Z",
      42,
      score(),
      "valid",
      id("job_001"),
      "Matched source record.",
    );
    const evidence = new Evidence(
      id("evd_001"),
      organizationId,
      [signal.id],
      signal.source,
      signal.validationStatus,
      "Source record reconciliation",
      score(9_000),
      "Travel time exceeded the expected range.",
      score(),
      timestamp,
    );
    const intelligence = new Intelligence(
      id("int_001"),
      organizationId,
      "leakage",
      "Dispatch routing leakage",
      "Repeated routing gaps increased non-billable travel.",
      [evidence.id],
      score(),
      ["Travel records are complete."],
      ["Weather effects are not isolated."],
      timestamp,
    );
    const profile = new PriorityProfile(
      id("pri_001"),
      organizationId,
      intelligence.id,
      score(9_000),
      score(7_000),
      intelligence.confidence,
      score(8_000),
      score(8_500),
      "High recurring impact.",
    );
    const recommendation = new Recommendation(
      id("rec_001"),
      organizationId,
      [intelligence.id],
      profile.id,
      "Revise dispatch zones",
      "Group bookings into tighter geographic zones.",
      "Reduce non-billable travel time.",
      score(),
      intelligence.assumptions,
      intelligence.limitations,
    );
    const plan = new ExecutionPlan(
      id("plan_001"),
      organizationId,
      recommendation.id,
      "Pilot revised dispatch zones.",
      [id("act_001")],
      ["Reduce median travel time by 10%."],
      "active",
      ["Compare four-week baseline and pilot periods."],
      id("emp_001"),
      "2026-08-18T12:00:00.000Z",
    );
    const action = new Action(
      id("act_001"),
      organizationId,
      plan.id,
      "Configure the pilot dispatch zones.",
      "completed",
      id("emp_001"),
      "2026-07-25T12:00:00.000Z",
      "2026-07-24T12:00:00.000Z",
      [evidence.id],
    );
    const verification = new Verification(
      id("ver_001"),
      organizationId,
      "action",
      action.id,
      "Configuration audit",
      [evidence.id],
      "confirmed",
      timestamp,
      score(9_500),
      ["Audit confirms configuration, not business impact."],
      id("emp_002"),
    );
    const outcome = new Outcome(
      id("out_001"),
      organizationId,
      plan.id,
      "Median travel time",
      45,
      37,
      -8,
      "minutes",
      score(8_500),
      new TimePeriod(
        "2026-06-01T00:00:00.000Z",
        "2026-06-30T23:59:59.000Z",
      ),
      [evidence.id],
    );
    const learning = new LearningRecord(
      id("learn_001"),
      organizationId,
      [outcome.id],
      [recommendation.id],
      [intelligence.id],
      "Geographic grouping reduced median travel time.",
      "Dispatch planning",
      "Future dispatch decisions can use validated geographic grouping.",
      ["Travel records were complete."],
      [],
      ["Will the effect persist during peak season?"],
      ["Prefer geographic grouping in future dispatch decisions."],
      score(8_500),
      timestamp,
    );

    for (const contract of [
      signal,
      evidence,
      intelligence,
      profile,
      recommendation,
      plan,
      action,
      verification,
      outcome,
      learning,
    ]) {
      expect(Object.isFrozen(contract)).toBe(true);
    }
    for (const identifiers of [
      evidence.signalIds,
      intelligence.evidenceIds,
      recommendation.intelligenceIds,
      plan.actionIds,
      action.evidenceIds,
      verification.evidenceIds,
      outcome.evidenceIds,
      learning.outcomeIds,
    ]) {
      expect(Object.isFrozen(identifiers)).toBe(true);
    }

    expect(signal.subjectId).toBeInstanceOf(Identifier);
    expect(evidence.signalIds[0]).toBe(signal.id);
    expect(intelligence.evidenceIds[0]).toBe(evidence.id);
    expect(profile.intelligenceId).toBe(intelligence.id);
    expect(recommendation.intelligenceIds[0]).toBe(intelligence.id);
    expect(recommendation.priorityProfileId).toBe(profile.id);
    expect(Object.isFrozen(recommendation.priorityProfileId)).toBe(true);
    expect(plan.recommendationId).toBe(recommendation.id);
    expect(action.executionPlanId).toBe(plan.id);
    expect(verification.subjectId).toBe(action.id);
    expect(outcome.executionPlanId).toBe(plan.id);
    expect(learning.outcomeIds[0]).toBe(outcome.id);
    expect(learning.capabilityAffected).toBe("Dispatch planning");
    expect(learning.expectedFutureImprovement).toBe(
      "Future dispatch decisions can use validated geographic grouping.",
    );
    expect(learning.conclusion).toBe(
      "Geographic grouping reduced median travel time.",
    );
    expect(learning.confirmedAssumptions).toEqual([
      "Travel records were complete.",
    ]);
    expect(learning.unresolvedQuestions).toEqual([
      "Will the effect persist during peak season?",
    ]);
    expect(learning.futureDecisionImplications).toEqual([
      "Prefer geographic grouping in future dispatch decisions.",
    ]);
  });

  it("rejects invalid signal timestamps and impossible ordering", () => {
    const create = (occurredAt: string, capturedAt: string) =>
      new BusinessSignal(
        id("sig_001"),
        id("org_001"),
        "system",
        "scheduler",
        occurredAt,
        capturedAt,
        true,
        score(),
        "valid",
      );

    expect(() => create("not-a-date", timestamp)).toThrow("timestamps");
    expect(() =>
      create("2026-07-18T13:00:00.000Z", timestamp),
    ).toThrow("captured before");
  });

  it("does not allow unvalidated signals or missing origins to become evidence", () => {
    const create = (
      signalIds: readonly Identifier[],
      status: "unvalidated" | "valid",
    ) =>
      new Evidence(
        id("evd_001"),
        id("org_001"),
        signalIds,
        "ledger",
        status,
        "Reconciliation",
        score(),
        "Invoice remained unpaid.",
        score(),
        timestamp,
      );

    expect(() => create([], "valid")).toThrow("originating signal");
    expect(() => create([id("sig_001")], "unvalidated")).toThrow(
      "validated originating signals",
    );
  });

  it("requires evidence for intelligence and outcomes", () => {
    expect(
      () =>
        new Intelligence(
          id("int_001"),
          id("org_001"),
          "risk",
          "Collection risk",
          "Overdue invoices are increasing.",
          [],
          score(),
          [],
          [],
          timestamp,
        ),
    ).toThrow("evidence identifier");

    expect(
      () =>
        new Outcome(
          id("out_001"),
          id("org_001"),
          id("plan_001"),
          "Cycle time",
          10,
          8,
          -2,
          "days",
          score(),
          new TimePeriod(
            "2026-07-01T00:00:00.000Z",
            "2026-07-18T00:00:00.000Z",
          ),
          [],
        ),
    ).toThrow("supporting evidence");
  });

  it("requires executable work and governed success criteria for plans", () => {
    expect(
      () =>
        new ExecutionPlan(
          id("plan_001"),
          id("org_001"),
          id("rec_001"),
          "Run a controlled pilot.",
          [],
          ["Reduce cycle time."],
          "planned",
          ["Compare baseline and pilot periods."],
        ),
    ).toThrow("action identifier");
  });

  it("requires measured outcomes for learning", () => {
    expect(
      () =>
        new LearningRecord(
          id("learn_001"),
          id("org_001"),
          [],
          [],
          [],
          "A conclusion",
          "Dispatch planning",
          "Improve future routing decisions.",
          [],
          [],
          [],
          [],
          score(),
          timestamp,
        ),
    ).toThrow("measured outcome");
  });

  it("requires capability-development context for learning", () => {
    const create = (
      capabilityAffected: string,
      expectedFutureImprovement: string,
    ) =>
      new LearningRecord(
        id("learn_001"),
        id("org_001"),
        [id("out_001")],
        [id("rec_001")],
        [id("int_001")],
        "A measured conclusion.",
        capabilityAffected,
        expectedFutureImprovement,
        ["The baseline was representative."],
        [],
        ["Will seasonality change the result?"],
        ["Apply the learning to future planning."],
        score(),
        timestamp,
      );

    expect(() => create("   ", "Improve future decisions.")).toThrow(
      "capability affected",
    );
    expect(() => create("Dispatch planning", "   ")).toThrow(
      "expected future improvement",
    );
  });

  it("requires and retains exact recommendation prioritization context", () => {
    const intelligenceIds = [id("int_001")] as const;
    const priorityProfileId = id("pri_001");
    const create = (profileId: Identifier) =>
      new Recommendation(
        id("rec_001"),
        id("org_001"),
        intelligenceIds,
        profileId,
        "Improve dispatch planning",
        "Apply the validated routing change.",
        "Reduce median travel time.",
        score(),
        ["The pilot result is representative."],
        ["Peak season remains untested."],
      );

    const recommendation = create(priorityProfileId);
    expect(recommendation.priorityProfileId).toBe(priorityProfileId);
    expect(recommendation.intelligenceIds).toEqual(intelligenceIds);
    expect(Object.isFrozen(recommendation)).toBe(true);
    expect(Object.isFrozen(recommendation.priorityProfileId)).toBe(true);
    expect(() =>
      create(undefined as unknown as Identifier),
    ).toThrow("priority-profile identifier");

    expect(
      () =>
        new Recommendation(
          id("rec_002"),
          id("org_001"),
          [],
          priorityProfileId,
          "Improve dispatch planning",
          "Apply the validated routing change.",
          "Reduce median travel time.",
          score(),
          [],
          [],
        ),
    ).toThrow("intelligence identifier");
  });

  it("distinguishes a completion claim from objective verification", () => {
    const action = new Action(
      id("act_001"),
      id("org_001"),
      id("plan_001"),
      "Complete a controlled change.",
      "completed",
      undefined,
      undefined,
      timestamp,
    );

    expect(action.status).toBe("completed");
    expect(action.completedAt).toBe(timestamp);
    expect(action).not.toHaveProperty("verification");
    expect(() =>
      new Verification(
        id("ver_001"),
        id("org_001"),
        "action",
        action.id,
        "Audit",
        [],
        "confirmed",
        timestamp,
        score(),
        [],
      ),
    ).toThrow("supporting evidence");
  });

  it("enforces bounded confidence and valid completion timestamps", () => {
    expect(() => Percentage.fromBasisPoints(10_001)).toThrow();
    expect(
      () =>
        new Action(
          id("act_001"),
          id("org_001"),
          id("plan_001"),
          "Complete a controlled change.",
          "completed",
        ),
    ).toThrow("completion timestamp");
    expect(
      () =>
        new Action(
          id("act_001"),
          id("org_001"),
          id("plan_001"),
          "Complete a controlled change.",
          "planned",
          undefined,
          undefined,
          "not-a-date",
        ),
    ).toThrow("completion time");
  });
});
