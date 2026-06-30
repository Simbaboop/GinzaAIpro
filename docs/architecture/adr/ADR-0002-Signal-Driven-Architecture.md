# ADR-0002 — Signal-Driven Architecture

## Status

Accepted

---

## Context

Operational platforms generate large volumes of runtime events.

Not every event requires reasoning or intervention.

Treating every event equally increases coupling, noise, and unnecessary processing.

---

## Decision

GinzaAIpro adopts a Signal-Driven Architecture.

Runtime components emit events.

The Operational Nervous System evaluates those events and produces Operational Signals representing their operational significance.

Operational Health, Operational Cognition, Operational Memory, and future capabilities consume Operational Signals rather than raw runtime events whenever appropriate.

---

## Consequences

Positive:

- Reduces downstream noise.
- Separates facts from operational importance.
- Enables routing, prioritization, and future distributed processing.
- Simplifies higher-level reasoning.

Trade-offs:

- Introduces an additional architectural layer.
- Requires signal classification and routing policies.

---

## Architectural Principle

Events describe reality.

Signals communicate operational importance.

Operational intelligence reasons over signals rather than directly over runtime events whenever practical.
