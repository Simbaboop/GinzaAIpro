# E2-001-R3: Evidence Semantics Execution Authorization

## Decision

```text
AUTHORIZED FOR IMPLEMENTATION
```

## Status

Executor-independent authorization for Capability 002 implementation under
the asynchronous resolver contract established by accepted AMD-0001.

This document supersedes E2-001-R2 as the active execution authorization.
E2-001-R2 remains preserved as historical evidence of the superseded
synchronous-resolver chain.

This document does not certify release readiness, authorize a tag, authorize
deployment, or authorize production use.

## Authority

- RCO-0002 as amended by accepted AMD-0001;
- retained SAS-0002A;
- SAS-0002A-ADD-001;
- SAS-0002B as amended by accepted AMD-0001;
- AMD-0001 (`Accepted`);
- AMD-0002 (`Accepted`);
- FEA-0002-R1 (`IMPLEMENTABLE`);
- IRG-0002-R2 (`PASS`);
- resolved CON-0007;
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
2. locate and inspect every governing artifact;
3. inspect workspace and package conventions;
4. inspect released Evidence, component, relation, value, and identity
   surfaces;
5. inspect result, diagnostic, immutability, ordering, Web Crypto SHA-256,
   asynchronous, build, typecheck, test, and lint conventions;
6. confirm no released Capability 002 implementation exists;
7. evaluate every IRG-0002-R2 stop condition.

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
- minimum workspace and package-boundary integration required by existing
  conventions.

The workspace glob already includes `packages/*`. Do not change unrelated
workspace configuration. Do not change the root manifest or lockfile unless
workspace installation proves the change strictly necessary.

## Package boundary

The only authorized runtime dependency is:

```text
@ginzaaipro/domain
```

Do not add a runtime dependency on Core, Validation, Capture, Kernel,
Intelligence, Recommendation, applications, AI providers, persistence,
database, networking, runtime infrastructure, Node-specific cryptography, or
external asynchronous services.

## Capability 001 protection

Do not modify:

- Domain Evidence or component contracts;
- Evidence rendering or behavior;
- Evidence or component identity construction;
- Validation or Capture behavior;
- Capability 001 tests or vectors;
- the `capability-001-v1.0.0` release tag.

Import released contracts through `@ginzaaipro/domain`. Consume released
identities; do not regenerate or reproduce them.

## Required implementation

Implement the public contracts frozen by SAS-0002B and accepted AMD-0001,
including:

```typescript
resolveEvidenceSemantics(
  input: ResolveEvidenceSemanticsInput,
): Promise<ResolveEvidenceSemanticsResult>
```

The resolver must be asynchronous only to await deterministic Web Crypto
SHA-256 identity derivation. It remains deterministic, stateless, side-effect
free, fail closed, and independent of clocks, duration, networking,
persistence, runtime context, external I/O, and external services.

Expected domain failures must resolve to typed discriminated results.
Promise rejection is reserved for programmer errors and internal invariant
violations only.

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
- complete frozen rule, schema, and resolver provenance;
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
canonical ordering frozen by SAS-0002B and IRG-0002-R2.

Use awaited Web Crypto SHA-256 and package-local generic scalar encoding. Add
no hashing dependency. Do not import Capability 001 identity utilities. Do
not implement custom synchronous or Node-specific hashing.

Output must be independent of:

- component insertion order;
- registry iteration order;
- asynchronous completion order;
- repeated or concurrent invocation;
- object enumeration order;
- locale;
- execution time or duration;
- environment or runtime context;
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
- AI, embeddings, semantic or vector search, database, persistence,
  networking, APIs, UI, workflow, runtime orchestration, or plugin discovery;
- tenant-specific vocabularies;
- probabilistic confidence;
- infrastructure for hypothetical future capabilities;
- synchronous hashing substitutes or external asynchronous services.

## Required tests

Implement every test required by IRG-0002-R2, including:

- public contracts, exports, and Promise return type;
- input and output immutability;
- every released value variant;
- ES-001 and ES-002;
- exact references and provenance;
- one resolution record per component;
- deterministic ordering and duplicate handling;
- asynchronous completion-order independence;
- repeated and concurrent invocation equivalence;
- expected failures resolve to typed results without Promise rejection;
- fail-closed conflicts;
- safe diagnostics;
- unsupported schema;
- three fixed vectors;
- non-ASCII UTF-8;
- package boundaries and cycle detection;
- absence of prohibited I/O, clocks, runtime context, and hashing substitutes;
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

Stop without speculative changes when any IRG-0002-R2 stop condition occurs,
when an unauthorized file is required, or when repository evidence conflicts
with this authorization.

Report the exact requirement, impact, and minimum governance correction.

## Final implementation report

Return:

1. repository baseline and governance inspection;
2. files created and modified;
3. package dependencies and public exports;
4. resolver, rule, provenance, identity, ordering, diagnostic, asynchronous,
   and accountability behavior;
5. exact verification commands and results;
6. Capability 001 regression status;
7. deviations, stop conditions, and unresolved risks;
8. final working-tree status;
9. recommendation:
   `READY_FOR_EVR-0002`, `STOPPED_FOR_GOVERNANCE`, or
   `IMPLEMENTATION_INCOMPLETE`.

## Relationship and authority

- Governing amendment: AMD-0001
- Active feasibility evidence: FEA-0002-R1
- Active readiness evidence: IRG-0002-R2
- Resolved conflict: CON-0007
- Verification correction: AMD-0002; resolved CON-0008
- Supersedes as active execution authorization: E2-001-R2

## Completion boundary

After implementation and verification, stop. Do not perform EVR-0002,
ACR-0002, release certification, tagging, pushing, deployment, or production
use without separate authorization.
