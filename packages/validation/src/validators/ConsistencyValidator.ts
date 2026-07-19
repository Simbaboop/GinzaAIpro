import type { EngineContext } from "@ginzaaipro/core";
import type { BusinessSignal } from "@ginzaaipro/domain";
import { ValidationDiagnosticCodes } from "../diagnostics/index.js";
import {
  DiagnosticFactory,
  ExplanationFactory,
} from "../factories/index.js";
import { ValidationResult } from "../models/index.js";
import type { Validator } from "./Validator.js";

export class ConsistencyValidator implements Validator {
  readonly gate = "Consistency";
  readonly #diagnostics = new DiagnosticFactory();
  readonly #explanations = new ExplanationFactory();

  validate(
    signal: BusinessSignal,
    _context: EngineContext,
    _prerequisiteResults: readonly ValidationResult[],
  ): ValidationResult {
    const valid =
      Date.parse(signal.capturedAt) >= Date.parse(signal.occurredAt);

    if (!valid) {
      const code = ValidationDiagnosticCodes.ConsistencyFailed;
      return new ValidationResult(
        false,
        [this.#diagnostics.createFailure(code)],
        this.#explanations.createGateFailure(signal, code),
      );
    }

    return new ValidationResult(
      true,
      [],
      this.#explanations.createGatePass(signal, this.gate),
    );
  }
}
