# Project Canon Reconciliation Report

Date: 2026-08-01

## Outcome

Project Canon maintains one traceable registry. After constitutional authority
reconciliation, publication of Platform Constitution v1.0, and acceptance of the Canonical Governance Standards, the registry contains
53 registered rules, 17 decision entries, 9 deprecation/history entries,
23 terminology entries, 6 resolved conflicts, and no open conflicts.

## Classification summary

- **Active:** Platform Constitution v1.0; accepted CGS-0001, CGS-0004, and CGS-0005; accepted ADR-0001/0002, Capability 003 ADR-0003, and ADR-0007/0008; accepted decisions DEC-0008/0009/0011/0012/0013/0014/0015/0016/0017; constitutional rules RULE-0028 through RULE-0037; governance-process rules RULE-0038 through RULE-0043; Capability 003 rules RULE-0044 and RULE-0045; Capability 004 rules RULE-0046 and RULE-0047; Capability 005 rules RULE-0048 and RULE-0049; Capability 006 rules RULE-0050 and RULE-0051; Capability 007 rules RULE-0052 and RULE-0053; accepted HCES-0000, HCES-0000A, HCES-0003, HCES-0004, HCES-0005, HCES-0006, HCES-0006A, HCES-0007, and HCES-0007A; VVR-0003 through VVR-0007 and VVR-0006A/0007A as verification evidence only; canonical architecture rules; canonical specifications in their stated scopes; and compatible implementation-local contracts. Capabilities 003 through 007 remain verified but not released where no Release Record exists; Capabilities 004 and 005 also have no runtime engine.
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
| `governance/standards/README.md` | Active — Governance Operating System scope | Defines CGS purpose, authority boundaries, versioning, ownership, and relationship to ADR, HCES, VVR, and RR artifacts |
| `governance/standards/CGS-0001-Capability-Governance-Standard.md` | Active | Mandatory capability lifecycle, explicit implementation authorization, scoped implementation, and governed evolution |
| `governance/standards/CGS-0004-Verification-Validation-Standard.md` | Active | Reproducible verification evidence, repository-integrity review, and PASS / CONDITIONAL PASS / FAIL disposition criteria |
| `governance/standards/CGS-0005-Release-Governance-Standard.md` | Active | Human-accountable release authorization, release states, baseline freeze, and governed post-release change |
| `ROADMAP.md` | Active (planning scope) | Build sequencing; not architecture authority |
| `decisions/0001_Capture_First_Architecture.md` | Absorbed | Legacy accepted duplicate of ADR-0001; dated implementation consequences retained |
| `docs/architecture/adr/ADR-0001-Capture-First.md` | Active | Accepted capture-first decision |
| `docs/architecture/adr/ADR-0002-Signal-Driven-Architecture.md` | Active | Accepted signal-driven decision |
| `governance/adr/ADR-0003-Operational-Conditions.md` | Active — accepted decision | Introduces `OperationalCondition` as the canonical immutable descriptive-state boundary between released Semantic Facts and Operational Leakage; registered as DEC-0013 |
| `governance/hces/HCES-0003-Operational-Conditions.md` | Active — accepted Capability 003 specification | Defines released-input admissibility, deterministic derivation, identity, provenance, failure taxonomy, and strict descriptive-only boundaries |
| `governance/vvr/VVR-0003-Operational-Conditions.md` | Active — verification evidence only | Reports typecheck, build, repository integration, and 15 focused tests PASS; recommends release but does not establish release because no RR exists |
| `governance/decisions/ADR-0007-Preservation-of-Canonical-Operational-Provenance.md` | Active — accepted decision | Establishes immutable `organizationId` preservation across operational artifacts and prohibits provenance recovery through inference, repositories, or side-channel inputs |
| `governance/hces/HCES-0004-Operational-Leakage.md` | Active — accepted Capability 004 specification | Defines deterministic leakage derivation, same-Organization admissibility, canonical provenance, identity, governed failure, and strict consequence-only boundaries |
| `governance/vvr/VVR-0004-Operational-Leakage.md` | Active — accepted PASS verification evidence only | Reports 16 focused tests, 366 full-domain tests, typecheck, build, repository integration, and immutable `organizationId` provenance PASS; explicitly records Capability 004 as not released |
| `governance/adr/ADR-0004-Legacy-PriorityProfile-Compatibility.md` | Active — accepted decision | Preserves the released legacy `PriorityProfile` and introduces `OperationalLeakagePriority` as a distinct additive canonical contract |
| `governance/adr/ADR-0006-Priority-Artifact-Completeness.md` | Active — accepted decision | Requires originating leakage category and complete deterministic downstream priority artifacts without supplemental runtime facts |
| `governance/hces/HCES-0005-Priority-Profiles.md` | Active — accepted Capability 005 specification | Defines same-Organization admissibility, deterministic governed priority, immutable provenance and category preservation, compatibility, failure integrity, and strict priority-only boundaries |
| `governance/vvr/VVR-0005-Operational-Leakage-Priority.md` | Active — accepted PASS verification evidence only | Reports 15 focused tests, 366 full-domain tests, typecheck, build, immutable `organizationId` provenance, originating-category validation, and explicit not-released status |
| `governance/adr/ADR-0005-Released-Rule-Boundary.md` | Active — accepted decision | Assigns rule lifecycle management and Released-rule filtering upstream of deterministic engine invocation |
| `governance/hces/HCES-0000-Deterministic-Rule-Engine-Pattern.md` | Active — accepted engine pattern | Defines stateless, pure, deterministic, replayable, idempotent, traceable, versioned, and immutable engine behavior |
| `governance/hces/HCES-0000A-Rule-Specification-Pattern.md` | Active — accepted rule pattern | Defines immutable, versioned, policy-linked, declarative governed rule structure and lifecycle boundaries |
| `governance/hces/HCES-0006-Operational-Recommendations.md` | Active — accepted Capability 006 specification | Defines the canonical `OperationalLeakagePriority` to immutable zero-or-more `OperationalRecommendation` transition and strict intervention-hypothesis boundary |
| `governance/hces/HCES-0006A-Recommendation-Rule-Engine.md` | Active — accepted Capability 006 engine specification | Defines deterministic single-artifact evaluation with explicit time, supplied released rules, canonical ordering, immutable results, and governed failures |
| `governance/vvr/VVR-0006-Operational-Recommendation.md` | Active — accepted PASS verification evidence only | Reports focused and complete Domain and Engines tests, typechecks, builds, provenance, immutability, deterministic replay, and explicit not-released status |
| `governance/vvr/VVR-0006A-Recommendation-Rule-Engine.md` | Active — accepted PASS verification evidence only | Verifies `RecommendationRuleEngine` conformance, deterministic rule behavior, failure integrity, execution boundary, and explicit not-released status |
| `governance/decisions/ADR-0008-Canonical-Ownership-of-ExecutionPlan.md` | Active — accepted Evolution ADR | Assigns canonical planning-only ownership of `ExecutionPlan`, distinguishes `RuntimeExecutionPlan`, and records the completed verified migration |
| `governance/hces/HCES-0007-Execution-Plan.md` | Active — accepted Capability 007 specification | Defines immutable deterministic planning-only `ExecutionPlan` semantics, provenance, dependencies, criteria, and runtime boundaries |
| `governance/hces/HCES-0007A-Execution-Planning-Engine.md` | Active — accepted Capability 007 engine specification | Defines deterministic supplied-rule selection, canonical materialization, governed failures, and explicit planning provenance |
| `governance/vvr/VVR-0007-Execution-Planning.md` | Active — accepted PASS verification evidence only | Reports focused and complete Domain and Engines tests, typechecks, builds, migration verification, provenance, determinism, and explicit not-released status |
| `governance/vvr/VVR-0007A-Execution-Planning-Engine.md` | Active — accepted PASS verification evidence only | Verifies `ExecutionPlanningEngine` rule selection, materialization, immutability, graph integrity, planning/runtime boundary, and explicit not-released status |
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
- Capability 003 introduces `OperationalCondition` as the immutable descriptive-state boundary between released Semantic Facts and downstream Operational Leakage. ADR-0003, HCES-0003, and VVR-0003 are accepted, but the capability remains verified rather than released because no Release Record exists.
- Capability 004 introduces `OperationalLeakage` as the immutable governed-consequence boundary downstream of `OperationalCondition`, preserving same-Organization provenance while excluding priority, ROI, recommendations, execution authority, and AI reasoning. HCES-0004 and VVR-0004 are accepted, but only the domain contract is verified; no runtime engine or Release Record exists.
- Capability 005 introduces `OperationalLeakagePriority` as the immutable governed-relative-importance boundary downstream of `OperationalLeakage`, preserving same-Organization provenance, originating category, policy and rule identity, lineage, and replayability while remaining distinct from recommendations, ROI, scheduling, optimization, execution authority, AI assignment, and the released legacy `PriorityProfile`. The domain contract is verified, but no prioritization runtime engine or Release Record exists.
- Capability 006 introduces `OperationalRecommendation` as the immutable governed intervention-hypothesis boundary between `OperationalLeakagePriority` and Capability 007 execution planning. It deterministically preserves organization, source-priority, trace, rule, policy, schema, identity, and replay provenance without repeating prioritization, managing rule lifecycle inside the engine, planning or assigning work, authorizing execution, persisting state, or invoking AI. HCES-0006 and HCES-0006A are Accepted and VVR-0006 and VVR-0006A record PASS, but the capability and engine are not released because no Release Record exists.
- Capability 007 completes ADR-0008's migration: `RuntimeExecutionPlan` owns the legacy runtime contract and canonical `ExecutionPlan` owns planning-only semantics. The capability deterministically derives one immutable plan from admissible recommendations through one selected supplied released planning rule and explicit generation time, preserving organization, recommendation, trace, planning-rule, planning-policy, schema, identity, dependency, and creation provenance. HCES-0007 and HCES-0007A are Accepted and VVR-0007 and VVR-0007A record PASS, but the capability and engine are not released because no Release Record exists.
- Implementation-local runtime and capability contracts specialize canonical architecture but do not outrank it.

## Terminology drift

The terminology register resolves or flags Event vs Operational Event, Event vs Signal, Runtime Health vs Operational Health, Operational Intelligence vs Operational Cognition, Observation vs Evidence vs OKG, Execution fields vs Execution Aggregate, orchestration naming, Organizational Dynamics, Operational Runtime, `OperationalCondition` as descriptive operational state, `OperationalLeakage` as governed consequence distinct from priority, ROI, recommendations, execution authority, and AI reasoning, `OperationalLeakagePriority` as governed relative importance distinct from recommendations, ROI, scheduling, optimization, execution authority, AI assignment, and legacy `PriorityProfile`, `OperationalRecommendation` as a governed intervention hypothesis distinct from planning, workflow, assignment, scheduling, authorization, execution, outcomes, AI decisions, and rule lifecycle, canonical planning-only `ExecutionPlan` as distinct from `RuntimeExecutionPlan`, execution, scheduling, assignment, allocation, lifecycle, and outcome evaluation, and the relationship between the Governance Operating System authority layer and its Canonical Governance Standards.

## Conflict closure

No human decisions remain outstanding.

1. **CON-0004 — resolved by DEC-0008:** pre-governance Orchestration may prepare, sequence, simulate, and propose. Material execution orchestration begins only inside an explicitly approved governance envelope; after approval it coordinates the authorized execution plan.
2. **CON-0005 — resolved by DEC-0009:** human constitutional authority governs platform purpose, policy changes, critical exceptions, irreversible actions, and risk limits. Deterministic platform policy has only explicitly delegated routine authority. Mandatory safety, compliance, tenant-isolation, audit, and constitutional controls are non-bypassable. Emergency override is authorized, scoped, time-bound, justified, and immutably audited.
3. **CON-0006 — resolved by DEC-0012:** Platform Constitution v1.0 supersedes SAOP.md v0.1 as GinzaAIpro's highest constitutional authority. SAOP.md remains preserved as historical constitutional source material, and compatible principles remain effective only where incorporated into or consistent with Platform Constitution v1.0.

All three conflict rows retain their original issue and prior open-state history in the Conflict Register.

## Preservation statement

Project Canon sources and accepted architecture history remain intact. Platform Constitution v1.0 is now the highest constitutional authority, while SAOP.md v0.1 remains preserved as historical constitutional source material under DEC-0012 and DEP-0009. Only explicitly approved untracked duplicate/empty scaffolds were removed. The two substantive experimental models were preserved in redesigned form under COSMOS research with their former paths recorded in DEP-0007 and this report.
