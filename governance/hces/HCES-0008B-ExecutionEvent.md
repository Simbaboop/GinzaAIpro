# HCES-0008B — ExecutionEvent

## Human-Centered Engineering Specification

---

## 0. Document Control

| Field | Value |
|---|---|
| Specification ID | HCES-0008B |
| Title | ExecutionEvent |
| Version | 1.0.0 |
| Status | Accepted |
| Capability | 008B |
| Governing Decision | ADR-0010 — Immutable Execution Event Architecture |
| Upstream Contract | Canonical verified `RuntimeAdmission` Version 1.0.0 |
| Upstream Specification | HCES-0008A — RuntimeAdmission |
| Governance Standards | CGS-0001; CGS-0004; CGS-0005 |
| Canonical Owner | `@ginzaaipro/domain` |

# 1. Purpose

`ExecutionEvent` is the immutable, deterministic, infrastructure-independent
record that one admitted work package was executed at an explicit instant.

**EE-REQ-001:** `ExecutionEvent` SHALL occupy the following canonical position:

```text
ExecutionPlan
      │
RuntimeAdmission
      │
ExecutionEvent
      │
ObservedOutcome
```

**EE-REQ-002:** `ExecutionEvent` SHALL record execution facts only.

**EE-REQ-003:** `ObservedOutcome` SHALL remain a separate future capability and
the sole owner of real-world outcome determination.

# 2. Governing Question

What immutable execution fact occurred for a work package admitted by exactly
one canonical `RuntimeAdmission`?

# 3. Scope

This specification defines:

- domain ownership;
- construction input;
- canonical fields;
- deterministic identity;
- validation and deterministic failure precedence;
- canonical serialization;
- deep immutability;
- semantic equality;
- the minimum public API;
- dependency rules;
- normative verification requirements.

**EE-REQ-004:** Version 1 SHALL model exactly one atomic execution fact:
`EXECUTION_OCCURRED` for exactly one admitted work package at one canonical
instant.

The atomic fact asserts occurrence only. It does not assert that execution
succeeded, failed, completed a business objective, produced evidence, or caused
an outcome.

# 4. Explicit Non-Goals

**EE-REQ-005:** `ExecutionEvent` SHALL contain no behavior for:

- executing work;
- scheduling;
- queues;
- retries;
- orchestration;
- persistence;
- networking;
- agent control;
- settlement;
- compensation;
- evidence evaluation;
- business-outcome evaluation;
- recommendation-quality evaluation.

**EE-REQ-006:** Version 1 SHALL NOT contain mutable progress, workflow, task,
retry, completion, success, failure, settlement, or compensation state.

# 5. Domain Ownership

**EE-REQ-007:** `@ginzaaipro/domain` SHALL own the canonical `ExecutionEvent`
contract, its identity, validation, serialization, immutability, and failure
model.

**EE-REQ-008:** `ExecutionEvent` SHALL own only the immutable facts that an
admitted execution occurred.

Authorization belongs to `RuntimeAdmission`. Planning belongs to
`ExecutionPlan`. Runtime control belongs to a future execution capability.
Business results belong to `ObservedOutcome`.

# 6. Upstream Dependency and Construction Boundary

## 6.1 Chosen construction model

Construction accepts the canonical `RuntimeAdmission` object itself.

```ts
export type ExecutionEventInput = Readonly<{
  runtimeAdmission: RuntimeAdmission;
  workPackageId: Identifier;
  occurredAt: string;
  eventProvenance: ExecutionEventProvenance;
}>;
```

**EE-REQ-009:** Construction SHALL accept exactly one canonical
`RuntimeAdmission` object and SHALL NOT accept separately supplied admission,
plan, organization, trace, planning-policy, planning-rule, or schema identity.

**EE-REQ-010:** The constructor SHALL require a valid canonical
`RuntimeAdmission` instance whose decision is `ADMITTED`.

**EE-REQ-011:** The constructor SHALL use the upstream object as an invariant
boundary and SHALL NOT duplicate its complete validation algorithm.

**EE-REQ-012:** The created `ExecutionEvent` SHALL retain a defensive immutable
projection of required upstream values and SHALL NOT retain or embed the
`RuntimeAdmission` object.

This design is the minimum-complexity option because it:

- reuses the canonical verified upstream invariant boundary;
- prevents side-channel identity inputs;
- validates work-package membership without repository access;
- avoids an embedded domain object graph;
- avoids a second public admission-projection contract.

## 6.2 Work-package selection

**EE-REQ-013:** `workPackageId` SHALL identify exactly one member of
`runtimeAdmission.admittedWorkPackages`.

**EE-REQ-014:** No event SHALL be created for a work package absent from the
referenced admission.

The selected work package is projected with its canonical recommendation and
trace sets. No lookup of `ExecutionPlan` is permitted.

# 7. Execution Fact Boundary

The complete version 1 execution fact is:

> The selected work package in the referenced RuntimeAdmission experienced an
> execution occurrence at occurredAt, recorded by eventProvenance.

**EE-REQ-015:** `eventType` SHALL be the constant
`"EXECUTION_OCCURRED"` and SHALL NOT be caller-supplied.

**EE-REQ-016:** The event SHALL make no claim about completion, success,
failure, quality, business impact, or observed outcome.

**EE-REQ-017:** Version 1 SHALL expose no generic metadata, arbitrary key-value
bag, executable callback, or untyped fact payload.

Additional execution fact kinds require a versioned specification revision.
They cannot be introduced through metadata.

# 8. Canonical Contracts

## 8.1 Identity

```ts
export type ExecutionEventId = Identifier;
```

## 8.2 Event provenance

```ts
export type ExecutionEventProvenance = Readonly<{
  recorderType:
    | "HUMAN"
    | "SYSTEM"
    | "SERVICE"
    | "GOVERNED_AUTOMATION";
  recorderId: string;
}>;
```

`eventProvenance` identifies who or what recorded the occurrence. It does not
assert who performed the work and does not authorize execution.

**EE-REQ-018:** `recorderType` SHALL be one of the four closed values defined
above.

**EE-REQ-019:** `recorderId` SHALL be Unicode NFC, contain no leading or
trailing whitespace, contain at least one character, and contain at most 256
UTF-8 bytes.

## 8.3 Serialized representation

```ts
export type SerializedExecutionEvent = Readonly<{
  executionEventId: string;
  eventType: "EXECUTION_OCCURRED";
  runtimeAdmissionId: string;
  executionPlanId: string;
  organizationId: string;
  workPackageId: string;
  recommendationIds: readonly string[];
  traceIds: readonly string[];
  planningRuleProvenance: readonly Readonly<{
    ruleId: string;
    ruleVersion: string;
  }>[];
  planningPolicyProvenance: Readonly<{
    planningPolicyId: string;
    planningPolicyVersion: string;
  }>;
  executionPlanSchemaVersion: string;
  runtimeAdmissionSchemaVersion: "runtime-admission:v1";
  admissionProvenance: RuntimeAdmissionProvenance;
  eventProvenance: ExecutionEventProvenance;
  occurredAt: string;
  version: "1.0.0";
  schemaVersion: "execution-event:v1";
}>;
```

# 9. Required Field Definitions

| Field | Type | Meaning and source | Validation and canonical representation | Identity participation |
|---|---|---|---|---|
| `executionEventId` | `ExecutionEventId` | Canonical event identity generated by `ExecutionEvent` | `Identifier` with the `execution-event:v1:` prefix and a lowercase SHA-256 digest | Generated result |
| `eventType` | `"EXECUTION_OCCURRED"` | Identifies the single version 1 fact kind | Fixed literal; never supplied by caller | Direct |
| `runtimeAdmissionId` | `RuntimeAdmissionId` | Identity of the sole upstream admission | Copied exactly from `RuntimeAdmission.runtimeAdmissionId` | Direct |
| `executionPlanId` | `Identifier` | Identity of the admitted plan | Copied exactly from `RuntimeAdmission.executionPlanId` | Direct |
| `organizationId` | `Identifier` | Canonical organization boundary | Copied exactly from `RuntimeAdmission.organizationId` | Direct |
| `workPackageId` | `Identifier` | Selected admitted work package | Must match exactly one admitted work package; copied exactly | Direct |
| `recommendationIds` | `readonly Identifier[]` | Recommendation lineage of the selected work package | Exact canonical selected-work-package set; non-empty, duplicate-free, ordinally sorted, defensively copied and frozen | Direct |
| `traceIds` | `readonly Identifier[]` | TraceSet of the selected work package | Exact canonical selected-work-package set; non-empty, duplicate-free, ordinally sorted, defensively copied and frozen | Direct |
| `planningRuleProvenance` | `readonly ExecutionPlanRuleProvenance[]` | Released planning rules preserved by the admission | Exact admission projection; canonical upstream order, defensively copied and deeply frozen | Direct |
| `planningPolicyProvenance` | immutable `{ planningPolicyId, planningPolicyVersion }` | PlanningPolicy identity preserved by the admission | Exact admission projection; Unicode NFC strings in fixed field order, defensively copied and frozen | Direct |
| `executionPlanSchemaVersion` | `string` | Schema identity of the admitted `ExecutionPlan` | Copied exactly from the admission | Direct |
| `runtimeAdmissionSchemaVersion` | `"runtime-admission:v1"` | Schema identity of the upstream admission | Copied exactly from `RuntimeAdmission.schemaVersion` | Direct |
| `admissionProvenance` | `RuntimeAdmissionProvenance` | Admission policy and admission-schema provenance | Copied exactly from the admission in canonical field order; defensively copied and frozen | Direct |
| `eventProvenance` | `ExecutionEventProvenance` | Identity of the event recorder | Normalized and validated under §8.2; defensively copied and frozen | Direct |
| `occurredAt` | `string` | Explicit instant at which the execution occurrence was recorded | Valid offset date-time normalized to UTC ISO 8601 with millisecond precision | Direct |
| `version` | `"1.0.0"` | Public contract version | Fixed literal | Direct |
| `schemaVersion` | `"execution-event:v1"` | Canonical serialization and identity schema | Fixed literal | Direct |

**EE-REQ-020:** Every field in this table SHALL be required in the constructed
artifact and in its serialized representation.

**EE-REQ-021:** Runtime-admission, plan, organization, work-package, trace,
recommendation, planning-policy, planning-rule, and schema values SHALL be
preserved without semantic reinterpretation.

**EE-REQ-022:** Schema identity SHALL be represented by the explicit event,
admission, and plan schema-version fields; no ambiguous generic `schemaId`
field SHALL be added.

# 10. Temporal Semantics

## 10.1 Accepted input

`occurredAt` accepts an offset date-time string matching:

```text
YYYY-MM-DDTHH:mm:ss[.S|.SS|.SSS](Z|±HH:mm)
```

Calendar date, time, offset, and finite-instant validity are checked
deterministically. Leap seconds are not accepted.

## 10.2 Normalization

**EE-REQ-023:** A valid `occurredAt` SHALL be normalized to UTC using
`YYYY-MM-DDTHH:mm:ss.sssZ`.

**EE-REQ-024:** Construction SHALL reject leading or trailing whitespace,
missing timezone information, more than millisecond precision, invalid
calendar values, invalid offsets, and non-finite instants.

## 10.3 Admission ordering

**EE-REQ-025:** `occurredAt` SHALL be greater than or equal to
`RuntimeAdmission.admittedAt`.

Equal instants are permitted because the canonical timestamp resolution is one
millisecond. No system clock is consulted.

# 11. Invariants

**EE-REQ-026:** An `ExecutionEvent` SHALL NOT exist without exactly one valid
canonical `RuntimeAdmission`.

**EE-REQ-027:** `RuntimeAdmission` identity SHALL be preserved exactly.

**EE-REQ-028:** `ExecutionPlan` identity SHALL be preserved exactly.

**EE-REQ-029:** Organization identity SHALL be preserved exactly.

**EE-REQ-030:** Work-package identity SHALL be preserved exactly.

**EE-REQ-031:** The selected work package's recommendation set and TraceSet
SHALL be preserved exactly in canonical order.

**EE-REQ-032:** PlanningPolicy identity and planning-rule provenance SHALL be
preserved exactly.

**EE-REQ-033:** ExecutionPlan, RuntimeAdmission, and ExecutionEvent schema
identity SHALL be preserved explicitly.

**EE-REQ-034:** Admission and event provenance SHALL be preserved in canonical
field order.

**EE-REQ-035:** Invalid input SHALL fail before an `ExecutionEvent` object is
created.

**EE-REQ-036:** Construction SHALL NOT modify the supplied `RuntimeAdmission`
or any of its nested values.

# 12. Deterministic Identity

## 12.1 Identity scheme

**EE-REQ-037:** `ExecutionEventId` SHALL be derived as:

```text
execution-event:v1:<lowercase SHA-256 hexadecimal digest>
```

SHA-256 is required and uses the platform Web Crypto digest primitive already
established by the domain package. Hashing helpers remain private.

## 12.2 Identity material

Identity components are framed in this exact order:

1. `schemaVersion`;
2. `version`;
3. `eventType`;
4. `runtimeAdmissionId.value`;
5. `executionPlanId.value`;
6. `organizationId.value`;
7. `workPackageId.value`;
8. canonical JSON of `recommendationIds`;
9. canonical JSON of `traceIds`;
10. canonical JSON of `planningRuleProvenance`;
11. canonical JSON of `planningPolicyProvenance`;
12. `executionPlanSchemaVersion`;
13. `runtimeAdmissionSchemaVersion`;
14. canonical JSON of `admissionProvenance`;
15. canonical JSON of `eventProvenance`;
16. `occurredAt`.

**EE-REQ-038:** Each string component SHALL be Unicode NFC and framed as the
base-10 UTF-8 byte length, one colon, and the component value. Framed
components SHALL be concatenated without an additional delimiter.

**EE-REQ-039:** Collections and nested records used as identity components
SHALL use the canonical serialization rules in §13 before framing.

## 12.3 Included time

**EE-REQ-040:** Canonical `occurredAt` SHALL participate in identity because
distinct execution occurrences for the same admitted work package may occur at
different explicit instants.

Two otherwise equivalent inputs at the same canonical millisecond represent
the same semantic occurrence and therefore produce the same identity.

## 12.4 Excluded sources

**EE-REQ-041:** Identity derivation SHALL NOT use randomness, a generated UUID,
the system clock, process state, environment variables, persistence-generated
values, machine identity, locale, external I/O, or object insertion order.

## 12.5 Collision assumption

The architecture assumes practical collision resistance of SHA-256. A detected
digest collision is an integrity incident and is not resolved by random
identity regeneration.

**EE-REQ-042:** Implementations SHALL NOT add a random collision suffix or
silently replace an existing identity.

# 13. Canonical Serialization

## 13.1 Top-level field order

**EE-REQ-043:** Canonical JSON SHALL emit fields in this exact order:

1. `executionEventId`;
2. `eventType`;
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
13. `admissionProvenance`;
14. `eventProvenance`;
15. `occurredAt`;
16. `version`;
17. `schemaVersion`.

## 13.2 Nested field order

Nested fields use these exact orders:

```text
planningRuleProvenance item: ruleId, ruleVersion
planningPolicyProvenance: planningPolicyId, planningPolicyVersion
admissionProvenance: admissionPolicyId, admissionPolicyVersion, admissionSchemaVersion
eventProvenance: recorderType, recorderId
```

**EE-REQ-044:** `recommendationIds` and `traceIds` SHALL be duplicate-free and
ordinally sorted by identifier value.

**EE-REQ-045:** `planningRuleProvenance` SHALL be ordinally sorted by `ruleId`
and then `ruleVersion`.

## 13.3 JSON rules

**EE-REQ-046:** Canonical serialization SHALL use UTF-8 JSON with no
insignificant whitespace, no `undefined`, no `null`, no non-finite number, and
no omitted canonical field.

**EE-REQ-047:** All string values SHALL be Unicode NFC, and timestamp and
collection normalization SHALL occur before serialization.

**EE-REQ-048:** Canonical serialization SHALL be byte-equivalent across
processes, machines, locales, timezone environments, insertion orders, and
object reference identities.

## 13.4 Versioning

`schemaVersion` governs the serialized field set, ordering, normalization, and
identity framing.

**EE-REQ-049:** A serialization-shape or normalization change SHALL require a
new event schema version and governance review.

# 14. Semantic Equality

**EE-REQ-050:** Two `ExecutionEvent` instances SHALL be semantically equal when
their `ExecutionEventId` values are equal.

Because the deterministic identity includes all canonical semantic fields,
equivalent normalized inputs produce equal entities and byte-equivalent
serialization. Object reference identity is irrelevant.

**EE-REQ-051:** Equality SHALL use the domain `Entity` identity semantics and
SHALL NOT compare mutable references or caller insertion order.

# 15. Deep Immutability

**EE-REQ-052:** The created entity, every nested record, and every collection
SHALL be frozen.

**EE-REQ-053:** Mutable constructor inputs SHALL be defensively copied before
they are retained.

**EE-REQ-054:** Mutation of source input after construction SHALL NOT change
event state, identity, equality, or serialization.

**EE-REQ-055:** Returned collections and nested records SHALL NOT permit
mutation of internal state.

**EE-REQ-056:** Mutation of a value returned by `toJSON()` SHALL NOT change
internal state or a later serialization result.

**EE-REQ-057:** `ExecutionEvent` SHALL expose getters only and SHALL provide no
post-construction state transition.

# 16. Validation and Failure Model

## 16.1 Failure codes

```ts
export type ExecutionEventFailureCode =
  | "INVALID_EXECUTION_EVENT_INPUT"
  | "MISSING_RUNTIME_ADMISSION"
  | "INVALID_RUNTIME_ADMISSION"
  | "INVALID_RUNTIME_ADMISSION_PROJECTION"
  | "MISSING_WORK_PACKAGE_ID"
  | "INVALID_WORK_PACKAGE_ID"
  | "WORK_PACKAGE_NOT_ADMITTED"
  | "MISSING_EXECUTION_TIMESTAMP"
  | "INVALID_EXECUTION_TIMESTAMP"
  | "EXECUTION_PRECEDES_ADMISSION"
  | "MISSING_EVENT_PROVENANCE"
  | "INVALID_EVENT_PROVENANCE_TYPE"
  | "INVALID_EVENT_PROVENANCE_ID"
  | "EXECUTION_EVENT_IDENTITY_DERIVATION_FAILED"
  | "EXECUTION_EVENT_SERIALIZATION_FAILED";
```

| Code | Stable message | Trigger |
|---|---|---|
| `INVALID_EXECUTION_EVENT_INPUT` | `ExecutionEvent input must be a declarative record.` | Input is not a non-array object |
| `MISSING_RUNTIME_ADMISSION` | `ExecutionEvent requires one RuntimeAdmission.` | Admission is `null` or `undefined` |
| `INVALID_RUNTIME_ADMISSION` | `ExecutionEvent requires a canonical admitted RuntimeAdmission.` | Value is not a canonical `RuntimeAdmission` or is not `ADMITTED` |
| `INVALID_RUNTIME_ADMISSION_PROJECTION` | `RuntimeAdmission does not expose a valid canonical execution projection.` | A required canonical upstream value cannot be projected consistently |
| `MISSING_WORK_PACKAGE_ID` | `ExecutionEvent requires one admitted work-package identifier.` | Work-package identity is absent |
| `INVALID_WORK_PACKAGE_ID` | `ExecutionEvent work-package identity must be a valid Identifier.` | Value is not an `Identifier` |
| `WORK_PACKAGE_NOT_ADMITTED` | `ExecutionEvent work package is not present in the RuntimeAdmission.` | No admitted work package has the supplied identity |
| `MISSING_EXECUTION_TIMESTAMP` | `ExecutionEvent requires an explicit execution timestamp.` | Timestamp is absent |
| `INVALID_EXECUTION_TIMESTAMP` | `ExecutionEvent timestamp must be a valid offset date-time.` | Timestamp violates §10 |
| `EXECUTION_PRECEDES_ADMISSION` | `ExecutionEvent timestamp cannot precede RuntimeAdmission admission time.` | Canonical occurrence instant is earlier than canonical admission instant |
| `MISSING_EVENT_PROVENANCE` | `ExecutionEvent requires event provenance.` | Provenance is absent or not a record |
| `INVALID_EVENT_PROVENANCE_TYPE` | `ExecutionEvent recorder type is not supported.` | Recorder type is outside the closed taxonomy |
| `INVALID_EVENT_PROVENANCE_ID` | `ExecutionEvent recorder identity is invalid.` | Recorder ID violates §8.2 |
| `EXECUTION_EVENT_IDENTITY_DERIVATION_FAILED` | `ExecutionEvent identity derivation failed.` | SHA-256 identity cannot be produced |
| `EXECUTION_EVENT_SERIALIZATION_FAILED` | `ExecutionEvent canonical serialization failed.` | Canonical JSON cannot be produced |

**EE-REQ-058:** Every validation failure SHALL use exactly one stable
`ExecutionEventFailureCode` and its corresponding stable message.

**EE-REQ-059:** Generic catch-all validation codes SHALL NOT replace a more
specific listed code.

## 16.2 Deterministic precedence

When multiple defects exist, validation stops at the first applicable item in
this exact order:

1. `INVALID_EXECUTION_EVENT_INPUT`;
2. `MISSING_RUNTIME_ADMISSION`;
3. `INVALID_RUNTIME_ADMISSION`;
4. `INVALID_RUNTIME_ADMISSION_PROJECTION`;
5. `MISSING_WORK_PACKAGE_ID`;
6. `INVALID_WORK_PACKAGE_ID`;
7. `WORK_PACKAGE_NOT_ADMITTED`;
8. `MISSING_EXECUTION_TIMESTAMP`;
9. `INVALID_EXECUTION_TIMESTAMP`;
10. `EXECUTION_PRECEDES_ADMISSION`;
11. `MISSING_EVENT_PROVENANCE`;
12. `INVALID_EVENT_PROVENANCE_TYPE`;
13. `INVALID_EVENT_PROVENANCE_ID`;
14. `EXECUTION_EVENT_IDENTITY_DERIVATION_FAILED`;
15. `EXECUTION_EVENT_SERIALIZATION_FAILED`.

**EE-REQ-060:** Validation SHALL be fail-fast and SHALL follow this precedence
without aggregating, reordering, or silently repairing failures.

## 16.3 Error contract

```ts
export class ExecutionEventError extends Error {
  constructor(
    code: ExecutionEventFailureCode,
    message: string,
    details?: Readonly<
      Record<string, string | number | boolean | null>
    >,
  );

  get code(): ExecutionEventFailureCode;
  get details(): Readonly<
    Record<string, string | number | boolean | null>
  >;
}
```

**EE-REQ-061:** `ExecutionEventError.name` SHALL be
`"ExecutionEventError"`, and `code`, `message`, and `details` SHALL be
immutable.

**EE-REQ-062:** Error-detail keys SHALL be ordinally sorted; detail values
SHALL be scalar; and details SHALL contain no stack-dependent, locale-dependent,
object-reference, or nondeterministic data.

# 17. Construction Algorithm

Construction follows this deterministic sequence:

1. validate that input is a declarative record;
2. require one canonical admitted `RuntimeAdmission`;
3. project and integrity-check the required immutable upstream state;
4. require a valid `Identifier` for `workPackageId`;
5. select exactly one admitted work package by identifier equality;
6. normalize and validate `occurredAt`;
7. enforce temporal ordering against `RuntimeAdmission.admittedAt`;
8. normalize and validate `eventProvenance`;
9. defensively copy and deeply freeze the canonical state;
10. derive `ExecutionEventId`;
11. create and freeze the entity.

**EE-REQ-063:** Construction SHALL be pure with respect to supplied domain
state and SHALL perform no repository, persistence, networking, clock, or
environment access.

**EE-REQ-064:** Equivalent canonical inputs SHALL produce equivalent state,
equal identity, and byte-equivalent canonical serialization.

# 18. Minimum Public API

The package public surface is limited to:

```ts
export {
  ExecutionEvent,
  ExecutionEventError,
};

export type {
  ExecutionEventId,
  ExecutionEventInput,
  ExecutionEventProvenance,
  ExecutionEventFailureCode,
  SerializedExecutionEvent,
};
```

`ExecutionEvent` exposes:

```ts
static create(input: ExecutionEventInput): Promise<ExecutionEvent>;

get id(): Identifier;
get executionEventId(): ExecutionEventId;
get eventType(): "EXECUTION_OCCURRED";
get runtimeAdmissionId(): RuntimeAdmissionId;
get executionPlanId(): Identifier;
get organizationId(): Identifier;
get workPackageId(): Identifier;
get recommendationIds(): readonly Identifier[];
get traceIds(): readonly Identifier[];
get planningRuleProvenance(): readonly ExecutionPlanRuleProvenance[];
get planningPolicyProvenance(): Readonly<{
  planningPolicyId: string;
  planningPolicyVersion: string;
}>;
get executionPlanSchemaVersion(): string;
get runtimeAdmissionSchemaVersion(): "runtime-admission:v1";
get admissionProvenance(): RuntimeAdmissionProvenance;
get eventProvenance(): ExecutionEventProvenance;
get occurredAt(): string;
get version(): "1.0.0";
get schemaVersion(): "execution-event:v1";

toJSON(): SerializedExecutionEvent;
serialize(): string;
equals(other: Entity): boolean;
```

The inherited `Entity.id` getter and `executionEventId` expose the same
canonical identifier.

**EE-REQ-065:** Only the artifacts and members listed in this section,
including the inherited `Entity.id` getter, SHALL be public for version 1.

**EE-REQ-066:** Normalization, projection, ordering, framing, hashing, and
serialization helpers SHALL remain private.

# 19. Dependency Rules

The implementation belongs beside `RuntimeAdmission` in the domain execution
boundary and uses existing domain primitives.

```text
future runtime / application
            │
            ▼
   @ginzaaipro/domain
```

**EE-REQ-067:** `ExecutionEvent` SHALL depend only on existing
`@ginzaaipro/domain` contracts and platform primitives already permitted by the
domain package.

**EE-REQ-068:** It SHALL NOT depend on engines, infrastructure, persistence,
networking, adapters, applications, queues, workflow systems, or future
capabilities.

**EE-REQ-069:** No circular dependency or relative cross-package import SHALL
be introduced.

# 20. Normative Test Requirements

| Test ID | Required category | Normative evidence |
|---|---|---|
| `EE-TEST-001` | Valid construction | One canonical verified admission, one admitted work package, valid occurrence time, and valid provenance produce one event |
| `EE-TEST-002` | Missing and invalid input | Each public invalid-input condition is rejected |
| `EE-TEST-003` | Failure-code coverage | Every failure code has stable code, message, and immutable details |
| `EE-TEST-004` | Failure precedence | Multiple simultaneous defects produce the first code in §16.2 |
| `EE-TEST-005` | RuntimeAdmission preservation | Admission, plan, organization, planning-policy, planning-rule, schema, and admission-provenance values remain exact |
| `EE-TEST-006` | Work-package preservation | Selected work-package identity and recommendation lineage remain exact |
| `EE-TEST-007` | Trace preservation | The selected admitted work package's complete canonical TraceSet remains exact |
| `EE-TEST-008` | Temporal validation | Invalid timestamps and pre-admission occurrences fail; valid offsets normalize to UTC |
| `EE-TEST-009` | Event provenance | Closed recorder types and recorder-ID rules are enforced |
| `EE-TEST-010` | Identity determinism | Equivalent normalized inputs produce the same SHA-256 identity |
| `EE-TEST-011` | Identity distinctions | A change to any identity component changes identity |
| `EE-TEST-012` | Serialization determinism | Repeated and equivalent construction produces byte-equivalent canonical JSON |
| `EE-TEST-013` | Equality | Equal semantic inputs compare equal; distinct semantic identity compares unequal |
| `EE-TEST-014` | Deep immutability | Entity, nested records, arrays, errors, and serialized projections are immutable and defensively isolated |
| `EE-TEST-015` | Source isolation | Mutation attempts against constructor inputs and upstream projections do not alter the event |
| `EE-TEST-016` | Public exports | The package exports exactly the required public artifacts without exposing helpers |
| `EE-TEST-017` | Behavior absence | No execution, scheduling, retry, orchestration, persistence, or networking behavior exists |
| `EE-TEST-018` | Outcome absence | No completion, success, quality, impact, or outcome field or evaluation exists |
| `EE-TEST-019` | Dependency integrity | No forbidden or circular dependency exists |
| `EE-TEST-020` | Canonical vectors | Fixed identity and serialization vectors remain stable across repeat runs |

**EE-REQ-070:** Acceptance verification SHALL implement every test category in
this matrix and SHALL trace each test to the applicable `EE-REQ` identifiers.

# 21. Architectural Conformance

**EE-REQ-071:** Capability 008B SHALL remain compatible with the canonical
verified Capability 008A contract and SHALL consume its public contract without
modifying it.

**EE-REQ-072:** Capability 008B SHALL NOT modify Capability 007,
`ExecutionPlan`, `RuntimeAdmission`, or their behavior.

**EE-REQ-073:** This specification SHALL NOT authorize an execution engine,
`ObservedOutcome`, or any other future capability.

**EE-REQ-074:** Implementation SHALL preserve the dependency direction and
shall introduce no infrastructure coupling.

# 22. Acceptance Criteria

This specification is ready for acceptance when review confirms:

- every field is justified by ADR-0010 or required canonical provenance;
- the version 1 execution fact is precisely bounded;
- outcome semantics are excluded;
- identity inputs and derivation are deterministic;
- serialization shape and ordering are deterministic;
- immutability is deep and testable;
- validation precedence is deterministic;
- the public API is minimal;
- every normative requirement is uniquely identifiable and testable;
- no implementation ambiguity remains;
- Capability 007 and Capability 008A remain unchanged.

# 23. Implementation Stop Conditions

Implementation must stop and return to governance if:

- a second execution-fact kind is required;
- mutable progress or workflow state is required;
- outcome or evidence semantics are required;
- canonical input cannot be obtained from `RuntimeAdmission`;
- a repository, clock, network, or infrastructure dependency is required;
- an accepted upstream contract must change;
- deterministic identity or serialization cannot be implemented as specified.

# 24. Final Normative Statement

**EE-REQ-075:** `ExecutionEvent` SHALL be the sole canonical immutable record
that one work package admitted by exactly one `RuntimeAdmission` experienced an
execution occurrence at an explicit canonical instant.

It records execution facts only. It neither performs execution nor determines
what changed in the real world.
