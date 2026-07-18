export class Identifier {
  readonly #value: string;

  constructor(value: string) {
    const normalized = value.trim();
    if (normalized.length === 0) {
      throw new Error("Identifier cannot be empty.");
    }

    this.#value = normalized;
    Object.freeze(this);
  }

  get value(): string {
    return this.#value;
  }

  equals(other: Identifier): boolean {
    return this.#value === other.#value;
  }

  toString(): string {
    return this.#value;
  }
}
