import { Card } from "@/shared/ui/Card";

import { CockpitMetric } from "./cockpit-metric";

export function ExecutiveCockpit() {
  return (
    <section className="space-y-6">
      <Card
        title="Executive Cockpit"
        description="Decision-oriented view of business health, leakage, recommendations, and operational activity."
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <CockpitMetric label="Business Health" value="92%" helper="Healthy" />

          <CockpitMetric
            label="Revenue Leakage"
            value="$18.4K"
            helper="Estimated opportunity"
          />

          <CockpitMetric label="Recommendations" value="7" helper="Open" />

          <CockpitMetric label="Journeys" value="3" helper="Active" />
        </div>
      </Card>

      <Card title="Priority Recommendations">
        <div className="space-y-3 text-sm text-slate-300">
          <p>Call back missed high-value leads within 15 minutes.</p>
          <p>Review open revenue leakage findings above $5,000.</p>
          <p>Route critical operational signals to governance review.</p>
        </div>
      </Card>

      <Card title="Operational Journey Status">
        <div className="grid gap-3 text-sm text-slate-300 md:grid-cols-2">
          <p>✓ Capture</p>
          <p>✓ Evidence</p>
          <p>✓ Knowledge Graph</p>
          <p>✓ Memory</p>
          <p>✓ Intelligence</p>
          <p>○ Governance</p>
          <p>○ Execution</p>
          <p>○ Learning</p>
        </div>
      </Card>
    </section>
  );
}
