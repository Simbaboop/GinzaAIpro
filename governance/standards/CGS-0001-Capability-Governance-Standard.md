# CGS-0001 — Capability Governance Standard

**Version:** 1.0.0
**Status:** Accepted

## Purpose

This standard defines the minimum governance lifecycle for GinzaAIpro
capabilities. It ensures that capability meaning, authority, implementation
scope, verification, and release remain explicit and traceable.

The standard governs progression. It does not define capability-specific
architecture or behavior.

## Scope

CGS-0001 applies to every new capability and every material evolution of a
released capability, including changes to:

- canonical domain contracts;
- deterministic engines;
- public package APIs;
- package ownership or dependency direction;
- identity, provenance, or serialization semantics;
- governed failure contracts; and
- released behavior or compatibility guarantees.

Purely editorial corrections MAY use a proportionate review when they do not
change normative meaning. A claimed editorial change that alters behavior,
authority, scope, or compatibility SHALL enter the full lifecycle.

## Governing Question

Every capability SHALL answer:

> What governed transformation or responsibility is being introduced, under
> whose authority, with which inputs, outputs, invariants, boundaries, and
> evidence of acceptance?

If that question cannot be answered without inference, the capability MUST
remain in discovery or specification.

## Capability Lifecycle

### 1. Discovery

Discovery SHALL inspect current contracts, consumers, dependencies,
governance, constraints, and migration impact before a material decision is
made. Discovery evidence MUST distinguish facts, inferences, alternatives,
and recommendations.

A discovery artifact is required when current ownership, semantics, consumers,
or compatibility impact cannot be established directly. Discovery SHALL NOT
make an architectural decision.

### 2. Architectural decision

An ADR MUST be created or amended when the capability requires:

- a new canonical concept or owner;
- a material boundary or dependency decision;
- resolution of competing semantics;
- modification of a released architectural invariant; or
- a governed migration from legacy behavior.

An ADR is not required when accepted architecture already determines the
answer and the implementation introduces no new architectural choice.

The ADR MUST be accepted before dependent specifications or implementation
rely on its decision.

### 3. Specification

Every governed capability MUST have an accepted HCES or equivalent canonical
specification before implementation. The specification SHALL define, as
applicable:

- purpose and governing question;
- canonical ownership;
- input and output contracts;
- authoritative field sources;
- invariants and admissibility;
- deterministic identity and serialization;
- failure behavior and precedence;
- package and dependency boundaries;
- explicit non-goals;
- test and acceptance criteria; and
- implementation stop conditions.

The specification MUST NOT delegate material semantics to implementation.

### 4. Acceptance and authorization

Accepted status and implementation authorization MUST be explicit. Draft,
proposed, discovery, or superseded artifacts SHALL NOT authorize
implementation.

Authorization SHALL identify the allowed scope and protected artifacts. It
MUST NOT be inferred from roadmap position, existing code, or a capability
number.

### 5. Implementation

Implementation SHALL conform to the accepted ADRs, HCES, and applicable CGS
documents. It MUST remain within authorized scope and MUST preserve protected
released contracts.

Engineering SHALL stop when implementation would require:

- an ungoverned architectural decision;
- modification outside authorized scope;
- a missing authoritative field source;
- nondeterministic behavior where determinism is required;
- prohibited infrastructure or dependency direction; or
- weakening a normative invariant.

The smallest conforming design SHOULD be used. New abstractions, packages,
services, dependencies, or frameworks MUST have demonstrated need.

### 6. Verification and validation

Implementation SHALL be evaluated under CGS-0004. Verification evidence MUST
be recorded in a VVR or the established equivalent. Failures and environmental
limitations SHALL be reported accurately; unexecuted tests MUST NOT be
reported as passing.

### 7. Release

A capability SHALL be released only under CGS-0005. The RR SHALL identify the
accepted governance, implementation scope, verification disposition,
limitations, deferred work, and frozen baseline.

### 8. Evolution

Released capability meaning MUST NOT change silently. Evolution SHALL use an
accepted amendment, ADR, migration decision, revised specification,
verification, and release evidence as required by the change.

Historical artifacts SHALL remain traceable. Compatibility mechanisms SHOULD
be narrow, explicit, and removable.

## Mandatory Governance Artifacts

The minimum required evidence is:

| Stage | Required artifact or evidence |
| --- | --- |
| Discovery | Discovery report when material facts or ownership are unclear |
| Decision | Accepted ADR when an architectural decision is required |
| Specification | Accepted HCES or canonical equivalent |
| Authorization | Explicit accepted status and implementation scope |
| Implementation | Changed-file record and testable implementation |
| Verification | VVR conforming to CGS-0004 |
| Release | RR conforming to CGS-0005 |

Artifacts MAY be coordinated through an accepted milestone record, but such a
record SHALL NOT replace the source ADR, HCES, VVR, or RR.

## Compliance Requirements

A capability conforms to CGS-0001 only when:

1. governing sources and their versions are identifiable;
2. canonical ownership and dependency direction are explicit;
3. implementation began only after authorization;
4. every material implementation change is within scope;
5. protected contracts remain unchanged unless explicitly authorized;
6. deterministic and provenance requirements are testable;
7. verification evidence is complete and honest;
8. release status is recorded separately from implementation completion; and
9. no unrecorded exception or architectural decision remains.

Non-conformance SHALL block an unconditional PASS and release. A temporary,
non-safety-critical environmental limitation MAY be handled according to
CGS-0004 and CGS-0005, but it MUST remain visible and MUST NOT be described as
successful verification.
