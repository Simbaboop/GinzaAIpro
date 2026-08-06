# FEA-0002-R1: Capability 002 Evidence Semantics Feasibility Assessment

## Verdict

```text
IMPLEMENTABLE
```

## Status

Completed for the IRG-0002-R2 implementation-readiness review.

This artifact supersedes FEA-0002 as the active Capability 002 feasibility
assessment. FEA-0002 remains preserved as historical evidence of the
synchronous-resolver contradiction resolved by CON-0007 and AMD-0001.

## Purpose

Determine whether the released Capability 001 repository can support the
bounded Evidence Semantics implementation governed by RCO-0002,
SAS-0002A-ADD-001, SAS-0002B, and accepted AMD-0001 without changing released
contracts or introducing prohibited architecture.

## Repository baseline

```text
Commit: 084bb8ebf2c761e470bcf78e413dd46a958e9e34
Tag:    capability-001-v1.0.0
```

Inspected packages:

- `@ginzaaipro/domain`;
- `@ginzaaipro/core`;
- `@ginzaaipro/capture`;
- `@ginzaaipro/validation`;
- `@ginzaaipro/kernel`.

## Governing correction

Accepted AMD-0001 changes only the resolver timing and return contract:

```typescript
resolveEvidenceSemantics(
  input: ResolveEvidenceSemanticsInput,
): Promise<ResolveEvidenceSemanticsResult>
```

The Promise represents completion of deterministic Web Crypto SHA-256
identity derivation. It does not authorize nondeterminism, orchestration,
network access, persistence, runtime expansion, external services, or any
additional Capability 002 scope.

## Support matrix

| Requirement | Repository support | Verdict |
| --- | --- | --- |
| Released Evidence identity | `Evidence.id` is a stable `Identifier`; released identities use `evidence:v2:` | Supported |
| Released component identity | Every `EvidenceComponent.id` is a stable `Identifier`; released identities use `evidence-component:v1:` | Supported |
| Component membership | `Evidence.components` is immutable, canonical, and exposes component identities | Supported |
| Released predicate | `EvidenceComponent.relation` exposes constrained namespace and name | Supported |
| Canonical value | Closed immutable `EvidenceValue` variants preserve canonical payloads | Supported |
| Evidence lineage | Component provenance and parent signal identifiers are immutable | Supported |
| Deterministic ordering | Capability 001 uses unsigned lexicographic UTF-8 byte ordering | Supported |
| SHA-256 | Web Crypto SHA-256 is already used without a runtime dependency | Supported |
| Immutable patterns | Classes defensively copy arrays and freeze canonical objects | Supported |
| Typed result pattern | Repository uses discriminated outcomes and immutable result classes | Supported |
| Standalone workspace package | `pnpm-workspace.yaml` includes `packages/*` | Supported |
| Static rules | ES-001 and ES-002 need no runtime registration or external data | Supported |
| Asynchronous deterministic execution | Required input is available in memory; Web Crypto SHA-256 returns a Promise and is already used through async repository boundaries | Supported |
| Package boundary | New package can depend only on `@ginzaaipro/domain` | Supported |
| Capability 001 protection | Resolver can consume public contracts and released IDs without changes | Supported |

## ES-001 feasibility

`EvidenceComponent.relation` contains the exact source-oriented predicate:

```text
namespace
name
```

`EvidenceComponent.value` contains a closed canonical representation. ES-001
can therefore copy both without parsing statement prose, accessing another
component, or introducing business interpretation.

## ES-002 feasibility

The resolver receives the parent `Evidence` object and each component from its
immutable `components` collection. ES-002 can:

- consume `Evidence.id`;
- consume `EvidenceComponent.id`;
- verify prefix and membership;
- attach `EVIDENCE` and `EVIDENCE_COMPONENT` references;
- record both frozen rules and versions.

It does not need to call or reproduce Capability 001 identity algorithms.

## Identity feasibility

Capability 002 can apply a package-local generic scalar encoder using the
repository convention:

```text
<utf8-byte-length>:<value>
```

The semantic identity markers and ordered material remain governed by
SAS-0002B. The package can await Web Crypto SHA-256 without adding a runtime
dependency or changing the deterministic identity material.

For identical canonical inputs, rule versions, ordering, and identity
material, asynchronous completion produces the same semantic identifiers and
ordered outputs.

## Async contract feasibility

The repository already supports asynchronous deterministic boundaries:

- Capture identity construction awaits `globalThis.crypto.subtle.digest`;
- Validation factories propagate asynchronous identity creation while
  returning typed discriminated results;
- Domain identity constructors use Web Crypto without additional runtime
  dependencies;
- Core engine execution returns `Promise<EngineResult<TOutput>>`.

The Capability 002 resolver can therefore return
`Promise<ResolveEvidenceSemanticsResult>` while preserving:

- fail-closed behavior;
- typed expected failures;
- deterministic ordering;
- immutable outputs;
- static rule evaluation;
- no external I/O;
- no runtime context dependency.

## Package feasibility

```text
@ginzaaipro/domain
          ^
          |
@ginzaaipro/evidence-semantics
```

No reverse dependency exists. Domain and Capability 001 do not import the new
package, so no cycle is introduced.

The asynchronous public function does not change this dependency boundary.

## Exclusion confirmation

The implementation requires no:

- semantic graph, node, or relationship;
- ontology, taxonomy, alias, or business classification;
- AI, embedding, vector search, or external knowledge;
- database, persistence, network, API, or UI;
- Core engine abstraction;
- Capture, Validation implementation, Intelligence, or Recommendation
  dependency;
- runtime plugin system;
- probabilistic confidence;
- synchronous hashing substitute;
- Node-specific cryptographic dependency;
- external asynchronous service.

## Risks and controls

| Risk | Control |
| --- | --- |
| Predicate drift | Preserve released namespace/name exactly |
| Value drift | Consume released `EvidenceValue`; no reformatting |
| Identity duplication | Consume released IDs; never reproduce their algorithms |
| Silent omission | One resolution record per component |
| Registry-order behavior | Static two-rule registry and canonical output sorting |
| Raw-data leakage | Diagnostics contain codes and safe identities only |
| Scope expansion | Package-boundary and forbidden-symbol tests |
| Async nondeterminism misconception | Test identical inputs across repeated and concurrent invocations |
| Promise rejection bypassing typed failures | Convert expected domain failures into `ResolveEvidenceSemanticsResult`; reserve rejection for unexpected defects only |
| Unauthorized synchronous workaround | Require Web Crypto SHA-256 and prohibit custom or Node-specific hashing implementations |

## Required verification

Implementation-readiness review must require tests proving:

1. the public resolver returns
   `Promise<ResolveEvidenceSemanticsResult>`;
2. identical inputs produce identical semantic identifiers and output order;
3. repeated and concurrent invocations produce equivalent results;
4. fixed identity vectors remain reproducible through Web Crypto SHA-256;
5. expected domain failures resolve to typed discriminated results;
6. no runtime dependency beyond `@ginzaaipro/domain` is introduced;
7. no network, persistence, clock, duration, or external runtime context is
   accessed;
8. Capability 001 source and released contracts remain unchanged.

## Implementation stop conditions

Implementation must stop if:

1. the repository baseline or released tag is unavailable;
2. Evidence or component stable identity is removed;
3. component relation or canonical value becomes unavailable;
4. Capability 001 must be modified;
5. semantic code must reproduce an Evidence identity algorithm;
6. ES-001 would require business interpretation;
7. ES-002 would require an inferred reference;
8. a runtime dependency beyond Domain becomes necessary;
9. a dependency cycle appears;
10. deterministic identity vectors cannot be reproduced;
11. expected domain failures cannot remain typed results;
12. asynchronous execution introduces access to external I/O or runtime
    context;
13. required tests expose nondeterminism;
14. an unauthorized synchronous hashing mechanism is required;
15. an unauthorized file or package must change;
16. a governing artifact is missing, contradictory, or not accepted.

## Relationship and authority

- Governing amendment: AMD-0001
- Resolved conflict: CON-0007
- Supersedes as active feasibility evidence: FEA-0002
- Required successor review: IRG-0002-R2
- Required successor execution authorization: E2-001-R3

This feasibility verdict does not authorize implementation, verification,
release, tagging, deployment, production use, or any Capability 002 source
change.

## Conclusion

The reconciled, graph-free Capability 002 is implementable with minimum
complexity in `packages/evidence-semantics` through a deterministic
asynchronous resolver returning
`Promise<ResolveEvidenceSemanticsResult>`.

Implementation remains prohibited until IRG-0002-R2 establishes readiness and
E2-001-R3 explicitly authorizes execution.
