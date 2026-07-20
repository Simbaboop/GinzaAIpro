# SAS-0002B: Deterministic Evidence Semantic Resolution

## Status

Normative for Capability 002 implementation.

## Governing artifacts

- ADR-0017;
- ADR-0018;
- retained SAS-0002A;
- RCO-0002;
- SAS-0002A-ADD-001;
- FEA-0002;
- IRG-0002-R1.

## Purpose

Freeze the minimum synchronous deterministic resolver that transforms one
released canonical Evidence aggregate into immutable Evidence Semantics.

The resolver answers only:

> What predicate and canonical value does this released Evidence component
> explicitly represent?

It does not interpret why the fact exists, whether it is material, or what
should happen next.

## Frozen constants

```text
semantic schema:  semantic-schema:v1
resolver:         semantic-resolver:v1
rule 1 identity:  ES-001
rule 1 version:   ES-001:v1
rule 2 identity:  ES-002
rule 2 version:   ES-002:v1
```

These values are literals. They are not derived from package version, Git,
time, build, or environment.

## Package and dependencies

```text
Package path: packages/evidence-semantics
Package name: @ginzaaipro/evidence-semantics
Runtime dependency: @ginzaaipro/domain
```

No other runtime dependency is authorized.

The package must not depend on Core, Validation, Capture, Kernel,
Intelligence, Recommendation, applications, AI providers, persistence,
networking, or runtime orchestration.

## Public contracts

The package exports only:

```typescript
type SemanticReferenceKind = "EVIDENCE" | "EVIDENCE_COMPONENT";

type SemanticResolutionStatus =
  | "RESOLVED"
  | "NOT_APPLICABLE"
  | "UNRESOLVED";

type SemanticDiagnosticCode =
  | "SEMANTIC_INPUT_INVALID"
  | "SEMANTIC_PREDICATE_INVALID"
  | "SEMANTIC_RULE_NOT_FOUND"
  | "SEMANTIC_RULE_FAILURE"
  | "SEMANTIC_PROVENANCE_INCOMPLETE"
  | "SEMANTIC_UNRESOLVED"
  | "SEMANTIC_CONFLICT"
  | "SEMANTIC_SCHEMA_UNSUPPORTED";

type SemanticRuleIdentity = "ES-001" | "ES-002";
type SemanticRuleVersion = "ES-001:v1" | "ES-002:v1";
type SemanticSchemaVersion = "semantic-schema:v1";
type SemanticResolverVersion = "semantic-resolver:v1";

interface SemanticRule {
  readonly identity: SemanticRuleIdentity;
  readonly version: SemanticRuleVersion;
}

interface SemanticPredicate {
  readonly namespace: string;
  readonly name: string;
}

interface SemanticReference {
  readonly kind: SemanticReferenceKind;
  readonly identity: Identifier;
}

interface SemanticProvenance {
  readonly evidenceReference: SemanticReference;
  readonly componentReference: SemanticReference;
  readonly projectionRule: SemanticRule;
  readonly referenceRule: SemanticRule;
  readonly semanticSchemaVersion: SemanticSchemaVersion;
  readonly resolverVersion: SemanticResolverVersion;
}

interface SemanticFact {
  readonly id: Identifier;
  readonly predicate: SemanticPredicate;
  readonly value: EvidenceValue;
  readonly provenance: SemanticProvenance;
}

interface SemanticResolutionRecord {
  readonly componentReference: SemanticReference;
  readonly status: SemanticResolutionStatus;
  readonly semanticFactIds: readonly Identifier[];
  readonly diagnosticCodes: readonly SemanticDiagnosticCode[];
}

interface SemanticDiagnostic {
  readonly code: SemanticDiagnosticCode;
  readonly message: string;
  readonly evidenceId?: Identifier;
  readonly componentId?: Identifier;
  readonly ruleIdentity?: SemanticRuleIdentity;
}

interface EvidenceSemantics {
  readonly id: Identifier;
  readonly evidenceReference: SemanticReference;
  readonly semanticSchemaVersion: SemanticSchemaVersion;
  readonly resolverVersion: SemanticResolverVersion;
  readonly facts: readonly SemanticFact[];
  readonly resolutions: readonly SemanticResolutionRecord[];
  readonly diagnostics: readonly SemanticDiagnostic[];
}

interface ResolveEvidenceSemanticsInput {
  readonly evidence: Evidence;
  readonly semanticSchemaVersion: string;
}

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

Repository-compatible immutable classes or factory-owned structures may
implement these conceptual interfaces. Public callers must not directly
construct canonical facts, provenance, resolution records, or aggregates.

## Resolver

```typescript
resolveEvidenceSemantics(
  input: ResolveEvidenceSemanticsInput,
): ResolveEvidenceSemanticsResult
```

The resolver is synchronous, deterministic, stateless, and side-effect free.

Expected domain failures return `ok: false`. Exceptions are reserved for
programmer errors and violated internal invariants.

## Input validation

The operation fails before rule execution when:

- input is not an object;
- `evidence` is not released canonical `Evidence`;
- Evidence identity does not begin `evidence:v2:`;
- a component identity does not begin `evidence-component:v1:`;
- component membership is inconsistent;
- the schema is not exactly `semantic-schema:v1`;
- required identity material is missing.

Unsupported schema returns only `SEMANTIC_SCHEMA_UNSUPPORTED`. Other invalid
aggregate input returns `SEMANTIC_INPUT_INVALID` or
`SEMANTIC_PROVENANCE_INCOMPLETE`, as applicable.

## Canonical value

Capability 002 consumes the released `EvidenceValue` without coercion.

Canonical scalar serialization is:

| Kind | Ordered scalars |
| --- | --- |
| `text` | `text`, `value` |
| `boolean` | `boolean`, `true` or `false` |
| `integer` | `integer`, canonical integer string |
| `decimal` | `decimal`, canonical decimal string |
| `instant` | `instant`, canonical UTC instant |
| `money` | `money`, canonical minor units, currency |
| `percentage` | `percentage`, canonical basis points |

No reformatting, case folding, locale formatting, rounding, parsing, or
normalization is authorized.

## Static rule registry

The immutable registry contains exactly, and only:

```text
ES-001@ES-001:v1
ES-002@ES-002:v1
```

No plugin loader, registration API, dependency-injection container,
reflection, priority, fallback, or last-write-wins behavior is permitted.
Output cannot depend on registry iteration order.

## ES-001 — Canonical Predicate Projection

For each current Evidence component, ES-001:

1. validates the released relation;
2. copies `relation.namespace` exactly;
3. copies `relation.name` exactly;
4. consumes the released canonical `EvidenceValue`;
5. creates one Semantic Fact draft for the current component.

ES-001 does not:

- alter predicate case or separators;
- map aliases;
- add namespaces;
- inspect another component;
- infer a subject, ontology class, business identity, label, or meaning;
- parse statement prose;
- use external data.

## ES-002 — Evidence Component Semantic Reference

For each ES-001 draft, ES-002:

1. verifies the released Evidence identity;
2. verifies the released component identity;
3. verifies component membership in the supplied Evidence;
4. creates one `EVIDENCE` reference;
5. creates one `EVIDENCE_COMPONENT` reference;
6. completes Semantic Provenance using both frozen rules and versions.

ES-002 never hashes Evidence, derives a replacement identity, invents an
endpoint, creates a graph relationship, or creates a business reference.

## Eligibility and accountability

Every component is evaluated once.

A current Capability 001 component is eligible when its released identity,
membership, relation, canonical value, and schema are valid.

- Successful ES-001 and ES-002 execution produces `RESOLVED`.
- Valid future material explicitly outside the two-rule surface produces
  `NOT_APPLICABLE`.
- Apparently eligible material that cannot be deterministically completed
  produces `UNRESOLVED` with at least one diagnostic.
- Invalid aggregate input fails the operation.

SAS-0002A-ADD-001 governs record invariants. No component disappears.

## Diagnostics

Only the eight frozen codes may be emitted:

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

Diagnostics are immutable, deterministic, canonically ordered, and
privacy-safe. They may contain released Evidence/component identifiers and
frozen rule identifiers. They must not contain raw values, source records,
credentials, tokens, secrets, or customer data.

Diagnostic wording is excluded from identity.

## Canonical ordering

Unsigned lexicographic comparison of NFC-normalized UTF-8 byte sequences is
used. Locale-sensitive comparison is prohibited.

Facts sort by:

1. component identity;
2. predicate namespace;
3. predicate name;
4. Semantic Fact identity.

Resolution records sort by:

1. component identity;
2. status;
3. joined ordered fact identities.

Within a record, fact identities and diagnostic codes are sorted and exact
duplicates removed.

Aggregate diagnostics sort by:

1. code;
2. component identity or empty string;
3. rule identity or empty string;
4. Evidence identity or empty string.

## Identity encoding

Identity uses the released repository convention:

1. encode each scalar as UTF-8;
2. prefix it with `<utf8-byte-length>:`;
3. concatenate the prefixed scalars with no separator;
4. hash the complete UTF-8 sequence using SHA-256;
5. render 64 lowercase hexadecimal characters.

Semantic code must use its own package-local generic encoding helper. It must
not import or reproduce Capability 001 Evidence identity algorithms or
markers.

### Semantic Fact identity

Prefix:

```text
semantic-fact:v1:
```

Ordered scalars:

1. `semantic-fact:v1`;
2. released Evidence identity;
3. released component identity;
4. predicate namespace;
5. predicate name;
6. canonical value kind and payload scalars;
7. `semantic-schema:v1`;
8. `ES-001`;
9. `ES-001:v1`;
10. `ES-002`;
11. `ES-002:v1`;
12. `semantic-resolver:v1`.

### EvidenceSemantics identity

Prefix:

```text
evidence-semantics:v1:
```

Ordered scalars:

1. `evidence-semantics:v1`;
2. released Evidence identity;
3. `semantic-schema:v1`;
4. `semantic-resolver:v1`;
5. fact count;
6. canonically ordered Semantic Fact identities;
7. resolution-record count;
8. canonical material for each ordered resolution record.

Each resolution record contributes:

1. component identity;
2. status;
3. fact-identity count;
4. ordered fact identities;
5. diagnostic-code count;
6. ordered diagnostic codes.

Diagnostics, execution time, input order, object enumeration order, locale,
package version, Git state, and environment are excluded.

## Conflict policy

The operation fails closed with `SEMANTIC_CONFLICT` and no aggregate when:

- one fact identity maps to non-equivalent content;
- one component/predicate maps to different canonical values;
- duplicate identity-bearing output is non-equivalent;
- provenance conflicts with supplied Evidence;
- identity material is incomplete;
- registry order changes output.

No priority, heuristic, fallback, or last-write-wins is authorized.

## Immutability

All canonical output objects and arrays are defensively copied and frozen,
consistent with repository conventions. Rules retain no mutable execution
state. Repeated execution returns independent immutable object structures
with equivalent content.

The resolver never mutates Evidence or caller-owned collections.

## Explicit exclusions

Capability 002 contains no:

- graph, node, edge, ontology, taxonomy, classification, alias, migration, or
  compatibility framework;
- diagnosis, materiality, leakage, recommendation, priority, score, rank,
  forecast, optimization, or causal reasoning;
- AI, embeddings, search, persistence, database, API, UI, workflow, network,
  external service, or plugin discovery.

## Required verification

Tests must cover contracts, immutability, all `EvidenceValue` variants,
ES-001, ES-002, accountability, ordering, deterministic identities, fixed
vectors, conflicts, safe diagnostics, schema rejection, package exports,
boundaries, Capability 001 regression, package build/typecheck/tests, and
full workspace build/typecheck/tests.

No lint command is required unless the repository defines one.
