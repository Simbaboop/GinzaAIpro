import type { Diagnostic } from "./Diagnostic.js";
import type { Explanation } from "./Explanation.js";

export class EngineResult<TOutput> {
  readonly #success: boolean;
  readonly #value: TOutput | undefined;
  readonly #diagnostics: readonly Diagnostic[];
  readonly #explanation: Explanation;
  readonly #durationMs: number;

  constructor(
    success: boolean,
    value: TOutput | undefined,
    diagnostics: readonly Diagnostic[],
    explanation: Explanation,
    durationMs: number,
  ) {
    if (!Number.isFinite(durationMs) || durationMs < 0) {
      throw new Error(
        "EngineResult duration must be finite and non-negative.",
      );
    }
    if (success && value === undefined) {
      throw new Error("A successful EngineResult requires a value.");
    }
    if (!success && value !== undefined) {
      throw new Error("A failed EngineResult cannot contain a value.");
    }
    if (
      !success &&
      !diagnostics.some((diagnostic) => diagnostic.severity === "error")
    ) {
      throw new Error(
        "A failed EngineResult requires at least one error diagnostic.",
      );
    }

    this.#success = success;
    this.#value = value;
    this.#diagnostics = Object.freeze([...diagnostics]);
    this.#explanation = explanation;
    this.#durationMs = durationMs;
    Object.freeze(this);
  }

  get success(): boolean { return this.#success; }
  get value(): TOutput | undefined { return this.#value; }
  get diagnostics(): readonly Diagnostic[] { return this.#diagnostics; }
  get explanation(): Explanation { return this.#explanation; }
  get durationMs(): number { return this.#durationMs; }
}
