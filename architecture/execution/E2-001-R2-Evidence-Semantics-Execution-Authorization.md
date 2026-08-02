# E2-001-R2: Evidence Semantics Execution Authorization

## Decision

```text
AUTHORIZED FOR IMPLEMENTATION
```

## Status

Executor-independent authorization for Capability 002 implementation.

This document does not certify release readiness, authorize a tag, or
authorize deployment.

## Authority

- RCO-0002;
- retained SAS-0002A;
- SAS-0002A-ADD-001;
- SAS-0002B;
- FEA-0002 (`IMPLEMENTABLE`);
- IRG-0002-R1 (`PASS`);
- Capability 001 release `capability-001-v1.0.0`.

## Mission

Implement the minimum deterministic Evidence Semantics capability that
projects the predicate and canonical value already expressed by released
Evidence components into immutable Semantic Facts with complete lineage and
resolution accountability.

Do not create new meaning.

## Mandatory repository inspection

Before editing:

1. confirm branch, commit, tag, and working-tree safety;
2. locate every governing artifact;
3. inspect workspace/package conventions;
4. inspect released Evidence, component, relation, value, and identity
   surfaces;
5. inspect result, diagnostic, immutability, ordering, hashing, build,
   typecheck, test, and lint conventions;
6. confirm no released Capability 002 implementation exists;
7. evaluate every IRG stop condition.

## Authorized package

```text
packages/evidence-semantics
@ginzaaipro/evidence-semantics
```

Authorized files:

- package manifest and TypeScript configuration;
- package source under `src/`;
- package tests and fixed-vector fixtures;
- package root exports;
- minimum workspace/package-boundary integration required by existing
  conventions.

The workspace glob already includes `packages/*`. Do not change unrelated
workspace configuration.

## Capability 001 protection

Do not modify:

- Domain Evidence or component contracts;
- Evidence rendering or behavior;
- Evidence/component identity construction;
- Validation or Capture behavior;
- Capability 001 tests or vectors;
- the release tag.

Import released contracts through `@ginzaaipro/domain`. Consume released
identities; do not regenerate or reproduce them.

## Required implementation

Implement the public contracts frozen by SAS-0002B and:

```typescript
resolveEvidenceSemantics(
  input: ResolveEvidenceSemanticsInput,
): ResolveEvidenceSemanticsResult
```

The resolver must be synchronous, deterministic, stateless, side-effect free,
and fail closed.

Expected domain failures return typed results. Exceptions are for programmer
errors and internal invariant violations only.

## Frozen rules

The static immutable registry contains exactly:

```text
ES-001@ES-001:v1
ES-002@ES-002:v1
```

### ES-001

- preserve component relation namespace and name exactly;
- preserve canonical `EvidenceValue`;
- process only the current component;
- introduce no alias, ontology, classification, or business interpretation.

### ES-002

- verify released Evidence and component identities;
- verify membership;
- attach `EVIDENCE` and `EVIDENCE_COMPONENT` references;
- complete frozen rule/schema/resolver provenance;
- never hash Evidence or create inferred references.

## Resolution accountability

Evaluate every Evidence component exactly once. Produce exactly one record
with:

```text
RESOLVED
NOT_APPLICABLE
UNRESOLVED
```

Apply SAS-0002A-ADD-001 invariants. Silent omission is prohibited.

## Identity and ordering

Implement the exact encoding, ordered material, prefixes, fixed vectors, and
canonical ordering frozen by SAS-0002B and IRG-0002-R1.

Use Web Crypto SHA-256 and package-local generic scalar encoding. Add no
hashing dependency. Do not import Capability 001 identity utilities.

Output must be independent of:

- component insertion order;
- registry iteration order;
- object enumeration order;
- locale;
- execution time;
- environment;
- diagnostic wording.

## Diagnostics

Implement only:

```text
SEMANTIC_INPUT_INVALID
SEMANTIC_PREDICATE_INVALID
SEMANTIC_RULE_NOT_FOUND
SEMANTIC_RULE_FAILURE
SEMANTIC_PROVENANCE_INCOMPLETE
SEMANTIC_UNRESOLVED
SEMANTIC_CONFLICT
SEMANTIC_SCHEMA_UNSUPPORTED
```

Diagnostics are immutable, deterministic, ordered, and privacy-safe.

## Prohibited scope

Do not implement:

- graph, node, edge, relationship, ontology, taxonomy, alias, classification,
  migration, or compatibility contracts;
- diagnosis, materiality, leakage, priority, recommendation, score, rank,
  forecast, optimization, or causal reasoning;
- AI, embeddings, semantic/vector search, database, persistence, networking,
  APIs, UI, workflow, runtime orchestration, or plugin discovery;
- tenant-specific vocabularies;
- probabilistic confidence;
- infrastructure for hypothetical future capabilities.

## Required tests

Implement every test required by IRG-0002-R1, including:

- public contracts and exports;
- input and output immutability;
- every released value variant;
- ES-001 and ES-002;
- exact references and provenance;
- one resolution record per component;
- deterministic ordering and duplicate handling;
- fail-closed conflicts;
- safe diagnostics;
- unsupported schema;
- three fixed vectors;
- non-ASCII UTF-8;
- package boundaries and cycle detection;
- unchanged Capability 001;
- package and workspace regression.

Do not weaken existing tests.

## Verification commands

Discover and use repository scripts. At minimum:

```powershell
pnpm install
pnpm --filter @ginzaaipro/evidence-semantics build
pnpm --filter @ginzaaipro/evidence-semantics typecheck
pnpm --filter @ginzaaipro/evidence-semantics test
pnpm --filter @ginzaaipro/domain test
pnpm --filter @ginzaaipro/validation test
pnpm build
pnpm typecheck
pnpm test
git status --short
git diff --stat
```

Run lint only if an existing script exists. Do not add a lint system.

Do not claim an unexecuted command passed. Separate environmental limitations
from implementation failures.

## Stop conditions

Stop without speculative changes when any IRG-0002-R1 stop condition occurs,
when an unauthorized file is required, or when repository evidence conflicts
with this authorization.

Report the exact requirement, impact, and minimum governance correction.

## Final implementation report

Return:

1. repository baseline and governance inspection;
2. files created and modified;
3. package dependencies and public exports;
4. resolver, rule, provenance, identity, ordering, diagnostic, and
   accountability behavior;
5. exact verification commands and results;
6. Capability 001 regression status;
7. deviations, stop conditions, and unresolved risks;
8. final working-tree status;
9. recommendation:
   `READY_FOR_EVR-0002`, `STOPPED_FOR_GOVERNANCE`, or
   `IMPLEMENTATION_INCOMPLETE`.

## Completion boundary

After implementation and verification, stop. Do not perform EVR-0002,
ACR-0002, release certification, tagging, or pushing without separate
authorization.
