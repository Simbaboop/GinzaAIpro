import type { BusinessCapability } from "./types";

/**
 * Capability
 *
 * Contract implemented by every business capability.
 *
 * Capabilities define WHAT the organization
 * can accomplish.
 *
 * The Execution Platform determines HOW.
 */
export interface Capability {
  readonly definition: BusinessCapability;

  execute(input: unknown): Promise<unknown>;
}
