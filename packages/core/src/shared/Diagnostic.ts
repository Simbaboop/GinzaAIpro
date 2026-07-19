export type DiagnosticSeverity = "info" | "warning" | "error";

export class Diagnostic {
  readonly #severity: DiagnosticSeverity;
  readonly #code: string;
  readonly #message: string;
  readonly #recommendation: string | undefined;

  constructor(
    severity: DiagnosticSeverity,
    code: string,
    message: string,
    recommendation?: string,
  ) {
    const normalizedCode = code.trim();
    const normalizedMessage = message.trim();
    const normalizedRecommendation = recommendation?.trim();
    if (normalizedCode.length === 0) {
      throw new Error("Diagnostic code cannot be empty.");
    }
    if (normalizedMessage.length === 0) {
      throw new Error("Diagnostic message cannot be empty.");
    }
    if (
      recommendation !== undefined &&
      normalizedRecommendation?.length === 0
    ) {
      throw new Error(
        "Diagnostic recommendation cannot be empty when supplied.",
      );
    }

    this.#severity = severity;
    this.#code = normalizedCode;
    this.#message = normalizedMessage;
    this.#recommendation = normalizedRecommendation;
    Object.freeze(this);
  }

  get severity(): DiagnosticSeverity { return this.#severity; }
  get code(): string { return this.#code; }
  get message(): string { return this.#message; }
  get recommendation(): string | undefined { return this.#recommendation; }
}
