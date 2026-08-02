import type { BusinessSignal } from "@ginzaaipro/domain";
import type { Engine } from "../shared/index.js";
import type { CaptureInput } from "./CaptureInput.js";

export interface CaptureEngine
  extends Engine<CaptureInput, BusinessSignal> {}
