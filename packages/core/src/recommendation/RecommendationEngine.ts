import type {
  Intelligence,
  PriorityProfile,
  Recommendation,
} from "@ginzaaipro/domain";
import type { Engine } from "../shared/index.js";

export class RecommendationInput {
  readonly #intelligence: readonly Intelligence[];
  readonly #priorities: readonly PriorityProfile[];

  constructor(
    intelligence: readonly Intelligence[],
    priorities: readonly PriorityProfile[],
  ) {
    if (intelligence.length === 0) {
      throw new Error(
        "RecommendationInput requires at least one intelligence item.",
      );
    }
    if (priorities.length === 0) {
      throw new Error(
        "RecommendationInput requires at least one priority profile.",
      );
    }

    this.#intelligence = Object.freeze([...intelligence]);
    this.#priorities = Object.freeze([...priorities]);
    Object.freeze(this);
  }

  get intelligence(): readonly Intelligence[] { return this.#intelligence; }
  get priorities(): readonly PriorityProfile[] { return this.#priorities; }
}

export interface RecommendationEngine
  extends Engine<RecommendationInput, readonly Recommendation[]> {}
