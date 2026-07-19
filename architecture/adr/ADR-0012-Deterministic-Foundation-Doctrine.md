# ADR-0012: Deterministic Foundation Doctrine

## Status

Accepted for Sprint 2.3.

## Decision

Canonical validation uses fixed, side-effect-free gates. Equivalent canonical input and immutable execution context must produce the same substantive output. Randomness, network state, filesystem state, live-clock decisions, and probabilistic qualification are excluded.

Runtime duration may vary but cannot influence validation decisions or evidence content.

## Consequence

Behavior remains repeatable, auditable, and suitable for later COSMOS comparison. Policy changes must be explicit code or contract changes.
