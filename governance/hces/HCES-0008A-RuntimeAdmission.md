# HCES-0008A — RuntimeAdmission

## Human-Centered Engineering Specification

---

## 0. Document Control

| Field                        | Value                                                                           |
| ---------------------------- | ------------------------------------------------------------------------------- |
| Specification ID             | HCES-0008A                                                                      |
| Title                        | RuntimeAdmission                                                                |
| Version                      | 1.0.0                                                                           |
| Status                       | Accepted                                                                        |
| Capability Context           | Capability 008 — Governed Runtime Boundary                                      |
| Canonical Owner              | `@ginzaaipro/domain`                                                            |
| Upstream Capability          | Capability 007 — Execution Planning                                             |
| Governing ADR                | ADR-0009 — Canonical Ownership of Runtime Admission                             |
| Related ADRs                 | ADR-0007; ADR-0008                                                              |
| Related Specifications       | HCES-0007; HCES-0007A; HCES-0008                                                |
| Downstream Consumers         | Execution runtime; ExecutionEvent; ObservedOutcome; execution-derived evidence  |
| Governing Doctrine           | Platform Constitution; Governance Operating System; Minimum Complexity Doctrine |
| Implementation Authorization | Begins only after formal acceptance of ADR-0009 and this specification          |

---

# 1. Purpose

This specification defines the canonical `RuntimeAdmission` domain contract for GinzaAIpro.

A `RuntimeAdmission` is an immutable, deterministic, append-only authorization record stating that an explicit non-empty selection of work packages from one runtime-admissible `ExecutionPlan` has been admitted into runtime under explicit governed conditions.

It answers:

> What portion of an approved ExecutionPlan is authorized to enter runtime?

A `RuntimeAdmission` does not execute work, schedule work, assign work, calculate state, record execution events, infer outcomes, or generate evidence.

---

# 2. Constitutional Runtime Principle

The following principle is normative:

> No governed runtime artifact may cross from planning into execution without passing through an explicit immutable runtime-admission boundary.

Accordingly:

* an `ExecutionPlan` is not permission to execute;
* the presence of a work package in an `ExecutionPlan` does not mean it has been admitted;
* execution engines shall consume a valid `RuntimeAdmission`;
* `ExecutionEvent` shall bind to a valid `RuntimeAdmission`;
* no legacy runtime artifact may substitute for this boundary.

---

# 3. Capability Intent

Capability 008A establishes the canonical constitutional boundary between planning and execution.

Its purpose is to:

* preserve governance before runtime activity;
* identify the exact runtime-admissible plan governing runtime work;
* identify the exact work packages admitted;
* preserve organization provenance;
* preserve trace provenance;
* preserve recommendation provenance;
* preserve planning-rule provenance;
* preserve planning-policy and schema provenance;
* record admission-decision provenance;
* provide deterministic admission identity;
* provide a stable upstream contract for `ExecutionEvent`;
* prevent legacy runtime artifacts from defining new canonical semantics.

---

# 4. Governing Distinctions

The following distinctions are normative:

| Artifact                   | Governing Question                                           |
| -------------------------- | ------------------------------------------------------------ |
| Recommendation             | What opportunity, need, or intervention has been identified? |
| ExecutionPlan              | What should be done?                                         |
| RuntimeAdmission           | What planned work is authorized to enter runtime?            |
| Execution engine           | How is admitted work executed?                               |
| ExecutionEvent             | What actually happened?                                      |
| ObservedOutcome            | What changed?                                                |
| Execution-derived evidence | What claim is supported by the observed record?              |

These concepts shall not be collapsed into one contract.

---

# 5. Scope

Capability 008A includes:

* the canonical `RuntimeAdmission` value object;
* admitted-work-package bindings;
* admission actor;
* admission decision;
* admission reason;
* admission timestamp;
* admission policy provenance;
* plan provenance preservation;
* trace-set preservation;
* planning-rule provenance preservation;
* recommendation binding preservation;
* deterministic identity;
* deterministic serialization;
* deterministic validation;
* deep immutability;
* append-only semantics;
* failure codes;
* public exports;
* focused tests;
* implementation stop conditions.

---

# 6. Explicit Non-Goals

Capability 008A does not include:

* execution;
* work dispatch;
* scheduling;
* assignment;
* orchestration;
* mutable workflow state;
* execution status calculation;
* event generation;
* event publication;
* retries;
* retry policy;
* cancellation execution;
* pausing execution;
* resuming execution;
* admission revocation;
* admission expiration;
* persistence;
* repositories;
* database schemas;
* queues;
* brokers;
* messaging;
* network transport;
* webhooks;
* notifications;
* outcome inference;
* evidence generation;
* AI inference;
* learning;
* optimization.

No runtime infrastructure shall be introduced merely to implement this domain contract.

---

# 7. Canonical Ownership

## 7.1 Domain ownership

`@ginzaaipro/domain` is the sole canonical owner of:

* `RuntimeAdmission`;
* `RuntimeAdmissionId`;
* `RuntimeAdmissionDecision`;
* `RuntimeAdmissionActor`;
* `RuntimeAdmissionActorType`;
* `AdmittedWorkPackage`;
* `RuntimeAdmissionProvenance`;
* `CreateRuntimeAdmissionInput`;
* `RuntimeAdmissionFailureCode`;
* `RuntimeAdmissionError`;
* admission identity derivation;
* admission validation;
* admission canonical serialization.

## 7.2 Engine ownership

Capability 008A introduces no engine.

A future runtime admission service or execution engine may construct or consume this domain contract, but shall not redefine it.

## 7.3 Dependency direction

The accepted dependency direction remains:

```text
@ginzaaipro/engines
        ↓
@ginzaaipro/domain
```

The domain package shall not depend on:

* engines;
* infrastructure;
* persistence;
* application packages;
* network clients;
* external runtime systems.

---

# 8. Legacy Runtime Artifact Boundary

The existing `RuntimeExecutionPlan` remains a legacy runtime artifact.

It shall not be:

* promoted to canonical admission ownership;
* reinterpreted as `RuntimeAdmission`;
* treated as the authoritative source of admitted work packages;
* used as the authoritative source of execution-plan identity;
* used as the authoritative source of trace provenance;
* used as the authoritative source of runtime admission provenance.

The following reinterpretations are explicitly prohibited:

```text
RuntimeExecutionPlan.actionIds
    ≠ admitted work-package identifiers

RuntimeExecutionPlan.recommendationId
    ≠ ExecutionPlan identity

RuntimeExecutionPlan
    ≠ RuntimeAdmission
```

A future adapter may translate from canonical `RuntimeAdmission` to a legacy runtime shape.

Legacy semantics shall not flow upstream into the canonical contract.

---

# 9. Canonical Domain Contract

The canonical domain shape shall be equivalent to:

```ts
export type RuntimeAdmission = Readonly<{
  runtimeAdmissionId: RuntimeAdmissionId;
  admissionOrdinal: number;

  organizationId: OrganizationId;
  executionPlanId: ExecutionPlanId;

  admittedWorkPackages: readonly AdmittedWorkPackage[];

  traceIds: readonly TraceId[];
  planningRuleProvenance: readonly PlanningRuleProvenance[];

  planningPolicyProvenance: PlanningPolicyProvenance;
  executionPlanSchemaVersion: string;

  decision: "ADMITTED";
  admissionReason: RuntimeAdmissionReason;
  admittedBy: RuntimeAdmissionActor;
  admittedAt: CanonicalTimestamp;

  admissionProvenance: RuntimeAdmissionProvenance;

  version: "1.0.0";
  schemaVersion: "runtime-admission:v1";
}>;
```

All fields are required.

No implementation may introduce hidden defaults.

---

# 10. Supporting Contracts

## 10.1 Admitted work package

```ts
export type AdmittedWorkPackage = Readonly<{
  workPackageId: ExecutionPlanWorkPackageId;
  recommendationIds: readonly RecommendationId[];
  traceIds: readonly TraceId[];
}>;
```

Planning-rule provenance is preserved at the admission level unless the canonical `ExecutionPlan` already exposes a deterministic work-package-specific mapping.

Capability 007 shall not be modified to create such a mapping.

## 10.2 Admission decision

```ts
export type RuntimeAdmissionDecision = "ADMITTED";
```

Version 1 supports only an immutable positive admission decision.

Rejection, revocation, suspension, expiration, and replacement are outside scope.

## 10.3 Admission reason

```ts
export type RuntimeAdmissionReason = Readonly<{
  code: string;
  message: string;
}>;
```

## 10.4 Admission actor

```ts
export type RuntimeAdmissionActorType =
  | "HUMAN"
  | "SYSTEM"
  | "SERVICE"
  | "GOVERNED_AUTOMATION";

export type RuntimeAdmissionActor = Readonly<{
  actorType: RuntimeAdmissionActorType;
  actorId: string;
}>;
```

## 10.5 Admission provenance

```ts
export type RuntimeAdmissionProvenance = Readonly<{
  admissionPolicyId: string;
  admissionPolicyVersion: string;
  admissionSchemaVersion: "runtime-admission:v1";
}>;
```

---

# 11. Field Definitions and Authoritative Sources

| Field                        | Requirement               | Authoritative Source                                            |
| ---------------------------- | ------------------------- | --------------------------------------------------------------- |
| `runtimeAdmissionId`         | Required; derived         | Deterministic identity algorithm in §24                         |
| `admissionOrdinal`           | Required positive integer | Authoritative admission producer                                |
| `organizationId`             | Required                  | Referenced runtime-admissible `ExecutionPlan.organizationId`    |
| `executionPlanId`            | Required                  | Referenced runtime-admissible `ExecutionPlan`                   |
| `admittedWorkPackages`       | Required, non-empty       | Explicit selection from referenced `ExecutionPlan.workPackages` |
| `traceIds`                   | Required, non-empty       | Canonical union of admitted work-package trace sets             |
| `planningRuleProvenance`     | Required                  | Exact canonical `ExecutionPlan.planningRuleProvenance[]`        |
| `planningPolicyProvenance`   | Required                  | Exact canonical planning-policy provenance from `ExecutionPlan` |
| `executionPlanSchemaVersion` | Required                  | Referenced `ExecutionPlan`                                      |
| `decision`                   | Required fixed literal    | This specification                                              |
| `admissionReason`            | Required                  | Authoritative admission producer                                |
| `admittedBy`                 | Required                  | Authoritative admission producer                                |
| `admittedAt`                 | Required                  | Authoritative admission producer                                |
| `admissionProvenance`        | Required                  | Admission policy boundary                                       |
| `version`                    | Required fixed literal    | This specification                                              |
| `schemaVersion`              | Required fixed literal    | This specification                                              |

The constructor shall not use:

* current system time;
* randomness;
* environment state;
* process state;
* database-generated identity;
* network state;
* mutable global state.

---

# 12. ExecutionPlan Binding

Every `RuntimeAdmission` shall reference exactly one runtime-admissible `ExecutionPlan`.

The constructor shall receive the complete canonical `ExecutionPlan` object or an equivalent authoritative immutable domain representation.

It shall derive:

* `organizationId`;
* `executionPlanId`;
* planning-rule provenance;
* planning-policy provenance;
* execution-plan schema version;
* work-package provenance;
* recommendation bindings;
* trace bindings.

The caller shall not redundantly provide derived planning fields where doing so would create competing authoritative sources.

A `RuntimeAdmission` shall not bind to:

* multiple plans;
* no plan;
* a draft planning object;
* a legacy execution-plan artifact;
* a plan from another organization.

---

# 13. Admission Cardinality

The canonical cardinality is:

```text
One ExecutionPlan
    └── zero or more RuntimeAdmissions

One RuntimeAdmission
    ├── exactly one ExecutionPlan
    └── one or more AdmittedWorkPackages

One ExecutionPlanWorkPackage
    └── zero or more RuntimeAdmissions
```

This specification permits a work package to appear in more than one independently valid `RuntimeAdmission` at the domain-shape level because historical duplicate admission cannot be proven without persistence.

However:

* the domain constructor shall prohibit duplicate work-package IDs within one admission;
* a future runtime recording boundary may prohibit re-admission historically;
* Capability 008A does not authorize automatic re-admission.

---

# 14. Work-Package Admission

## 14.1 Admission unit

Admission occurs at the canonical work-package level.

Each admitted work package shall reference exactly one work package from the runtime-admissible `ExecutionPlan`.

## 14.2 Selection

The caller shall supply one or more work-package identifiers.

The constructor shall derive the corresponding canonical work packages from the referenced plan.

## 14.3 Validation

For each supplied work-package identifier, the constructor shall verify:

* the identifier is valid;
* the work package exists in the referenced plan;
* the work package belongs to the plan’s organization;
* the work package’s recommendation binding is available;
* the work package’s trace set is available;
* the work package is not duplicated within the admission.

## 14.4 Canonical ordering

`admittedWorkPackages` shall be sorted by ascending canonical work-package identifier order after normalization.

Caller order shall not affect canonical identity or serialization.

## 14.5 Partial admission

A `RuntimeAdmission` may admit:

* one work package;
* some work packages;
* all work packages.

Admission of the full plan shall still be represented as an explicit list of all admitted work packages.

No implicit “all work packages” flag is permitted in version 1.

---

# 15. Recommendation Binding

Each admitted work package shall preserve the exact canonical recommendation identifiers bound to that work package in the runtime-admissible `ExecutionPlan`.

Recommendation identifiers shall be:

* non-empty;
* duplicate-free;
* normalized according to existing identifier conventions;
* sorted in ascending canonical order;
* deeply immutable.

The constructor shall not:

* infer recommendations from legacy artifacts;
* accept additional recommendation identifiers;
* omit existing recommendation identifiers;
* select recommendations by array position;
* alter the work package’s canonical recommendation binding.

---

# 16. Organization Invariants

The following invariant is mandatory:

```text
RuntimeAdmission.organizationId
    =
ExecutionPlan.organizationId
```

Every admitted work package must belong to the same execution plan and therefore the same organization.

Cross-organization admission is prohibited.

The constructor shall reject:

* supplied organization mismatches;
* work packages from another plan;
* mixed-organization work-package collections;
* missing organization provenance.

Where the input constructor receives the plan directly, `organizationId` should be derived rather than redundantly supplied.

---

# 17. Trace Semantics

## 17.1 Preservation of set-valued traces

Capability 007 exposes:

```text
ExecutionPlan.traceIds[]
ExecutionPlanWorkPackage.traceIds[]
```

Runtime admission shall preserve this set-valued model.

No implementation may collapse multiple traces into one trace.

## 17.2 Work-package trace set

Each admitted work package shall preserve the exact canonical trace set from its source work package.

Each trace set shall be:

* non-empty;
* duplicate-free;
* normalized;
* sorted in ascending canonical identifier order;
* deeply immutable.

## 17.3 Admission-level trace set

`RuntimeAdmission.traceIds` shall equal the canonical union of the admitted work-package trace sets:

```text
RuntimeAdmission.traceIds
    =
canonicalUnion(
  admittedWorkPackages[*].traceIds
)
```

The union shall be:

* duplicate-free;
* deterministically sorted;
* non-empty;
* immutable.

## 17.4 Plan-level trace validation

Every admitted work-package trace identifier shall be a member of `ExecutionPlan.traceIds`.

If a work package contains a trace not present at plan level, implementation shall halt because that indicates an upstream contract inconsistency.

The constructor shall not silently repair the plan.

---

# 18. Planning-Rule Provenance

## 18.1 Canonical source

`RuntimeAdmission.planningRuleProvenance` shall preserve the complete canonical:

```text
ExecutionPlan.planningRuleProvenance[]
```

No single planning rule shall be selected.

## 18.2 Cardinality

The provenance array may contain one or more entries according to Capability 007.

The constructor shall preserve the exact semantic set.

## 18.3 Canonical ordering

If Capability 007 already defines canonical ordering, that ordering shall be preserved.

If it defines semantic set equality but not order, the implementation shall sort entries using the repository’s canonical provenance comparator.

If no canonical comparator exists, implementation shall halt and identify the missing upstream ordering rule.

No ordering by arbitrary object serialization is permitted unless governed by an accepted canonical serializer.

## 18.4 No work-package inference

Because the canonical `ExecutionPlan` does not expose a deterministic planning-rule-to-work-package mapping, RuntimeAdmission v1 shall preserve full plan-level planning-rule provenance once at admission level.

It shall not duplicate or infer planning-rule subsets per work package.

Capability 007 remains unchanged.

---

# 19. Planning-Policy Provenance

The admission shall preserve the canonical planning-policy provenance exposed by the runtime-admissible `ExecutionPlan`.

The exact existing type and field names shall be reused.

No parallel policy-provenance type shall be introduced unless the existing domain contract cannot represent the required values.

The constructor shall reject any conflicting duplicate policy provenance supplied by a caller.

Where possible, planning-policy provenance shall be derived solely from the plan.

---

# 20. Execution-Plan Schema Provenance

`executionPlanSchemaVersion` shall preserve the canonical schema version of the referenced runtime-admissible `ExecutionPlan`.

The admission constructor shall not:

* invent a version;
* substitute the RuntimeAdmission schema version;
* infer from package version;
* infer from source filename;
* infer from runtime code version.

If the canonical plan does not expose a canonical schema version, construction shall fail governably.

---

# 21. Admission Decision

Version 1 supports only:

```text
ADMITTED
```

The admission decision records that the specified work packages are authorized to enter runtime under the recorded admission policy and provenance.

It does not assert that:

* execution has begun;
* execution will begin;
* resources are available;
* scheduling is complete;
* execution will succeed;
* policy remains valid indefinitely;
* the work package has not been separately admitted elsewhere.

---

# 22. Admission Reason

`admissionReason` shall contain:

* a non-empty reason code;
* a non-empty human-readable message.

## 22.1 Code rules

The code shall:

* be normalized to Unicode NFC;
* contain no leading or trailing whitespace;
* not exceed 256 UTF-8 bytes;
* use a stable machine-readable value.

## 22.2 Message rules

The message shall:

* be normalized to Unicode NFC;
* contain no leading or trailing whitespace;
* not exceed 4,096 UTF-8 bytes;
* explain why the admission decision was made.

The reason message is explanatory.

It shall not be used as identity-critical policy semantics beyond its governed inclusion in the identity material defined in §24.

---

# 23. Admission Actor

## 23.1 Actor types

The canonical actor taxonomy is:

```ts
export type RuntimeAdmissionActorType =
  | "HUMAN"
  | "SYSTEM"
  | "SERVICE"
  | "GOVERNED_AUTOMATION";
```

This taxonomy is closed for version 1.

## 23.2 Actor ID

`actorId` shall:

* be required;
* be normalized to Unicode NFC;
* contain no leading or trailing whitespace;
* be non-empty;
* not exceed 256 UTF-8 bytes;
* be stable for the represented actor.

Anonymous admission is prohibited.

## 23.3 Semantic distinction

The admission actor identifies who or what authorized runtime entry.

The admission actor is not necessarily:

* the plan author;
* the planner;
* the approver of every recommendation;
* the executor;
* the execution-event actor;
* the event recorder;
* the organization owner.

These roles shall remain distinct.

---

# 24. Admission Timestamp

## 24.1 Canonical format

`admittedAt` shall use canonical UTC RFC 3339 with millisecond precision:

```text
YYYY-MM-DDTHH:mm:ss.SSSZ
```

Example:

```text
2026-07-22T18:42:31.125Z
```

## 24.2 Source

The timestamp shall be explicitly supplied by the authoritative admission producer.

The constructor shall not call:

```ts
Date.now()
new Date()
performance.now()
```

for authoritative admission time.

## 24.3 Normalization

Timezone-offset inputs may be accepted only where existing canonical timestamp utilities support deterministic conversion to UTC millisecond form.

Invalid dates, missing timezone indicators, leap-second representations, and non-finite epoch values shall be rejected.

## 24.4 Future timestamps

The constructor shall not reject an admission solely because it appears in the future relative to the host clock.

That would introduce nondeterminism.

Future-time policy belongs to a separate runtime-policy boundary using an explicit reference time.

---

# 25. Admission Ordinal

## 25.1 Definition

`admissionOrdinal` is a positive safe integer assigned by the authoritative admission producer within the scope:

```text
organizationId + executionPlanId
```

## 25.2 Rules

It shall:

* be explicitly supplied;
* be an integer;
* be greater than or equal to `1`;
* be less than or equal to `Number.MAX_SAFE_INTEGER`;
* not be generated randomly;
* not be inferred from array order;
* not be inferred from current time.

## 25.3 Purpose

The ordinal distinguishes multiple legitimate admission decisions involving equivalent plan and work-package material.

Historical ordinal uniqueness cannot be proven without persistence.

That responsibility belongs to a future runtime recording boundary.

---

# 26. Admission Provenance

## 26.1 Contract

```ts
export type RuntimeAdmissionProvenance = Readonly<{
  admissionPolicyId: string;
  admissionPolicyVersion: string;
  admissionSchemaVersion: "runtime-admission:v1";
}>;
```

## 26.2 Policy identifier

`admissionPolicyId` shall:

* be required;
* be normalized to Unicode NFC;
* contain no leading or trailing whitespace;
* not exceed 256 UTF-8 bytes.

## 26.3 Policy version

`admissionPolicyVersion` shall:

* be required;
* be normalized to Unicode NFC;
* contain no leading or trailing whitespace;
* not exceed 128 UTF-8 bytes.

## 26.4 Schema version

The required literal is:

```text
runtime-admission:v1
```

## 26.5 Separation from planning provenance

Admission provenance records why runtime entry was authorized.

Planning provenance records how the execution plan was produced.

Neither may replace the other.

---

# 27. Constructor Input

The canonical constructor input shall be equivalent to:

```ts
export type CreateRuntimeAdmissionInput = Readonly<{
  executionPlan: ExecutionPlan;

  workPackageIds: readonly ExecutionPlanWorkPackageId[];

  admissionOrdinal: number;

  admittedBy: RuntimeAdmissionActor;
  admittedAt: TimestampInput;

  admissionReason: RuntimeAdmissionReason;
  admissionProvenance: RuntimeAdmissionProvenance;
}>;
```

The constructor shall derive:

* `organizationId`;
* `executionPlanId`;
* admitted-work-package recommendation bindings;
* admitted-work-package trace sets;
* admission-level trace union;
* planning-rule provenance;
* planning-policy provenance;
* execution-plan schema version;
* decision;
* version;
* schema version;
* `runtimeAdmissionId`.

This design prevents callers from supplying conflicting duplicate sources.

---

# 28. Deterministic Identity

## 28.1 Identity prefix

The identity prefix is:

```text
runtime-admission:v1:
```

## 28.2 Identity material

The canonical identity material shall contain, in this exact order:

1. `organizationId`
2. `executionPlanId`
3. canonical decimal `admissionOrdinal`
4. canonical serialization of `admittedWorkPackages`
5. canonical serialization of admission-level `traceIds`
6. canonical serialization of `planningRuleProvenance`
7. canonical serialization of `planningPolicyProvenance`
8. `executionPlanSchemaVersion`
9. `decision`
10. `admissionReason.code`
11. `admissionReason.message`
12. `admittedBy.actorType`
13. `admittedBy.actorId`
14. `admittedAt`
15. `admissionProvenance.admissionPolicyId`
16. `admissionProvenance.admissionPolicyVersion`
17. `admissionProvenance.admissionSchemaVersion`
18. `version`
19. `schemaVersion`

## 28.3 Normalization

Before identity derivation:

* all strings shall be Unicode NFC;
* identifiers shall follow existing canonical identifier normalization;
* timestamps shall use canonical UTC millisecond form;
* integers shall use canonical base-10 representation;
* arrays shall use governed canonical ordering;
* nested objects shall use canonical serialization.

## 28.4 Framing

Each identity component shall use UTF-8 byte-length-prefixed framing:

```text
<byteLength>:<value>
```

Components shall be concatenated without ambiguous separators.

## 28.5 Hash

The canonical framed identity material shall be hashed using:

```text
SHA-256
```

The digest shall be lowercase hexadecimal.

The final identity is:

```text
runtime-admission:v1:<64-character-lowercase-sha256>
```

## 28.6 Prohibited identity sources

Identity shall not depend on:

* random UUIDs;
* current system time;
* object memory addresses;
* process identifiers;
* persistence-generated identifiers;
* mutable counters hidden inside the constructor;
* locale-dependent formatting;
* caller array order where order is not semantic.

---

# 29. Canonical Serialization

## 29.1 Field order

Canonical serialization shall emit fields in this exact order:

1. `runtimeAdmissionId`
2. `admissionOrdinal`
3. `organizationId`
4. `executionPlanId`
5. `admittedWorkPackages`
6. `traceIds`
7. `planningRuleProvenance`
8. `planningPolicyProvenance`
9. `executionPlanSchemaVersion`
10. `decision`
11. `admissionReason`
12. `admittedBy`
13. `admittedAt`
14. `admissionProvenance`
15. `version`
16. `schemaVersion`

## 29.2 Nested ordering

Fixed-shape nested objects shall use declared field order.

`AdmittedWorkPackage` field order:

1. `workPackageId`
2. `recommendationIds`
3. `traceIds`

`RuntimeAdmissionReason` field order:

1. `code`
2. `message`

`RuntimeAdmissionActor` field order:

1. `actorType`
2. `actorId`

`RuntimeAdmissionProvenance` field order:

1. `admissionPolicyId`
2. `admissionPolicyVersion`
3. `admissionSchemaVersion`

## 29.3 JSON requirements

Canonical serialization shall:

* emit valid UTF-8 JSON;
* contain no insignificant whitespace;
* emit no `undefined`;
* preserve canonical array order;
* escape strings consistently;
* serialize only validated normalized values.

Plain `JSON.stringify` over unnormalized caller input is insufficient.

It may be used only after canonical normalized ordered structures have been constructed.

---

# 30. Deep Immutability

The constructed `RuntimeAdmission` shall be deeply immutable.

This includes:

* the top-level admission;
* admitted-work-package array;
* each admitted-work-package object;
* recommendation arrays;
* trace arrays;
* planning-rule provenance;
* planning-policy provenance;
* admission reason;
* admission actor;
* admission provenance.

No caller-owned mutable object or array shall be retained.

Construction shall:

1. validate inputs;
2. normalize into newly owned structures;
3. derive canonical identity;
4. construct the final object;
5. deeply freeze or otherwise enforce immutability according to repository convention.

Mutation attempts shall not alter the stored admission.

Caller inputs shall remain unchanged.

---

# 31. Append-Only Semantics

An accepted `RuntimeAdmission` shall never be edited.

Capability 008A defines no update operation.

It defines no delete operation.

Version 1 does not define:

* revocation;
* expiration;
* suspension;
* replacement;
* amendment;
* cancellation.

If future runtime governance requires these concepts, they shall be represented through separately governed immutable artifacts or decisions.

They shall not mutate an accepted admission record.

---

# 32. Construction Algorithm

The implementation shall process input in this exact normative order:

1. Validate input container.
2. Validate referenced `ExecutionPlan`.
3. Validate execution-plan identity.
4. Validate execution-plan organization.
5. Validate execution-plan schema version.
6. Validate non-empty work-package identifier input.
7. Normalize work-package identifiers.
8. Reject duplicate requested work-package identifiers.
9. Resolve every work package from the plan.
10. Validate each work-package recommendation binding.
11. Validate each work-package trace set.
12. Validate every work-package trace against plan-level trace membership.
13. Canonically sort admitted work packages.
14. Derive canonical recommendation arrays.
15. Derive canonical work-package trace arrays.
16. Derive admission-level canonical trace union.
17. Validate and preserve planning-rule provenance.
18. Validate and preserve planning-policy provenance.
19. Validate admission ordinal.
20. Validate admission actor.
21. Normalize and validate admission timestamp.
22. Validate admission reason.
23. Validate admission provenance.
24. Materialize fixed decision and version fields.
25. Canonically serialize all identity material.
26. Derive `runtimeAdmissionId`.
27. Construct final canonical admission.
28. Enforce deep immutability.
29. Return the admission.

The order is mandatory because it establishes deterministic failure precedence.

---

# 33. Failure Codes

The canonical failure-code union is:

```ts
export type RuntimeAdmissionFailureCode =
  | "INVALID_RUNTIME_ADMISSION_INPUT"
  | "MISSING_EXECUTION_PLAN"
  | "INVALID_EXECUTION_PLAN_ID"
  | "INVALID_EXECUTION_PLAN_ORGANIZATION"
  | "INVALID_EXECUTION_PLAN_SCHEMA_VERSION"
  | "MISSING_WORK_PACKAGE_IDS"
  | "INVALID_WORK_PACKAGE_ID"
  | "DUPLICATE_WORK_PACKAGE_ID"
  | "WORK_PACKAGE_NOT_FOUND"
  | "INVALID_WORK_PACKAGE_RECOMMENDATION_BINDING"
  | "INVALID_WORK_PACKAGE_TRACE_BINDING"
  | "WORK_PACKAGE_TRACE_NOT_IN_EXECUTION_PLAN"
  | "INVALID_ADMISSION_TRACE_SET"
  | "INVALID_PLANNING_RULE_PROVENANCE"
  | "INVALID_PLANNING_POLICY_PROVENANCE"
  | "INVALID_ADMISSION_ORDINAL"
  | "INVALID_RUNTIME_ADMISSION_ACTOR_TYPE"
  | "INVALID_RUNTIME_ADMISSION_ACTOR_ID"
  | "INVALID_ADMISSION_TIMESTAMP"
  | "INVALID_ADMISSION_REASON_CODE"
  | "INVALID_ADMISSION_REASON_MESSAGE"
  | "INVALID_ADMISSION_POLICY_ID"
  | "INVALID_ADMISSION_POLICY_VERSION"
  | "INVALID_ADMISSION_SCHEMA_VERSION"
  | "RUNTIME_ADMISSION_IDENTITY_DERIVATION_FAILED"
  | "RUNTIME_ADMISSION_SERIALIZATION_FAILED";
```

Implementations shall not replace these governed codes with generic failures.

---

# 34. Failure Precedence

When multiple defects are present, the implementation shall return or throw the failure corresponding to the earliest failing step in §32.

For work-package identifier arrays:

* inspect in caller-provided index order during initial validity checking;
* after normalization, detect duplicates deterministically;
* resolve canonical plan membership in ascending normalized identifier order.

For admitted work-package trace arrays:

* inspect in canonical sorted order.

For planning-rule provenance:

* use the canonical Capability 007 validation and ordering rules;
* if those rules do not exist, halt rather than invent precedence.

---

# 35. Error Contract

The domain package shall expose an error compatible with existing repository conventions, equivalent to:

```ts
export class RuntimeAdmissionError extends Error {
  readonly code: RuntimeAdmissionFailureCode;
  readonly details: Readonly<Record<string, CanonicalJsonValue>>;
}
```

Error details shall:

* contain canonical JSON values only;
* be deeply immutable;
* be deterministic for equivalent failures;
* avoid secrets by default.

Stack traces are runtime diagnostics and are not part of canonical domain serialization.

---

# 36. Determinism Requirements

Equivalent canonical input shall produce equivalent output regardless of:

* caller array order where order is not semantic;
* caller object-property order;
* host locale;
* host timezone;
* operating system;
* process start time;
* test execution order;
* object identity;
* memory layout.

Implementation shall not depend on:

* current time;
* randomness;
* filesystem order;
* network responses;
* persistence lookups;
* AI output;
* mutable global state.

---

# 37. Security and Integrity Requirements

The implementation shall:

* reuse existing validated identifier types;
* reject malformed identifiers;
* reject duplicate work-package references;
* reject trace provenance inconsistencies;
* reject conflicting planning provenance;
* reject actor ambiguity;
* reject timestamp ambiguity;
* avoid mutating upstream planning artifacts;
* avoid retaining caller-owned mutable structures;
* avoid silent identifier truncation;
* avoid automatic type coercion;
* avoid legacy field reinterpretation.

The admission constructor shall treat all caller input as untrusted until validated.

---

# 38. Package Exports

The domain package shall export, following repository conventions:

* `RuntimeAdmission`;
* `RuntimeAdmissionId`;
* `RuntimeAdmissionDecision`;
* `RuntimeAdmissionReason`;
* `RuntimeAdmissionActor`;
* `RuntimeAdmissionActorType`;
* `RuntimeAdmissionProvenance`;
* `AdmittedWorkPackage`;
* `CreateRuntimeAdmissionInput`;
* `RuntimeAdmissionFailureCode`;
* `RuntimeAdmissionError`;
* the authorized constructor or factory;
* the canonical serializer, if public serialization functions are part of domain convention.

No equivalent canonical contract shall be exported from `@ginzaaipro/engines`.

---

# 39. Repository Materialization

The accepted minimum-complexity contract is materialized in:

```text
packages/domain/src/execution/RuntimeAdmission.ts
packages/domain/src/execution/index.ts
packages/domain/tests/runtime-admission.test.ts
```

The single implementation file contains the validated immutable contract,
identity, serialization, and governed error behavior. No engine, repository,
adapter, persistence component, or legacy runtime promotion was introduced.

Implementation and verification may construct `RuntimeAdmission` from the
canonical verified `ExecutionPlan` contract. Operational runtime admission is
permitted only after the referenced plan has crossed every applicable release
and admissibility boundary. A plan alone is not permission to execute.

---

# 40. Required Focused Tests

## 40.1 Valid construction

Test:

* admission of one work package;
* admission of some work packages;
* admission of all work packages;
* all derived fields;
* fixed decision and version fields;
* no random identity;
* no implicit current time.

## 40.2 Plan binding

Test:

* valid canonical `ExecutionPlan` fixture;
* missing plan;
* invalid plan identity;
* organization preservation;
* schema-version preservation;
* no mutation of plan;
* no Capability 007 modifications.

## 40.3 Work-package selection

Test:

* one valid work package;
* multiple valid work packages;
* unknown work package;
* duplicate requested work package;
* empty selection;
* canonical output ordering independent of caller order.

## 40.4 Recommendation preservation

Test:

* exact recommendation binding;
* multiple recommendation identifiers;
* sorted canonical recommendation arrays;
* duplicate recommendation rejection where upstream invalidity is detectable;
* caller array preservation;
* deep immutability.

## 40.5 Trace preservation

Test:

* exact per-work-package trace preservation;
* multiple traces;
* admission-level trace union;
* duplicate elimination;
* deterministic trace ordering;
* work-package trace missing from plan-level trace set;
* no singular-trace collapse.

## 40.6 Planning-rule provenance

Test:

* one provenance entry;
* multiple provenance entries;
* exact full-array preservation;
* canonical ordering;
* no first-element selection;
* no lexical-minimum selection;
* no work-package-specific inference;
* deep immutability.

## 40.7 Planning-policy provenance

Test:

* exact preservation;
* invalid or missing provenance;
* no caller override;
* no parallel invented type.

## 40.8 Admission actor

Test:

* every canonical actor type;
* unsupported actor type;
* missing actor ID;
* blank actor ID;
* NFC normalization;
* byte-length limit;
* input preservation.

## 40.9 Timestamp

Test:

* canonical UTC timestamp;
* accepted offset normalization where supported;
* invalid date;
* missing timezone;
* millisecond precision;
* no wall-clock use;
* future timestamp not rejected using host time.

## 40.10 Admission reason

Test:

* valid code and message;
* blank code;
* blank message;
* leading/trailing whitespace;
* NFC normalization;
* code byte limit;
* message byte limit.

## 40.11 Admission provenance

Test:

* valid policy ID;
* valid policy version;
* exact schema literal;
* invalid schema version;
* missing policy ID;
* missing policy version;
* immutability.

## 40.12 Admission ordinal

Test:

* ordinal `1`;
* larger valid ordinal;
* zero;
* negative value;
* fraction;
* `NaN`;
* infinity;
* value above `Number.MAX_SAFE_INTEGER`.

## 40.13 Identity

Test:

* equivalent canonical input produces identical ID;
* different plan changes ID;
* different work-package set changes ID;
* different caller work-package order does not change ID;
* different ordinal changes ID;
* different actor changes ID;
* different reason changes ID;
* different timestamp changes ID;
* different admission policy changes ID;
* exact prefix;
* lowercase 64-character SHA-256 digest;
* length-prefixed framing prevents ambiguous concatenation.

## 40.14 Serialization

Test:

* deterministic top-level field order;
* deterministic admitted-work-package field order;
* deterministic admitted-work-package ordering;
* deterministic recommendation ordering;
* deterministic trace ordering;
* deterministic planning-rule provenance ordering;
* no insignificant whitespace;
* no undefined values;
* identical serialization for equivalent caller orderings.

## 40.15 Immutability

Test:

* top-level admission cannot mutate;
* admitted-work-package array cannot mutate;
* admitted-work-package objects cannot mutate;
* recommendation arrays cannot mutate;
* trace arrays cannot mutate;
* planning-rule provenance cannot mutate;
* actor cannot mutate;
* reason cannot mutate;
* admission provenance cannot mutate;
* input arrays remain unchanged;
* input objects remain unchanged;
* no mutable references retained.

## 40.16 Runtime separation

Verify that Capability 008A does not:

* execute work;
* schedule work;
* assign work;
* publish events;
* generate execution events;
* calculate execution state;
* retry work;
* persist admissions;
* call a queue;
* call a network;
* infer outcomes;
* generate evidence;
* invoke AI.

## 40.17 Legacy separation

Verify:

* no dependency on legacy `RuntimeExecutionPlan`;
* no reinterpretation of `actionIds`;
* no reinterpretation of `recommendationId`;
* no legacy type promotion;
* no reverse adapter from legacy to canonical.

## 40.18 Architecture

Verify:

* one canonical owner;
* domain does not depend on engines;
* no package cycle;
* exports resolve from `@ginzaaipro/domain`;
* Capability 007 files remain unchanged;
* ADR-0008 remains respected;
* ADR-0009 is implemented as written.

Every failure code in §33 shall have at least one focused test.

---

# 41. Verification Requirements

Implementation verification shall include:

* focused unit tests;
* domain typecheck;
* domain build;
* dependent-package typechecks;
* package builds;
* public-export verification;
* dependency-direction verification;
* cycle detection;
* linting or formatting where configured;
* `git diff --check`.

# 42. Implementation Stop Conditions

Implementation shall halt if repository inspection shows that:

1. ADR-0009 has not been formally accepted.
2. This specification has not been formally accepted.
3. `ExecutionPlan` does not expose canonical identity.
4. `ExecutionPlan` does not expose organization identity.
5. `ExecutionPlan` does not expose work-package identities.
6. Work packages do not expose recommendation bindings.
7. Work packages do not expose trace sets.
8. Plan-level trace sets cannot be validated against work-package traces.
9. `ExecutionPlan.planningRuleProvenance[]` lacks canonical equality or ordering semantics.
10. Planning-policy provenance is missing or ambiguous.
11. Execution-plan schema version is missing or ambiguous.
12. Existing identifier conventions conflict with this specification.
13. Existing timestamp conventions conflict with this specification.
14. Existing serialization conventions conflict with this specification.
15. Capability 007 would need to be modified.
16. Legacy `RuntimeExecutionPlan` would need to be promoted or reinterpreted.
17. An accepted ADR conflicts with this specification.
18. Identity cannot be implemented deterministically.
19. An unapproved dependency would be required.
20. A genuinely new architectural decision is necessary.

A halt report shall identify:

* exact blocker;
* affected artifact;
* affected HCES section;
* minimum amendment required;
* whether an ADR is required;
* files inspected;
* confirmation that no speculative implementation occurred.

---

# 43. Acceptance Criteria

HCES-0008A is specification-complete when it establishes:

* one canonical runtime-admission owner;
* one canonical domain contract;
* exact plan binding;
* exact work-package admission semantics;
* exact organization invariants;
* exact recommendation preservation;
* set-valued trace preservation;
* array-valued planning-rule provenance preservation;
* planning-policy provenance preservation;
* execution-plan schema provenance;
* admission actor semantics;
* admission reason semantics;
* admission timestamp rules;
* admission policy provenance;
* deterministic identity;
* deterministic serialization;
* deterministic validation order;
* complete failure codes;
* deep immutability;
* append-only semantics;
* package boundaries;
* legacy separation;
* focused verification requirements;
* implementation stop conditions.

---

# 44. Governance Decision

Capability 008A implementation required:

1. ADR-0009 is formally accepted.
2. This specification is placed at:

```text
governance/hces/HCES-0008A-RuntimeAdmission.md
```

3. This specification is reviewed against:

   * the Platform Constitution;
   * ADR-0007;
   * ADR-0008;
   * ADR-0009;
   * HCES-0007;
   * HCES-0007A;
   * the canonical verified `ExecutionPlan` contract;
   * the legacy `RuntimeExecutionPlan` contract solely to confirm separation.

4. Any genuine conflict is resolved through governance.

5. This specification is formally accepted as the canonical implementation contract.

These prerequisites were satisfied. RuntimeAdmission implementation is complete
and verified PASS.

---

# 45. Post-Acceptance Sequence

The required sequence is:

```text
ADR-0009 acceptance
        ↓
HCES-0008A acceptance
        ↓
RuntimeAdmission implementation
        ↓
RuntimeAdmission implementation verification
        ↓
HCES-0008 revision
        ↓
ExecutionEvent implementation
        ↓
Capability 008 verification
        ↓
RR-0008
```

The exact VVR identifier shall be selected according to repository naming conventions without creating identifier ambiguity.

---

# 46. Final Normative Statement

`RuntimeAdmission` is the sole canonical immutable boundary between
runtime-admissible execution planning and runtime activity.

It records exactly:

* which runtime-admissible `ExecutionPlan` governs runtime;
* which work packages are admitted;
* which organization owns the admission;
* which recommendations and traces produced the admitted work;
* which planning rules and policies apply;
* who or what admitted the work;
* when and under which admission policy the decision occurred.

It does not execute, schedule, assign, retry, persist, observe outcomes, generate evidence, or control workflow state.

A plan is not permission to execute.

Runtime begins only after explicit governed admission.

Capability 008A implementation is complete and verified PASS. It is not
released. No Release Record exists, and specification acceptance,
implementation completion, VVR acceptance, successful tests, typecheck,
build, staging, merge, or commit do not authorize release or runtime
deployment.
