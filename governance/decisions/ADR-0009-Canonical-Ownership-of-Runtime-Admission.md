# ADR-0009 — Canonical Ownership of Runtime Admission

## Architecture Decision Record

---

## 0. Document Control

| Field                  | Value                                                                           |
| ---------------------- | ------------------------------------------------------------------------------- |
| ADR ID                 | ADR-0009                                                                        |
| Title                  | Canonical Ownership of Runtime Admission                                        |
| Version                | 1.0.0                                                                           |
| Status                 | Accepted                                                                        |
| Decision Type          | Canonical Architecture                                                          |
| Capability Context     | Capability 008 — ExecutionEvent                                                 |
| Supersedes             | No accepted ADR                                                                 |
| Related Decisions      | ADR-0007; ADR-0008                                                              |
| Related Specifications | HCES-0007; HCES-0007A; HCES-0008                                                |
| Canonical Owner        | `@ginzaaipro/domain`                                                            |
| Governing Doctrine     | Platform Constitution; Governance Operating System; Minimum Complexity Doctrine |

---

# 1. Decision Question

> Which artifact shall own canonical runtime admission, and how shall it preserve execution-plan, work-package, organization, trace, and planning provenance?

---

# 2. Context

Capability 007 established and verified the canonical planning model:

```text
Recommendation
      ↓
ExecutionPlanningEngine
      ↓
ExecutionPlan
```

`ExecutionPlan` defines what should be done.

Capability 008 introduces `ExecutionEvent`, which records what actually happened during execution.

Between those concepts is an architectural boundary that has not yet been canonically defined:

```text
ExecutionPlan
      ↓
?
      ↓
ExecutionEvent
```

A runtime system must not execute an entire plan merely because the plan exists.

Before execution begins, the platform must identify:

* which plan has been accepted for runtime;
* which work packages are admitted;
* under which organization;
* under which traces;
* with which planning provenance;
* under which runtime admission decision.

The repository contains a type named `RuntimeExecutionPlan`, but ADR-0008 classifies it as a legacy runtime artifact rather than the canonical owner of runtime admission.

The existing legacy artifact does not expose the provenance necessary for Capability 008, including:

* canonical `executionPlanId`;
* admitted work-package identities;
* organization binding sufficient for cross-artifact validation;
* trace context;
* planning-rule provenance;
* runtime admission provenance.

Promoting the existing type without an architectural decision would silently reverse ADR-0008 and allow a legacy model to define the runtime boundary.

---

# 3. Problem Statement

Without a canonical runtime-admission artifact, GinzaAIpro cannot deterministically establish:

* whether a work package is authorized to enter runtime;
* which runtime-admissible `ExecutionPlan` governs the occurrence;
* which organization owns the runtime occurrence;
* which planning traces apply;
* which planning rules and policies produced the admitted work;
* whether an `ExecutionEvent` belongs to an admitted unit of work.

This creates several risks:

1. **Plan-execution collapse**
   The existence of a plan could be treated as implicit authorization to execute.

2. **Provenance loss**
   Runtime events could become detached from the recommendations, rules, policies, schemas, and traces that produced the plan.

3. **Legacy promotion by accident**
   The existing `RuntimeExecutionPlan` could become canonical merely because it is available.

4. **Event-model overload**
   `ExecutionEvent` could be forced to compensate for the missing admission boundary.

5. **Mutable workflow leakage**
   Runtime admission, execution state, scheduling, and event facts could become mixed into one object.

6. **Capability 007 instability**
   Verified canonical planning contracts could be modified to satisfy runtime
   needs.

---

# 4. Architectural Forces

The decision must preserve the following forces.

## 4.1 Governance before automation

No plan may enter runtime without an explicit governed admission artifact.

## 4.2 Planning/runtime separation

`ExecutionPlan` must remain a planning artifact.

It shall not become mutable runtime state.

## 4.3 Canonical-capability protection

Capability 007 is implemented, verified, and canonical, but not released. No
Release Record exists.

This decision shall not require modifying its contracts.

## 4.4 Provenance continuity

Runtime admission must preserve sufficient upstream provenance for downstream event, outcome, evidence, and audit capabilities.

## 4.5 Minimum complexity

The platform requires one small canonical admission contract, not a workflow engine, scheduler, orchestration platform, or event-sourcing system.

## 4.6 Determinism

Runtime admission must be deterministic, immutable, canonically serializable, and free from hidden runtime state.

## 4.7 Legacy containment

Legacy artifacts may be adapted at boundaries but shall not silently own new canonical semantics.

---

# 5. Options Considered

## Option A — Promote the existing `RuntimeExecutionPlan`

Under this option, the legacy `RuntimeExecutionPlan` would be expanded and declared canonical.

### Advantages

* Reuses an existing name and type.
* May reduce short-term file creation.
* Could preserve compatibility with legacy consumers.

### Disadvantages

* Conflicts with ADR-0008’s legacy classification.
* Existing semantics are based on `actionIds` and `recommendationId`, not canonical work-package admission.
* Risks retaining assumptions from the pre-Capability-007 architecture.
* Requires semantic reinterpretation of existing fields.
* Makes migration and canonical ownership ambiguous.
* Could create backward-compatibility pressure before the runtime model is stable.

### Evaluation

Rejected.

The cost of preserving the legacy name is greater than the value of an explicit canonical boundary.

---

## Option B — Use `ExecutionPlan` directly as runtime admission

Under this option, a canonical `ExecutionPlan` would itself authorize runtime execution.

### Advantages

* No additional domain artifact.
* Minimal apparent implementation complexity.

### Disadvantages

* Collapses planning and runtime authorization.
* Implies every planned work package is admitted.
* Cannot represent partial admission.
* Cannot represent independent admission decisions.
* Encourages runtime mutation of a planning artifact.
* Violates the planning/runtime separation established by Capability 007.
* Weakens governance-before-automation.

### Evaluation

Rejected.

A plan expresses intended work, not runtime authorization.

---

## Option C — Let `ExecutionEvent` carry admission semantics

Under this option, the first event would implicitly establish that execution was admitted.

### Advantages

* Avoids a separate admission object.
* May appear simple for small runtimes.

### Disadvantages

* Makes execution begin before authorization is recorded.
* Confuses authorization with observation.
* Forces events to carry missing plan-admission context.
* Prevents validation before the first occurrence.
* Weakens auditability.
* Makes an event both a runtime fact and an authorization artifact.

### Evaluation

Rejected.

An event records what happened. It cannot retroactively authorize what was allowed to happen.

---

## Option D — Introduce a new canonical `RuntimeAdmission`

Under this option, GinzaAIpro introduces a small immutable domain contract representing the governed admission of selected work packages from one runtime-admissible `ExecutionPlan`.

### Advantages

* Preserves planning/runtime separation.
* Protects Capability 007.
* Provides an explicit governance boundary.
* Supports partial plan admission.
* Preserves upstream provenance.
* Gives `ExecutionEvent` a stable upstream reference.
* Avoids promoting the legacy runtime artifact.
* Requires no runtime engine or infrastructure.
* Supports future scheduling and execution capabilities without predefining them.

### Disadvantages

* Introduces one additional canonical domain concept.
* Requires migration or adaptation for legacy runtime consumers.
* Adds a new specification before Capability 008 can be implemented.

### Evaluation

Accepted.

---

# 6. Decision

GinzaAIpro shall introduce a new canonical domain artifact:

```text
RuntimeAdmission
```

`RuntimeAdmission` shall be the sole canonical owner of runtime admission.

It answers:

> What portion of a runtime-admissible ExecutionPlan has been explicitly admitted into runtime, under which organization, traces, provenance, and admission decision?

The existing `RuntimeExecutionPlan` shall remain a legacy artifact.

It shall not be promoted, reinterpreted, or silently expanded into the canonical admission model.

---

# 7. Canonical Runtime Boundary

The canonical architecture becomes:

```text
Recommendation
      ↓
ExecutionPlanningEngine
      ↓
ExecutionPlan
      ↓
RuntimeAdmission
      ↓
Execution Engine
      ↓
ExecutionEvent
      ↓
ObservedOutcome
      ↓
Execution-Derived Evidence
      ↓
Learning
```

The semantic boundaries are:

| Artifact                   | Governing Question                                |
| -------------------------- | ------------------------------------------------- |
| `ExecutionPlan`            | What should be done?                              |
| `RuntimeAdmission`         | What planned work is authorized to enter runtime? |
| `ExecutionEvent`           | What actually happened?                           |
| `ObservedOutcome`          | What changed?                                     |
| Execution-derived evidence | What claims are supported?                        |

---

# 8. Canonical Ownership

## 8.1 Package ownership

`@ginzaaipro/domain` shall own:

* `RuntimeAdmission`;
* `RuntimeAdmissionId`;
* `RuntimeAdmissionStatus`, if required by its specification;
* admitted-work-package references;
* admission provenance;
* admission identity;
* admission validation;
* admission serialization;
* admission failure codes.

## 8.2 Engine ownership

No engine is authorized by this ADR.

A future admission service, policy engine, or execution engine may create or consume the canonical domain contract, but it shall not own or redefine it.

## 8.3 Dependency direction

The canonical dependency direction remains:

```text
engines
   ↓
domain
```

The domain package shall not depend on engines, infrastructure, persistence, or applications.

---

# 9. RuntimeAdmission Responsibility

`RuntimeAdmission` shall:

* reference exactly one runtime-admissible `ExecutionPlan`;
* reference exactly one organization;
* admit one or more work packages from that plan;
* preserve relevant work-package trace sets;
* preserve the planning-rule provenance relevant to admitted work;
* preserve policy and schema provenance;
* record the explicit admission decision;
* be deterministic;
* be immutable;
* be canonically serializable;
* support downstream validation by `ExecutionEvent`.

`RuntimeAdmission` shall not:

* execute work;
* schedule work;
* assign actors;
* calculate runtime state;
* retry work;
* create events;
* persist itself;
* call external systems;
* mutate the execution plan;
* infer outcomes;
* generate evidence.

---

# 10. Binding Model

Every `RuntimeAdmission` shall bind to:

* exactly one `ExecutionPlan`;
* exactly one organization;
* one or more admitted work packages from that plan.

The cardinality is:

```text
One ExecutionPlan
    └── zero or more RuntimeAdmissions

One RuntimeAdmission
    ├── exactly one ExecutionPlan
    └── one or more admitted WorkPackages

One WorkPackage
    └── zero or more RuntimeAdmissions

One ExecutionEvent
    └── exactly one RuntimeAdmission
```

A work package may appear in more than one admission only when a future governed policy explicitly permits re-admission.

This ADR does not authorize re-admission behavior.

The initial `RuntimeAdmission` specification shall define whether duplicate admission is prohibited or merely outside domain-level historical validation.

---

# 11. Canonical Identity Requirements

The future `RuntimeAdmission` specification shall define a deterministic identity based on canonical admission material.

At minimum, identity material shall include:

* `organizationId`;
* `executionPlanId`;
* admitted work-package identifiers;
* admission decision identifier or admission ordinal;
* admission timestamp;
* admission policy provenance;
* schema version.

Identity shall not use:

* randomness;
* hidden counters;
* current system time;
* mutable state;
* persistence-generated IDs;
* locale-dependent formatting.

The precise identity algorithm belongs in the RuntimeAdmission HCES, not in this ADR.

---

# 12. Organization Provenance

`RuntimeAdmission.organizationId` shall equal:

```text
ExecutionPlan.organizationId
```

No cross-organization admission is permitted.

The admission constructor shall reject any organization mismatch.

`ExecutionEvent.organizationId` shall subsequently be validated against:

```text
RuntimeAdmission.organizationId
```

This creates the canonical chain:

```text
ExecutionPlan.organizationId
          =
RuntimeAdmission.organizationId
          =
ExecutionEvent.organizationId
```

---

# 13. Execution-Plan Provenance

`RuntimeAdmission` shall preserve:

* `executionPlanId`;
* execution-plan schema version;
* planning-policy provenance;
* relevant planning-rule provenance;
* admitted work-package identities.

The admission artifact shall not copy the entire execution plan unless the future HCES demonstrates that full embedding is necessary.

Canonical references plus deterministic provenance are preferred.

---

# 14. Work-Package Admission

Admission occurs at the work-package level.

Each admitted work-package entry shall identify one canonical work package from the referenced `ExecutionPlan`.

The future HCES shall define a structure equivalent to:

```ts
type AdmittedWorkPackage = Readonly<{
  workPackageId: ExecutionPlanWorkPackageId;
  traceIds: readonly TraceId[];
  planningRuleProvenance: readonly PlanningRuleProvenance[];
  recommendationIds: readonly RecommendationId[];
}>;
```

The exact field names and existing canonical types shall be aligned with repository contracts during specification.

The admission constructor shall verify:

* each work package exists in the plan;
* no work package is duplicated;
* the organization remains consistent;
* copied provenance equals the plan’s canonical values;
* copied recommendation bindings equal the work package’s canonical values;
* copied trace sets equal the work package’s canonical trace sets.

No missing or conflicting work-package provenance may be silently repaired.

---

# 15. Trace Semantics

Capability 007 uses trace sets:

```text
ExecutionPlan.traceIds[]
WorkPackage.traceIds[]
```

Runtime admission shall preserve this set-valued model.

It shall not collapse multiple planning traces into one trace.

## 15.1 Admission trace set

`RuntimeAdmission` shall expose an admission-level trace set equal to the canonical union of the admitted work packages’ trace sets.

Formally:

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
* immutable.

## 15.2 Work-package trace set

Each admitted work package shall preserve the exact canonical trace set from the referenced `ExecutionPlan` work package.

## 15.3 Event trace binding

`ExecutionEvent` shall not require equality with one singular plan trace.

Instead, the revised HCES-0008 shall define an explicit event trace set or event trace selection rule.

The preferred default is:

* each event references one `traceId`;
* that `traceId` must be a member of the admitted work package’s trace set.

When one occurrence legitimately belongs to several traces, the future HCES may instead permit a canonical non-empty event `traceIds` set.

The exact event representation shall be resolved in the revised HCES-0008, but it must preserve set membership rather than assume singular equality across the entire plan.

---

# 16. Planning-Rule Provenance

Capability 007 exposes:

```text
planningRuleProvenance[]
```

Runtime admission shall preserve array-valued provenance.

It shall not arbitrarily select one planning rule for the entire plan or admission.

For each admitted work package, the admission artifact shall preserve the exact relevant planning-rule provenance associated with that work package.

If the canonical `ExecutionPlan` only exposes plan-level planning-rule provenance and does not map rules to individual work packages, the RuntimeAdmission HCES shall specify one of the following without modifying Capability 007:

1. preserve the complete plan-level provenance array for every admitted work package; or
2. preserve the complete plan-level provenance once at admission level.

The default decision shall be:

> Preserve the full canonical `ExecutionPlan.planningRuleProvenance[]` at the admission level unless the canonical plan already exposes a deterministic work-package-specific mapping.

No rule shall be selected by array position, lexical minimum, version maximum, or inference.

---

# 17. Admission Provenance

`RuntimeAdmission` shall add runtime-admission provenance distinct from planning provenance.

The future HCES shall define, at minimum:

* admission policy identifier;
* admission policy version;
* admission schema version;
* admitting actor;
* admission timestamp;
* admission reason or decision code;
* source execution-plan identifier.

This provenance records why the plan or selected work packages were authorized to enter runtime.

It does not replace planning provenance.

---

# 18. Admission Actor

The future specification shall define an immutable admission actor.

The actor may represent:

* human approval;
* governed automation;
* system policy;
* authorized service.

The actor who admits work is not necessarily:

* the planner;
* the executor;
* the runtime event actor;
* the event recorder;
* the work-package owner.

These identities shall remain semantically distinct.

---

# 19. Admission Status

This ADR does not authorize a mutable admission lifecycle.

The preferred initial model is an immutable positive admission fact:

```text
ADMITTED
```

Revocation, suspension, expiration, rejection, or replacement shall not be introduced unless required by the RuntimeAdmission HCES.

If later required, those concepts should be represented as separate immutable decisions or events rather than mutation of the accepted admission artifact.

---

# 20. Legacy RuntimeExecutionPlan

## 20.1 Classification

The existing `RuntimeExecutionPlan` remains:

```text
LEGACY RUNTIME ARTIFACT
```

It is not the canonical owner of runtime admission.

## 20.2 Restrictions

New canonical capabilities shall not:

* depend on it as the source of runtime authorization;
* reinterpret `actionIds` as work-package identifiers;
* reinterpret `recommendationId` as an execution-plan identity;
* infer trace provenance from absent fields;
* expand its semantics without governance.

## 20.3 Compatibility

Where legacy consumers still require `RuntimeExecutionPlan`, a future adapter may translate:

```text
RuntimeAdmission
      ↓
Legacy RuntimeExecutionPlan
```

The adapter shall be one-way from canonical to legacy.

Legacy semantics shall not flow upstream into the canonical contract.

## 20.4 Deprecation

This ADR does not require immediate deletion of the legacy artifact.

Removal shall occur only through a separate governed migration decision after all consumers are identified.

---

# 21. Capability Numbering

`RuntimeAdmission` is an architectural prerequisite discovered during Capability 008.

It does not require renumbering or modifying Capability 007.

The governance sequence shall be:

```text
Capability 007 — Execution Planning
      ↓
ADR-0009 — Runtime Admission ownership
      ↓
HCES-0008A — RuntimeAdmission
      ↓
HCES-0008 — ExecutionEvent, revised
      ↓
Implementation verification
      ↓
Capability release
```

The exact specification identifier may follow the repository’s accepted convention.

Recommended identifier:

```text
HCES-0008A — RuntimeAdmission
```

This preserves Capability 008 as the runtime-boundary development stage while allowing `ExecutionEvent` to retain HCES-0008.

An alternative new capability number requires separate governance and is not justified at this stage.

---

# 22. Required RuntimeAdmission Specification

Before revising HCES-0008, author:

```text
HCES-0008A — RuntimeAdmission
```

It shall normatively define:

* canonical TypeScript contract;
* authoritative field sources;
* execution-plan binding;
* admitted-work-package contract;
* trace-set preservation;
* planning-rule provenance preservation;
* policy and schema provenance;
* admission actor;
* timestamp rules;
* deterministic identity;
* deterministic serialization;
* deterministic validation order;
* failure codes;
* deep immutability;
* package exports;
* legacy compatibility boundaries;
* focused tests;
* implementation stop conditions.

Implementation of `RuntimeAdmission` shall precede implementation of `ExecutionEvent`.

---

# 23. Required HCES-0008 Revision

After `RuntimeAdmission` is accepted, HCES-0008 shall be revised to:

1. replace `RuntimeExecutionPlan` with `RuntimeAdmission`;
2. replace singular plan-trace equality with governed trace membership or set semantics;
3. preserve array-valued `planningRuleProvenance`;
4. bind each event to exactly one admitted work package;
5. validate organization against the admission;
6. validate the event’s plan identity through the admission;
7. obtain runtime-admission provenance from the admission artifact;
8. remove assumptions that conflict with canonical `ExecutionPlan`;
9. retain Capability 007 unchanged.

---

# 24. Consequences

## 24.1 Positive consequences

This decision:

* establishes a clear constitutional boundary between planning and execution;
* prevents plans from becoming implicit commands;
* protects the canonical planning capability;
* preserves set-valued trace provenance;
* preserves array-valued planning-rule provenance;
* gives `ExecutionEvent` a stable upstream contract;
* contains the legacy runtime model;
* supports partial plan admission;
* improves auditability;
* preserves minimum complexity by introducing only one domain artifact.

## 24.2 Negative consequences

This decision:

* delays `ExecutionEvent` implementation until RuntimeAdmission is specified and implemented;
* introduces an additional governance artifact;
* may require a future legacy adapter;
* requires runtime consumers to migrate over time.

These costs are accepted because they prevent a larger architectural collapse between planning, authorization, and execution.

---

# 25. Rejected Future Complexity

This ADR shall not be used to justify immediate implementation of:

* workflow orchestration;
* schedulers;
* runtime queues;
* distributed locks;
* lease management;
* retry engines;
* execution state stores;
* policy engines;
* approval interfaces;
* event brokers;
* event sourcing;
* multi-tenant runtime infrastructure.

Those capabilities require independent evidence and governance.

---

# 26. Validation of the Decision

This decision is considered architecturally successful if:

1. `ExecutionPlan` remains unchanged.
2. A canonical `RuntimeAdmission` can reference selected work packages deterministically.
3. Runtime admission preserves organization, trace, recommendation, rule, policy, and schema provenance.
4. `ExecutionEvent` can validate its upstream admission without consulting a legacy artifact.
5. The legacy `RuntimeExecutionPlan` remains isolated.
6. No runtime engine is required to define the domain contract.
7. No reverse package dependency is introduced.
8. No mutable workflow model is introduced.
9. Partial plan admission is representable.
10. Canonical serialization and identity are possible without hidden state.

---

# 27. Implementation and Verification Status

HCES-0008A is Accepted. `RuntimeAdmission` implementation is complete and
verified PASS.

The verified implementation consumes the canonical verified `ExecutionPlan`
contract for construction and tests. Operational runtime use remains stricter:
the referenced plan must first cross every applicable release and
admissibility boundary. A plan alone is not permission to execute.

This status does not authorize release, deployment, or downstream runtime
implementation. No Release Record exists for Capability 008A.

---

# 28. Governance Sequence

The governed sequence is:

```text
ADR-0009
      ↓
HCES-0008A — RuntimeAdmission
      ↓
RuntimeAdmission implementation
      ↓
VVR-0008A-RuntimeAdmission
      ↓
HCES-0008 v1.1 — ExecutionEvent
      ↓
ExecutionEvent implementation
      ↓
VVR-0008A — ExecutionEvent implementation verification
      ↓
VVR-0008 — Capability verification
      ↓
RR-0008 — Release
```

Artifact names may be adjusted to avoid identifier collision, but the order shall remain unchanged.

The sequence through RuntimeAdmission implementation and VVR-0008A is
complete. Later stages remain independently governed.

---

# 29. Decision

**Decision:** Accept Option D.

GinzaAIpro shall introduce `RuntimeAdmission` as the sole canonical owner of runtime admission.

The legacy `RuntimeExecutionPlan` shall remain non-canonical and shall not govern Capability 008.

The canonical `ExecutionPlan` shall remain unchanged.

Trace provenance shall remain set-valued.

Planning-rule provenance shall remain array-valued.

`ExecutionEvent` shall bind to runtime through `RuntimeAdmission`, not directly through the legacy runtime artifact.

---

# 30. Final Normative Statement

A plan is not permission to execute.

`ExecutionPlan` defines intended governed work.

`RuntimeAdmission` defines which planned work is authorized to enter runtime.

`ExecutionEvent` records what actually happened after that authorization.

These concepts shall remain separate, immutable, provenance-complete, and independently governed.
