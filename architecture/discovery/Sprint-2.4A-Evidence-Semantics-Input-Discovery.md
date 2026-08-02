# Sprint 2.4A: Evidence Semantics Input Discovery

## Status

Discovery only.

Sprint 2.4A implementation remains paused. This report does not define an
extraction policy, amend SAS-0003, or authorize implementation.

## Scope

This discovery inspected:

- the canonical domain `Evidence` entity and its supporting value objects;
- the upstream `BusinessSignal` and `CaptureInput` contracts where they
  affect Evidence content;
- every source-level canonical Evidence construction path;
- the deterministic Validation Engine, validators, and Evidence factory;
- Evidence-related domain, Validation, and core contract tests;
- package entry points and generated declarations;
- all source-level reads of canonical `Evidence.statement`;
- the distinct kernel and dashboard-local types also named Evidence.

The inspection excluded generated code as an independent creation path.
Generated declarations and JavaScript were checked only to confirm the
package surface currently published from `dist`.

## Executive finding

Canonical Evidence is not currently a sufficient deterministic input for the
Evidence Semantics layer described by ADR-0017 and SAS-0002A.

The domain entity carries identity, Organization ownership, signal lineage,
logical source, validation status, verification method, material relevance,
one free-form statement, confidence, and creation time. It does not carry a
structured subject, relation or field, typed factual value, qualifier,
source-field locator, statement grammar/version, or independent lineage for
multiple facts.

The only production Evidence creation path makes the gap larger:
`EvidenceFactory` does not preserve `BusinessSignal.value`,
`BusinessSignal.subjectId`, `BusinessSignal.occurredAt`, or
`BusinessSignal.validationNotes`. It generates a display sentence containing
only signal category and source:

```text
Validated <category> signal from <source>.
```

Consequently, runtime-created Evidence records do not preserve the factual
observation that passed Validation. The original signal remains referenced
only by identifier. No repository or other canonical resolution contract is
available to an Evidence Semantics engine, and identifier lineage alone
cannot reconstruct the omitted content.

No production code currently reads `Evidence.statement`. The only reads are
test assertions and deterministic-output serialization.

## Inspected canonical contracts

### Canonical `Evidence`

Source:
`packages/domain/src/intelligence/Evidence.ts`

`Evidence` extends `Entity`, whose inherited `id` is an immutable
`Identifier`.

The complete public field surface is:

| Field | Exact type | Construction behavior | Semantic role currently preserved |
| --- | --- | --- | --- |
| `id` | `Identifier` | Required by `Entity`; `Identifier` trims and rejects an empty value. | Canonical Evidence identity. |
| `organizationId` | `Identifier` | Stored as supplied. | Organization ownership boundary. |
| `signalIds` | `readonly Identifier[]` | Must contain at least one identifier; defensively copied and frozen. | Originating `BusinessSignal` identity lineage. |
| `source` | `string` | Trimmed; empty rejected. | Logical source name copied from the signal. |
| `signalValidationStatus` | `"valid"` | Constructor accepts `BusinessSignalValidationStatus` but rejects every value except `"valid"`. | Assertion that originating signals qualified as valid. |
| `verificationMethod` | `string` | Trimmed; empty rejected. | Name or description of the method used to qualify Evidence. |
| `materialRelevance` | `Percentage` | Zero basis points rejected. | Material-relevance assertion. |
| `statement` | `string` | Trimmed; empty rejected. No other validation. | One free-form textual statement. |
| `confidence` | `Percentage` | Stored as supplied. | Evidence confidence. |
| `createdAt` | `string` | Parsed as a date and normalized with `toISOString()`; invalid value rejected. | Evidence creation time. |

The constructor does not:

- verify that `organizationId` matches the Organizations of referenced
  signals;
- verify that `signalIds` are unique;
- retain or embed originating signals;
- define a statement grammar;
- identify a statement schema or version;
- separate statement display text from machine-readable content;
- identify a subject, predicate, object, field, unit, or qualifier;
- retain a source field or character/token locator;
- associate subsets of `signalIds` with subsets of statement content;
- distinguish one fact from multiple facts.

### Supporting value objects

Sources:

- `packages/domain/src/common/Entity.ts`;
- `packages/domain/src/common/Identifier.ts`;
- `packages/domain/src/common/Percentage.ts`;
- `packages/domain/src/common/Money.ts`.

Relevant behavior:

- `Entity` supplies immutable identifier-based entity identity.
- `Identifier` is an immutable trimmed non-empty string with exact equality.
  It supplies stable identity but no namespace or semantic role.
- `Percentage` is immutable and stores integer basis points from 0 through
  10,000.
- `Money` is immutable and stores `bigint` minor units and an uppercase
  three-letter currency code.

`Evidence` directly uses `Identifier` and `Percentage`. It does not directly
use `Money` or another typed factual-value abstraction.

### Upstream `BusinessSignal`

Source:
`packages/domain/src/intelligence/BusinessSignal.ts`

`BusinessSignal` preserves:

- `id`;
- `organizationId`;
- broad `category`;
- logical `source`;
- `occurredAt`;
- `capturedAt`;
- optional `subjectId`;
- `value` as `string | number | bigint | boolean | Money | Percentage`;
- `confidence`;
- `validationStatus`;
- optional `validationNotes`.

This is more structured than Evidence, but it still does not identify what
field, measurement, or relation the value represents. A value such as `42`
has a runtime type but no canonical predicate or field key.

The Validation Engine inspects signal identity, timestamps, value runtime
type, source completeness, temporal consistency, and validation status. It
does not preserve the signal's value structure in Evidence.

### Upstream `CaptureInput`

Source:
`packages/core/src/capture/CaptureInput.ts`

`CaptureInput` additionally carries:

- `sourceReference`;
- `deterministicIdentityMaterial`.

`sourceReference` contributes to capture identity but is not copied into
`BusinessSignal`. It therefore cannot be copied into Evidence by the current
Validation path. Neither `CaptureInput` nor `BusinessSignal` carries a
canonical source-field key or structural predicate.

## Canonical Evidence creation paths

### Runtime path: deterministic Validation

Sources:

- `packages/core/src/validation/ValidationEngine.ts`;
- `packages/validation/src/DeterministicValidationEngine.ts`;
- `packages/validation/src/validators/runValidationPipeline.ts`;
- `packages/validation/src/validators/IdentityValidator.ts`;
- `packages/validation/src/validators/IntegrityValidator.ts`;
- `packages/validation/src/validators/CompletenessValidator.ts`;
- `packages/validation/src/validators/ConsistencyValidator.ts`;
- `packages/validation/src/validators/QualificationValidator.ts`;
- `packages/validation/src/factories/EvidenceFactory.ts`.

The public core Validation contract is:

```text
Engine<BusinessSignal, Evidence>
```

The deterministic implementation runs five gates in this order:

1. Identity;
2. Integrity;
3. Completeness;
4. Consistency;
5. Qualification.

The pipeline is fail-fast. Failed Validation returns no Evidence. When all
gates pass, `DeterministicValidationEngine` invokes
`EvidenceFactory.create(signal, context)`.

`EvidenceFactory` is the only source-level production constructor call for
canonical Evidence. It maps fields as follows:

| Evidence field | Factory source |
| --- | --- |
| `id` | `evidence:<signal.id.value>:<context.correlationId.value>` |
| `organizationId` | `signal.organizationId` |
| `signalIds` | `[signal.id]` |
| `source` | `signal.source` |
| `signalValidationStatus` | `signal.validationStatus` |
| `verificationMethod` | Fixed string `"deterministic-five-gate-validation"` |
| `materialRelevance` | Fixed `Percentage.fromBasisPoints(10_000)` |
| `statement` | ``Validated ${signal.category} signal from ${signal.source}.`` |
| `confidence` | `signal.confidence` |
| `createdAt` | `context.executionTime.toISOString()` |

The factory does not map:

- `signal.value`;
- `signal.subjectId`;
- `signal.occurredAt`;
- `signal.capturedAt`;
- `signal.validationNotes`;
- a source field or predicate;
- `CaptureInput.sourceReference`;
- `CaptureInput.deterministicIdentityMaterial`.

Although `Evidence.signalIds` allows multiple identifiers, this factory
always creates Evidence from exactly one signal and writes exactly one signal
identifier.

### Direct construction in domain tests

Source:
`packages/domain/tests/intelligence.test.ts`

Two test paths directly invoke the public positional constructor:

- a lifecycle fixture uses
  `"Travel time exceeded the expected range."`;
- an invariant fixture uses `"Invoice remained unpaid."`.

These statements are human-readable free prose. They demonstrate that the
constructor intentionally accepts statements unrelated to the production
factory template. They do not establish a grammar, version, vocabulary,
typed value, or source locator.

There are no dedicated Evidence fixture or sample-data files. Evidence
fixtures are constructed inline in tests.

### Generated output

The built declaration at
`packages/domain/dist/src/intelligence/Evidence.d.ts` matches the current
source constructor and getters, including `statement: string`.

The built Validation declaration exposes:

```text
EvidenceFactory.create(signal: BusinessSignal, context: EngineContext):
Evidence
```

Generated JavaScript repeats the current production statement template. It
does not constitute an additional creation path.

## Package exports

### Domain

`packages/domain/src/intelligence/index.ts` exports `Evidence`, and
`packages/domain/src/index.ts` re-exports the intelligence entry point.

`packages/domain/package.json` exposes only the package root, backed by:

- JavaScript: `./dist/src/index.js`;
- declarations: `./dist/src/index.d.ts`.

Canonical `Evidence` is therefore publicly available as:

```text
@ginzaaipro/domain
```

Its positional constructor and all getters are part of the current public
contract.

### Core

`packages/core/src/validation/ValidationEngine.ts` publicly binds Validation
output to canonical `Evidence`.

`packages/core/src/intelligence/IntelligenceEngine.ts` currently binds
Intelligence input directly to:

```text
readonly Evidence[]
```

That direct input conflicts with ADR-0017's newer semantic boundary and
cannot remain the executable Intelligence input after Evidence Semantics is
introduced.

### Validation

`packages/validation/src/index.ts` exports only:

- `DeterministicValidationEngine`;
- Validation diagnostics.

`EvidenceFactory` is exported from the internal
`packages/validation/src/factories/index.ts`, but `package.json` exposes no
factory subpath. It is therefore source-visible to package tests, not a
documented root export from `@ginzaaipro/validation`.

The concrete Validation Engine's output behavior is public and would be
affected by any canonical Evidence construction change.

### Non-canonical namesakes

The repository also contains:

- kernel `Evidence` in `packages/kernel/src/domain.ts`;
- dashboard-local `OperationalEvidence` in
  `apps/ginzaaipro-dashboard/src/operational-evidence/types.ts`.

Kernel `Evidence` is runtime infrastructure tied to an action and trace.
Dashboard `OperationalEvidence` is an application-local mutable record with
an optional metadata bag and temporary in-memory store. Neither is
`@ginzaaipro/domain` Evidence, neither participates in the canonical
Validation output, and neither can silently become the Evidence Semantics
input without violating package boundaries.

## Reads of `Evidence.statement`

No production source reads canonical `Evidence.statement`.

All current source-level reads are tests:

1. `packages/validation/tests/factories.test.ts` asserts the exact generated
   display sentence.
2. `packages/validation/tests/deterministic-validation-engine.test.ts`
   copies `statement` into a plain object to compare repeated outputs.

The domain tests pass statements to the constructor but do not parse or read
them. No parser, interpreter, tokenizer, serializer, rule catalog, or
downstream engine consumes statement content.

## Discovery questions

### 1. What exact fields currently exist on canonical Evidence?

Canonical Evidence has:

1. inherited `id: Identifier`;
2. `organizationId: Identifier`;
3. `signalIds: readonly Identifier[]`;
4. `source: string`;
5. `signalValidationStatus: "valid"`;
6. `verificationMethod: string`;
7. `materialRelevance: Percentage`;
8. `statement: string`;
9. `confidence: Percentage`;
10. `createdAt: string`.

No other public or private semantic metadata exists.

### 2. Which fields preserve factual source content?

The answer depends on whether "content" means the fact itself or metadata
about the fact:

- `statement` is the only field capable of carrying human-readable factual
  content, but the production factory fills it with qualification display
  prose rather than the observed value.
- `signalIds` preserves identifiers of upstream facts, not their content.
- `source` preserves a logical source name, not a source record, field, or
  payload.
- `signalValidationStatus`, `verificationMethod`, `materialRelevance`,
  `confidence`, and `createdAt` preserve qualification metadata.
- `organizationId` preserves ownership.

Runtime-created Evidence does not preserve `BusinessSignal.value`,
`subjectId`, occurrence time, or source reference. Thus it does not preserve
the factual source content needed for deterministic semantic extraction.

### 3. How is `statement` generated?

There are two behaviors:

- Production Validation always uses the fixed interpolation
  ``Validated ${signal.category} signal from ${signal.source}.``.
- Public direct construction accepts any non-empty trimmed string.

The production interpolation includes only a broad category and source.
It omits the value that Validation checked.

### 4. Is `statement` governed by any stable grammar or template?

It has one implementation-local production template but no stable canonical
grammar.

The distinction is material:

- the template is not declared as a public versioned contract;
- no parser exists;
- no template identifier or version is stored;
- direct constructor callers may supply arbitrary prose;
- tests use both the factory sentence and unrelated natural-language
  statements;
- the constructor only trims and checks non-emptiness;
- the template cannot encode the omitted subject, factual relation, typed
  value, qualifiers, or source locator.

Therefore the current template is deterministic display prose, not a
normative machine-readable statement grammar.

### 5. Can an extraction rule identify a subject, predicate, object, typed value, qualifier, and stable source locator without natural-language interpretation?

No.

| Required semantic part | Current support |
| --- | --- |
| Subject | `BusinessSignal.subjectId` exists upstream but is not copied to Evidence. The generated statement has no explicit subject. |
| Predicate | No canonical field, relation, metric, or predicate is present. `BusinessSignal.category` is a broad classification, not a factual predicate. |
| Object | The generated statement names category and source but omits the observed business value. |
| Typed value | `BusinessSignal.value` is typed upstream but omitted from Evidence. `statement` is always plain text. |
| Qualifier | No structured qualifier collection or grammar exists. |
| Stable source locator | Evidence identifies signals and a logical source, but not the originating source reference, field, path, span, or fact boundary. |

Free-form direct-constructor statements can appear to contain some of these
parts, but identifying them requires natural-language interpretation and
cannot produce a stable typed contract or locator.

### 6. Can multiple facts be represented or traced independently?

No.

`statement` is one undifferentiated string. It can contain multiple
sentences, clauses, or claims, but there is:

- no fact collection;
- no fact identity;
- no statement segment or span model;
- no mapping from a fact to one or more `signalIds`;
- no per-fact value type;
- no per-fact confidence;
- no per-fact source field or locator.

The `signalIds` array permits aggregate signal lineage in principle, but the
factory always supplies one identifier and the entity provides no independent
fact-level traceability.

### 7. Does Evidence preserve enough information to distinguish the required concerns?

| Concern | Preserved? | Finding |
| --- | --- | --- |
| Explicitly supplied structure | No | There is no structured factual-source field. Upstream typed signal value and optional subject are discarded. |
| Generated display prose | Partially | `statement` contains prose, but no field identifies whether it was generated, directly authored, templated, or versioned. |
| Provenance | Partially | Organization, logical source, and signal identifiers are retained. Source reference, source field, and source locator are not. |
| Confidence | Yes, at Evidence level | `confidence` is a `Percentage`, but its exact semantics are not separated from future extraction confidence. The factory copies signal confidence. |
| Source field and locator | No | No canonical field/path/span/reference locator exists. |

Evidence cannot distinguish a statement that is the fact from a statement
that merely describes qualification. Both are the same unversioned string
field.

### 8. Which existing public contracts would require amendment for Evidence Semantics?

At minimum, the following contract surfaces are affected:

1. **Canonical domain Evidence surface**
   - A deterministic path must either amend `Evidence` to preserve neutral
     factual source structure or formally choose another boundary.
   - Any constructor or getter change affects `@ginzaaipro/domain`,
     declarations, domain tests, and direct callers.
2. **Canonical upstream observation surface**
   - Current `BusinessSignal` preserves a typed value, subject, and occurrence
     time but no field/relation key.
   - `CaptureInput.sourceReference` is lost before Validation.
   - If stable field identity and source reference are required downstream,
     `CaptureInput`, `BusinessSignal`, and capture mapping require compatible
     amendment; EvidenceFactory cannot recover omitted data.
3. **Validation construction**
   - `EvidenceFactory` must preserve the selected neutral structure rather
     than replacing it with display prose.
   - Deterministic Validation Engine tests and factory tests must verify
     structure and lineage.
   - The core `ValidationEngine` output may remain `Evidence` if Evidence
     remains the qualified factual boundary, but the content contract of that
     output changes.
4. **Evidence Semantics contracts**
   - `@ginzaaipro/domain` requires the canonical semantic entities described
     by SAS-0002A.
   - `@ginzaaipro/core` requires the Evidence Semantics engine contract.
   - A future implementation package and package exports are required by
     SAS-0002A.
5. **Intelligence input**
   - `packages/core/src/intelligence/IntelligenceEngine.ts` currently accepts
     `readonly Evidence[]`.
   - ADR-0017 requires a later governed amendment so Intelligence consumes
     canonical Evidence Semantics. This report does not amend SAS-0003 or that
     contract.

Kernel Evidence and dashboard `OperationalEvidence` do not require amendment
for the canonical semantic path and must remain distinct.

### 9. What is the minimum-complexity compatible path?

Path C is the minimum-complexity compatible path.

The smallest compatible direction is to preserve a minimal neutral snapshot
of the validated source structure at the factual boundary, then let the
Evidence Semantics layer normalize that structure into canonical semantic
facts.

The preserved source structure must be sufficient to identify, without
natural-language interpretation:

- a stable subject reference when one is supplied;
- a stable source field or relation key;
- the typed factual value;
- applicable explicit structural context such as occurrence time;
- a stable source record/field locator;
- lineage to the originating signal and Evidence.

This statement identifies required information categories, not a full entity
design. The exact type shape, identity, normalization, multiplicity, and
migration mechanics require a separate governed specification before code.

Preserving source structure does not place diagnosis in Evidence. It records
what was validated and where it came from. Evidence Semantics still owns
canonical subject-predicate-object normalization, semantic fact identity,
semantic confidence, and semantic lineage. Intelligence still owns
operational interpretation.

## Candidate-path evaluation

## Path A — Existing Evidence Is Sufficient

### Architectural advantages

- No contract, package, constructor, export, or migration changes.
- No additional domain concepts.
- Full source compatibility.

### Architectural risks

- The semantic engine would have to parse arbitrary natural language.
- The production statement does not contain the validated signal value.
- Subject, predicate, typed object, qualifier, and locator cannot be
  recovered.
- Signal identifiers would require an unowned repository or object-resolution
  mechanism to recover omitted observations.
- Any interpretation would violate ADR-0017's prohibition on operational
  reasoning over unstructured language.

### Compatibility implications

Source compatibility is perfect only because the required behavior cannot be
implemented. Architectural compatibility fails.

### Required contract changes

None, but only by accepting nondeterministic or incomplete extraction.

### Migration impact

None at contract level. Existing Evidence would remain semantically
insufficient.

### Determinism

Insufficient. The generated statement can be reproduced, but the original
fact cannot be reconstructed. Direct statements require natural-language
interpretation.

### Minimum-complexity assessment

Lowest code change, but not a viable path. Current Evidence contains neither
explicit deterministic structured inputs nor a normative grammar, so Path
A's entry condition is not met.

## Path B — Canonical Evidence Statement Grammar

### Architectural advantages

- Could leave the `Evidence` class field list unchanged.
- Could encode structure in one existing string.
- A closed, versioned grammar could be parsed deterministically for newly
  created Evidence.
- Human-readable serialization could be retained if the grammar were designed
  carefully.

### Architectural risks

- A display-prose field would become a hidden machine contract.
- Readability and grammar stability would compete: punctuation, escaping,
  localization, whitespace, and editorial changes become breaking changes.
- The current constructor cannot identify grammar version or distinguish
  legacy prose from governed machine statements.
- Multiple facts and independent lineage would require a complex mini-language
  inside one string.
- Typed values, namespaces, locators, and qualifiers would require escaping
  and parsing rules that duplicate normal structured types.
- Current `BusinessSignal` still lacks a field/relation key, and
  `sourceReference` is lost before Evidence, so a grammar alone cannot
  synthesize required information.
- Treating presentation text as canonical structure is fragile and obscures
  separation of concerns.

### Compatibility implications

The TypeScript field shape could remain source-compatible, but its semantics
would change materially. Existing callers that provide arbitrary statements
would become invalid or produce unsupported legacy Evidence. Display changes
would become machine-contract changes.

### Required contract changes

Even if the entity fields remain unchanged, governance would require:

- a normative grammar and versioning strategy;
- a way to distinguish governed from legacy statements;
- deterministic serializer/parser contracts;
- EvidenceFactory changes;
- upstream preservation of a field/relation key and source locator;
- test and fixture migration.

Adding grammar/version metadata would in practice amend the Evidence
contract, weakening the stated advantage.

### Migration impact

All existing Evidence statements require classification as legacy,
regeneration from richer source data, or rejection. The current production
template and test prose do not encode enough data for lossless conversion.

### Determinism

Potentially deterministic for future grammar-conforming statements, but only
after upstream data and versioning gaps are solved. It cannot deterministically
recover existing facts.

### Minimum-complexity assessment

Superficially small, operationally high complexity. It moves structured
contract design into a string and produces greater parsing and migration cost
than an explicit neutral structure.

## Path C — Add a Neutral Structured Source Representation

### Architectural advantages

- Preserves validated factual structure without adding diagnosis.
- Keeps display prose separate from machine-readable source facts.
- Allows typed values to remain typed.
- Can support multiple factual items with independent stable lineage.
- Allows deterministic extraction without repositories, natural-language
  parsing, or external I/O.
- Makes omission visible instead of hiding it in prose.
- Aligns with ADR-0017: Evidence retains validated facts and provenance;
  Evidence Semantics transforms them exactly once into normalized semantic
  facts; Intelligence interprets those facts.
- Can reuse existing immutable `Identifier`, `Money`, and `Percentage`
  conventions where applicable.

### Architectural risks

- Requires deliberate control of the boundary between neutral source
  structure and canonical semantics.
- If the representation includes operational categories, inferred causality,
  significance, or action language, it would improperly move Intelligence
  into Evidence.
- If it duplicates the complete SAS-0002A `SemanticFact` model, it would
  collapse Evidence into Evidence Semantics.
- Current upstream contracts do not preserve a field/relation key, and
  `sourceReference` is lost; the change cannot be isolated to display prose.
- Positional constructor growth would be fragile unless the future
  specification addresses construction compatibility.

### Compatibility implications

Canonical Evidence gains a neutral source-structure obligation. Existing
direct constructors, Validation construction, declarations, and tests require
migration.

Depending on the governed minimum shape, compatible upstream amendments may
be required so capture and `BusinessSignal` preserve:

- a stable field/relation key;
- `sourceReference` or an equivalent stable locator;
- the existing typed value, subject, and occurrence context.

The core Validation result type can remain `Evidence`, preserving the
pipeline stage and package dependency direction.

### Required contract changes

Potential changes include:

- new neutral source-structure value contract in `@ginzaaipro/domain`;
- canonical Evidence construction and access;
- domain exports and declarations;
- `EvidenceFactory` mapping;
- Validation and domain tests;
- upstream capture/signal contracts only to the extent required to prevent
  loss of field identity and source location;
- future Evidence Semantics engine contracts and exports.

The exact fields are intentionally not designed in this discovery report.

### Migration impact

Existing runtime Evidence cannot be backfilled from its statement because the
validated value is absent. Migration requires either:

- replay from retained canonical signals/source records; or
- explicit treatment of legacy Evidence as unsupported for deterministic
  semantics.

New Evidence can preserve neutral source structure at creation time.

### Determinism

Strong. Explicit field identity, typed value, context, and stable locator
allow closed extraction rules to normalize without interpreting prose.

### Minimum-complexity assessment

The smallest viable architectural change. It modifies the factual boundary
where information is currently lost and avoids creating an additional
canonical layer or machine language inside display prose.

### ADR-0017 compatibility

This path does not violate ADR-0017 if it preserves only source structure.

ADR-0017 states that:

- Evidence establishes what has been validated;
- Evidence Semantics establishes structured meaning;
- Evidence shall not contain business diagnosis.

A neutral source snapshot records the validated value, explicit source key,
subject reference, context, and locator. It does not establish semantic fact
identity, normalize a business predicate, classify operational meaning, or
recommend action. Evidence Semantics remains a distinct transformation.

The boundary would be violated only if Evidence began carrying the canonical
`SemanticFact` output or operational diagnosis rather than neutral validated
source structure.

## Path D — Introduce a Pre-Semantic Extraction Input

### Architectural advantages

- Leaves the existing Evidence entity unchanged.
- Can isolate non-canonical extraction candidates from canonical Evidence
  Semantics.
- Can accommodate assisted extraction outputs before canonical acceptance.
- Could carry structure and locators required by the semantic engine.

### Architectural risks

- Adds a fifth conceptual boundary between Evidence and Evidence Semantics.
- Risks duplicating `EvidenceSemantics`, `SemanticFact`, lineage,
  normalization, and confidence in a second envelope.
- An envelope derived only from current Evidence cannot recover the omitted
  value, subject, field, or source reference.
- An envelope enriched from `BusinessSignal` or external payloads would
  introduce a second factual input that did not itself pass through the
  canonical Evidence boundary.
- Resolving signal identifiers would require persistence, orchestration, or
  object graphs that SAS-0002A explicitly excludes.
- Candidate lifecycle, validation, ownership, and authority would require
  additional contracts and diagnostics.
- Competing candidate formats could emerge across extractors.

### Compatibility implications

Existing Evidence remains unchanged, but the pipeline, engine input,
orchestration, and package graph gain a new contract. Intelligence migration
still remains necessary.

### Required contract changes

This path requires:

- a new candidate/envelope contract;
- an owner package and public exports;
- an explicit producer contract;
- lineage and authority rules tying candidate content to Evidence;
- Evidence Semantics engine input changes;
- orchestration capable of supplying Evidence and candidate data together;
- tests for candidate validation and duplication boundaries.

If upstream canonical structure must still be added to create the envelope,
this path does not avoid Path C; it adds another layer on top of it.

### Migration impact

New orchestration and candidate production are required. Existing Evidence
still cannot populate candidates deterministically without replay or external
lookup.

### Determinism

Potentially deterministic when a complete immutable candidate is supplied,
but candidate production becomes an additional determinism boundary. AI- or
language-derived candidates require separate governance before they can
become canonical.

### Minimum-complexity assessment

Higher complexity than Path C and not justified by current contracts. It
duplicates the semantic boundary unless a future use case proves that a
separate non-canonical candidate lifecycle is necessary.

## Contract contradiction assessment

The current code contracts contradict the executable assumptions of
SAS-0002A in one practical respect: SAS-0002A's conceptual
`readonly Evidence[] -> EvidenceSemantics` transformation cannot extract the
required structured facts from current runtime Evidence.

This is not a contradiction that requires changing ADR-0017.

ADR-0017 deliberately identifies the missing semantic boundary and prohibits
raw-language interpretation. It allows the factual boundary to preserve
neutral validated source structure, provided Evidence does not contain
business diagnosis and Evidence Semantics remains responsible for canonical
semantic transformation.

Current contracts therefore require amendment before deterministic
implementation, but ADR-0017 remains internally viable.

## Recommendation

Adopt Path C as the sole minimum-complexity direction for the next governed
specification: preserve a minimal domain-neutral, typed, and independently
traceable source representation at the validated factual boundary; keep
display prose non-normative; retain Evidence Semantics as the only canonical
semantic transformation; and keep all operational interpretation downstream
in Intelligence.
