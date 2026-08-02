# DISC-0007 — Organization Boundary Provenance

**Status:** Discovery Complete — Resolved by accepted ADR-0007

# Present Governance Disposition

Accepted ADR-0007 selected Candidate C and established direct canonical
Organization provenance across the operational artifact chain. The required
`organizationId` propagation was implemented and verified through the governed
downstream artifacts.

The affected capabilities remain verified but not released wherever no tracked
accepted Release Record exists. Implementation or verification evidence does
not itself authorize release.

# Historical Discovery Record

Except for the present governance disposition and resolution stated above and
below, the repository observations, gap analysis, alternatives, risks, and
recommendations in this report record the state and reasoning at discovery
time. Present-tense wording within those historical sections describes that
discovery-time state only.

# Discovery-Time Problem

HCES-0007A requires deterministic organization-compatibility checks across
multiple `OperationalRecommendation` artifacts.

The current `OperationalRecommendation` contract has no organization identity.
Supplying organization identity separately during planning would create a
side-channel dependency contrary to:

- ADR-0006 — Priority Artifact Completeness;
- HCES-0000 — deterministic execution without hidden state; and
- HCES-0007 — deterministic multi-recommendation admissibility.

This report identifies where organization identity already exists, where it is
lost, and which candidate offers the smallest complete correction. It makes no
architectural decision and authorizes no implementation.

# Discovery-Time Current State

The canonical domain terminology is `Organization`, represented by the
`Organization` aggregate root and identifier-based ownership relationships.
Across `packages/domain`, the established ownership field is:

`organizationId: Identifier`

The current operational-intelligence chain has the following organization
state:

| Stage | Current artifact or contract | Organization identity | Current evidence |
| --- | --- | --- | --- |
| Capture boundary | `CaptureInput` | Present | Required `organizationId`; Capture compares it with `EngineContext.organizationId`. |
| Canonical observation | `BusinessSignal` | Present | Required immutable `organizationId`; capture identity includes it. |
| Canonical validated fact | `Evidence` | Present | Required immutable `organizationId`; Evidence construction and identity preserve Organization ownership. |
| Evidence Semantics | Normative semantic record in SAS-0002A | Specified, not implemented | Every semantic record belongs to one Organization; semantic identity includes `organizationId`. No runtime `SemanticFact` or semantic-record entity currently exists in `packages/domain`. |
| Operational state | `OperationalCondition` | Present | Required immutable `organizationId` beside `semanticFactIds` and `traceId`. |
| Operational consequence | `OperationalLeakage` | Missing | Holds source condition IDs and trace identity, but no organization identity. |
| Governed priority | `OperationalLeakagePriority` | Missing | Holds source leakage ID, category, policy reference, and trace identity, but no organization identity. |
| Governed recommendation | `OperationalRecommendation` | Missing | Holds source priority ID, rule/policy provenance, and trace identity, but no organization identity. |
| Execution planning | HCES-0007/HCES-0007A | Required for compatibility but not yet materialized | HCES-0007 requires organization compatibility; HCES-0007A cannot perform it from current recommendation inputs. |
| Existing legacy execution contract | Current `ExecutionPlan` domain entity | Present | The released legacy entity already has direct `organizationId`, but it consumes the legacy `Recommendation` contract and does not resolve missing provenance in the new operational pipeline. |

Organization ownership is therefore not a new concept. The earlier legacy
intelligence lifecycle already preserves direct `organizationId` fields across
`Intelligence`, `PriorityProfile`, `Recommendation`, and `ExecutionPlan`.

# Provenance Trace

The implemented and specified provenance path is:

```text
Adapter-supplied CaptureInput.organizationId
                    ↓
          BusinessSignal.organizationId
                    ↓
              Evidence.organizationId
                    ↓
  Semantic record organizationId (specified; runtime pending)
                    ↓
       OperationalCondition.organizationId
                    ↓
          OperationalLeakage: MISSING
                    ↓
     OperationalLeakagePriority: MISSING
                    ↓
      OperationalRecommendation: MISSING
                    ↓
       Execution planning compatibility blocked
```

Organization identity originates at the canonical capture boundary. The
adapter supplies it through `CaptureInput`, the Capture Engine validates it
against `EngineContext`, and `BusinessSignal` is the first canonical domain
artifact to retain it.

Evidence preserves the same ownership boundary. ADR-0018 requires every
canonical Evidence record to belong to exactly one Organization. SAS-0002A
continues that rule into Evidence Semantics and includes Organization identity
in both semantic-fact and semantic-record identity material.

No canonical semantic runtime entity exists yet. Nevertheless,
`OperationalCondition` already contains the required organization identity, so
the pending semantic implementation does not require a new ownership concept
for this downstream correction.

For Capabilities 003–007, the earliest necessary propagation source is the
existing `OperationalCondition.organizationId` field.

# Point of Identity Loss

Organization identity is first lost at the Capability 004 boundary:

```text
OperationalCondition → OperationalLeakage
```

`OperationalCondition` contains `organizationId`, but `OperationalLeakage`
contains only:

- its own identifier;
- category and descriptive content;
- `sourceConditionIds`;
- `traceId`;
- rule and schema versions;
- evidence strength; and
- creation time.

`sourceConditionIds` cannot supply organization ownership by themselves.
`Identifier` is deliberately opaque and untyped; it does not encode an
Organization relationship. Recovering Organization from a condition ID would
require repository access or an external mapping, both prohibited inside a
deterministic engine.

The loss then propagates:

- `OperationalLeakagePriority` cannot obtain Organization from
  `sourceOperationalLeakageId`;
- `RecommendationRuleEngine` receives an `OperationalLeakagePriority` with no
  Organization and therefore cannot place Organization on
  `OperationalRecommendation`;
- `OperationalRecommendation` cannot preserve information that its complete
  canonical input does not contain; and
- `ExecutionPlanningEngine` cannot compare recommendation Organizations
  without an external side channel.

The current recommendation identity material includes source priority, trace,
rule, policy, and schema data, but not organization identity.

# Existing Terminology Conflicts

## Organization

`Organization` is the canonical business ownership boundary in
`packages/domain`. It is an aggregate root, and direct `organizationId` fields
are already used by canonical business signals, Evidence, Intelligence,
customers, employees, jobs, invoices, recommendations, execution plans,
actions, outcomes, and learning records.

This is the strongest existing terminology and implementation convention.

## Tenant

`tenantId` appears in dashboard-local runtime/domain scaffolding, older
documentation, and experimental COSMOS research. The canonical registry also
states that multi-tenant isolation is mandatory. However:

- no canonical `Tenant` entity exists in `packages/domain`;
- dashboard `tenantId` values are optional strings rather than domain
  `Identifier` values; and
- no governed equivalence between Tenant and Organization is currently
  defined.

Tenant terminology therefore represents an infrastructure or legacy isolation
concern, not a replacement for canonical Organization ownership. Treating it
as interchangeable without a separate decision would create ambiguity.

## Business, Account, and Workspace

No canonical `businessId`, `accountId`, or `workspaceId` ownership contract was
found in the current domain package. References to business concepts describe
business data or behavior, and workspace references describe repository or
tooling structure rather than canonical ownership.

These terms provide no existing alternative source for operational artifact
scope.

## Kernel Organization Identity

`packages/kernel` uses a runtime `OrganizationId` string. The canonical domain
uses `Identifier`. Kernel terminology confirms the boundary's importance but
must not become a dependency of domain or deterministic engine contracts.

# Candidate Analysis

| Criterion | Candidate A: Recommendation only | Candidate B: Priority and Recommendation | Candidate C: Propagate from earlier artifact | Candidate D: Governed scope object |
| --- | --- | --- | --- | --- |
| Minimum complexity | Fewest fields, but cannot be populated canonically | Fewer changed contracts, but still cannot be populated canonically | More field propagation, but smallest complete end-to-end correction | Highest conceptual and migration complexity |
| ADR-0006 | Violates completeness through a planning-time or recommendation-engine side channel | Moves the side channel to prioritization | Conforms by keeping every downstream artifact self-sufficient | Could conform, but adds an abstraction not otherwise required |
| Deterministic replay | Organization source is missing | Organization source is missing from leakage | Stable direct provenance is available from `OperationalCondition` | Deterministic only after new scope semantics are designed |
| Immutable provenance | Begins too late to prove origin | Begins too late to prove origin | Preserves the existing Organization lineage without lookup | Wraps existing provenance without adding necessary information |
| Cross-organization isolation | Cannot be enforced without supplemental input | Cannot be enforced at the priority boundary without supplemental input | Can be enforced at every multi-input transition | Could enforce it, but risks multiple competing scope concepts |
| Multi-recommendation compatibility | Planning can compare only if a prohibited value is injected | Planning can compare after priority injection, but upstream integrity is unproven | Recommendations carry canonical ownership directly | Comparison is possible after all artifacts migrate to the new object |
| Existing terminology | Uses the correct field name but at the wrong starting point | Uses the correct field name but at the wrong starting point | Reuses the established `organizationId: Identifier` convention | Introduces terminology absent from released domain contracts |
| Migration impact | Recommendation constructor, engine, and tests | Priority and recommendation constructors, engines, and tests | Leakage, priority, recommendation, planning contracts, engines, and tests | Every affected contract plus a new value object and serialization model |
| Future repository/API boundary | Risks accepting caller-asserted organization | Risks accepting caller-asserted organization at priority creation | Enables direct partitioning and authorization from canonical artifacts | Adds mapping and serialization burden at every boundary |

## Candidate A — Add `organizationId` only to `OperationalRecommendation`

Advantages:

- changes the fewest domain entities; and
- gives a future planning engine a directly comparable field.

Risks and compatibility implications:

- `RecommendationRuleEngine` receives only an
  `OperationalLeakagePriority`, Released rules, and explicit evaluation time;
- the priority artifact currently contains no organization identity;
- adding organization to the engine input or evaluation context as factual
  provenance would be a side channel; and
- deriving it from the source priority identifier would require a lookup or an
  undocumented identifier encoding.

Required contract changes would begin at Recommendation, but the engine could
not satisfy the new constructor without violating ADR-0006. Determinism would
depend on caller-supplied supplemental data rather than canonical provenance.

Assessment: not viable as a standalone solution.

## Candidate B — Add `organizationId` to `OperationalLeakagePriority` and propagate it

Advantages:

- makes the current `RecommendationRuleEngine` input self-contained; and
- allows `OperationalRecommendation` to copy Organization identity without a
  new engine argument.

Risks and compatibility implications:

- `OperationalLeakagePriority` is derived from `OperationalLeakage`;
- `OperationalLeakage` currently contains no organization identity; and
- a future priority engine would need an external Organization value or source
  lookup to construct the priority artifact.

The priority artifact does not presently have sufficient upstream provenance
to obtain organization identity deterministically. Revising Leakage as well
turns this candidate into Candidate C.

Assessment: not viable as a standalone solution.

## Candidate C — Propagate Organization from the earliest necessary source

The earliest necessary source for Capabilities 004–007 is
`OperationalCondition.organizationId`, which already exists.

The propagation path would be:

```text
OperationalCondition.organizationId
                 ↓
OperationalLeakage.organizationId
                 ↓
OperationalLeakagePriority.organizationId
                 ↓
OperationalRecommendation.organizationId
                 ↓
ExecutionPlan.organizationId
```

Advantages:

- satisfies ADR-0006 without repository access or supplemental runtime data;
- preserves immutable provenance and deterministic replay;
- enables uniform-Organization validation at every multi-input capability;
- supports cross-organization isolation;
- aligns with the existing domain and legacy lifecycle convention; and
- gives future repositories and APIs an explicit canonical partition key.

Risks and compatibility implications:

- adds required constructor parameters to three released operational
  contracts;
- requires recommendation identity and future downstream identity rules to be
  reviewed for Organization participation;
- requires migration of existing in-memory fixtures and any serialized data;
  and
- must be implemented across every stage, because partial propagation would
  recreate the same blocker one capability later.

No field addition is required before `OperationalLeakage`.
`OperationalCondition` already contains the necessary direct Organization
identity. Earlier capture, Evidence, and semantic specifications already
preserve the same boundary.

Assessment: smallest complete candidate.

## Candidate D — Introduce a generalized governed scope object

Advantages:

- could eventually carry Organization plus additional governed scope
  dimensions; and
- could centralize future scope validation.

Risks and compatibility implications:

- no current requirement needs more than Organization ownership;
- no released canonical governed-scope object exists;
- all affected constructors, tests, serialization, repositories, and APIs
  would need a new mapping model;
- it would coexist with widespread direct `organizationId` fields; and
- Tenant, Organization, trace, policy, and execution scope could be conflated
  prematurely.

Assessment: reject unless a future requirement demonstrates multiple stable
scope dimensions that cannot be represented by existing identifiers.

# Minimum-Complexity Recommendation

Recommend Candidate C for decision by ADR: preserve a direct required
`organizationId: Identifier` beginning with the existing
`OperationalCondition` boundary and propagate it through every downstream
operational artifact.

This is the minimum-complexity recommendation because it reuses an existing
field, value object, aggregate boundary, and repository-wide terminology. It
adds no new abstraction and removes the need for runtime lookup or side-channel
context.

The direct field is preferable to the alternatives:

- a governed scope object is not justified by current requirements; and
- organization ownership cannot be safely derived from source artifact IDs,
  trace IDs, policy IDs, or other opaque identifiers.

This discovery recommendation is not an architectural decision. Identity
participation, migration policy, and compatibility treatment require the ADR
described below.

# Required Contract Changes

If Candidate C is accepted, the minimum contract impact is:

| Artifact | Required change | Earlier artifact revision required? |
| --- | --- | --- |
| `CaptureInput` | None; already supplies Organization. | No. |
| `BusinessSignal` | None; already preserves Organization. | No. |
| `Evidence` | None; already preserves Organization. | No. |
| Evidence Semantics | No conceptual change; SAS-0002A already requires Organization. Runtime materialization remains pending. | No new ownership concept. |
| `OperationalCondition` | No field addition; retain direct `organizationId`. Strengthen conformance tests if necessary. | This is the propagation source. |
| `OperationalLeakage` | Add required immutable direct `organizationId` and preserve it from all compatible source conditions. | Yes, this is the first missing contract. |
| `OperationalLeakagePriority` | Add required immutable direct `organizationId` copied from its source leakage. | Depends on revised Leakage. |
| `OperationalRecommendation` | Add required immutable direct `organizationId` copied from source priority. | Depends on revised Priority. |
| Canonical `ExecutionPlan` | Require and preserve direct Organization ownership from all compatible source recommendations. | Depends on revised Recommendation. |

Each affected contract would require constructor validation, getter-only
exposure, immutable preservation, public declaration generation, and a decision
on whether Organization participates in deterministic artifact identity.

The current legacy `ExecutionPlan` already contains `organizationId`, but its
legacy recommendation/action/status model differs from HCES-0007. Its presence
is precedent for direct ownership, not proof that the new planning transition
is currently complete.

# Required Engine Changes

No Capability 004 or Capability 005 engine currently exists in
`packages/engines`; those future implementations must begin with complete
artifacts rather than supplemental Organization context.

If Candidate C is accepted:

- a future leakage engine must reject mixed-Organization
  `OperationalCondition` inputs and copy the uniform Organization to each
  `OperationalLeakage`;
- a future priority engine must copy `OperationalLeakage.organizationId` into
  `OperationalLeakagePriority` and must not obtain ownership from a repository
  or runtime context;
- the existing `RecommendationRuleEngine` must read
  `OperationalLeakagePriority.organizationId` and pass it to
  `OperationalRecommendation` without adding an external engine-input field;
- recommendation deterministic identity must be reviewed so equal local
  identifiers from different Organizations cannot collide; and
- a future `ExecutionPlanningEngine` must compare recommendation Organizations,
  reject incompatible requests, and preserve the uniform Organization on the
  plan.

Explicit engine context may validate Organization equality, as Capture and
Validation already do, but it must not become the factual source that repairs a
missing artifact field.

# Required Test Changes

If Candidate C is accepted, focused tests should cover:

- `OperationalCondition` Organization preservation and invalid runtime input;
- `OperationalLeakage` Organization preservation, getter-only access,
  immutability, and rejection of invalid or mixed-Organization source inputs at
  the future engine boundary;
- `OperationalLeakagePriority` propagation from source Leakage and invalid
  Organization rejection;
- `OperationalRecommendation` Organization preservation, defensive
  immutability, and constructor validation;
- `RecommendationRuleEngine` propagation from priority to recommendation with
  no external Organization input;
- deterministic recommendation identity across equivalent inputs and identity
  separation across Organizations;
- future planning acceptance for same-Organization recommendations;
- future planning rejection for mixed-Organization recommendations before rule
  evaluation or plan materialization; and
- end-to-end Organization preservation from condition through plan.

Existing constructor call sites are currently limited and identifiable:

- `packages/domain/tests/operational-leakage.test.ts`;
- `packages/domain/tests/operational-leakage-priority.test.ts`;
- `packages/domain/tests/operational-recommendation.test.ts`;
- `packages/engines/tests/recommendation-rule-engine.test.ts`; and
- `packages/engines/src/recommendation/RecommendationRuleEngine.ts`.

Full domain, engines, workspace typecheck, build, and test validation would be
required after any authorized implementation.

# Governance Impact

The correction crosses released capability boundaries and cannot be treated as
a local constructor cleanup.

If an ADR accepts Candidate C, follow-on governance work should evaluate
amendments or supplements for:

- HCES-0003, to make the existing `OperationalCondition` Organization boundary
  explicit;
- HCES-0004, to require Organization compatibility and preservation in Leakage;
- HCES-0005, to preserve Organization in priority artifacts;
- HCES-0006 and HCES-0006A, to preserve Organization through recommendation;
- HCES-0007 and HCES-0007A, to require Organization on the plan and remove the
  current implementation blocker;
- identity specifications for every affected artifact;
- VVR revalidation for Capabilities 004–006; and
- the Capability 006 Release Record, through an additive release amendment or
  migration record rather than an undocumented historical edit.

ADR-0004's protection of the legacy `PriorityProfile` remains intact. The
change concerns only `OperationalLeakagePriority` and must not migrate or alter
the legacy contract implicitly.

# Migration Impact

Adding a required `organizationId` is source-breaking for constructor consumers
even though it is semantically additive to the entity state.

Expected migration work includes:

- updating the affected constructors and fixtures;
- updating declaration outputs and downstream compile consumers;
- backfilling existing serialized operational artifacts through a governed
  migration using authoritative upstream ownership data;
- rejecting records whose Organization cannot be established unambiguously;
- updating identity vectors if the ADR requires Organization participation;
  and
- recording schema-version and compatibility consequences.

Runtime repository lookup must not be used as a permanent compatibility shim.
A one-time governed data migration may consult authoritative stored lineage,
but resulting canonical artifacts must contain their own Organization
identity.

Future repositories should partition and query operational artifacts using the
canonical Organization field. Future APIs should derive authorization scope
from authenticated boundary context, compare it with artifact
`organizationId`, and never overwrite artifact ownership supplied by canonical
provenance.

# Architectural Risks

- **Partial propagation:** adding Organization to only Priority or
  Recommendation recreates the missing-provenance problem at an earlier
  boundary.
- **Caller-asserted ownership:** accepting a planning-time Organization value
  without artifact provenance permits cross-Organization mixing.
- **Opaque-ID derivation:** treating condition, leakage, priority, trace, or
  policy identifiers as encoded Organization values creates an undocumented
  coupling and collision risk.
- **Identity collision:** deterministic artifact identities that omit
  Organization may collide when local source/rule identifiers repeat across
  Organizations.
- **Terminology fragmentation:** introducing a scope object or Tenant field now
  could create competing canonical ownership models.
- **Legacy contract ambiguity:** the existing legacy `ExecutionPlan` has
  Organization identity but does not implement HCES-0007 semantics; conflating
  the two models could broaden migration beyond this blocker.
- **Historical compatibility:** At discovery time, Capability 006 was described
  as conditionally released, so a required field appeared to require governed
  versioning rather than silent addition. The present disposition is verified
  but not released wherever no tracked accepted Release Record exists.
- **Semantic runtime gap:** Evidence Semantics is specified but not implemented;
  its future implementation must preserve the already normative Organization
  boundary into `OperationalCondition`.

# Discovery-Time ADR Recommendation

At discovery time, an ADR was required. The following recommendation is
retained as historical evidence of the decision request that led to ADR-0007.

Proposed ADR number:

`ADR-0007`

Proposed title:

`ADR-0007 — Canonical Organization Provenance Across Operational Artifacts`

Exact decision question:

> Shall `organizationId: Identifier` be preserved as a required direct
> ownership field from `OperationalCondition` through `OperationalLeakage`,
> `OperationalLeakagePriority`, `OperationalRecommendation`, and the canonical
> `ExecutionPlan`, with deterministic engines rejecting cross-Organization
> inputs and using no repository lookup or supplemental ownership side channel?

Affected artifacts:

- `OperationalCondition` as the existing source boundary;
- `OperationalLeakage`;
- `OperationalLeakagePriority`;
- `OperationalRecommendation`;
- the canonical `ExecutionPlan` governed by HCES-0007;
- future Leakage and Priority engines;
- `RecommendationRuleEngine`;
- future `ExecutionPlanningEngine`;
- deterministic identity material for affected artifacts;
- HCES-0003 through HCES-0007A;
- affected tests, VVRs, and release/migration records; and
- future repository and API ownership boundaries.

The ADR was asked to decide direct-field propagation, identity participation,
compatibility treatment, and migration authority. This discovery report did
not make those decisions at discovery time.

# Resolution

Discovery is complete. Accepted ADR-0007 resolved the decision question by
accepting Candidate C. Canonical `organizationId` provenance was implemented
and verified through the governed downstream artifacts. Affected capabilities
remain verified but not released wherever no tracked accepted Release Record
exists.

# Validation

- Discovery scope completed: PASS
- Candidate criteria evaluated: PASS
- Existing terminology inspected: PASS
- Document formatting and whitespace checks: PASS
- Trailing whitespace: NONE
- Final newline: PRESENT
- `git diff --check`: PASS
- Existing governance documents modified: NO
- Domain, engine, and test files modified: NO
- Commit created: NO
