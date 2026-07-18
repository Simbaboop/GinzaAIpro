import { Entity } from "./Entity.js";

/**
 * Marks an entity as the consistency and ownership boundary for an aggregate.
 */
export abstract class AggregateRoot extends Entity {}
