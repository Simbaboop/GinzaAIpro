import type { Diagnostic, Explanation } from "@ginzaaipro/core";

export class ValidationResult {
  readonly #passed: boolean;
  readonly #diagnostics: readonly Diagnostic[];
  readonly #explanation: Explanation;

  constructor(
    passed: boolean,
    diagnostics: readonly Diagnostic[],
    explanation: Explanation,
  ) {
    this.#passed = passed;
    this.#diagnostics = Object.freeze([...diagnostics]);
    this.#explanation = explanation;
    Object.freeze(this);
  }

  get passed(): boolean { return this.#passed; }
  get diagnostics(): readonly Diagnostic[] { return this.#diagnostics; }
  get explanation(): Explanation { return this.#explanation; }
}
