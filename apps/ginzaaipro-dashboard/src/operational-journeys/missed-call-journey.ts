import { OperationalJourneyEngine } from "./journey-engine";

/**
 * createMissedCallJourney
 *
 * Reference operational journey for a missed customer call.
 */
export function createMissedCallJourney() {
  const engine = new OperationalJourneyEngine();

  return engine.create({
    name: "Missed Customer Call",
    description:
      "Models how a missed customer call becomes evidence, leakage intelligence, recommendation, and learning.",
    steps: [
      {
        id: "capture-evidence",
        name: "Capture Evidence",
        description: "Record the missed customer call as operational evidence.",
        completed: false,
      },
      {
        id: "update-graph",
        name: "Update Knowledge Graph",
        description:
          "Connect the missed call to customer, lead, revenue, and outcome nodes.",
        completed: false,
      },
      {
        id: "detect-leakage",
        name: "Detect Revenue Leakage",
        description: "Identify likely revenue loss caused by the missed call.",
        completed: false,
      },
      {
        id: "create-recommendation",
        name: "Create Recommendation",
        description: "Generate a recommended follow-up action for review.",
        completed: false,
      },
      {
        id: "governance-review",
        name: "Governance Review",
        description:
          "Determine whether the recommended action should be approved.",
        completed: false,
      },
      {
        id: "execution",
        name: "Execution",
        description: "Carry out the approved follow-up action.",
        completed: false,
      },
      {
        id: "learning",
        name: "Learning",
        description: "Record outcome and update operational memory.",
        completed: false,
      },
    ],
  });
}
