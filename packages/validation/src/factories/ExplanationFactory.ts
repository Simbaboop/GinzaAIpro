import { Explanation } from "@ginzaaipro/core";
import {
  Percentage,
  type BusinessSignal,
  type Evidence,
} from "@ginzaaipro/domain";
import type { ValidationDiagnosticCode } from "../diagnostics/index.js";

export class ExplanationFactory {
  createGatePass(signal: BusinessSignal, gate: string): Explanation {
    return new Explanation(
      [],
      [],
      [],
      signal.confidence,
      `${gate} validation gate passed.`,
    );
  }

  createGateFailure(
    signal: BusinessSignal,
    code: ValidationDiagnosticCode,
  ): Explanation {
    return new Explanation(
      [],
      [],
      [],
      this.confidenceOf(signal),
      `Signal failed deterministic validation at ${code}.`,
    );
  }

  createSuccess(signal: BusinessSignal, evidence: Evidence): Explanation {
    return new Explanation(
      [evidence.id],
      [],
      [],
      signal.confidence,
      "Signal qualified after passing all deterministic validation gates.",
    );
  }

  private confidenceOf(signal: BusinessSignal): Percentage {
    return signal.confidence instanceof Percentage
      ? signal.confidence
      : Percentage.fromBasisPoints(0);
  }
}
