import type { ExecutionRequest } from "./types";

/**
 * ExecutionTransaction
 *
 * Tracks execution transaction state.
 */
export interface ExecutionTransaction {
  id: string;

  request: ExecutionRequest;

  status: "Started" | "Committed" | "RolledBack" | "Compensated" | "Failed";

  createdAt: string;

  completedAt?: string;
}

/**
 * TransactionEngine
 *
 * Creates and updates execution transactions.
 */
export class TransactionEngine {
  start(request: ExecutionRequest): ExecutionTransaction {
    return {
      id: crypto.randomUUID(),
      request,
      status: "Started",
      createdAt: new Date().toISOString(),
    };
  }

  commit(transaction: ExecutionTransaction): ExecutionTransaction {
    return {
      ...transaction,
      status: "Committed",
      completedAt: new Date().toISOString(),
    };
  }

  fail(transaction: ExecutionTransaction): ExecutionTransaction {
    return {
      ...transaction,
      status: "Failed",
      completedAt: new Date().toISOString(),
    };
  }
}
