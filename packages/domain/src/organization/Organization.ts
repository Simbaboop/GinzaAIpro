import { AggregateRoot, Identifier } from "../common/index.js";

/**
 * The aggregate root and ownership boundary for organization-scoped concepts.
 */
export class Organization extends AggregateRoot {
  readonly #name: string;

  constructor(id: Identifier, name: string) {
    super(id);
    const normalizedName = name.trim();
    if (normalizedName.length === 0) {
      throw new Error("Organization name cannot be empty.");
    }

    this.#name = normalizedName;
    Object.freeze(this);
  }

  get name(): string {
    return this.#name;
  }
}
