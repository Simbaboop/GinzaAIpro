import type { ExecutionPlan } from "@ginzaaipro/domain";
import type { Engine } from "../shared/index.js";

export interface ExecutionEngine
  extends Engine<ExecutionPlan, ExecutionPlan> {}
