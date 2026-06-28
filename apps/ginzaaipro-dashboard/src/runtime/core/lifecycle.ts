/**
 * RuntimeState
 *
 * Canonical lifecycle of the GinzaAIpro Runtime.
 */

export type RuntimeState =
  | "Created"
  | "Initializing"
  | "Running"
  | "Stopping"
  | "Stopped"
  | "Failed";
