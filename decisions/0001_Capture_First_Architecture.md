# ADR-0001: Capture-First Architecture

## Status

Accepted

## Date

2026-06-09

## Decision

GinzaAIpro will be built using a Capture-first architecture.

Capture must exist before Observability, Intelligence, Governance, Execution, and Extensions.

## Rationale

AI cannot govern what it cannot understand.

AI cannot understand what is not captured.

Therefore, all intelligence and automation must begin with structured operational capture.

## Consequences

- The first build priority is structured diagnostic intake.
- Dashboards come after captured events exist.
- Automation is deferred until governance exists.
- Extensions cannot execute independently.
- Operational visibility becomes the foundation of the product.

## Related Files

- SAOP.md
- ROADMAP.md
- architecture/01_Capture_and_Observability.md
