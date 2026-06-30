import type { RevenueLeakageFinding } from "./types";

/**
 * RevenueLeakageEngine
 *
 * Detects likely revenue leakage from operational evidence.
 *
 * This first version is intentionally simple.
 * Future versions will use Operational Evidence,
 * the Operational Knowledge Graph, Memory, and Cognition.
 */
export class RevenueLeakageEngine {
  detect(params: {
    title: string;
    summary: string;
    estimatedImpact: number;
    evidenceIds?: string[];
    graphNodeIds?: string[];
  }): RevenueLeakageFinding {
    return {
      id: crypto.randomUUID(),
      title: params.title,
      summary: params.summary,
      severity: this.inferSeverity(params.estimatedImpact),
      confidence: this.inferConfidence(params.evidenceIds?.length ?? 0),
      estimatedImpact: params.estimatedImpact,
      evidenceIds: params.evidenceIds ?? [],
      graphNodeIds: params.graphNodeIds ?? [],
      recommendation:
        "Review the leakage path and prioritize corrective action.",
      createdAt: new Date().toISOString(),
    };
  }

  private inferSeverity(
    estimatedImpact: number,
  ): RevenueLeakageFinding["severity"] {
    if (estimatedImpact >= 10000) return "Critical";
    if (estimatedImpact >= 5000) return "High";
    if (estimatedImpact >= 1000) return "Medium";

    return "Low";
  }

  private inferConfidence(
    evidenceCount: number,
  ): RevenueLeakageFinding["confidence"] {
    if (evidenceCount >= 5) return "High";
    if (evidenceCount >= 2) return "Medium";

    return "Low";
  }
}
