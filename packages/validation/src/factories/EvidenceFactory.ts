import type { EngineContext } from "@ginzaaipro/core";
import {
  Evidence,
  Percentage,
  type BusinessSignal,
  type EvidenceConstructionRuleReference,
} from "@ginzaaipro/domain";
import { EvidenceConstructionPolicy } from "../construction/EvidenceConstructionPolicy.js";
import {
  ValidationDiagnosticCodes,
  type ValidationDiagnosticCode,
} from "../diagnostics/index.js";
import { createEvidenceIdentifier } from "../identity/evidenceIdentity.js";

const fullMaterialQualification = Percentage.fromBasisPoints(10_000);

export type EvidenceFactoryResult =
  | Readonly<{
      success: true;
      evidence: Evidence;
      rule: EvidenceConstructionRuleReference;
    }>
  | Readonly<{
      success: false;
      code: ValidationDiagnosticCode;
    }>;

export class EvidenceFactory {
  readonly #policy: EvidenceConstructionPolicy;

  constructor(policy: EvidenceConstructionPolicy = new EvidenceConstructionPolicy()) {
    this.#policy = policy;
  }

  async create(
    signal: BusinessSignal,
    context: EngineContext,
    materializedStatement?: string,
  ): Promise<EvidenceFactoryResult> {
    if (!signal.organizationId.equals(context.organizationId)) {
      return Object.freeze({
        success: false,
        code: ValidationDiagnosticCodes.EvidenceOrganizationMismatch,
      });
    }

    const construction = await this.#policy.construct(signal);
    if (!construction.success) {
      return construction;
    }

    try {
      const evidenceId = await createEvidenceIdentifier({
        organizationId: signal.organizationId,
        signalIds: [signal.id],
        componentIds: [construction.component.id],
      });
      const evidence = new Evidence(
        evidenceId,
        signal.organizationId,
        [signal.id],
        signal.source,
        signal.validationStatus,
        "deterministic-five-gate-validation",
        fullMaterialQualification,
        [construction.component],
        signal.confidence,
        context.executionTime.toISOString(),
      );

      if (
        materializedStatement !== undefined &&
        materializedStatement !== evidence.statement
      ) {
        return Object.freeze({
          success: false,
          code:
            ValidationDiagnosticCodes.EvidenceStatementComponentMismatch,
        });
      }

      return Object.freeze({
        success: true,
        evidence,
        rule: construction.rule,
      });
    } catch (error) {
      const code =
        error instanceof Error &&
        error.message.includes("statement rendering failed")
          ? ValidationDiagnosticCodes.EvidenceStatementRenderFailed
          : ValidationDiagnosticCodes.EvidenceComponentUnsupported;
      return Object.freeze({ success: false, code });
    }
  }
}
