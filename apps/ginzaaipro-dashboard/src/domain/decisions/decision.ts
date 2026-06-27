import type { OperationalEntity } from "@/domain/core/operational-entity";

export type DecisionStatus = "Proposed" | "Approved" | "Rejected" | "Executed";

export type Decision = OperationalEntity & {
  observationId: string;

  decisionNote: string;

  owner: string;

  nextAction: string;

  status: DecisionStatus;
};
