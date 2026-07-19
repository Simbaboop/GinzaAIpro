import type { Evidence, Intelligence } from "@ginzaaipro/domain";
import type { Engine } from "../shared/index.js";

export interface IntelligenceEngine
  extends Engine<readonly Evidence[], readonly Intelligence[]> {}
