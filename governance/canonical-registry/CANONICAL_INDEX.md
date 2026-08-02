# Canonical Index

Last reconciled and closed: 2026-08-01

## Authority and process

- [`AUTHORITY_ORDER.md`](AUTHORITY_ORDER.md) — source precedence and tie-breakers
- [`CHANGE_PROTOCOL.md`](CHANGE_PROTOCOL.md) — evidence, review, identifiers, classifications, and history
- [`CONFLICT_RESOLUTION.md`](CONFLICT_RESOLUTION.md) — deterministic and human resolution paths
- [`Canonical Governance Standards`](../standards/README.md) — accepted Governance Operating System controls; scoped by TERM-0018
  - [`CGS-0001`](../standards/CGS-0001-Capability-Governance-Standard.md) — capability lifecycle and implementation authorization
  - [`CGS-0004`](../standards/CGS-0004-Verification-Validation-Standard.md) — verification evidence and disposition
  - [`CGS-0005`](../standards/CGS-0005-Release-Governance-Standard.md) — release authorization and baseline governance

## Published canon

- [`AUTHORITATIVE_RULE_SET.md`](AUTHORITATIVE_RULE_SET.md) — concise current rule set
- [`registers/RULE_REGISTER.md`](registers/RULE_REGISTER.md) — rule evidence and relationships
- [`registers/DECISION_REGISTER.md`](registers/DECISION_REGISTER.md) — accepted and historical decisions
- [`registers/CONFLICT_REGISTER.md`](registers/CONFLICT_REGISTER.md) — resolved and open conflicts
- [`registers/DEPRECATION_REGISTER.md`](registers/DEPRECATION_REGISTER.md) — absorbed, extended, and retired material
- [`registers/TERMINOLOGY_REGISTER.md`](registers/TERMINOLOGY_REGISTER.md) — preferred meanings and drift
- [`RECONCILIATION_REPORT.md`](RECONCILIATION_REPORT.md) — inventory and reconciliation results

## Primary authoritative sources

1. [`Platform Constitution v1.0`](../constitution/PLATFORM-CONSTITUTION.md) — highest constitutional authority; [`SAOP.md`](../../SAOP.md) is preserved as historical constitutional source material under DEC-0012 and DEP-0009
2. Accepted Canonical Governance Standards: [`CGS README`](../standards/README.md), [`CGS-0001`](../standards/CGS-0001-Capability-Governance-Standard.md), [`CGS-0004`](../standards/CGS-0004-Verification-Validation-Standard.md), and [`CGS-0005`](../standards/CGS-0005-Release-Governance-Standard.md)
3. Accepted ADRs: [`ADR-0001`](../../docs/architecture/adr/ADR-0001-Capture-First.md), [`ADR-0002`](../../docs/architecture/adr/ADR-0002-Signal-Driven-Architecture.md)
4. Canonical architecture suite: [`docs/architecture/README.md`](../../docs/architecture/README.md)
5. Canonical specifications: [`docs/11_Operational_Knowledge_Graph.md`](../../docs/11_Operational_Knowledge_Graph.md), capability specifications explicitly marked canonical
6. Supporting architecture, product specifications, and implementation-local README contracts as inventoried in the reconciliation report

## Capability 002 governance chain

- [`RCO-0002`](../../architecture/rco/RCO-0002-Capability-002-Evidence-Semantics-Reconciliation.md) — repository reconciliation and retained-SAS disposition
- [`SAS-0002A`](../../architecture/sas/SAS-0002A-Evidence-Semantics-Layer.md) — retained Evidence Semantics specification
- [`SAS-0002A-ADD-001`](../../architecture/sas/SAS-0002A-ADD-001-Resolution-Accountability.md) — component resolution accountability
- [`SAS-0002B`](../../architecture/sas/SAS-0002B-Deterministic-Evidence-Semantic-Resolution.md) — deterministic resolver specification
- [`FEA-0002`](../../architecture/fea/FEA-0002-Evidence-Semantics-Feasibility.md) — `IMPLEMENTABLE` feasibility verdict
- [`IRG-0002-R1`](../../architecture/irg/IRG-0002-R1-Evidence-Semantics-Implementation-Readiness.md) — `PASS` implementation-readiness gate
- [`E2-001-R2`](../../architecture/execution/E2-001-R2-Evidence-Semantics-Execution-Authorization.md) — `AUTHORIZED FOR IMPLEMENTATION`

This chain governs Capability 002 only. It preserves the released Capability
001 contract and tag.

## Capability 003 governance chain

- [`ADR-0003`](../adr/ADR-0003-Operational-Conditions.md) — accepted architectural decision introducing `OperationalCondition` as the canonical descriptive-state boundary
- [`HCES-0003`](../hces/HCES-0003-Operational-Conditions.md) — accepted deterministic Capability 003 contract
- [`VVR-0003`](../vvr/VVR-0003-Operational-Conditions.md) — accepted verification evidence; 15 focused tests, typecheck, build, and repository integration reported PASS

Capability 003 is verified but not released. No Release Record exists, so neither implementation completion nor VVR acceptance establishes release under CGS-0005.


## Capability 004 governance chain

- [`HCES-0004`](../hces/HCES-0004-Operational-Leakage.md) — accepted deterministic Operational Leakage contract, including ADR-0007 canonical operational provenance requirements
- [`VVR-0004`](../vvr/VVR-0004-Operational-Leakage.md) — accepted PASS verification evidence for the domain contract; 16 focused tests, 366 full-domain tests, typecheck, build, and repository integration passed

The Capability 004 domain contract is verified but not released. No Capability 004 runtime engine or Release Record exists, so verification does not establish capability release under CGS-0005.


## Capability 005 governance chain

- [`ADR-0004`](../adr/ADR-0004-Legacy-PriorityProfile-Compatibility.md) — preserves the released legacy `PriorityProfile` and introduces `OperationalLeakagePriority` as a distinct additive canonical contract
- [`ADR-0006`](../adr/ADR-0006-Priority-Artifact-Completeness.md) — requires originating leakage category and complete deterministic downstream artifacts
- [`ADR-0007`](../decisions/ADR-0007-Preservation-of-Canonical-Operational-Provenance.md) — requires immutable `organizationId` preservation and prohibits provenance repair through inference, lookup, or side channels
- [`HCES-0005`](../hces/HCES-0005-Priority-Profiles.md) — accepted deterministic governed-priority contract
- [`VVR-0005`](../vvr/VVR-0005-Operational-Leakage-Priority.md) — accepted PASS verification evidence; 15 focused tests, 366 full-domain tests, typecheck, build, and provenance/category validation passed

The Capability 005 domain contract is verified but not released. No prioritization runtime engine or Release Record exists, so verification does not establish capability release under CGS-0005.

## Capability 006 governance chain

- [`ADR-0005`](../adr/ADR-0005-Released-Rule-Boundary.md) — assigns lifecycle filtering to the upstream Released-rule boundary and keeps deterministic engines lifecycle-neutral
- [`ADR-0006`](../adr/ADR-0006-Priority-Artifact-Completeness.md) — requires complete deterministic input artifacts without supplemental runtime facts
- [`ADR-0007`](../decisions/ADR-0007-Preservation-of-Canonical-Operational-Provenance.md) — requires immutable `organizationId` preservation and prohibits provenance repair through inference, lookup, or side channels
- [`HCES-0000`](../hces/HCES-0000-Deterministic-Rule-Engine-Pattern.md) — accepted deterministic engine pattern
- [`HCES-0000A`](../hces/HCES-0000A-Rule-Specification-Pattern.md) — accepted governed rule pattern
- [`HCES-0006`](../hces/HCES-0006-Operational-Recommendations.md) — accepted canonical Capability 006 transition and recommendation boundary
- [`HCES-0006A`](../hces/HCES-0006A-Recommendation-Rule-Engine.md) — accepted deterministic `RecommendationRuleEngine` specification
- [`VVR-0006`](../vvr/VVR-0006-Operational-Recommendation.md) — accepted PASS capability verification evidence
- [`VVR-0006A`](../vvr/VVR-0006A-Recommendation-Rule-Engine.md) — accepted PASS engine verification evidence

Executed evidence records 25 / 25 focused `OperationalRecommendation` tests,
20 / 20 focused `RecommendationRule` tests, 14 / 14 focused
`RecommendationRuleEngine` tests, 366 / 366 complete Domain tests, and 65 / 65
complete Engines tests as PASS. Domain and Engines typechecks and builds also
PASS.

Capability 006 and `RecommendationRuleEngine` are verified but not released.
No Release Record exists, so accepted specifications, implementation, and PASS
verification do not establish release under CGS-0005.

## Capability 007 governance chain

- [`ADR-0005`](../adr/ADR-0005-Released-Rule-Boundary.md) — keeps lifecycle filtering upstream of deterministic planning
- [`ADR-0006`](../adr/ADR-0006-Priority-Artifact-Completeness.md) — establishes complete deterministic upstream artifacts
- [`ADR-0007`](../decisions/ADR-0007-Preservation-of-Canonical-Operational-Provenance.md) — requires immutable organization provenance without side-channel repair
- [`ADR-0008`](../decisions/ADR-0008-Canonical-Ownership-of-ExecutionPlan.md) — assigns the canonical planning-only name `ExecutionPlan`, classifies `RuntimeExecutionPlan` separately, and records the completed verified migration
- [`HCES-0000`](../hces/HCES-0000-Deterministic-Rule-Engine-Pattern.md) — accepted deterministic engine pattern
- [`HCES-0000A`](../hces/HCES-0000A-Rule-Specification-Pattern.md) — accepted governed rule pattern
- [`HCES-0007`](../hces/HCES-0007-Execution-Plan.md) — accepted planning-only capability contract
- [`HCES-0007A`](../hces/HCES-0007A-Execution-Planning-Engine.md) — accepted deterministic planning-engine specification
- [`VVR-0007`](../vvr/VVR-0007-Execution-Planning.md) — accepted PASS capability verification evidence
- [`VVR-0007A`](../vvr/VVR-0007A-Execution-Planning-Engine.md) — accepted PASS engine verification evidence

Executed evidence records 27 / 27 focused `ExecutionPlan` tests, 21 / 21
focused `ExecutionPlanningRule` tests, 51 / 51 focused
`ExecutionPlanningEngine` tests, 366 / 366 complete Domain tests, and 65 / 65
complete Engines tests as PASS. Domain and Engines typechecks and builds also
PASS.

Capability 007 and `ExecutionPlanningEngine` are verified but not released.
No Release Record exists, so accepted specifications, implementation, and PASS
verification do not establish release under CGS-0005.

## Capability 008A governance chain

- [`ADR-0007`](../decisions/ADR-0007-Preservation-of-Canonical-Operational-Provenance.md) — requires immutable organization provenance without inference or side-channel repair
- [`ADR-0008`](../decisions/ADR-0008-Canonical-Ownership-of-ExecutionPlan.md) — separates canonical planning-only `ExecutionPlan` from legacy `RuntimeExecutionPlan`
- [`ADR-0009`](../decisions/ADR-0009-Canonical-Ownership-of-Runtime-Admission.md) — assigns sole canonical runtime-admission ownership to `RuntimeAdmission`
- [`HCES-0008A`](../hces/HCES-0008A-RuntimeAdmission.md) — accepted immutable deterministic append-only runtime-admission contract
- [`VVR-0008A`](../vvr/VVR-0008A-RuntimeAdmission-Implementation-Verification.md) — accepted PASS implementation verification evidence

Executed evidence records 64 / 64 focused `RuntimeAdmission` tests and 366 /
366 complete Domain tests across 14 files as PASS. Domain typecheck and build
also PASS.

Implementation and verification consume the canonical verified
`ExecutionPlan` contract. Actual governed runtime admission requires an
upstream plan that has crossed every applicable release and admissibility
boundary. A plan alone is not permission to execute.

Capability 008A is verified but not released. No Release Record exists, so
accepted specifications, implementation, and PASS verification do not
authorize release or runtime deployment under CGS-0005.

## Conflict status

No unresolved conflicts remain.

- `CON-0004` was resolved by DEC-0008: Orchestration may plan and propose before Governance and coordinates material execution only within an approved governance envelope.
- `CON-0005` was resolved by DEC-0009: human constitutional authority governs the platform; deterministic platform policy exercises only explicitly delegated routine authority under mandatory controls.
- `CON-0006` was resolved by DEC-0012: Platform Constitution v1.0 supersedes SAOP.md v0.1 as the highest constitutional authority while preserving SAOP.md as historical source material.

Resolution history remains in [`CONFLICT_REGISTER.md`](registers/CONFLICT_REGISTER.md#resolution-history).

## Naming and scaffold disposition

- DEC-0010 preserves `apps/ginzaaipro-dashboard/src/revenue-leakage/` as the sole canonical Revenue Leakage owner and records its duplicate scaffold as absorbed.
- “Business Physics” is deprecated as a GinzaAIpro platform name. Substantive prototypes survive only as [`experimental COSMOS Organizational Dynamics research`](../../research/cosmos/organizational-dynamics/experimental/README.md).
- “Operational Intelligence Runtime” is deprecated. “Operational Runtime” is the approved future coordination term, documentation-only unless separately approved through Project Canon.
- No new top-level platform subsystem was created.

## Templates

- [`RULE_TEMPLATE.md`](templates/RULE_TEMPLATE.md)
- [`DECISION_TEMPLATE.md`](templates/DECISION_TEMPLATE.md)
- [`AMENDMENT_TEMPLATE.md`](templates/AMENDMENT_TEMPLATE.md)
- [`DEPRECATION_TEMPLATE.md`](templates/DEPRECATION_TEMPLATE.md)
- [`CONFLICT_TEMPLATE.md`](templates/CONFLICT_TEMPLATE.md)
