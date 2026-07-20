# IRG-0002-R1: Evidence Semantics Implementation Readiness

## Gate decision

```text
PASS
```

## Status

Ratified. Authorizes E2-001-R2 subject to its exact scope and stop
conditions.

## Capability

Capability 002 — Evidence Semantics.

## Governing baseline

- RCO-0002;
- retained SAS-0002A;
- SAS-0002A-ADD-001;
- SAS-0002B;
- FEA-0002;
- released Capability 001 tag `capability-001-v1.0.0`.

## Gate finding

The reconciled specification is sufficiently complete, deterministic,
repository-aligned, testable, and bounded for implementation. No Capability
001 modification, graph model, ontology, infrastructure, or downstream
dependency is required.

## Frozen package boundary

```text
Path: packages/evidence-semantics
Name: @ginzaaipro/evidence-semantics
Runtime dependency: @ginzaaipro/domain
```

Authorized package integration:

- package manifest and TypeScript configuration following workspace
  conventions;
- automatic inclusion through `packages/*`;
- package source, tests, fixtures, and root package export;
- no root manifest or lockfile change unless workspace installation proves it
  strictly necessary.

Prohibited runtime dependencies:

- Core;
- Validation;
- Capture;
- Kernel;
- Intelligence;
- Recommendation;
- applications;
- AI providers;
- persistence, database, networking, and runtime infrastructure.

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

Capability 002 imports only released public contracts and consumes released
identifiers.

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

It also exports the six frozen version/rule constants required to construct
valid inputs and identify governed output.

It does not export:

- graphs, nodes, edges, relationships;
- taxonomy, ontology, aliases, classifications;
- internal constructors, hashing, rendering, candidate, conflict, registry,
  or ordering utilities.

SAS-0002B defines exact fields and invariants.

## Resolver result

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
```

The resolver is synchronous. Expected failures are typed results. Exceptions
are limited to programmer errors and internal invariant violations.

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

- preserves released relation namespace/name exactly;
- preserves the released canonical value;
- processes only the current component;
- creates no ontology or business classification;
- performs no prose parsing or inference.

### ES-002

- verifies released Evidence and component identity;
- verifies component membership;
- attaches `EVIDENCE` and `EVIDENCE_COMPONENT` references;
- completes rule/schema/resolver provenance;
- does not hash Evidence or create inferred references.

## Resolution accountability

Every component receives exactly one record:

```text
RESOLVED
NOT_APPLICABLE
UNRESOLVED
```

SAS-0002A-ADD-001 invariants apply. Silent omission is a construction
failure.

## Semantic value canonicalization

The resolver consumes the released `EvidenceValue` variant and payload.
Identity uses the exact released canonical strings/numbers represented as
ordered scalars. No locale formatting, rounding, coercion, case folding,
aliasing, or timestamp generation is allowed.

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

## Fixed identity vectors

These expected identifiers were calculated once using an independent Node
Web Crypto script that implemented only the encoding described above. The
Capability 002 implementation must not generate expected values in tests.

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
semantic-fact:v1:ce7cb9e88b08ef2e2f5292e68067a0221e670d28d546f28c985ccbd3ec930e4c
```

The value has five UTF-8 bytes. This vector detects UTF-16 length or
locale-dependent encoding.

## Canonical ordering

- Facts: component identity, predicate namespace, predicate name, fact
  identity.
- Resolutions: component identity, status, joined ordered fact identities.
- Per-record fact identities and codes: unsigned UTF-8 order with exact
  duplicate removal.
- Aggregate diagnostics: code, component identity or empty, rule identity or
  empty, Evidence identity or empty.

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

## Required tests

### Contracts and input

- exact enum/union values;
- valid Evidence;
- missing/foreign Evidence or component identity;
- unsupported schema;
- input immutability;
- output aggregate immutability.

### ES-001 and ES-002

- exact predicate/value preservation;
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
- fact, record, code, and diagnostic ordering.

### Identity and conflict

- all three fixed vectors;
- repeated and reordered equivalence;
- non-ASCII UTF-8;
- identity-bearing changes;
- diagnostic wording exclusion;
- diagnostic-code inclusion;
- incomplete identity/provenance;
- conflicting and non-equivalent duplicate failure.

### Boundaries and regression

- package exports;
- no graph/taxonomy/ontology contracts;
- only Domain runtime dependency;
- no prohibited imports, networking, persistence, or AI;
- acyclic workspace graph;
- Capability 001 files and tests unchanged;
- package and workspace build/typecheck/test.

## Exact implementation stop conditions

Stop when:

1. any governing artifact is missing or contradictory;
2. working tree contains unsafe unrelated changes;
3. Capability 001 must change;
4. released Evidence/component identities cannot be consumed;
5. predicate or canonical value is unavailable;
6. semantic identity requires importing/reproducing Capability 001 identity
   code;
7. ES-001 needs business interpretation;
8. ES-002 needs an inferred reference;
9. a runtime dependency beyond Domain is necessary;
10. a cycle or downstream dependency appears;
11. fixed vectors cannot be reproduced;
12. output changes with input or registry order;
13. package tests expose nondeterminism;
14. an unauthorized file must change.

## Gate conclusion

All readiness gates pass. Implementation is authorized only by E2-001-R2.
This gate is not release certification.
