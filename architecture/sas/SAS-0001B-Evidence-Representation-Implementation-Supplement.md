# SAS-0001B: Evidence Representation Implementation Supplement

## Status

Proposed for Sprint 2.4A architecture review.

This supplement resolves the implementation-specific details deliberately
deferred by SAS-0001A.

It supplements SAS-0001 and SAS-0001A. It does not replace either document.

No implementation is authorized by this supplement.

## Document version

```text
Version: 1.1.1
```

## Revision history

| Version | Date | Change |
| --- | --- | --- |
| `1.0.0` | 2026-07-19 | Initial implementation supplement. |
| `1.1.0` | 2026-07-19 | E0-001 bounded clarification: closed multi-component statement rendering, statement authority and invariant enforcement, decimal canonicalization, and related diagnostics/tests identified by IRG-0001. |
| `1.1.1` | 2026-07-19 | E0-003 patch clarification: reconciled invalid-value and unsupported-rule diagnostics, defined direct-policy versus full-engine precedence, and aligned fail-fast tests without changing contracts, rules, identities, ownership, or gate sequence. |

## Governing artifacts

This supplement is governed by:

- ADR-0015: Canonical Capture Boundary;
- ADR-0017: Canonical Evidence Semantics;
- ADR-0018: Canonical Evidence Representation;
- SAS-0001: Deterministic Validation Engine;
- SAS-0001A: Evidence Representation Amendment;
- SAS-0002A: Evidence Semantics Layer;
- Sprint 2.4A Evidence Semantics Input Discovery.

Path C, a neutral structured source representation inside canonical Evidence,
remains controlling.

## 1. Objective

Define the minimum implementation-ready canonical Evidence representation
required to:

1. preserve validated factual source structure;
2. support deterministic Evidence Semantics;
3. avoid natural-language parsing;
4. avoid business diagnosis inside Evidence;
5. preserve existing package ownership and dependency direction;
6. minimize migration complexity.

The initial implementation is intentionally narrow. It supports only
structured content already exposed by the current canonical `BusinessSignal`.
It does not claim general Evidence construction from prose or arbitrary
business records.

## 2. Repository alignment

### 2.1 Current contracts

The current repository establishes:

- canonical `Evidence` in
  `packages/domain/src/intelligence/Evidence.ts`;
- canonical `BusinessSignal` and `BusinessSignalValue` in
  `packages/domain/src/intelligence/BusinessSignal.ts`;
- immutable `Identifier`, `Money`, and `Percentage` value objects in
  `packages/domain/src/common`;
- `ValidationEngine` as
  `Engine<BusinessSignal, Evidence>` in
  `packages/core/src/validation/ValidationEngine.ts`;
- concrete Validation in
  `packages/validation/src/DeterministicValidationEngine.ts`;
- the sole production Evidence construction path in
  `packages/validation/src/factories/EvidenceFactory.ts`;
- stable fail-fast diagnostic codes in
  `packages/validation/src/diagnostics`;
- package-root exports through `@ginzaaipro/domain`,
  `@ginzaaipro/core`, and `@ginzaaipro/validation`.

Current `Evidence` retains:

- `id`;
- `organizationId`;
- `signalIds`;
- `source`;
- `signalValidationStatus`;
- `verificationMethod`;
- `materialRelevance`;
- `statement`;
- `confidence`;
- `createdAt`.

Current `EvidenceFactory` creates one Evidence from one `BusinessSignal`,
generates identity from signal and correlation identifiers, and replaces the
validated signal value with generic display prose.

Current `BusinessSignal` exposes sufficient structure for one narrow factual
component:

- stable signal identity;
- Organization identity;
- category;
- source;
- occurrence time;
- optional subject identity;
- a value typed as string, number, `bigint`, boolean, `Money`, or
  `Percentage`;
- confidence;
- valid qualification status.

It does not expose an external source reference or a source-specific business
field name. Therefore the initial policy preserves the canonical
`BusinessSignal.value` field as a source-oriented relation and does not claim
more specific meaning.

### 2.2 Compatibility conclusion

The existing `ValidationEngine` input remains `BusinessSignal`.

No second Evidence aggregate, second Validation contract, new canonical
layer, repository lookup, or upstream constitutional change is required for
the initial policy.

The initial policy can produce deterministic domain-neutral Evidence
components from explicit signal structure. More specific source fields,
external locators, quantities, dates, durations, or multi-field observations
require a future governed upstream amendment and are unsupported in version
1.0.0.

No accepted ADR is contradicted.

## 3. Minimum Complexity Constraint

Sprint 2.4A applies the GinzaAIpro Minimum Complexity Constraint.

The canonical contract includes only information required for:

- deterministic semantic extraction;
- independent attribution;
- source fidelity;
- Organization isolation;
- statement/structure consistency;
- deterministic identity;
- future migration safety.

The implementation must not create:

- an ontology;
- a general knowledge graph;
- an arbitrary metadata dictionary;
- a recursive component structure;
- component-level confidence;
- a pre-semantic canonical layer;
- an adapter-specific payload contract;
- business-domain component subclasses;
- a repository or source-resolution service.

Closed discriminated values and constrained immutable value objects are
required instead of open-ended dictionaries.

## 4. Selected canonical contract names

The selected canonical names are:

- `EvidenceComponent`;
- `EvidenceRelation`;
- `EvidenceValue`;
- `EvidenceQualifier`;
- `EvidenceComponentProvenance`;
- `EvidenceConstructionRuleReference`.

`EvidenceComponent` is retained as the primary name because it is concise,
consistent with the existing `Evidence` aggregate, and does not claim
downstream semantic authority.

None of these contracts reuses or aliases `SemanticFact`,
`SemanticPredicate`, `SemanticValue`, or another Evidence Semantics contract.

## 5. `EvidenceComponent`

`EvidenceComponent` is an immutable domain value that preserves one
independently attributable factual component qualified into Evidence.

Its exact conceptual fields are:

| Field | Conceptual type | Required | Responsibility |
| --- | --- | --- | --- |
| `id` | `Identifier` | Yes | Deterministic component identity. |
| `subjectId` | `Identifier \| undefined` | No | Explicit canonical subject identity supplied by the source signal. |
| `relation` | `EvidenceRelation` | Yes | Source-oriented field or relation; not a canonical semantic predicate. |
| `value` | `EvidenceValue` | Yes | Closed, typed representation of the validated raw value. |
| `qualifiers` | `readonly EvidenceQualifier[]` | Yes | Explicit, non-recursive structural context. Empty is permitted. |
| `provenance` | `readonly EvidenceComponentProvenance[]` | Yes | One or more independently attributable source records. |
| `constructionRule` | `EvidenceConstructionRuleReference` | Yes | Exact Validation construction rule and version. |

The component does not repeat `organizationId`. Organization ownership is
held once by the parent Evidence aggregate and participates in component
identity. Validation must establish that every provenance entry belongs to
that Organization before construction.

The component has no statement, diagnosis, priority, Recommendation,
semantic confidence, extraction policy, or arbitrary metadata.

## 6. Subject representation

The subject is represented by the existing canonical `Identifier`.

This is the smallest deterministic representation compatible with the
current `BusinessSignal.subjectId` and avoids introducing premature
namespaced semantic subject normalization.

Rules:

- when `BusinessSignal.subjectId` is present, the component preserves the
  same immutable `Identifier`;
- when it is absent, `EvidenceComponent.subjectId` is `undefined`;
- absence is valid for the initial rules;
- the factory must not infer a subject from source, category, value,
  statement, business context, or external lookup;
- an explicitly supplied runtime value that is not an `Identifier` fails
  subject validation;
- subject identity is included in component identity with an explicit
  present/absent marker.

Future source-oriented tokens that are not canonical identifiers require a
new governed contract version. They must not be represented as fabricated
`Identifier` values.

## 7. Relation representation

`EvidenceRelation` is an immutable constrained source-oriented reference with
exact fields:

| Field | Type | Rule |
| --- | --- | --- |
| `namespace` | `string` | Required constrained token. |
| `name` | `string` | Required constrained token. |

Both fields:

- are trimmed and Unicode NFC-normalized;
- must match
  `^[a-z][a-z0-9]*(?:[.-][a-z0-9]+)*$`;
- are case-sensitive after validation;
- are compared ordinally;
- may not contain display prose, whitespace, or ungoverned punctuation.

The initial policy uses:

```text
namespace = ginzaaipro.business-signal
name      = value
```

This relation means only "the canonical value field of a BusinessSignal." It
does not identify a business metric, canonical semantic predicate, cause,
impact, diagnosis, or action.

Downstream Evidence Semantics policies may map this source relation together
with explicit qualifiers and provenance. Validation does not perform that
mapping.

## 8. Closed structural value contract

`EvidenceValue` is a closed immutable discriminated union.

The exact supported variants for policy version 1.0.0 are:

| `kind` | Payload | Source support |
| --- | --- | --- |
| `"text"` | `value: string` | Non-empty `BusinessSignal` string. |
| `"boolean"` | `value: boolean` | `BusinessSignal` boolean. |
| `"integer"` | `value: string` | `bigint` or safe integer `number`, rendered in canonical base-10 form. |
| `"decimal"` | `value: string` | Finite non-integer `number`, rendered as an exact round-tripping canonical decimal string. |
| `"instant"` | `value: string` | Valid explicit timestamp used by a governed qualifier. |
| `"money"` | `minorUnits: string`, `currency: string` | Canonical `Money`. |
| `"percentage"` | `basisPoints: number` | Canonical `Percentage`. |

No `date`, `duration`, `identifier`, or generic `quantity` value variant is
included in version 1.0.0 because the current `BusinessSignalValue` contract
does not distinguish those forms. Subject and provenance identifiers remain
typed fields rather than generic Evidence values.

### 8.1 Value normalization

Normalization is limited to deterministic storage and identity:

- text is trimmed, Unicode NFC-normalized, and rejected when empty;
- boolean is preserved exactly;
- integer uses base-10 digits, no leading `+`, no redundant leading zeros,
  and no negative zero;
- a `bigint` is converted with its canonical base-10 representation;
- a safe integer `number` is converted to canonical base-10 representation;
- an integer-valued number outside the JavaScript safe-integer range is
  rejected rather than relabeled as exact integer;
- decimal follows the complete canonical algorithm in section 8.2;
- instant requires an explicit RFC 3339 timezone and is normalized to UTC
  ISO 8601;
- money preserves `minorUnits` exactly as canonical base-10 and preserves the
  canonical uppercase currency already enforced by `Money`;
- percentage preserves integer basis points exactly.

No cross-kind coercion is allowed. In particular:

- numeric-looking text remains text;
- timestamp-looking text remains text unless a closed rule supplies it as an
  instant qualifier;
- boolean-looking text remains text;
- money and percentage are not flattened into decimal;
- invalid values are rejected, not clamped or defaulted.

Canonical value serialization is the `kind` followed by its payload fields in
the order listed above.

### 8.2 Exact decimal canonicalization

#### Normative representation

The normative Evidence decimal representation is the canonical decimal
string stored in `EvidenceValue`.

Binary floating-point is not the normative Evidence representation and must
never be used directly for:

- Evidence component identity;
- Evidence identity;
- equality or ordering after component construction;
- statement rendering;
- hashing.

The current `BusinessSignalValue` `number` is an upstream input constraint.
Policy version 1.0.0 converts that already-canonical signal value exactly once
into the normative decimal string. All subsequent governed behavior uses only
that string.

#### Accepted input domain

`VAL-EVIDENCE-DECIMAL-001@1.0.0` accepts only a JavaScript `number` for which:

- `Number.isFinite(value)` is `true`;
- `Number.isInteger(value)` is `false`.

The following do not enter decimal canonicalization:

- `NaN` and positive or negative infinity are invalid values;
- safe integer numbers and `bigint` values use the Integer rule;
- integer-valued unsafe numbers are rejected as invalid because exact integer
  source fidelity cannot be established;
- strings remain Text, even when they resemble decimal, exponent, localized,
  or grouped numeric syntax;
- `Money` and `Percentage` use their own rules.

#### Normative conversion source

The first lexical form is the result of the ECMA-262 `Number::toString`
abstract operation for radix 10, exposed by
`Number.prototype.toString.call(value)`.

This operation supplies the unique shortest base-10 representation that
round-trips through ECMA-262 `StringToNumber` to the same input number. No
alternative formatter, locale API, fixed-precision formatter, or
implementation-selected digit sequence is conforming.

#### Exponent expansion algorithm

Given the ECMA-262 lexical form:

1. Record and remove an optional leading `-`.
2. Split at lowercase `e` when present. The exponent is a signed base-10
   integer. When `e` is absent, the exponent is zero.
3. Split the coefficient at `.` when present.
4. Let `integerDigits` be the coefficient digits before `.`, and
   `fractionDigits` the digits after `.`, or the empty string when no decimal
   point exists.
5. Let `digits = integerDigits + fractionDigits`.
6. Let `decimalPosition = integerDigits.length + exponent`.
7. Construct the non-exponent form:
   - if `decimalPosition <= 0`, use
     `"0." + "0".repeat(-decimalPosition) + digits`;
   - if `decimalPosition >= digits.length`, use
     `digits + "0".repeat(decimalPosition - digits.length)`;
   - otherwise insert `.` in `digits` at `decimalPosition`.
8. Normalize the integer part by removing leading zeros while retaining one
   zero when the integer part would otherwise be empty.
9. Normalize the fractional part by removing trailing zeros.
10. Remove `.` when the normalized fractional part is empty.
11. If the resulting magnitude is zero, return `"0"` and discard the negative
    sign.
12. Otherwise restore the recorded negative sign.

The result:

- contains only optional leading `-`, ASCII digits, and at most one `.`;
- never contains `e`, `E`, `+`, whitespace, grouping, or locale punctuation;
- always contains a digit before `.` when a fractional part exists;
- never ends with `.`;
- never contains redundant leading integer zeros;
- never contains trailing fractional zeros;
- never represents negative zero.

#### Precision and scale

No rounding, truncation, padding for display, or precision reduction is
permitted during canonicalization.

Canonicalization preserves the exact ECMA-262 input-number identity by using
the shortest round-tripping digit sequence before mechanical exponent
expansion.

No additional maximum precision or scale is introduced. The finite
ECMA-262-number input domain already bounds the result. Expansion may
therefore produce a long non-exponent string for subnormal values.

Any decimal precision or lexical trailing zeros lost before construction of
the canonical `BusinessSignal` cannot be recovered and must not be invented.
For example, source lexemes `1.2300` and `1.23` are the same current
`BusinessSignal` number and both canonicalize to `"1.23"`.

#### Canonical examples

| Upstream value | Rule/result |
| --- | --- |
| `0.1` | Decimal `"0.1"` |
| `-0.1` | Decimal `"-0.1"` |
| `1e-7` | Decimal `"0.0000001"` |
| `-1e-7` | Decimal `"-0.0000001"` |
| `1.25e-3` | Decimal `"0.00125"` |
| `1000.5` | Decimal `"1000.5"` |
| `1.0000000000000002` | Decimal `"1.0000000000000002"` |
| `Number.MIN_VALUE` (`5e-324`) | Decimal `"0." + "0".repeat(323) + "5"` |
| `-0` | Integer `"0"`; it is not eligible for the Decimal rule. |
| `1.2300` as a number | Decimal `"1.23"`; lexical zeros are not present in the input contract. |

Rejected or differently typed examples:

| Input | Behavior |
| --- | --- |
| `NaN`, `Infinity`, `-Infinity` | Invalid value. Direct construction-policy invocation returns `EVIDENCE_COMPONENT_VALUE_INVALID`; full-engine execution retains an earlier `INTEGRITY_FAILED` from `IntegrityValidator`. |
| `9007199254740992` | `EVIDENCE_COMPONENT_VALUE_INVALID` at the construction stage; unsafe integer-valued number |
| `"1e-7"` | Text `"1e-7"` |
| `"1,000.5"` | Text `"1,000.5"`; thousands separators are never parsed |
| `"1.2300"` | Text `"1.2300"` |

The diagnostic names in this table describe construction-policy behavior.
Existing earlier Validation gates retain authority when the same value is
submitted through the full deterministic engine. Section 21.1 defines this
stage distinction exactly.

The exact canonical string produced by this section is the decimal payload
used for hashing, equality, ordering, diagnostics that identify the value
kind, and statement rendering.

## 9. `EvidenceQualifier`

`EvidenceQualifier` is a minimal immutable, non-recursive value with:

| Field | Type | Required |
| --- | --- | --- |
| `relation` | `EvidenceRelation` | Yes |
| `value` | `EvidenceValue` | Yes |

Qualifiers:

- preserve only explicit source context;
- use the same closed structural value system;
- contain no nested qualifiers;
- are defensively copied and frozen;
- are canonically ordered;
- reject duplicate canonical relation/value pairs;
- contain no diagnosis, inferred cause, impact, priority, Recommendation, or
  action.

The initial construction policy creates exactly two qualifiers:

1. category:

   ```text
   relation.namespace = ginzaaipro.business-signal
   relation.name      = category
   value.kind         = text
   value.value        = BusinessSignal.category
   ```

2. occurrence:

   ```text
   relation.namespace = ginzaaipro.business-signal
   relation.name      = occurred-at
   value.kind         = instant
   value.value        = BusinessSignal.occurredAt
   ```

`capturedAt` is not included because it is capture-process metadata rather
than required factual context for the initial component. Confidence is not a
qualifier because Evidence already owns confidence.

## 10. `EvidenceComponentProvenance`

`EvidenceComponentProvenance` is immutable and has:

| Field | Type | Required | Rule |
| --- | --- | --- | --- |
| `signalId` | `Identifier` | Yes | Canonical originating signal identity. |
| `source` | `string` | Yes | Trimmed, NFC-normalized, non-empty logical source. |
| `sourceField` | `string` | Yes | Constrained source field token. |
| `sourceLocator` | `string \| undefined` | No | Stable source locator when explicitly available. |

`sourceField` uses the same token grammar as `EvidenceRelation.name`.

The initial policy sets:

```text
signalId     = BusinessSignal.id
source       = BusinessSignal.source
sourceField  = value
sourceLocator = undefined
```

The current `BusinessSignal` does not expose `CaptureInput.sourceReference`.
The factory must not reconstruct or invent it. Signal identity provides
canonical source attribution; optional external source location remains
absent.

`sourceLocator`, when present in a future rule, is trimmed and NFC-normalized
and must be non-empty. It is preserved case-sensitively and is not parsed by
Validation.

Each component requires at least one provenance entry. Duplicate canonical
provenance entries are rejected.

## 11. `EvidenceConstructionRuleReference`

This immutable value exposes:

| Field | Type | Rule |
| --- | --- | --- |
| `id` | `string` | Stable non-empty construction-rule identifier. |
| `version` | `string` | Exact semantic version. |

It is required for deterministic identity, audit, and future migration
safety. Changing eligibility, component construction, value tagging,
qualifiers, provenance, or statement rendering requires a new rule version.

## 12. Evidence aggregate amendment

Canonical `Evidence` retains every current property and adds:

```text
components: readonly EvidenceComponent[]
```

The collection is mandatory and must contain at least one component.
Permanent optional components are prohibited.

`statement` remains a public immutable Evidence property, but it is no longer
an independently supplied constructor input. It is derived exclusively from
the canonical component collection under section 13.

### 12.1 Collection invariants

- constructor input is defensively copied;
- the stored collection is frozen;
- returned references cannot mutate the collection or its components;
- components are sorted canonically before storage;
- duplicate component identity is rejected;
- every component's provenance signal identity must appear in
  `Evidence.signalIds`;
- every `Evidence.signalIds` entry must support at least one component;
- all component provenance must belong to `Evidence.organizationId`;
- `Evidence.signalIds` is deduplicated and canonically ordered;
- `statement` remains mandatory derived data and must never be parsed
  downstream.

### 12.2 Component and Evidence identity

Component identity is content-addressed and includes parent Organization
identity, but it is not derived from Evidence identity.

Evidence identity is derived from Organization identity, policy identity,
canonically ordered signal identities, and canonically ordered component
identities.

This direction avoids an identity cycle:

```text
source structure -> component identities -> Evidence identity
```

### 12.3 Multiple components

The aggregate supports multiple independently attributable components.

Multiple components from one `BusinessSignal` are represented as separate
components with:

- distinct component identities;
- explicit relations;
- independent values and qualifiers;
- provenance to the same signal and their respective source fields.

All components need not derive from the same signal at the domain level.
However, the current `ValidationEngine` accepts one `BusinessSignal`, so the
initial policy produces exactly one component attributed to exactly that
signal.

Multi-signal Evidence construction requires a future explicit input-contract
amendment. It must not be simulated through repositories or hidden object
graphs.

## 13. Statement-consistency decision

Sprint 2.4A selects exactly one authoritative approach:

> Canonical Evidence component data is authoritative. The Evidence statement
> is a deterministic derived rendering of the canonical component collection.

The statement is not independently authored. The amended canonical Evidence
construction surface does not accept arbitrary statement text as a source of
truth.

The immutable Evidence aggregate computes `statement` on demand from its
already validated, canonically ordered components using the pure renderer in
this section. Implementations may memoize the computed result internally, but
memoization is an implementation optimization and must return the exact same
derived string. There is no caller-visible mutable statement state.

Validation owns selection and construction of canonical components. The
domain aggregate owns enforcement of its derived-statement invariant. This
does not change Validation ownership of canonical Evidence construction.

No implementation may:

- infer components by parsing a statement;
- accept a statement in place of components;
- use statement wording in component or Evidence identity;
- compare arbitrary prose for semantic equivalence.

### 13.1 Canonical ordering source

The renderer uses `Evidence.components` after the canonical sort defined in
section 20.3:

```text
component.id.value in lexicographic normalized UTF-8 byte order
```

The renderer must not use:

- input position;
- insertion order;
- object iteration order;
- display text;
- locale collation;
- a newly invented order field.

Equivalent component permutations therefore produce the same statement.

### 13.2 Canonical JSON string rendering

Every string placeholder identified as `<json-string>` is rendered with the
ECMA-262 `JSON.stringify` string algorithm:

- the input has already been NFC-normalized where required by its contract;
- the result includes surrounding double quotes;
- required characters are escaped according to the JSON string grammar;
- no optional whitespace is emitted;
- no locale-sensitive transformation is applied.

### 13.3 Typed value rendering

Every `EvidenceValue` is rendered by this exact table:

| Kind | Exact rendering |
| --- | --- |
| `text` | `text(<value-json-string>)` |
| `boolean` | `boolean(true)` or `boolean(false)` |
| `integer` | `integer(<canonical-integer>)` |
| `decimal` | `decimal(<section-8.2-canonical-decimal>)` |
| `instant` | `instant(<value-json-string>)` |
| `money` | `money(minorUnits=<canonical-integer>,currency=<currency-json-string>)` |
| `percentage` | `percentage(basisPoints=<canonical-basis-points>)` |

No typed rendering may use exponent notation, locale formatting, grouping,
rounded display values, translated labels, or inferred units.

### 13.4 Qualifier rendering

Qualifiers use their canonical order from section 20.1.

Each qualifier renders as:

```text
<relation-json-string>=<typed-value-rendering>
```

where the relation string is:

```text
<relation.namespace>:<relation.name>
```

The qualifier list renders as:

```text
[<qualifier-1>, <qualifier-2>, ...]
```

with exact delimiter comma plus one ASCII space: `", "`.

An empty qualifier collection renders exactly:

```text
[]
```

Missing optional qualifiers are not invented, described, or summarized.

### 13.5 Provenance rendering

Provenance entries use their canonical order from section 20.2.

Each entry renders exactly:

```text
{signal=<signal-id-json-string>; source=<source-json-string>; field=<source-field-json-string>; locator=<locator-rendering>}
```

`<locator-rendering>` is the source-locator JSON string when present and the
literal `null` when absent.

The provenance list uses the same bracket and `", "` delimiter rule as the
qualifier list. An empty list is invalid before rendering because component
provenance is mandatory.

### 13.6 Rule-specific component rendering

The component's `constructionRule.id` selects the permitted main-value kind:

| Construction rule | Required component value kind |
| --- | --- |
| `VAL-EVIDENCE-MONEY-001` | `money` |
| `VAL-EVIDENCE-PERCENTAGE-001` | `percentage` |
| `VAL-EVIDENCE-TEXT-001` | `text` |
| `VAL-EVIDENCE-BOOLEAN-001` | `boolean` |
| `VAL-EVIDENCE-INTEGER-001` | `integer` |
| `VAL-EVIDENCE-DECIMAL-001` | `decimal` |

Every rule uses the following exact component-line template:

```text
Validated component <component-id-json-string>: subject=<subject-rendering>; relation=<relation-json-string>; value=<typed-value-rendering>; qualifiers=<qualifier-list>; provenance=<provenance-list>; rule=<rule-reference-json-string>.
```

Where:

- `<subject-rendering>` is `subjectId.value` as a JSON string when present and
  the literal `null` when absent;
- `<relation-json-string>` is
  `"<relation.namespace>:<relation.name>"`;
- `<rule-reference-json-string>` is
  `"<constructionRule.id>@<constructionRule.version>"`;
- the terminal period is mandatory.

An unsupported rule, rule/version, rule/value-kind mismatch, invalid
component field, invalid typed value, invalid qualifier, or invalid
provenance prevents rendering and fails Evidence construction.

### 13.7 Zero, one, and multiple components

Behavior is exact:

- zero components: fail with `EVIDENCE_COMPONENTS_MISSING`; no statement and
  no Evidence are produced;
- one component: the Evidence statement is exactly its rendered component
  line;
- multiple components: render every component in canonical order and join
  the complete component lines with one line-feed character, U+000A.

The fixed multi-component delimiter is therefore:

```text
\n
```

No leading delimiter, trailing delimiter, or terminal newline is emitted.
Every component line already includes its own terminal period, so the final
statement always ends in a period.

The renderer must not:

- reorder components;
- rewrite grammar;
- insert conjunctions;
- pluralize;
- localize;
- summarize;
- infer missing context;
- combine components;
- use generative AI.

### 13.8 Statement invariant and materialized representations

For canonical components `C`, define:

```text
DerivedStatement(C) = the exact algorithm in sections 13.1 through 13.7
```

The invariant is:

```text
Evidence.statement === DerivedStatement(Evidence.components)
```

using exact UTF-16 code-unit equality after both values have been produced by
the normative renderer. No trimming, case folding, Unicode renormalization,
prose equivalence, or fuzzy comparison is performed at this step.

The canonical in-memory property is computed on demand. A serialized,
exported, imported, migrated, or persisted representation may materialize the
derived statement for human use, but that materialized text is non-authoritative.

Any boundary that accepts a materialized statement must:

1. validate and canonically order the component data;
2. compute `DerivedStatement(C)`;
3. compare the materialized statement for exact equality;
4. reject the entire record with
   `EVIDENCE_STATEMENT_COMPONENT_MISMATCH` on inequality;
5. construct no canonical Evidence from the rejected record.

When a materialized statement is absent, the canonical statement is simply
derived; absence is not an error.

When a provided, imported, migrated, persisted, cached, or corrupted
statement violates the invariant:

- components remain authoritative;
- the implementation must not alter components to match the prose;
- the implementation must not silently overwrite the mismatch and continue;
- the record fails canonical admission;
- no natural-language interpretation is permitted.

The derived statement remains excluded from component and Evidence identity.

## 14. Validation input implications

`ValidationEngine` remains:

```text
Engine<BusinessSignal, Evidence>
```

No new Validation input contract is introduced.

Validation obtains the initial component directly from:

- `BusinessSignal.id`;
- `BusinessSignal.organizationId`;
- `BusinessSignal.category`;
- `BusinessSignal.source`;
- `BusinessSignal.occurredAt`;
- `BusinessSignal.subjectId`;
- `BusinessSignal.value`;
- `BusinessSignal.confidence`;
- `BusinessSignal.validationStatus`.

The relation is the closed source relation
`ginzaaipro.business-signal:value`. Category and occurrence are explicit
qualifiers. Provenance cites the signal and source field `value`.

This does not transfer Validation responsibility into Capture. Capture
continues to construct the observation. Validation continues to decide
whether that observation qualifies and how qualified factual structure is
preserved in Evidence.

Inputs that require a more specific relation, external locator, multiple
source fields, or a structural type absent from `BusinessSignalValue` are
unsupported in policy version 1.0.0. Validation must not parse prose or infer
the missing structure.

## 15. Initial Validation construction policy

### 15.1 Policy identity

```text
Policy ID:      VALIDATION_EVIDENCE_CONSTRUCTION
Policy version: 1.0.0
```

The policy is closed, immutable at runtime, and ordered explicitly.

### 15.2 Common eligibility

Every rule requires:

- all existing SAS-0001 gates have passed;
- `signal.validationStatus === "valid"`;
- `signal.organizationId` equals `EngineContext.organizationId`;
- signal identity and optional subject are canonical `Identifier` values;
- source is non-empty after trim and NFC normalization;
- occurrence time is valid and already canonicalizable to UTC ISO;
- value is explicitly represented by one supported rule;
- no business diagnosis or natural-language interpretation is required.

### 15.3 Common construction

Every successful rule:

- produces exactly one `EvidenceComponent`;
- preserves `subjectId` or explicit absence;
- uses relation `ginzaaipro.business-signal:value`;
- creates the category and occurrence qualifiers defined in section 9;
- creates one provenance entry for signal field `value`;
- records its exact rule reference;
- constructs component identity under section 17;
- supplies the canonical component to the Evidence aggregate, whose statement
  property is derived under section 13;
- preserves `signal.confidence` as Evidence confidence;
- preserves `signal.source` as Evidence source;
- preserves `signal.id` in `Evidence.signalIds`;
- preserves `signal.validationStatus` as `"valid"`;
- retains verification method
  `"deterministic-five-gate-validation"`;
- retains the existing full material qualification of 10,000 basis points;
- uses `EngineContext.executionTime` as `Evidence.createdAt`;
- constructs revised Evidence identity under section 18.

Components do not receive confidence. No second confidence system is
introduced.

### 15.4 Rule catalog and precedence

Rules are evaluated in this exact order:

| Precedence | Rule ID | Version | Exact value eligibility | Evidence value |
| --- | --- | --- | --- | --- |
| 1 | `VAL-EVIDENCE-MONEY-001` | `1.0.0` | `signal.value` is canonical `Money`. | `money` with exact minor units and currency. |
| 2 | `VAL-EVIDENCE-PERCENTAGE-001` | `1.0.0` | `signal.value` is canonical `Percentage`. | `percentage` with exact basis points. |
| 3 | `VAL-EVIDENCE-TEXT-001` | `1.0.0` | `signal.value` is a string and normalized text is non-empty. | `text`. |
| 4 | `VAL-EVIDENCE-BOOLEAN-001` | `1.0.0` | `signal.value` is a boolean. | `boolean`. |
| 5 | `VAL-EVIDENCE-INTEGER-001` | `1.0.0` | `signal.value` is `bigint` or a safe integer `number`. | `integer`. |
| 6 | `VAL-EVIDENCE-DECIMAL-001` | `1.0.0` | `signal.value` is a finite, non-integer `number`. | `decimal`. |

Before rule selection, the construction policy validates that the incoming
value belongs to the admissible Evidence value domain and can be canonicalized
without losing source fidelity. An integer-valued unsafe `number`, non-finite
number, empty normalized string, foreign object, `null`, `undefined`, invalid
canonical payload, or other unrepresentable value fails this admission check
with `EVIDENCE_COMPONENT_VALUE_INVALID`. Invalid input does not become an
unsupported-rule result merely because construction cannot proceed.

No implicit precedence is permitted. A value matched by more than one rule is
a nonconforming rule-catalog defect, not an unsupported input. The immutable
catalog and its tests must establish that every authorized value combination
matches at most one rule; runtime registration order must never select among
overlapping rules.

### 15.5 Unsupported input

`EVIDENCE_CONSTRUCTION_RULE_UNSUPPORTED` applies only when:

- the value has passed the applicable admissible-domain and canonicalization
  checks;
- its declared or resolved Evidence value kind is recognized;
- the otherwise valid kind or combination has no authorized rule in the
  closed construction policy.

Validation then returns `EVIDENCE_CONSTRUCTION_RULE_UNSUPPORTED`, no Evidence
value, and a stable failure explanation.

An invalid or unrepresentable value instead returns
`EVIDENCE_COMPONENT_VALUE_INVALID`. The construction policy must not use rule
absence as a substitute for value-domain validation.

If construction would require diagnosis, inferred relation, inferred
subject, inferred type, prose parsing, or external enrichment, Validation
returns `EVIDENCE_DOMAIN_REASONING_REQUIRED`.

The initial policy does not attempt a fallback.

## 16. Canonical encoding

Identity encoding follows the current Capture identity convention.

For every ordered scalar:

1. encode the scalar as UTF-8;
2. calculate its UTF-8 byte length in base-10;
3. emit `<byte-length>:<scalar>`;
4. concatenate encoded scalars with no separator.

All counts are canonical base-10 strings.

Absent optional values are represented by two scalars:

```text
absent
<empty string>
```

Present optional values are represented by:

```text
present
<canonical value>
```

SHA-256 is applied to the UTF-8 bytes of the complete canonical sequence.
The digest is rendered as 64 lowercase hexadecimal characters.

No locale-sensitive operation is permitted.

## 17. Evidence component identity

### 17.1 Version and prefix

```text
Identity version marker: ginzaaipro:evidence-component:v1
Identifier prefix:       evidence-component:v1:
```

### 17.2 Ordered identity material

The exact scalar order is:

1. identity version marker;
2. parent `organizationId.value`;
3. subject presence marker;
4. subject identifier value or empty string;
5. relation namespace;
6. relation name;
7. value kind;
8. value payload fields in section 8 order;
9. qualifier count;
10. each canonically ordered qualifier:
    - relation namespace;
    - relation name;
    - value kind;
    - value payload fields;
11. provenance count;
12. each canonically ordered provenance entry:
    - `signalId.value`;
    - source;
    - source field;
    - source-locator presence marker;
    - source locator or empty string;
13. construction-rule identifier;
14. construction-rule version.

Component identity excludes:

- statement wording;
- Evidence creation time;
- `EngineContext.executionTime`;
- correlation identifiers;
- runtime duration;
- Evidence confidence;
- material relevance;
- random values;
- mutable process or environment state.

## 18. Evidence identity

The existing identity
`evidence:<signal-id>:<correlation-id>` is not compatible with ADR-0018.

It:

- changes when equivalent Validation uses a different correlation identity;
- does not participate in structured component identity;
- can assign the same Evidence identity to changed component content under
  one correlation;
- does not support permutation-equivalent multi-component Evidence.

### 18.1 Revised version and prefix

```text
Identity version marker: ginzaaipro:evidence:v2
Identifier prefix:       evidence:v2:
```

### 18.2 Ordered identity material

The exact scalar order is:

1. identity version marker;
2. `organizationId.value`;
3. construction policy identifier;
4. construction policy version;
5. canonical signal-identifier count;
6. each canonically ordered `signalId.value`;
7. canonical component count;
8. each canonically ordered component `id.value`.

Evidence identity excludes:

- statement wording;
- `createdAt`;
- execution time;
- correlation identifiers;
- runtime duration;
- confidence;
- verification-method display wording;
- material relevance;
- random values;
- mutable process or environment state.

Equivalent component or signal permutations produce the same Evidence
identity.

### 18.3 Migration consequence

All existing Evidence identity expectations must migrate from the unversioned
signal/correlation form to `evidence:v2:<digest>`.

This is an intentional identity-version change. No compatibility alias or
dual identity is authorized.

## 19. Normative fixed identity vectors

### 19.1 Component vector

Input:

```text
organizationId: org_001
subjectId: job_001
relation: ginzaaipro.business-signal:value
value: integer "42"
qualifier 1: ginzaaipro.business-signal:category = text "operational"
qualifier 2: ginzaaipro.business-signal:occurred-at =
             instant "2026-07-18T10:00:00.000Z"
provenance:
  signalId: sig_001
  source: dispatch-system
  sourceField: value
  sourceLocator: absent
constructionRule: VAL-EVIDENCE-INTEGER-001@1.0.0
```

Ordered scalar sequence:

```text
ginzaaipro:evidence-component:v1
org_001
present
job_001
ginzaaipro.business-signal
value
integer
42
2
ginzaaipro.business-signal
category
text
operational
ginzaaipro.business-signal
occurred-at
instant
2026-07-18T10:00:00.000Z
1
sig_001
dispatch-system
value
absent
<empty string>
VAL-EVIDENCE-INTEGER-001
1.0.0
```

Expected SHA-256:

```text
ec0abcfac9e3056c4161dd77bae5303802236a003c5c1c9dd794cd57ea9cd133
```

Expected identifier:

```text
evidence-component:v1:ec0abcfac9e3056c4161dd77bae5303802236a003c5c1c9dd794cd57ea9cd133
```

### 19.2 Evidence vector

Input:

```text
organizationId: org_001
policy: VALIDATION_EVIDENCE_CONSTRUCTION@1.0.0
signalIds:
  - sig_001
componentIds:
  - evidence-component:v1:ec0abcfac9e3056c4161dd77bae5303802236a003c5c1c9dd794cd57ea9cd133
```

Ordered scalar sequence:

```text
ginzaaipro:evidence:v2
org_001
VALIDATION_EVIDENCE_CONSTRUCTION
1.0.0
1
sig_001
1
evidence-component:v1:ec0abcfac9e3056c4161dd77bae5303802236a003c5c1c9dd794cd57ea9cd133
```

Expected SHA-256:

```text
0154d32c5270a28ac7ba5775f611bfad65abe689e2aeb2809817e5de551156bc
```

Expected identifier:

```text
evidence:v2:0154d32c5270a28ac7ba5775f611bfad65abe689e2aeb2809817e5de551156bc
```

The fixed vectors are normative and must pass before other identity tests are
accepted.

## 20. Canonical ordering

All ordering uses lexicographic comparison of normalized UTF-8 byte
sequences as unsigned bytes. Locale-aware collation, insertion order, object
iteration order, and display text are prohibited.

### 20.1 Qualifiers

Order by:

1. relation namespace;
2. relation name;
3. canonical Evidence-value serialization.

Exact duplicate relation/value pairs are rejected.

### 20.2 Provenance

Order by:

1. `signalId.value`;
2. source;
3. source field;
4. source-locator presence, absent before present;
5. source locator.

Exact duplicate entries are rejected.

### 20.3 Components

Order by `component.id.value`.

Duplicate component identity is rejected even when other object references
differ.

### 20.4 Evidence signal identities

Order by `signalId.value`.

Duplicate signal identity is rejected.

## 21. Stable Validation diagnostics

All new failure diagnostics use severity `error`. The success diagnostic uses
severity `info`.

| Code | Severity | Stable message | Trigger |
| --- | --- | --- | --- |
| `EVIDENCE_COMPONENTS_MISSING` | `error` | `Canonical Evidence requires at least one structured factual component.` | Construction yields no component. |
| `EVIDENCE_COMPONENT_UNSUPPORTED` | `error` | `The structured factual component is not supported by the canonical Evidence contract.` | Component shape violates the closed contract. |
| `EVIDENCE_COMPONENT_DUPLICATE` | `error` | `Canonical Evidence cannot contain duplicate component identity.` | Duplicate component identifier. |
| `EVIDENCE_COMPONENT_VALUE_INVALID` | `error` | `The Evidence component contains an invalid structural value.` | A value intended for Evidence construction is outside the admissible value domain, cannot satisfy canonicalization, has an invalid kind or payload, or would lose source fidelity. |
| `EVIDENCE_COMPONENT_SUBJECT_INVALID` | `error` | `The Evidence component subject is not a valid canonical identifier.` | Present subject is not `Identifier`. |
| `EVIDENCE_COMPONENT_RELATION_INVALID` | `error` | `The Evidence component relation is invalid or unsupported.` | Relation token fails the closed contract. |
| `EVIDENCE_COMPONENT_QUALIFIER_INVALID` | `error` | `The Evidence component contains an invalid or duplicate qualifier.` | Qualifier is invalid, recursive, or duplicated. |
| `EVIDENCE_COMPONENT_PROVENANCE_INVALID` | `error` | `The Evidence component provenance is incomplete or invalid.` | Missing, foreign, fabricated, or duplicate provenance. |
| `EVIDENCE_STATEMENT_RENDER_FAILED` | `error` | `The Evidence statement could not be derived from canonical structured factual components.` | A non-empty canonical component set cannot be rendered because a rule is unsupported, a rule/value-kind pairing is inconsistent, or required render data is invalid or unavailable. |
| `EVIDENCE_STATEMENT_COMPONENT_MISMATCH` | `error` | `The materialized Evidence statement does not match the canonical derived statement.` | An imported, migrated, serialized, persisted, cached, or otherwise provided materialized statement differs from `DerivedStatement(components)` by exact equality. |
| `EVIDENCE_ORGANIZATION_MISMATCH` | `error` | `The Evidence source and execution context must belong to the same Organization.` | Signal, context, Evidence, or provenance Organization differs. |
| `EVIDENCE_CONSTRUCTION_RULE_UNSUPPORTED` | `error` | `No canonical Evidence construction rule supports the validated signal structure.` | A value is admissible and its Evidence value kind is recognized, but no closed construction rule is authorized for that otherwise valid kind or combination. |
| `EVIDENCE_DOMAIN_REASONING_REQUIRED` | `error` | `Canonical Evidence construction cannot require semantic or operational reasoning.` | Construction requires inference, diagnosis, prose parsing, or enrichment. |
| `EVIDENCE_STRUCTURED_CREATED` | `info` | `Canonical Evidence with structured factual components was created.` | Successful immutable Evidence construction. |

Failure shape remains the current `EngineResult<Evidence>` shape:

- `success === false`;
- `value === undefined`;
- exactly one error diagnostic for the first failed rule;
- stable deterministic explanation;
- no partial Evidence.

These codes belong to Validation. Evidence Semantics diagnostic prefixes must
not be used.

### 21.1 Exact diagnostic precedence and statement behavior

Validation-stage precedence is normative:

- existing earlier validation gates retain authority over every failure they
  detect;
- if `IntegrityValidator` rejects a value before Evidence construction, the
  full-engine result contains only the existing `INTEGRITY_FAILED` terminal
  diagnostic;
- Evidence-construction diagnostics apply when the construction policy is
  invoked directly or when an input passes the earlier gates and reaches the
  construction stage;
- direct construction-policy invocation performs its own admissible-value and
  canonicalization checks and returns
  `EVIDENCE_COMPONENT_VALUE_INVALID` for invalid input;
- one deterministic engine execution emits exactly one terminal failure
  diagnostic for the first failed check and never emits both an earlier gate
  diagnostic and an Evidence-construction diagnostic for the same rejection;
- tests must distinguish direct construction-policy behavior from full-engine
  pipeline behavior.

Expected-path behavior:

- the aggregate derives `statement` from canonical components;
- no separate statement-success diagnostic is emitted;
- successful Evidence construction emits only
  `EVIDENCE_STRUCTURED_CREATED`.

Generation failure behavior:

- `EVIDENCE_STATEMENT_RENDER_FAILED`;
- severity `error`;
- no Evidence value;
- no partial or fallback statement;
- no attempt to parse, summarize, localize, or repair content.

Materialized-statement mismatch behavior:

- `EVIDENCE_STATEMENT_COMPONENT_MISMATCH`;
- severity `error`;
- no canonical Evidence value;
- canonical components must not be mutated to match the materialized text;
- the materialized text must not be silently replaced while admitting the
  record.

Invalid decimal behavior:

- `EVIDENCE_COMPONENT_VALUE_INVALID`;
- severity `error`;
- applies at the Evidence-construction stage to non-finite values,
  integer-valued unsafe numbers, malformed canonical decimal payloads, or any
  decimal conversion that cannot meet section 8.2 exactly;
- when full-engine execution rejects a non-finite value earlier through
  `IntegrityValidator`, `INTEGRITY_FAILED` is authoritative and the
  construction policy is not invoked;
- no clamping, rounding, fallback Text conversion, or partial Evidence.

Unsupported-rule behavior:

- `EVIDENCE_CONSTRUCTION_RULE_UNSUPPORTED`;
- severity `error`;
- applies only after value-domain and canonicalization checks succeed and a
  recognized, otherwise valid Evidence value kind or combination has no
  authorized closed construction rule;
- never applies to non-finite values, unsafe integer-valued numbers, malformed
  canonical payloads, or other inadmissible values.

Ordering behavior:

- input permutations are not errors; collections are canonically sorted;
- there is no separate "invalid order" diagnostic;
- duplicate component identity uses
  `EVIDENCE_COMPONENT_DUPLICATE`;
- duplicate qualifiers use
  `EVIDENCE_COMPONENT_QUALIFIER_INVALID`;
- duplicate provenance uses
  `EVIDENCE_COMPONENT_PROVENANCE_INVALID`;
- if a collection cannot be canonically compared because an entry is invalid,
  the applicable component, qualifier, or provenance diagnostic precedes
  rendering.

Diagnostics and explanations must not expose:

- the complete expected statement;
- the complete actual/materialized statement;
- raw source payloads;
- sensitive component values;
- stack traces;
- prompts or hidden reasoning.

They may expose:

- stable diagnostic code;
- Evidence identity when already valid;
- component identifiers;
- rule identifier and version;
- the fact that exact equality failed;
- the invalid value kind without its raw value.

### 21.2 Minimum diagnostic tests

At minimum:

- successful derivation asserts only `EVIDENCE_STRUCTURED_CREATED`;
- zero components asserts `EVIDENCE_COMPONENTS_MISSING`;
- a valid known-rule component with unavailable render data asserts
  `EVIDENCE_STATEMENT_RENDER_FAILED`;
- imported materialized text differing by one code unit asserts
  `EVIDENCE_STATEMENT_COMPONENT_MISMATCH`;
- equivalent component permutations derive the same statement without an
  order warning;
- duplicate component identity asserts `EVIDENCE_COMPONENT_DUPLICATE`;
- duplicate qualifier and provenance paths assert their respective existing
  diagnostics;
- direct construction-policy tests for every invalid-decimal category in
  section 8.2 assert `EVIDENCE_COMPONENT_VALUE_INVALID`;
- a full-engine non-finite-number test asserts only `INTEGRITY_FAILED` and
  verifies that Evidence construction was not invoked;
- a full-engine unsafe integer-valued-number test asserts only
  `EVIDENCE_COMPONENT_VALUE_INVALID` after the input reaches construction;
- a direct and full-engine otherwise-valid recognized kind or combination
  lacking an authorized rule asserts
  `EVIDENCE_CONSTRUCTION_RULE_UNSUPPORTED`;
- no numeric rejection emits two competing terminal diagnostics;
- every failure asserts no Evidence value and no expected/actual statement in
  diagnostics or explanation.

## 22. Deterministic validation order

Existing SAS-0001 gates are preserved. New checks interleave only where
Organization isolation must precede factual qualification.

The exact order is:

1. existing `IDENTITY_INVALID`;
2. new `EVIDENCE_ORGANIZATION_MISMATCH`;
3. existing `INTEGRITY_FAILED`;
4. existing `INCOMPLETE_SIGNAL`;
5. existing `CONSISTENCY_FAILED`;
6. existing `QUALIFICATION_FAILED`;
7. construction-stage admissible-value and canonicalization check,
   `EVIDENCE_COMPONENT_VALUE_INVALID`;
8. `EVIDENCE_CONSTRUCTION_RULE_UNSUPPORTED` for an admissible, recognized
   value kind or combination with no authorized closed rule;
9. `EVIDENCE_DOMAIN_REASONING_REQUIRED`;
10. `EVIDENCE_COMPONENTS_MISSING`;
11. `EVIDENCE_COMPONENT_SUBJECT_INVALID`;
12. `EVIDENCE_COMPONENT_RELATION_INVALID`;
13. `EVIDENCE_COMPONENT_QUALIFIER_INVALID`;
14. `EVIDENCE_COMPONENT_PROVENANCE_INVALID`;
15. `EVIDENCE_COMPONENT_UNSUPPORTED`;
16. `EVIDENCE_COMPONENT_DUPLICATE`;
17. `EVIDENCE_STATEMENT_RENDER_FAILED`;
18. `EVIDENCE_STATEMENT_COMPONENT_MISMATCH` when a materialized statement is
    presented at an admission boundary;
19. canonical ordering, component identity, and Evidence identity
    construction;
20. `EVIDENCE_STRUCTURED_CREATED`.

The first failed check stops execution. A successful result contains only the
`EVIDENCE_STRUCTURED_CREATED` info diagnostic.

Steps 1 through 6 are the unchanged six-gate sequence. When an earlier gate
fails, later construction checks do not run. Direct construction-policy
invocation begins at step 7 and therefore performs its own value-domain
admission. This stage distinction does not alter the six-gate sequence.

An internal identity-construction failure maps to
`EVIDENCE_COMPONENT_UNSUPPORTED`; implementation-specific exceptions must not
escape as nondeterministic public behavior.

## 23. Explanations

Success explanations must deterministically report:

- construction policy ID and version;
- applied rule ID and version;
- Evidence identity;
- component identities in canonical order;
- signal provenance in canonical order;
- preserved Evidence confidence;
- that the statement was derived from canonically ordered component data;
- that no semantic extraction, semantic confidence, diagnosis,
  prioritization, Recommendation, or execution occurred.

Failure explanations must report:

- the stable failure code;
- the policy ID and version when rule selection was reached;
- valid signal identity and Organization attribution available before
  failure;
- that no Evidence was created;
- the failed structural requirement;
- for statement mismatch, only that exact derived/materialized equality
  failed, never the expected and actual statement bodies;
- no raw payload, stack trace, prompt, chain-of-thought, or hidden reasoning.

Explanation prose and ordering are stable public behavior.

## 24. Immutability

The implementation must defensively copy and freeze:

- Evidence component collections;
- `EvidenceComponent`;
- `EvidenceRelation`;
- `EvidenceValue`;
- qualifier collections and each `EvidenceQualifier`;
- provenance collections and each `EvidenceComponentProvenance`;
- `EvidenceConstructionRuleReference`;
- Evidence signal-identifier collections;
- canonical `Evidence`;
- diagnostics collections;
- explanations and their collections.

Existing immutable `Identifier`, `Money`, and `Percentage` objects are
preserved by reference only where their current immutability guarantees
apply.

No input collection or returned collection may expose mutable internal state.
Validation must not mutate:

- `BusinessSignal`;
- `EngineContext`;
- policy or rule catalogs;
- any caller-supplied array.

## 25. Package ownership and dependencies

### 25.1 `@ginzaaipro/domain`

Owns and publicly exports:

- `Evidence`;
- `EvidenceComponent`;
- `EvidenceRelation`;
- `EvidenceValue`;
- `EvidenceQualifier`;
- `EvidenceComponentProvenance`;
- `EvidenceConstructionRuleReference`.

Exports use the existing domain package entry point. No second Evidence
aggregate or subpackage is introduced.

Domain must not depend on core, Validation, Evidence Semantics, Intelligence,
kernel, runtime, persistence, or framework packages.

The domain package also owns the package-private, pure derived-statement
renderer and enforces the invariant in section 13.8. That renderer is an
implementation detail of `Evidence`; it is not a new public contract, service,
engine, or package.

### 25.2 `@ginzaaipro/core`

Continues to own and publicly export `ValidationEngine`.

Its generic contract remains `Engine<BusinessSignal, Evidence>`. No parallel
Validation interface or new input contract is introduced.

### 25.3 `@ginzaaipro/validation`

Continues to own:

- `DeterministicValidationEngine`;
- Validation diagnostics;
- concrete Evidence construction policy and rules;
- normalization;
- component and Evidence identity utilities;
- diagnostics and explanation factories.

Public exports add only the new stable diagnostic codes through the existing
diagnostic export.

The following remain internal:

- rule catalog;
- policy selector;
- identity utilities;
- canonical serializers;
- normalization utilities;
- Evidence factory implementation details.

Validation supplies canonical components to the domain aggregate and consumes
the aggregate-derived statement for explanations and results. When Validation
is an admission boundary for a materialized Evidence representation, it owns
the exact comparison and diagnostic behavior in sections 13.8 and 21; it does
not own or duplicate the rendering algorithm.

Validation may depend only on current allowed core and domain packages. It
must not depend on Evidence Semantics, Intelligence, kernel, capture
implementation, adapters, runtime, persistence, or orchestration.

No new package is introduced.

## 26. Migration strategy

Sprint 2.4A uses immediate compile-time migration.

The canonical Evidence constructor requires a non-optional components
collection and no longer accepts `statement` as an independent constructor
argument. Existing construction calls that omit components or supply a
caller-authored statement fail compilation. The aggregate derives
`statement` exclusively from the canonical component collection.

No temporary public compatibility factory, overloaded legacy constructor,
permanent optional field, or prose-to-component adapter is authorized.

Migration is bounded to:

- canonical `Evidence` construction calls;
- `EvidenceFactory`;
- inline fixtures;
- tests and mocks;
- compile-time consumers;
- generated declarations;
- package exports for the new domain contracts;
- readers with explicit Evidence-shape assumptions;
- identity expectations.

Required migration behavior:

1. Production Validation constructs components through policy
   `VALIDATION_EVIDENCE_CONSTRUCTION@1.0.0`.
2. Domain tests and fixtures provide explicit components or use a test helper
   that constructs the same canonical contract without parsing prose.
3. Existing factory statement expectations migrate to the exact derived
   renderer in section 13. Callers cannot supply, override, or repair
   `statement`.
4. Existing identity expectations migrate to `evidence:v2`.
5. Existing readers of unchanged Evidence fields remain source-compatible
   unless they assert the old exact object shape.
6. New `components` readers use immutable canonical ordering.
7. Legacy prose-only Evidence is not valid canonical Evidence.
8. No persistence migration is performed because canonical Evidence
   persistence is not in current scope.
9. Any future import, deserialization, or admission path carrying a
   materialized statement recomputes the statement from components and
   compares it exactly. A mismatch is rejected with
   `EVIDENCE_STATEMENT_COMPONENT_MISMATCH`; the supplied text is neither
   parsed nor silently repaired.

The test helper, if used, remains test-only and must not become a compatibility
API.

## 27. Complete test matrix

| Area | Required test |
| --- | --- |
| Single component | One eligible signal produces exactly one component with exact relation, value, qualifiers, provenance, and rule reference. |
| Multiple components | Domain Evidence accepts multiple independently attributable components in canonical order. |
| Empty components | Empty collection fails with `EVIDENCE_COMPONENTS_MISSING`. |
| Missing component | Sparse, null, undefined, or runtime-missing component fails without Evidence. |
| Duplicate component | Duplicate component identity fails with `EVIDENCE_COMPONENT_DUPLICATE`. |
| Subject present | Existing signal subject `Identifier` is preserved. |
| Subject absent | Absence remains `undefined`; no subject is inferred. |
| Invalid subject | Foreign runtime subject fails with `EVIDENCE_COMPONENT_SUBJECT_INVALID`. |
| Valid relation | Initial relation is exactly `ginzaaipro.business-signal:value`. |
| Invalid relation | Empty, uppercase, whitespace, prose, or malformed relation fails with `EVIDENCE_COMPONENT_RELATION_INVALID`. |
| Text value | Non-empty string produces exact `text` value. |
| Boolean value | Boolean produces exact `boolean` value. |
| Bigint integer | `bigint` produces canonical `integer` string. |
| Safe-number integer | Safe integer number produces canonical `integer` string. |
| Decimal canonical examples | `0.1`, `-0.1`, `1.25e-3`, `1000.5`, and `1.0000000000000002` produce the exact section 8.2 canonical strings. |
| Decimal exponent expansion | Positive and negative exponent forms, including `1e-7` and `-1e-7`, expand exactly with no exponent marker. |
| Decimal negative zero | Numeric `-0` follows the integer rule and canonicalizes to `0`; it never produces `-0`. |
| Decimal subnormal | `Number.MIN_VALUE` expands to exactly `"0." + 323 zeroes + "5"`. |
| Decimal boundary | Finite non-integers at representable boundaries follow section 8.2; unsafe integer-valued numbers fail and are never reclassified as decimals. |
| Decimal no rounding | Conversion neither rounds nor truncates the ECMAScript lexical representation and imposes no additional precision or scale limit. |
| Instant | Occurrence qualifier contains canonical UTC `instant`. |
| Money | `Money` preserves exact minor units and currency. |
| Percentage | `Percentage` preserves exact basis points. |
| Direct-policy non-finite number | Direct construction-policy invocation with NaN or positive/negative infinity returns only `EVIDENCE_COMPONENT_VALUE_INVALID`. |
| Full-engine non-finite number | Full deterministic-engine execution returns only the earlier `INTEGRITY_FAILED` and does not invoke Evidence construction. |
| Unsafe integer-valued number | Direct-policy and full-engine inputs that reach construction return only `EVIDENCE_COMPONENT_VALUE_INVALID`; the value is never reclassified as unsupported. |
| Empty text | Empty normalized text fails existing completeness or component value validation. |
| No coercion | Numeric-, boolean-, and timestamp-looking strings remain text. |
| Qualifiers | Category and occurrence qualifiers are exact, immutable, and canonically ordered. |
| Duplicate qualifier | Exact duplicate fails with `EVIDENCE_COMPONENT_QUALIFIER_INVALID`. |
| Invalid qualifier | Recursive, unsupported, or malformed qualifier fails deterministically. |
| Provenance | Signal identity, source, source field, and absent locator are preserved exactly. |
| Incomplete provenance | Missing signal, source, or source field fails with `EVIDENCE_COMPONENT_PROVENANCE_INVALID`. |
| Foreign provenance | Provenance outside Evidence signal IDs or Organization fails. |
| Single-component statement | One component produces exactly the section 13.6 component line, including its final period and with no trailing newline. |
| Multi-component statement | Two or more components render in canonical component-identifier order and join with exactly one U+000A, with no leading or trailing delimiter or newline. |
| Zero-component statement | No statement can be derived; construction fails with `EVIDENCE_COMPONENTS_MISSING`. |
| Statement typed values | Each of the six construction rules renders its exact main value kind according to sections 13.3 and 13.6. |
| Statement qualifiers | Empty, single, and multiple qualifier collections use the exact brackets, delimiters, canonical ordering, and typed-value rendering in section 13.4. |
| Statement provenance | One and multiple provenance entries use the exact grammar, canonical ordering, JSON escaping, and `null` locator form in section 13.5. |
| Statement escaping | Component identifiers, subjects, relations, sources, source fields, locators, rule references, and text values use exact ECMAScript JSON string escaping. |
| Statement render failure | Unsupported or invalid component rendering fails with only `EVIDENCE_STATEMENT_RENDER_FAILED` and no Evidence value. |
| Statement authority | `components` are authoritative and `statement` is computed on demand as non-authoritative derived data; callers cannot author or override it. |
| Statement exact match | A materialized statement identical in every UTF-16 code unit to the recomputed value is admitted without a mismatch diagnostic. |
| Statement mismatch | A materialized statement differing by one code unit, ordering, delimiter, whitespace, or newline fails with only `EVIDENCE_STATEMENT_COMPONENT_MISMATCH`. |
| Statement diagnostic privacy | Render and mismatch diagnostics never disclose expected or actual statement bodies or raw sensitive payloads. |
| Statement prohibited transformations | Rendering never reorders outside canonical order, rewrites grammar, adds conjunctions, localizes, summarizes, infers, combines components, or invokes generative AI. |
| No prose parsing | Free-form statement content cannot create or repair a component. |
| No inference | Missing subject, relation, value, qualifier, or locator is never inferred. |
| No diagnosis | No component, statement, diagnostic, or explanation adds operational classification, impact, priority, or action. |
| Organization match | Signal and context Organization match succeeds. |
| Organization mismatch | Mismatch fails second with `EVIDENCE_ORGANIZATION_MISMATCH`. |
| Rule selection | Each supported value selects exactly its documented rule. |
| Unsupported rule | An admissible value with a recognized Evidence value kind or combination, but no authorized closed rule, returns `EVIDENCE_CONSTRUCTION_RULE_UNSUPPORTED`. |
| Diagnostic stage precedence | Direct-policy and full-engine tests prove that earlier gates remain authoritative and one execution never emits competing terminal diagnostics for one rejected value. |
| Domain reasoning | Input requiring inference returns `EVIDENCE_DOMAIN_REASONING_REQUIRED`. |
| Rule precedence | Closed rule order is reproducible and no value matches multiple rules. |
| Confidence | Signal confidence remains Evidence confidence; no component confidence exists. |
| Component identity | Equivalent component content produces identical component identity. |
| Evidence identity | Equivalent Evidence content produces identical `evidence:v2` identity. |
| Component fixed vector | Section 19.1 expected digest and identifier pass exactly. |
| Evidence fixed vector | Section 19.2 expected digest and identifier pass exactly. |
| Permutation equivalence | Signal, component, qualifier, and provenance permutations produce equivalent identities and output order. |
| Canonical ordering | UTF-8 byte ordering is applied exactly. |
| Identity exclusions | Statement, execution time, correlation ID, duration, and confidence do not change identities. |
| Identity inclusions | Organization, source structure, rule version, provenance, and component identities change the applicable identity. |
| Input immutability | Signal, context, and caller collections remain unchanged. |
| Output immutability | Evidence and its entire nested graph resist mutation through returned references. |
| Stable diagnostics | New codes, severities, messages, and success diagnostic match section 21. |
| Fail-fast order | Inputs with multiple defects return the first code in section 22. |
| Explanation success | Policy, rule, identities, provenance, confidence, and boundary statement are exact. |
| Explanation failure | Failure explanation is stable and contains no hidden reasoning or partial Evidence. |
| Domain exports | All selected canonical contract names resolve from `@ginzaaipro/domain`. |
| Core contract | `ValidationEngine` remains `Engine<BusinessSignal, Evidence>`. |
| Validation exports | New diagnostics resolve through the existing Validation root export; internal utilities do not. |
| Package boundaries | No forbidden or circular dependency and no relative cross-package import exists. |
| Legacy constructor | Old prose-only construction fails compile-time and has no runtime compatibility path. |
| Fixture migration | Every Evidence fixture supplies canonical components and no fixture parses prose. |
| Current readers | Existing `statement` test readers remain human-display only and do not become parsers. |
| Domain validation | Domain build, typecheck, and tests pass. |
| Validation package | Validation build, typecheck, and tests pass. |
| Workspace validation | Full workspace build, typecheck, and tests pass. |

Tests must not depend on:

- current wall-clock time;
- randomness;
- locale;
- insertion order;
- environment variables;
- filesystem or network state;
- persistence;
- external services;
- AI or generated-language output;
- test execution order.

## 28. Acceptance criteria

This supplement is implementation-ready only when:

- the exact contract shape is defined;
- selected public names are stable;
- the minimum supported Validation construction policy is closed and
  versioned;
- statement consistency is deterministic without language interpretation;
- multi-component statement rendering, delimiters, escaping, and all typed
  render forms are exact;
- components are the sole authority and the public statement is exact
  non-authoritative derived data;
- decimal conversion is bound to the exact section 8.2 algorithm with no
  locale dependence, rounding, truncation, or hidden precision rule;
- identity material and encoding are exact;
- both fixed vectors are ratified;
- canonical ordering is exact;
- diagnostics and fail-fast order are exact;
- invalid-value and unsupported-rule diagnostics are mutually exclusive and
  follow the exact direct-policy versus full-engine precedence in sections
  21.1 and 22;
- statement rendering and mismatch failure paths have exact codes, messages,
  privacy constraints, and tests;
- package ownership and public/internal exports are exact;
- migration behavior is exact;
- test coverage is traceable;
- no business-domain reasoning is introduced;
- no Evidence Semantics or Intelligence responsibility is absorbed;
- no optionality leaves old prose-only Evidence valid;
- no unresolved architectural or implementation ambiguity remains.

Architecture review must ratify this proposed supplement before code begins.

## 29. Stop-condition assessment

No required stop condition was triggered.

- Current `BusinessSignal` can provide one deterministic factual component
  without a constitutional change.
- Statement consistency uses deterministic generation and requires no
  natural-language interpretation.
- Component construction is structural and requires no business diagnosis.
- Accepted ADRs are consistent with Path C.
- No new canonical layer or package is required.
- Repository-specific contracts, diagnostics, identity conventions, exports,
  and migration points were resolvable.
- Both fixed identity vectors remain valid: statement is excluded from
  component and Evidence identity material, and the published component vector
  uses the integer value kind rather than decimal. The identity fields,
  canonical ordering, encodings, and expected digests are unchanged. This was
  checked structurally against sections 17 through 19 and against the
  independent fixed-vector verification already recorded by IRG-0001; no test,
  typecheck, or build command was run for this document-only revision.

The initial policy's limited meaning is deliberate. Inputs needing a more
specific source relation, external locator, unsupported value kind, or
multiple explicit fields fail rather than expanding the contract implicitly.

## 30. Out of scope

SAS-0001B does not define or authorize:

- TypeScript implementation;
- Evidence Semantics extraction policy;
- canonical semantic predicates;
- Intelligence interpretation rules;
- source adapters;
- persistence;
- orchestration;
- external AI behavior;
- general natural-language Evidence construction;
- new runtime integrations.
