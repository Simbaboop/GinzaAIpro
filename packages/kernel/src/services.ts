import type { Action, ActionStatus, BusinessEvent, Decision, Evidence, Finding, ISODateTime } from "./domain.js";
import type { AnalysisContext, Capability, MeasurementContext } from "./capability.js";

function createId(prefix: string): string { return `${prefix}_${crypto.randomUUID()}`; }

export class InMemoryEventService {
  private readonly events: BusinessEvent[] = [];
  record<TPayload extends Record<string, unknown>>(event: Omit<BusinessEvent<TPayload>, "id" | "recordedAt">, recordedAt: ISODateTime): BusinessEvent<TPayload> {
    const stored: BusinessEvent<TPayload> = { ...event, id: createId("evt"), recordedAt };
    this.events.push(stored);
    return stored;
  }
  list(): readonly BusinessEvent[] { return [...this.events]; }
}

export class KernelRunner {
  runAnalysis(capability: Capability, events: readonly BusinessEvent[], context: AnalysisContext): { findings: readonly Finding[]; decisions: readonly Decision[] } {
    const findings = capability.observe(events, context);
    return { findings, decisions: capability.decide(findings, context) };
  }
  runMeasurement(capability: Capability, actions: readonly Action[], context: MeasurementContext): readonly Evidence[] {
    return capability.measure(actions, context);
  }
}

export class InMemoryActionService {
  private readonly actions = new Map<string, Action>();
  create(decision: Decision): Action {
    const action: Action = { id: createId("act"), organizationId: decision.organizationId, decisionId: decision.id, status: "pending", traceId: decision.traceId };
    this.actions.set(action.id, action);
    return action;
  }
  updateStatus(actionId: string, status: ActionStatus, at: ISODateTime, notes?: string): Action {
    const current = this.actions.get(actionId);
    if (!current) throw new Error(`Action not found: ${actionId}`);
    const next: Action = { ...current, status, ...(status === "started" ? { startedAt: at } : {}), ...(status === "completed" ? { completedAt: at } : {}), ...(notes ? { notes } : {}) };
    this.actions.set(actionId, next);
    return next;
  }
  list(): readonly Action[] { return [...this.actions.values()]; }
}
