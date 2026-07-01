/**
 * Operational Journey Types
 */

export type JourneyStatus =
  | "Not Started"
  | "In Progress"
  | "Completed"
  | "Failed";

export interface JourneyStep {
  id: string;
  name: string;
  description: string;
  completed: boolean;
}

export interface OperationalJourney {
  id: string;
  name: string;
  description: string;
  status: JourneyStatus;
  steps: JourneyStep[];
  createdAt: string;
  completedAt?: string;
}
