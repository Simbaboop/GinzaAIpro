# Deprecation Register

Schema: `ID | Classification | Target | Replacement | Evidence | Traceability`

| ID | Classification | Target | Replacement | Evidence | Traceability |
|---|---|---|---|---|---|
| DEP-0001 | Absorbed | Legacy capture-first decision at `decisions/0001_Capture_First_Architecture.md` | `docs/architecture/adr/ADR-0001-Capture-First.md` | Same ADR identifier and compatible decision; canonical ADR directory is declared by architecture README. | DEC-0003 absorbed by DEC-0001; source retained. |
| DEP-0002 | Extended | Execution fields embedded in the Observation model/aggregate | Separate Execution Tracking and Execution Aggregate specifications | Later specs explicitly distinguish action, execution, outcome, and verification while retaining Observation linkage. | RULE-0018 extends, but does not delete or invalidate, Observation traceability. |
| DEP-0003 | Retired | Empty ADR-0003 through ADR-0006 files | None | Files contain no status, context, or decision. | DEC-0004 through DEC-0007; retain placeholders unchanged. |
| DEP-0004 | Retired | Empty root `README.md`, root `DECISIONS.md`, and empty subsystem documentation files | None | Zero-length files provide no rule or decision evidence. | Retained in place; listed in reconciliation inventory. |

No repository-backed rule was marked `Deprecated`, `Superseded`, or `Rejected` during this reconciliation. Those classifications remain available for future evidence-backed changes.
