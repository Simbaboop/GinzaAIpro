import { EngineContext } from "@ginzaaipro/core";
import {
  Evidence,
  Identifier,
  Percentage,
  type BusinessSignal,
} from "@ginzaaipro/domain";

const fullMaterialQualification = Percentage.fromBasisPoints(10_000);

export class EvidenceFactory {
  create(signal: BusinessSignal, context: EngineContext): Evidence {
    const evidenceId = new Identifier(
      `evidence:${signal.id.value}:${context.correlationId.value}`,
    );

    return new Evidence(
      evidenceId,
      signal.organizationId,
      [signal.id],
      signal.source,
      signal.validationStatus,
      "deterministic-five-gate-validation",
      fullMaterialQualification,
      `Validated ${signal.category} signal from ${signal.source}.`,
      signal.confidence,
      context.executionTime.toISOString(),
    );
  }
}
