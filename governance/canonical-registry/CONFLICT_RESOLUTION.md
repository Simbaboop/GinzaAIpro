# Conflict Resolution

## Purpose

This process resolves incompatible rules without silently changing GinzaAIpro architecture.

## What counts as a conflict

A conflict exists when two in-scope statements cannot both be followed, assign the same responsibility to incompatible owners, define the same term incompatibly, or claim overlapping authority without a deterministic precedence result. Compatible elaboration is an extension, not a conflict. Repeated wording is a duplicate, not a conflict.

## Resolution procedure

1. Open a `CON-####` record using `templates/CONFLICT_TEMPLATE.md`.
2. Quote or precisely summarize both claims and link their source files.
3. Define the smallest scope in which they collide.
4. Apply `AUTHORITY_ORDER.md`, including its within-tier tie-breakers.
5. Check accepted ADRs and explicit supersession or amendment evidence.
6. Record one outcome:
   - **Resolved — authority**: a higher-authority source deterministically governs.
   - **Resolved — scope**: both remain valid in distinct scopes.
   - **Resolved — duplicate**: one source is absorbed without loss of meaning.
   - **Open — human decision required**: repository evidence is insufficient.
7. Update all affected registers and both directions of every relationship.

## Human decision packet

An open conflict must state the decision question, viable options, architectural consequences, affected rules and files, and the safest default while pending. The default must preserve current behavior and must not introduce new authority.

## Resolution evidence

A human resolution becomes canonical only when captured by an accepted ADR, explicit canonical decision, or approved amendment with a repository source. Meeting notes or informal comments may support context but do not resolve the conflict by themselves.

## No silent precedence

Recency, implementation existence, or directory location alone is insufficient to settle a conflict. Until resolved, the conflict remains visible in `CONFLICT_REGISTER.md` and `CANONICAL_INDEX.md`.
