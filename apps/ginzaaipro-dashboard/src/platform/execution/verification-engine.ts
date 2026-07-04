import type { ExecutionRequest } from "./types";

/**
 * ExecutionVerification
 *
 * Represents verification of execution completion.
 */
export interface ExecutionVerification {
  executionRequestId: string;

  executionSucceeded: boolean;

  outcomeVerified: boolean;

  notes?: string;

  verifiedAt: string;
}

/**
 * VerificationEngine
 *
 * Verifies execution completion separately
 * from business outcome.
 */
export class VerificationEngine {
  verify(params: {
    request: ExecutionRequest;
    executionSucceeded: boolean;
    outcomeVerified: boolean;
    notes?: string;
  }): ExecutionVerification {
    return {
      executionRequestId: params.request.id,
      executionSucceeded: params.executionSucceeded,
      outcomeVerified: params.outcomeVerified,
      notes: params.notes,
      verifiedAt: new Date().toISOString(),
    };
  }
}
