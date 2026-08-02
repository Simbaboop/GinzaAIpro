# DISC-0009 — Canonical Verification Boundary and Legacy Reconciliation

## Status

Discovery Complete — Historical Evidence

## Date

2026-07-29

## Purpose

Determine the canonical ownership, input boundary, output boundary, terminology,
and legacy disposition for the Verification capability that follows
ObservedOutcome.

This discovery does not authorize implementation.

---

## 1. Trigger

Capability 009 verified the immutable canonical `ObservedOutcome` contract and
authorized governance preparation for the next downstream capability. It was
not released; no tracked accepted Release Record exists.

Initial references described that future work as `EvidenceRecord`. Repository
inspection established that canonical Evidence already exists through Capability
001 and Evidence Semantics already exists through Capability 002.

Creating another evidence record would duplicate existing canonical authority.

The actual unresolved lifecycle stage is Verification.

---

## 2. Governing Lifecycle

The canonical operational lifecycle is:

Reality
→ Capture
→ Operational Evidence / Runtime Events
→ Operational Signals
→ Operational Memory
→ Operational Health
→ Operational Cognition
→ Operational Orchestration
→ Governance
→ Execution
→ Verification
→ Learning

The relevant execution and observation sequence is:

ExecutionPlan
→ RuntimeAdmission
→ ExecutionEvent
→ ObservedOutcome
→ Verification
→ Outcome Evaluation
→ Learning

Verification is therefore downstream of factual observation and upstream of
business outcome evaluation and organizational learning.

---

## 3. Canonical Evidence Boundary

Canonical Evidence already owns:

- factual artifacts;
- evidence records;
- evidence metadata;
- evidence references;
- organization-scoped identity;
- component-level provenance;
- source lineage;
- deterministic evidence representation;
- deterministic semantic projection.

Verification must consume canonical Evidence identifiers.

Verification must not:

- recreate Evidence;
- rename Evidence;
- embed replacement evidence structures;
- reinterpret Evidence Semantics;
- silently infer evidence references;
- accept a completion claim as evidence of successful execution.

---

## 4. ObservedOutcome Boundary

`ObservedOutcome` owns one immutable post-execution observation.

It records what was observed after an ExecutionEvent.

It preserves collection provenance but does not determine:

- whether the observation is supported;
- whether the observation is contradicted;
- whether execution should be trusted;
- whether the intended business condition improved;
- whether causality has been established;
- whether organizational learning should occur.

Verification must qualify an `ObservedOutcome` without mutating it.

---

## 5. Verification Responsibility

Capability 010 should own the immutable judgment produced when a defined
verification method evaluates an `ObservedOutcome` against canonical Evidence.

The minimum conceptual input is:

- organization identity;
- ObservedOutcome identity;
- verification method;
- one or more canonical Evidence identities;
- verifier identity when applicable;
- verification time;
- limitations;
- optional notes;
- confidence information with explicit calibration status.

The minimum conceptual output is:

- immutable Verification identity;
- organization identity;
- ObservedOutcome identity;
- canonical Evidence identities;
- verification method;
- verification result;
- verifier identity when applicable;
- verification time;
- limitations;
- optional notes;
- confidence information with explicit calibration status;
- deterministic identity and serialization metadata.

---

## 6. Verification Result Vocabulary

Three competing vocabularies exist.

### 6.1 Shared package vocabulary

- `confirmed`
- `refuted`
- `inconclusive`

### 6.2 Active execution-specification vocabulary

- `Unverified`
- `Verified`
- `Needs Review`
- `Failed Verification`

### 6.3 Dashboard execution vocabulary

- `executionSucceeded: boolean`
- `outcomeVerified: boolean`

The dashboard boolean model is insufficient because it:

- cannot distinguish refutation from insufficient evidence;
- cannot express human-review requirements;
- does not identify canonical Evidence;
- generates its own verification time;
- permits simulated success to become verified automatically;
- conflates execution completion with business-outcome verification.

The architectural decision should distinguish:

1. lifecycle or processing status; and
2. evidentiary judgment result.

Provisional recommendation:

- lifecycle status belongs to orchestration or workflow processing;
- canonical Verification judgment uses `confirmed`, `refuted`, or
  `inconclusive`;
- `Needs Review` is a workflow disposition, not an evidentiary result;
- `Unverified` means no Verification record exists;
- `Verified` is an unsafe umbrella term unless the exact judgment remains
  visible;
- `Failed Verification` should resolve to either `refuted` or `inconclusive`
  based on evidence, not become an ambiguous fourth judgment.

Final terminology requires ADR approval.

---

## 7. Confidence and Calibration

The legacy shared Verification contract contains a numerical `Percentage`
confidence.

A numerical value must not be described as calibrated unless supported by
accumulated prediction records, evidence quality, outcomes, falsification,
base rates, or back-testing.

Capability 010 must therefore either:

1. retain numerical confidence with explicit calibration status and basis; or
2. defer numerical confidence until a governed calibration contract exists.

Provisional recommendation:

- retain confidence because Verification is a significant conclusion;
- label it explicitly as calibrated or uncalibrated;
- require the inputs or basis used to produce it;
- require a calibration-record reference before claiming calibrated status.

Final treatment requires ADR and HCES approval.

---

## 8. Outcome Boundary

The existing `Outcome` contract evaluates:

- metric;
- baseline;
- actual result;
- delta;
- unit;
- measurement period;
- supporting Evidence;
- confidence.

Outcome therefore answers whether the measured business condition changed.

Verification must not absorb:

- baseline comparison;
- metric evaluation;
- delta calculation;
- business-impact assessment;
- causality;
- learning conclusions.

The governed order remains:

ObservedOutcome
→ Verification
→ Outcome Evaluation
→ Learning

---

## 9. Canonical Ownership

The strongest existing shared ownership is:

- domain Verification contract in `packages/domain`;
- Verification engine interface and input in `packages/core`;
- exported package boundaries;
- existing domain and core tests.

However, the current domain file is located under `intelligence`, while
Verification is a distinct lifecycle responsibility.

The architectural decision must determine whether canonical ownership becomes:

- `packages/domain/src/verification/`; or
- `packages/domain/src/execution/` as a separately identified record within
  the broader Execution Aggregate.

Verification must not remain owned by:

- dashboard UI;
- Workforce;
- Operational Learning;
- a dashboard-local execution engine;
- canonical Evidence.

Provisional recommendation:

- shared Domain owns the Verification value object;
- shared Core owns the Verification engine contract;
- dashboard, Workforce, and execution-platform models become adapters or
  specialized consumers;
- no additional top-level platform subsystem is required.

Final package placement requires ADR approval.

---

## 10. Legacy Disposition

### 10.1 Shared `packages/domain` Verification

Classification: modernization candidate.

Preserve compatible concepts:

- organization scope;
- immutable construction;
- evidence identifiers;
- method;
- result;
- verifier;
- verified time;
- limitations;
- notes.

Required changes likely include:

- canonical `ObservedOutcome` subject;
- deterministic identity;
- canonical serialization;
- schema version;
- complete failure taxonomy;
- organization-boundary enforcement;
- evidence identity validation;
- confidence calibration distinction.

### 10.2 Shared `packages/core` VerificationInput

Classification: modernization candidate.

Preserve request-before-result separation.

Required changes likely include:

- ObservedOutcome identity;
- deterministic evaluation context;
- governed result construction;
- canonical diagnostics and failure codes;
- evidence and organization boundary checks.

### 10.3 Dashboard execution VerificationEngine

Classification: compatibility adapter or deprecation candidate.

It must not remain canonical because it:

- accepts no canonical Evidence identities;
- creates wall-clock time internally;
- accepts booleans supplied by its caller;
- automatically verifies simulated outcomes;
- lacks deterministic identity;
- lacks limitations and calibration;
- conflates completion and outcome judgment.

### 10.4 Dashboard Observation verificationStatus

Classification: legacy embedded field.

Its future replacement is a reference to separately identified Verification
records or a derived display projection.

It must not remain the canonical source of verification truth.

### 10.5 Dashboard Execution verificationStatus

Classification: transitional projection.

It may remain temporarily for presentation compatibility but must be derived
from canonical Verification, not independently mutated.

### 10.6 Workforce WorkVerification

Classification: specialized assignment-verification support.

It may identify who reviewed assigned work but must not replace canonical
evidence-based Verification.

### 10.7 Outcome contracts

Classification: downstream and retained.

Outcome evaluation remains separate from Verification.

---

## 11. Minimum-Complexity Rule

Capability 010 should introduce only the minimum contract needed to qualify an
ObservedOutcome using canonical Evidence.

It should not create:

- another Evidence model;
- another Outcome model;
- a new top-level platform subsystem;
- a general-purpose claims engine;
- ontology inference;
- causal inference;
- learning logic;
- dashboard-specific domain ownership.

---

## 12. Required Architectural Decision

The next ADR should be:

`ADR-0019 — Canonical Deterministic Verification Architecture`

It must decide:

1. canonical Verification ownership;
2. `ObservedOutcome` as the governed subject;
3. Evidence identity requirements;
4. result versus workflow-status vocabulary;
5. confidence and calibration treatment;
6. deterministic identity and serialization;
7. organization and tenant-boundary enforcement;
8. legacy adapter and deprecation treatment;
9. separation from Outcome Evaluation and Learning;
10. the minimum authorized Capability 010 boundary.

---

## 13. Required Specification

After ADR acceptance, create:

`HCES-0010 — Deterministic Verification`

The HCES must specify:

- public construction contract;
- canonical fields;
- normalization;
- validation order;
- deterministic identity;
- canonical serialization;
- result vocabulary;
- calibration representation;
- failure codes;
- tenant and organization invariants;
- Evidence and ObservedOutcome lineage;
- tests and fixed vectors;
- legacy compatibility requirements;
- explicit non-goals.

---

## 14. Historical Authorization State

This discovery originally authorized:

- repository inspection;
- boundary analysis;
- this discovery record;
- ADR-0019 drafting;
- HCES-0010 drafting after ADR review;
- governance review.

It did not authorize:

- TypeScript implementation;
- moving existing files;
- deleting legacy contracts;
- changing exports;
- changing dashboard fields;
- changing VerificationEngine behavior;
- adding migrations;
- staging or committing files;
- Capability 010 release claims.

---

## 15. Discovery Conclusion

The missing downstream capability is not `EvidenceRecord`.

The missing capability is deterministic, evidence-backed Verification of an
immutable `ObservedOutcome`.

Canonical Evidence remains unchanged.

Outcome Evaluation remains downstream.

Learning remains downstream of validated outcomes.

Capability 010 proceeded as Deterministic Verification under accepted ADR-0019
and HCES-0010, bounded implementation authorization in GM-0010, and PASS
verification in VVR-0010.

This discovery remains historical evidence only. It confers no implementation,
release, deployment, or production authority. Capability 010 is verified but
not released because no tracked accepted Release Record exists.
