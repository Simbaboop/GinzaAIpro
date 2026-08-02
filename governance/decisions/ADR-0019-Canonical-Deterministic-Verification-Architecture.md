# ADR-0019 — Canonical Deterministic Verification Architecture

**Version:** 1.0.0
**Status:** Accepted
**Date:** 2026-07-29
**Decision Type:** Canonical Architecture
**Capability:** 010 — Deterministic Verification
**Discovery:** DISC-0009 — Canonical Verification Boundary and Legacy Reconciliation
**Upstream Capability:** 009 — ObservedOutcome

# Decision Question

What canonical artifact shall determine whether one immutable
`ObservedOutcome` is confirmed, refuted, or remains inconclusive when evaluated
against canonical Evidence, without absorbing outcome measurement, causality,
or organizational learning?

# Context

The canonical verified execution and observation chain is:

    ExecutionPlan
        ↓
    RuntimeAdmission
        ↓
    ExecutionEvent
        ↓
    ObservedOutcome

`ExecutionEvent` answers:

> What admitted execution occurred?

`ObservedOutcome` answers:

> What bounded state or value was observed after that execution?

Neither artifact determines whether the observation is supported by sufficient
Evidence.

Canonical Evidence already exists through Capability 001, and deterministic
Evidence Semantics exists through Capability 002.

The missing capability is therefore not another `EvidenceRecord`.

The missing capability is an immutable, deterministic Verification judgment
that evaluates one `ObservedOutcome` using one or more canonical Evidence
records.

# Terminology Decision

Verification processing state and Verification judgment are distinct.

Processing states such as pending, needs review, completed, or failed to
process belong to workflow or orchestration.

The canonical evidentiary judgment SHALL use exactly one of:

- `confirmed`;
- `refuted`;
- `inconclusive`.

`Unverified`, `Verified`, `Needs Review`, `Failed Verification`, and boolean
values are not canonical Verification judgments.

# Decision

Introduce a canonical immutable domain artifact:

`Verification`

A canonical `Verification` SHALL:

- belong to exactly one Organization;
- reference exactly one `ObservedOutcome`;
- reference one or more canonical Evidence records;
- identify the governed verification method;
- contain exactly one canonical Verification judgment;
- record an explicit verification time;
- identify the verifier when applicable;
- preserve known limitations;
- permit bounded explanatory notes;
- expose a schema version;
- have deterministic identity;
- have deterministic canonical serialization;
- support semantic equality;
- be deeply immutable.

A canonical `Verification` SHALL NOT:

- recreate or replace canonical Evidence;
- mutate the evaluated `ObservedOutcome`;
- infer missing Evidence references;
- infer Organization identity;
- treat execution completion as proof;
- claim causality;
- calculate baseline, actual value, delta, or business impact;
- generate learning or recommendations;
- create wall-clock time internally.
# Architectural Position

The governed execution-to-learning sequence is:

    ExecutionPlan
        ↓
    RuntimeAdmission
        ↓
    ExecutionEvent
        ↓
    ObservedOutcome
        ↓
    Verification
        ↓
    Outcome Evaluation
        ↓
    Learning

The responsibility boundaries are:

| Artifact | Governing question |
|---|---|
| `ExecutionPlan` | What governed work is intended? |
| `RuntimeAdmission` | Was that plan admitted to runtime execution? |
| `ExecutionEvent` | What admitted execution occurred? |
| `ObservedOutcome` | What bounded post-execution state was observed? |
| `Verification` | Does canonical Evidence confirm, refute, or fail to resolve that observation? |
| Outcome Evaluation | Did the measured business condition improve, deteriorate, or remain unchanged? |
| Learning | What reusable organizational knowledge follows? |

Each artifact owns one responsibility.

Downstream artifacts may preserve upstream identity and lineage but may not
repeat or absorb upstream authority.

# Canonical Subject

Capability 010 SHALL verify exactly one `ObservedOutcome`.

The initial canonical subject type is fixed as:

    observed_outcome

The legacy subject alternatives:

- `action`;
- `execution_plan`;
- `outcome`;

are not part of the Capability 010 canonical public contract.

Future verification of other subject types requires separate governance.

Capability 010 SHALL NOT introduce an open-ended subject discriminator or a
general-purpose claims framework.

# Canonical Evidence Relationship

Verification SHALL consume explicit canonical Evidence identities.

Every referenced Evidence record must:

- resolve to canonical Evidence;
- belong to the same Organization as the `ObservedOutcome`;
- be unique within the Verification;
- remain present in deterministic serialization;
- remain present in lineage and diagnostics.

Verification does not own:

- Evidence construction;
- Evidence components;
- Evidence provenance construction;
- Evidence Semantics;
- source validation;
- Evidence persistence;
- credibility scoring.

Silent Evidence omission and inferred Evidence references are prohibited.

The exact validation procedure remains specification work for HCES-0010.

# Canonical Ownership

The canonical `Verification` domain artifact belongs to the shared Domain
layer.

Its intended canonical package ownership is:

    packages/domain/src/verification/

The canonical Verification engine contract belongs to shared Core:

    packages/core/src/verification/

This ownership establishes that Verification is:

- not Operational Cognition;
- not dashboard state;
- not Workforce ownership;
- not Operational Learning;
- not canonical Evidence;
- not an execution connector responsibility.

No new top-level platform subsystem is authorized.

The existing Core verification namespace may be retained and modernized.

This ADR does not authorize moving, replacing, or changing package files.
# Identity and Serialization

Verification SHALL use deterministic, versioned identity and canonical
serialization.

Identity generation SHALL NOT depend on:

- random UUID generation;
- object insertion order;
- locale;
- platform-specific formatting;
- implicit wall-clock time;
- persistence identifiers created after construction;
- mutable external state.

The identity must preserve, at minimum:

- schema version;
- Organization identity;
- `ObservedOutcome` identity;
- canonical Evidence identities;
- verification method identity;
- canonical judgment;
- explicit verification time;
- verifier identity when present;
- limitations required to distinguish the judgment.

HCES-0010 SHALL define:

- exact identity material;
- field ordering;
- Evidence identity ordering;
- normalization rules;
- omission rules;
- canonical serialization grammar;
- digest algorithm;
- fixed identity vectors.

The accepted deterministic baseline is versioned SHA-256 unless HCES-0010
provides an explicitly justified compatible alternative.

# Time Doctrine

Verification time is explicit domain input.

The canonical artifact and its constructor SHALL NOT call:

- `new Date()`;
- `Date.now()`;
- infrastructure clocks;
- random time generation.

The supplied verification time must be valid and normalized deterministically.

Verification time records when the judgment was completed.

It does not establish:

- when Evidence was created;
- when the observed condition occurred;
- when execution occurred;
- when business impact became measurable.

Those times remain owned by their respective artifacts.

# Confidence and Calibration Doctrine

Verification is a significant conclusion and must expose its basis and known
limitations.

A numerical confidence value may be retained only when its calibration status
is explicit.

The architecture SHALL distinguish:

- `uncalibrated`;
- `calibrated`.

A Verification marked `calibrated` must reference an authorized calibration
record or equivalent governed calibration authority.

Without such authority:

- confidence must be labeled `uncalibrated`;
- it must not be described as statistically calibrated;
- it must not imply validated predictive accuracy;
- its basis must remain traceable.

HCES-0010 SHALL determine the minimum representation required for:

- confidence value, when present;
- calibration status;
- confidence basis;
- calibration record identity, when required.

Capability 010 does not create or authorize a calibration system.

# Organization and Tenant Boundary

A Verification, its `ObservedOutcome`, and every referenced Evidence record
must belong to the same Organization.

Cross-Organization Verification is prohibited.

Organization identity must be explicit and preserved in:

- construction;
- validation;
- deterministic identity;
- canonical serialization;
- semantic equality;
- lineage;
- diagnostics.

No repository lookup, external mapping, tenant inference, or caller convention
may repair missing Organization identity after construction.

Tenant enforcement outside the domain remains an application and
infrastructure responsibility, but it must preserve the canonical Organization
boundary established here.

# Separation from Outcome Evaluation

Verification determines evidentiary support for an observation.

Outcome Evaluation determines business change.

Outcome Evaluation may calculate:

- metric;
- baseline;
- actual value;
- delta;
- unit;
- measurement period;
- business impact;
- outcome confidence.

Verification SHALL NOT calculate those values.

The broad statement that Verification measures success is clarified:

- Verification determines whether the observed proposition is evidentially
  supported;
- Outcome Evaluation determines whether the business condition improved;
- Learning determines what reusable knowledge follows.

# Separation from Causality

A confirmed Verification does not establish that execution caused the
`ObservedOutcome`.

It establishes only that identified Evidence supports the observed proposition
under the stated method and limitations.

The following inference is prohibited:

    Execution occurred
        +
    ObservedOutcome confirmed
        =
    Execution caused the result

Causal attribution requires separate future governance.
# Architectural Principles

## Evidence Before Judgment

A canonical Verification judgment SHALL NOT exist without explicit canonical
Evidence.

A completion claim, status flag, caller-provided boolean, or unverified
observation is not a substitute for Evidence.

## Observation Before Verification

Verification evaluates an existing immutable `ObservedOutcome`.

Verification does not create, alter, complete, or repair that observation.

## Judgment Separate from Processing State

The evidentiary judgment and the workflow state of verification processing are
different concepts.

Workflow state may report that verification is pending, requires review, was
completed, or failed to process.

Only the canonical Verification artifact records whether the observation is:

- `confirmed`;
- `refuted`;
- `inconclusive`.

## Immutability

A completed Verification is an immutable historical judgment.

It SHALL NOT be edited in place.

A later evaluation, new Evidence, corrected method, or changed limitation
requires a new Verification with its own deterministic identity and preserved
lineage.

## Determinism

Equivalent normalized inputs must produce equivalent:

- identity material;
- canonical serialization;
- semantic equality;
- validation result.

## Minimum Complexity

Capability 010 is a bounded Verification artifact.

It is not:

- a general claims framework;
- a causal inference engine;
- a business scoring framework;
- an Evidence replacement;
- an Outcome replacement;
- an Operational Learning engine;
- a workflow system;
- a new platform subsystem.

## Infrastructure Independence

The canonical domain artifact SHALL contain no:

- database access;
- repository access;
- network calls;
- framework dependencies;
- UI state;
- transport behavior;
- AI-provider behavior;
- implicit clock behavior.

# Compatibility and Legacy Disposition

## Shared legacy Verification

The existing file:

    packages/domain/src/intelligence/Verification.ts

is classified as a modernization source, not the final Capability 010
contract.

Compatible concepts to preserve include:

- Organization identity;
- subject identity;
- verification method;
- Evidence identities;
- result;
- verifier identity;
- verification time;
- confidence;
- notes;
- limitations;
- immutability.

Incomplete or incompatible concepts include:

- the open legacy subject types `action`, `execution_plan`, and `outcome`;
- ownership under the `intelligence` namespace;
- absence of `ObservedOutcome` as the fixed canonical subject;
- absence of deterministic identity;
- absence of canonical serialization;
- absence of schema version;
- absence of explicit calibration status;
- absence of Capability 010 validation and failure taxonomy.

This ADR does not authorize moving, replacing, or editing the legacy file.

## Shared VerificationInput

The existing request-before-result separation in:

    packages/core/src/verification/VerificationEngine.ts

is retained in principle.

A future modernized input must:

- identify exactly one canonical `ObservedOutcome`;
- identify one or more canonical Evidence records;
- preserve explicit Organization identity;
- preserve the verification method;
- preserve verifier identity when applicable;
- provide explicit domain time where required;
- satisfy the deterministic and calibration boundaries of this ADR.

This ADR does not authorize changing that contract.

## Dashboard VerificationEngine

The dashboard-local Verification engine is non-canonical.

Its current behavior cannot establish canonical Verification because it:

- accepts no canonical Evidence identities;
- accepts caller-provided success booleans;
- creates wall-clock time internally;
- automatically verifies a simulated outcome;
- lacks deterministic identity;
- lacks canonical serialization;
- lacks limitations and calibration status;
- conflates execution completion with outcome verification.

It may later become a compatibility adapter.

It SHALL NOT remain an independent source of canonical Verification truth.

## Embedded Observation Verification Status

The dashboard Observation `verificationStatus` field is a legacy embedded
projection covered by the existing execution-separation doctrine.

It may remain temporarily for compatibility.

It must eventually be derived from separately identified canonical
Verification records and must not be independently treated as the source of
verification truth.

## Embedded Execution Verification Status

The dashboard Execution `verificationStatus` field is a transitional workflow
or presentation projection.

It may summarize canonical Verification only when the underlying judgment
remains traceable and visible.

It must not independently create or alter canonical Verification truth.

## Workforce Verification

Workforce verification may record:

- assignment review;
- reviewer identity;
- work acceptance;
- workforce-specific notes.

It does not replace evidence-backed canonical Verification of an
`ObservedOutcome`.

## Outcome Contracts

Existing Outcome contracts remain downstream of Verification.

They are not absorbed, renamed, or replaced by Capability 010.

Their future modernization must preserve the distinction between:

- evidentiary confirmation of an observation; and
- measurement of business change.

# Compatibility Rule

During migration, legacy statuses and booleans may be retained only as derived
or transitional representations.

They must not:

- override a canonical Verification judgment;
- conceal whether the result was confirmed, refuted, or inconclusive;
- bypass canonical Evidence;
- bypass Organization validation;
- claim calibration without calibration authority;
- convert processing success into evidentiary confirmation.
# Alternatives Considered

## Create EvidenceRecord after ObservedOutcome

Rejected.

Canonical Evidence already exists. A second evidence artifact would duplicate
Capability 001 ownership and create conflicting factual authority.

## Add Verification Fields to ObservedOutcome

Rejected.

Observation and verification have different:

- evidence requirements;
- authority;
- timing;
- identity;
- lifecycle meaning.

A later judgment must not mutate the historical observation it evaluates.

## Retain Dashboard Booleans as Canonical

Rejected.

Boolean values cannot distinguish:

- confirmation;
- refutation;
- insufficient Evidence;
- conflicting Evidence;
- processing failure;
- human-review disposition.

## Combine Verification and Outcome Evaluation

Rejected.

Evidence support and business-impact measurement are separate responsibilities.

A proposition may be confirmed without proving that the business condition
improved.

## Permit Arbitrary Verification Subject Types

Rejected for Capability 010.

An open subject discriminator would introduce unnecessary generalization and
weaken the bounded `ObservedOutcome` contract.

Future subject types require separate governance.

## Remove Confidence Permanently

Rejected as a permanent rule.

Verification is a significant conclusion and may require confidence
information.

However, confidence must expose calibration status and must never imply
statistical calibration without authority.

## Create a New Verification Platform Subsystem

Rejected.

Shared Domain and Core ownership are sufficient.

A new top-level subsystem would add complexity without establishing a unique
responsibility that existing layers cannot own.

# Consequences

## Positive

This decision:

- establishes the missing canonical boundary after `ObservedOutcome`;
- preserves canonical Evidence authority;
- distinguishes judgment from processing state;
- prevents execution completion from becoming proof automatically;
- prevents simulated booleans from becoming canonical truth;
- preserves Organization isolation;
- separates Verification from Outcome Evaluation;
- separates Verification from causality;
- separates Verification from Learning;
- supports deterministic audit and replay;
- provides a controlled modernization path for legacy contracts;
- avoids creating another platform subsystem;
- preserves minimum complexity.

## Tradeoffs

This decision:

- requires reconciliation of existing verification vocabularies;
- narrows the legacy multi-subject Verification contract;
- requires future migration of dashboard projections;
- requires explicit canonical Evidence references;
- requires Organization-boundary validation;
- requires calibration status when confidence is represented;
- prevents convenient boolean shortcuts;
- requires HCES-0010 before implementation;
- may require compatibility adapters during migration.

# Required Follow-On Governance

The next required specification is:

`HCES-0010 — Deterministic Verification`

HCES-0010 must define:

- public construction contract;
- canonical fields;
- schema version;
- normalization sequence;
- validation sequence;
- judgment vocabulary;
- processing-state separation;
- Organization invariants;
- `ObservedOutcome` lineage;
- Evidence lineage;
- method representation;
- verifier representation;
- verification-time rules;
- limitations and notes;
- confidence representation;
- calibration status and authority;
- deterministic identity material;
- canonical serialization;
- semantic equality;
- deep immutability;
- failure taxonomy;
- fixed identity vectors;
- compatibility requirements;
- required tests;
- explicit non-goals.

After HCES review, governance acceptance requires:

`GM-0010 — Deterministic Verification Governance Acceptance`

Implementation verification is recorded by VVR-0010. No tracked accepted
Release Record exists.

# Validation of the Decision

Governance review confirmed that this ADR:

- does not duplicate canonical Evidence;
- preserves the canonical verified `ObservedOutcome` boundary;
- keeps Outcome Evaluation downstream;
- keeps Learning downstream;
- does not claim causality;
- distinguishes judgment from processing state;
- fixes Capability 010 to one `ObservedOutcome`;
- prohibits cross-Organization Verification;
- requires explicit Evidence identities;
- requires deterministic identity and serialization;
- preserves confidence-calibration honesty;
- introduces no unjustified top-level subsystem;
- defines a viable legacy migration direction;
- maintains minimum complexity.

# Status and Authorization

This ADR is Accepted.

It records the canonical architecture for Capability 010. GM-0010 authorized
only the bounded implementation and migration scope, and VVR-0010 records PASS
verification of that implementation.

Implementation and verification may consume canonical verified
`ObservedOutcome` and Evidence contracts. Operational use requires every
applicable upstream release, admissibility, and runtime-governance boundary to
be satisfied.

Capability 010 is verified but not released because no tracked accepted
Release Record exists. This ADR, HCES-0010, GM-0010, VVR-0010, tests, builds,
staging, merge, and commit confer no release, deployment, production, or
runtime authority. Any expansion remains separately governed.

# Final Normative Statement

GinzaAIpro SHALL represent evidence-backed qualification of one immutable
`ObservedOutcome` through a separately identified, Organization-scoped,
deterministic, deeply immutable `Verification`.

The canonical Verification judgment SHALL be exactly one of:

- `confirmed`;
- `refuted`;
- `inconclusive`.

Verification SHALL consume explicit canonical Evidence identities.

Verification SHALL NOT:

- recreate Evidence;
- mutate the observation;
- infer missing Evidence;
- convert completion into proof;
- calculate business impact;
- claim causality;
- generate organizational learning.

Outcome Evaluation and Learning remain separate downstream responsibilities.

This decision is Accepted. Implementation is authorized only within
GM-0010's explicit bounded scope.
