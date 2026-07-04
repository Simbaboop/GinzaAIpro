/**
 * ConfidenceEngine
 *
 * Adjusts confidence based on repeated validated outcomes.
 */
export class ConfidenceEngine {
  calculate(params: {
    successfulOutcomes: number;
    failedOutcomes: number;
  }): number {
    const total = params.successfulOutcomes + params.failedOutcomes;

    if (total === 0) {
      return 0;
    }

    return params.successfulOutcomes / total;
  }
}
