import type { EngineContext } from "./EngineContext.js";
import type { EngineResult } from "./EngineResult.js";

export interface Engine<TInput, TOutput> {
  execute(
    input: TInput,
    context: EngineContext,
  ): Promise<EngineResult<TOutput>>;
}
