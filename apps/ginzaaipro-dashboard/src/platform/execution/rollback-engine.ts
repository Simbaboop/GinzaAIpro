import type { ExecutionTransaction } from "./transaction-engine";

/**
 * RollbackEngine
 *
 * Handles rollback attempts for failed execution transactions.
 */
export class RollbackEngine {
  rollback(transaction: ExecutionTransaction): ExecutionTransaction {
    return {
      ...transaction,
      status: "RolledBack",
      completedAt: new Date().toISOString(),
    };
  }
}
