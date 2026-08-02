import { Entity, Identifier } from "../common/index.js";

export class Employee extends Entity {
  readonly #organizationId: Identifier;
  readonly #name: string;

  constructor(id: Identifier, organizationId: Identifier, name: string) {
    super(id);
    const normalizedName = name.trim();
    if (normalizedName.length === 0) {
      throw new Error("Employee name cannot be empty.");
    }

    this.#organizationId = organizationId;
    this.#name = normalizedName;
    Object.freeze(this);
  }

  get organizationId(): Identifier {
    return this.#organizationId;
  }

  get name(): string {
    return this.#name;
  }
}
