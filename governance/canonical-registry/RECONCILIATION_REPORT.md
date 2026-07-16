# Project Canon Reconciliation Report

Date: 2026-07-15

## Outcome

Project Canon established and closed one traceable registry without modifying historical source documents. The closed registry contains 25 registered rules, 9 decision entries, 4 deprecation/history entries, 15 terminology entries, 5 resolved conflicts, and no open conflicts.

## Classification summary

- **Active:** constitutional constraints, accepted ADR-0001/0002, accepted closure decisions DEC-0008/0009, canonical architecture rules, canonical specifications in their stated scopes, and compatible implementation-local contracts.
- **Extended:** the capture-first rule, canonical lifecycle, Observation/OKG scope, and separate Execution model.
- **Amended:** governance/orchestration phase boundaries and the platform/human authority boundary, through DEC-0008 and DEC-0009.
- **Absorbed:** legacy `decisions/0001_Capture_First_Architecture.md` into the canonical ADR-0001 while preserving its dated consequences.
- **Retired:** empty ADR placeholders and zero-length README/decision documentation; they carry no operative rule.
- **Superseded, Deprecated, Rejected:** no repository evidence justified applying these classifications to an operative rule or accepted decision.

## Source inventory — governing and architectural

| Source | Classification | Canonical contribution |
|---|---|---|
| `SAOP.md` | Active | Constitution, non-negotiable rules, governing order |
| `ROADMAP.md` | Active (planning scope) | Build sequencing; not architecture authority |
| `decisions/0001_Capture_First_Architecture.md` | Absorbed | Legacy accepted duplicate of ADR-0001; dated implementation consequences retained |
| `docs/architecture/adr/ADR-0001-Capture-First.md` | Active | Accepted capture-first decision |
| `docs/architecture/adr/ADR-0002-Signal-Driven-Architecture.md` | Active | Accepted signal-driven decision |
| `docs/architecture/adr/ADR-0003` through `ADR-0006` | Retired | Empty placeholders, no decisions |
| `docs/architecture/README.md` | Active | Declares canonical architecture scope and ADR location |
| `ARCHITECTURE_PRINCIPLES.md` | Active | 15 canonical principles |
| `DEPENDENCY_RULES.md` | Active | Dependency direction, subsystem prohibitions, exception protocol |
| `LAYERED_ARCHITECTURE.md` | Active | Layer responsibilities and downward dependencies |
| `INFORMATION_FLOW.md` | Active | Full operational lifecycle and stage responsibilities |
| `SUBSYSTEMS.md` | Active | Stable subsystem ownership boundaries |
| `NAMING_CONVENTIONS.md` | Active | Descriptive naming and responsibility vocabulary |
| `CANONICAL_PATTERNS.md` | Active | Ten reusable patterns and ADR requirement for architectural changes |
| `architecture/01_Capture_and_Observability.md` | Extended | Early capture/observability model extended by accepted ADR and canonical flow |
| `architecture/02_Operational_Intelligence.md` | Extended | Early non-execution and intelligence scope elaborated by Cognition architecture |
| `architecture/03_Governance_Architecture.md` | Active | Governance gates, human authority, audit, and non-bypass rule |
| `architecture/04_Execution_Architecture.md` | Extended | Execution boundary extended by tracking/aggregate specs |
| `architecture/05_Observation_Data_Model.md` | Extended | Observation schema extended by aggregate/event/graph specifications |
| `architecture/06_Observation_Aggregate.md` | Extended | Canonical Observation aggregate retained in scoped relationship to OKG |

## Source inventory — product specifications

| Sources | Classification | Notes |
|---|---|---|
| `docs/01_GinzaAIpro_MVP_Definition.md` | Active (MVP scope) | Complete operational loop and non-goals |
| `docs/02_Observation_Object.md` through `docs/07_Workflow_State_Model.md` | Extended | Observation, lifecycle, ownership, next action, workflow, and state model; later aggregates add detail |
| `docs/08_Execution_Tracking_Specification.md`, `docs/09_Execution_Aggregate.md` | Active | Separate execution and evidence-based verification model |
| `docs/10_Operational_Event_Model.md` | Active | Normalized immutable events and reconstructable history |
| `docs/11_Operational_Knowledge_Graph.md` | Active | Explicit canonical v1.0 graph model and invariants |
| `apps/.../business-recommendations/CAPABILITY_SPEC.md` | Active (capability scope) | Explicit canonical capability contract |
| `apps/.../revenue-leakage/CAPABILITY_SPEC.md` | Active (capability scope) | Explicit canonical capability contract |
| `apps/.../capabilities/revenue-leakage/README.md` | Active (capability scope) | Completeness law and governed capability flow |

## Source inventory — implementation README contracts

The following non-empty README files are **Active in their directory scope** and subordinate to canonical architecture: `business-recommendations`, `features`, `features/capture`, `features/executive-cockpit`, `operational-cognition`, `operational-evidence`, `operational-health`, `operational-knowledge-graph`, `operational-memory`, `operational-nervous-system`, `platform/ai`, `platform/ai/discovery`, `platform/capabilities`, `platform/execution`, `platform/learning`, `platform/workforce`, `revenue-leakage`, `runtime/core`, `shared/intelligence`, `shared/ui`, and `shared/ui/Card`.

The generated Next.js `apps/ginzaaipro-dashboard/README.md` is **Active only as tooling guidance** and has no governance authority.

The following are **Retired as rule evidence because they are empty**: root `README.md`, root `DECISIONS.md`, `operational-journeys/README.md`, `platform/business-physics/docs/{README,BUSINESS_PHYSICS_LAWS,SIMULATION_ENGINE,VALIDATION_PROTOCOL}.md`, `platform/business-physics-engine/docs/README.md`, and `platform/operational-intelligence/runtime/README.md`. Files remain in place.

## Duplicates and absorbed material

1. Two accepted ADR-0001 files express the same capture-first decision. The `docs/architecture/adr/` version is the active decision because the canonical architecture README declares that ADR location; the legacy dated file is absorbed, not deleted.
2. Capture-first, governance-before-execution, evidence, explainability, append-only memory, and downward-dependency rules repeat across constitutional, canonical, and subsystem documents. These are reinforcing duplicates; the register cites the highest-authority statement and retains compatible elaborations.
3. Revenue Leakage and Business Recommendations appear in more than one package path. Their contracts are compatible but package ownership/migration is not explicitly decided; the registry does not infer a supersession.

## Architectural evolution

- The early Observation-centric architecture is extended by separate Operational Event, Execution Aggregate, and Operational Knowledge Graph models. Links remain through traceability rather than treating newer nouns as deletion of Observation.
- The short constitutional lifecycle is extended by the canonical architecture lifecycle with Evidence, Signals, Memory, Health, Cognition, Orchestration, Verification, and Learning.
- Implementation-local runtime and capability contracts specialize canonical architecture but do not outrank it.

## Terminology drift

The terminology register resolves or flags Event vs Operational Event, Event vs Signal, Runtime Health vs Operational Health, Operational Intelligence vs Operational Cognition, Observation vs Evidence vs OKG, Execution fields vs Execution Aggregate, and orchestration naming. No source was rewritten.

## Conflict closure

No human decisions remain outstanding.

1. **CON-0004 — resolved by DEC-0008:** pre-governance Orchestration may prepare, sequence, simulate, and propose. Material execution orchestration begins only inside an explicitly approved governance envelope; after approval it coordinates the authorized execution plan.
2. **CON-0005 — resolved by DEC-0009:** human constitutional authority governs platform purpose, policy changes, critical exceptions, irreversible actions, and risk limits. Deterministic platform policy has only explicitly delegated routine authority. Mandatory safety, compliance, tenant-isolation, audit, and constitutional controls are non-bypassable. Emergency override is authorized, scoped, time-bound, justified, and immutably audited.

Both conflict rows retain their original issue and prior open-state history in the Conflict Register.

## Preservation statement

No historical source was deleted, moved, or overwritten. All reconciliation changes are confined to `governance/canonical-registry/`.
