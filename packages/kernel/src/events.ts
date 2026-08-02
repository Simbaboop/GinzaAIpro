export const EventTypes = {
  EstimateSent: "estimate.sent",
  EstimateAccepted: "estimate.accepted",
  EstimateRejected: "estimate.rejected",

  JobBooked: "job.booked",
  JobStarted: "job.started",
  JobCompleted: "job.completed",
  JobCancelled: "job.cancelled",

  InvoiceSent: "invoice.sent",
  InvoicePaid: "invoice.paid",
  InvoiceOverdue: "invoice.overdue",

  CustomerContacted: "customer.contacted",
  CustomerResponded: "customer.responded",

  FindingCreated: "finding.created",
  DecisionCreated: "decision.created",
  ActionCreated: "action.created",
  ActionCompleted: "action.completed",
  EvidenceRecorded: "evidence.recorded",
} as const;

export type EventType =
  (typeof EventTypes)[keyof typeof EventTypes];

export const isEventType = (value: string): value is EventType =>
  Object.values(EventTypes).includes(value as EventType);
