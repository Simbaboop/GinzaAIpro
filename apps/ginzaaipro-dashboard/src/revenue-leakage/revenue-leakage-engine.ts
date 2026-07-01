import type { OperationalEvidence } from "@/operational-evidence/types";
import type { GraphNode } from "@/operational-knowledge-graph/types";

import type {
  RevenueLeakageFinding,
  RevenueLeakageSeverity,
  RevenueLeakageConfidence,
} from "./types";

/**
 * RevenueLeakageEngine
 *
 * Detects likely revenue leakage from operational evidence
 * and operational graph context.
 */
export class RevenueLeakageEngine {
  detect(params: {
    title: string;
    summary: string;
    estimatedImpact: number;
    evidence?: OperationalEvidence[];
    graphNodes?: GraphNode[];
  }): RevenueLeakageFinding {
    return {
      id: crypto.randomUUID(),
      title: params.title,
      summary: params.summary,
      severity: this.inferSeverity(params.estimatedImpact),
      confidence: this.inferConfidence(
        params.evidence?.length ?? 0,
        params.graphNodes?.length ?? 0,
      ),
      estimatedImpact: params.estimatedImpact,
      evidenceIds: params.evidence?.map((record) => record.id) ?? [],
      graphNodeIds: params.graphNodes?.map((node) => node.id) ?? [],
      recommendation:
        "Review the leakage path and prioritize corrective action.",
      createdAt: new Date().toISOString(),
    };
  }

  private inferSeverity(estimatedImpact: number): RevenueLeakageSeverity {
    if (estimatedImpact >= 10000) return "Critical";
    if (estimatedImpact >= 5000) return "High";
    if (estimatedImpact >= 1000) return "Medium";

    return "Low";
  }

  private inferConfidence(
    evidenceCount: number,
    graphNodeCount: number,
  ): RevenueLeakageConfidence {
    const signalStrength = evidenceCount + graphNodeCount;

    if (signalStrength >= 6) return "High";
    if (signalStrength >= 3) return "Medium";

    return "Low";
  }
}
