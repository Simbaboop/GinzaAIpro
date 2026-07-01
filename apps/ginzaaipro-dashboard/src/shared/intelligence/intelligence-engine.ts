import type { OperationalResult } from "./operational-result";

/**
 * IntelligenceEngine
 *
 * Generic contract for intelligence engines.
 */
export interface IntelligenceEngine<TInput, TPayload> {
  /**
   * Run intelligence over structured input.
   */
  run(input: TInput): OperationalResult<TPayload>;
}
