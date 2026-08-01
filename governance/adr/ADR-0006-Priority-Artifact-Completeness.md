# ADR-0006 — Priority Artifact Completeness

**Status:** Accepted

# Context

During implementation of `RecommendationRuleEngine`, category information
required for `categoryFilter` was supplied separately because
`OperationalLeakagePriority` does not currently retain the originating leakage
category.

This introduces an external dependency into deterministic engine evaluation.

HCES-0000 requires deterministic engines to operate on immutable input state
without hidden dependencies.

A decision is required regarding whether downstream engines may require
supplemental runtime information that is not contained within the input
artifact.

# Decision

Every downstream domain artifact shall contain all information required by
downstream deterministic engines.

`OperationalLeakagePriority` shall become a complete deterministic input
artifact.

The originating leakage category shall become part of the canonical
`OperationalLeakagePriority` domain contract.

Deterministic engines shall not depend on supplemental runtime fields that
originate outside the input artifact.

# Rationale

This preserves:

- deterministic replay;
- immutable state transitions;
- complete traceability;
- artifact self-sufficiency;
- simplified engine interfaces; and
- minimum runtime coupling.

A deterministic engine should be executable using only:

- released rules;
- immutable input artifacts; and
- explicit evaluation context.

No hidden side-channel information should be required.

# Consequences

Positive:

- deterministic replay becomes simpler;
- traceability improves;
- `RecommendationRuleEngine` input becomes self-contained;
- future engines inherit the same principle; and
- testing becomes easier.

Negative:

- `OperationalLeakagePriority` will require a future additive enhancement;
- downstream constructors and tests will require updates; and
- the existing engine implementation will later be simplified.

# Invariants

Every downstream artifact shall:

- preserve required upstream information;
- remain immutable;
- preserve provenance; and
- avoid hidden runtime dependencies.

Deterministic engines shall consume complete artifacts.

# Rejected Alternatives

## Pass category separately to every engine

Rejected because it weakens deterministic replay and introduces unnecessary
coupling.

## Lookup category during evaluation

Rejected because deterministic engines shall not perform repository or
infrastructure access.

## Duplicate lookup logic inside engines

Rejected because it violates HCES-0000's capability-neutral engine contract.

# HCES Alignment

Align with:

- `HCES-0000-Deterministic-Rule-Engine-Pattern.md`
- `HCES-0000A-Rule-Specification-Pattern.md`
- `HCES-0006A-Recommendation-Rule-Engine.md`

# Implementation Impact

No implementation changes are made by this ADR.

A future implementation task will:

- extend `OperationalLeakagePriority`;
- update related tests; and
- simplify `RecommendationRuleEngine` input.

This ADR records the architectural decision only.

# Validation

Confirm:

- formatting checks pass;
- no code modified;
- no contracts modified; and
- no commit created.
