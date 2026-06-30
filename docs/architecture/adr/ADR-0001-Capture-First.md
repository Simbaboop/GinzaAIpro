# ADR-0001 — Capture First

## Status

Accepted

---

## Context

Operational intelligence depends on evidence.

Without reliable capture, higher-order reasoning becomes speculation.

All downstream capabilities—including Operational Health, Operational Cognition, Revenue Leakage, Business Health, and Governance—depend upon trustworthy observations.

---

## Decision

Capture is the first architectural responsibility of GinzaAIpro.

Operational information should be captured before it is interpreted.

Capture precedes:

- Events
- Signals
- Assessments
- Recommendations
- Execution

---

## Consequences

Positive:

- Every assessment is evidence-backed.
- Decisions become auditable.
- Operational Memory contains trustworthy history.
- AI reasoning remains explainable.

Trade-offs:

- Additional storage requirements.
- Increased emphasis on observability.
- More disciplined ingestion pipelines.

---

## Architectural Principle

Capture precedes intelligence.

Reality must be observed before it can be understood.
