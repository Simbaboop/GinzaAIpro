# HCES-0005

Operational Leakage → Operational Leakage Priorities

**Status:** Accepted

# Capability

Capability 005

`OperationalLeakage[]` → `OperationalLeakagePriority[]`

# Governing Question

Given one or more `OperationalLeakage` artifacts, which deserve attention first
under the organization's governed prioritization policy?

# Definition

`OperationalLeakagePriority` is an immutable, deterministic, evidence-backed
representation of the relative business importance of an `OperationalLeakage`
under a released prioritization policy.

`OperationalLeakagePriority` never recommends action.

It only establishes governed priority.

Priority is therefore a policy-derived description of relative importance. It
does not prescribe a remedy, allocate capacity, or authorize work.

# Compatibility

A released domain contract named `PriorityProfile` already exists.

Capability 005 shall not replace, modify, or migrate that contract.

`OperationalLeakagePriority` is introduced as a distinct canonical contract to
preserve backward compatibility.

Migration or deprecation of the existing `PriorityProfile` requires a separate
ADR and consumer-impact review.

# Input State

`OperationalLeakage[]`

All `OperationalLeakage` artifacts must be valid, immutable and traceable.

All artifacts within one comparison boundary must belong to the same Organization.

Each input must provide immutable `organizationId` and originating leakage `category` directly. Missing provenance or category must not be repaired through inference, repository lookup, or supplemental runtime fields.

The input collection establishes the complete comparison boundary for an
invocation. Capability 005 consumes the leakage artifacts without modifying
them or repeating Capability 004 responsibilities.

# Output State

`OperationalLeakagePriority[]`

One `OperationalLeakagePriority` corresponds to exactly one
`OperationalLeakage`.

Every admissible input must have one attributable output. An
`OperationalLeakagePriority` retains the policy and rule lineage required to
reproduce its governed priority.

Every output preserves the source leakage `organizationId` and originating leakage `category` as canonical downstream facts.

# Transformation

Evaluate `OperationalLeakage` artifacts against released prioritization rules.

Materialize an `OperationalLeakagePriority` for every admissible
`OperationalLeakage`.

No AI reasoning.

No optimization.

No execution.

Equivalent admissible leakage inputs evaluated under the same released policy
and rules must produce equivalent priority outputs.

# Admissibility

Inputs must:

- originate from Capability 004;
- preserve traceability;
- preserve immutable organization provenance;
- preserve the originating leakage category;
- belong to one same-Organization comparison boundary;
- have stable identity; and
- satisfy released prioritization rules.

Otherwise return a governed failure.

Admissibility must be established before a canonical
`OperationalLeakagePriority` is materialized. Invalid inputs must not be
silently omitted from a comparison boundary when their omission could change
relative priority.

# Priority Dimensions

The capability may evaluate:

- Economic Impact
- Customer Impact
- Operational Impact
- Compliance Impact
- Strategic Alignment
- Urgency
- Frequency
- Detectability
- Recoverability

Dimensions are governed policy inputs.

They are not recommendations.

The released policy determines which dimensions apply, their interpretation,
and their deterministic contribution to priority.

# Priority Levels

Support the following canonical levels:

- Critical
- High
- Medium
- Low
- Informational

Levels are metadata.

Not subclasses.

A level communicates governed relative importance without introducing a
different domain type or implying an action.

# Invariants

`OperationalLeakagePriority` must preserve:

- immutability;
- deterministic replay;
- traceability;
- immutable organization provenance;
- originating leakage category;
- rule identity;
- policy version; and
- identity stability.

Capability 005 shall never:

- recommend remediation;
- estimate ROI;
- schedule work;
- allocate resources;
- invoke AI reasoning;
- modify `OperationalLeakage`; or
- recover missing provenance or category through lookup, inference, or side-channel input.

These constraints keep priority separate from recommendation, planning,
optimization, and execution.

# Identity

`OperationalLeakagePriority` identity consists of:

- `operationalLeakagePriorityId`;
- `organizationId`;
- `schemaVersion`;
- `policyId`;
- `policyVersion`;
- `ruleId`;
- `traceId`; and
- `sourceOperationalLeakageId`.

Identity material must remain stable across deterministic replay under the
same released policy and rules.

# Failure Taxonomy

Return one of:

- `RejectedInput`
- `PolicyConflict`
- `RuleConflict`
- `ValidationFailure`
- `SystemFailure`

A governed failure produces no invalid or partially canonical
`OperationalLeakagePriority`. Failure reporting must preserve sufficient
lineage for review.

# AI Participation

AI may assist in designing prioritization policies.

Runtime execution is deterministic.

AI never assigns `OperationalLeakagePriority` artifacts.

Any AI-assisted policy remains subject to organizational approval, release,
versioning, and deterministic runtime application.

# Validation

Capability is accepted when:

- identical leakage inputs produce identical priority outputs;
- replay succeeds;
- traceability is preserved;
- immutable `organizationId` provenance is preserved;
- originating leakage category is preserved and validated;
- policy version is recorded; and
- all repository tests pass.

# Repository Materialization

Domain contract:

- `packages/domain/src/intelligence/OperationalLeakagePriority.ts`

Domain export:

- `packages/domain/src/intelligence/index.ts`

Verification tests:

- `packages/domain/tests/operational-leakage-priority.test.ts`

# COSMOS Mapping

```text
Operational Loss
       ↓
Governed Importance
       ↓
Decision Readiness
```

# HCOD / HCIS

Capability 005 performs no constitutional reasoning.

It applies already-approved organizational policy only.

# Non-Goals

Capability 005 intentionally excludes:

- recommendations;
- execution planning;
- workflow generation;
- scheduling;
- optimization;
- forecasting;
- financial valuation; and
- resource allocation.
