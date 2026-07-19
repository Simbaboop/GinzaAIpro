import type { BusinessSignal } from "@ginzaaipro/domain";
import type { Engine } from "../shared/index.js";

export interface CaptureEngine
  extends Engine<BusinessSignal, BusinessSignal> {}
