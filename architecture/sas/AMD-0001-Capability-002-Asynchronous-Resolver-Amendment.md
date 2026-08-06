# AMD-0001 — Capability 002 Asynchronous Resolver Amendment

- Workflow status: Accepted
- Approved by: Simba Kanjanda
- Approval date: 2026-08-06
- Date: 2026-08-06
- Amends: RCO-0002 and SAS-0002B
- Scope: Capability 002 resolver execution contract only
- Source files:
  - `architecture/rco/RCO-0002-Capability-002-Evidence-Semantics-Reconciliation.md`
  - `architecture/sas/SAS-0002B-Deterministic-Evidence-Semantic-Resolution.md`
  - `architecture/fea/FEA-0002-Evidence-Semantics-Feasibility.md`
  - `architecture/irg/IRG-0002-R1-Evidence-Semantics-Implementation-Readiness.md`
  - `architecture/execution/E2-001-R2-Evidence-Semantics-Execution-Authorization.md`
- Related decisions: DEC-0011
- Resolves: CON-0007

## Existing text or effect

The active Capability 002 governance chain requires the public resolver to
return a synchronous typed result:

```typescript
resolveEvidenceSemantics(
  input: ResolveEvidenceSemanticsInput,
): ResolveEvidenceSemanticsResult
```

RCO-0002 and SAS-0002B explicitly describe the resolver as synchronous.
FEA-0002, IRG-0002-R1, and E2-001-R2 carry that requirement into feasibility,
readiness, and implementation authorization.

The same chain requires dependency-free Web Crypto SHA-256 identity
construction. The authorized Web Crypto operation,
`globalThis.crypto.subtle.digest`, returns a Promise and cannot satisfy a
synchronous resolver contract.

The combined requirements cannot both be implemented.

## Amendment

Replace only the Capability 002 resolver timing and return contract with:

```typescript
resolveEvidenceSemantics(
  input: ResolveEvidenceSemanticsInput,
): Promise<ResolveEvidenceSemanticsResult>
```

The resolver remains:

- deterministic;
- stateless;
- side-effect free;
- fail closed;
- independent of runtime context, clocks, duration, networking, persistence,
  and external I/O;
- restricted to the authorized Domain-only runtime dependency;
- based on package-local Web Crypto SHA-256 identity construction;
- required to return expected domain failures through the existing
  discriminated `ResolveEvidenceSemanticsResult`.

The Promise represents completion of deterministic SHA-256 identity
derivation. It does not authorize nondeterminism, orchestration, networking,
runtime expansion, asynchronous external services, or any additional
Capability 002 scope.

## Evidence and rationale

Repository evidence supports the amendment:

1. Capability 001 identity creation uses asynchronous
   `globalThis.crypto.subtle.digest`.
2. Validation propagates those identities through async factories while
   preserving typed discriminated results.
3. Canonical Domain entities use async Web Crypto identity construction
   without additional runtime dependencies.
4. The Core engine contract returns `Promise<EngineResult<TOutput>>`.
5. No existing Capability 002 implementation or consumer requires migration.
6. ADR-0017 and retained SAS-0002A do not require synchronous execution.
7. The Domain-only package boundary does not prohibit asynchronous functions.
8. A synchronous Node-specific or custom SHA-256 implementation would add an
   unsupported runtime boundary, dependency assumption, or maintenance risk.

The correction preserves architectural meaning and therefore does not require
a new ADR unless human architectural review determines otherwise.

## Compatibility and migration

No released Capability 002 implementation exists.

No source-code consumer currently references:

- `resolveEvidenceSemantics`;
- `ResolveEvidenceSemanticsResult`;
- `@ginzaaipro/evidence-semantics`.

The implementation impact is confined to the future public function return
type and corresponding async tests and callers.

All existing Capability 002 semantic contracts remain unchanged, including:

- ES-001 and ES-002;
- predicate and canonical-value preservation;
- per-component resolution accountability;
- immutable outputs;
- complete lineage and provenance;
- canonical identity material and fixed vectors;
- deterministic ordering;
- diagnostics;
- package ownership;
- prohibited scope;
- Capability 001 protection.

Rollback before implementation consists of rejecting this amendment and
retaining `STOPPED_FOR_GOVERNANCE`. After implementation, rollback requires a
separately governed migration because no synchronous dependency-free Web
Crypto implementation is currently authorized.

## Relationship updates

Accepted relationship effects:

- resolve CON-0007 in `CONFLICT_REGISTER.md`;
- record the resolution in `CANONICAL_INDEX.md`;
- classify RCO-0002 and SAS-0002B as amended by AMD-0001 within the Capability
  002 resolver-contract scope;
- preserve FEA-0002, IRG-0002-R1, and E2-001-R2 as historical evidence of the
  superseded contradictory chain;
- publish corrected feasibility evidence;
- issue a successor implementation-readiness artifact;
- issue a successor execution authorization;
- update DEC-0011 implementation relationships;
- review RULE-0026 and RULE-0027 while preserving their existing text and
  Active classifications unless separate evidence requires change;
- review and republish `AUTHORITATIVE_RULE_SET.md`;
- update `RECONCILIATION_REPORT.md`;
- update active Capability 002 references in `ROADMAP.md`;
- validate identifiers, links, forward relationships, reverse relationships,
  and conflict-resolution evidence.

This Accepted amendment does not by itself authorize implementation, verification,
release, tagging, deployment, production use, or any Capability 002 source
change.
