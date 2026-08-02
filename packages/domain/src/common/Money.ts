export class Money {
  readonly #minorUnits: bigint;
  readonly #currency: string;

  constructor(minorUnits: bigint, currency: string) {
    const normalizedCurrency = currency.trim().toUpperCase();
    if (!/^[A-Z]{3}$/.test(normalizedCurrency)) {
      throw new Error("Money currency must be a three-letter code.");
    }

    this.#minorUnits = minorUnits;
    this.#currency = normalizedCurrency;
    Object.freeze(this);
  }

  get minorUnits(): bigint {
    return this.#minorUnits;
  }

  get currency(): string {
    return this.#currency;
  }

  add(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.#minorUnits + other.#minorUnits, this.#currency);
  }

  subtract(other: Money): Money {
    this.assertSameCurrency(other);
    return new Money(this.#minorUnits - other.#minorUnits, this.#currency);
  }

  equals(other: Money): boolean {
    return (
      this.#minorUnits === other.#minorUnits &&
      this.#currency === other.#currency
    );
  }

  private assertSameCurrency(other: Money): void {
    if (this.#currency !== other.#currency) {
      throw new Error("Money arithmetic requires matching currencies.");
    }
  }
}
