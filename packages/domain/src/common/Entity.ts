import { Identifier } from "./Identifier.js";

export abstract class Entity {
  readonly #id: Identifier;

  protected constructor(id: Identifier) {
    this.#id = id;
  }

  get id(): Identifier {
    return this.#id;
  }

  equals(other: Entity): boolean {
    return this.constructor === other.constructor && this.#id.equals(other.#id);
  }
}
