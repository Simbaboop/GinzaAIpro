# SAS-0002: Deterministic Capture Engine

## Status

Normative for Sprint 2.4.

## Governing decision

This specification implements
`ADR-0015: Canonical Capture Boundary`.

The canonical flow is:

```text
External Reality
  -> External Representation
  -> Adapter
  -> CaptureInput
  -> Capture
  -> BusinessSignal
  -> Validation
  -> Evidence
  -> Intelligence
```

`CaptureInput` is the only canonical Capture Engine input contract. No
application DTO, connector payload, `CaptureRecord`, `Observation`, kernel
`BusinessEvent`, or other upstream type may become a competing canonical
input unless a future ADR supersedes ADR-0015.

## 1. Sprint objective

Sprint 2.4 will:

1. Introduce the canonical immutable `CaptureInput` contract in
   `packages/core`.
2. Change `CaptureEngine` from
   `Engine<BusinessSignal, BusinessSignal>` to
   `Engine<CaptureInput, BusinessSignal>`.
3. Introduce `packages/capture` and implement a concrete deterministic
   Capture Engine there.

The engine transforms normalized, technology-neutral intake into an
immutable canonical observation. It does not validate whether that
observation is true or reliable enough to become Evidence.

## 2. Scope

Sprint 2.4 includes only:

- the immutable `CaptureInput` contract in `packages/core`, beside
  `CaptureEngine`;
- the `CaptureEngine` generic input update;
- a deterministic implementation in `packages/capture`;
- stable capture diagnostics;
- deterministic success and failure explanations;
- package and root public exports;
- package manifests, TypeScript configuration, workspace integration, and
  declaration generation required for `@ginzaaipro/capture`;
- unit and contract tests;
- documentation required to keep implementation aligned with ADR-0015 and
  this specification.

No adapter or connector is part of this sprint.

## 3. Explicit non-goals

Sprint 2.4 will not implement:

- raw webhook parsing;
- CRM, email, phone, CSV, API, or kernel-event adapters;
- connector authentication, retries, polling, or transport behavior;
- Evidence creation;
- validation of truth, integrity, completeness, consistency, qualification,
  or business reliability;
- interpretation, Findings, Intelligence, Recommendations, or prioritization;
- execution, workflow, orchestration, persistence, publication, telemetry,
  external I/O, or other side effects;
- source-specific schemas inside `packages/core` or `packages/capture`;
- changes to kernel contracts;
- a second canonical capture-input abstraction.

## 4. Canonical `CaptureInput`

### Contract form and immutability

`CaptureInput` is an immutable core contract whose fields are readonly.
Construction and access must not expose mutable internal state. Existing
domain value objects used by the contract are already immutable and must be
retained as such.

Rules that are defined below as Capture Engine rejection conditions must be
reported through `EngineResult<BusinessSignal>` diagnostics. The
`CaptureInput` storage boundary must not preempt those engine diagnostics by
throwing for empty `source`, empty `sourceReference`, invalid `occurredAt`,
or empty `deterministicIdentityMaterial`. Existing domain value objects may
continue to enforce their own construction invariants.

The proposed fields are:

| Field | Type | Responsibility | Normalization rule | Rejection condition |
| --- | --- | --- | --- | --- |
| `organizationId` | `Identifier` | Identifies the Organization that owns the observation and establishes its aggregate boundary. The adapter supplies it. | Preserve the immutable `Identifier`; compare by `Identifier.equals`. No string coercion occurs in Capture. | Reject when it does not equal `EngineContext.organizationId`. A non-`Identifier` runtime value is invalid canonical input. |
| `category` | `BusinessSignalCategory` | Supplies the adapter's canonical category candidate. Capture checks that it is a supported category but does not reinterpret it. | Preserve exactly one canonical literal: `"operational"`, `"financial"`, `"human"`, `"system"`, or `"external"`. No case conversion or category inference occurs. | Reject any runtime value outside the canonical literal set. |
| `source` | `string` | Identifies the logical source system or intake channel, not the raw payload. The adapter supplies it. | Trim leading and trailing whitespace and normalize Unicode to NFC. Preserve case. | Reject when the normalized value is empty. |
| `sourceReference` | `string` | Identifies the source-native record, message, event, row, or occurrence used for traceability and identity derivation. | Trim leading and trailing whitespace and normalize Unicode to NFC. Preserve case. | Reject when the normalized value is empty. |
| `occurredAt` | `string` | Records when the external reality occurred, as determined or mapped by the adapter. | Require an RFC 3339 date-time containing `Z` or an explicit numeric UTC offset; parse to a finite instant and convert to UTC ISO 8601 using `Date.toISOString()`. | Reject an empty value, a date without a timezone, an impossible date, or any value that does not parse to a finite instant. |
| `value` | `BusinessSignalValue` | Carries the normalized business observation supplied by the adapter. Capture preserves its business type and does not infer a missing value. | Trim and NFC-normalize strings; normalize numeric `-0` to `0`; preserve finite numbers, `bigint`, booleans, and immutable `Money` or `Percentage` values. No cross-type coercion occurs. | Reject an empty normalized string, a non-finite number, or a runtime value outside `BusinessSignalValue`. |
| `subjectId` | `Identifier \| undefined` | Optionally identifies the business subject observed by the signal. The adapter supplies it only when the source supports that identity. | Preserve the immutable `Identifier`; absence remains `undefined`. | Reject a supplied runtime value that is not an `Identifier`. Absence is valid and must not cause Capture to invent a subject. |
| `confidence` | `Percentage \| undefined` | Carries an adapter-supplied initial confidence assertion. It is not validated confidence and is not an Evidence qualification. | Preserve the immutable `Percentage`. When absent, resolve to the deterministic default of `Percentage.fromBasisPoints(0)`. | Reject a supplied runtime value that is not a valid `Percentage`. Absence is valid and uses the documented default. |
| `deterministicIdentityMaterial` | `string` | Supplies stable, source-derived identity material that distinguishes the external occurrence without requiring randomness or process state. | Trim leading and trailing whitespace and normalize Unicode to NFC. Preserve case. | Reject when the normalized value is empty. |

The adapter must map raw source data into these canonical types. Capture must
not parse transport-specific objects or infer missing business facts.

### Confidence default

The sole deterministic default is `Percentage.fromBasisPoints(0)`, or zero
basis points.

Zero basis points means that the adapter supplied no initial confidence
assertion. It does not mean that the observation is false. Capture must not
raise this value based on source, category, completeness, or any other
heuristic. Validation remains responsible for Evidence qualification.

## 5. Deterministic identity strategy

### Required identity inputs

The Capture Engine constructs the `BusinessSignal` `Identifier` from these
normalized values, in this exact order:

1. the fixed version marker `ginzaaipro:business-signal:capture:v1`;
2. `organizationId.value`;
3. `source`;
4. `sourceReference`;
5. `deterministicIdentityMaterial`.

Each value is encoded as UTF-8 and included in a length-prefixed canonical
sequence. Length-prefixing is mandatory so that different field boundaries
cannot produce the same sequence. `category`, `occurredAt`, `value`,
`subjectId`, `confidence`, `EngineContext.correlationId`,
`EngineContext.executionTime`, duration, and diagnostic content are not
identity inputs.

This distinction keeps the identity stable when the same external occurrence
is captured again while allowing the immutable observation content and
execution metadata to be evaluated independently. The adapter is responsible
for ensuring that `deterministicIdentityMaterial`, together with the source
reference, distinguishes source occurrences that require distinct identities.

### Hashing

SHA-256 hashing is required. The engine hashes the canonical UTF-8 sequence
and constructs the `Identifier` as:

```text
business-signal:capture:v1:<lowercase SHA-256 hexadecimal digest>
```

The hashing utility belongs inside `packages/capture` as a package-private,
side-effect-free identity utility. It must not be exported from
`@ginzaaipro/capture` and must not be added to `packages/core` or
`packages/domain`. It may wrap a standard runtime cryptographic primitive,
but it must perform no network, file, clock, random, process-state, or other
external I/O.

The algorithm, canonical field order, encoding, version marker, and lowercase
hexadecimal rendering are normative. They must not vary by platform or
execution.

### Determinism guarantee

The engine must not use:

- randomness;
- the current system clock;
- `EngineContext.executionTime` as identity material;
- process identifiers, counters, memory state, or runtime duration;
- environment variables;
- persistence or external lookups;
- network, filesystem, or other external I/O.

Repeated execution with equivalent normalized `CaptureInput` and equivalent
`EngineContext` must produce the same signal identity and equivalent
substantive output. Runtime duration is operational metadata and is excluded
from substantive output equivalence.

## 6. Mapping into `BusinessSignal`

| `BusinessSignal` field | Source and rule |
| --- | --- |
| `id` | Constructed by the deterministic identity strategy in section 5. |
| `organizationId` | `CaptureInput.organizationId`, after the organization-boundary check succeeds. |
| `category` | Normalized `CaptureInput.category`; Capture never reclassifies it. |
| `source` | Trimmed, NFC-normalized `CaptureInput.source`. |
| `occurredAt` | Canonical UTC ISO representation of `CaptureInput.occurredAt`. |
| `capturedAt` | `EngineContext.executionTime.toISOString()`. The system clock must not be read. |
| `value` | Normalized `CaptureInput.value`, preserving its canonical business type. |
| `confidence` | Supplied `CaptureInput.confidence`, or zero basis points when absent. |
| `validationStatus` | Always `"unvalidated"`. No input may override it. |
| `subjectId` | Supplied `CaptureInput.subjectId`, or `undefined` when absent. |
| `validationNotes` | Always `undefined`. Capture has performed no validation that could create notes. |

`sourceReference` and `deterministicIdentityMaterial` contribute to `id`
construction and are not copied into another `BusinessSignal` property,
because the current canonical `BusinessSignal` has no such property. Sprint
2.4 must not overload `source`, `validationNotes`, or `value` to store them.
Adding a first-class source-reference property to the domain entity would be
a separate domain decision and is not required by this sprint.

Capture must fail rather than fabricate a missing organization, category,
source, source reference, occurrence time, value, or identity material. It
must not invent a subject. The only permitted default is the zero-basis-point
confidence default defined in this specification.

## 7. Organization-boundary rule

`CaptureInput.organizationId` must equal
`EngineContext.organizationId` according to `Identifier.equals`.

On mismatch, the engine must:

- stop before constructing a signal identity or `BusinessSignal`;
- return `EngineResult<BusinessSignal>` with `success === false`;
- return `value === undefined`;
- include the `CAPTURE_ORGANIZATION_MISMATCH` error diagnostic;
- return the deterministic failure explanation defined in section 11;
- perform no subsequent capture work or side effects.

Capture must never move, copy, or reinterpret a signal across Organization
boundaries.

## 8. Temporal rules

`occurredAt` must be a valid RFC 3339 instant with an explicit timezone. It
is normalized to UTC ISO 8601 before output construction.

`capturedAt` is the valid execution time already held by
`EngineContext.executionTime`, normalized with `toISOString()`.

The following ordering rule is absolute:

```text
capturedAt >= occurredAt
```

No clock-skew tolerance is introduced in Sprint 2.4.

Failure behavior is:

- invalid `occurredAt` returns `CAPTURE_OCCURRENCE_INVALID`;
- a valid `occurredAt` later than `EngineContext.executionTime` returns
  `CAPTURE_TIME_ORDER_INVALID`;
- either condition returns `success === false`, `value === undefined`, one
  error diagnostic for the first failed rule, and a deterministic failure
  explanation;
- no `BusinessSignal` is partially constructed or returned.

An invalid execution time cannot be represented by a valid `EngineContext`
and remains an `EngineContext` construction invariant.

## 9. Adapter-versus-Capture responsibility matrix

| Concern | Adapter responsibility | Capture Engine responsibility |
| --- | --- | --- |
| External representation | Understand webhook, form, file, email, API, kernel-event, or other source-specific shape. | Never receive or parse it. |
| Malformed transport data | Reject payloads that cannot be translated into canonical intake. | No transport-level validation. |
| Organization | Map the source occurrence to an existing `Identifier`. | Require equality with `EngineContext.organizationId`. |
| Category | Map source semantics to a canonical category candidate. | Require membership in `BusinessSignalCategory`; do not infer or reclassify. |
| Source | Supply the logical source name. | Trim, NFC-normalize, and reject empty input. |
| Source reference | Supply a stable source-native reference. | Normalize, require it, and use it in deterministic identity. |
| Occurrence time | Extract or map an explicitly zoned timestamp. | Parse, normalize to UTC, and enforce temporal ordering. |
| Value | Translate source data into `BusinessSignalValue`. | Enforce the canonical value union and preserve the selected type. |
| Subject | Supply an `Identifier` when the source supports a known subject. | Preserve it or leave it absent; never invent one. |
| Initial confidence | Supply a `Percentage` only when the adapter has a documented basis. | Preserve it or use the zero-basis-point default; never treat it as validated confidence. |
| Identity material | Supply stable material that distinguishes the source occurrence. | Canonically encode and hash it with the other required identity inputs. |
| Signal identity | Do not assign a `BusinessSignal` identity. | Construct the canonical deterministic `Identifier`. |
| Capture time | Do not supply or override it. | Use `EngineContext.executionTime`. |
| Validation state | Do not claim it through `CaptureInput`. | Set `"unvalidated"` and leave notes undefined. |
| Truth and reliability | Make no canonical Evidence claim. | Make no canonical Evidence claim. Validation owns qualification. |
| Persistence and side effects | Outside this contract and sprint. | Prohibited. |

## 10. Diagnostic catalog

### Diagnostic behavior

Diagnostic codes, severities, messages, and ordering are stable public
behavior. The engine is fail-fast and returns the first applicable error in
the validation order below. A failed result contains exactly that error
diagnostic and no value.

On success, `CAPTURE_SUCCEEDED` is always last. When confidence defaults,
`CAPTURE_CONFIDENCE_DEFAULTED` precedes `CAPTURE_SUCCEEDED`. No other
success diagnostic is required.

### Stable codes

| Code | Severity | Trigger | Result behavior |
| --- | --- | --- | --- |
| `CAPTURE_ORGANIZATION_MISMATCH` | `error` | `CaptureInput.organizationId` does not equal `EngineContext.organizationId`. | Failure; no value. |
| `CAPTURE_CATEGORY_INVALID` | `error` | Category is outside `BusinessSignalCategory`. | Failure; no value. |
| `CAPTURE_SOURCE_EMPTY` | `error` | Normalized `source` is empty. | Failure; no value. |
| `CAPTURE_SOURCE_REFERENCE_EMPTY` | `error` | Normalized `sourceReference` is empty. | Failure; no value. |
| `CAPTURE_OCCURRENCE_INVALID` | `error` | `occurredAt` is not a valid explicitly zoned RFC 3339 instant. | Failure; no value. |
| `CAPTURE_TIME_ORDER_INVALID` | `error` | `EngineContext.executionTime` precedes normalized `occurredAt`. | Failure; no value. |
| `CAPTURE_VALUE_INVALID` | `error` | Value is an empty normalized string, a non-finite number, or outside `BusinessSignalValue`. | Failure; no value. |
| `CAPTURE_SUBJECT_INVALID` | `error` | A supplied `subjectId` is not an `Identifier`. | Failure; no value. |
| `CAPTURE_CONFIDENCE_INVALID` | `error` | A supplied `confidence` is not a valid `Percentage`. | Failure; no value. |
| `CAPTURE_IDENTITY_MATERIAL_EMPTY` | `error` | Normalized `deterministicIdentityMaterial` is empty. | Failure; no value. |
| `CAPTURE_CONFIDENCE_DEFAULTED` | `info` | No confidence was supplied and zero basis points was used. | Success; value returned. |
| `CAPTURE_SUCCEEDED` | `info` | All canonical requirements passed and a signal was constructed. | Success; value returned. |

### Deterministic validation order

The engine evaluates canonical requirements in this order:

1. organization boundary;
2. category;
3. source;
4. source reference;
5. occurrence validity;
6. capture/occurrence ordering;
7. value;
8. optional subject;
9. optional confidence;
10. deterministic identity material;
11. identity construction and `BusinessSignal` construction.

The order prevents input permutations or incidental exception order from
changing the returned failure.

## 11. Explanation requirements

Every result must contain an immutable `Explanation`.

### Successful result

A successful explanation must:

- use an empty `evidenceIds` array because Capture creates no Evidence;
- use an empty `assumptions` array;
- identify the zero-confidence default in `limitations` when the default was
  used, and otherwise use an empty `limitations` array;
- use the resolved signal confidence as `Explanation.confidence`;
- state that canonical intake was deterministically transformed into an
  immutable, unvalidated `BusinessSignal`;
- state that Capture made no truth, reliability, or Evidence claim.

The success reasoning text must be a stable template selected by whether
confidence was supplied or defaulted. It must not include runtime duration,
wall-clock text, hashes other than the returned signal identity, environment
data, exception stack traces, or source-specific prose.

### Failed result

A failed explanation must:

- use an empty `evidenceIds` array;
- use an empty `assumptions` array;
- include one stable limitation describing the failed canonical rule;
- use the supplied confidence when it is a valid `Percentage`, otherwise the
  zero-basis-point default;
- identify the returned diagnostic code and state that no
  `BusinessSignal` was created.

Failure reasoning must be generated from a closed mapping keyed by the stable
diagnostic code. Raw exception messages, stack traces, payload content, and
nondeterministic prose must not be exposed.

Explanations communicate applied rules and observable outcomes only. They do
not expose hidden reasoning or chain-of-thought.

## 12. Package and dependency rules

The permitted package graph is:

```text
@ginzaaipro/capture -> @ginzaaipro/core
@ginzaaipro/capture -> @ginzaaipro/domain
@ginzaaipro/core    -> @ginzaaipro/domain
```

The following rules are mandatory:

- `packages/core` depends on `packages/domain` only among GinzaAIpro
  workspace packages;
- `packages/capture` depends on `packages/core` and `packages/domain`;
- `packages/core` must not depend on `packages/kernel`;
- `packages/capture` must not depend on `packages/kernel`;
- `packages/capture` must not contain adapter or connector implementations;
- no package import may be replaced with a relative cross-package import;
- `packages/domain` must not depend on core or capture;
- no circular dependency may be introduced;
- runtime and development dependencies must be limited to those required for
  compilation, testing, and the deterministic implementation;
- hashing remains an internal implementation concern of `packages/capture`.

The workspace package must be named `@ginzaaipro/capture` and follow the
established build, declaration, typecheck, test, ESM entry-point, and
`workspace:*` dependency conventions.

## 13. Required public exports

`@ginzaaipro/core` must publicly export:

- `CaptureInput`;
- `CaptureEngine`;
- the existing shared engine contracts needed by consumers.

`CaptureInput` and `CaptureEngine` must be available from the package root,
through the core capture barrel.

`@ginzaaipro/capture` must publicly export:

- `DeterministicCaptureEngine`;
- the stable capture diagnostic-code constant;
- the corresponding diagnostic-code union type.

Internal identity hashing, canonical encoding, factories, normalization
helpers, and test fixtures must not be public exports.

`@ginzaaipro/domain` continues to export `BusinessSignal`,
`BusinessSignalCategory`, `BusinessSignalValue`, `Identifier`, `Money`, and
`Percentage` through its existing public entry point. No kernel export is
re-exported by core or capture.

## 14. Test matrix

At minimum, Sprint 2.4 must test:

| Test | Required assertion |
| --- | --- |
| Valid input produces `BusinessSignal` | Success is true, value is a `BusinessSignal`, and all mapped fields follow section 6. |
| Deterministic identity | Repeating capture with the same normalized identity inputs produces the same `Identifier`. |
| Organization mismatch | Returns `CAPTURE_ORGANIZATION_MISMATCH`, failure, and no value. |
| Empty source | Whitespace-only source returns `CAPTURE_SOURCE_EMPTY`, failure, and no value. |
| Empty source reference | Whitespace-only reference returns `CAPTURE_SOURCE_REFERENCE_EMPTY`, failure, and no value. |
| Invalid occurrence timestamp | Invalid or timezone-free input returns `CAPTURE_OCCURRENCE_INVALID`, failure, and no value. |
| Capture time before occurrence | Returns `CAPTURE_TIME_ORDER_INVALID`, failure, and no value. |
| Supplied confidence preserved | The same `Percentage` value appears on the signal and in the explanation. |
| Default confidence behavior | Absence resolves to zero basis points and emits `CAPTURE_CONFIDENCE_DEFAULTED`. |
| Unvalidated status enforced | Output status is `"unvalidated"` and notes are `undefined`; input cannot override either. |
| Optional subject preserved | A supplied `Identifier` is retained; absence remains `undefined`. |
| Failed result shape | Every catalogued error returns at least one error diagnostic, `success === false`, and `value === undefined`. |
| Equivalent inputs produce equivalent outputs | With equivalent normalized input and context, identity, signal fields, diagnostic order, and explanation are equivalent; duration is excluded. |
| Input immutability | Execution cannot mutate the input or its value objects, and readonly state cannot be changed through returned references. |
| Output immutability | Signal, diagnostics, diagnostic arrays, explanation, and explanation arrays cannot be mutated through returned references. |
| Category rejection | A runtime value outside the category union returns `CAPTURE_CATEGORY_INVALID`. |
| Invalid value rejection | Empty strings, `NaN`, and infinities return `CAPTURE_VALUE_INVALID`. |
| Empty identity material | Returns `CAPTURE_IDENTITY_MATERIAL_EMPTY`, failure, and no value. |
| Identity canonicalization | Whitespace/NFC-equivalent identity inputs produce the same identifier, while a meaningful source reference or identity-material change produces a different identifier. |
| Context controls capture time | Output `capturedAt` exactly equals normalized `EngineContext.executionTime`; the system clock is not consulted. |
| No Evidence claim | Successful explanations contain no Evidence identifiers and output is only a `BusinessSignal`. |
| Fail-fast ordering | Inputs with multiple defects return the first error defined by the deterministic validation order. |
| Public package resolution | Root imports from `@ginzaaipro/core`, `@ginzaaipro/domain`, and `@ginzaaipro/capture` compile without relative cross-package imports. |
| Forbidden dependency checks | Core and capture contain no kernel imports, and capture contains no adapter implementations. |

Tests must not depend on elapsed duration, the live clock, random values,
network access, filesystem state, process state, or test execution order.

## 15. Acceptance criteria

Sprint 2.4 is accepted only when:

- the domain, core, and capture package builds pass;
- the domain, core, and capture package typechecks pass;
- the domain, core, and capture package tests pass;
- the full workspace build passes;
- the full workspace typecheck passes;
- all full workspace tests pass;
- package declarations and root exports resolve through canonical package
  imports;
- `packages/core` has no dependency or import from `packages/kernel`;
- `packages/capture` has no dependency or import from `packages/kernel`;
- `packages/capture` contains no adapter or connector implementation;
- no circular workspace dependency exists;
- Capture creates no Evidence and performs no external I/O or side effect;
- deterministic identity and substantive-output equivalence tests pass;
- no unrelated files are changed.

## 16. Migration notes

- Replace the existing `CaptureEngine` extension of
  `Engine<BusinessSignal, BusinessSignal>` with
  `Engine<CaptureInput, BusinessSignal>`.
- Add `CaptureInput` beside `CaptureEngine` in the core capture area and
  export both through the capture barrel and `@ginzaaipro/core` root.
- Update core contract tests, mocks, fixtures, type assertions, and any
  compile-time consumer that implements or invokes `CaptureEngine` to pass
  `CaptureInput`.
- Add the `@ginzaaipro/capture` workspace package, its package entry point,
  declaration output, scripts, TypeScript configuration, and
  `workspace:*` dependencies on core and domain.
- Export the concrete deterministic implementation and stable diagnostic
  codes from `@ginzaaipro/capture`.
- Do not replace canonical package imports with relative cross-package
  imports.
- Existing dashboard-local `CaptureRecord` and `Observation` types remain
  unchanged. They are not promoted into canonical contracts.
- Kernel `BusinessEvent` remains unchanged. It is an external
  representation that a future adapter may translate and does not become a
  core or capture dependency.
- Existing Validation Engine input remains `BusinessSignal`; Evidence
  creation and qualification remain in `packages/validation`.
- Existing application flows may migrate through future adapters
  incrementally. No adapter migration is part of Sprint 2.4.
