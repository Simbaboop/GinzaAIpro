# ADR-0004: Legacy PriorityProfile Compatibility

**Status:** Accepted

This decision records why Capability 005 introduces
`OperationalLeakagePriority` instead of replacing the existing
`PriorityProfile` contract.

# Context

A released `PriorityProfile` domain contract already exists.

It is referenced by multiple engines and tests.

Capability 005 defines a different canonical transition:

```text
OperationalLeakage → OperationalLeakagePriority
```

Replacing the released contract would change existing consumers while
conflating its earlier intelligence-oriented responsibility with the distinct
Capability 005 transition.

# Decision

Introduce `OperationalLeakagePriority` as a new canonical contract.

Do not modify the released `PriorityProfile`.

Migration requires its own ADR.

# Consequences

Positive

- preserves backward compatibility;
- preserves released APIs; and
- preserves deterministic evolution.

Negative

- temporary duplicate concepts; and
- future migration required.

# Alternatives

Replace `PriorityProfile` immediately.

Rejected because it would introduce breaking changes.

# Future Work

Review legacy `PriorityProfile` after M2.

Determine whether to:

- migrate;
- adapt;
- deprecate; or
- retain.
