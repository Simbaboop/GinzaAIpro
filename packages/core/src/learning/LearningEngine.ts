import type { LearningRecord, Outcome } from "@ginzaaipro/domain";
import type { Engine } from "../shared/index.js";

export interface LearningEngine
  extends Engine<readonly Outcome[], readonly LearningRecord[]> {}
