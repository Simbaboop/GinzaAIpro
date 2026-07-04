import { ConnectorEngine } from "./connector-engine";
import { TransactionEngine } from "./transaction-engine";
import { VerificationEngine } from "./verification-engine";

import type { ExecutionRequest } from "./types";

/**
 * ExecutionOrchestrationResult
 *
 * Result of a coordinated execution attempt.
 */
export interface ExecutionOrchestrationResult {
  request: ExecutionRequest;

  executionSucceeded: boolean;

  outcomeVerified: boolean;

  message: string;
}

/**
 * OrchestrationEngine
 *
 * Coordinates execution transaction, connector execution,
 * and verification.
 */
export class OrchestrationEngine {
  private readonly connectorEngine = new ConnectorEngine();

  private readonly transactionEngine = new TransactionEngine();

  private readonly verificationEngine = new VerificationEngine();

  async run(params: {
    request: ExecutionRequest;
    connector: string;
    operation: string;
    payload: Record<string, unknown>;
  }): Promise<ExecutionOrchestrationResult> {
    const transaction = this.transactionEngine.start(params.request);

    const connectorResult = await this.connectorEngine.execute({
      connector: params.connector,
      operation: params.operation,
      payload: params.payload,
    });

    if (!connectorResult.success) {
      this.transactionEngine.fail(transaction);

      return {
        request: params.request,
        executionSucceeded: false,
        outcomeVerified: false,
        message: connectorResult.message,
      };
    }

    this.transactionEngine.commit(transaction);

    const verification = this.verificationEngine.verify({
      request: params.request,
      executionSucceeded: true,
      outcomeVerified: true,
      notes: "Execution completed and simulated outcome verified.",
    });

    return {
      request: params.request,
      executionSucceeded: verification.executionSucceeded,
      outcomeVerified: verification.outcomeVerified,
      message: connectorResult.message,
    };
  }
}
