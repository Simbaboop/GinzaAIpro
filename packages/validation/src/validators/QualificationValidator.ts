import type { EngineContext } from "@ginzaaipro/core";
import type { BusinessSignal } from "@ginzaaipro/domain";
import { ValidationDiagnosticCodes } from "../diagnostics/index.js";
import {
  DiagnosticFactory,
  ExplanationFactory,
} from "../factories/index.js";
import { ValidationResult } from "../models/index.js";
import type { Validator } from "./Validator.js";

export class QualificationValidator implements Validator {
  readonly gate = "Qualification";
  readonly #diagnostics = new DiagnosticFactory();
  readonly #explanations = new ExplanationFactory();

  validate(
    signal: BusinessSignal,
    _context: EngineContext,
    prerequisiteResults: readonly ValidationResult[],
  ): ValidationResult {
    const prerequisitesPassed =
      prerequisiteResults.length === 5 &&
      prerequisiteResults.every((result) => result.passed);
    const valid =
      prerequisitesPassed && signal.validationStatus === "valid";

    if (!valid) {
      const code = ValidationDiagnosticCodes.QualificationFailed;
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
