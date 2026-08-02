# ADR-0011 — Immutable Observed Outcome Architecture

**Version:** 1.0.0
**Status:** Accepted
**Date:** 2026-07-28
**Decision Type:** Canonical Architecture
**Capability:** 009 — ObservedOutcome

# Decision Question

What canonical artifact shall record one bounded post-execution observation
without claiming causation, verified truth, or business success?

# Context

The canonical verified execution contracts separate:

```text
ExecutionPlan
    ↓
RuntimeAdmission
    ↓
ExecutionEvent
```

`ExecutionEvent` answers:

> What admitted execution occurred?

The next capability must record what was subsequently observed in relation to
that event while preserving the boundary between occurrence, observation,
evidence, and evaluation.

Existing repository types named `Outcome` and dashboard-local `Observation`
mix measurement, evidence, workflow, status, ownership, and interpretation.
They do not establish canonical authority for the bounded artifact defined
here and are not modified by this draft.

# Terminology Pressure Test

The name `ObservedOutcome` can overstate causality if “outcome” is read as
“result caused by the execution.” This ADR uses the name only in the narrower
sense of an observed post-execution state associated with an
`ExecutionEvent`.

The distinctions are:

- **Observation:** a recorded value at a stated time and provenance.
- **Outcome:** the bounded subject matter observed after execution, without a
  causal claim.
- **Causation:** a conclusion that execution produced the observation; outside
  this capability.
- **Evidence:** governed support that may corroborate, contradict, or qualify
  the observation; a future capability.
- **Evaluation:** a judgment about success, failure, quality, impact, or
  recommendation merit; outside this capability.

The canonical name remains suitable only while these boundaries are normative
and explicit.

An absent measurement creates no `ObservedOutcome`. An explicitly observed
absence may be represented by a governed categorical value, but never by JSON
`null`. An unchanged state, negative quantity, contradicted observation, or
indirect source remains representable without changing the non-causal
semantics.

# Decision

Introduce `ObservedOutcome` as the sole canonical, immutable,
infrastructure-independent record of one bounded observation associated with
exactly one `ExecutionEvent`.

`ObservedOutcome` shall:

- consume exactly one canonical `ExecutionEvent`;
- preserve execution, admission, plan, organization, work-package, trace, and
  provenance lineage derived from that event;
- identify exactly one observed subject by canonical subject type and
  `Identifier`;
- contain one observation code and one discriminated canonical value;
- record explicit observation time and provenance;
- possess deterministic, versioned SHA-256 identity;
- support canonical serialization and semantic equality;
- be deeply immutable; and
- make no causal or evidentiary claim.

`ObservedOutcome` shall not:

- modify or execute upstream artifacts;
- infer that execution caused the observation;
- verify truth or evidentiary sufficiency;
- classify success or failure;
- assess recommendation quality;
- calculate confidence;
- aggregate heterogeneous observations;
- invoke AI;
- access infrastructure; or
- implement `EvidenceRecord`.

In summary, `ObservedOutcome` records one immutable bounded observation only
and does not claim causation, verify truth, evaluate success or quality,
generate evidence, execute, schedule, assign, allocate, orchestrate, retry,
persist, publish externally, aggregate, invoke AI, mutate upstream artifacts,
or manage workflow or lifecycle state.

# Architectural Position

```text
ExecutionPlan
    ↓
RuntimeAdmission
    ↓
ExecutionEvent
    ↓
ObservedOutcome
    ↓
EvidenceRecord
```

`EvidenceRecord` is future context only and is not authorized by this draft.
Each layer transforms or records information once; downstream artifacts may
preserve lineage but may not repeat upstream responsibilities.

# Canonical Ownership

The domain package shall own the canonical `ObservedOutcome` contract.
Construction shall use the canonical `ExecutionEvent` rather than a loose
caller-supplied lineage projection.

Adapters may collect source-specific observations, but they must translate
them into the governed construction input before canonical construction.
Infrastructure shall not own or redefine the domain meaning.

# Value Doctrine

One `ObservedOutcome` identifies exactly one subject and contains exactly one
of:

- a finite canonical decimal value;
- a normalized categorical value;
- a boolean value; or
- bounded normalized text.

Arbitrary objects and executable values are prohibited. Quantitative values
require a canonical unit. Optional bounded measurement context may clarify
population, method, or conditions but may not contain unrestricted metadata.

# Time Doctrine

Observation and recording times are caller-supplied, explicit offset
date-times normalized to UTC. Silent current-clock use is prohibited.

An observation time before its referenced execution occurrence is invalid for
this post-execution artifact. This temporal rule establishes admissibility,
not causation. Equal or later observation time remains only an association.

# Provenance Doctrine

Provenance records source class, source identifier, collection method,
recording authority, and recording time. Provenance establishes traceability,
not truth. Recording time may not precede observation time.

# Identity and Serialization

Identity shall use the repository's governed deterministic SHA-256 pattern
with explicit versioning, canonical ordering, normalized values, and
unambiguous field framing. It shall include the canonical ExecutionEvent
identity once, the observed subject, observation semantics, observation time,
provenance, and applicable unit or measurement context. It shall not
redundantly hash copied upstream lineage already governed by the
ExecutionEvent identity.

Canonical serialization shall use an exact field order and discriminated
value representation. It shall be independent of locale, timezone, source
property insertion order, object identity, randomness, process state, and
hidden clocks.

# Architectural Principles

1. Observation follows execution occurrence but does not prove causation.
2. One artifact records one bounded observation.
3. Canonical lineage is preserved and never resupplied through side channels.
4. Identity and serialization are deterministic.
5. Immutability extends through nested value and provenance structures.
6. Evidence verification remains downstream.
7. Evaluation remains outside this capability.
8. Minimum complexity prohibits generalized observation frameworks.

# Alternatives Considered

## Embed outcome data in ExecutionEvent

Rejected because execution occurrence and observed real-world state are
different facts with different times and provenance.

## Use mutable execution-result objects

Rejected because mutable state weakens replayability, identity stability, and
auditability.

## Combine observation with evidence verification

Rejected because provenance is not proof and an observation may later be
supported, contradicted, or qualified.

## Permit arbitrary metadata maps

Rejected because unrestricted structures weaken canonical identity,
validation, interoperability, and deterministic serialization.

## Aggregate heterogeneous observations into one record

Rejected because it obscures atomic lineage and introduces premature
aggregation semantics.

## Treat every observation as proof of an outcome

Rejected because association and temporal order do not establish causation or
verified truth.

# Consequences

## Positive

- preserves the execution-to-observation boundary;
- produces deterministic, auditable observation records;
- supports later evidence construction without conflating responsibilities;
- retains immutable operational provenance; and
- avoids infrastructure and analytics coupling.

## Tradeoffs

- multiple observations require multiple artifacts;
- evidence and evaluation require separate future capabilities; and
- the name requires continued enforcement of its non-causal meaning.

# Compatibility

The architecture is additive and preserves the canonical verified execution
contracts.
It requires no modification to `ExecutionEvent`, `RuntimeAdmission`,
`ExecutionPlan`, their identity or serialization, or their public contracts.

Implementation and verification may consume the canonical verified
`ExecutionEvent` contract. Operational `ObservedOutcome` use requires
`ExecutionEvent`, `RuntimeAdmission`, and `ExecutionPlan` to cross all
applicable release, admissibility, and runtime-governance boundaries.

# Status and Authorization

This ADR is Accepted. Implementation remains authorized only by
GM-0009 and the accepted HCES-0009 scope. This decision does not authorize
`EvidenceRecord`, analytics, persistence, release, runtime deployment, or any
downstream capability. ADR, HCES, GM, VVR, tests, build, staging, merge, or
commit confer no release or runtime-deployment authority.
