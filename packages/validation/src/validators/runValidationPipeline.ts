import type { EngineContext } from "@ginzaaipro/core";
import type { BusinessSignal } from "@ginzaaipro/domain";
import type { ValidationResult } from "../models/index.js";
import type { Validator } from "./Validator.js";

export function runValidationPipeline(
  validators: readonly Validator[],
  signal: BusinessSignal,
  context: EngineContext,
): readonly ValidationResult[] {
  const results: ValidationResult[] = [];

  for (const validator of validators) {
    const result = validator.validate(signal, context, results);
    results.push(result);
    if (!result.passed) {
      break;
    }
  }

  return Object.freeze(results);
}
