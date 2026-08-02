import { Percentage } from "@ginzaaipro/domain";

export const defaultCaptureConfidence = (): Percentage =>
  Percentage.fromBasisPoints(0);
