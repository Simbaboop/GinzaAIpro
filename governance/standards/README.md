# Canonical Governance Standards

**Version:** 1.0.0
**Status:** Accepted

## Purpose of CGS

Canonical Governance Standards (CGS) define the common controls used to
govern GinzaAIpro capabilities. They establish repeatable requirements for
capability progression, verification, validation, release, and controlled
change.

CGS documents govern process and evidence. They SHALL NOT define business
capability semantics, replace architectural decisions, or introduce runtime
behavior. A CGS MUST remain capability-neutral unless its stated scope
explicitly requires otherwise.

The initial standards are:

- `CGS-0001` — capability governance and lifecycle;
- `CGS-0004` — verification and validation; and
- `CGS-0005` — release governance.

The numbering does not imply that additional standards exist. New CGS
documents MUST NOT be created without demonstrated governance need and
explicit authorization.

## Relationship to ADR and HCES

The Platform Constitution outranks every CGS. A CGS defines how governed work
proceeds within constitutional constraints.

An Architecture Decision Record (ADR) answers an architectural decision
question and records the accepted choice, rationale, consequences, and
migration impact. A CGS SHALL NOT make a capability-specific architectural
decision in place of an ADR.

An HCES defines a normative capability or engineering contract. It specifies
responsibilities, boundaries, invariants, deterministic behavior, failures,
and acceptance criteria. A CGS SHALL NOT duplicate or reinterpret those
semantics.

The relationship is:

```text
CGS defines the governance controls
ADR records an architectural decision
HCES specifies the accepted contract
Implementation materializes the contract
VVR verifies conformance
RR establishes release state
```

When an ADR or HCES conflicts with a higher-authority source, the conflict MUST
be resolved before implementation or release. A narrower source MAY add
requirements within its scope but MUST NOT weaken a governing standard.

## Versioning

Every CGS SHALL include an explicit version and status. Versions SHALL follow
semantic versioning:

- **Major** versions contain incompatible governance changes.
- **Minor** versions add compatible requirements or materially clarify scope.
- **Patch** versions correct wording without changing governed meaning.

Accepted versions are immutable historical records. An amendment SHALL create
a new version or an explicitly traceable revision. Governance meaning MUST NOT
change through silent edits.

A superseding version SHALL identify the version it replaces and any
transition requirements. Existing releases remain governed by the standards
recorded in their release evidence unless a separately governed migration
applies a later standard.

## Governance Ownership

Canonical Governance Standards are owned by the platform's authorized human
governance authority. Engineering teams and automated systems MAY propose
changes, provide evidence, and verify mechanical conformance. They MUST NOT
independently accept, waive, or supersede a CGS.

Ownership includes responsibility to:

- maintain clear scope and terminology;
- review amendments against the Platform Constitution;
- prevent duplicate or competing standards;
- preserve historical versions and acceptance evidence;
- resolve cross-standard conflicts; and
- ensure requirements remain proportionate under the Minimum Complexity
  Doctrine.

Exceptions to an accepted CGS MUST be explicit, evidence-based, scoped, and
approved by the authorized governance authority. An exception SHALL NOT be
inferred from implementation convenience or historical code.

## Use

Authors and reviewers SHALL apply only the standards relevant to the current
governance stage. They SHOULD link evidence rather than repeat it. Where a
standard leaves a capability-specific choice open, the choice SHALL be made in
an ADR or HCES at the appropriate authority level.
