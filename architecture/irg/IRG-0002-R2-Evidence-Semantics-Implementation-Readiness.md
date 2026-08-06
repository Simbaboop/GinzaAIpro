# IRG-0002-R2: Evidence Semantics Implementation Readiness

## Gate decision

```text
PASS
```

## Status

Ratified for successor execution authorization.

This artifact supersedes IRG-0002-R1 as the active Capability 002
implementation-readiness determination. IRG-0002-R1 remains preserved as
historical evidence of the synchronous-resolver chain superseded by accepted
AMD-0001.

This readiness gate does not itself authorize implementation. Implementation
remains prohibited until E2-001-R3 is accepted.

## Capability

Capability 002 — Evidence Semantics.

## Governing baseline

- RCO-0002;
- retained SAS-0002A;
- SAS-0002A-ADD-001;
- SAS-0002B as amended by accepted AMD-0001;
- AMD-0001;
- FEA-0002-R1;
- resolved CON-0007;
- released Capability 001 tag `capability-001-v1.0.0`.

## Gate finding

The reconciled specification is sufficiently complete, deterministic,
repository-aligned, testable, and bounded for successor execution
authorization.

The accepted resolver contract is asynchronous only because Web Crypto
SHA-256 returns a Promise:

```typescript
resolveEvidenceSemantics(
  input: ResolveEvidenceSemanticsInput,
): Promise<ResolveEvidenceSemanticsResult>
```

The Promise does not authorize nondeterminism, external I/O, runtime context,
network access, persistence, orchestration, external services, or additional
scope.

No Capability 001 modification, graph model, ontology, infrastructure, or
downstream dependency is required.

## Frozen package boundary

```text
Path: packages/evidence-semantics
Name: @ginzaaipro/evidence-semantics
Runtime dependency: @ginzaaipro/domain
```

Permitted package integration for a future execution authorization:

- package manifest and TypeScript configuration following workspace
  conventions;
- automatic inclusion through `packages/*`;
- package source, tests, fixtures, and root package export;
- no root manifest or lockfile change unless workspace installation proves it
  strictly necessary and the execution authorization permits it.

Prohibited runtime dependencies:

- Core;
- Validation;
- Capture;
- Kernel;
- Intelligence;
- Recommendation;
- applications;
- AI providers;
- persistence, database, networking, and runtime infrastructure;
- Node-specific cryptographic packages;
- external asynchronous services.

## Capability 001 protection

Implementation must not modify:

- `Evidence`;
- `EvidenceComponent` or supporting component contracts;
- Evidence rendering;
- Evidence or component identity algorithms;
- Capability 001 identity vectors;
- Validation behavior or tests;
- Capture behavior;
- the `capability-001-v1.0.0` tag.

Capability 002 may import only released public Domain contracts and consume
released identifiers.

## Frozen public surface

The package exports repository-compatible equivalents of:

- `EvidenceSemantics`;
- `SemanticFact`;
- `SemanticPredicate`;
- `SemanticReference`;
- `SemanticReferenceKind`;
- `SemanticRule`;
- `SemanticRuleIdentity`;
- `SemanticRuleVersion`;
- `SemanticSchemaVersion`;
- `SemanticResolverVersion`;
- `SemanticResolutionStatus`;
- `SemanticResolutionRecord`;
- `SemanticProvenance`;
- `SemanticDiagnostic`;
- `SemanticDiagnosticCode`;
- `ResolveEvidenceSemanticsInput`;
- `ResolveEvidenceSemanticsResult`;
- `resolveEvidenceSemantics`.

It also exports the six frozen version and rule constants required to
construct valid inputs and identify governed output.

It does not export:

- graphs, nodes, edges, or relationships;
- taxonomy, ontology, aliases, or classifications;
- internal constructors, hashing, rendering, candidate, conflict, registry,
  or ordering utilities.

SAS-0002B and accepted AMD-0001 define the exact fields, invariants, and
resolver timing contract.

## Resolver contract

```typescript
type ResolveEvidenceSemanticsResult =
  | Readonly<{
      ok: true;
      value: EvidenceSemantics;
      diagnostics: readonly SemanticDiagnostic[];
    }>
  | Readonly<{
      ok: false;
      value?: never;
      diagnostics: readonly SemanticDiagnostic[];
    }>;

declare function resolveEvidenceSemantics(
  input: ResolveEvidenceSemanticsInput,
): Promise<ResolveEvidenceSemanticsResult>;
```

Expected domain failures resolve to typed discriminated results.

Promise rejection is reserved for unexpected programmer defects or internal
invariant violations. Expected validation, rule, provenance, conflict,
membership, schema, and resolution failures must not bypass the typed result
contract.

The resolver remains:

- deterministic;
- stateless;
- side-effect free;
- fail closed;
- independent of clocks, duration, networking, persistence, runtime context,
  and external I/O.

## Frozen versions and registry

```text
semantic-schema:v1
semantic-resolver:v1
ES-001
ES-001:v1
ES-002
ES-002:v1
```

The immutable registry contains exactly ES-001 and ES-002. No runtime
registration, priority, fallback, reflection, or plugin loading is allowed.

## Rule behavior

### ES-001

- preserves released relation namespace and name exactly;
- preserves the released canonical value;
- processes only the current component;
- creates no ontology or business classification;
- performs no prose parsing or inference.

### ES-002

- verifies released Evidence and component identity;
- verifies component membership;
- attaches `EVIDENCE` and `EVIDENCE_COMPONENT` references;
- completes rule, schema, and resolver provenance;
- does not hash Evidence or create inferred references.

## Resolution accountability

Every component receives exactly one record:

```text
RESOLVED
NOT_APPLICABLE
UNRESOLVED
```

SAS-0002A-ADD-001 invariants apply. Silent omission is a construction failure.

## Semantic value canonicalization

The resolver consumes the released `EvidenceValue` variant and payload.
Identity uses the exact released canonical strings and numbers represented as
ordered scalars.

No locale formatting, rounding, coercion, case folding, aliasing, timestamp
generation, or runtime-derived value is allowed.

## Identity encoding

For each scalar:

```text
<utf8-byte-length>:<value>
```

Length uses UTF-8 bytes and canonical base-10. Encoded scalars concatenate
without a separator. SHA-256 is rendered as lowercase hexadecimal.

Unsigned lexicographic UTF-8 byte ordering is mandatory. `localeCompare` is
prohibited.

SAS-0002B freezes complete fact and aggregate identity material.

Web Crypto SHA-256 must be awaited. A custom synchronous implementation,
Node-specific cryptographic substitute, external service, or additional
runtime dependency is prohibited.

## Fixed identity vectors

The fixed expected identifiers remain unchanged because AMD-0001 changes only
resolver timing, not canonical identity material.

### Vector 1 — integer Semantic Fact

Input scalars:

```text
semantic-fact:v1
evidence:v2:0154d32c5270a28ac7ba5775f611bfad65abe689e2aeb2809817e5de551156bc
evidence-component:v1:ec0abcfac9e3056c4161dd77bae5303802236a003c5c1c9dd794cd57ea9cd133
ginzaaipro.business-signal
value
integer
42
semantic-schema:v1
ES-001
ES-001:v1
ES-002
ES-002:v1
semantic-resolver:v1
```

Expected:

```text
semantic-fact:v1:6a4c3193692678c1bd8e3c6a07cad870b16969d26a9c2d293775a3f668a0baae
```

### Vector 2 — EvidenceSemantics aggregate

Input scalars:

```text
evidence-semantics:v1
evidence:v2:0154d32c5270a28ac7ba5775f611bfad65abe689e2aeb2809817e5de551156bc
semantic-schema:v1
semantic-resolver:v1
1
semantic-fact:v1:6a4c3193692678c1bd8e3c6a07cad870b16969d26a9c2d293775a3f668a0baae
1
evidence-component:v1:ec0abcfac9e3056c4161dd77bae5303802236a003c5c1c9dd794cd57ea9cd133
RESOLVED
1
semantic-fact:v1:6a4c3193692678c1bd8e3c6a07cad870b16969d26a9c2d293775a3f668a0baae
0
```

Expected:

```text
evidence-semantics:v1:9edd64a2257cfb47bd4600720cf10cc33f9eff4cebddda0d17ef941b845a21ee
```

### Vector 3 — non-ASCII text

Vector 1 with value kind `text` and value `café` produces:

```text
semantic-fact:v1:75dc8425b955d541f801e5e86ffd9f21793a5bec31bf134e60f116fc3eb51e70
```

The value has five UTF-8 bytes. This vector detects UTF-16 length or
locale-dependent encoding.

Expected vector values must remain static test fixtures. Implementation tests
must not calculate their own expected values.

## Canonical ordering

- Facts: component identity, predicate namespace, predicate name, fact
  identity.
- Resolutions: component identity, status, joined ordered fact identities.
- Per-record fact identities and codes: unsigned UTF-8 order with exact
  duplicate removal.
- Aggregate diagnostics: code, component identity or empty, rule identity or
  empty, Evidence identity or empty.

Asynchronous completion order must not affect canonical ordering.

## Diagnostic catalog

Only:

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

Messages do not participate in identity and must not expose raw values or
source records.

## Immutability

Canonical contracts and returned arrays are defensively copied and frozen.
Repeated calls return independent immutable results. Rules retain no mutable
execution state. Input Evidence remains unchanged.

Concurrent invocations must not share mutable execution state.

## Required tests

### Contracts and input

- exact enum and union values;
- valid Evidence;
- missing or foreign Evidence or component identity;
- unsupported schema;
- input immutability;
- output aggregate immutability;
- public resolver return type is
  `Promise<ResolveEvidenceSemanticsResult>`.

### ES-001 and ES-002

- exact predicate and value preservation;
- all released value variants;
- no alias, ontology, or classification;
- unrelated component independence;
- exact released references;
- membership and provenance failure;
- no Evidence identity recomputation.

### Accountability and ordering

- one record per component;
- all three statuses and their invariants;
- silent omission rejection;
- deterministic rule-order independence;
- duplicate collapse;
- fact, record, code, and diagnostic ordering;
- asynchronous completion order does not change output order.

### Identity and conflict

- all three fixed vectors;
- repeated and reordered equivalence;
- repeated asynchronous invocation equivalence;
- concurrent invocation equivalence;
- non-ASCII UTF-8;
- identity-bearing changes;
- diagnostic wording exclusion;
- diagnostic-code inclusion;
- incomplete identity or provenance;
- conflicting and non-equivalent duplicate failure.

### Failure behavior

- expected domain failures resolve with `ok: false`;
- expected domain failures do not reject the Promise;
- unexpected invariant defects may reject;
- no unhandled Promise rejection occurs in required tests.

### Boundaries and regression

- package exports;
- no graph, taxonomy, or ontology contracts;
- only Domain runtime dependency;
- no prohibited imports, networking, persistence, clocks, duration, runtime
  context, external services, or AI;
- no Node-specific or custom synchronous hashing;
- acyclic workspace graph;
- Capability 001 files and tests unchanged;
- package and workspace build, typecheck, and test.

## Exact implementation stop conditions

Stop when:

1. any governing artifact is missing, contradictory, or not accepted;
2. the working tree contains unsafe unrelated changes;
3. Capability 001 must change;
4. released Evidence or component identities cannot be consumed;
5. predicate or canonical value is unavailable;
6. semantic identity requires importing or reproducing Capability 001
   identity code;
7. ES-001 needs business interpretation;
8. ES-002 needs an inferred reference;
9. a runtime dependency beyond Domain is necessary;
10. a cycle or downstream dependency appears;
11. fixed vectors cannot be reproduced;
12. output changes with input order, registry order, invocation repetition, or
    concurrent invocation;
13. expected domain failures cannot remain typed results;
14. an expected domain failure rejects the Promise;
15. asynchronous execution accesses networking, persistence, clocks, duration,
    runtime context, or external services;
16. a custom synchronous or Node-specific hashing substitute becomes
    necessary;
17. package tests expose nondeterminism;
18. an unauthorized file must change.

## Relationship and authority

- Governing amendment: AMD-0001
- Active feasibility evidence: FEA-0002-R1
- Resolved conflict: CON-0007
- Supersedes as active readiness evidence: IRG-0002-R1
- Required successor execution authorization: E2-001-R3

## Gate conclusion

All implementation-readiness gates pass for the deterministic asynchronous
resolver contract established by accepted AMD-0001.

Implementation remains prohibited until E2-001-R3 explicitly authorizes the
bounded execution scope.

This gate is not implementation authorization, verification certification,
release certification, deployment authority, or production authority.
