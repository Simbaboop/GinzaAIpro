# Deprecation Register

Schema: `ID | Classification | Target | Replacement | Evidence | Traceability`

| ID | Classification | Target | Replacement | Evidence | Traceability |
|---|---|---|---|---|---|
| DEP-0001 | Absorbed | Legacy capture-first decision at `decisions/0001_Capture_First_Architecture.md` | `docs/architecture/adr/ADR-0001-Capture-First.md` | Same ADR identifier and compatible decision; canonical ADR directory is declared by architecture README. | DEC-0003 absorbed by DEC-0001; source retained. |
| DEP-0002 | Extended | Execution fields embedded in the Observation model/aggregate | Separate Execution Tracking and Execution Aggregate specifications | Later specs explicitly distinguish action, execution, outcome, and verification while retaining Observation linkage. | RULE-0018 extends, but does not delete or invalidate, Observation traceability. |
| DEP-0003 | Retired | Empty ADR-0003 through ADR-0006 files | None | Files contain no status, context, or decision. | DEC-0004 through DEC-0007; retain placeholders unchanged. |
| DEP-0004 | Retired | Empty root `README.md`, root `DECISIONS.md`, and empty subsystem documentation files | None | Zero-length files provide no rule or decision evidence. | Unaffected placeholders remain in place; migrated scaffold paths are recorded separately below. |
| DEP-0005 | Absorbed | `apps/ginzaaipro-dashboard/src/capabilities/revenue-leakage/` duplicate scaffold | `apps/ginzaaipro-dashboard/src/revenue-leakage/` | Compatible completeness criteria were merged into the canonical capability specification; its duplicate types and empty implementation files supplied no independent implementation. | Absorbed by DEC-0010; old untracked path removed 2026-07-15. |
| DEP-0006 | Retired | `apps/ginzaaipro-dashboard/src/platform/business-physics/` | None | Entire directory was an empty duplicate scaffold and had no authority or consumers. | Retired by DEC-0010; old untracked path removed 2026-07-15. |
| DEP-0007 | Deprecated / reclassified | `apps/ginzaaipro-dashboard/src/platform/business-physics-engine/` and “Business Physics” as a GinzaAIpro platform name | [`research/cosmos/organizational-dynamics/experimental/`](../../../research/cosmos/organizational-dynamics/experimental/README.md) | Only two source models were substantive. They were redesigned as non-canonical COSMOS Organizational Dynamics research; empty engine scaffolding was retired. | Reclassified by DEC-0010; old untracked path removed 2026-07-15. |
| DEP-0008 | Retired / renamed | `apps/ginzaaipro-dashboard/src/platform/operational-intelligence/` and “Operational Intelligence Runtime” | Operational Runtime, documentation-only future coordination concept | The directory was empty and its proposed files crossed Runtime, Cognition, Governance, Workforce, Execution, Verification, and Learning ownership. No code package was created. | Retired by DEC-0010; old untracked path removed 2026-07-15. |

No operative canonical rule was superseded or rejected. Deprecations above apply to non-canonical names and scaffolds, not to governing architecture.
