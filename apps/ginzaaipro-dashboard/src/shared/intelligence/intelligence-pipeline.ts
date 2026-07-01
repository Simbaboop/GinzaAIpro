import type { OperationalResult } from "./operational-result";

/**
 * IntelligencePipeline
 *
 * Defines a composable pipeline of intelligence results.
 */
export interface IntelligencePipeline<TInput, TPayload> {
  /**
   * Execute the intelligence pipeline.
   */
  execute(input: TInput): OperationalResult<TPayload>;
}
