import type { OperationalEvidence } from "@/operational-evidence/types";
import type { GraphNode } from "@/operational-knowledge-graph/types";
import type { OperationalResult } from "@/shared/intelligence/operational-result";

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
    memoryEntryIds?: string[];
  }): OperationalResult<RevenueLeakageFinding> {
    const evidenceIds = params.evidence?.map((record) => record.id) ?? [];
    const graphNodeIds = params.graphNodes?.map((node) => node.id) ?? [];
    const memoryEntryIds = params.memoryEntryIds ?? [];

    const finding: RevenueLeakageFinding = {
      id: crypto.randomUUID(),
      title: params.title,
      summary: params.summary,
      severity: this.inferSeverity(params.estimatedImpact),
      confidence: this.inferConfidence(evidenceIds.length, graphNodeIds.length),
      estimatedImpact: params.estimatedImpact,
      evidenceIds,
      graphNodeIds,
      recommendation:
        "Review the leakage path and prioritize corrective action.",
      createdAt: new Date().toISOString(),
    };

    return {
      id: crypto.randomUUID(),
      capability: "revenue-leakage",
      summary: finding.summary,
      confidence: this.confidenceToNumber(finding.confidence),
      evidenceIds,
      graphNodeIds,
      memoryEntryIds,
      createdAt: new Date().toISOString(),
      payload: finding,
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

  private confidenceToNumber(confidence: RevenueLeakageConfidence): number {
    if (confidence === "High") return 0.9;
    if (confidence === "Medium") return 0.6;

    return 0.3;
  }
}
