# ADR-0018: Canonical Evidence Representation

## Status

Accepted.

Normative beginning with Sprint 2.4A.

## Purpose

Define the minimum canonical structure that validated Evidence must preserve
so deterministic Evidence Semantics can be produced without interpreting
natural language or embedding business diagnosis upstream.

This ADR governs the representation of validated factual information inside
canonical Evidence.

It does not define semantic extraction behavior, operational Intelligence, or
implementation details.

## Governing decisions

This decision builds on:

- ADR-0015: Canonical Capture Boundary;
- ADR-0016: Canonical Business Diagnosis;
- ADR-0017: Canonical Evidence Semantics;
- SAS-0002: Deterministic Capture Engine;
- SAS-0002A: Evidence Semantics Layer;
- Sprint 2.4A Evidence Semantics Input Discovery.

The Sprint 2.4A discovery evaluated four paths:

- Path A: Existing Evidence Is Sufficient;
- Path B: Canonical Evidence Statement Grammar;
- Path C: Add a Neutral Structured Source Representation;
- Path D: Introduce a Pre-Semantic Extraction Input.

Path C is accepted. It provides the minimum structured factual
representation required for deterministic semantic extraction while
preserving Evidence as validated fact rather than operational
interpretation.

Paths A, B, and D are rejected.

## Problem

Current canonical Evidence preserves:

- validation status;
- identity;
- Organization ownership;
- statement text;
- confidence;
- provenance;
- traceability.

However, its factual content is represented primarily through human-readable
prose.

Human-readable prose alone does not reliably preserve:

- explicit subject structure;
- explicit relation structure;
- typed factual values;
- qualifiers;
- source fields;
- stable locators;
- independently traceable factual components.

The current production Evidence statement is deterministic display prose,
but it does not preserve the factual value, subject, field, qualifier, or
stable source locator required for deterministic semantic extraction.
Arbitrary statements accepted through direct construction have no normative
grammar or version.

Consequently, deterministic Evidence Semantics cannot be produced without
one or more of the following architectural failures:

- interpreting natural language;
- making unsupported assumptions;
- treating display prose as a machine contract;
- introducing an unnecessary intermediate layer.

None is acceptable.

## Canonical decision

Canonical Evidence must preserve both:

1. a human-readable factual statement; and
2. a neutral structured factual representation sufficient for deterministic
   semantic extraction.

The structured representation must preserve facts already established during
Validation. It records the factual structure that qualified as Evidence; it
does not interpret the operational meaning of that structure.

The structured representation must not:

- diagnose a business condition;
- classify leakage, risk, opportunity, or strength;
- estimate operational or economic significance;
- prioritize;
- recommend;
- prescribe execution;
- predict outcomes.

The structured representation is part of canonical Evidence because it
preserves validated factual structure.

It is not Evidence Semantics because it does not yet normalize those facts
into the canonical semantic proposition model governed by SAS-0002A.

## Governing question

Canonical Evidence asks:

> "What validated factual information must be preserved so its meaning can
> be structured deterministically downstream?"

The Evidence representation must answer only that question.

It must not answer:

> "What does this mean operationally?"

That question remains the responsibility of Intelligence after canonical
Evidence Semantics has been produced.

## Canonical boundary

```text
BusinessSignal
      |
Validation
      |
Canonical Evidence
  - factual statement
  - structured factual source representation
  - confidence
  - provenance
  - traceability
      |
Evidence Semantics
      |
Intelligence
```

The boundary has four distinct responsibilities:

- Validation determines whether factual content qualifies as canonical
  Evidence.
- Evidence preserves the qualified factual information in human-readable and
  structured forms.
- Evidence Semantics converts the structured factual representation into
  normalized canonical semantic facts.
- Intelligence interprets those semantic facts operationally.

Each layer transforms information exactly once. Evidence does not perform
semantic normalization, and Evidence Semantics does not repeat factual
qualification.

## Structured factual representation

Canonical Evidence contains an implementation-neutral structured
representation capable of preserving one or more validated factual
components.

Each component must preserve, where explicitly available:

- a stable component identity;
- a subject reference or subject token;
- an explicit relation or factual field;
- an explicit raw value;
- a declared structural value type when already known;
- explicit qualifiers;
- the originating Evidence field;
- a stable source locator when available;
- provenance to the source `BusinessSignal` or validated source material.

The representation must support multiple components without combining their
identity, value, qualifiers, or lineage. Each component must be independently
traceable.

The final TypeScript names, constructor shapes, package file organization,
and concrete encodings are not prescribed by this ADR.

The full `SemanticFact` contract must not be reused inside Evidence.

Evidence's structured factual representation is source-preserving and
validation-oriented. `SemanticFact` is normalized, policy-produced,
canonical semantic output. Reusing the semantic output model upstream would
collapse the two layers and violate ADR-0017.

## Separation from Evidence Semantics

### Canonical Evidence representation

Canonical Evidence:

- preserves validated source structure;
- may retain source-oriented field names;
- may retain raw factual values;
- preserves the form in which the fact was validated;
- does not require canonical predicate vocabulary;
- does not require semantic normalization;
- does not assign semantic extraction confidence;
- does not apply extraction-policy identity.

Evidence is authoritative for which factual content qualified, its source
form, and its factual provenance. It is not authoritative for normalized
semantic vocabulary or operational meaning.

### Evidence Semantics

Evidence Semantics:

- transforms validated structured factual content;
- assigns canonical subjects and predicates;
- produces typed normalized values;
- applies extraction rules and policy versions;
- establishes semantic lineage;
- assigns semantic confidence;
- produces deterministic canonical identities.

The two layers must not collapse into one another.

Evidence must not contain a precomputed `SemanticFact`. Evidence Semantics
must not fall back to interpreting Evidence statement prose when required
structured content is absent.

## Statement role

The Evidence statement remains mandatory as the human-readable expression of
the validated fact.

However:

- the statement is not the machine contract;
- downstream deterministic reasoning must not parse it;
- statement wording may change without changing structured factual meaning;
- display prose must not participate in semantic identity unless explicitly
  governed elsewhere;
- structured factual content is authoritative for deterministic semantic
  extraction.

The statement remains useful for human review, audit, and explanation. Its
readability must not make it an implicit parser input.

Divergence between the statement and structured factual representation is
invalid. Evidence construction or Validation must fail when the two forms are
substantively inconsistent.

Consistency does not require identical serialization. It requires that the
statement not omit, contradict, exaggerate, or redefine the validated
structured factual content it purports to express.

## HCES Information Preservation principle

This ADR introduces the HCES principle of **Information Preservation**:

> Every governed transformation boundary must preserve all information
> required by downstream deterministic layers while introducing no
> interpretation owned by those layers.

Applied to Evidence:

- Evidence must preserve the validated factual structure required by
  Evidence Semantics.
- Evidence must not perform semantic normalization or operational
  interpretation.
- Validation must not discard factual structure and replace it only with
  prose.

Information Preservation does not require every layer to duplicate all
upstream data. It requires each governed boundary to retain the explicit
identity, structure, value, context, and lineage needed by its authorized
downstream transformation.

## Invariants

The following invariants are mandatory:

1. Every canonical Evidence record remains immutable.
2. Every canonical Evidence record belongs to exactly one Organization.
3. Every Evidence record contains a human-readable factual statement.
4. Every Evidence record contains one or more structured factual components.
5. Every structured component represents content explicitly validated from
   the source.
6. Every structured component has complete provenance and traceability.
7. Every structured component can be traced independently where multiple
   facts exist.
8. Structured content must not contain business diagnosis or recommended
   action.
9. Structured content must not depend on downstream semantic vocabulary.
10. The statement and structured representation must be substantively
    consistent.
11. Missing factual structure must not be reconstructed through
    natural-language interpretation downstream.
12. Evidence construction must fail when required deterministic structure
    cannot be preserved.
13. Structured factual values must retain source fidelity and must not be
    silently normalized into a different meaning.
14. No Evidence component may be fabricated from assumptions, external
    enrichment, or common knowledge.
15. Equivalent validated factual inputs must produce substantively equivalent
    canonical Evidence.

In addition:

- all component collections must be immutable;
- component identity and lineage must not depend on display-statement wording;
- Organization identity must remain consistent across Evidence, structured
  components, and originating canonical source records;
- missing optional source structure must remain explicitly absent rather
  than inferred;
- a component that cannot be independently attributed must not be combined
  with an attributable component to bypass traceability requirements.

## Validation responsibility

Validation is responsible for ensuring:

- each factual component is explicitly supported;
- the human-readable statement is consistent with the structured
  representation;
- provenance is complete;
- Organization ownership is consistent;
- required structural fields are present;
- no diagnosis or Recommendation has entered Evidence;
- multiple factual components are independently attributable.

Validation must reject a prospective Evidence record when required structure
was discarded, cannot be attributed, or would have to be reconstructed from
prose.

Validation does not:

- assign canonical semantic predicates;
- normalize source structure into `SemanticFact`;
- assign semantic extraction confidence;
- select an Evidence Semantics extraction policy;
- establish operational meaning;
- prioritize, recommend, or execute.

## Capture implications

Capture and adapters should preserve available source structure whenever
possible.

Examples include:

- structured API fields;
- form fields;
- event attributes;
- database columns;
- transcript spans;
- document fields;
- source paths;
- explicit timestamps;
- quantities and units.

Capture must not discard available structure and retain only prose when that
structure is required for deterministic downstream processing.

Adapters remain responsible for translating technology-specific
representations into canonical intake. Capture remains responsible for
constructing immutable canonical observations. Neither layer may introduce
business diagnosis merely to satisfy downstream structure.

Raw-source parsing and adapter implementation remain outside this ADR.

The exact amendment required to preserve source structure through
`CaptureInput` and `BusinessSignal` belongs to a governed follow-on
specification.

## Consequences

### Benefits

This decision provides:

- deterministic semantic extraction;
- reduced dependence on natural-language interpretation;
- independent traceability of multiple facts;
- stronger provenance;
- continued availability of human-readable Evidence;
- a domain-neutral Evidence Semantics layer;
- deterministic Intelligence inputs;
- consistent structural preservation by future source adapters;
- decoupling of display text from machine contracts;
- explicit failure when required source structure is unavailable;
- a stable boundary between qualified factual content and normalized
  semantic facts.

### Costs

This decision means:

- Evidence becomes a richer canonical aggregate;
- Validation and Evidence factories must eventually change;
- fixtures and tests must be migrated;
- Capture outputs may need additional structural preservation;
- existing Evidence consumers must be reviewed;
- SAS-0002 requires a governed amendment or supplement;
- a concrete initial extraction-policy supplement remains required;
- SAS-0003 must later be amended to consume Evidence Semantics;
- legacy Evidence that lacks structured components cannot automatically
  become deterministic Evidence Semantics;
- migration may require replay from retained canonical signals or source
  records.

## Rejected alternatives

### Path A: Existing Evidence Is Sufficient

Rejected because unstructured statement text cannot reliably support
deterministic semantic extraction.

The current production statement also omits the factual value, subject,
field, qualifiers, and stable locator. Signal identity alone cannot recreate
that information without an additional resolution boundary.

### Path B: Canonical Evidence Statement Grammar

Rejected because it turns display prose into a fragile machine API and
couples wording to canonical reasoning.

A statement grammar would also require escaping, versioning, typed-value,
multi-fact, and lineage behavior inside one string. It would duplicate
explicit structured contracts while reducing human readability and migration
safety.

### Path D: Pre-Semantic Extraction Input

Rejected because it introduces another canonical layer that duplicates
responsibilities already divided between Evidence and Evidence Semantics.

An intermediate envelope derived only from current Evidence cannot recover
discarded structure. An envelope enriched from another source would create a
second factual input whose relationship to validated Evidence would require
additional qualification and governance.

## Compatibility

ADR-0018 refines the canonical Evidence contract established under ADR-0015
and SAS-0002.

It does not overturn:

- Evidence immutability;
- validation requirements;
- provenance;
- confidence;
- traceability;
- Organization isolation.

It strengthens those properties by requiring Evidence to preserve the
validated factual structure needed downstream.

Any existing specification that defines Evidence only through
human-readable statement content must be amended before implementation.

Existing kernel Evidence and application-local evidence records do not become
canonical Evidence through this decision. Package and runtime boundaries
remain unchanged until a governed implementation specification authorizes
contract changes.

### Specification ownership clarification

The current repository assigns deterministic Validation and Evidence
construction to SAS-0001, while SAS-0002 governs deterministic Capture.
Because this decision affects both preservation through Capture and Evidence
construction through Validation, follow-on architecture must place each
contract change under its owning specification or explicitly supersede that
ownership.

This clarification does not change the decision. It records a documentation
ownership ambiguity that must be resolved before implementation.

## Required follow-on artifacts

ADR-0018 authorizes architecture work only.

Before implementation, the following are required:

1. a governed amendment or supplement to SAS-0002 defining the revised
   Evidence contract and Validation behavior, with specification ownership
   reconciled as described in the compatibility section;
2. an implementation-readiness checklist for the Evidence representation
   change;
3. an initial Evidence Semantics extraction-policy supplement containing
   concrete policy and rule definitions;
4. an amendment to SAS-0003 changing Intelligence input from raw Evidence to
   canonical Evidence Semantics.

No TypeScript, package, export, test, fixture, migration, or runtime change is
authorized until the required architecture work is complete.

## Out of scope

This ADR does not define:

- final TypeScript interfaces;
- package file structure;
- migration code;
- source adapters;
- extraction-rule catalogs;
- canonical semantic predicates;
- semantic identity vectors;
- Intelligence rules;
- persistence;
- orchestration;
- implementation.
