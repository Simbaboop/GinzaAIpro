import type { EngineContext } from "@ginzaaipro/core";
import {
  Money,
  Percentage,
  type BusinessSignal,
  type BusinessSignalValue,
} from "@ginzaaipro/domain";
import { ValidationDiagnosticCodes } from "../diagnostics/index.js";
import {
  DiagnosticFactory,
  ExplanationFactory,
} from "../factories/index.js";
import { ValidationResult } from "../models/index.js";
import type { Validator } from "./Validator.js";

export class IntegrityValidator implements Validator {
  readonly gate = "Integrity";
  readonly #diagnostics = new DiagnosticFactory();
  readonly #explanations = new ExplanationFactory();

  validate(
    signal: BusinessSignal,
    _context: EngineContext,
    _prerequisiteResults: readonly ValidationResult[],
  ): ValidationResult {
    const valid =
      Number.isFinite(Date.parse(signal.occurredAt)) &&
      Number.isFinite(Date.parse(signal.capturedAt)) &&
      this.isValidValue(signal.value);

    if (!valid) {
      const code = ValidationDiagnosticCodes.IntegrityFailed;
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

  private isValidValue(value: BusinessSignalValue): boolean {
    if (typeof value === "number") {
      return Number.isFinite(value);
    }
    return (
      typeof value === "string" ||
      typeof value === "bigint" ||
      typeof value === "boolean" ||
      value instanceof Money ||
      value instanceof Percentage
    );
  }
}
