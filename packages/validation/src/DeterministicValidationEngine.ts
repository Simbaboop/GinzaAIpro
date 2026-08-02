import {
  EngineResult,
  type EngineContext,
  type ValidationEngine,
} from "@ginzaaipro/core";
import type { BusinessSignal, Evidence } from "@ginzaaipro/domain";
import {
  DiagnosticFactory,
  EvidenceFactory,
  ExplanationFactory,
} from "./factories/index.js";
import {
  CompletenessValidator,
  ConsistencyValidator,
  IdentityValidator,
  IntegrityValidator,
  OrganizationValidator,
  QualificationValidator,
  runValidationPipeline,
  type Validator,
} from "./validators/index.js";

export class DeterministicValidationEngine implements ValidationEngine {
  readonly #validators: readonly Validator[];
  readonly #evidenceFactory: EvidenceFactory;
  readonly #diagnostics = new DiagnosticFactory();
  readonly #explanations = new ExplanationFactory();

  constructor(evidenceFactory: EvidenceFactory = new EvidenceFactory()) {
    this.#validators = Object.freeze([
      new IdentityValidator(),
      new OrganizationValidator(),
      new IntegrityValidator(),
      new CompletenessValidator(),
      new ConsistencyValidator(),
      new QualificationValidator(),
    ]);
    this.#evidenceFactory = evidenceFactory;
    Object.freeze(this);
  }

  async execute(
    signal: BusinessSignal,
    context: EngineContext,
  ): Promise<EngineResult<Evidence>> {
    const startedAt = Date.now();
    const results = runValidationPipeline(
      this.#validators,
      signal,
      context,
    );
    const finalResult = results.at(-1);
    if (finalResult === undefined) {
      throw new Error("Validation pipeline must contain at least one gate.");
    }

    const durationMs = Math.max(0, Date.now() - startedAt);
    if (!finalResult.passed) {
      return new EngineResult<Evidence>(
        false,
        undefined,
        finalResult.diagnostics,
        finalResult.explanation,
        durationMs,
      );
    }

    const construction = await this.#evidenceFactory.create(signal, context);
    if (!construction.success) {
      return new EngineResult<Evidence>(
        false,
        undefined,
        [this.#diagnostics.createFailure(construction.code)],
        this.#explanations.createConstructionFailure(
          signal,
          construction.code,
        ),
        durationMs,
      );
    }

    return new EngineResult(
      true,
      construction.evidence,
      [this.#diagnostics.createSuccess()],
      this.#explanations.createConstructionSuccess(
        signal,
        construction.evidence,
        construction.rule,
      ),
      durationMs,
    );
  }
}
