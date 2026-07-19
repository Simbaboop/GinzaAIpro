import {
  EngineResult,
  type CaptureEngine,
  type CaptureInput,
  type EngineContext,
} from "@ginzaaipro/core";
import { BusinessSignal } from "@ginzaaipro/domain";
import {
  DiagnosticFactory,
  ExplanationFactory,
} from "./factories/index.js";
import { createBusinessSignalIdentifier } from "./identity/createBusinessSignalIdentifier.js";
import { normalizeCaptureInput } from "./normalization/normalizeCaptureInput.js";

export class DeterministicCaptureEngine implements CaptureEngine {
  readonly #diagnostics = new DiagnosticFactory();
  readonly #explanations = new ExplanationFactory();

  async execute(
    input: CaptureInput,
    context: EngineContext,
  ): Promise<EngineResult<BusinessSignal>> {
    const executionTime = context.executionTime;
    const normalized = normalizeCaptureInput(
      input,
      context.organizationId,
      executionTime.getTime(),
    );

    if (!normalized.success) {
      return new EngineResult<BusinessSignal>(
        false,
        undefined,
        [this.#diagnostics.createFailure(normalized.code)],
        this.#explanations.createFailure(input, normalized.code),
        0,
      );
    }

    const canonical = normalized.value;
    const signalId = await createBusinessSignalIdentifier(canonical);
    const signal = new BusinessSignal(
      signalId,
      canonical.organizationId,
      canonical.category,
      canonical.source,
      canonical.occurredAt,
      executionTime.toISOString(),
      canonical.value,
      canonical.confidence,
      "unvalidated",
      canonical.subjectId,
      undefined,
    );
    const diagnostics = canonical.confidenceDefaulted
      ? [
          this.#diagnostics.createConfidenceDefaulted(),
          this.#diagnostics.createSuccess(),
        ]
      : [this.#diagnostics.createSuccess()];

    return new EngineResult(
      true,
      signal,
      diagnostics,
      this.#explanations.createSuccess(
        canonical.confidence,
        canonical.confidenceDefaulted,
      ),
      0,
    );
  }
}
