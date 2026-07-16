# Canonical Change Protocol

## Purpose

This protocol makes changes to GinzaAIpro rules and decisions explicit, reviewable, and reversible without erasing history.

## Required sequence

1. **Identify** the proposed rule or decision and cite repository evidence.
2. **Search** the registers and source tree for duplicates, conflicts, terminology drift, and affected dependencies.
3. **Classify** the proposal as a new rule, decision, amendment, deprecation, or conflict.
4. **Record relationships** in both directions: `supersedes`/`superseded-by`, `absorbs`/`absorbed-by`, and related rules or decisions.
5. **Assess authority** using `AUTHORITY_ORDER.md` and scope the change precisely.
6. **Review** architectural impact. Any architecture change requires an accepted ADR; Project Canon does not accept ADRs by itself.
7. **Approve** through the repository's human review process. Until approval is evidenced, use `Proposed` in artifact workflow fields and do not mark the rule `Active`.
8. **Publish** the updated artifact, registers, `CANONICAL_INDEX.md`, authoritative rule set, and reconciliation report together.
9. **Validate** identifiers, links, reverse relationships, and unresolved-conflict references.

## Identifier scheme

- Rules: `RULE-####`
- Decisions: `DEC-####`
- Amendments: `AMD-####`
- Deprecations: `DEP-####`
- Conflicts: `CON-####`
- Terms: `TERM-####`

Identifiers are permanent and never reused.

## Canonical classifications

- **Active** — currently authoritative in its recorded scope.
- **Extended** — remains authoritative; later material adds compatible scope or detail.
- **Amended** — remains authoritative as changed by a recorded amendment.
- **Absorbed** — its substance is preserved in another authoritative artifact; it is not an independent authority.
- **Superseded** — replaced by a later authoritative artifact.
- **Deprecated** — still present and possibly used, but discouraged and scheduled for replacement.
- **Retired** — no longer operative; retained only for history or is an empty historical placeholder.
- **Rejected** — considered and explicitly not adopted.

## Evidence requirements

Every registry row must include a source file and concise evidence. `Amended`, `Absorbed`, `Superseded`, `Deprecated`, and `Retired` entries must name the related artifact where one exists. Unsupported proposals belong in a conflict or proposal artifact, not the active rule set.

## History preservation

- Never delete or rewrite historical source material solely to make the registry tidy.
- Prefer links and status metadata to file moves.
- If material is moved, preserve a forwarding note and update every registered source link.
- Do not renumber historical ADRs or registry identifiers.
- Record the effective date and rationale for every status transition.

## Minimum review checklist

- Repository evidence cited
- Authority and scope evaluated
- Architecture unchanged unless an accepted ADR supports it
- Forward and reverse relationships present
- Terminology register updated
- Conflicts either resolved by evidence or explicitly open
- Index and reports regenerated
- Validation recorded
