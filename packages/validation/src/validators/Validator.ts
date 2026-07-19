import type { EngineContext } from "@ginzaaipro/core";
import type { BusinessSignal } from "@ginzaaipro/domain";
import type { ValidationResult } from "../models/index.js";

export interface Validator {
  readonly gate: string;

  validate(
    signal: BusinessSignal,
    context: EngineContext,
    prerequisiteResults: readonly ValidationResult[],
  ): ValidationResult;
}
