import type { OperationalEvidence } from "@/operational-evidence/types";

import type { CaptureRecord } from "./capture.types";

/**
 * CaptureService
 *
 * Converts user-facing capture records into
 * platform Operational Evidence.
 */
export class CaptureService {
  toEvidence(record: CaptureRecord): OperationalEvidence {
    return {
      id: record.id,
      type: "Observation",
      source: record.source,
      summary: `${record.title}: ${record.description}`,
      referenceId: record.id,
      capturedAt: record.capturedAt,
      metadata: {
        title: record.title,
        description: record.description,
      },
    };
  }
}
