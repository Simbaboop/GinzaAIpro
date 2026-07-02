/**
 * Capture Feature Types
 */

export type CaptureSource =
  | "Phone"
  | "Email"
  | "SMS"
  | "Website"
  | "Walk-In"
  | "Manual";

export interface CaptureRecord {
  id: string;

  title: string;

  description: string;

  source: CaptureSource;

  capturedAt: string;
}
