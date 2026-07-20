# SAS-0001A: Evidence Representation Amendment

## Status

Normative beginning with Sprint 2.4A.

This document amends the Validation and Evidence construction
responsibilities defined by SAS-0001. It does not replace SAS-0001.

No implementation is authorized by this amendment.

## Governing decisions

This amendment is governed by:

- ADR-0015: Canonical Capture Boundary;
- ADR-0017: Canonical Evidence Semantics;
- ADR-0018: Canonical Evidence Representation;
- SAS-0001: Deterministic Validation Engine;
- SAS-0002A: Evidence Semantics Layer.

Validation owns canonical Evidence construction and therefore owns the
canonical Evidence representation.

Capture owns canonical observation. Validation owns factual qualification
and Evidence construction. Evidence Semantics owns deterministic
transformation of validated factual structure. Intelligence owns operational
interpretation.

SAS-0001 remains authoritative for the deterministic Validation pipeline,
gate ordering, diagnostics, explanations, and Evidence qualification except
where this amendment adds or strengthens Evidence representation
requirements.

## 1. Purpose

Define the amendments required to the Validation specification so canonical
Evidence preserves sufficient validated factual structure for deterministic
downstream semantic extraction.

This amendment changes the canonical Evidence contract only.

It does not define:

- semantic extraction;
- operational interpretation;
- Intelligence;
- implementation.

## 2. Scope

SAS-0001A specifies:

- revised Validation responsibilities;
- Evidence construction requirements;
- implementation-neutral structured factual representation requirements;
- Validation invariants;
- Evidence factory expectations;
- backward compatibility expectations;
- acceptance criteria.

This amendment applies only to canonical Evidence produced by Validation.
Kernel Evidence, application-local evidence records, raw source payloads, and
Evidence Semantics are not redefined by this document.

## 3. Canonical flow

The amended flow is:

```text
BusinessSignal
      |
Deterministic Validation
      |
Canonical Evidence
  - identity
  - Organization ownership
  - human-readable factual statement
  - structured factual representation
  - provenance
  - confidence
  - traceability
      |
Evidence Semantics
      |
Intelligence
```

Validation produces canonical Evidence only after the existing SAS-0001
qualification gates succeed and every requirement in this amendment is
satisfied.

No partial Evidence may be returned when the structured factual
representation cannot be constructed faithfully.

## 4. Validation responsibilities

Validation shall:

- verify explicit factual support;
- construct canonical Evidence;
- preserve validated factual structure;
- verify consistency between the structured representation and the
  human-readable statement;
- preserve provenance;
- preserve Organization ownership;
- preserve Evidence confidence;
- preserve independent traceability of multiple factual components;
- fail when required factual structure is missing, ambiguous, fabricated, or
  cannot be attributed;
- produce substantively equivalent canonical Evidence for equivalent
  validated factual input and equivalent execution context.

Validation shall not:

- normalize semantic predicates;
- perform semantic extraction;
- assign semantic confidence;
- apply Evidence Semantics extraction policies;
- perform operational interpretation;
- diagnose business conditions;
- classify leakage, risk, opportunity, or strength;
- estimate operational or economic significance;
- prioritize;
- recommend actions;
- prescribe execution;
- predict outcomes.

Validation may confirm that an explicit field, relation, value, qualifier,
subject, locator, or provenance element is present and supported. It must not
translate that source-oriented structure into a canonical semantic
proposition.

## 5. Canonical Evidence amendment

Canonical Evidence now consists conceptually of:

- identity;
- Organization ownership;
- a human-readable factual statement;
- a structured factual representation;
- provenance;
- confidence;
- traceability.

The structured factual representation is mandatory and normative.

The statement remains authoritative for human communication.

The structured factual representation is authoritative for deterministic
downstream processing.

These authorities are complementary:

- human reviewers use the statement to understand what Validation qualified;
- deterministic downstream engines use the structured representation;
- downstream engines must not parse the statement to reconstruct missing
  structure;
- the statement must not introduce a factual claim absent from the
  structured representation;
- the structured representation must not contain a validated factual claim
  that the statement contradicts or materially misrepresents.

Canonical Evidence remains immutable, Organization-scoped, confidence-bearing,
and traceable to its validated source.

## 6. Structured factual representation

### 6.1 Purpose

The structured factual representation preserves the form and content of facts
that Validation qualified. It is source-preserving and
validation-oriented.

It is not the normalized canonical semantic proposition model defined by
SAS-0002A.

### 6.2 Factual components

The representation must contain one or more validated factual components.

Each component must preserve, where explicitly available:

- stable component identity;
- factual subject;
- factual relation or field;
- raw factual value;
- declared structural value type;
- explicit qualifiers;
- originating field;
- source locator;
- provenance.

These requirements are implementation-neutral. This amendment does not
prescribe final TypeScript names, constructor parameters, serialized forms,
or package file locations.

### 6.3 Stable component identity

Each component must be independently identifiable.

Component identity must:

- be stable for substantively equivalent validated input;
- distinguish separate factual components;
- remain independent of human-readable statement wording;
- participate in independent traceability;
- use no randomness, current system time, external lookup, or mutable process
  state.

The exact identity encoding and algorithm require a governed implementation
specification and are not defined here.

### 6.4 Factual subject

A factual subject preserves an explicitly supplied subject reference or
source token.

Validation must not:

- invent a missing subject;
- resolve a subject through fuzzy matching;
- translate a subject into a downstream semantic concept;
- embed a mutable business object or infrastructure reference.

When the source does not explicitly provide a subject and the governing
factual structure does not require one, absence must remain explicit.

### 6.5 Factual relation or field

A factual relation or field preserves the source-oriented key under which the
value was validated.

It may retain a source field name, attribute name, column, path, form key,
event property, or another explicit structural token.

It must not:

- be translated into a canonical semantic predicate;
- be replaced with a business diagnosis;
- be inferred from display prose;
- be silently mapped to a purported synonym.

### 6.6 Raw factual value and structural value type

The raw factual value preserves the value that Validation qualified.

When a structural type is already known, that type must be declared and
preserved. A known numeric, boolean, textual, temporal, identifier, quantity,
money, percentage, or other governed structural type must not be flattened
into display prose.

Validation must preserve source fidelity. It must not:

- silently coerce between structural types;
- add units, precision, scale, or timezone information not supplied;
- clamp, round, translate, or enrich a value in a way that changes meaning;
- infer a type from natural-language interpretation;
- replace a raw value with an operational conclusion.

The final permitted structural-type set and canonical encoding belong to a
governed implementation specification.

### 6.7 Explicit qualifiers

Explicit qualifiers preserve source-provided factual context such as an
explicit time, scope, unit, location, or source constraint.

Qualifiers must:

- be explicitly supported;
- retain source-oriented keys and raw values;
- be attributable to the component they qualify;
- remain independently immutable.

Validation must not infer a missing qualifier or use qualifiers to express
severity, priority, diagnosis, Recommendation, or operational meaning.

### 6.8 Originating field and source locator

Each component must identify the canonical input field or validated source
location from which it was preserved.

A stable source locator must be preserved when available. A locator may
identify an explicit source record, field, path, attribute, column, span, or
other governed location.

Validation must not fabricate a locator. When a stable locator is unavailable
but not required by the governing source contract, absence must remain
explicit and provenance must still identify the validated source material.

### 6.9 Provenance

Every component must retain complete provenance to the source
`BusinessSignal` or other canonical validated source material authorized by
a future governing specification.

Provenance must:

- preserve source identity;
- preserve Organization consistency;
- identify all source material used by the component;
- contain no source not supplied to Validation;
- support independent audit of each component;
- avoid mutable embedded source objects.

Identifier lineage alone is insufficient when required factual content,
field identity, or location was discarded and would need to be reconstructed
through an external lookup.

### 6.10 Multiple factual components

Evidence may preserve multiple validated factual components only when each
component:

- is independently identifiable;
- is independently attributable;
- has its own value and explicit context;
- has complete provenance;
- remains substantively consistent with the Evidence statement.

Components must not be merged merely because they share a source, subject, or
similar wording. A component lacking independent attribution must not be
combined with an attributable component to bypass Validation requirements.

### 6.11 Prohibited content

The structured factual representation contains:

- no semantic normalization;
- no canonical predicate vocabulary;
- no semantic extraction confidence;
- no extraction-policy or extraction-rule identity;
- no operational diagnosis;
- no leakage, risk, opportunity, or strength classification;
- no priority;
- no Recommendation;
- no execution instruction;
- no predicted Outcome.

The full canonical semantic-fact contract must not be embedded in Evidence.

## 7. Statement and structure consistency

The human-readable statement and structured factual representation must be
substantively consistent.

Substantive consistency means:

- the statement describes only factual content represented by the structured
  components;
- the statement does not contradict a component;
- the statement does not add unsupported specificity, causality, impact,
  diagnosis, significance, priority, or action;
- the structured representation does not silently include a validated fact
  materially absent from or contradicted by the statement;
- multiple factual components remain intelligible to a human reviewer.

Validation must establish consistency without treating prose as the machine
input for downstream reasoning.

A compliant construction process may establish consistency from the same
validated factual inputs or through a governed deterministic statement
rendering policy. It must not recover missing structured fields by parsing
the statement.

If an independently supplied statement cannot be verified against the
structured representation without natural-language interpretation,
Validation must reject the pair or use another explicitly governed
consistency mechanism. It must not make an implicit semantic judgment.

The statement may change without changing structured factual meaning,
component identity, or downstream semantic identity, provided the revised
statement remains substantively consistent.

## 8. Validation invariants

The following invariants amend SAS-0001:

1. Structured representation reflects only facts qualified by Validation.
2. Every Evidence record contains one or more structured factual components.
3. Every structured component has complete provenance.
4. Every structured component is independently attributable.
5. Statement and structure remain substantively consistent.
6. No component is fabricated.
7. No missing structure is reconstructed from assumptions, external
   enrichment, common knowledge, or display prose.
8. No operational meaning is inferred.
9. No semantic normalization is performed.
10. No downstream semantic vocabulary is required.
11. Equivalent validated inputs produce substantively equivalent canonical
    Evidence.
12. Validation fails if required factual structure cannot be preserved.
13. Structured values preserve source fidelity.
14. Organization ownership is consistent across Evidence, every component,
    and every source reference.
15. Evidence confidence remains Evidence confidence and is not reused as
    semantic confidence.
16. Every component collection and nested value is immutable or defensively
    copied.
17. Multiple components retain distinct identities and lineage.
18. Statement wording does not determine component identity.
19. A successful Validation result contains complete canonical Evidence.
20. A failed Validation result contains no partial Evidence.

Equivalent validated inputs means equivalent factual identity, Organization,
source structure, raw values, explicit types, qualifiers, locators,
provenance, and governing deterministic context. Runtime duration is not
substantive Evidence content.

## 9. Failure behavior

Evidence construction must fail when:

- no structured factual component is available;
- a required subject, field, relation, value, type, qualifier, locator, or
  provenance element is missing;
- a component cannot be traced independently;
- Organization ownership is inconsistent;
- statement and structure diverge;
- a value cannot retain source fidelity;
- component content is fabricated or externally enriched;
- construction would require natural-language interpretation;
- construction would require semantic normalization or operational
  interpretation;
- deterministic identity or equivalence cannot be preserved.

Failure behavior must follow the existing SAS-0001 principle:

- no Evidence is constructed or returned;
- the first failed governed requirement determines the failure;
- diagnostics and explanations remain stable and deterministic;
- no later Evidence-construction work occurs after failure.

The exact added diagnostic catalog and its position in the fail-fast gate
order require a governed implementation-readiness artifact before code.

## 10. Evidence factory expectations

The Evidence factory shall:

- be the sole canonical constructor used by the Validation implementation;
- build immutable canonical Evidence;
- preserve every qualified structured factual component;
- preserve raw factual values and explicit structural types;
- preserve Organization ownership;
- preserve Evidence confidence;
- preserve complete source provenance and traceability;
- preserve independent component identity;
- create or accept a human-readable statement through an explicitly governed
  mechanism;
- reject inconsistent statement/structure pairs;
- reject incomplete provenance;
- reject fabricated structured components;
- reject missing required structure;
- preserve source fidelity;
- produce substantively equivalent Evidence for equivalent validated inputs.

The factory shall not:

- replace validated factual structure with generic display prose;
- recover omitted structure by parsing a statement;
- dereference source identifiers through persistence or external I/O;
- invent a field, subject, locator, qualifier, type, unit, or value;
- normalize into canonical semantic predicates;
- assign semantic confidence;
- diagnose, prioritize, recommend, or execute;
- return partially constructed Evidence.

Implementation remains out of scope.

## 11. Provenance and traceability

Evidence-level provenance identifies the complete validated source boundary.
Component-level provenance identifies the exact source material supporting
each factual component.

Both levels are mandatory.

Traceability must allow a reviewer to answer:

- which canonical source record supported the Evidence;
- which source material supported each component;
- which Organization owned that source;
- which field or location supplied the component when available;
- which qualified value and explicit context were preserved.

Traceability must not require:

- parsing statement prose;
- accessing a hidden object graph;
- querying a repository merely to recover content discarded during
  Validation;
- relying on kernel Finding, runtime event, or application-local evidence
  semantics.

## 12. Confidence

Evidence confidence remains the confidence assigned to the qualified factual
record under the Validation contract.

This amendment does not redefine the existing confidence algorithm.

Validation must preserve Evidence confidence and must not:

- reinterpret it as semantic extraction confidence;
- assign it independently to each structured component unless a future
  governed specification explicitly defines that behavior;
- use it to express diagnosis, severity, priority, or expected impact;
- alter it merely because structured representation is now preserved.

Evidence Semantics owns semantic confidence for its normalized semantic
facts.

## 13. Determinism

Equivalent validated factual input and equivalent execution context must
produce substantively equivalent canonical Evidence.

Substantive equivalence includes:

- Evidence identity under the governing identity specification;
- Organization identity;
- structured factual component count;
- component identities;
- component ordering when exposed;
- factual subjects;
- factual relations or fields;
- raw values and declared structural types;
- qualifiers;
- source fields and locators;
- provenance and traceability;
- Evidence confidence;
- a substantively consistent statement;
- stable diagnostics and explanations.

Determinism must not depend on:

- input collection order unless the source declares order meaningful;
- current system time outside governed `EngineContext`;
- randomness;
- process state;
- environment variables;
- persistence;
- external services;
- filesystem or network I/O;
- LLM or other nondeterministic generated output.

The exact component-ordering, identity, and statement-rendering rules require
a governed implementation specification before implementation.

## 14. Backward compatibility

An explicit migration strategy is required before implementation.

The strategy must account for:

- existing domain tests that construct Evidence directly;
- existing Validation factory and engine tests;
- existing fixtures represented inline in tests;
- public `@ginzaaipro/domain` Evidence construction;
- generated declarations and package consumers;
- existing Evidence records that contain a statement but no structured
  factual components;
- any consumer that assumes `statement` is the sole factual representation;
- any upstream capture or signal contract that does not preserve a required
  field, relation, value, type, qualifier, or locator.

The migration strategy must follow these rules:

1. Legacy Evidence must not be silently treated as compliant canonical
   Evidence.
2. Missing structured components must not be fabricated from legacy
   statement prose.
3. Existing Evidence may become compliant only through replay or
   reconstruction from retained validated structured source material under a
   governed migration.
4. Evidence that cannot be reconstructed faithfully must remain explicitly
   legacy and ineligible for deterministic Evidence Semantics.
5. Tests and fixtures must be migrated to provide explicit structured factual
   inputs and to verify statement/structure consistency.
6. Public constructor and declaration compatibility must be assessed
   explicitly; source compatibility must not be preserved through unsafe
   defaults.
7. Display-statement expectations must be separated from structured-content
   expectations.
8. No compatibility adapter may introduce diagnosis, semantic normalization,
   or natural-language interpretation.

This amendment does not select a constructor migration technique, record
storage migration, replay mechanism, version marker, deprecation period, or
release sequence.

No migration code is authorized.

## 15. Relationship to Capture

ADR-0018 states that Capture and adapters should preserve available source
structure whenever possible.

This amendment does not change `CaptureInput`, `CaptureEngine`, or
`BusinessSignal`.

If Validation cannot construct compliant Evidence because required factual
structure was discarded before the Validation boundary, implementation must
remain blocked until the owning Capture or domain specification is amended.
Validation must not reconstruct the missing structure from prose, external
lookups, or assumptions.

Any Capture contract change remains governed separately from SAS-0001A.

## 16. Relationship to Evidence Semantics

The responsibility chain is:

```text
Validation
  preserves qualified factual structure
      |
Evidence Semantics
  transforms factual structure into canonical semantic facts
      |
Intelligence
  interprets semantic facts operationally
```

Validation preserves factual structure.

Evidence Semantics transforms factual structure.

Intelligence interprets semantic structure.

No layer may absorb another layer's responsibility.

In particular:

- Validation does not emit canonical semantic facts;
- Evidence Semantics does not revalidate Evidence;
- Evidence Semantics does not parse statements to replace missing structure;
- Intelligence does not consume raw statement prose;
- Intelligence does not perform semantic extraction;
- neither Validation nor Evidence Semantics performs operational diagnosis.

## 17. Specification ownership

This amendment resolves the ownership ambiguity recorded by ADR-0018:

- SAS-0001A governs Validation responsibilities and canonical Evidence
  construction;
- SAS-0002 continues to govern Capture;
- SAS-0002A governs the Evidence Semantics layer.

Any future amendment to Capture is separate and must not redefine Validation
or Evidence Semantics responsibilities.

## 18. Acceptance criteria

This amendment is complete only when:

- Validation responsibilities are unambiguous;
- canonical Evidence representation is fully specified at an
  implementation-neutral level;
- structured factual component requirements are defined;
- statement and structured-representation authority are distinguished;
- provenance and independent traceability requirements are defined;
- Validation invariants are defined;
- Evidence factory expectations are defined;
- failure behavior is defined without authorizing implementation;
- backward compatibility expectations are recorded;
- the relationship among Validation, Evidence Semantics, and Intelligence is
  explicit;
- implementation-neutral language is maintained;
- no semantic extraction behavior is introduced;
- no operational interpretation or Intelligence behavior is introduced;
- no TypeScript, package, test, fixture, export, or migration change is
  authorized.

Implementation readiness additionally requires a separate governed checklist
and any required identity, ordering, diagnostic, statement-rendering, and
migration details. Satisfaction of this document alone does not authorize
code changes.

## 19. Out of scope

SAS-0001A does not define:

- TypeScript interfaces;
- package layout;
- migration code;
- persistence or record conversion;
- extraction policies;
- semantic predicates;
- semantic normalization;
- semantic confidence algorithms;
- semantic identity vectors;
- Intelligence rules;
- prioritization;
- Recommendations;
- execution;
- orchestration;
- implementation.
