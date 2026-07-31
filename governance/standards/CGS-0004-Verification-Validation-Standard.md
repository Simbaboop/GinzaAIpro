# CGS-0004 — Verification and Validation Standard

**Version:** 1.0.0
**Status:** Accepted

## Purpose

This standard defines the evidence and disposition required to verify and
validate a GinzaAIpro capability or implementation artifact.

Verification asks whether the implementation conforms to its accepted
contract. Validation asks whether the resulting artifact satisfies the
governed capability purpose and boundaries. Neither activity may change the
contract under review.

## Verification Philosophy

Verification SHALL be evidence-based, reproducible, scoped, and independent
of desired release outcomes. A report MUST distinguish:

- executed checks from inferred conclusions;
- implementation failures from environmental failures;
- required behavior from observations and recommendations;
- package-level evidence from workspace-level evidence; and
- conformance from release authorization.

An unexecuted command is not a pass. Partial evidence MUST be labeled partial.
Warnings, limitations, and excluded phases SHALL be recorded with their
effect on confidence and release eligibility.

Verification SHOULD use the repository's established commands and test
conventions. New verification machinery MUST NOT be introduced when existing
tools provide equivalent evidence.

## Verification Categories

### 1. Governance and specification conformance

Reviewers SHALL verify that:

- governing documents are accepted and versioned;
- implementation authorization exists;
- every normative requirement maps to implementation and evidence;
- stop conditions were respected; and
- no undocumented deviation or scope expansion occurred.

### 2. Architectural conformance

Reviewers SHALL verify canonical ownership, public API boundaries, package
dependencies, absence of prohibited cycles, and preservation of protected
contracts. Cross-package imports MUST follow canonical package boundaries.

The review SHALL confirm that prohibited infrastructure, AI, persistence,
network, workflow, or runtime behavior was not introduced.

### 3. Contract and behavioral verification

Tests SHALL cover successful construction or execution, invalid inputs,
governed failures, boundary cases, public exports, and every closed taxonomy
or failure code required by the specification.

Where determinism is required, verification SHALL include equivalent-input
replay, materially different inputs, canonical ordering, stable identity,
stable serialization, and stable failure precedence.

### 4. Integrity and immutability

Verification SHALL establish, where applicable:

- immutable outputs and unchanged inputs;
- defensive copying of caller-owned structures;
- canonical provenance preservation;
- identity and version preservation;
- absence of hidden time, randomness, process state, or external I/O; and
- stable behavior across host locale and timezone assumptions.

### 5. Engineering verification

The relevant package and workspace commands SHALL include, when configured:

- focused tests;
- full package tests;
- type checking;
- builds;
- linting or formatting;
- public-export checks;
- dependency and cycle checks; and
- `git diff --check`.

Generated artifacts and package caches MUST NOT be included unintentionally.

### 6. Repository integrity

The report SHALL identify all changed files and confirm that unrelated or
protected files were not modified by the reviewed work. Existing unrelated
worktree changes MUST be distinguished from review-scope changes.

## Required Evidence

Every VVR SHALL contain:

1. capability or artifact identification;
2. governing ADR, HCES, CGS, and version references;
3. implementation scope and changed files;
4. a requirement-to-implementation-to-test conformance matrix;
5. exact commands executed;
6. command exit status and relevant result counts;
7. collected and executed test counts where available;
8. architecture and dependency evidence;
9. export and repository-integrity evidence;
10. deviations, limitations, risks, and unverified phases; and
11. one final disposition.

Evidence SHALL be sufficient for another engineer to reproduce the review.
Claims MUST cite a file, symbol, test, command, or durable governance source.

Environmental failures such as blocked worker creation SHALL record:

- the exact command;
- whether collection began;
- files collected;
- tests executed;
- the host error; and
- which alternative non-worker checks were completed.

Alternative checks MAY increase confidence but MUST NOT be reported as the
original test suite passing.

## Disposition Criteria

### PASS

PASS requires all of the following:

- every normative requirement conforms;
- all required tests execute and pass;
- type checking and required builds pass;
- architecture and repository integrity checks pass;
- no release-blocking deviation remains; and
- no required verification phase is unexecuted.

### CONDITIONAL PASS

CONDITIONAL PASS MAY be used only when:

- implemented behavior and all executed checks conform;
- the remaining limitation is explicit, bounded, and not an observed
  implementation defect;
- no architecture, security, data-integrity, tenant-isolation, or provenance
  requirement is weakened;
- the missing evidence can be completed without changing the implementation;
  and
- the exact condition for full PASS is recorded.

An environmental inability to execute a required test suite normally produces
a CONDITIONAL PASS, not PASS. A conditional disposition SHALL NOT be silently
promoted by a release record.

### FAIL

FAIL is required when:

- a normative requirement is violated or unimplemented;
- required behavior fails a test or runtime assertion;
- architecture or dependency boundaries are breached;
- identity, provenance, immutability, security, or determinism is defective;
- implementation scope is unauthorized;
- evidence is contradictory or materially incomplete; or
- completing verification requires an implementation or specification change.

## Reporting Rules

A VVR SHALL choose exactly one disposition. Findings SHALL be separated into
release blockers, observations, risks, and recommendations. Recommendations
MUST NOT disguise unresolved requirements.

Verification reports are immutable evidence after acceptance. Corrections
SHALL use an explicit revision or superseding report rather than silent edits.
