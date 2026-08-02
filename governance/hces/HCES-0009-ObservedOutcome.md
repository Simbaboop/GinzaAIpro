# HCES-0009 — ObservedOutcome

**Version:** 1.0.0
**Status:** Accepted
**Date:** 2026-07-28
**Capability:** 009 — ObservedOutcome
**Governing Decision:** ADR-0011
**Dependency Baseline:** Canonical verified `ExecutionEvent` contract

# Purpose

Specify the minimum canonical contract for one immutable observation
associated with exactly one `ExecutionEvent`.

`ObservedOutcome` answers:

> What was subsequently observed in relation to this execution?

It does not answer what caused the observation, whether it is verified, or
whether the execution succeeded.

`ObservedOutcome` records one immutable bounded observation only and does not
claim causation, verify truth, evaluate success or quality, generate evidence,
execute, schedule, assign, allocate, orchestrate, retry, persist, publish
externally, aggregate, invoke AI, mutate upstream artifacts, or manage workflow
or lifecycle state.

# Scope

This specification governs:

- one atomic observation;
- canonical value representation;
- execution lineage;
- observation and recording time;
- provenance;
- deterministic identity and serialization;
- immutability and equality;
- validation and failure precedence; and
- the minimum public domain API.

# Exclusions

This capability excludes:

- causality;
- verified truth;
- success or failure;
- recommendation quality;
- confidence or evidence scoring;
- evidentiary sufficiency;
- aggregation or analytics;
- mutable lifecycle state;
- `EvidenceRecord`;
- AI;
- persistence;
- repositories;
- networking;
- APIs;
- telemetry infrastructure; and
- generalized event sourcing.

# Domain Ownership

`@ginzaaipro/domain` owns the canonical `ObservedOutcome` contract.

Construction consumes one canonical `ExecutionEvent`. Callers shall not
resupply organization, plan, admission, work-package, trace, recommendation,
policy, rule, schema, or execution provenance that is already owned by the
event.

# Construction Inputs

`ObservedOutcomeInput` shall be a read-only structure containing exactly:

| Field | Type | Required | Responsibility |
| --- | --- | --- | --- |
| `executionEvent` | `ExecutionEvent` | Yes | Canonical execution and lineage source |
| `subjectType` | `string` | Yes | Canonical domain-neutral type of the observed subject |
| `subjectId` | `Identifier` | Yes | Identity of exactly one observed subject |
| `observationCode` | `string` | Yes | Stable domain-neutral name of the observed property |
| `value` | `ObservedOutcomeValue` | Yes | One canonical discriminated value |
| `unit` | `string` | Conditional | Required only for quantitative values |
| `measurementContext` | `string` | No | Bounded clarification of population, method, or conditions |
| `observedAt` | `string` | Yes | Explicit observation time |
| `provenance` | `ObservedOutcomeProvenance` | Yes | Source and recording lineage |

No construction input may be a function, arbitrary object graph, or mutable
canonical state.

Construction shall use:

```ts
ObservedOutcome.create(input: ObservedOutcomeInput): Promise<ObservedOutcome>
```

The static asynchronous factory shall validate and normalize all input,
derive SHA-256 identity, and invoke a private constructor. The private
constructor shall pass the derived `ObservedOutcomeId` to the inherited
`Entity` constructor. No caller-supplied entity identity is permitted.

# Required Canonical Fields

An `ObservedOutcome` shall expose:

- deterministic `id`;
- `executionEventId`;
- `runtimeAdmissionId`;
- `executionPlanId`;
- `organizationId`;
- `workPackageId`;
- canonical recommendation identifiers;
- canonical trace identifiers;
- inherited planning-rule and planning-policy provenance;
- inherited admission and execution-event provenance;
- `subjectType`;
- `subjectId`;
- `observationCode`;
- one canonical observation `value`;
- conditional `unit`;
- optional `measurementContext`;
- `observedAt`;
- observation `provenance`;
- `version` equal to `1.0.0`; and
- `schemaVersion` equal to `observed-outcome:v1`.

All inherited lineage shall be derived from `ExecutionEvent` and preserved
unchanged.

# Observation Semantics

One instance represents one bounded observation about exactly one subject.
`subjectType` shall be an uppercase ASCII token matching
`^[A-Z][A-Z0-9_]{0,63}$`. `subjectId` shall be a canonical existing
`Identifier`. The subject may differ from the executed work package; this
association does not imply causation. Multiple subjects, values, metrics, or
heterogeneous facts require separate instances.

`observationCode` shall match `^[A-Z][A-Z0-9_]{0,63}$`. It identifies the
observed property without encoding its value, unit, evaluation, or causal
interpretation.

The observation records association with an execution event. It does not
assert:

- that execution caused the observation;
- that the observation is complete or correct;
- that a target was met;
- that business value changed;
- that a recommendation was good or bad; or
- that evidence requirements are satisfied.

# Observation Value Representation

`ObservedOutcomeValue` shall be the closed discriminated union:

```text
Quantitative: { kind: "QUANTITATIVE", value: canonical decimal string }
Categorical:  { kind: "CATEGORICAL", value: normalized string }
Boolean:      { kind: "BOOLEAN", value: boolean }
Text:         { kind: "TEXT", value: normalized bounded string }
```

Arbitrary objects, arrays, callbacks, `NaN`, infinities, binary floating-point
numbers, and unsupported discriminators are prohibited.

## Quantitative

- The value shall be a decimal string, not a JavaScript `number`.
- Exact grammar:
  `^(?:0|-?(?:0\.[0-9]*[1-9]|[1-9][0-9]*(?:\.[0-9]*[1-9])?))$`.
- Leading plus signs, exponent notation, leading zeroes, trailing decimal
  points, `-0`, and trailing fractional zeroes are prohibited.
- The canonical representation shall not exceed 128 UTF-8 bytes.
- A non-empty canonical `unit` is required.

## Categorical

- Trim outer whitespace and normalize to Unicode NFC.
- Reject empty values.
- Preserve case; case carries domain meaning.
- Reject C0 control characters, including line breaks and tabs.
- Maximum length: 128 UTF-8 bytes.
- A `unit` is prohibited.

## Boolean

- Accept only the primitive values `true` and `false`.
- String and numeric substitutes are prohibited.
- A `unit` is prohibited.

## Text

- Normalize CRLF and bare CR to LF before all other normalization.
- Trim outer whitespace and normalize to Unicode NFC.
- Reject empty values.
- Reject NUL and all C0 controls except LF and horizontal tab.
- Maximum length: 1,024 UTF-8 bytes.
- A `unit` is prohibited.
- Text is opaque bounded prose. It shall never be decoded or interpreted as a
  structured object, metadata map, expression, or executable payload.

# Units and Measurement Context

Quantitative units shall be trimmed, Unicode NFC-normalized ASCII tokens
matching `^[A-Za-z][A-Za-z0-9._:/%-]{0,63}$`. Unit tokens are case-sensitive
and shall identify the represented scale or dimension. Examples include
`count`, `percent`, `duration:ms`, and `currency:USD:minor-unit`; examples are
not a universal unit registry. The exact token participates in identity and
serialization. It shall not encode evaluation, confidence, or causal meaning.

`measurementContext`, when present, shall be trimmed, Unicode NFC-normalized,
CRLF-to-LF normalized, and limited to 512 UTF-8 bytes. NUL and C0 controls
other than LF and horizontal tab are prohibited. Empty-after-normalization
context is invalid.
It may clarify population, collection method, or conditions, but shall not be
an arbitrary metadata container.

Omitted optional context is represented by omission, never `null`.

# Observation Time

`observedAt` is caller-supplied. Silent current-clock access is prohibited.

Accepted input shall:

- use an ISO 8601 offset date-time with seconds and optional one-to-three
  fractional digits;
- include `Z` or an explicit numeric offset;
- identify a real calendar instant; and
- normalize to UTC with exactly millisecond precision.

Date-only, local-time, locale-formatted, leap-second, and excess-precision
inputs are invalid.

`observedAt` participates in identity and serialization. It shall be equal to
or later than the referenced `ExecutionEvent.occurredAt`. An earlier instant
is rejected as incompatible with this post-execution artifact. This rule does
not establish causation.

# Provenance

`ObservedOutcomeProvenance` shall be a read-only structure containing:

| Field | Type | Rule |
| --- | --- | --- |
| `sourceType` | closed string union | `HUMAN`, `SYSTEM`, `SERVICE`, `SENSOR`, or `GOVERNED_AUTOMATION` |
| `sourceId` | `string` | Canonical source identifier, 1–256 UTF-8 bytes |
| `collectionMethod` | `string` | Canonical bounded method, 1–128 UTF-8 bytes |
| `recorderType` | closed string union | `HUMAN`, `SYSTEM`, `SERVICE`, or `GOVERNED_AUTOMATION` |
| `recorderId` | `string` | Canonical recording authority, 1–256 UTF-8 bytes |
| `recordedAt` | `string` | Explicit canonical offset date-time |

String fields shall be trimmed and Unicode NFC-normalized. Provenance
establishes traceability, not truth.

`recordedAt` shall normalize under the same timestamp rules as `observedAt`,
participate in identity, and be equal to or later than `observedAt`.

# Lineage

The implementation shall project and defensively copy the following from the
canonical `ExecutionEvent`:

- event identity and type;
- RuntimeAdmission identity;
- ExecutionPlan identity;
- organization identity;
- work-package identity;
- recommendation identities;
- trace identities;
- planning-rule provenance;
- planning-policy provenance;
- ExecutionPlan and RuntimeAdmission schema identities;
- admission provenance;
- execution-event provenance; and
- execution occurrence time.

The `ExecutionEvent` object itself need not be retained after a complete
immutable projection is constructed. Projection failure shall reject
construction.

Projection validation shall inspect inherited fields in the canonical
serialization order listed below. Within arrays, elements and nested members
shall be checked in their declared upstream order. This order determines the
first projection failure.

# Deterministic Identity

`ObservedOutcomeId` shall alias the existing `Identifier` value object.

Identity shall:

- use SHA-256;
- use prefix `observed-outcome:v1:`;
- hash UTF-8 bytes;
- encode every component as its base-10 UTF-8 byte length, one ASCII colon,
  then the raw UTF-8 bytes, concatenated without an additional delimiter;
- use a fixed normative component order;
- include schema and contract versions;
- include complete inherited canonical lineage;
- include observation code, discriminated value, unit-or-omission marker,
  context-or-omission marker, observation time, and provenance;
- use canonical ordering for inherited collections;
- exclude randomness, current time, process state, object identity, locale,
  environment variables, and external I/O; and
- fail with a governed error if identity derivation fails.

The canonical ExecutionEvent identity already commits to its complete
canonical lineage. Copied upstream lineage shall be preserved in the
serialized representation but shall not be redundantly hashed into
ObservedOutcome identity.

For identity, boolean payload is exactly `true` or `false`. Quantitative,
categorical, and text payloads use their normalized strings. Optional unit and
measurement context each use exactly `0` when absent and exactly `1:` followed
by the normalized value when present. Length framing prevents collision
between marker content and adjacent components.

The normative identity component order shall be:

1. schema version;
2. contract version;
3. ExecutionEvent identity;
4. subject type;
5. subject identity;
6. observation code;
7. value discriminator;
8. canonical value payload;
9. unit or omission marker;
10. measurement context or omission marker;
11. observation time;
12. observation source type;
13. observation source identity;
14. collection method;
15. recorder type;
16. recorder identity; and
17. recording time.

# Canonical Serialization

`SerializedObservedOutcome` shall use this exact top-level field order:

1. `observedOutcomeId`;
2. `executionEventId`;
3. `runtimeAdmissionId`;
4. `executionPlanId`;
5. `organizationId`;
6. `workPackageId`;
7. `recommendationIds`;
8. `traceIds`;
9. `planningRuleProvenance`;
10. `planningPolicyProvenance`;
11. `executionPlanSchemaVersion`;
12. `runtimeAdmissionSchemaVersion`;
13. `executionEventSchemaVersion`;
14. `admissionProvenance`;
15. `executionEventProvenance`;
16. `executionOccurredAt`;
17. `subjectType`;
18. `subjectId`;
19. `observationCode`;
20. `value`;
21. `unit`, when present;
22. `measurementContext`, when present;
23. `observedAt`;
24. `provenance`;
25. `version`; and
26. `schemaVersion`.

The nested value field order is `kind`, then `value`. Nested provenance and
inherited provenance shall use their governing declared orders. Arrays shall
retain canonical upstream order and shall satisfy the upstream non-empty
invariants. Optional values are omitted and never serialized as `null`.

Strings shall be serialized as RFC 8259 JSON strings. Quote, reverse-solidus,
and control-character escaping shall use JSON escaping; solidus shall not be
escaped; normalized non-ASCII Unicode shall be emitted without optional
ASCII-only escaping. Canonical serialization shall apply `JSON.stringify`
only to the explicitly constructed, fixed-order canonical projection, never
to caller-owned or uncontrolled objects.

Canonical JSON shall be byte-stable across repeated calls, locale, timezone,
machine, process, and caller property insertion order. Unrestricted
serialization of an uncontrolled object graph is prohibited.

# Immutability

The entity, value, provenance, inherited nested objects, and collections shall
be deeply immutable. Construction shall defensively copy caller-owned and
upstream projections before freezing.

Mutation of source inputs or returned values shall not alter identity,
serialization, equality, or getters.

# Equality

Canonical equality shall use `ObservedOutcomeId`. Under this specification,
equal identifiers imply equal canonical semantic state.

Equality shall be reflexive, symmetric, transitive, deterministic, and
independent of source references or property insertion order.

# Validation

Construction shall validate in the precedence specified below and shall not
silently repair invalid data beyond documented trimming, NFC normalization,
timestamp normalization, and upstream canonical ordering.

No partially constructed instance may escape.

# Deterministic Failure Precedence

Validation shall stop at the first failure in this order:

1. top-level input;
2. ExecutionEvent presence and type;
3. inherited canonical lineage projection;
4. subject presence, type, and identity;
5. observation-code presence and form;
6. value presence and discriminator;
7. discriminator-specific value payload;
8. unit;
9. measurement context;
10. observation-time presence and form;
11. observation-to-execution temporal relation;
12. provenance presence and fields;
13. recording-time form;
14. recording-to-observation temporal relation;
15. identity derivation; and
16. serialization.

Trimming, newline conversion, Unicode NFC conversion, and timestamp
normalization occur within the owning field's validation stage before its
canonical-form checks. They do not form a later, competing validation stage.

Library or object-property iteration order shall not determine the primary
failure.

# Failure Codes

`ObservedOutcomeFailureCode` shall be the closed union:

1. `INVALID_OBSERVED_OUTCOME_INPUT`;
2. `MISSING_EXECUTION_EVENT`;
3. `INVALID_EXECUTION_EVENT`;
4. `INVALID_EXECUTION_EVENT_PROJECTION`;
5. `MISSING_OBSERVATION_SUBJECT`;
6. `INVALID_OBSERVATION_SUBJECT_TYPE`;
7. `INVALID_OBSERVATION_SUBJECT_ID`;
8. `MISSING_OBSERVATION_CODE`;
9. `INVALID_OBSERVATION_CODE`;
10. `MISSING_OBSERVATION_VALUE`;
11. `INVALID_OBSERVATION_VALUE_KIND`;
12. `INVALID_QUANTITATIVE_VALUE`;
13. `INVALID_CATEGORICAL_VALUE`;
14. `INVALID_BOOLEAN_VALUE`;
15. `INVALID_TEXT_VALUE`;
16. `INVALID_OBSERVATION_UNIT`;
17. `INVALID_MEASUREMENT_CONTEXT`;
18. `MISSING_OBSERVATION_TIMESTAMP`;
19. `INVALID_OBSERVATION_TIMESTAMP`;
20. `OBSERVATION_PRECEDES_EXECUTION`;
21. `MISSING_OBSERVATION_PROVENANCE`;
22. `INVALID_OBSERVATION_PROVENANCE`;
23. `INVALID_RECORDING_TIMESTAMP`;
24. `RECORDING_PRECEDES_OBSERVATION`;
25. `OBSERVED_OUTCOME_IDENTITY_DERIVATION_FAILED`; and
26. `OBSERVED_OUTCOME_SERIALIZATION_FAILED`.

## Failure-Code Trigger Matrix

| Code | Exact primary trigger | Owning stage | Stable details | Planned test |
| --- | --- | ---: | --- | --- |
| `INVALID_OBSERVED_OUTCOME_INPUT` | Input is null, non-object, or an array | 1 | `{ field: "input" }` | Invalid top-level input |
| `MISSING_EXECUTION_EVENT` | `executionEvent` is absent or undefined | 2 | `{ field: "executionEvent" }` | Missing event |
| `INVALID_EXECUTION_EVENT` | Supplied event is not canonical `ExecutionEvent` | 2 | `{ field: "executionEvent" }` | Invalid event type |
| `INVALID_EXECUTION_EVENT_PROJECTION` | Event getters fail or expose incomplete/non-canonical lineage | 3 | `{ field: "executionEvent" }` | Malformed projection |
| `MISSING_OBSERVATION_SUBJECT` | `subjectType` or `subjectId` is absent | 4 | `{ field: "subjectType" }` or `{ field: "subjectId" }` | Missing subject fields |
| `INVALID_OBSERVATION_SUBJECT_TYPE` | Normalized subject type violates its token grammar | 4 | `{ field: "subjectType" }` | Invalid subject type |
| `INVALID_OBSERVATION_SUBJECT_ID` | Subject identity is not a canonical `Identifier` | 4 | `{ field: "subjectId" }` | Invalid subject identity |
| `MISSING_OBSERVATION_CODE` | Observation code is absent | 5 | `{ field: "observationCode" }` | Missing code |
| `INVALID_OBSERVATION_CODE` | Normalized code violates its token grammar | 5 | `{ field: "observationCode" }` | Invalid code |
| `MISSING_OBSERVATION_VALUE` | Value is absent | 6 | `{ field: "value" }` | Missing value |
| `INVALID_OBSERVATION_VALUE_KIND` | Value is non-object, an array, or has an unsupported discriminator | 6 | `{ field: "value.kind" }` | Invalid discriminator |
| `INVALID_QUANTITATIVE_VALUE` | Quantitative payload violates decimal grammar or byte bounds | 7 | `{ field: "value.value" }` | Invalid decimal cases |
| `INVALID_CATEGORICAL_VALUE` | Categorical payload is empty, malformed, controlled, or over bound | 7 | `{ field: "value.value" }` | Invalid category cases |
| `INVALID_BOOLEAN_VALUE` | Boolean payload is not primitive `true` or `false` | 7 | `{ field: "value.value" }` | Truthy/falsy rejection |
| `INVALID_TEXT_VALUE` | Text payload is empty, malformed, controlled, or over bound | 7 | `{ field: "value.value" }` | Text normalization and bounds |
| `INVALID_OBSERVATION_UNIT` | Required unit is absent/invalid or a prohibited unit is supplied | 8 | `{ field: "unit" }` | Missing, malformed, and prohibited unit |
| `INVALID_MEASUREMENT_CONTEXT` | Supplied context is empty, controlled, malformed, or over bound | 9 | `{ field: "measurementContext" }` | Invalid context |
| `MISSING_OBSERVATION_TIMESTAMP` | `observedAt` is absent | 10 | `{ field: "observedAt" }` | Missing observation time |
| `INVALID_OBSERVATION_TIMESTAMP` | Observation time violates timestamp grammar or precision | 10 | `{ field: "observedAt" }` | Ambiguous and invalid time |
| `OBSERVATION_PRECEDES_EXECUTION` | Canonical observation instant is before event occurrence | 11 | `{ field: "observedAt" }` | Before/equal/after boundary |
| `MISSING_OBSERVATION_PROVENANCE` | Provenance is absent | 12 | `{ field: "provenance" }` | Missing provenance |
| `INVALID_OBSERVATION_PROVENANCE` | Provenance shape, enum, identifier, method, or bounds are invalid | 12 | `{ field: "provenance.<member>" }` | Each invalid provenance member |
| `INVALID_RECORDING_TIMESTAMP` | Recording time is absent or violates timestamp rules | 13 | `{ field: "provenance.recordedAt" }` | Missing and invalid recording time |
| `RECORDING_PRECEDES_OBSERVATION` | Canonical recording instant is before observation instant | 14 | `{ field: "provenance.recordedAt" }` | Before/equal/after boundary |
| `OBSERVED_OUTCOME_IDENTITY_DERIVATION_FAILED` | Governed SHA-256 operation rejects or yields invalid digest | 15 | `{ operation: "SHA-256" }` | Rejected digest operation |
| `OBSERVED_OUTCOME_SERIALIZATION_FAILED` | Canonical projection cannot be serialized | 16 | `{ operation: "canonical-json" }` | Rejected serialization operation |

`ObservedOutcomeError` shall expose a failure code and a deeply immutable
stable detail record limited to optional `field` and `operation` string keys
shown in the matrix. Messages and detail-key ordering shall be deterministic.
Raw implementation exceptions shall not escape when a governed code applies.

Within subject validation, `subjectType` precedes `subjectId`. Within
provenance validation, the order is object shape, `sourceType`, `sourceId`,
`collectionMethod`, `recorderType`, `recorderId`, then `recordedAt`.
`recordedAt` format and temporal relation retain their separate precedence
stages and codes.

The failure codes map to normative requirements as follows:

| Failure-code group | Normative requirements |
| --- | --- |
| Top-level construction | OO-REQ-008, OO-REQ-009, OO-REQ-059, OO-REQ-060 |
| ExecutionEvent presence and type | OO-REQ-002, OO-REQ-059, OO-REQ-060 |
| ExecutionEvent projection | OO-REQ-010 through OO-REQ-019, OO-REQ-059, OO-REQ-060 |
| Subject and observation code | OO-REQ-020 through OO-REQ-022, OO-REQ-059, OO-REQ-060 |
| Value discriminator and payload | OO-REQ-023 through OO-REQ-030, OO-REQ-059, OO-REQ-060 |
| Unit and measurement context | OO-REQ-026, OO-REQ-027, OO-REQ-031, OO-REQ-059, OO-REQ-060 |
| Observation and recording time | OO-REQ-033 through OO-REQ-042, OO-REQ-059, OO-REQ-060 |
| Provenance | OO-REQ-039 through OO-REQ-042, OO-REQ-059, OO-REQ-060 |
| Identity and serialization operations | OO-REQ-043 through OO-REQ-053, OO-REQ-059, OO-REQ-060 |

# Public API

The proposed minimum public surface is:

- `ObservedOutcome`;
- `ObservedOutcomeId`;
- `ObservedOutcomeInput`;
- `ObservedOutcomeValue`;
- `ObservedOutcomeProvenance`;
- `ObservedOutcomeError`;
- `ObservedOutcomeFailureCode`; and
- `SerializedObservedOutcome`.

Hashing, normalization, validation, projection, ordering, defensive-copy, and
serialization helpers shall remain private.

# Dependency Rules

The future implementation shall:

- reside in the existing domain package;
- depend only on existing domain abstractions and Web Crypto already used by
  the domain package;
- consume canonical `ExecutionEvent`;
- preserve the existing package dependency direction;
- introduce no infrastructure, persistence, networking, runtime, adapter,
  analytics, AI, or evidence dependency; and
- create no circular dependency.

# Normative Requirements

## Ownership and Construction

- **OO-REQ-001:** `ObservedOutcome` shall be the canonical domain artifact for
  one bounded observation associated with one `ExecutionEvent`.
- **OO-REQ-002:** Construction shall consume exactly one canonical
  `ExecutionEvent`.
- **OO-REQ-003:** The artifact shall record observation only and shall not
  claim causation.
- **OO-REQ-004:** The artifact shall not verify truth or evidentiary
  sufficiency.
- **OO-REQ-005:** The artifact shall not classify success, failure, confidence,
  or recommendation quality.
- **OO-REQ-006:** One instance shall identify exactly one observed subject and
  contain exactly one observation value.
- **OO-REQ-007:** `EvidenceRecord` and outcome evaluation shall remain
  downstream.
- **OO-REQ-008:** Construction shall use the declared asynchronous static
  factory, private constructor, and inherited `Entity.id`.
- **OO-REQ-009:** No caller-supplied ObservedOutcome identity shall be
  accepted, and no partial instance shall escape.

## Lineage

- **OO-REQ-010:** ExecutionEvent identity shall be preserved exactly.
- **OO-REQ-011:** RuntimeAdmission identity shall be preserved exactly.
- **OO-REQ-012:** ExecutionPlan identity shall be preserved exactly.
- **OO-REQ-013:** Organization identity shall be preserved exactly.
- **OO-REQ-014:** Work-package identity shall be preserved exactly.
- **OO-REQ-015:** Recommendation and trace identities shall preserve canonical
  upstream ordering and non-empty invariants.
- **OO-REQ-016:** Planning rule and policy provenance shall be preserved.
- **OO-REQ-017:** Admission and execution-event provenance shall be preserved.
- **OO-REQ-018:** Lineage shall be derived from the event, not caller-supplied
  side channels.
- **OO-REQ-019:** Invalid or incomplete event projection shall reject
  construction without revalidating the complete event contract.

## Subject, Value, and Context

- **OO-REQ-020:** Subject type shall use the declared canonical token grammar.
- **OO-REQ-021:** Subject identity shall be a canonical `Identifier`.
- **OO-REQ-022:** Observation code shall use the declared canonical token
  grammar and shall not encode value or evaluation.
- **OO-REQ-023:** Values shall use the closed discriminated union specified
  here, and the discriminator shall participate in identity.
- **OO-REQ-024:** Arbitrary objects, arrays, functions, and unsupported kinds
  shall be rejected.
- **OO-REQ-025:** Quantitative values shall use bounded canonical decimal
  strings with canonical sign, zero, fraction, and no exponent notation.
- **OO-REQ-026:** Quantitative values shall require a canonical unit token.
- **OO-REQ-027:** Non-quantitative values shall prohibit units.
- **OO-REQ-028:** Categorical values shall be non-empty, NFC-normalized,
  case-sensitive, control-free, and bounded.
- **OO-REQ-029:** Boolean values shall accept only primitive booleans.
- **OO-REQ-030:** Text values shall use deterministic newline normalization,
  NFC normalization, control rules, non-empty semantics, and byte bounds.
- **OO-REQ-031:** Optional measurement context shall use deterministic newline
  and NFC normalization, control rules, and byte bounds.
- **OO-REQ-032:** Optional omission shall serialize by field omission, not
  `null`.

## Time and Provenance

- **OO-REQ-033:** Observation time shall be supplied explicitly without a
  hidden current-clock lookup.
- **OO-REQ-034:** Accepted timestamps shall include explicit UTC or numeric
  offset and valid governed precision.
- **OO-REQ-035:** Timestamps shall normalize to UTC with exactly millisecond
  precision before identity or comparison.
- **OO-REQ-036:** Observation time shall participate in identity.
- **OO-REQ-037:** Observation time before execution occurrence shall be
  rejected; equality at the same millisecond shall be accepted.
- **OO-REQ-038:** Temporal admissibility shall not imply attribution or
  causation.
- **OO-REQ-039:** Provenance shall include source type, source identity,
  collection method, recorder type, recorder identity, and recording time.
- **OO-REQ-040:** Provenance values shall be normalized and bounded and shall
  represent traceability, not proof.
- **OO-REQ-041:** Recording time shall be explicit and canonical.
- **OO-REQ-042:** Recording time before observation time shall be rejected;
  equality at the same millisecond shall be accepted.

## Determinism and Serialization

- **OO-REQ-043:** Identity shall be deterministic, versioned SHA-256.
- **OO-REQ-044:** Identity shall use the normative component order and
  unambiguous UTF-8 byte-length framing.
- **OO-REQ-045:** Identity shall include ExecutionEvent identity once and all
  ObservedOutcome-owned canonical semantics.
- **OO-REQ-046:** Copied upstream lineage shall not be redundantly hashed
  because ExecutionEvent identity already commits to it.
- **OO-REQ-047:** Identity shall exclude randomness, hidden clocks, process
  state, locale, environment state, and external I/O.
- **OO-REQ-048:** Equivalent semantic inputs shall produce equal identifiers,
  and meaningful canonical changes shall produce different identifiers.
- **OO-REQ-049:** Canonical serialization shall use the exact declared
  top-level and nested field orders.
- **OO-REQ-050:** Canonical serialization shall apply the declared decimal,
  timestamp, omission, null, collection, provenance, and trace rules.
- **OO-REQ-051:** JSON string escaping and normalized Unicode emission shall
  follow the declared RFC 8259 rules.
- **OO-REQ-052:** Canonical serialization shall be stable across repeated
  calls and supported hosts and shall not depend on caller insertion order.
- **OO-REQ-053:** Identity or serialization operation failure shall produce
  its governed failure code.

## Integrity and Errors

- **OO-REQ-054:** The entity and all nested state shall be deeply immutable.
- **OO-REQ-055:** Constructor inputs and upstream projections shall be
  defensively copied.
- **OO-REQ-056:** Returned values shall not permit mutation of internal state.
- **OO-REQ-057:** Equality shall use only canonical `ObservedOutcomeId`.
- **OO-REQ-058:** Equality shall be reflexive, symmetric, transitive, and
  deterministic.
- **OO-REQ-059:** The failure-code union shall contain exactly the governed
  codes in this specification.
- **OO-REQ-060:** Every failure code shall use the exact matrix trigger,
  precedence stage, stable details, and planned test.
- **OO-REQ-061:** Validation shall use normative first-failure precedence
  independent of object-property or library error ordering.
- **OO-REQ-062:** Normalization shall occur only within its owning validation
  stage.
- **OO-REQ-063:** Error details and nested state shall be stable and deeply
  immutable.

## Architecture and Compatibility

- **OO-REQ-064:** Only the approved minimum public surface shall be exported.
- **OO-REQ-065:** Implementation helpers shall remain private.
- **OO-REQ-066:** The implementation shall contain no persistence,
  infrastructure, networking, AI, analytics, evidence, or evaluation behavior.
- **OO-REQ-067:** ExecutionEvent, RuntimeAdmission, and Capability 007 shall
  remain unchanged.
- **OO-REQ-068:** No circular or reverse dependency shall be introduced.
- **OO-REQ-069:** Canonical `ExecutionEvent`, `RuntimeAdmission`, and
  `ExecutionPlan` identity, serialization,
  and public contracts shall remain compatible.
- **OO-REQ-070:** No arbitrary metadata, generalized event framework, mutable
  status, registry, or aggregation engine shall be introduced.
- **OO-REQ-071:** Existing legacy Outcome and dashboard observation types shall
  remain unchanged and shall not become canonical aliases.
- **OO-REQ-072:** Future evidence qualification shall consume immutable
  ObservedOutcome without mutating it or adding verification state to it.

# Future Test Contract

Future implementation verification shall cover:

- valid construction for every value kind;
- canonical subject-type and subject-identity behavior;
- exact lineage preservation;
- all failure codes;
- precedence-sensitive invalid combinations;
- quantitative grammar and unit rules;
- categorical, boolean, text, and context bounds;
- timestamp normalization and temporal rejection;
- provenance normalization and ordering;
- deterministic fixed identity vectors;
- canonical serialization byte vectors;
- equivalent-input replay;
- meaningful-input differentiation;
- locale, timezone, and property-order independence;
- source and returned-value mutation resistance;
- deep immutability;
- equality laws;
- public exports and private-helper exclusion;
- dependency and architectural exclusions;
- ExecutionEvent, RuntimeAdmission, and Capability 007 regressions; and
- Domain typecheck, Domain build, complete Domain tests, formatting, and
  repository integrity.

Every normative requirement shall map to a test or documented static
verification in the future VVR.

# Compatibility

The contract is additive and compatible with the canonical verified execution
contracts. It shall not modify:

- `ExecutionEvent`;
- `RuntimeAdmission`;
- `ExecutionPlan`;
- Capability 007;
- existing identity or serialization vectors;
- existing public exports; or
- existing provenance ordering.

Existing legacy `Outcome` and dashboard-local observation types remain
unchanged and do not become aliases of this canonical contract.

Implementation and verification may consume the canonical verified
`ExecutionEvent` contract. Operational `ObservedOutcome` use requires
`ExecutionEvent`, `RuntimeAdmission`, and `ExecutionPlan` to cross all
applicable release, admissibility, and runtime-governance boundaries.

# Acceptance Criteria

This specification may be accepted only when:

1. ADR-0011 is accepted;
2. observation, outcome, causation, evidence, and evaluation remain distinct;
3. every field has an authoritative source;
4. value, time, provenance, identity, serialization, and failure behavior are
   implementation-ready;
5. no hidden infrastructure or side-channel input is required;
6. compatibility with the canonical verified execution contracts is confirmed;
7. an architecture review finds no unresolved ambiguity; and
8. implementation authorization is recorded separately.

# Status and Authorization

This specification is Accepted. Implementation is authorized only within
GM-0009's explicit scope. Acceptance does not authorize `EvidenceRecord`,
analytics, persistence, release, runtime deployment, or any downstream
capability. ADR, HCES, GM, VVR, tests, build, staging, merge, or commit confer
no release or runtime-deployment authority.
