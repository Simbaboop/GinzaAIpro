/**
 * An immutable percentage stored as integer basis points.
 * Valid values are 0 through 10,000 basis points (0% through 100%).
 */
export class Percentage {
  readonly #basisPoints: number;

  private constructor(basisPoints: number) {
    this.#basisPoints = basisPoints;
    Object.freeze(this);
  }

  static fromBasisPoints(basisPoints: number): Percentage {
    if (
      !Number.isInteger(basisPoints) ||
      basisPoints < 0 ||
      basisPoints > 10_000
    ) {
      throw new Error(
        "Percentage basis points must be an integer from 0 through 10,000.",
      );
    }

    return new Percentage(basisPoints);
  }

  get basisPoints(): number {
    return this.#basisPoints;
  }

  get value(): number {
    return this.#basisPoints / 100;
  }

  equals(other: Percentage): boolean {
    return this.#basisPoints === other.#basisPoints;
  }
}
