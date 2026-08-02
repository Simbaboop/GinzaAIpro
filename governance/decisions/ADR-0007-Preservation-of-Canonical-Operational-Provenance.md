# ADR-0007 — Preservation of Canonical Operational Provenance

**Status:** Accepted

# Decision Question

Which provenance attributes must be preserved across operational artifacts to
ensure deterministic processing, complete traceability, organizational
isolation, and governance compliance?

# Context

DISC-0007 — Organization Boundary Provenance established that:

- `organizationId` originates at `CaptureInput`;
- `BusinessSignal` is the first canonical domain artifact preserving it;
- Organization identity is first lost at the transition from
  `OperationalCondition` to `OperationalLeakage`;
- HCES-0007A requires deterministic Organization compatibility across multiple
  `OperationalRecommendation` artifacts; and
- supplying Organization identity separately to downstream engines would
  violate ADR-0006 and the deterministic architecture defined by HCES-0000.

The immediate defect is missing `organizationId` propagation.

The broader architectural issue is that immutable operational provenance is
being discarded after it enters the operational-intelligence pipeline.

Opaque artifact identifiers and `traceId` do not provide an authoritative or
reversible Organization relationship. Recovering ownership through repository
lookup or caller-supplied context would make deterministic processing depend on
information outside the canonical artifact.

# Decision

Establish **Canonical Operational Provenance** as an architectural invariant.

Canonical Operational Provenance is immutable contextual identity required
for:

- deterministic downstream processing;
- organizational isolation;
- compatibility checks;
- auditability; and
- complete artifact lineage.

Canonical Operational Provenance is distinct from the operational state
represented by an artifact.

Once a required provenance attribute enters the operational reasoning
pipeline, downstream operational artifacts shall preserve it unless removal is
explicitly authorized by a future ADR.

# Initial Provenance Attribute

The initial required Canonical Operational Provenance attribute is:

- `organizationId: Identifier`

No generalized scope object is introduced.

No additional provenance attributes are introduced by this ADR.

# Required Propagation

`organizationId` shall be preserved through:

```text
CaptureInput
     ↓
BusinessSignal
     ↓
OperationalCondition
     ↓
OperationalLeakage
     ↓
OperationalLeakagePriority
     ↓
OperationalRecommendation
     ↓
ExecutionPlan
     ↓
ExecutionEvent
     ↓
ObservedOutcome
```

This ADR immediately governs only artifacts and implementations that currently
exist or are being specified.

Future artifacts shall apply the invariant when implemented.

Existing Evidence and Evidence Semantics Organization requirements remain in
force. This propagation statement does not remove or weaken intermediate
canonical ownership boundaries.

# Domain Rule

Each affected artifact shall directly contain immutable `organizationId`.

The field shall:

- be required;
- use the canonical `Identifier` type;
- be validated consistently with existing identifier fields;
- participate in defensive copying and immutability guarantees where
  applicable; and
- remain unchanged as the artifact moves downstream.

Do not introduce:

- `OperationalScope`;
- `TenantScope`;
- generalized provenance objects;
- repository lookups; or
- context side channels.

A broader scope abstraction requires evidence and a separate architectural
decision.

# Engine Rule

Every deterministic engine producing an affected downstream artifact shall
copy `organizationId` from its canonical input artifact.

Engines shall not:

- derive Organization identity from mutable state;
- accept Organization identity as an unrelated side-channel parameter;
- query repositories to recover it;
- infer it from `traceId`; or
- silently combine artifacts from different Organizations.

Multi-input engines shall reject Organization-incompatible inputs through
governed failures.

Explicit engine context may validate that artifact ownership matches the
invocation boundary, but it shall not become the factual source used to repair
a missing artifact field.

# Relationship to Existing Decisions

This ADR extends:

- ADR-0005 — Released Rule Boundary; and
- ADR-0006 — Priority Artifact Completeness.

It does not supersede either decision.

ADR-0006 governs downstream artifact completeness.

ADR-0007 governs preservation of canonical contextual identity throughout the
operational lifecycle.

ADR-0005 continues to require lifecycle filtering before deterministic engine
invocation. Preservation of Organization provenance does not add lifecycle
responsibility to engines.

ADR-0004 — Legacy PriorityProfile Compatibility remains unchanged. This
decision applies to `OperationalLeakagePriority` and does not modify, migrate,
or deprecate the legacy `PriorityProfile` contract.

# Alternatives Considered

## Add `organizationId` only to `OperationalRecommendation`

Rejected.

`RecommendationRuleEngine` would require an external Organization input
because its source artifact lacks the field.

That would create a prohibited side channel.

## Add `organizationId` beginning at `OperationalLeakagePriority`

Rejected.

Organization identity is already lost at:

```text
OperationalCondition → OperationalLeakage
```

Beginning at Priority would repair only part of the provenance chain and would
force prioritization to obtain Organization from outside its canonical Leakage
input.

## Derive Organization identity from `traceId`

Rejected.

Trace identity and Organization identity serve different semantic purposes.

No current governance establishes a reversible or authoritative mapping.

## Introduce a generalized governed scope object

Deferred.

Current requirements justify only one required provenance field.

The abstraction would violate the Minimum Complexity Doctrine without
additional evidence.

# Consequences

## Positive

- complete Organization lineage;
- deterministic multi-recommendation compatibility;
- stronger cross-Organization isolation;
- no hidden runtime inputs;
- improved auditability;
- alignment with ADR-0006; and
- support for ExecutionPlan planning boundaries.

## Costs

- revisions to existing domain constructors and tests;
- engine propagation changes;
- fixture updates;
- identity and schema-version review; and
- revisions to affected specifications and verification artifacts where
  required.

## Risks

- incomplete migration could leave one artifact or engine dropping
  Organization identity;
- tests could pass locally while fixtures omit meaningful
  Organization-boundary cases;
- deterministic identity could remain collision-prone if Organization
  participation is not reviewed;
- future developers could incorrectly treat `traceId` as Organization
  identity; and
- Tenant and Organization terminology could be conflated without a separate
  mapping decision.

These risks shall be controlled through end-to-end propagation, isolation,
identity, and compatibility tests.

# Repository Impact

Repository inspection confirms:

- `CaptureInput`, `BusinessSignal`, Evidence, and `OperationalCondition`
  already contain direct `organizationId`;
- `OperationalLeakage`, `OperationalLeakagePriority`, and
  `OperationalRecommendation` currently omit it;
- `RecommendationRuleEngine` currently materializes
  `OperationalRecommendation` from a priority artifact that lacks Organization
  identity;
- no Capability 004 or Capability 005 engine currently exists in
  `packages/engines`; and
- the existing legacy `ExecutionPlan` already contains `organizationId`, but it
  is not an implementation of the new HCES-0007 planning capability.

This ADR does not authorize implementation by itself beyond the Required
Follow-up sequence.

# Required Follow-up

After acceptance:

1. revise affected HCES documents where Organization provenance is normative;
2. update existing domain contracts:
   - `OperationalLeakage`;
   - `OperationalLeakagePriority`; and
   - `OperationalRecommendation`;
3. retain the existing `OperationalCondition.organizationId`; add no duplicate
   field or replacement abstraction;
4. update affected deterministic engines to propagate the field;
5. update constructors, fixtures, tests, exports, and compiled runtime
   assertions;
6. verify complete propagation from the earliest implemented source artifact
   through `OperationalRecommendation`;
7. verify same-Organization acceptance and cross-Organization rejection at
   every multi-input boundary;
8. review Organization participation in deterministic artifact identity and
   schema-version migration; and
9. refine and accept HCES-0007A after the blocker is removed.

Do not implement the HCES-0007 `ExecutionPlan` capability yet.

Future `ExecutionEvent` and `ObservedOutcome` artifacts shall adopt Canonical
Operational Provenance when they are separately specified and implemented.

# Validation

- ADR structure and required sections: PASS
- Document formatting and whitespace checks: PASS
- Trailing whitespace: NONE
- Final newline: PRESENT
- `git diff --check`: PASS
- Code modified: NO
- Existing HCES, VVR, Release Record, discovery report, or ADR modified: NO
- Commit created: NO
