# Canonical Index

Last reconciled and closed: 2026-07-20

## Authority and process

- [`AUTHORITY_ORDER.md`](AUTHORITY_ORDER.md) — source precedence and tie-breakers
- [`CHANGE_PROTOCOL.md`](CHANGE_PROTOCOL.md) — evidence, review, identifiers, classifications, and history
- [`CONFLICT_RESOLUTION.md`](CONFLICT_RESOLUTION.md) — deterministic and human resolution paths

## Published canon

- [`AUTHORITATIVE_RULE_SET.md`](AUTHORITATIVE_RULE_SET.md) — concise current rule set
- [`registers/RULE_REGISTER.md`](registers/RULE_REGISTER.md) — rule evidence and relationships
- [`registers/DECISION_REGISTER.md`](registers/DECISION_REGISTER.md) — accepted and historical decisions
- [`registers/CONFLICT_REGISTER.md`](registers/CONFLICT_REGISTER.md) — resolved and open conflicts
- [`registers/DEPRECATION_REGISTER.md`](registers/DEPRECATION_REGISTER.md) — absorbed, extended, and retired material
- [`registers/TERMINOLOGY_REGISTER.md`](registers/TERMINOLOGY_REGISTER.md) — preferred meanings and drift
- [`RECONCILIATION_REPORT.md`](RECONCILIATION_REPORT.md) — inventory and reconciliation results

## Primary authoritative sources

1. [`SAOP.md`](../../SAOP.md) — constitutional constraints
2. Accepted ADRs: [`ADR-0001`](../../docs/architecture/adr/ADR-0001-Capture-First.md), [`ADR-0002`](../../docs/architecture/adr/ADR-0002-Signal-Driven-Architecture.md)
3. Canonical architecture suite: [`docs/architecture/README.md`](../../docs/architecture/README.md)
4. Canonical specifications: [`docs/11_Operational_Knowledge_Graph.md`](../../docs/11_Operational_Knowledge_Graph.md), capability specifications explicitly marked canonical
5. Supporting architecture, product specifications, and implementation-local README contracts as inventoried in the reconciliation report

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

## Conflict status

No unresolved conflicts remain.

- `CON-0004` was resolved by DEC-0008: Orchestration may plan and propose before Governance and coordinates material execution only within an approved governance envelope.
- `CON-0005` was resolved by DEC-0009: human constitutional authority governs the platform; deterministic platform policy exercises only explicitly delegated routine authority under mandatory controls.

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
