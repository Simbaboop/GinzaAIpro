import { OrchestrationEngine } from "./orchestration-engine";

import type { ExecutionRequest } from "./types";

/**
 * ExecutionEngine
 *
 * Primary entry point into the Execution Platform.
 */
export class ExecutionEngine {
  private readonly orchestrationEngine = new OrchestrationEngine();

  async execute(params: {
    request: ExecutionRequest;
    connector: string;
    operation: string;
    payload: Record<string, unknown>;
  }) {
    return this.orchestrationEngine.run(params);
  }
}
