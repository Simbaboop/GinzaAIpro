SAS-0002A: Evidence Semantics Layer

## Status

Normative beginning with Sprint 2.4A.

No implementation is authorized by this specification.

## Governing decisions

This specification is governed by:

- ADR-0015: Canonical Capture Boundary;
- ADR-0016: Canonical Business Diagnosis;
- ADR-0017: Canonical Evidence Semantics;
- SAS-0002: Deterministic Capture Engine;
- SAS-0003: Intelligence Engine.

ADR-0017 establishes the HCES principle of Semantic Separation:

> Operational reasoning shall never depend directly upon unstructured
> language.

SAS-0002A specifies the canonical layer required to uphold that principle. If
a semantic representation cannot be produced without business-domain
reasoning, operational interpretation, or an unsupported inference, the
transformation must fail. The semantic layer must not embed that reasoning.

## 1. Purpose

Define the canonical Evidence Semantics layer between validated Evidence and
operational Intelligence.

This specification defines:

- the canonical semantic transformation boundary;
- canonical semantic entities;
- semantic invariants;
- semantic lineage;
- normalization rules;
- deterministic extraction contracts;
- semantic confidence;
- package ownership and dependency boundaries;
- stable diagnostics;
- the required test matrix;
- acceptance criteria for a future implementation.

The Evidence Semantics layer converts factual meaning explicitly present in
validated Evidence into immutable, structured, domain-neutral semantic facts.
It does not determine what those facts mean operationally.

## 2. Governing question

The Evidence Semantics layer answers:

> "What structured facts do these validated facts express?"

It must never answer:

- What operational condition exists?
- Why is that condition important?
- Is the condition leakage, risk, opportunity, or strength?
- What should be prioritized?
- What action should be recommended?
- How should an action be executed?
- What outcome should be expected?

Those questions belong to downstream governed layers.

## 3. Canonical transformation boundary

The canonical flow is:

```text
Validated Evidence
        |
Deterministic Semantic Extraction
        |
Canonical Normalization
        |
Evidence Semantics
        |
Deterministic Operational Interpretation
        |
Intelligence
```

The input boundary is immutable canonical Evidence. The output boundary is an
immutable canonical `EvidenceSemantics` record containing structured
`SemanticFact` values and complete Evidence lineage.

Conceptually, the engine contract is:

```text
readonly Evidence[] -> EvidenceSemantics
```

A successful invocation produces exactly one `EvidenceSemantics` record for
the supplied semantic extraction set. Independent extraction sets require
independent invocations.

An extraction set may contain one or more Evidence records when a semantic
fact is explicitly supported by more than one record. Evidence ordering has
no semantic meaning. Before extraction, lineage, or identity construction,
Evidence must be canonically ordered by `Evidence.id.value`.

On failure, no partial `EvidenceSemantics` record or partial canonical
`SemanticFact` collection is returned.

### Boundary ownership

The Evidence Semantics layer owns:

- structural extraction of explicitly expressed facts;
- canonical lexical and typed-value normalization;
- semantic fact construction;
- semantic confidence;
- lineage from each semantic fact to supporting Evidence;
- deterministic diagnostics and explanations.

It does not own:

- Evidence validation or revalidation;
- truth assessment;
- business classification;
- operational interpretation;
- diagnosis;
- prioritization;
- Recommendation;
- execution;
- persistence or external side effects.

## 4. Scope

This specification governs:

- canonical `EvidenceSemantics`;
- canonical `SemanticFact`;
- canonical semantic subjects, predicates, values, qualifiers, and lineage;
- the Evidence Semantics engine contract;
- deterministic extraction-policy behavior;
- structural normalization;
- semantic-confidence representation;
- future package integration, exports, diagnostics, explanations, and tests.

The semantic layer is domain-neutral. It may represent an explicitly
expressed relation, value, time, quantity, or qualifier, but it must not
decide the business significance of that representation.

## 5. Explicit non-goals

SAS-0002A does not define or authorize:

- operational Intelligence;
- leakage, risk, opportunity, or strength classification;
- causal inference;
- economic estimation;
- prioritization;
- Recommendation;
- execution;
- outcome prediction;
- workflows or orchestration;
- persistence;
- adapters or connectors;
- raw webhook, file, email, speech, image, API, or kernel-event parsing;
- a business ontology;
- a business-rule catalog;
- synonym inference based on business meaning;
- enrichment from external data;
- hidden reasoning;
- direct LLM generation of canonical Intelligence;
- TypeScript or package implementation.

## 6. Canonical semantic entities

The entities in this section are structural representations. Their names,
fields, and invariants are normative, while their future TypeScript file
organization is not defined here.

### 6.1 `EvidenceSemantics`

`EvidenceSemantics` is the immutable canonical record produced for one
semantic extraction set.

It contains:

| Field | Conceptual type | Responsibility |
| --- | --- | --- |
| `id` | `Identifier` | Deterministic identity of the canonical semantic record. |
| `organizationId` | `Identifier` | Organization that owns all supporting Evidence and resulting semantic facts. |
| `evidenceIds` | `readonly Identifier[]` | Canonically ordered identities of all Evidence supplied to and used by the extraction set. |
| `facts` | `readonly SemanticFact[]` | One or more immutable structured semantic facts in canonical order. |
| `extractionPolicy` | `ExtractionPolicyReference` | Stable identifier and version of the policy that produced the record. |
| `createdAt` | RFC 3339 UTC string | Canonical record creation time supplied by `EngineContext.executionTime`. |

`EvidenceSemantics` is not a diagnosis, interpretation, profile, decision, or
action. It is a lineage-bearing container of structured facts.

Every Evidence identifier in `evidenceIds` must support at least one contained
`SemanticFact`. Evidence that contributes no semantic fact is not part of the
extraction set and must not be included merely as context.

### 6.2 `SemanticFact`

`SemanticFact` is an immutable atomic proposition represented structurally as:

```text
subject -- predicate --> object
```

It contains:

| Field | Conceptual type | Responsibility |
| --- | --- | --- |
| `id` | `Identifier` | Deterministic identity of this normalized fact and its lineage. |
| `subject` | `SemanticReference` | Canonical reference to the entity, occurrence, or concept described by the fact. |
| `predicate` | `SemanticPredicate` | Namespaced relation asserted between the subject and object. |
| `object` | `SemanticValue` | Typed value asserted by the fact. |
| `qualifiers` | `readonly SemanticQualifier[]` | Optional structural constraints or context explicitly present in Evidence. |
| `lineage` | `readonly SemanticLineage[]` | One or more references to supporting Evidence and extraction rules. |
| `confidence` | `Percentage` | Confidence that this structured fact faithfully represents the supporting Evidence. |

A `SemanticFact` is atomic: it contains one subject, one predicate, and one
object. Conjunctions must be represented as multiple facts unless a canonical
typed value explicitly represents a collection. A fact must not contain a
business conclusion, recommendation, priority, or execution instruction.

The semantic layer may preserve an explicitly asserted relationship. It must
not infer that relationship from business context.

### 6.3 `SemanticReference`

`SemanticReference` identifies the subject of a semantic fact without
embedding a business object graph.

It contains:

| Field | Conceptual type | Responsibility |
| --- | --- | --- |
| `namespace` | non-empty string | Stable vocabulary or source namespace. |
| `value` | non-empty string | Stable reference within that namespace. |

The pair `(namespace, value)` is the complete reference. A reference does not
embed a domain entity, runtime object, repository key, or infrastructure
handle.

The semantic layer must preserve a supplied canonical reference. It must not
resolve identity through persistence, external lookups, fuzzy matching, or
business inference.

### 6.4 `SemanticPredicate`

`SemanticPredicate` is an immutable namespaced token describing a structural
relation.

It contains:

| Field | Conceptual type | Responsibility |
| --- | --- | --- |
| `namespace` | non-empty string | Stable vocabulary namespace. |
| `name` | non-empty string | Stable predicate name within the namespace. |

Predicate names identify relation vocabulary; they do not themselves grant
authority to diagnose a business condition. The canonical semantic layer
validates predicate form and policy support, not business significance.

SAS-0002A does not define a business predicate catalog. Any future vocabulary
that requires business-domain reasoning requires its own governed
specification and must remain separate from the domain-neutral semantic
contracts.

### 6.5 `SemanticValue`

`SemanticValue` is an immutable tagged value. Exactly one tag and its
corresponding value are present.

The canonical tags are:

| Tag | Canonical representation |
| --- | --- |
| `text` | NFC-normalized non-empty Unicode string. |
| `boolean` | `true` or `false`. |
| `integer` | Base-10 integer string without leading `+`, redundant leading zeros, or negative zero. |
| `decimal` | Base-10 finite decimal string in canonical non-exponent form. |
| `instant` | Valid RFC 3339 instant normalized to UTC ISO 8601. |
| `date` | Valid calendar date in `YYYY-MM-DD` form. |
| `duration` | Valid ISO 8601 duration in canonical form. |
| `identifier` | Immutable `SemanticReference`. |
| `quantity` | Canonical decimal magnitude plus a non-empty namespaced unit token. |

No implicit cross-tag coercion is allowed. Text that resembles a number,
date, duration, identifier, or quantity remains text unless the applied
extraction rule explicitly and unambiguously assigns the corresponding tag.

`SemanticValue` does not include diagnosis, severity, priority,
Recommendation, Action, or execution-state tags.

### 6.6 `SemanticQualifier`

`SemanticQualifier` adds explicitly expressed structural context to a
`SemanticFact`.

It contains:

| Field | Conceptual type | Responsibility |
| --- | --- | --- |
| `predicate` | `SemanticPredicate` | Namespaced qualifier relation. |
| `value` | `SemanticValue` | Typed qualifier value. |

Qualifiers may preserve explicit scope, time, location, source, or measurement
context. They must not introduce inferred causes, impacts, priorities,
recommended actions, or operational classifications.

Qualifiers cannot contain nested qualifiers. Repeated qualifiers are allowed
only when their normalized predicate-and-value pairs are distinct.

### 6.7 `SemanticLineage`

`SemanticLineage` provides immutable attribution from one `SemanticFact` to
one supporting Evidence record.

It contains:

| Field | Conceptual type | Responsibility |
| --- | --- | --- |
| `evidenceId` | `Identifier` | Identity of supporting canonical Evidence. |
| `sourceField` | non-empty string | Canonical Evidence field from which the fact was extracted. |
| `sourceLocator` | non-empty string or `undefined` | Stable locator within the field when a deterministic locator exists. |
| `extractionRuleId` | non-empty string | Stable extraction-rule identifier. |
| `extractionRuleVersion` | semantic-version string | Exact extraction-rule version. |

Lineage identifies source material without copying mutable Evidence into the
semantic record. A source locator may identify a character span, token range,
structured path, or whole field according to the extraction rule. It must be
stable for equivalent normalized Evidence.

An absent `sourceLocator` means the extraction rule attributes the fact to the
whole named source field. It must not mean that lineage is unknown.

### 6.8 `ExtractionPolicyReference`

`ExtractionPolicyReference` identifies the complete immutable policy used for
an extraction.

It contains:

| Field | Conceptual type | Responsibility |
| --- | --- | --- |
| `id` | non-empty string | Stable policy identifier. |
| `version` | semantic-version string | Exact immutable policy version. |

Changing rule membership, precedence, parsing behavior, normalization
behavior, or confidence behavior requires a new policy version.

## 7. Semantic invariants

The following invariants are mandatory:

1. Every semantic record belongs to exactly one Organization.
2. Every semantic record references one or more canonical validated Evidence
   records.
3. Every semantic record contains one or more `SemanticFact` values.
4. Every semantic fact contains exactly one subject, predicate, and object.
5. Every semantic fact has one or more lineage entries.
6. Every lineage Evidence identifier appears in the parent
   `EvidenceSemantics.evidenceIds`.
7. Every parent Evidence identifier supports at least one semantic fact.
8. Every semantic fact is explicitly supported by its cited Evidence.
9. No semantic fact may be fabricated from missing context.
10. No semantic fact may be derived from an implication, assumption,
    stereotype, business heuristic, or external lookup.
11. Ambiguous source language must fail extraction unless a deterministic
    rule can preserve the ambiguity structurally without choosing a business
    meaning.
12. The semantic layer must not classify a fact as leakage, risk,
    opportunity, strength, or any other operational diagnosis.
13. The semantic layer must not estimate economic significance, priority,
    recommended action, or likely outcome.
14. Semantic confidence must describe extraction fidelity only.
15. Evidence confidence and validity remain unchanged and must not be
    reinterpreted as semantic confidence.
16. All entities and collections are immutable and defensively copied.
17. Equivalent normalized inputs under the same extraction-policy version
    produce substantively equivalent outputs.

If satisfying any invariant would require business-domain reasoning, the
engine must return an unsupported or ambiguous extraction failure.

## 8. Semantic lineage

Lineage is required at both record and fact level.

The parent `EvidenceSemantics.evidenceIds` collection establishes the complete
Evidence boundary of the extraction set. Each `SemanticFact.lineage`
collection establishes which Evidence records and extraction rules support
that particular fact.

Lineage must:

- include all and only supporting Evidence;
- preserve canonical Evidence identity;
- use canonical Evidence fields and deterministic locators;
- identify the exact extraction rule and version;
- be ordered canonically;
- remain immutable;
- remain reviewable without exposing hidden reasoning;
- never substitute `BusinessSignal`, Finding, runtime-event, or external
  payload identity for Evidence identity.

The engine must not:

- cite Evidence not supplied to the invocation;
- omit Evidence used to construct a fact;
- cite a source field that the Evidence contract does not contain;
- invent a source locator;
- embed mutable Evidence;
- replace lineage with explanatory prose.

Canonical lineage ordering is:

1. `evidenceId.value`;
2. normalized `sourceField`;
3. normalized `sourceLocator`, with absence before a present value;
4. `extractionRuleId`;
5. `extractionRuleVersion`.

## 9. Normalization rules

Normalization is structural and loss-averse. It must not change business
meaning or infer semantic equivalence.

### 9.1 Strings

Unless a more specific typed-value rule applies:

- normalize Unicode to NFC;
- normalize line endings to LF;
- remove leading and trailing Unicode whitespace;
- reject an empty result where a field is required;
- preserve case;
- preserve internal whitespace;
- do not translate language;
- do not apply stemming, synonym replacement, fuzzy matching, or
  domain-specific abbreviation expansion.

### 9.2 Namespaces and tokens

Namespace, predicate, policy, rule, and unit tokens:

- use their policy-defined canonical spelling;
- are compared ordinally;
- are case-sensitive;
- must not contain leading or trailing whitespace;
- must not be guessed from a display label.

### 9.3 Numeric values

Numeric normalization:

- rejects non-finite values;
- rejects locale-dependent separators;
- removes a leading `+`;
- removes redundant integer leading zeros;
- normalizes negative zero to zero;
- uses base 10;
- converts exponent notation to canonical non-exponent decimal form;
- preserves exact value without binary floating-point rounding.

### 9.4 Temporal values

Instant normalization:

- requires an RFC 3339 date-time with `Z` or an explicit numeric UTC offset;
- rejects impossible or timezone-free values;
- normalizes valid instants to UTC ISO 8601.

Date normalization:

- requires a valid calendar date;
- preserves date-only meaning;
- must not invent a timezone or instant.

Duration normalization:

- requires an unambiguous ISO 8601 duration;
- rejects source text that requires contextual calendar assumptions;
- preserves exact duration meaning.

### 9.5 Collections

Collections:

- are defensively copied;
- are sorted only by their normative canonical keys;
- reject exact duplicates after normalization;
- must not merge merely similar facts;
- must not infer equivalence across different namespaces, predicates, units,
  or value tags.

Facts are canonically ordered by:

1. `subject.namespace`;
2. `subject.value`;
3. `predicate.namespace`;
4. `predicate.name`;
5. canonical object serialization;
6. canonical qualifier serialization;
7. canonical lineage serialization.

Qualifiers are ordered by predicate namespace, predicate name, and canonical
value serialization.

### 9.6 No semantic enrichment during normalization

Normalization must not:

- infer an absent subject, predicate, object, unit, time, or qualifier;
- convert one predicate into a purported synonym;
- infer causality, comparison, trend, severity, consequence, or intent;
- introduce a benchmark or reference value not present in Evidence;
- combine separate facts into a diagnosis;
- call external services or consult mutable reference data.

## 10. Deterministic extraction contracts

### 10.1 Extraction policy

Canonical extraction uses a closed, explicit, versioned policy.

An extraction policy must define:

- a stable policy identifier and immutable semantic version;
- a finite rule catalog;
- stable rule identifiers and versions;
- the exact Evidence fields each rule may inspect;
- structural eligibility conditions;
- the exact fact, qualifier, lineage, and confidence construction behavior;
- explicit precedence where rules overlap;
- unsupported and ambiguous extraction behavior;
- deterministic rule ordering.

Rules must be immutable at runtime. Policy behavior must not depend on
registration order, object iteration order, locale, environment, process
state, external data, or current time.

### 10.2 Rule eligibility

An extraction rule is eligible only when:

- every inspected value comes from supplied canonical Evidence;
- the rule's structural pattern is satisfied explicitly;
- all required subject, predicate, object, type, qualifier, and lineage data
  are present;
- no business-domain judgment is required;
- no unsupported inference is required.

Structural matching may recognize policy-defined syntax or schema. It must
not decide operational significance.

### 10.3 Rule selection

For each extractable source fragment:

- exactly one rule must be selected according to explicit policy precedence;
- no implicit precedence is allowed;
- equivalent input must select the same rule;
- no matching rule produces `EVIDENCE_SEMANTICS_EXTRACTION_UNSUPPORTED`;
- competing rules without explicit deterministic precedence produce
  `EVIDENCE_SEMANTICS_EXTRACTION_AMBIGUOUS`;
- a rule requiring business-domain reasoning is ineligible.

Multiple non-conflicting rules may extract distinct facts from one Evidence
record. Their outputs are canonically ordered after normalization.

### 10.4 Explicit-content rule

Extraction may structure only content explicitly present in Evidence.

An extractor may:

- segment explicit propositions;
- assign an unambiguous tagged value;
- bind an explicit subject, predicate, object, or qualifier;
- preserve a relation explicitly asserted by Evidence;
- normalize according to section 9.

An extractor may not:

- infer an unstated fact;
- infer a cause from correlation or sequence;
- infer impact, urgency, severity, priority, or recommended action;
- fill missing fields from common knowledge;
- enrich Evidence with external facts;
- interpret a fact as a business diagnosis;
- silently choose among multiple plausible meanings.

### 10.5 Determinism

Given identical normalized Evidence, Organization context, extraction policy,
and policy version, extraction must produce substantively equivalent
`EvidenceSemantics`.

Substantive equivalence requires:

- the same semantic-record identity;
- the same semantic-fact identities;
- the same canonical Evidence ordering;
- the same subjects, predicates, objects, qualifiers, and fact ordering;
- the same lineage;
- the same semantic confidence;
- the same diagnostic codes, severities, messages, and ordering;
- equivalent deterministic explanations.

`createdAt` comes only from `EngineContext.executionTime` and is excluded from
identity. Runtime duration is operational metadata and is excluded from
substantive equivalence.

Extraction must not use:

- randomness;
- the live system clock;
- process identifiers or counters;
- mutable global state;
- environment variables;
- persistence;
- network or filesystem I/O;
- external lookups;
- nondeterministic model output;
- hidden prompts or hidden reasoning.

### 10.6 AI-assisted extraction

LLMs, OCR, speech recognition, and similar systems may assist upstream of
canonical semantic construction as permitted by ADR-0017.

Their output is not canonical merely because it is structured. To enter the
canonical Evidence Semantics boundary, assisted output must be subjected to a
versioned extraction policy that:

- verifies structural validity;
- verifies Evidence lineage;
- rejects unsupported assertions;
- supplies explicit semantic confidence;
- produces reproducible canonical normalization and identity;
- does not create operational Intelligence.

If an assisted process cannot satisfy deterministic reproducibility and
lineage requirements, its output remains a non-canonical extraction
candidate. The transport and lifecycle of such candidates are outside
SAS-0002A.

## 11. Organization boundary

Every Evidence record in an extraction set must belong to the same
Organization, and that Organization must equal
`EngineContext.organizationId`.

The engine must fail when:

- Evidence belongs to multiple Organizations;
- a uniform Evidence Organization differs from the context Organization.

The semantic layer must not copy, merge, compare, or infer semantic facts
across Organization boundaries.

## 12. Deterministic identity

Semantic identities are content-addressed and versioned.

### 12.1 `SemanticFact` identity material

Fact identity material consists only of:

1. the fixed semantic-fact identity version;
2. `organizationId.value`;
3. canonical subject serialization;
4. canonical predicate serialization;
5. canonical object serialization;
6. canonical qualifier serialization;
7. canonical lineage serialization;
8. semantic-confidence basis points;
9. extraction-policy identifier and version.

### 12.2 `EvidenceSemantics` identity material

Record identity material consists only of:

1. the fixed semantic-record identity version;
2. `organizationId.value`;
3. extraction-policy identifier and version;
4. canonically ordered Evidence identifier values;
5. canonically ordered semantic-fact identifier values.

Identity must not use:

- `createdAt`;
- `EngineContext.executionTime`;
- correlation identifiers;
- runtime duration;
- randomness;
- process or environment state;
- mutable display text;
- external I/O.

SHA-256 over a length-prefixed UTF-8 canonical sequence is required. Digests
are rendered as lowercase hexadecimal. Exact version markers, identifier
prefixes, and fixed test vectors must be recorded by an implementation
supplement before implementation begins.

Identity utilities are package-private implementation details and must not
become generic domain or core utilities.

## 13. Semantic confidence

Semantic confidence means:

> confidence that a structured semantic fact faithfully represents the
> explicit meaning of its supporting validated Evidence.

It does not mean:

- confidence that Evidence is true;
- Evidence validity or material relevance;
- confidence in operational interpretation;
- severity, priority, probability of impact, or expected outcome;
- model quality in general.

Semantic confidence is recorded on every `SemanticFact` as a canonical
`Percentage`.

Each extraction rule must define one deterministic confidence basis. That
basis may use only structural properties explicitly available to the rule,
such as exact schema binding, unambiguous typed parsing, or an explicitly
supplied and governed extraction confidence. The rule must report its basis
in the result explanation.

The engine must not:

- copy Evidence confidence by default;
- average Evidence confidence;
- infer confidence from business content;
- clamp an invalid confidence;
- substitute a global default for a missing required confidence;
- increase confidence because multiple Evidence records contain similar
  language;
- decrease confidence based on operational significance.

Invalid, absent when required, or unsupported confidence produces
`EVIDENCE_SEMANTICS_INVALID_CONFIDENCE`.

The parent `EvidenceSemantics` record has no aggregate confidence. Consumers
must retain fact-level confidence and must not silently collapse distinct
confidence values.

## 14. Diagnostics

Diagnostic codes, severities, messages, recommendations, and ordering are
stable public behavior.

The engine is fail-fast for invocation-level invariants. A failed result:

- has `success === false`;
- has no value;
- contains exactly one error diagnostic for the first failed rule;
- contains a deterministic failure explanation;
- returns no partial canonical facts.

### 14.1 Stable diagnostic catalog

| Code | Severity | Trigger | Result |
| --- | --- | --- | --- |
| `EVIDENCE_SEMANTICS_EMPTY_EVIDENCE_SET` | `error` | Input contains no Evidence. | Failure; no value. |
| `EVIDENCE_SEMANTICS_MISSING_EVIDENCE` | `error` | An input position is sparse, null, undefined, or missing. | Failure; no value. |
| `EVIDENCE_SEMANTICS_UNSUPPORTED_EVIDENCE` | `error` | An entry is not canonical validated Evidence. | Failure; no value. |
| `EVIDENCE_SEMANTICS_DUPLICATE_EVIDENCE` | `error` | Two entries have the same Evidence identity. | Failure; no value. |
| `EVIDENCE_SEMANTICS_MIXED_ORGANIZATIONS` | `error` | Input Evidence belongs to multiple Organizations. | Failure; no value. |
| `EVIDENCE_SEMANTICS_ORGANIZATION_MISMATCH` | `error` | Evidence Organization differs from `EngineContext.organizationId`. | Failure; no value. |
| `EVIDENCE_SEMANTICS_EXTRACTION_UNSUPPORTED` | `error` | No deterministic structural extraction rule supports explicit source content. | Failure; no value. |
| `EVIDENCE_SEMANTICS_EXTRACTION_AMBIGUOUS` | `error` | Competing meanings or extraction rules cannot be resolved structurally and deterministically. | Failure; no value. |
| `EVIDENCE_SEMANTICS_INVALID_FACT` | `error` | Extracted output violates semantic entity or atomicity invariants. | Failure; no value. |
| `EVIDENCE_SEMANTICS_LINEAGE_INVALID` | `error` | Required Evidence, source-field, locator, rule, or version attribution is absent or invalid. | Failure; no value. |
| `EVIDENCE_SEMANTICS_NORMALIZATION_FAILURE` | `error` | A value cannot be normalized without loss, inference, or ambiguity. | Failure; no value. |
| `EVIDENCE_SEMANTICS_INVALID_CONFIDENCE` | `error` | A rule cannot produce valid explicit semantic confidence. | Failure; no value. |
| `EVIDENCE_SEMANTICS_DOMAIN_REASONING_REQUIRED` | `error` | Proposed extraction requires business diagnosis, significance, prioritization, Recommendation, or another domain judgment. | Failure; no value. |
| `EVIDENCE_SEMANTICS_CREATED` | `info` | One canonical semantic record was produced. | Success; immutable value returned. |

### 14.2 Deterministic validation order

The engine evaluates requirements in this order:

1. empty Evidence set;
2. missing Evidence;
3. unsupported or non-canonical Evidence;
4. duplicate Evidence identity;
5. mixed Evidence Organizations;
6. context Organization mismatch;
7. extraction-policy and rule eligibility;
8. domain-reasoning prohibition;
9. extraction ambiguity;
10. semantic-fact invariants;
11. lineage;
12. normalization;
13. semantic confidence;
14. identity and immutable semantic-record construction.

The first failed rule determines the diagnostic. Successful construction
returns `EVIDENCE_SEMANTICS_CREATED`.

## 15. Explanation requirements

Every result contains an immutable deterministic explanation.

A successful explanation must:

- identify the extraction-policy identifier and version;
- identify every applied extraction rule and version;
- identify all Evidence lineage;
- describe normalization applied without reproducing hidden reasoning;
- report the confidence basis for every semantic fact;
- state that only structured semantic facts were created;
- state that no operational interpretation, classification, prioritization,
  Recommendation, execution, or outcome was produced.

A failed explanation must:

- identify the stable failure diagnostic;
- identify only valid lineage known before failure;
- state that no canonical Evidence Semantics was created;
- describe the failed structural rule;
- state when business-domain reasoning would have been required;
- avoid raw external payloads, stack traces, prompts, chain-of-thought, and
  nondeterministic prose.

Explanations report observable inputs, applied policy, transformations, and
outcomes. They must not expose hidden reasoning.

## 16. Immutability

The semantic layer must not mutate:

- the input Evidence collection;
- any Evidence record;
- Evidence identity, statement, confidence, or provenance;
- `EngineContext`;
- extraction-policy or rule catalogs.

The returned semantic record, facts, references, predicates, values,
qualifiers, lineage, policy reference, diagnostics, and explanation must be
immutable or defensively copied according to existing domain and core
conventions.

No returned collection may expose mutable internal state.

## 17. Package ownership

Canonical ownership is:

| Package or layer | Owned responsibility |
| --- | --- |
| `packages/domain` | Immutable canonical `EvidenceSemantics`, `SemanticFact`, and supporting semantic value objects. |
| `packages/core` | Evidence Semantics engine behavioral contract and engine-result integration. |
| `packages/evidence-semantics` | Deterministic extraction policy, normalization, identity, diagnostics, explanations, and concrete engine implementation. |
| Validation | Evidence qualification only. |
| Intelligence | Deterministic operational interpretation of canonical Evidence Semantics only. |

The future implementation package is named:

```text
@ginzaaipro/evidence-semantics
```

Domain and core own stable contracts. The implementation package must not
redefine semantic entities or export implementation details as competing
canonical contracts.

Source-specific adapters, OCR, speech recognition, LLM clients, and candidate
transport mechanisms remain outside `packages/evidence-semantics`.

## 18. Dependency boundaries

`packages/evidence-semantics` may depend only on:

- `@ginzaaipro/core`;
- `@ginzaaipro/domain`.

It must not depend on:

- `@ginzaaipro/kernel`;
- `@ginzaaipro/capture`;
- the Validation implementation package;
- `@ginzaaipro/intelligence`;
- priority, Recommendation, execution, or outcome packages;
- adapters or connectors;
- runtime or platform packages;
- persistence or orchestration packages;
- external AI, OCR, speech, or network clients.

`packages/core` must not depend on `packages/kernel`, implementation packages,
or adapters.

`packages/domain` must not depend on core, kernel, implementation, runtime,
framework, persistence, or external-service packages.

Dependencies point toward stable contracts:

```text
packages/domain
      ^
packages/core
      ^
packages/evidence-semantics
      ^
future orchestration
```

Cross-package imports must use canonical package names. Relative
cross-package imports are prohibited. No circular dependency may be
introduced.

## 19. Public contract requirements

A future implementation must make the following canonical types available
through their owning package entry points:

- `EvidenceSemantics`;
- `SemanticFact`;
- `SemanticReference`;
- `SemanticPredicate`;
- `SemanticValue`;
- `SemanticQualifier`;
- `SemanticLineage`;
- `ExtractionPolicyReference`;
- the Evidence Semantics engine behavioral contract;
- the concrete deterministic Evidence Semantics engine.

The following remain internal to `@ginzaaipro/evidence-semantics`:

- extraction-rule catalogs;
- rule-selection machinery;
- canonical serializers;
- hashing and identity utilities;
- normalization utilities;
- diagnostic factories;
- explanation factories.

Internal utilities must not become generic public abstractions or competing
semantic contracts.

## 20. Test matrix

A future implementation must include at least:

| Test | Required assertion |
| --- | --- |
| Single Evidence | Supported explicit content produces one immutable semantic record with one or more facts and complete lineage. |
| Multiple Evidence | A supported extraction set preserves all and only contributing Evidence identifiers in canonical order. |
| Empty input | Returns `EVIDENCE_SEMANTICS_EMPTY_EVIDENCE_SET`, failure, and no value. |
| Missing Evidence | Sparse, null, or undefined input returns `EVIDENCE_SEMANTICS_MISSING_EVIDENCE`. |
| Unsupported Evidence | Non-canonical Evidence returns `EVIDENCE_SEMANTICS_UNSUPPORTED_EVIDENCE`. |
| Duplicate Evidence | Repeated Evidence identity returns `EVIDENCE_SEMANTICS_DUPLICATE_EVIDENCE`. |
| Mixed Organizations | Evidence from multiple Organizations returns `EVIDENCE_SEMANTICS_MIXED_ORGANIZATIONS`. |
| Context Organization mismatch | Uniform Evidence from another Organization returns `EVIDENCE_SEMANTICS_ORGANIZATION_MISMATCH`. |
| Unsupported extraction | Explicit content unsupported by the policy fails without a partial value. |
| Ambiguous extraction | Structurally unresolved competing meanings return `EVIDENCE_SEMANTICS_EXTRACTION_AMBIGUOUS`. |
| Domain reasoning prohibited | Input requiring operational or business judgment returns `EVIDENCE_SEMANTICS_DOMAIN_REASONING_REQUIRED`. |
| Atomic fact | Every output fact has exactly one subject, predicate, and object. |
| Typed values | Every canonical value tag applies its exact normalization and rejects invalid forms. |
| Qualifiers | Explicit qualifiers are preserved, normalized, canonically ordered, and immutable. |
| No inferred qualifier | Missing scope, time, unit, or context is not fabricated. |
| Complete lineage | Every fact cites all and only supporting Evidence and exact rule versions. |
| Invalid lineage | Missing or invented lineage returns `EVIDENCE_SEMANTICS_LINEAGE_INVALID`. |
| Normalization | Unicode, whitespace, numeric, temporal, identifier, quantity, collection, and ordering rules are deterministic. |
| No synonym inference | Similar text or predicates are not merged without an explicit structural rule. |
| Semantic confidence | Rule-defined extraction confidence is preserved as a canonical `Percentage`. |
| Confidence separation | Evidence confidence is not copied or reinterpreted as semantic confidence. |
| Invalid confidence | Invalid or missing required semantic confidence returns `EVIDENCE_SEMANTICS_INVALID_CONFIDENCE`. |
| Deterministic record identity | Equivalent normalized inputs and policy versions produce the same record identity. |
| Deterministic fact identity | Equivalent facts, lineage, confidence, and policy versions produce the same fact identity. |
| Fixed identity vectors | Documented canonical material produces the exact expected record and fact identifiers. |
| Permutation equivalence | Equivalent Evidence permutations produce substantively equivalent output. |
| Policy versioning | A governed policy-version change participates in identity and is reported in explanations. |
| Created timestamp | `createdAt` equals `EngineContext.executionTime`; the live clock is not read. |
| Stable diagnostics | Codes, severities, messages, recommendations, and order are reproducible. |
| Fail-fast order | Inputs with multiple defects return the first diagnostic in the normative order. |
| Explanation | Success and failure explanations contain exact policy, rule, lineage, normalization, and confidence information. |
| Input immutability | The Evidence collection and every Evidence record remain unchanged. |
| Output immutability | The entire semantic output graph, diagnostics, and explanation resist mutation through returned references. |
| No business diagnosis | Output contains no Intelligence category, operational conclusion, economic estimate, priority, or Recommendation. |
| No downstream behavior | No interpretation, prioritization, Recommendation, execution, or Outcome is performed. |
| No external behavior | Extraction performs no network, filesystem, persistence, runtime, model, or other external I/O. |
| Public package resolution | Canonical public imports resolve through package entry points. |
| Package boundaries | Forbidden dependencies, relative cross-package imports, and circular dependencies are absent. |

Tests must not depend on current time, input order, random state, locale,
environment variables, filesystem state, network access, external services,
model output, persistence, process state, or test execution order.

## 21. Acceptance criteria

A future Sprint 2.4A implementation is complete only when:

- every entity and invariant in this specification is implemented without
  embedding business-domain reasoning;
- canonical Evidence is the only factual input;
- immutable canonical Evidence Semantics is the only successful semantic
  output;
- each semantic fact is atomic, explicitly supported, normalized, and fully
  attributable;
- semantic confidence is explicit, deterministic, and separate from Evidence
  and Intelligence confidence;
- unsupported, ambiguous, or domain-reasoning-dependent extraction fails
  without partial canonical output;
- deterministic extraction, normalization, identity, diagnostics, and
  explanations are verified;
- fixed identity vectors are documented and pass;
- Organization boundaries are enforced;
- input and output immutability are verified;
- all package tests pass;
- domain and core contract tests pass;
- the full workspace build passes;
- the full workspace typecheck passes;
- all full workspace tests pass;
- canonical package imports and declarations resolve;
- no circular dependencies or relative cross-package imports exist;
- all forbidden dependencies are absent;
- no operational interpretation, business diagnosis, analytical profile,
  prioritization, Recommendation, execution, or Outcome behavior exists;
- no kernel, adapter, runtime, persistence, orchestration, framework, or
  external-I/O dependency exists;
- no unrelated files are changed.

Implementation must stop and return to architecture review if any proposed
semantic entity or extraction rule requires business-domain reasoning rather
than structural representation.

## 22. Relationship to SAS-0003

ADR-0017 establishes that Intelligence consumes canonical Evidence Semantics
and must never interpret unstructured Evidence directly.

SAS-0003 currently describes direct `readonly Evidence[]` input. That input
must not be implemented while it conflicts with ADR-0017. A separate governed
amendment must update the Intelligence boundary to consume canonical Evidence
Semantics before Sprint 2.5 implementation resumes.

SAS-0002A does not redefine Intelligence behavior, classification,
interpretation policy, or output.

## 23. Out of scope

SAS-0002A intentionally does not define:

- a business semantic vocabulary;
- business-domain extraction rules;
- operational interpretation policies;
- Intelligence classifications;
- analytical views;
- prioritization;
- Recommendations;
- execution;
- outcomes;
- raw-source adapters;
- persistence;
- runtime orchestration;
- implementation code.

Any future semantic vocabulary that requires business-domain reasoning must
be governed separately and must not be embedded in the canonical
domain-neutral semantic layer.
