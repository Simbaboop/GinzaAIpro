import type { OperationalEntity } from "@/domain/core/operational-entity";

export type OutcomeStatus = "Open" | "Improving" | "Resolved" | "Escalated";

export type Outcome = OperationalEntity & {
  /**
   * The execution that produced this outcome.
   */
  executionId: string;

  /**
   * Current business outcome state.
   */
  status: OutcomeStatus;

  /**
   * What happened?
   */
  summary: string;

  /**
   * What did we learn?
   */
  learning: string;

  /**
   * When the outcome was measured.
   */
  measuredAt?: string;
};
