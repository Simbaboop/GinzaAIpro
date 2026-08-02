# HCES-0010 — Deterministic Verification

**Version:** 1.0.0
**Status:** Accepted
**Date:** 2026-07-29
**Capability:** 010 — Deterministic Verification
**Governing Decision:** ADR-0019
**Discovery Authority:** DISC-0009
**Dependency Baseline:** Execution and Observation Baseline Version 1.0.0

# Purpose

Specify the minimum canonical contract for one immutable, deterministic
Verification judgment concerning exactly one canonical `ObservedOutcome`.

The capability determines whether explicit canonical Evidence:

- confirms the observed proposition;
- refutes the observed proposition; or
- remains insufficient or conflicting, producing an inconclusive judgment.

Verification records evidentiary qualification.

It does not measure business improvement, establish causality, or create
organizational learning.

# Scope

This specification governs:

- one canonical `Verification`;
- one canonical `ObservedOutcome` subject;
- one or more canonical Evidence identities;
- one governed verification method;
- exactly one canonical Verification judgment;
- explicit Organization ownership;
- explicit verifier identity when applicable;
- explicit verification time;
- limitations and bounded notes;
- confidence and calibration status when confidence is represented;
- deterministic identity;
- canonical serialization;
- semantic equality;
- deep immutability;
- deterministic validation and failure behavior;
- the minimum public domain surface;
- the shared Core verification-engine boundary.

# Exclusions

Capability 010 excludes:

- Evidence creation;
- Evidence validation owned by Capability 001;
- Evidence Semantics owned by Capability 002;
- Evidence persistence;
- source collection;
- credibility scoring;
- observation creation;
- execution completion;
- execution success determination;
- baseline calculation;
- actual-value calculation;
- delta calculation;
- business-impact calculation;
- Outcome Evaluation;
- causal inference;
- attribution;
- recommendation generation;
- Operational Learning;
- workflow orchestration;
- human-review queue management;
- dashboard presentation state;
- database or transport behavior;
- automatic wall-clock access;
- creation of a new top-level platform subsystem.

# Canonical Judgment Vocabulary

`VerificationJudgment` shall be the closed union:

- `confirmed`;
- `refuted`;
- `inconclusive`.

These values are evidentiary judgments.

They are not workflow or processing states.

The following terms shall not be canonical Verification judgments:

- `Unverified`;
- `Verified`;
- `Needs Review`;
- `Failed Verification`;
- `Pending`;
- `Completed`;
- boolean success or failure values.

A workflow may project or display processing state separately, but it shall
not replace or conceal the canonical judgment.

# Domain Ownership

`@ginzaaipro/domain` shall own the canonical `Verification` artifact.

The intended implementation namespace is:

    packages/domain/src/verification/

`@ginzaaipro/core` shall own the canonical Verification engine contract.

The intended Core namespace is:

    packages/core/src/verification/

No new top-level package, platform subsystem, persistence abstraction, event
bus, workflow framework, or infrastructure layer is authorized.

# Canonical Subject

One `Verification` shall evaluate exactly one canonical `ObservedOutcome`.

The canonical subject type is fixed as:

    observed_outcome

The public contract shall not expose an open-ended subject discriminator.

The legacy alternatives `action`, `execution_plan`, and `outcome` are outside
the Capability 010 canonical contract.

Future verification of another subject type requires separate governance.

# Construction Authority

Construction shall require explicit canonical inputs.

The constructor or factory shall not:

- create an `ObservedOutcome`;
- create Evidence;
- retrieve missing records;
- infer Organization identity;
- infer Evidence identities;
- infer verifier identity;
- create verification time;
- repair cross-Organization input;
- convert execution completion into confirmation;
- infer causality;
- generate confidence automatically.

No partially constructed canonical instance shall escape after validation
failure.
# Construction Inputs

`VerificationCreateInput` shall be a read-only structure containing exactly:

| Field | Type | Required | Responsibility |
|---|---|---:|---|
| `observedOutcome` | `ObservedOutcome` | Yes | Supplies the sole canonical subject and Organization lineage |
| `evidence` | `readonly Evidence[]` | Yes | Supplies the explicit canonical Evidence evaluated |
| `method` | `string` | Yes | Identifies the governed verification method |
| `judgment` | `VerificationJudgment` | Yes | Records the canonical evidentiary conclusion |
| `verifiedAt` | `string` | Yes | Records the explicit judgment-completion time |
| `limitations` | `readonly string[]` | Yes | Preserves known boundaries and unresolved constraints |
| `verifierId` | `Identifier` | No | Identifies the responsible verifier when applicable |
| `notes` | `string` | No | Preserves bounded explanatory context |
| `confidence` | `VerificationConfidence` | No | Records explicitly classified confidence when represented |

`VerificationCreateInput` is the Domain construction contract for a completed
judgment.

It is distinct from the Core pre-judgment Verification engine request.

Construction shall consume the canonical `ObservedOutcome` and canonical
Evidence objects directly.

Callers shall not resupply:

- `organizationId`;
- `observedOutcomeId`;
- Evidence identities separately;
- ExecutionEvent identity;
- RuntimeAdmission identity;
- ExecutionPlan identity;
- upstream schema versions;
- upstream execution lineage.

Those values shall be projected from canonical upstream artifacts.

# Verification Confidence

`VerificationConfidence` shall be the closed discriminated union:

    Readonly<{
      calibrationStatus: "uncalibrated";
      value: Percentage;
      basis: string;
    }>

or:

    Readonly<{
      calibrationStatus: "calibrated";
      value: Percentage;
      basis: string;
      calibrationRecordId: Identifier;
    }>

Confidence is optional.

When confidence is absent, the Verification shall make no numerical confidence
claim.

When confidence is present:

- `value` shall be a canonical `Percentage`;
- `basis` shall be non-empty normalized text;
- `calibrationStatus` shall be explicit;
- `uncalibrated` confidence shall not contain a calibration-record identity;
- `calibrated` confidence shall contain a canonical calibration-record
  identity;
- calibration status shall participate in deterministic identity and
  serialization;
- confidence shall not be generated automatically by the constructor.

A `Percentage` value by itself does not establish calibration.

Capability 010 validates the declared confidence structure.

It does not validate the scientific adequacy of the external calibration
authority.

# Evidence Input Rules

At least one canonical Evidence record is required.

Every Evidence input shall:

- be an instance of canonical `Evidence`;
- belong to the same Organization as the `ObservedOutcome`;
- expose a canonical identity;
- appear no more than once;
- remain traceable in the completed Verification;
- remain present in canonical serialization.

Evidence shall be canonically ordered by UTF-8 byte ordering of Evidence
identity after Unicode NFC normalization.

Caller-provided Evidence ordering shall not affect:

- Verification identity;
- serialization;
- equality;
- validation outcome.

Duplicate Evidence identities shall be rejected.

Cross-Organization Evidence shall be rejected.

The constructor shall not:

- fetch Evidence by identity;
- infer missing Evidence;
- discard invalid Evidence silently;
- combine Evidence into a replacement record;
- mutate Evidence;
- reinterpret Evidence components;
- recalculate Evidence confidence;
- alter Evidence Semantics.

# Required Canonical Fields

A completed `Verification` shall expose:

- deterministic `verificationId`;
- canonical `organizationId`;
- canonical `observedOutcomeId`;
- fixed subject type `observed_outcome`;
- canonically ordered Evidence identities;
- normalized verification method;
- canonical Verification judgment;
- normalized verification time;
- verifier identity when present;
- normalized limitations;
- normalized notes when present;
- confidence and calibration status when present;
- artifact version;
- schema version.

The canonical artifact shall preserve enough lineage to resolve:

- the evaluated `ObservedOutcome`;
- every evaluated Evidence record;
- the governing Organization;
- the method used;
- the verifier when applicable;
- the judgment time;
- the judgment limitations;
- the confidence basis when confidence is represented.

# Versioning

The initial artifact version shall be:

    1.0.0

The initial schema version shall be:

    verification:v1

The deterministic identity prefix shall be:

    verification:v1:

Version and schema version shall be fixed by the implementation and shall not
be caller-supplied.
# Time Rules

`verifiedAt` shall be caller-supplied.

Silent current-clock access is prohibited.

Accepted verification time shall:

- use an ISO 8601 offset date-time with seconds and optional one-to-three
  fractional digits;
- include `Z` or an explicit numeric offset;
- normalize to UTC with exactly millisecond precision;
- not precede the canonical `ObservedOutcome.observedAt`;
- not precede the `createdAt` time of any evaluated Evidence record.

Equality with the observation time or an Evidence creation time is permitted.

Verification time records when the evidentiary judgment was completed.

It does not replace or redefine:

- execution occurrence time;
- observation time;
- Evidence creation time;
- business measurement periods;
- learning time.

# Text and Collection Bounds

All bounded prose shall:

- normalize CRLF and bare CR to LF;
- trim outer whitespace;
- normalize Unicode to NFC;
- reject NUL and all C0 controls except LF and horizontal tab.

Verification method shall:

- be non-empty after normalization;
- contain at most 128 UTF-8 bytes;
- identify the governed verification method;
- not encode an unrestricted metadata object or executable expression.

The Evidence collection shall:

- contain at least one and at most 128 canonical Evidence records;
- contain no duplicate canonical Evidence identities;
- be canonically ordered only after item validation.

Each limitation shall:

- be non-empty after normalization;
- contain at most 1,024 UTF-8 bytes;
- remain bounded explanatory prose.

The limitations collection shall:

- contain at most 64 entries;
- contain no duplicate normalized values;
- be canonically ordered by normalized UTF-8 byte ordering;
- permit an empty collection when no known limitation exists;
- treat an empty collection as an explicit declaration that no known
  limitation was identified.

Notes are optional.

When supplied, notes shall:

- be non-empty after normalization;
- contain at most 4,096 UTF-8 bytes;
- remain bounded explanatory prose;
- not act as an unrestricted metadata container.

Confidence basis shall:

- be required whenever confidence is supplied;
- be non-empty after normalization;
- contain at most 1,024 UTF-8 bytes;
- explain the basis of the numerical confidence claim;
- not encode calibration authority implicitly.

# Deterministic Identity

`VerificationId` shall alias the existing `Identifier` value object.

Identity shall:

- use SHA-256;
- use prefix `verification:v1:`;
- hash UTF-8 bytes;
- encode every component as its base-10 UTF-8 byte length, one ASCII colon,
  then the raw UTF-8 bytes;
- concatenate framed components without an additional delimiter;
- use a fixed normative component order;
- use canonical Evidence identity order;
- use canonical limitation order;
- include explicit omission markers for optional values;
- exclude randomness, current time, process state, locale, environment
  variables, object identity, persistence identity, and external I/O;
- fail with a governed error when identity derivation fails.

Canonical `ObservedOutcome` identity already commits to its complete execution
and observation lineage.

Canonical Evidence identities already commit to their governed Evidence
construction material.

Verification identity shall therefore include those canonical identities and
shall not redundantly hash their internal fields.

Optional values shall use:

- exactly `0` when absent;
- exactly `1:` followed by the normalized canonical value when present.

Confidence shall use a distinct presence marker before its nested components.

The normative identity component order shall be:

1. schema version;
2. artifact version;
3. Organization identity;
4. `ObservedOutcome` identity;
5. fixed subject type `observed_outcome`;
6. Evidence identity count;
7. canonically ordered Evidence identities;
8. verification method;
9. canonical judgment;
10. verification time;
11. verifier identity or omission marker;
12. limitation count;
13. canonically ordered limitations;
14. notes or omission marker;
15. confidence presence marker;
16. calibration status when confidence is present;
17. confidence basis points when confidence is present;
18. confidence basis when confidence is present; and
19. calibration-record identity or omission marker when confidence is present.

# Canonical Serialization

`SerializedVerification` shall use this exact top-level field order:

1. `verificationId`;
2. `organizationId`;
3. `observedOutcomeId`;
4. `subjectType`;
5. `evidenceIds`;
6. `method`;
7. `judgment`;
8. `verifiedAt`;
9. `verifierId`, when present;
10. `limitations`;
11. `notes`, when present;
12. `confidence`, when present;
13. `version`; and
14. `schemaVersion`.

The fixed serialized subject type shall be:

    observed_outcome

Evidence identities and limitations shall retain their canonical order.

Optional values shall be omitted and shall never be serialized as `null`.

When confidence is present, its field order shall be:

1. `calibrationStatus`;
2. `valueBasisPoints`;
3. `basis`;
4. `calibrationRecordId`, only when calibrated.

Strings shall use RFC 8259 JSON escaping.

Canonical non-ASCII Unicode shall be emitted without optional ASCII-only
escaping.

Canonical JSON shall be produced only from an explicitly constructed
fixed-order projection.

Serialization of caller-owned or uncontrolled object graphs is prohibited.

Canonical serialization shall be byte-stable across:

- repeated calls;
- caller property insertion order;
- Evidence input order;
- limitation input order;
- locale;
- timezone;
- process;
- machine.

# Immutability

The Verification entity and all nested state shall be deeply immutable.

Construction shall defensively copy:

- Evidence collections before projecting identities;
- limitation collections;
- confidence structures;
- optional textual values;
- all canonical projections retained by the entity.

Mutation of source inputs or returned values shall not alter:

- identity;
- serialization;
- equality;
- getters;
- judgment;
- lineage.

A completed Verification shall not be edited in place.

A new method, judgment, Evidence set, limitation, confidence statement, or
verification time requires a new Verification with a new deterministic
identity.

# Equality

Canonical equality shall use `VerificationId`.

Under this specification, equal Verification identities imply equal canonical
semantic state.

Equality shall be:

- reflexive;
- symmetric;
- transitive;
- deterministic;
- independent of caller-owned references;
- independent of caller Evidence order;
- independent of caller limitation order;
- independent of property insertion order.
# Validation

Construction shall validate in the deterministic precedence declared below.

It shall not silently repair invalid data beyond documented:

- whitespace trimming;
- newline normalization;
- Unicode NFC normalization;
- timestamp normalization;
- Evidence identity ordering;
- limitation ordering.

No partially constructed Verification shall escape.

Raw implementation exceptions shall not escape when a governed Verification
failure code applies.

# Deterministic Failure Precedence

Validation shall stop at the first failure in this order:

1. top-level input;
2. `ObservedOutcome` presence and canonical type;
3. `ObservedOutcome` projection and Organization lineage;
4. Evidence collection presence and shape;
5. each Evidence canonical type and projection;
6. Evidence-to-Organization consistency;
7. duplicate Evidence identities;
8. verification-method presence and normalization;
9. Verification judgment presence and closed vocabulary;
10. verification-time presence and form;
11. verification-to-observation temporal relation;
12. verification-to-Evidence temporal relation;
13. limitations presence and collection shape;
14. each limitation normalization and bounds;
15. duplicate normalized limitations;
16. verifier identity when supplied;
17. notes when supplied;
18. confidence object shape when supplied;
19. confidence calibration status;
20. confidence value;
21. confidence basis;
22. calibration-record presence or prohibition;
23. calibration-record identity when required;
24. identity derivation; and
25. canonical serialization.

Normalization occurs within the owning validation stage before canonical-form
checks.

Caller collection order, property insertion order, library iteration order,
locale, and object reference identity shall not determine the primary failure.

# Failure Codes

`VerificationFailureCode` shall be the closed union:

1. `INVALID_VERIFICATION_INPUT`;
2. `MISSING_OBSERVED_OUTCOME`;
3. `INVALID_OBSERVED_OUTCOME`;
4. `INVALID_OBSERVED_OUTCOME_PROJECTION`;
5. `MISSING_VERIFICATION_EVIDENCE`;
6. `INVALID_VERIFICATION_EVIDENCE_COLLECTION`;
7. `INVALID_VERIFICATION_EVIDENCE`;
8. `EVIDENCE_ORGANIZATION_MISMATCH`;
9. `DUPLICATE_VERIFICATION_EVIDENCE`;
10. `MISSING_VERIFICATION_METHOD`;
11. `INVALID_VERIFICATION_METHOD`;
12. `MISSING_VERIFICATION_JUDGMENT`;
13. `INVALID_VERIFICATION_JUDGMENT`;
14. `MISSING_VERIFICATION_TIMESTAMP`;
15. `INVALID_VERIFICATION_TIMESTAMP`;
16. `VERIFICATION_PRECEDES_OBSERVATION`;
17. `VERIFICATION_PRECEDES_EVIDENCE`;
18. `MISSING_VERIFICATION_LIMITATIONS`;
19. `INVALID_VERIFICATION_LIMITATIONS`;
20. `INVALID_VERIFICATION_LIMITATION`;
21. `DUPLICATE_VERIFICATION_LIMITATION`;
22. `INVALID_VERIFIER_ID`;
23. `INVALID_VERIFICATION_NOTES`;
24. `INVALID_VERIFICATION_CONFIDENCE`;
25. `INVALID_CONFIDENCE_CALIBRATION_STATUS`;
26. `INVALID_CONFIDENCE_VALUE`;
27. `MISSING_CONFIDENCE_BASIS`;
28. `INVALID_CONFIDENCE_BASIS`;
29. `MISSING_CALIBRATION_RECORD_ID`;
30. `UNEXPECTED_CALIBRATION_RECORD_ID`;
31. `INVALID_CALIBRATION_RECORD_ID`;
32. `VERIFICATION_IDENTITY_DERIVATION_FAILED`; and
33. `VERIFICATION_SERIALIZATION_FAILED`.

`VerificationError` shall expose:

- one governed `VerificationFailureCode`;
- one deterministic message;
- one deeply immutable stable detail record.

The stable detail record shall be limited to optional:

- `field`;
- `index`;
- `operation`.

Detail-key ordering shall be deterministic.

The failure-code trigger matrix and exact stable details are defined in the
next section of this specification.
## Failure-Code Trigger Matrix

| Code | Exact primary trigger | Stage | Stable details | Planned test |
|---|---|---:|---|---|
| `INVALID_VERIFICATION_INPUT` | Input is null, non-object, or an array | 1 | `{ field: "input" }` | Invalid top-level values |
| `MISSING_OBSERVED_OUTCOME` | `observedOutcome` is absent or undefined | 2 | `{ field: "observedOutcome" }` | Missing subject |
| `INVALID_OBSERVED_OUTCOME` | Supplied subject is not canonical `ObservedOutcome` | 2 | `{ field: "observedOutcome" }` | Invalid subject type |
| `INVALID_OBSERVED_OUTCOME_PROJECTION` | Subject getters fail or expose incomplete or non-canonical identity, Organization, time, or schema lineage | 3 | `{ field: "observedOutcome" }` | Malformed subject projection |
| `MISSING_VERIFICATION_EVIDENCE` | `evidence` is absent or undefined | 4 | `{ field: "evidence" }` | Missing Evidence collection |
| `INVALID_VERIFICATION_EVIDENCE_COLLECTION` | Evidence input is not an array or is empty | 4 | `{ field: "evidence" }` | Invalid and empty collections |
| `INVALID_VERIFICATION_EVIDENCE` | An item is not canonical `Evidence` or exposes an invalid projection | 5 | `{ field: "evidence", index: "<index>" }` | Invalid Evidence at each position |
| `EVIDENCE_ORGANIZATION_MISMATCH` | An Evidence Organization differs from the `ObservedOutcome` Organization | 6 | `{ field: "evidence", index: "<index>" }` | Same- and cross-Organization cases |
| `DUPLICATE_VERIFICATION_EVIDENCE` | Two Evidence inputs expose equal canonical identities | 7 | `{ field: "evidence", index: "<index>" }` | Duplicate and reordered duplicates |
| `MISSING_VERIFICATION_METHOD` | `method` is absent or undefined | 8 | `{ field: "method" }` | Missing method |
| `INVALID_VERIFICATION_METHOD` | Normalized method is empty, malformed, controlled, or exceeds its UTF-8 bound | 8 | `{ field: "method" }` | Method normalization and bounds |
| `MISSING_VERIFICATION_JUDGMENT` | `judgment` is absent or undefined | 9 | `{ field: "judgment" }` | Missing judgment |
| `INVALID_VERIFICATION_JUDGMENT` | Judgment is not `confirmed`, `refuted`, or `inconclusive` | 9 | `{ field: "judgment" }` | Unsupported strings and booleans |
| `MISSING_VERIFICATION_TIMESTAMP` | `verifiedAt` is absent or undefined | 10 | `{ field: "verifiedAt" }` | Missing time |
| `INVALID_VERIFICATION_TIMESTAMP` | Verification time violates the governed timestamp grammar or precision | 10 | `{ field: "verifiedAt" }` | Invalid, ambiguous, and over-precision times |
| `VERIFICATION_PRECEDES_OBSERVATION` | Canonical verification instant is before `ObservedOutcome.observedAt` | 11 | `{ field: "verifiedAt" }` | Before, equal, and after boundaries |
| `VERIFICATION_PRECEDES_EVIDENCE` | Canonical verification instant is before any evaluated Evidence `createdAt` | 12 | `{ field: "verifiedAt", index: "<index>" }` | Before, equal, and after each Evidence time |
| `MISSING_VERIFICATION_LIMITATIONS` | `limitations` is absent or undefined | 13 | `{ field: "limitations" }` | Missing collection |
| `INVALID_VERIFICATION_LIMITATIONS` | Limitations input is not an array | 13 | `{ field: "limitations" }` | Invalid collection shapes |
| `INVALID_VERIFICATION_LIMITATION` | A limitation is non-string, empty after normalization, malformed, controlled, or exceeds its UTF-8 bound | 14 | `{ field: "limitations", index: "<index>" }` | Invalid limitation at each position |
| `DUPLICATE_VERIFICATION_LIMITATION` | Two limitations normalize to equal canonical text | 15 | `{ field: "limitations", index: "<index>" }` | Exact and normalization-equivalent duplicates |
| `INVALID_VERIFIER_ID` | Supplied verifier identity is not a canonical `Identifier` | 16 | `{ field: "verifierId" }` | Invalid optional identity |
| `INVALID_VERIFICATION_NOTES` | Supplied notes are non-string, empty after normalization, malformed, controlled, or exceed their UTF-8 bound | 17 | `{ field: "notes" }` | Invalid optional notes |
| `INVALID_VERIFICATION_CONFIDENCE` | Supplied confidence is null, non-object, an array, or contains unsupported fields | 18 | `{ field: "confidence" }` | Invalid confidence shapes |
| `INVALID_CONFIDENCE_CALIBRATION_STATUS` | Calibration status is not `uncalibrated` or `calibrated` | 19 | `{ field: "confidence.calibrationStatus" }` | Missing and unsupported discriminators |
| `INVALID_CONFIDENCE_VALUE` | Confidence value is not a canonical `Percentage` | 20 | `{ field: "confidence.value" }` | Invalid confidence values |
| `MISSING_CONFIDENCE_BASIS` | Confidence is supplied but `basis` is absent or undefined | 21 | `{ field: "confidence.basis" }` | Missing basis |
| `INVALID_CONFIDENCE_BASIS` | Normalized basis is empty, malformed, controlled, or exceeds its UTF-8 bound | 21 | `{ field: "confidence.basis" }` | Basis normalization and bounds |
| `MISSING_CALIBRATION_RECORD_ID` | Calibrated confidence lacks `calibrationRecordId` | 22 | `{ field: "confidence.calibrationRecordId" }` | Missing calibrated authority |
| `UNEXPECTED_CALIBRATION_RECORD_ID` | Uncalibrated confidence supplies `calibrationRecordId` | 22 | `{ field: "confidence.calibrationRecordId" }` | Prohibited uncalibrated authority |
| `INVALID_CALIBRATION_RECORD_ID` | Required calibration-record identity is not a canonical `Identifier` | 23 | `{ field: "confidence.calibrationRecordId" }` | Invalid calibrated identity |
| `VERIFICATION_IDENTITY_DERIVATION_FAILED` | Governed SHA-256 operation rejects or produces an invalid digest | 24 | `{ operation: "SHA-256" }` | Rejected digest operation |
| `VERIFICATION_SERIALIZATION_FAILED` | Fixed-order canonical projection cannot be serialized | 25 | `{ operation: "canonical-json" }` | Rejected serialization operation |

For collection failures, `index` shall be represented as a base-10 string.

Evidence validation shall use original caller index values for diagnostics
before canonical sorting.

Limitation validation shall use original caller index values for diagnostics
before canonical sorting.

Within confidence validation, precedence shall be:

1. object shape;
2. calibration status;
3. confidence value;
4. basis presence and validity;
5. calibration-record presence or prohibition;
6. calibration-record identity.

The first invalid Evidence or limitation in caller order shall own the primary
failure before collection canonicalization occurs.
# Core Verification Engine Contract

The shared Core layer shall expose a pre-judgment request named:

`VerificationRequest`

`VerificationRequest` shall be a read-only structure containing exactly:

| Field | Type | Required | Responsibility |
|---|---|---:|---|
| `observedOutcome` | `ObservedOutcome` | Yes | Supplies the sole canonical subject |
| `evidence` | `readonly Evidence[]` | Yes | Supplies the canonical Evidence to evaluate |
| `method` | `string` | Yes | Selects the governed verification method |
| `verifierId` | `Identifier` | No | Identifies the responsible verifier when applicable |
| `notes` | `string` | No | Supplies bounded request context |

The canonical Core contract shall be:

    interface VerificationEngine
      extends Engine<VerificationRequest, Verification> {}

The request shall not contain:

- Organization identity resupplied separately;
- an open subject type;
- a loose subject identity;
- Evidence identities without canonical Evidence objects;
- a caller-provided judgment;
- a caller-provided confidence result;
- a caller-provided verification identity;
- a caller-provided verification timestamp;
- processing-success booleans.

The engine shall determine, through its governed method:

- the canonical Verification judgment;
- the limitations of that judgment;
- confidence and calibration status when represented.

The engine shall construct the completed result through the canonical Domain
Verification factory.

# Engine Context Rules

`EngineContext.organizationId` shall equal the Organization of:

- the canonical `ObservedOutcome`; and
- every evaluated Evidence record.

An Organization mismatch shall produce a failed `EngineResult` and shall not
produce a partial Verification.

`EngineContext.executionTime` is an explicitly injected time authority.

A successful engine execution may supply its normalized value as
`VerificationCreateInput.verifiedAt`.

The engine shall not call the current wall clock independently.

The following `EngineContext` values shall not participate in canonical
Verification identity or serialization:

- `correlationId`;
- `initiatedBy`;
- engine duration;
- diagnostics;
- explanation.

`EngineContext.initiatedBy` identifies the initiator of engine processing.

It shall not silently become `verifierId`.

Verifier identity must remain explicit in `VerificationRequest` when
applicable.

# Processing Result Separation

`EngineResult.success` means that Verification processing completed and
produced a canonical `Verification`.

It does not mean that the Verification judgment is `confirmed`.

A successful `EngineResult` may contain a Verification whose judgment is:

- `confirmed`;
- `refuted`;
- `inconclusive`.

A failed `EngineResult` contains no Verification.

Processing diagnostics and explanations may describe:

- request rejection;
- unsupported method;
- Evidence incompatibility;
- engine failure;
- human-review requirements;
- infrastructure failure.

They shall not replace, override, or conceal a canonical Verification
judgment.

`EngineResult.durationMs` is operational telemetry.

It shall not participate in Domain identity, serialization, equality, or
evidentiary meaning.

# Legacy Core Disposition

The existing Core `VerificationInput` is a modernization source.

Compatible concepts include:

- request-before-result separation;
- method selection;
- Evidence input;
- optional verifier identity;
- optional notes;
- use of the shared `Engine` abstraction.

The canonical replacement shall remove:

- open legacy subject types;
- loose subject identity;
- separately supplied Organization identity;
- Evidence identities without canonical Evidence objects.

Migration shall preserve the existing request/result separation while
adopting `VerificationRequest` and the Capability 010 Domain contract.

This section does not independently authorize implementation or modification
of the existing Core file.

Any such change may proceed only within GM-0010's explicit bounded scope.
# Public API

The accepted minimum Domain public surface is:

- `Verification`;
- `VerificationId`;
- `VerificationCreateInput`;
- `VerificationJudgment`;
- `VerificationConfidence`;
- `VerificationError`;
- `VerificationFailureCode`; and
- `SerializedVerification`.

The accepted minimum Core public surface is:

- `VerificationRequest`; and
- `VerificationEngine`.

The following shall remain private implementation details:

- normalization helpers;
- timestamp parsers;
- UTF-8 comparators;
- Evidence ordering helpers;
- limitation ordering helpers;
- projection validators;
- identity-component builders;
- hashing helpers;
- serialization helpers;
- defensive-copy helpers;
- failure-precedence helpers.

No public builder, mutable draft, unrestricted metadata map, generic claim
type, or alternate Verification result type is authorized.

# Domain Dependency Rules

The future Domain implementation shall:

- reside in the existing domain package;
- use the namespace `packages/domain/src/verification/`;
- consume canonical `ObservedOutcome`;
- consume canonical `Evidence`;
- use existing `Entity`, `Identifier`, and `Percentage` abstractions;
- use Web Crypto only for governed SHA-256 identity derivation;
- preserve the existing package dependency direction;
- introduce no dependency on Core;
- introduce no dependency on Validation;
- introduce no infrastructure, persistence, networking, adapter, UI,
  analytics, AI-provider, workflow, or learning dependency;
- introduce no circular or reverse dependency.

The Domain implementation shall not call Evidence construction policies or
Evidence identity factories.

It shall rely on the canonical Evidence identities already exposed by the
supplied Evidence objects.

# Core Dependency Rules

The future Core contract shall:

- remain under `packages/core/src/verification/`;
- depend on the public Domain Verification contract;
- depend on the existing shared `Engine` abstraction;
- consume canonical `ObservedOutcome` and Evidence objects;
- preserve request-before-result separation;
- return `EngineResult<Verification>`;
- introduce no persistence, transport, UI, dashboard, workforce, or learning
  dependency;
- introduce no alternate canonical Verification artifact;
- introduce no direct wall-clock dependency;
- introduce no circular dependency.

A concrete Verification engine implementation may depend on separately
authorized governed verification methods.

This specification does not authorize any concrete method implementation.

# Package and Export Compatibility

The current Domain root exports both:

- `execution/index.ts`; and
- `intelligence/index.ts`.

The legacy Verification remains exported from the intelligence namespace.

Capability 010 shall not create two public classes named `Verification` in the
same Domain root export surface.

Implementation planning must resolve the export collision before introducing
the canonical replacement.

Permitted migration strategies include:

- moving and replacing the legacy export in one bounded change;
- retaining a temporary explicitly renamed legacy compatibility export; or
- introducing an internal adapter that does not create a second canonical
  public type.

The selected strategy must:

- preserve one canonical public `Verification`;
- prevent ambiguous root exports;
- preserve source compatibility where justified;
- document any temporary compatibility name;
- include regression tests;
- avoid a permanent duplicate authority.

This specification does not select or authorize the migration strategy.

GM-0010 must authorize the exact bounded strategy before implementation.
# Normative Requirements

## Ownership and Construction

- **DV-REQ-001:** `Verification` shall be the sole canonical Domain artifact
  for one evidentiary judgment concerning exactly one canonical
  `ObservedOutcome`.
- **DV-REQ-002:** The canonical subject type shall be fixed as
  `observed_outcome`.
- **DV-REQ-003:** Construction shall consume exactly one canonical
  `ObservedOutcome` and one bounded non-empty collection of canonical Evidence
  records.
- **DV-REQ-004:** Construction shall use `VerificationCreateInput`, an
  asynchronous static factory, a private constructor, and inherited
  `Entity.id`.
- **DV-REQ-005:** No caller-supplied Verification identity shall be accepted.
- **DV-REQ-006:** Organization identity, ObservedOutcome identity, and Evidence
  identities shall be projected from canonical upstream artifacts and shall
  not be resupplied through caller side channels.
- **DV-REQ-007:** No partially constructed Verification shall escape after
  validation failure.
- **DV-REQ-008:** The Domain artifact shall not create Evidence,
  `ObservedOutcome`, execution records, Outcome Evaluation, causal attribution,
  recommendations, or Learning.
- **DV-REQ-009:** Domain ownership shall remain under
  `packages/domain/src/verification/`.
- **DV-REQ-010:** The shared Core request and engine contract shall remain
  under `packages/core/src/verification/`.

## Subject and Evidence Lineage

- **DV-REQ-011:** One Verification shall reference exactly one canonical
  `ObservedOutcome`.
- **DV-REQ-012:** The canonical `ObservedOutcome` identity shall be preserved
  exactly.
- **DV-REQ-013:** Organization identity shall be derived from the canonical
  `ObservedOutcome` and preserved exactly.
- **DV-REQ-014:** The Evidence collection shall contain at least one and at
  most 128 canonical Evidence records.
- **DV-REQ-015:** Every Evidence record shall belong to the same Organization
  as the canonical `ObservedOutcome`.
- **DV-REQ-016:** Every Evidence record shall expose a canonical identity.
- **DV-REQ-017:** Duplicate canonical Evidence identities shall be rejected.
- **DV-REQ-018:** Evidence identities shall be canonically ordered by
  NFC-normalized UTF-8 byte ordering after item validation.
- **DV-REQ-019:** Caller Evidence order shall not affect Verification
  identity, serialization, equality, or successful semantic state.
- **DV-REQ-020:** Evidence identities shall participate in Verification
  identity without redundantly hashing Evidence internals.
- **DV-REQ-021:** Verification construction shall not fetch, infer, combine,
  mutate, reinterpret, or recalculate canonical Evidence.
- **DV-REQ-022:** The Verification shall preserve enough explicit Evidence
  lineage to resolve every evaluated Evidence record.

## Judgment and Method

- **DV-REQ-023:** `VerificationJudgment` shall be the closed union
  `confirmed`, `refuted`, and `inconclusive`.
- **DV-REQ-024:** Workflow states, processing states, booleans, and dashboard
  statuses shall not become canonical Verification judgments.
- **DV-REQ-025:** `EngineResult.success` shall represent processing success
  only and shall not imply a `confirmed` judgment.
- **DV-REQ-026:** A successful Verification engine execution may produce any
  of the three canonical judgments.
- **DV-REQ-027:** The Domain construction input shall contain the completed
  canonical judgment.
- **DV-REQ-028:** The Core `VerificationRequest` shall not contain a
  caller-provided judgment.
- **DV-REQ-029:** Verification method shall be explicit, normalized,
  non-empty, and limited to 128 UTF-8 bytes.
- **DV-REQ-030:** Method text shall identify the governed verification method
  and shall not encode unrestricted metadata or executable content.

## Time, Limitations, and Notes

- **DV-REQ-031:** Verification time shall be supplied explicitly without a
  hidden current-clock lookup.
- **DV-REQ-032:** Accepted verification timestamps shall include explicit UTC
  or numeric offset and governed precision.
- **DV-REQ-033:** Verification timestamps shall normalize to UTC with exactly
  millisecond precision before identity or comparison.
- **DV-REQ-034:** Verification time before `ObservedOutcome.observedAt` shall
  be rejected; equality at the same millisecond shall be accepted.
- **DV-REQ-035:** Verification time before any evaluated Evidence `createdAt`
  shall be rejected; equality at the same millisecond shall be accepted.
- **DV-REQ-036:** Temporal admissibility shall not imply causality or business
  success.
- **DV-REQ-037:** Limitations shall be supplied as an explicit collection
  containing zero through 64 entries.
- **DV-REQ-038:** Each limitation shall be normalized, non-empty, bounded to
  1,024 UTF-8 bytes, and treated as explanatory prose.
- **DV-REQ-039:** Duplicate normalized limitations shall be rejected.
- **DV-REQ-040:** Limitations shall use canonical NFC-normalized UTF-8 byte
  ordering after item validation.
- **DV-REQ-041:** An empty limitations collection shall explicitly mean that
  no known limitation was identified.
- **DV-REQ-042:** Notes shall be optional, normalized, non-empty when supplied,
  bounded to 4,096 UTF-8 bytes, and prohibited from acting as unrestricted
  metadata.
## Confidence and Calibration

- **DV-REQ-043:** Numerical confidence shall be optional.
- **DV-REQ-044:** Absence of confidence shall mean that the Verification makes
  no numerical confidence claim.
- **DV-REQ-045:** Supplied confidence shall use the closed
  `VerificationConfidence` discriminated union.
- **DV-REQ-046:** Confidence value shall be a canonical `Percentage` expressed
  through integer basis points.
- **DV-REQ-047:** Calibration status shall be exactly `uncalibrated` or
  `calibrated`.
- **DV-REQ-048:** Confidence basis shall be required whenever confidence is
  supplied, normalized, non-empty, and bounded to 1,024 UTF-8 bytes.
- **DV-REQ-049:** Uncalibrated confidence shall prohibit a
  `calibrationRecordId`.
- **DV-REQ-050:** Calibrated confidence shall require a canonical
  `calibrationRecordId`.
- **DV-REQ-051:** A numerical value shall not be described or represented as
  calibrated without the required calibration authority.
- **DV-REQ-052:** Calibration status, basis points, confidence basis, and
  calibration-record presence or omission shall participate in identity and
  serialization.
- **DV-REQ-053:** The Domain constructor shall not generate confidence,
  calibration status, confidence basis, or calibration authority
  automatically.
- **DV-REQ-054:** Capability 010 shall validate the declared confidence
  structure but shall not claim to validate the scientific adequacy of an
  external calibration authority.

## Determinism and Serialization

- **DV-REQ-055:** Verification identity shall use deterministic, versioned
  SHA-256 with prefix `verification:v1:`.
- **DV-REQ-056:** Identity shall use the exact normative component order and
  unambiguous UTF-8 byte-length framing declared in this specification.
- **DV-REQ-057:** Identity shall include the canonical `ObservedOutcome`
  identity once and shall not redundantly hash its internal lineage.
- **DV-REQ-058:** Identity shall include the canonically ordered Evidence
  identities and shall not redundantly hash Evidence internals.
- **DV-REQ-059:** Identity shall include every Verification-owned canonical
  semantic field, including judgment, method, time, limitations, and optional
  confidence state.
- **DV-REQ-060:** Optional verifier, notes, confidence, and
  calibration-record identity shall use the declared deterministic omission
  markers.
- **DV-REQ-061:** Identity shall exclude randomness, hidden clocks, process
  state, locale, environment state, object identity, persistence identity,
  correlation identity, diagnostics, explanations, duration, and external
  I/O.
- **DV-REQ-062:** Equivalent normalized semantic inputs shall produce equal
  Verification identities.
- **DV-REQ-063:** Any meaningful canonical semantic change shall produce a
  different Verification identity.
- **DV-REQ-064:** Canonical serialization shall use the exact declared
  top-level and nested field orders.
- **DV-REQ-065:** Optional serialized fields shall be omitted and shall never
  be represented as `null`.
- **DV-REQ-066:** Evidence identities and limitations shall retain canonical
  ordering in serialization.
- **DV-REQ-067:** Canonical JSON strings and normalized Unicode shall follow
  the declared RFC 8259 rules.
- **DV-REQ-068:** Canonical serialization shall be byte-stable across repeated
  calls, caller collection order, caller property insertion order, locale,
  timezone, process, machine, and supported host.
- **DV-REQ-069:** Identity-derivation or serialization failure shall produce
  its exact governed Verification failure code.
## Integrity and Errors

- **DV-REQ-070:** The Verification entity and every nested collection or value
  shall be deeply immutable.
- **DV-REQ-071:** Construction inputs and all projected upstream values shall
  be defensively copied where mutation could otherwise affect canonical state.
- **DV-REQ-072:** Returned collections, serialized projections, and confidence
  values shall not permit mutation of internal state.
- **DV-REQ-073:** Verification equality shall use only canonical
  `VerificationId`.
- **DV-REQ-074:** Equality shall be reflexive, symmetric, transitive, and
  deterministic.
- **DV-REQ-075:** `VerificationFailureCode` shall contain exactly the closed
  failure vocabulary declared in this specification.
- **DV-REQ-076:** Every failure code shall use its exact trigger, precedence
  stage, stable detail shape, and planned verification case from the failure
  matrix.
- **DV-REQ-077:** Validation shall apply the declared deterministic
  first-failure precedence and shall not depend on object-property order,
  collection-library behavior, or incidental downstream exceptions.
- **DV-REQ-078:** Evidence-item and limitation-item diagnostics shall preserve
  the original caller index before canonical sorting.
- **DV-REQ-079:** Collection diagnostic indexes shall be emitted as base-10
  strings.
- **DV-REQ-080:** Within confidence validation, precedence shall be object
  shape, calibration status, value, basis, calibration-record presence or
  prohibition, and calibration-record identity.
- **DV-REQ-081:** Normalization shall occur only within the validation stage
  that owns the affected field.
- **DV-REQ-082:** Verification errors, error details, and all nested error
  state shall be stable and deeply immutable.
- **DV-REQ-083:** A failed Domain construction shall produce no Verification
  identity, serialization, or partial semantic state.

## Core Engine Boundary

- **DV-REQ-084:** The Core pre-judgment request shall be named
  `VerificationRequest`.
- **DV-REQ-085:** `VerificationRequest` shall contain exactly the governed
  `ObservedOutcome`, Evidence collection, method, optional verifier identity,
  and optional notes.
- **DV-REQ-086:** The Core request shall not accept separately supplied
  Organization identity, open subject type, loose subject identity, Evidence
  identities without Evidence objects, judgment, confidence result,
  Verification identity, or Verification timestamp.
- **DV-REQ-087:** The canonical Core engine contract shall extend
  `Engine<VerificationRequest, Verification>`.
- **DV-REQ-088:** `EngineContext.organizationId` shall equal the Organization
  of the `ObservedOutcome` and every evaluated Evidence record.
- **DV-REQ-089:** Core Organization mismatch shall produce a failed
  `EngineResult` with no partial Verification.
- **DV-REQ-090:** A successful engine may use the explicitly injected
  `EngineContext.executionTime` as `VerificationCreateInput.verifiedAt`.
- **DV-REQ-091:** The engine shall not perform an independent current-clock
  lookup.
- **DV-REQ-092:** `EngineContext.initiatedBy` shall not silently become
  `verifierId`.
- **DV-REQ-093:** Correlation identity, initiator identity, duration,
  diagnostics, and explanation shall remain operational metadata and shall
  not participate in canonical Verification identity or serialization.
- **DV-REQ-094:** A failed `EngineResult` shall contain no Verification; a
  successful result shall contain exactly one canonical Verification.
- **DV-REQ-095:** Processing diagnostics and explanations shall not replace,
  override, or conceal the canonical Verification judgment.
- **DV-REQ-096:** `EngineResult.durationMs` shall not affect Domain identity,
  serialization, equality, confidence, or evidentiary meaning.
- **DV-REQ-097:** Concrete verification methods require separate governance
  authorization and are not authorized by this specification.

## Architecture and Compatibility

- **DV-REQ-098:** Only the approved minimum Domain and Core public surfaces
  shall be exported.
- **DV-REQ-099:** Normalization, ordering, projection, hashing, serialization,
  copying, and precedence helpers shall remain private.
- **DV-REQ-100:** Capability 010 shall introduce no public builder, mutable
  draft, unrestricted metadata map, generic claim type, alternate canonical
  Verification result, or new top-level platform subsystem.
- **DV-REQ-101:** The Domain implementation shall introduce no dependency on
  Core, Validation, persistence, infrastructure, transport, networking, UI,
  analytics, AI providers, workflow, Learning, or external I/O.
- **DV-REQ-102:** The Core contract shall introduce no persistence, transport,
  UI, dashboard, workforce, Learning, alternate Verification artifact, or
  direct wall-clock dependency.
- **DV-REQ-103:** No circular, reverse, or duplicate-authority dependency shall
  be introduced.
- **DV-REQ-104:** Existing `ObservedOutcome`, `ExecutionEvent`,
  `RuntimeAdmission`, `ExecutionPlan`, and canonical Evidence identity
  contracts shall remain unchanged.
- **DV-REQ-105:** Verification shall consume canonical Evidence identities
  already exposed by Evidence objects and shall not invoke Evidence factories
  or Evidence identity policies.
- **DV-REQ-106:** The legacy Domain Verification and Core
  `VerificationInput` shall remain modernization sources rather than parallel
  canonical authorities.
- **DV-REQ-107:** Implementation shall expose exactly one canonical public
  Domain class named `Verification`.
- **DV-REQ-108:** Any temporary compatibility export shall be explicitly
  renamed, documented, regression-tested, and prohibited from becoming a
  permanent duplicate authority.
- **DV-REQ-109:** The exact legacy-export migration strategy requires separate
  GM-0010 authorization before implementation.
- **DV-REQ-110:** Outcome Evaluation and Learning shall remain downstream and
  shall consume immutable Verification without mutating it or adding
  evaluation state to it.
# Future Test Contract

Future implementation verification shall cover:

- valid Domain construction for all three canonical judgments;
- valid construction with absent, uncalibrated, and calibrated confidence;
- canonical `ObservedOutcome` and Evidence lineage preservation;
- Evidence collection minimum, maximum, ordering, duplication, and
  Organization rules;
- method, limitation, notes, and confidence-basis normalization and byte
  bounds;
- empty limitations semantics;
- timestamp normalization and both temporal rejection boundaries;
- explicit same-millisecond equality acceptance;
- every governed failure code;
- precedence-sensitive combinations containing multiple invalid fields;
- original caller-index diagnostics before collection sorting;
- deterministic confidence-validation precedence;
- deterministic fixed identity vectors;
- canonical serialization byte vectors;
- equivalent-input replay;
- meaningful-input differentiation;
- Evidence-order and limitation-order independence;
- locale, timezone, property-order, process, machine, and supported-host
  independence;
- optional-field omission and prohibition of serialized `null`;
- source-input and returned-value mutation resistance;
- deep immutability;
- equality laws;
- Core request/result separation;
- processing success versus evidentiary judgment separation;
- explicit `EngineContext.executionTime` use;
- Organization mismatch rejection by the Core boundary;
- prohibition against silently deriving verifier identity from `initiatedBy`;
- public exports and private-helper exclusion;
- exactly one canonical public Domain `Verification`;
- authorized legacy-export migration behavior;
- dependency and architectural exclusions;
- regression protection for `ObservedOutcome`, `ExecutionEvent`,
  `RuntimeAdmission`, `ExecutionPlan`, canonical Evidence identity, and the
  Execution and Observation Baseline v1.0.0; and
- workspace typecheck, build, tests, formatting, and repository integrity.

Every normative requirement shall map to a test or documented static
verification in VVR-0010.

The validation record shall identify:

- the requirement identifier;
- the verification mechanism;
- the test or inspection location;
- the observed result;
- any exception or unresolved risk; and
- the final acceptance disposition.

# Compatibility

The accepted contract preserves the established downstream sequence:

`ExecutionEvent → ObservedOutcome → Verification → Outcome Evaluation → Learning`

It shall not modify the canonical behavior, identity, serialization, or public
contracts of:

- `ExecutionPlan`;
- `RuntimeAdmission`;
- `ExecutionEvent`;
- `ObservedOutcome`; or
- canonical Evidence identity.

Capability 010 is not purely additive because a legacy public
`Verification` already exists.

Compatibility therefore requires one bounded, explicitly authorized migration
that establishes exactly one canonical public Domain `Verification`.

The migration shall not:

- create a second canonical Verification authority;
- silently alias incompatible legacy semantics;
- expose ambiguous root exports;
- modify upstream baseline artifacts;
- introduce Outcome Evaluation or Learning behavior; or
- authorize a concrete verification method implicitly.

Any temporary legacy compatibility surface shall be:

- explicitly renamed;
- documented as non-canonical;
- regression-tested;
- time-bounded by a documented removal condition; and
- approved within GM-0010.

# Acceptance Criteria

This specification may be accepted only when:

1. ADR-0019 is accepted;
2. Verification remains distinct from Evidence, observation, Outcome
   Evaluation, causation, recommendation, and Learning;
3. the canonical subject remains exactly one immutable `ObservedOutcome`;
4. all Evidence lineage, Organization, collection, ordering, and temporal
   rules are implementation-ready;
5. judgment and processing-success semantics remain distinct;
6. numerical confidence cannot be represented as calibrated without explicit
   calibration authority;
7. identity, serialization, immutability, equality, failure precedence, and
   failure-code behavior are implementation-ready;
8. the Domain and Core contracts have no unresolved naming or ownership
   ambiguity;
9. the exact legacy-export migration strategy is selected;
10. compatibility with the Execution and Observation Baseline v1.0.0 is
    confirmed;
11. every normative requirement has a planned verification mechanism;
12. an architecture review finds no unresolved material ambiguity; and
13. implementation authorization is recorded separately through GM-0010.

# Status and Authorization

This specification is Accepted.

Implementation is authorized only within GM-0010's explicit scope.

Acceptance of this specification shall not independently authorize:

- modification of the legacy Verification implementation;
- modification of the existing Core `VerificationInput`;
- creation of concrete verification methods;
- creation of Outcome Evaluation;
- creation of Learning behavior;
- persistence or transport integration;
- dashboard or workforce integration;
- numerical calibration methodology;
- staging; or
- production promotion.

Implementation may proceed only within GM-0010's exact bounded implementation
and migration scope.

The bounded implementation and migration are complete and verified PASS by
VVR-0010. Implementation and verification may consume canonical verified
`ObservedOutcome` and Evidence contracts. Operational use requires every
applicable upstream release, admissibility, and runtime-governance boundary to
be satisfied.

Capability 010 is verified but not released because no tracked accepted
Release Record exists. This specification, ADR-0019, GM-0010, VVR-0010, tests,
builds, staging, merge, and commit confer no release, deployment, production,
or runtime authority.
