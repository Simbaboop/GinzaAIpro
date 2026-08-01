# HCES-0004

Operational Conditions → Operational Leakage

**Status:** Accepted

# Capability

Capability 004

# Governing Question

What economically or operationally material leakage exists as a deterministic
consequence of one or more Operational Conditions?

# Definition

Operational Leakage is an immutable, deterministic, evidence-backed
representation of an economically or operationally material loss,
inefficiency, risk, or unrealized opportunity derived from one or more
Operational Conditions under a governed rule set.

Operational Leakage describes the governed consequence of operational state.
It does not establish relative importance, propose a response, or authorize an
action.

# Input State

`OperationalCondition[]`

All `OperationalCondition` artifacts must be valid, immutable, and traceable.

The input collection is a closed evaluation boundary for one deterministic
invocation. Capability 004 consumes those artifacts without modifying them or
repeating Capability 003 responsibilities.

# Output State

`OperationalLeakage[]`

Each `OperationalLeakage` represents exactly one governed leakage.

The output may contain multiple leakage artifacts when distinct released rules
are satisfied. Every output must retain lineage to the operational conditions
that established it.

# Transformation

Evaluate `OperationalCondition` artifacts against released leakage rule sets.

Materialize `OperationalLeakage` only when rule predicates are satisfied.

If no predicates are satisfied, return an empty result.

Capability 004 performs no prioritization.

Evaluation order, predicate behavior, and emitted results must be governed by
the released rule-set version. Equivalent admissible inputs evaluated under
the same released rules must produce equivalent outputs.

# Admissibility

Inputs must:

- originate from Capability 003;
- have stable identity;
- preserve traceability; and
- satisfy rule prerequisites.

Otherwise return a governed failure.

Admissibility is evaluated before leakage materialization. Invalid or
untraceable operational conditions must not be silently ignored when they
affect the evaluation boundary.

# Leakage Categories

The specification shall support, without requiring different object types:

- Revenue
- Cost
- Capacity
- Time
- Compliance
- Quality
- Customer Experience
- Opportunity
- Risk

Categories are metadata, not subclasses.

A category identifies the analytical character of a leakage. It does not
change the canonical object type or authorize category-specific inheritance
hierarchies.

# Invariants

`OperationalLeakage` must preserve:

- immutability;
- deterministic replay;
- identity stability;
- traceability;
- rule version; and
- evidence references.

Capability 004 shall never:

- assign business priority;
- estimate ROI;
- recommend actions;
- authorize execution;
- modify `OperationalCondition`; or
- invoke AI reasoning.

These constraints preserve the boundary between descriptive leakage and the
downstream capabilities responsible for prioritization, recommendation,
planning, and execution.

# Canonical Operational Provenance

Each `OperationalLeakage` must directly contain immutable `organizationId: Identifier` copied unchanged from its source `OperationalCondition` artifacts.

All input conditions within one evaluation boundary must belong to the same Organization. Organization-incompatible inputs return `RejectedInput` and produce no leakage.

Organization identity must not be inferred from `traceId`, recovered through repository lookup, or supplied as an unrelated side-channel parameter.

This requirement implements ADR-0007 — Preservation of Canonical Operational Provenance.

# Identity

`OperationalLeakage` identity consists of:

- leakage id;
- schema version;
- rule version;
- trace id;
- source `OperationalCondition` ids; and
- leakage category.

Identity material must be canonical and replay-safe. Input ordering that is not
semantically meaningful must not cause identity drift.

# Failure Taxonomy

Return one of:

- `RejectedInput`
- `RuleConflict`
- `ValidationFailure`
- `InsufficientEvidence`
- `SystemFailure`

A governed failure produces no invalid or partially canonical leakage
artifact. Failure reporting must retain sufficient traceability for review
without changing source operational conditions.

# AI Participation

AI may assist in authoring leakage rules.

Runtime execution is deterministic.

AI never creates `OperationalLeakage` directly.

Rules assisted by AI remain subject to the same governance, release, version,
and validation requirements as rules authored without AI assistance.

# Validation

Capability is accepted when:

- identical admissible inputs evaluated under the same released rules produce equivalent leakage;
- deterministic replay succeeds and identity remains stable;
- every output preserves source-condition lineage, traceability, rule provenance, and immutable `organizationId`;
- Organization-incompatible inputs are rejected without partial canonical output; and
- applicable domain-contract, public-export, typecheck, build, focused-test, and repository-test verification passes; engine verification becomes mandatory when a Capability 004 runtime engine is implemented.

# Repository Materialization

- `packages/domain/src/intelligence/OperationalLeakage.ts`
- `packages/domain/src/intelligence/index.ts`
- `packages/domain/tests/operational-leakage.test.ts`

The domain contract was implemented in commit `770f1bf`. Recording its repository location does not establish HCES acceptance or capability release. No Capability 004 runtime engine currently exists.

# COSMOS Mapping

```text
Operational State
       ↓
Operational Loss
       ↓
Quantifiable Outcome
```

# HCOD / HCIS

Capability 004 performs no constitutional reasoning.

It is descriptive and deterministic.

# Notes

Priority, recommendations, planning, execution, and optimization are downstream
capabilities and are explicitly outside the scope of Capability 004.
