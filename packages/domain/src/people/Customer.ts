import { Entity, Identifier } from "../common/index.js";

export class Customer extends Entity {
  readonly #organizationId: Identifier;
  readonly #name: string;
  readonly #email: string | undefined;

  constructor(
    id: Identifier,
    organizationId: Identifier,
    name: string,
    email?: string,
  ) {
    super(id);
    const normalizedName = name.trim();
    if (normalizedName.length === 0) {
      throw new Error("Customer name cannot be empty.");
    }

    this.#organizationId = organizationId;
    this.#name = normalizedName;
    this.#email = email?.trim() || undefined;
    Object.freeze(this);
  }

  get organizationId(): Identifier {
    return this.#organizationId;
  }

  get name(): string {
    return this.#name;
  }

  get email(): string | undefined {
    return this.#email;
  }
}
