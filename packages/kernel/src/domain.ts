export type ISODateTime = string;
export type EntityId = string;
export type OrganizationId = string;
export type TraceId = string;

export interface BusinessEvent<TPayload = Record<string, unknown>> {
  readonly id: EntityId;
  readonly organizationId: OrganizationId;
  readonly type: string;
  readonly occurredAt: ISODateTime;
  readonly recordedAt: ISODateTime;
  readonly source: string;
  readonly payload: TPayload;
  readonly metadata?: Readonly<Record<string, unknown>>;
  readonly traceId: TraceId;
  readonly version: number;
}

export type Severity = "info" | "warning" | "critical";

export interface Finding {
  readonly id: EntityId;
  readonly organizationId: OrganizationId;
  readonly capabilityId: string;
  readonly type: string;
  readonly title: string;
  readonly description: string;
  readonly severity: Severity;
  readonly confidence: number;
  readonly detectedAt: ISODateTime;
  readonly sourceEventIds: readonly EntityId[];
  readonly traceId: TraceId;
  readonly attributes?: Readonly<Record<string, unknown>>;
}

export type DecisionPriority = "low" | "medium" | "high" | "urgent";
export interface Money { readonly amountMinor: number; readonly currency: string; }

export interface Decision {
  readonly id: EntityId;
  readonly organizationId: OrganizationId;
  readonly capabilityId: string;
  readonly findingId: EntityId;
  readonly title: string;
  readonly rationale: string;
  readonly recommendedAction: string;
  readonly priority: DecisionPriority;
  readonly confidence: number;
  readonly expectedValue?: Money;
  readonly createdAt: ISODateTime;
  readonly traceId: TraceId;
}

export type ActionStatus = "pending" | "started" | "completed" | "dismissed" | "deferred";
export interface Action {
  readonly id: EntityId;
  readonly organizationId: OrganizationId;
  readonly decisionId: EntityId;
  readonly status: ActionStatus;
  readonly assignedTo?: EntityId;
  readonly startedAt?: ISODateTime;
  readonly completedAt?: ISODateTime;
  readonly notes?: string;
  readonly traceId: TraceId;
}

export type EvidenceKind = "outcome" | "financial" | "operational" | "user_confirmation";
export interface Evidence {
  readonly id: EntityId;
  readonly organizationId: OrganizationId;
  readonly actionId: EntityId;
  readonly kind: EvidenceKind;
  readonly observedAt: ISODateTime;
  readonly description: string;
  readonly value?: Money | number | string | boolean;
  readonly source: string;
  readonly verified: boolean;
  readonly traceId: TraceId;
}
