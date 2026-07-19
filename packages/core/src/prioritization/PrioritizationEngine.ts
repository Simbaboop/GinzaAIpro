import type { Intelligence, PriorityProfile } from "@ginzaaipro/domain";
import type { Engine } from "../shared/index.js";

export interface PrioritizationEngine
  extends Engine<readonly Intelligence[], readonly PriorityProfile[]> {}
