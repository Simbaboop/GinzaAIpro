# CGS-0005 — Release Governance Standard

**Version:** 1.0.0
**Status:** Accepted

## Purpose

This standard defines when a GinzaAIpro capability may be released, what its
Release Record must contain, how the released baseline is frozen, and how that
baseline may later change.

Release is a governance decision. A successful build, completed
implementation, or merged change SHALL NOT independently establish release.

## Release Criteria

A capability is eligible for release only when:

1. the governing ADRs and HCES documents are accepted and versioned;
2. implementation scope and canonical ownership are explicit;
3. the required VVR exists and records PASS or an explicitly permitted
   CONDITIONAL PASS;
4. architecture, dependency, provenance, identity, and immutability
   requirements conform;
5. required public exports and package boundaries are verified;
6. known limitations and deferred work are recorded;
7. no unresolved implementation, security, integrity, tenant-isolation, or
   governance blocker remains; and
8. an authorized human release decision is recorded.

PASS is the normal release prerequisite.

A CONDITIONAL PASS MAY support only a conditional internal release when the
missing evidence is environmental, bounded, reproducible, and unrelated to an
observed implementation defect. The RR MUST state the restriction and the
exact evidence required for full or production promotion.

A FAIL disposition MUST block release. A release record SHALL NOT override or
reinterpret a VVR disposition.

## Release Record Contents

Every RR SHALL include:

- release identifier, status, date, capability, and release type;
- concise release purpose and decision;
- governing Constitution, CGS, ADR, and HCES references with versions;
- included domain contracts, engines, packages, and public exports;
- verification reports and their dispositions;
- exact summary of tests, typechecks, builds, and integrity checks;
- known limitations and environmental constraints;
- intentionally deferred work and explicit non-goals;
- compatibility and migration state;
- the released architecture or pipeline position;
- the baseline freeze declaration;
- conditions for production promotion, when conditional; and
- authorized next work, if any.

The RR MUST report evidence accurately. It SHALL NOT claim that blocked,
skipped, or unexecuted validation passed. It SHOULD link to source evidence
instead of duplicating lengthy specifications.

An RR records history. It MUST NOT introduce a new capability requirement,
architectural decision, or implementation behavior.

## Release States

Release status SHALL be explicit. The repository MAY use established labels
such as `Released`, `Conditionally Released`, or `Not Released`, provided their
meaning is unambiguous.

- **Released** requires a PASS verification disposition and completed release
  criteria.
- **Conditionally Released** requires an eligible CONDITIONAL PASS, explicit
  restrictions, and a named closure condition.
- **Not Released** applies when criteria are incomplete or any blocker remains.

Conditional release MUST NOT be represented as production readiness unless
the RR explicitly authorizes production under the documented conditions.

## Baseline Freeze

Acceptance of an RR freezes the released baseline identified by that record.
The baseline includes, as applicable:

- canonical public contract names and semantics;
- package ownership and dependency direction;
- identity and serialization behavior;
- provenance and trace requirements;
- governed failure codes and precedence;
- public exports;
- accepted tests and verification evidence;
- governing ADR and HCES versions; and
- compatibility or migration commitments.

Frozen does not mean permanently unchangeable. It means changes MUST follow
governance and MUST remain traceable to a later accepted decision,
specification, verification, and release.

Released artifacts SHALL NOT be silently rewritten. Historical RRs and VVRs
MUST remain available. Corrections to release history SHALL use an explicit
revision or superseding record.

## Change Governance

A proposed change to a released baseline SHALL first be classified.

### Compatible implementation correction

A correction that preserves accepted semantics MAY proceed under the existing
architecture and a narrowly revised implementation authorization. It MUST be
reverified and recorded in a new or revised release record when release
evidence changes.

### Compatible contract extension

An additive public-contract change requires specification acceptance,
consumer-impact review, verification, and a new release record. An ADR is
required when ownership, boundaries, or architecture change.

### Breaking or semantic change

A breaking change, canonical rename, altered identity, changed provenance,
changed dependency direction, or semantic redefinition MUST use an accepted
ADR and revised HCES. Migration and compatibility consequences SHALL be
explicit before implementation.

### Deprecation or removal

Deprecation and removal MUST identify affected consumers, compatibility
period, migration path, verification, and final removal authority. Historical
meaning SHALL remain traceable.

## Release Integrity

Release governance SHALL preserve the Minimum Complexity Doctrine. A release
MUST NOT add infrastructure, compatibility layers, or governance artifacts
solely to appear complete.

Release approval MUST remain human-accountable. Automated checks MAY establish
evidence and enforce mandatory controls, but SHALL NOT independently waive a
failed requirement, accept a governance artifact, or authorize production
promotion.

After release, the next capability or migration MAY begin only within its own
explicit authorization. Release of one stage SHALL NOT implicitly authorize
downstream implementation.
