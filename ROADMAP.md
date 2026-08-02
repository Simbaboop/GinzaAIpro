# GinzaAIpro Development Roadmap v1.0

Last reconciled: 2026-08-02

## Authority and Use

This roadmap is planning material only. It does not authorize architecture, implementation, release, deployment, production use, or modification of protected contracts.

All governed work requires the applicable accepted Constitution, Canonical Governance Standards, ADR, specification, implementation authorization, verification evidence, and Release Record. Roadmap position, capability numbering, existing code, or completed tests do not independently authorize work.

## Current Canonical Baseline

- **Capability 001 — Canonical Evidence Foundation:** Released as `capability-001-v1.0.0`.
- **Capability 002 — Evidence Semantics:** Authorized for implementation by `E2-001-R2`; implementation, verification, certification, release, tagging, and deployment remain separate boundaries.
- **Capabilities 003–010:** Implemented and verified through accepted PASS records, but not released because no tracked accepted Release Records exist.
- **Capabilities 004 and 005:** Verified domain contracts; no runtime engines exist.
- **Platform governance:** Platform Constitution v1.0 and CGS-0001, CGS-0004, and CGS-0005 are active.

## Current Milestone — Capability 002 Evidence Semantics

### Objective

Implement the minimum deterministic Evidence Semantics capability that projects predicates and canonical values already expressed by released Evidence components into immutable Semantic Facts with complete lineage and resolution accountability.

The implementation must not create new meaning.

### Authorized Scope

- Create `packages/evidence-semantics`.
- Publish `@ginzaaipro/evidence-semantics`.
- Implement the public contracts frozen by SAS-0002B.
- Implement `resolveEvidenceSemantics(input)`.
- Implement only the frozen rules `ES-001@ES-001:v1` and `ES-002@ES-002:v1`.
- Produce exactly one `RESOLVED`, `NOT_APPLICABLE`, or `UNRESOLVED` accountability record for every Evidence component.
- Preserve deterministic identity, ordering, diagnostics, immutability, provenance, and fail-closed behavior.
- Add only the package, tests, fixed vectors, exports, and minimum workspace integration authorized by E2-001-R2.

### Protected Baseline

Capability 001 contracts, behavior, identity construction, tests, vectors, release tag, Capture behavior, and Validation behavior must remain unchanged.

### Prohibited Scope

No graph, ontology, taxonomy, aliasing, diagnosis, leakage, priority, recommendation, ranking, forecasting, AI, embeddings, persistence, networking, API, UI, orchestration, probabilistic confidence, or speculative infrastructure is authorized.

## Governed Delivery Sequence

1. Implement Capability 002 strictly within `E2-001-R2`.
2. Execute package, Domain, Validation, and complete workspace verification.
3. Stop at `READY_FOR_EVR-0002`, `STOPPED_FOR_GOVERNANCE`, or `IMPLEMENTATION_INCOMPLETE`.
4. Perform EVR-0002 only under separate authorization.
5. Perform ACR-0002 only under separate authorization.
6. Make any release, tag, deployment, or production decision through a separate human-accountable Release Record.
7. Select the next capability milestone only after Capability 002 closure and repository reconciliation.

## Platform Outcome Areas

### Evidence and Capture Foundation

Capture, validation, released Evidence contracts, and deterministic semantic resolution.

### Operational Intelligence

Operational conditions, leakage, priority, recommendations, and execution planning. Current Capability 003–007 implementations are verified but not released.

### Governed Runtime and Observation

Runtime admission, execution events, and observed outcomes. Current Capability 008A–009 implementations are verified but not released.

### Deterministic Verification

Evidence-backed verification of bounded observed outcomes. Capability 010 is verified but not released.

### Productization and Interfaces

Dashboards, intake workflows, persistence, integrations, user experiences, and operational deployment require future governed authorization.

### Workflow Automation and Digital Workforce

Future governed capabilities include workflow automation, governed task and process orchestration, and the creation, coordination, supervision, evaluation, and revocation of digital employees operating within explicit human authority, policy, verification, audit, security, and accountability boundaries.

This roadmap inclusion defines product direction only. It does not authorize autonomous execution, agent deployment, workflow-runtime implementation, or production use.

### Extension Framework

Revenue Leak Audit, Business Health, voice facilitation, ZOOS integration, Chisimbiso Core integration, and other extensions remain future planning areas unless separately governed and authorized.

## Status Vocabulary

- **Planned:** Identified in planning material only.
- **Authorized:** Explicit accepted implementation authorization exists.
- **Implemented:** Code exists within authorized scope.
- **Verified:** Accepted verification evidence records PASS or an eligible governed disposition.
- **Released:** A tracked accepted Release Record establishes human-accountable release authority.

## Immediate Next Action

Complete and merge this roadmap reconciliation, then create a dedicated Capability 002 implementation branch and execute `E2-001-R2` without expanding scope.

## Long-Term Vision

Operational Intelligence and Governance Infrastructure for AI-mediated organizations.
