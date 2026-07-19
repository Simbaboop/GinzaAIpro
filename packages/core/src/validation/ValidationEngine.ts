import type { BusinessSignal, Evidence } from "@ginzaaipro/domain";
import type { Engine } from "../shared/index.js";

export interface ValidationEngine
  extends Engine<BusinessSignal, Evidence> {}
