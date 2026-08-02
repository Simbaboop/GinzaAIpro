import type { RuntimeExecutionPlan } from "@ginzaaipro/domain";
import type { Engine } from "../shared/index.js";

export interface ExecutionEngine
  extends Engine<RuntimeExecutionPlan, RuntimeExecutionPlan> {}
