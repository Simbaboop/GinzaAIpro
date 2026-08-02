# GM-0010 — Deterministic Verification Governance Acceptance

**Milestone ID:** GM-0010
**Capability:** 010 — Deterministic Verification
**Date:** 2026-07-29
**Status:** Accepted
**Review Disposition:** ACCEPTED

# Purpose

Record formal architecture and specification acceptance for Capability 010,
approve the exact legacy Verification migration strategy, and authorize only
the bounded implementation defined by this milestone.

# Reviewed Artifacts

- DISC-0009 — Canonical Verification Boundary;
- ADR-0019 — Canonical Deterministic Verification Architecture,
  Version 1.0.0; and
- HCES-0010 — Deterministic Verification, Version 1.0.0.

ADR-0019 and HCES-0010 are Accepted as of this milestone.

# Prerequisite Baseline

The effective internal baseline is:

```text
ExecutionPlan
    |
    v
RuntimeAdmission
    |
    v
ExecutionEvent
    |
    v
ObservedOutcome
```

Capability 010 establishes this accepted downstream extension:

```text
ExecutionPlan
    |
    v
RuntimeAdmission
    |
    v
ExecutionEvent
    |
    v
ObservedOutcome
    |
    v
Verification
    |
    v
Outcome Evaluation
    |
    v
Learning
```

Capability 010 shall add only Verification.

Outcome Evaluation and Learning remain future capabilities.
# Canonical Boundary Finding

The accepted canonical Verification boundary contains:

- exactly one immutable `ObservedOutcome`;
- one bounded, non-empty collection of canonical Evidence records;
- one governed verification method;
- one closed evidentiary judgment;
- explicit verification time;
- explicit limitations;
- optional verifier identity;
- optional bounded notes; and
- optional numerical confidence with explicit calibration status.

The canonical judgment vocabulary is limited to:

- `confirmed`;
- `refuted`; and
- `inconclusive`.

Verification shall not:

- create or replace Evidence;
- recreate observation;
- infer causality;
- evaluate business success;
- evaluate recommendation quality;
- perform Learning;
- treat execution completion as proof; or
- treat engine processing success as evidentiary confirmation.

The accepted ownership direction shall be:

- canonical Domain artifact under `packages/domain/src/verification/`; and
- pre-judgment Core request and engine contract under
  `packages/core/src/verification/`.

No new top-level subsystem is justified.

# Legacy Migration Finding

The existing legacy Domain `Verification` is exported through:

- `packages/domain/src/intelligence/index.ts`; and
- `packages/domain/src/index.ts`.

Its direct source consumers are limited to:

- `packages/domain/tests/intelligence.test.ts`;
- `packages/core/src/verification/VerificationEngine.ts`; and
- `packages/core/tests/core-contracts.test.ts`.

No production application source depends on the legacy canonical Domain
`Verification` contract.

The dashboard-local execution verification implementation is a separate
application projection. It is not a compatibility dependency on the Domain
class and shall remain unchanged unless later adapter work is separately
authorized.

The selected minimum-complexity migration strategy is:

1. replace the legacy Domain `Verification` export with the Capability 010
   canonical implementation in one bounded implementation change;
2. move canonical ownership to `packages/domain/src/verification/`;
3. update Domain exports so exactly one public class named `Verification`
   exists;
4. replace Core `VerificationInput` with `VerificationRequest`;
5. update only the directly affected Domain and Core contract tests;
6. preserve dashboard-local verification behavior unchanged; and
7. create no temporary compatibility alias.

A temporary legacy alias is not justified because no production source
consumer requires one.

This migration finding is accepted as part of the bounded implementation
authorization recorded below and authorizes no work beyond that scope.
# Architecture Findings

## Boundary

PASS.

Verification evaluates exactly one immutable `ObservedOutcome` using one or
more canonical Evidence records and produces one immutable evidentiary
judgment.

Evidence, observation, Verification, Outcome Evaluation, causality, and
Learning remain separate responsibilities.

## Subject and Atomicity

PASS.

The canonical subject is fixed as `observed_outcome`.

One Verification contains:

- one `ObservedOutcome` identity;
- one Organization identity derived from the subject;
- one canonically ordered Evidence identity collection;
- one method;
- one judgment;
- one verification timestamp;
- one limitations collection;
- optional verifier identity;
- optional notes; and
- optional confidence state.

Open subject types and loose subject identities are prohibited.

## Judgment Separation

PASS.

The evidentiary judgment vocabulary is closed:

- `confirmed`;
- `refuted`;
- `inconclusive`.

`EngineResult.success` reports processing success only.

It does not represent evidentiary confirmation.

## Confidence and Calibration

PASS.

Numerical confidence is optional.

When supplied, it must be explicitly classified as:

- `uncalibrated`; or
- `calibrated`.

Calibrated confidence requires a canonical calibration-record identity.

Capability 010 validates the declared confidence structure but does not create
or scientifically validate calibration methodology.

## Determinism

PASS.

Identity and serialization inputs are closed, versioned, normalized, ordered,
and independent of:

- caller collection order;
- locale;
- timezone;
- process state;
- machine state;
- object identity;
- hidden clocks;
- operational diagnostics; and
- external I/O.

## Dependency Direction

PASS.

The Domain artifact depends only on canonical Domain abstractions.

The Core request and engine contract depend on the public Domain Verification
contract and the shared Engine abstraction.

No reverse, circular, infrastructure, persistence, dashboard, workforce,
Outcome Evaluation, or Learning dependency is authorized.

# Specification Findings

HCES-0010 is structurally implementation-ready subject to formal acceptance.

- Normative requirements: 110 unique sequential identifiers.
- Governed failure codes: 33 closed identifiers.
- Validation precedence: 25 deterministic stages.
- Evidence bounds: 1 through 128 records.
- Limitation bounds: 0 through 64 entries.
- Method bound: 128 UTF-8 bytes.
- Limitation bound: 1,024 UTF-8 bytes per entry.
- Confidence-basis bound: 1,024 UTF-8 bytes.
- Notes bound: 4,096 UTF-8 bytes.
- Identity prefix: `verification:v1:`.
- Schema version: `verification:v1`.
- Equality basis: canonical `VerificationId`.
- Core request name: `VerificationRequest`.
- Domain construction input: `VerificationCreateInput`.

Every normative requirement requires a future test or documented static
verification in the Capability 010 validation record.

# Minimum-Complexity Finding

PASS.

The capability requires:

- one canonical immutable Domain artifact;
- one bounded Core request contract;
- one Core engine interface;
- focused exports;
- specification-traceable tests;
- direct replacement of the unused legacy public contract; and
- one future validation record.

The following are not justified or authorized:

- a second Verification model;
- a compatibility alias;
- a generic claim framework;
- a verification-method registry;
- a mutable verification workflow;
- a new top-level package;
- a repository abstraction;
- persistence;
- transport;
- adapters;
- dashboard integration;
- workforce integration;
- analytics;
- causal inference;
- Outcome Evaluation; or
- Learning behavior.
# Compatibility Finding

PASS, subject to the selected bounded migration.

Capability 010 requires no modification to the canonical behavior, identity,
serialization, or public contracts of:

- `ExecutionPlan`;
- `RuntimeAdmission`;
- `ExecutionEvent`;
- `ObservedOutcome`; or
- canonical Evidence identity.

The only intentional compatibility change is replacement of the legacy public
Domain Verification contract and its directly dependent Core request
contract.

The migration shall:

- expose exactly one canonical public Domain `Verification`;
- remove the legacy intelligence export;
- introduce the canonical verification namespace export;
- replace `VerificationInput` with `VerificationRequest`;
- update directly affected contract tests;
- preserve dashboard-local verification unchanged; and
- introduce no compatibility alias.

# Authorized Public Boundary

The authorized Domain public surface is limited to:

- `Verification`;
- `VerificationId`;
- `VerificationCreateInput`;
- `VerificationJudgment`;
- `VerificationConfidence`;
- `VerificationError`;
- `VerificationFailureCode`; and
- `SerializedVerification`.

The authorized Core public surface is limited to:

- `VerificationRequest`; and
- `VerificationEngine`.

All normalization, validation, projection, ordering, hashing, serialization,
defensive-copy, and failure-precedence helpers shall remain private.

# Explicit Exclusions

Capability 010 excludes:

- Evidence creation or replacement;
- observation creation or mutation;
- causal inference;
- business-success evaluation;
- recommendation-quality evaluation;
- Outcome Evaluation;
- Learning;
- concrete verification-method implementation;
- calibration-methodology creation;
- persistence;
- repositories;
- transport;
- networking;
- APIs;
- adapters;
- dashboard integration;
- workforce integration;
- analytics;
- AI-provider integration;
- mutable workflow state;
- generalized claim frameworks;
- generic metadata containers;
- a second Verification authority; and
- a temporary legacy compatibility alias.
# Corrections Applied

The governance review applied these corrections before acceptance:

1. Rejected `EvidenceRecord` as a new canonical artifact because canonical
   Evidence already exists and supplies the evidentiary input to Verification.
2. Fixed the downstream sequence as:
   `ExecutionEvent -> ObservedOutcome -> Verification -> Outcome Evaluation -> Learning`.
3. Restricted Verification to exactly one immutable `ObservedOutcome`.
4. Replaced open legacy subject types with the fixed canonical subject
   `observed_outcome`.
5. Separated the completed Domain construction contract,
   `VerificationCreateInput`, from the pre-judgment Core request,
   `VerificationRequest`.
6. Separated processing success from evidentiary judgment.
7. Closed the judgment vocabulary to `confirmed`, `refuted`, and
   `inconclusive`.
8. Required canonical Evidence objects rather than caller-supplied Evidence
   identities at the construction and Core request boundaries.
9. Derived Organization and upstream identities from canonical artifacts
   rather than caller side channels.
10. Added explicit Evidence and limitations collection bounds.
11. Replaced implementation-defined prose limits with exact UTF-8 byte bounds.
12. Defined explicit timestamp normalization and both temporal admissibility
    boundaries.
13. Added explicit confidence states for `uncalibrated` and `calibrated`.
14. Required calibration authority before numerical confidence may be
    represented as calibrated.
15. Closed deterministic identity inputs, ordering, framing, serialization,
    equality, and omission behavior.
16. Added 33 governed failure codes and 25 deterministic validation stages.
17. Added original caller-index diagnostics before collection sorting.
18. Defined a minimum Domain and Core public API while keeping all helpers
    private.
19. Identified the legacy root-export collision.
20. Selected direct replacement with no temporary compatibility alias because
    no production application source consumes the legacy Domain contract.
21. Preserved dashboard-local execution verification as an unchanged
    application projection.
22. Preserved Outcome Evaluation, Learning, concrete verification methods,
    persistence, adapters, and production promotion as separate future
    authorizations.

These corrections make the architecture and specification implementation-ready
without expanding Capability 010 beyond deterministic Verification.
# Implementation Authorization

Implementation is authorized only for:

- one canonical immutable `Verification` Domain implementation under
  `packages/domain/src/verification/`;
- the accepted Domain public exports;
- direct removal of the legacy intelligence Verification export;
- one `VerificationRequest` Core contract;
- one `VerificationEngine` Core interface;
- removal of the legacy Core `VerificationInput`;
- focused specification-traceable Domain and Core tests;
- required regression verification;
- one Capability 010 Verification and Validation Record; and
- repository documentation changes required to record the bounded migration.

Implementation shall conform exactly to ADR-0019, HCES-0010, and the migration
strategy recorded in this milestone.

Implementation shall stop if it requires:

- modification of an upstream canonical contract;
- a new architectural decision;
- a temporary compatibility alias;
- infrastructure or persistence behavior;
- an unsupported verification method;
- Outcome Evaluation;
- Learning behavior; or
- expansion beyond the accepted public boundary.

This milestone shall not authorize:

- concrete verification-method logic;
- calibration-methodology implementation;
- Outcome Evaluation;
- Learning;
- persistence;
- repositories;
- transport;
- APIs;
- adapters;
- dashboard changes;
- workforce changes;
- release;
- production promotion; or
- any future capability.

# Conditions

No unresolved architecture condition remains.

Implementation is authorized only within the explicit scope recorded above.

Implementation verification is governed separately by VVR-0010 and shall not
expand this milestone's bounded authorization.

This milestone authorizes implementation only. It does not authorize release,
deployment, production promotion, or operational use. Those require separate
release governance and all applicable upstream release, admissibility, and
runtime-governance boundaries.

# Validation Results

- Discovery boundary completed: PASS
- Canonical Evidence reuse: PASS
- New `EvidenceRecord` rejected: PASS
- Architecture boundary: PASS
- Subject atomicity: PASS
- Judgment vocabulary: PASS
- Processing-success separation: PASS
- Confidence and calibration boundary: PASS
- Dependency direction: PASS
- Deterministic identity inputs: PASS
- Canonical serialization contract: PASS
- Deep immutability and equality basis: PASS
- Failure vocabulary: PASS — 33 closed codes
- Validation precedence: PASS — 25 deterministic stages
- Normative requirements: PASS — 110/110 unique and sequential
- Evidence and text bounds: PASS
- Legacy source-consumer inventory: PASS
- Direct replacement strategy: PASS
- Temporary compatibility alias required: NO
- Production application dependency on legacy Domain Verification: NO
- Dashboard-local implementation affected: NO
- Minimum complexity: PASS
- Upstream canonical modification authorized: NO
- Implementation or tests created: NO
- Validation record created: NO
- Release record created: NO
- Staging performed: NO
- Commit created: NO

# Status and Disposition

This milestone is Accepted.

**Review Disposition:** ACCEPTED

Implementation is authorized only within the bounded scope recorded above.
