# GinzaAIpro Governance

**Version:** 1.0.0
**Status:** Accepted

## Governance Purpose

GinzaAIpro governance establishes the authority, evidence, boundaries, and
change controls under which platform capabilities are specified, implemented,
verified, and released. Governance exists to keep architectural meaning
explicit, preserve accountability, and prevent implementation from silently
creating policy.

Governance artifacts SHALL be concise, versioned, traceable, and internally
consistent. A lower-authority artifact MUST NOT override a higher-authority
artifact. When authority or meaning is materially ambiguous, work SHALL pause
until the ambiguity is resolved through the existing governance process.

## Governance Hierarchy

The governing hierarchy is:

```text
Platform Constitution
        ↓
Canonical Governance Standards (CGS)
        ↓
Architecture Decision Records (ADR) and HCES Specifications
        ↓
Implementation
        ↓
Verification and Validation Reports (VVR)
        ↓
Release Records (RR)
```

The Platform Constitution defines permanent principles and invariants.
Canonical Governance Standards define how governed work proceeds. ADRs record
accepted architectural decisions. HCES documents define normative capability
and engineering contracts. Implementation materializes accepted contracts.
VVRs record conformance evidence. RRs establish the governed release state.

The canonical registry indexes authority and relationships. It does not form a
new authority layer or replace source artifacts.

## Artifact Relationships

A capability normally follows this evidence chain:

```text
Discovery, when needed
        ↓
ADR, when an architectural decision is required
        ↓
Accepted HCES
        ↓
Authorized implementation
        ↓
VVR
        ↓
RR
```

Discovery records evidence and SHALL NOT make architectural decisions. An ADR
is required only when an architectural choice, conflict, ownership decision,
or governed migration must be resolved. An HCES SHALL define the capability
contract without substituting for an ADR. A VVR SHALL report evidence without
changing the specification. An RR SHALL summarize the released baseline
without redefining it.

Milestone records MAY coordinate acceptance of related artifacts. They SHALL
NOT create a separate governance layer or override the recorded status of
their source artifacts.

## Capability Lifecycle

Every governed capability SHALL move through these states as applicable:

1. **Discovery** — inspect current architecture, contracts, consumers, and
   constraints.
2. **Decision** — resolve material architectural choices through an ADR when
   required.
3. **Specification** — define the normative contract through an HCES.
4. **Acceptance and authorization** — record explicit human acceptance before
   implementation begins.
5. **Implementation** — change only the authorized scope.
6. **Verification** — evaluate conformance under CGS-0004.
7. **Release** — establish and freeze the released baseline under CGS-0005.
8. **Evolution** — use governed amendments or migrations; never silently
   rewrite released meaning.

A capability MUST NOT skip a required state. Evidence MAY show that an ADR is
unnecessary, but acceptance, implementation evidence, verification, and
release controls MUST remain explicit.

## Repository Navigation

- `constitution/` — the ratified Platform Constitution.
- `standards/` — accepted Canonical Governance Standards.
- `adr/` and `decisions/` — architecture decisions retained under established
  repository conventions.
- `discovery/` — evidence and pre-decision analysis.
- `hces/` — normative capability and engineering specifications.
- `vvr/` — verification and validation evidence.
- `releases/` — canonical release records.
- `milestones/` — coordinated governance acceptances where required.
- `canonical-registry/` — authority, rule, terminology, and conflict indexes.

Repository naming conventions SHALL be preserved. Existing locations MUST NOT
be reorganized merely to make governance appear uniform.

## Engineering Principles

Governed engineering SHALL follow these principles:

- Architecture governs implementation.
- Evidence precedes material decisions.
- Deterministic behavior SHALL be preferred for governed transformations.
- Canonical artifacts SHALL be complete for deterministic consumers.
- Organization, trace, rule, policy, and source provenance SHALL NOT be
  silently discarded.
- Canonical domain artifacts SHALL be immutable and auditable.
- Hidden state and side-channel business inputs are prohibited.
- Package boundaries and dependency direction SHALL remain explicit.
- Minimum complexity SHALL control: new layers, abstractions, services, and
  infrastructure require demonstrated need.
- AI MAY assist where authorized but MUST NOT create its own governance or
  execution authority.
- Human accountability for acceptance, policy, exceptions, and release SHALL
  remain explicit.

When a requirement cannot be implemented without inventing architecture,
engineering SHALL stop and return the precise governance gap.
