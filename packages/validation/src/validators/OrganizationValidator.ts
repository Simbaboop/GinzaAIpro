import type { EngineContext } from "@ginzaaipro/core";
import { Identifier, type BusinessSignal } from "@ginzaaipro/domain";
import { ValidationDiagnosticCodes } from "../diagnostics/index.js";
import {
  DiagnosticFactory,
  ExplanationFactory,
} from "../factories/index.js";
import { ValidationResult } from "../models/index.js";
import type { Validator } from "./Validator.js";

export class OrganizationValidator implements Validator {
  readonly gate = "Organization";
  readonly #diagnostics = new DiagnosticFactory();
  readonly #explanations = new ExplanationFactory();

  validate(
    signal: BusinessSignal,
    context: EngineContext,
    prerequisiteResults: readonly ValidationResult[],
  ): ValidationResult {
    const prerequisitesPassed =
      prerequisiteResults.length === 1 &&
      prerequisiteResults.every((result) => result.passed);
    const valid =
      prerequisitesPassed &&
      signal.organizationId instanceof Identifier &&
      context.organizationId instanceof Identifier &&
      signal.organizationId.equals(context.organizationId);

    if (!valid) {
      const code = ValidationDiagnosticCodes.EvidenceOrganizationMismatch;
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
