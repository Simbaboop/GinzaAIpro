# Authority Order

## Purpose

This document defines how Project Canon determines which repository evidence governs when sources overlap. Authority is evaluated by scope first, then by the following order. A higher tier does not silently override a lower tier outside its stated scope.

## Order of authority

1. **Platform Constitution** — `governance/constitution/PLATFORM-CONSTITUTION.md` v1.0 is the highest platform authority. `SAOP.md` v0.1 is preserved as historical constitutional source material and remains effective only where incorporated into or consistent with Platform Constitution v1.0, as recorded by DEC-0012.
2. **Accepted decisions** — non-empty ADRs explicitly marked `Accepted` in `docs/architecture/adr/`, plus explicit human-approved canonical decisions recorded through `CHANGE_PROTOCOL.md` with durable resolution evidence.
3. **Explicit canonical architecture documents** — documents marked `Canonical` in `docs/architecture/`.
4. **Explicit canonical specifications** — versioned specifications or capability specifications explicitly marked canonical.
5. **Approved architecture and product specifications** — architecture and `docs/` specifications that state normative rules but do not carry an explicit canonical status.
6. **Implementation-local contracts** — subsystem and feature README files governing their own directory scope.
7. **Planning and exploratory material** — roadmaps, future-evolution notes, research, generated starter READMEs, and empty placeholders.

## Tie-breakers within a tier

Apply these tests in order:

1. A source with explicit status outranks an unstatused source.
2. A formally accepted ADR may amend or supersede a canonical architecture document when it explicitly says so.
3. A narrower rule governs its stated scope unless it violates a higher-tier rule.
4. A later source governs only when it explicitly amends, supersedes, absorbs, or replaces the earlier source, or when the later source is an unambiguous compatible extension.
5. A duplicated statement is not a new authority; retain the highest-authority source and record the duplicate as absorbed.
6. Filename date, file modification time, or numbering alone never proves supersession.

## Unresolved authority

When these tests do not produce a deterministic result, no source is selected arbitrarily. Create a conflict record in `registers/CONFLICT_REGISTER.md`, keep both sources traceable, and request a human decision under `CONFLICT_RESOLUTION.md`.

## Registry authority

The registry is an index and reconciliation layer. It does not rewrite source architecture. A registry entry is authoritative about status and relationships only after following `CHANGE_PROTOCOL.md`; the underlying rule text remains authoritative within its recorded source.
