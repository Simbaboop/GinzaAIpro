import { Explanation } from "@ginzaaipro/core";
import {
  Percentage,
  type BusinessSignal,
  type Evidence,
  type EvidenceConstructionRuleReference,
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

  createConstructionSuccess(
    signal: BusinessSignal,
    evidence: Evidence,
    rule: EvidenceConstructionRuleReference,
  ): Explanation {
    const componentIds = evidence.components
      .map(({ id }) => id.value)
      .join(", ");
    const signalIds = evidence.signalIds
      .map(({ value }) => value)
      .join(", ");
    return new Explanation(
      [evidence.id],
      [],
      [],
      signal.confidence,
      `Signal qualified under VALIDATION_EVIDENCE_CONSTRUCTION@1.0.0 using ${rule.id}@${rule.version}; Evidence ${evidence.id.value} contains canonical components [${componentIds}] with signal provenance [${signalIds}]. Its statement was derived from canonically ordered component data. No semantic extraction, semantic confidence, diagnosis, priority, or action was introduced.`,
    );
  }

  createConstructionFailure(
    signal: BusinessSignal,
    code: ValidationDiagnosticCode,
  ): Explanation {
    return new Explanation(
      [],
      [],
      [],
      this.confidenceOf(signal),
      `Evidence construction failed at ${code}; no Evidence was created.`,
    );
  }

  private confidenceOf(signal: BusinessSignal): Percentage {
    return signal.confidence instanceof Percentage
      ? signal.confidence
      : Percentage.fromBasisPoints(0);
  }
}
