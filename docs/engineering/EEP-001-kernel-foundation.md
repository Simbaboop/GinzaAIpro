# EEP-001 — Kernel Foundation

## Objective

Implement the smallest complete GinzaAIpro reasoning loop:

`Event → Finding → Decision → Action → Evidence`

## Acceptance criteria

1. An unresolved estimate older than five days produces a finding.
2. The finding produces a high-priority follow-up decision.
3. A completed action can be recorded.
4. A subsequent booked job produces verified financial evidence.
5. Accepted or declined estimates produce no overdue finding.

## Next package

EEP-002 adds PostgreSQL persistence and migrations without changing the canonical contracts unless tests prove a correction is necessary.
