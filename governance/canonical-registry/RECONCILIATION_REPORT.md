# Project Canon Reconciliation Report

Date: 2026-07-31

## Outcome

Project Canon maintains one traceable registry. After constitutional authority
reconciliation and publication of Platform Constitution v1.0, the registry contains
37 registered rules, 12 decision entries, 9 deprecation/history entries,
17 terminology entries, 6 resolved conflicts, and no open conflicts.

## Classification summary

- **Active:** Platform Constitution v1.0, accepted ADR-0001/0002, accepted decisions DEC-0008/0009/0011/0012, constitutional rules RULE-0028 through RULE-0037, canonical architecture rules, canonical specifications in their stated scopes, and compatible implementation-local contracts.
- **Extended:** the capture-first rule, canonical lifecycle, Observation/OKG scope, and separate Execution model.
- **Amended:** governance/orchestration phase boundaries and the platform/human authority boundary, through DEC-0008 and DEC-0009.
- **Absorbed:** legacy `decisions/0001_Capture_First_Architecture.md` into the canonical ADR-0001 while preserving its dated consequences.
- **Retired:** empty ADR placeholders and zero-length README/decision documentation; they carry no operative rule.
- **Deprecated:** “Business Physics” as a GinzaAIpro platform name and “Operational Intelligence Runtime”; neither was an operative canonical subsystem.
- **Superseded:** SAOP.md v0.1 as the platform's highest constitutional authority; it remains preserved as historical constitutional source material under DEC-0012 and DEP-0009.
- **Rejected:** no repository evidence justified rejecting an operative canonical rule or accepted decision.

## Source inventory — governing and architectural

| Source | Classification | Canonical contribution |
|---|---|---|
| `governance/constitution/PLATFORM-CONSTITUTION.md` | Active — highest authority | Ratified Platform Constitution v1.0; permanent mission, principles, invariants, governance hierarchy, evolution doctrine, AI doctrine, and amendment process |
| `SAOP.md` | Superseded / preserved | Historical constitutional source material; compatible principles remain effective only where incorporated into or consistent with Platform Constitution v1.0 under DEC-0012 and DEP-0009 |
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
| `architecture/rco/RCO-0002-*` | Active | Reconciles retained SAS-0002A with released Capability 001 and bounds Capability 002 |
| `architecture/sas/SAS-0002A-*`, `SAS-0002B-*` | Active (Capability 002 scope) | Retained Evidence Semantics doctrine, resolution accountability, and deterministic resolver contract |
| `architecture/fea/FEA-0002-*` | Active (feasibility evidence) | Records `IMPLEMENTABLE` against the released repository |
| `architecture/irg/IRG-0002-R1-*` | Active (readiness authority) | Records `PASS`, fixed vectors, boundaries, tests, and stop conditions |
| `architecture/execution/E2-001-R2-*` | Active (execution authorization) | Authorizes bounded Capability 002 implementation without release certification |

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
| `apps/.../capabilities/revenue-leakage/README.md` | Absorbed and retired | Compatible completeness criteria moved to the canonical Revenue Leakage capability specification; duplicate source removed |

## Source inventory — implementation README contracts

The following non-empty README files are **Active in their directory scope** and subordinate to canonical architecture: `business-recommendations`, `features`, `features/capture`, `features/executive-cockpit`, `operational-cognition`, `operational-evidence`, `operational-health`, `operational-knowledge-graph`, `operational-memory`, `operational-nervous-system`, `platform/ai`, `platform/ai/discovery`, `platform/capabilities`, `platform/execution`, `platform/learning`, `platform/workforce`, `revenue-leakage`, `runtime/core`, `shared/intelligence`, `shared/ui`, and `shared/ui/Card`.

The generated Next.js `apps/ginzaaipro-dashboard/README.md` is **Active only as tooling guidance** and has no governance authority.

Root `README.md`, root `DECISIONS.md`, and `operational-journeys/README.md` remain retired empty placeholders. The former `platform/business-physics/`, `platform/business-physics-engine/`, and `platform/operational-intelligence/` untracked scaffolds were removed under DEC-0010 after traceability was recorded.

## Duplicates and absorbed material

1. Two accepted ADR-0001 files express the same capture-first decision. The `docs/architecture/adr/` version is the active decision because the canonical architecture README declares that ADR location; the legacy dated file is absorbed, not deleted.
2. Capture-first, governance-before-execution, evidence, explainability, append-only memory, and downward-dependency rules repeat across constitutional, canonical, and subsystem documents. These are reinforcing duplicates; the register cites the highest-authority statement and retains compatible elaborations.
3. The duplicate `src/capabilities/revenue-leakage/` scaffold was absorbed into `src/revenue-leakage/CAPABILITY_SPEC.md`; `src/revenue-leakage/` is now the sole canonical owner.

## Scaffold and naming migration

DEC-0010 approved and records the 2026-07-15 migration:

- `apps/ginzaaipro-dashboard/src/capabilities/revenue-leakage/` — compatible completeness language absorbed; duplicate types and empty files retired; path removed.
- `apps/ginzaaipro-dashboard/src/platform/business-physics/` — empty duplicate retired and removed.
- `apps/ginzaaipro-dashboard/src/platform/business-physics-engine/` — top-level subsystem rejected; substantive `law-types.ts` and `business-state.ts` concepts redesigned under `research/cosmos/organizational-dynamics/experimental/`; remaining empty scaffold retired and path removed.
- `apps/ginzaaipro-dashboard/src/platform/operational-intelligence/` — empty cross-boundary umbrella retired and removed; no replacement package created.
- “Business Physics” — deprecated as a GinzaAIpro platform name; “Organizational Dynamics” adopted for the non-canonical COSMOS scientific/research concept.
- “Operational Intelligence Runtime” — deprecated; “Operational Runtime” adopted only as a future coordination term. Runtime coordinates lifecycle activity and does not own business reasoning, Governance, Workforce, Execution, Verification, or Learning.

The migrated research is explicitly experimental, non-canonical, non-executable, and neither Operational Evidence nor Governance policy.

## Architectural evolution

- The early Observation-centric architecture is extended by separate Operational Event, Execution Aggregate, and Operational Knowledge Graph models. Links remain through traceability rather than treating newer nouns as deletion of Observation.
- The short constitutional lifecycle is extended by the canonical architecture lifecycle with Evidence, Signals, Memory, Health, Cognition, Orchestration, Verification, and Learning.
- Implementation-local runtime and capability contracts specialize canonical architecture but do not outrank it.

## Terminology drift

The terminology register resolves or flags Event vs Operational Event, Event vs Signal, Runtime Health vs Operational Health, Operational Intelligence vs Operational Cognition, Observation vs Evidence vs OKG, Execution fields vs Execution Aggregate, orchestration naming, Organizational Dynamics, and Operational Runtime.

## Conflict closure

No human decisions remain outstanding.

1. **CON-0004 — resolved by DEC-0008:** pre-governance Orchestration may prepare, sequence, simulate, and propose. Material execution orchestration begins only inside an explicitly approved governance envelope; after approval it coordinates the authorized execution plan.
2. **CON-0005 — resolved by DEC-0009:** human constitutional authority governs platform purpose, policy changes, critical exceptions, irreversible actions, and risk limits. Deterministic platform policy has only explicitly delegated routine authority. Mandatory safety, compliance, tenant-isolation, audit, and constitutional controls are non-bypassable. Emergency override is authorized, scoped, time-bound, justified, and immutably audited.
3. **CON-0006 — resolved by DEC-0012:** Platform Constitution v1.0 supersedes SAOP.md v0.1 as GinzaAIpro's highest constitutional authority. SAOP.md remains preserved as historical constitutional source material, and compatible principles remain effective only where incorporated into or consistent with Platform Constitution v1.0.

All three conflict rows retain their original issue and prior open-state history in the Conflict Register.

## Preservation statement

Project Canon sources and accepted architecture history remain intact. Platform Constitution v1.0 is now the highest constitutional authority, while SAOP.md v0.1 remains preserved as historical constitutional source material under DEC-0012 and DEP-0009. Only explicitly approved untracked duplicate/empty scaffolds were removed. The two substantive experimental models were preserved in redesigned form under COSMOS research with their former paths recorded in DEP-0007 and this report.
