import type { EngineContext } from "@ginzaaipro/core";
import {
  Identifier,
  type BusinessSignal,
  type BusinessSignalCategory,
} from "@ginzaaipro/domain";
import { ValidationDiagnosticCodes } from "../diagnostics/index.js";
import {
  DiagnosticFactory,
  ExplanationFactory,
} from "../factories/index.js";
import { ValidationResult } from "../models/index.js";
import type { Validator } from "./Validator.js";

const categories: readonly BusinessSignalCategory[] = [
  "operational",
  "financial",
  "human",
  "system",
  "external",
];

export class IdentityValidator implements Validator {
  readonly gate = "Identity";
  readonly #diagnostics = new DiagnosticFactory();
  readonly #explanations = new ExplanationFactory();

  validate(
    signal: BusinessSignal,
    _context: EngineContext,
    _prerequisiteResults: readonly ValidationResult[],
  ): ValidationResult {
    const valid =
      signal.id instanceof Identifier &&
      signal.organizationId instanceof Identifier &&
      (signal.subjectId === undefined ||
        signal.subjectId instanceof Identifier) &&
      categories.includes(signal.category) &&
      typeof signal.occurredAt === "string" &&
      typeof signal.capturedAt === "string";

    if (!valid) {
      const code = ValidationDiagnosticCodes.IdentityInvalid;
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
