# ADR-0008 — Canonical Ownership of ExecutionPlan

**Status:** Accepted

**Classification:** Evolution ADR

# Decision Question

Which domain artifact shall own the canonical architectural concept and public
name `ExecutionPlan`?

# Context

DISC-0008 established that:

- a public `ExecutionPlan` implementation already exists;
- the implementation predates HCES-0007;
- it combines planning, execution management, scheduling, ownership, and
  runtime state;
- HCES-0007 defines `ExecutionPlan` as a planning-only artifact; and
- two public artifacts with the same semantic identity cannot coexist.

The conflict is architectural rather than implementation-specific.

# Decision

HCES-0007 becomes the sole canonical definition of:

`ExecutionPlan`

The existing implementation is recognized as a legacy runtime artifact and
shall no longer own the canonical architectural meaning of `ExecutionPlan`.

Canonical architectural terminology shall follow accepted HCES specifications
rather than historical implementations.

# Canonical Ownership Principle

Establish the following architectural invariant:

> A canonical architectural concept shall have exactly one public
> implementation owning its canonical name.

No two public artifacts may represent different semantics under the same
canonical name.

# Legacy Classification

The existing implementation is reclassified as:

**Legacy Runtime Execution artifact**

Its responsibilities include runtime execution state, scheduling, ownership,
and execution lifecycle.

Those responsibilities are outside the planning boundary defined by
HCES-0007.

# Migration Strategy

The staged governed migration is complete.

## Phase 1

Retain the existing implementation unchanged.

No behavior changes.

**Status:** Completed.

## Phase 2

Rename the existing implementation to:

`RuntimeExecutionPlan`

Update imports, exports, consumers, tests, and runtime references.

**Status:** Completed and verified. The legacy runtime artifact is publicly
named `RuntimeExecutionPlan`.

## Phase 3

Introduce the new canonical:

`ExecutionPlan`

Implement it according to HCES-0007.

**Status:** Completed and verified. The planning-only `ExecutionPlan` is the
sole canonical public owner of that name.

## Phase 4

Remove temporary migration compatibility once all consumers have been
updated.

**Status:** Completed. No competing public `ExecutionPlan` meaning remains.

# Architectural Consequences

## Benefits

- architecture regains authority over implementation;
- one canonical meaning for `ExecutionPlan`;
- elimination of semantic ambiguity;
- cleaner planning/runtime separation;
- improved long-term maintainability; and
- deterministic domain boundaries.

## Costs

- controlled migration effort;
- renamed runtime contract;
- updated imports and exports; and
- revised tests.

# Alternatives Considered

## Retain the Legacy Implementation as Canonical

Rejected.

It conflicts with HCES-0007.

## Rename the HCES-0007 Artifact

Rejected.

Architecture should not diverge from canonical terminology because of
historical implementation.

## Maintain Two Public ExecutionPlan Artifacts

Rejected.

This violates canonical ownership.

## Planning/Runtime Separation

Accepted.

This provides the smallest migration that restores architectural consistency.

# Relationship to Existing Governance

This ADR extends:

- ADR-0005;
- ADR-0006; and
- ADR-0007.

It introduces the Evolution ADR classification.

# Evolution ADR Classification

Evolution ADRs govern migration from historical implementations to accepted
canonical architecture.

They differ from:

- Foundational ADRs, which establish architectural principles; and
- Implementation ADRs, which document localized implementation decisions.

# Migration Verification

Verified repository materialization:

- `packages/domain/src/intelligence/RuntimeExecutionPlan.ts` owns the legacy
  runtime execution contract;
- `packages/domain/src/intelligence/ExecutionPlan.ts` owns the canonical
  planning-only contract;
- public exports and consumers use the distinct names;
- focused `ExecutionPlan`, `ExecutionPlanningRule`, and
  `ExecutionPlanningEngine` suites pass; and
- complete Domain and Engines tests, typechecks, and builds pass.

The migration is implementation-complete and verification-complete. It is not
released. No Release Record exists for Capability 007, and ADR acceptance or
migration completion does not authorize release.

# Validation

- Document formatting and whitespace checks: PASS
- Trailing whitespace: NONE
- Final newline: PRESENT
- `git diff --check`: PASS
- Code modified: NO
- Migration implemented and verified: YES
- Commit created: NO
