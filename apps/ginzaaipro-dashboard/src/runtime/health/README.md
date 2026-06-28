# Runtime Health

## Purpose

Runtime Health is the first vertical runtime capability in GinzaAIpro.

It answers:

"How healthy is the platform right now?"

Runtime Health monitors the operational condition of the Runtime, registered capabilities, and runtime event flow.

---

## Responsibilities

Runtime Health owns:

- runtime health status
- capability health aggregation
- degraded mode detection
- runtime incident signals
- platform health reporting

---

## Non-Responsibilities

Runtime Health does not own:

- business health
- customer health
- revenue leakage
- root cause analysis
- recovery execution
- governance approval
- user interface rendering

Those belong to Operational Intelligence, Business Health, Recovery, Governance, or Experience layers.

---

## Health Levels

Runtime Health may report:

- Healthy
- Degraded
- Unhealthy
- Critical

---

## Relationship to Runtime Events

Runtime Health consumes Runtime Events.

Runtime Events describe platform reality.

Runtime Health interprets platform condition.

---

## Relationship to Business Health

Runtime Health is not Business Health.

Runtime Health answers:

"Is GinzaAIpro operating correctly?"

Business Health answers:

"Is the customer's business operating well?"

Business Health may depend on Runtime Health as one input.

---

## Relationship to Diagnostics

Runtime Health detects platform condition.

Diagnostics explains causes.

---

## Relationship to Recovery

Runtime Health may indicate that recovery is needed.

Recovery decides what safe action may be proposed.

Governance approves material repair.

---

## Canonical Flow

Runtime Events
↓
Runtime Health
↓
Diagnostics
↓
Recovery Recommendation
↓
Governance
↓
Recovery Action
