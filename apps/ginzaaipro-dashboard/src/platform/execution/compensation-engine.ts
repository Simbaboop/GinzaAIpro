import type { ExecutionTransaction } from "./transaction-engine";

/**
 * CompensationEngine
 *
 * Handles compensating actions when rollback is not possible.
 *
 * Example:
 * If an email cannot be unsent, compensation may mean
 * sending a correction or escalation notice.
 */
export class CompensationEngine {
  compensate(transaction: ExecutionTransaction): ExecutionTransaction {
    return {
      ...transaction,
      status: "Compensated",
      completedAt: new Date().toISOString(),
    };
  }
}
