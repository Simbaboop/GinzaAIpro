import type { OperationalJourney } from "./journey";

type CreateOperationalJourneyInput = Omit<
  OperationalJourney,
  "id" | "status" | "createdAt"
> & {
  status?: OperationalJourney["status"];
};

/**
 * OperationalJourneyEngine
 *
 * Creates operational journeys while assigning
 * system-owned lifecycle metadata.
 */
export class OperationalJourneyEngine {
  create(input: CreateOperationalJourneyInput): OperationalJourney {
    return {
      ...input,
      id: crypto.randomUUID(),
      status: input.status ?? ("Pending" as OperationalJourney["status"]),
      createdAt: new Date().toISOString(),
    };
  }
}
