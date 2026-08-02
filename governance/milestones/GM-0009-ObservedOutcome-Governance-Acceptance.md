# GM-0009 — ObservedOutcome Governance Acceptance

**Milestone ID:** GM-0009
**Capability:** 009 — ObservedOutcome
**Date:** 2026-07-28
**Status:** Accepted
**Review Disposition:** ACCEPTED

# Purpose

Record formal architecture and specification acceptance for Capability 009
and authorize only the bounded implementation of canonical
`ObservedOutcome`.

# Governing Authorities

The review applied:

- Platform Constitution, Version 1.0;
- CGS-0001 — Capability Governance Standard, Version 1.0.0;
- CGS-0004 — Verification and Validation Standard, Version 1.0.0;
- CGS-0005 — Release Governance Standard, Version 1.0.0;
- ADR-0009 — Canonical Ownership of Runtime Admission;
- ADR-0010 — Immutable Execution Event Architecture;
- HCES-0008A — RuntimeAdmission;
- HCES-0008B — ExecutionEvent;
- GM-0008B — ExecutionEvent Governance Acceptance;
- VVR-0008B — ExecutionEvent Verification and Validation Record;
- the canonical verified `RuntimeAdmission` contract; and
- the canonical verified `ExecutionEvent` contract.

# Prerequisite Baseline

The canonical verified execution contracts are the effective implementation
internal baseline:

```text
ExecutionPlan
    ↓
RuntimeAdmission
    ↓
ExecutionEvent
```

Capability 009 extends this lineage without changing it.

# Reviewed Artifacts

- ADR-0011 — Immutable Observed Outcome Architecture, Version 1.0.0; and
- HCES-0009 — ObservedOutcome, Version 1.0.0.

Both artifacts are Accepted as of this milestone.

# Architecture Findings

## Boundary

The accepted boundary is:

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

`ExecutionEvent` records one admitted execution occurrence.
`ObservedOutcome` records one bounded observation associated with that event.
Future `EvidenceRecord` may qualify the observation. Later evaluation
capabilities may interpret success, learning, or recommendation quality.

No layer absorbs the responsibility of another.

## Name Pressure Test

`ObservedOutcome` remains acceptable because its canonical meaning is
explicitly non-causal and non-evaluative. The contract supports correlated,
inaccurate, contradicted, unchanged, negative, categorical, null-in-business-
meaning, and indirectly sourced observations without treating them as proof.

The name does not establish that execution caused the observation or that the
observation is verified.

## Atomicity

One artifact contains:

- one canonical `ExecutionEvent`;
- one observed subject;
- one observation code;
- one discriminated value;
- one observation timestamp; and
- one provenance structure.

Heterogeneous observation collections are prohibited.

## Dependency and Future Compatibility

The dependency direction is from `ObservedOutcome` to `ExecutionEvent`.
Reverse dependency, circular dependency, infrastructure access, and
caller-supplied lineage side channels are prohibited.

Future evidence qualification can consume immutable ObservedOutcome without
mutating it, adding verification status, adding confidence, reinterpreting
identity, or modifying ExecutionEvent.

# Specification Findings

HCES-0009 is implementation-ready after review corrections.

- Normative requirements: 72 unique sequential identifiers.
- Governed failure codes: 26 unique identifiers.
- Every failure code has an exact trigger, owning precedence stage, stable
  details contract, planned test, and normative mapping.
- Every public field has an authoritative source and deterministic
  normalization, validation, identity, and serialization semantics.
- Validation precedence is closed and deterministic.
- Equality has one basis: canonical `ObservedOutcomeId`.
- No future EvidenceRecord or analytics behavior is governed.

# Corrections Applied

The review applied these drafting corrections before acceptance:

1. Added explicit `subjectType` and `subjectId` so atomic observation
   ownership is not inferred.
2. Clarified the asynchronous static factory, private constructor, inherited
   `Entity.id`, and prohibition on caller-supplied outcome identity.
3. Defined observation-code and subject-type token grammars.
4. Completed decimal, unit-token, Unicode, control-character, and newline
   normalization rules.
5. Clarified timestamp equality: equality with execution or observation time
   is accepted; only earlier instants are rejected.
6. Removed redundant upstream-lineage inputs from the new identity hash.
   Canonical ExecutionEvent identity participates once while lineage remains
   preserved in serialization.
7. Completed RFC 8259 JSON escaping, Unicode emission, optional-field,
   collection, and controlled-projection serialization rules.
8. Expanded deterministic validation precedence to distinguish projection,
   subject, discriminator, payload, time, and provenance stages.
9. Added three subject failure codes and a complete failure trigger matrix.
10. Renumbered and refined requirements from 66 to 72.
11. Fixed canonical decimal grammar for negative fractions and made identity
    framing, optional markers, and nested validation ordering exact.

Items 1, 6, and 9 materially clarify the public input, identity inputs, and
failure model. They resolve omissions discovered during formal review and do
not change domain ownership, dependency direction, upstream contracts, or the
accepted non-causal observation boundary.

# Compatibility Finding

PASS.

Implementation requires no modification to:

- `ExecutionPlan`;
- `RuntimeAdmission`;
- `ExecutionEvent`;
- Capability 007;
- Capability 008A;
- Capability 008B;
- any upstream release claim; or
- existing identity and serialization behavior.

Existing legacy `Outcome` and dashboard-local observation types remain
unchanged and do not become canonical aliases.

# Minimum-Complexity Finding

PASS.

The capability is implementable as one focused immutable domain artifact
using existing `Entity`, `Identifier`, Web Crypto, canonical projection,
validation, serialization, and testing conventions.

No base event hierarchy, registry, codec plug-in, unit catalog, metadata map,
causal graph, evidence interface, analytics service, adapter, repository,
factory strategy, event bus, or persistence abstraction is justified or
authorized.

# Accepted Public Boundary

The authorized public surface is limited to:

- `ObservedOutcome`;
- `ObservedOutcomeId`;
- `ObservedOutcomeInput`;
- `ObservedOutcomeValue`;
- `ObservedOutcomeProvenance`;
- `ObservedOutcomeError`;
- `ObservedOutcomeFailureCode`; and
- `SerializedObservedOutcome`.

All hashing, normalization, validation, projection, ordering,
defensive-copy, and serialization helpers remain private.

# Explicit Exclusions

Capability 009 excludes:

- causality and causal inference;
- evidence verification and `EvidenceRecord`;
- success, failure, confidence, or recommendation evaluation;
- aggregation and analytics;
- mutable state;
- execution behavior;
- AI;
- repositories;
- persistence;
- networking;
- APIs;
- telemetry infrastructure; and
- downstream learning capabilities.

`ObservedOutcome` records one immutable bounded observation only and does not
claim causation, verify truth, evaluate success or quality, generate evidence,
execute, schedule, assign, allocate, orchestrate, retry, persist, publish
externally, aggregate, invoke AI, mutate upstream artifacts, or manage workflow
or lifecycle state.

# Implementation Authorization

Implementation is authorized only after this acceptance and only for:

- one canonical `ObservedOutcome` domain implementation under the existing
  domain package;
- the accepted public exports;
- focused specification-traceable tests;
- required existing regression verification; and
- VVR-0009.

Implementation shall conform exactly to ADR-0011 and HCES-0009. It shall stop
if an upstream contract change, new architectural decision, infrastructure
dependency, or unsupported semantic assumption is required.

This milestone does not authorize:

- `EvidenceRecord`;
- an outcome engine;
- analytics;
- persistence;
- adapters;
- APIs;
- release or runtime deployment; or
- any future capability.

# Conditions

No architecture condition remains.

Implementation and verification may consume the canonical verified
`ExecutionEvent` contract. Operational `ObservedOutcome` use requires
`ExecutionEvent`, `RuntimeAdmission`, and `ExecutionPlan` to cross all
applicable release, admissibility, and runtime-governance boundaries.

# Validation Results

- ADR-0011 status and internal consistency: PASS
- HCES-0009 status and internal consistency: PASS
- Name pressure test: PASS
- Architecture boundary: PASS
- Atomicity: PASS
- Dependency direction: PASS
- Canonical execution-contract compatibility: PASS
- Requirement identifiers: PASS — 72/72 unique and sequential
- Failure codes: PASS — 26/26 unique
- Failure-code normative mapping: PASS
- Identity inputs closed and ordered: PASS
- Serialization fields closed and ordered: PASS
- Timestamp rules unambiguous: PASS
- Minimum complexity: PASS
- Focused ObservedOutcome tests: PASS — 64/64
- Complete Domain tests: PASS — 366/366 across 14 files
- Domain typecheck: PASS
- Domain build: PASS
- Release record: none tracked and accepted

Capability 009 is Verified but Not Released because no tracked accepted
Release Record exists. ADR, HCES, GM, VVR, tests, build, staging, merge, or
commit confer no release or runtime-deployment authority.
