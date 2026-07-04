import type { WorkerProfile } from "./types";

/**
 * DigitalWorker
 *
 * Represents a digital worker, AI worker,
 * automation, or software-based operational performer.
 */
export interface DigitalWorker extends WorkerProfile {
  provider?: string;

  model?: string;

  toolAccess?: string[];
}
