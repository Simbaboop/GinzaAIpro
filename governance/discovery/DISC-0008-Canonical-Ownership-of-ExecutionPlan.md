# DISC-0008 — Canonical Ownership of ExecutionPlan

**Status:** Discovery Complete — Resolved by accepted ADR-0008

# Present Governance Disposition

Accepted ADR-0008 resolved canonical name ownership. `RuntimeExecutionPlan`
now owns the legacy runtime contract, while the planning-only `ExecutionPlan`
owns the public canonical name. The migration and the deterministic planning
engine were implemented and verified.

Capability 007 remains not released because no tracked accepted Release Record
exists. ADR acceptance, implementation, and verification do not themselves
authorize release.

# Historical Discovery Record

Except for the present governance disposition and resolution stated above and
below, the repository observations, inventories, alternatives, risks, and
recommendations in this report record the state and reasoning at discovery
time. Present-tense wording within those historical sections describes that
discovery-time state only.

# Discovery-Time Problem Statement

Implementation discovery for HCES-0007 identified an architectural conflict.
At discovery time, a domain artifact described as released was named
`ExecutionPlan` and was publicly exported from `@ginzaaipro/domain`.

The existing implementation predates HCES-0007 and combines planning content
with execution-management, scheduling, workflow, and runtime-state concepts.
HCES-0007 defines `ExecutionPlan` as a planning-only artifact.

The repository cannot expose two canonical `ExecutionPlan` contracts with
different semantics through the same package entry point. Architectural
ownership of the canonical name must be decided before HCES-0007
materialization proceeds.

This report records evidence and evaluates alternatives. It makes no
architectural decision, changes no contract, and authorizes no migration.

# Objective

Determine whether the existing `ExecutionPlan`:

- satisfies HCES-0007;
- partially satisfies HCES-0007;
- represents a different domain concept;
- should be renamed, split, deprecated, migrated, or retained; and
- can continue to own the public canonical name without semantic ambiguity.

# Inspection Scope

Repository inspection covered:

- `packages/domain/src/intelligence/ExecutionPlan.ts`;
- domain package barrels and package exports;
- `packages/core/src/execution/ExecutionEngine.ts`;
- all source, test, and governance references to `ExecutionPlan`;
- identifier consumers in `Action` and `Outcome`;
- HCES-0007 and HCES-0007A;
- ADR-0007;
- the Capability 006 VVR and release record; and
- existing discovery material concerning the legacy execution contract.

Generated build output and dependency directories were excluded from the
consumer count.

# Discovery-Time Current State

The current public owner of the `ExecutionPlan` name is:

`packages/domain/src/intelligence/ExecutionPlan.ts`

The export path is:

```text
packages/domain/src/intelligence/ExecutionPlan.ts
                         ↓
packages/domain/src/intelligence/index.ts
                         ↓
packages/domain/src/index.ts
                         ↓
@ginzaaipro/domain package export "."
```

At discovery time, the domain package exposed only its root package entry point
and had no
execution subpath export that could independently disambiguate a second class
with the same name. The proposed `packages/domain/src/execution/` directory did
not exist at discovery time.

The existing class:

- extends `Entity`;
- uses inherited identifier-based equality;
- is frozen after construction;
- preserves direct `organizationId`;
- links one legacy `Recommendation` by identifier;
- links one or more legacy `Action` records by identifier;
- stores an objective, success criteria, and verification requirements;
- optionally stores an owner and due time; and
- stores execution-plan lifecycle status.

The existing class partially satisfies HCES-0007 because it has plan identity,
Organization ownership, recommendation lineage, descriptive intent, success
criteria, and immutable construction. It does not satisfy HCES-0007 as a
whole. Its owner, due-time, action, and runtime-status semantics cross the
planning-only boundary, while most HCES-0007 planning structure and provenance
are absent.

ADR-0007 explicitly calls the existing class the legacy `ExecutionPlan` and
states that it is not an implementation of the HCES-0007 planning capability.

# Responsibility Inventory

| Current responsibility | Evidence in the existing class | Classification | Finding |
| --- | --- | --- | --- |
| Plan identity | Inherited `Entity.id` | Planning / governance | Matches the need for deterministic plan identity in concept, although the class does not generate or validate deterministic identity material. |
| Identifier-based equality | Inherited `Entity.equals` | Governance / other | Consistent with the current domain entity doctrine. |
| Organization ownership | Required constructor argument and `organizationId` getter | Governance | Matches ADR-0007 provenance in shape, but runtime identifier validation is absent. |
| Recommendation linkage | Singular `recommendationId` | Planning | Partial lineage only; it references one legacy recommendation and preserves no recommendation rule, policy, version, or trace provenance. |
| Plan objective | Required `objective` | Planning | Describes intended work and is compatible with planning, although HCES-0007 does not require this exact top-level field. |
| Action aggregation | Required non-empty `actionIds` | Execution / workflow / orchestration | Links canonical execution units rather than defining declarative work packages. |
| Success definition | Required `successCriteria` | Planning | Semantically compatible, but stored as strings without the broader HCES provenance and work-package structure. |
| Verification prerequisites | Required `verificationRequirements` | Planning / governance | Partially overlaps validation checkpoints and admissibility checks. |
| Owner representation | Optional `ownerId` | Execution / orchestration | Represents assignment ownership, which HCES-0007 excludes from planning. |
| Due-time representation | Optional `dueAt` | Scheduling | Represents calendar or deadline semantics excluded by HCES-0007. |
| Lifecycle state | `planned`, `active`, `blocked`, `completed`, or `cancelled` | Runtime / execution / workflow | Mixes historical or mutable execution state into the planning artifact. |
| Constructor normalization | Trims strings, normalizes due time, copies arrays, and freezes the entity | Governance / other | Provides partial structural validation and immutability. |

No persistence, repository access, external I/O, AI, or execution method is
implemented inside the existing entity. The conflict is semantic state
ownership, not side-effecting behavior inside the class.

# Field Inventory

| Field | Type | Current purpose | Required by HCES-0007? | Concern classification | Migration assessment | Likely destination if not retained |
| --- | --- | --- | --- | --- | --- | --- |
| `id` | `Identifier` | Artifact identity exposed by `Entity` | Yes, as plan identity | Planning / governance | Migrate conceptually as `planId` while preserving identifier-based equality | Canonical planning artifact |
| `organizationId` | `Identifier` | Organization ownership | Yes | Governance | Migrate unchanged after validating ADR-0007 invariants | Canonical planning artifact |
| `recommendationId` | `Identifier` | Links one legacy recommendation | Partially; HCES-0007 requires one or more source recommendation identifiers | Planning | Replace or expand through governed migration; do not silently reinterpret legacy and operational recommendation identity | Canonical source-recommendation lineage |
| `objective` | `string` | Describes the plan objective | Not as an exact top-level field | Planning | May migrate if retained as useful plan description; not required for minimum conformance | Canonical plan or work-package objective |
| `ownerId` | `Identifier \| undefined` | Identifies an assigned owner | No; owner assignment is excluded | Execution / orchestration | Do not migrate into the HCES-0007 plan | Future assignment or execution-management artifact |
| `actionIds` | `readonly Identifier[]` | Identifies executable `Action` records | No; HCES-0007 requires declarative work packages | Execution / workflow | Cannot migrate as-is; requires an explicit relationship decision | Existing runtime `Action` lineage or future execution artifacts |
| `successCriteria` | `readonly string[]` | Describes intended business success | Yes | Planning | Migrate while keeping success distinct from completion | Canonical planning artifact |
| `dueAt` | `string \| undefined` | Records a due date or deadline | No; scheduling is excluded | Scheduling | Do not migrate into the planning-only contract | Future scheduling boundary, if separately governed |
| `status` | `ExecutionPlanStatus` | Records planned, active, blocked, completed, or cancelled state | No | Runtime / execution / workflow | Do not migrate into immutable plan definition | Future execution-state or event artifact |
| `verificationRequirements` | `readonly string[]` | Describes required verification | Partially | Planning / governance | Translate only through an explicit mapping to validation checkpoints or admissibility checks | Canonical planning checks or future verification boundary |

HCES-0007 planning fields missing from the existing entity include:

- multiple source recommendation identifiers;
- source recommendation rule and policy provenance;
- trace lineage;
- execution-planning policy identity;
- execution-planning rule provenance;
- ordered declarative work packages;
- an authoritative dependency graph;
- required capability and resource descriptions;
- execution assumptions and constraints;
- admissibility checks;
- rollback considerations;
- distinct completion criteria;
- schema version; and
- explicit deterministic creation time.

The implementation brief also requires risk controls and approval gates. Those
concepts are absent from the legacy class and must remain declarative if later
authorized.

# Consumer Inventory

## Direct Source Consumers

| Consumer | How it consumes `ExecutionPlan` | Actual concern required | Migration sensitivity |
| --- | --- | --- | --- |
| `packages/core/src/execution/ExecutionEngine.ts` | Imports the public type and defines `Engine<ExecutionPlan, ExecutionPlan>` | Runtime execution contract is implied, but no fields are read and no implementation exists | High semantic sensitivity; returning the same plan type conflates plan definition with execution result |
| `packages/core/tests/core-contracts.test.ts` | Uses an empty type assertion to prove `ExecutionEngine` assignability | Type shape only; no planning, scheduling, status, or ownership field is required | Low code cost, but the test codifies the current engine signature |
| `packages/domain/tests/intelligence.test.ts` | Constructs a plan in the legacy intelligence lifecycle and tests links to recommendation, action, and outcome | Planning lineage, action aggregation, runtime status, owner, due time, success criteria, and verification content are constructed; only selected lineage and immutability properties are asserted | High test migration impact because it models the mixed lifecycle end to end |
| `packages/domain/src/intelligence/index.ts` | Publicly exports the class | Public API ownership | Any rename, removal, or replacement is externally visible |
| `packages/domain/src/index.ts` | Re-exports the intelligence barrel through the package root | Public API ownership | A second root export with the same name is ambiguous |

## Indirect Semantic Consumers

| Consumer | Relationship | Concern represented | Migration observation |
| --- | --- | --- | --- |
| `packages/domain/src/intelligence/Action.ts` | Stores `executionPlanId`; documentation calls `Action` a unit of execution within a plan | Runtime execution, ownership, scheduling, status, and evidence | Identifier lineage may remain valid, but the semantic relationship must distinguish a declarative work package from an executed action |
| `packages/domain/src/intelligence/Outcome.ts` | Stores `executionPlanId` | Outcome measurement lineage | It may continue to reference canonical plan identity, but future execution-event lineage could change the direct source relationship |
| Capability 006 VVR | States that `ExecutionPlan` will answer how change should occur | Planning | Supports HCES-0007 semantics, not the mixed legacy contract |
| Capability 006 release record | Lists `ExecutionPlan` as deferred work | Planning | Indicates the HCES capability was not released with Capability 006 |
| ADR-0007 | Includes `ExecutionPlan` in canonical provenance and identifies the current class as legacy | Governance | Explicit evidence that the two meanings are not already reconciled |

No repository implementation of `ExecutionEngine`, execution API, persistence
adapter, repository, scheduling system, application service, or dashboard
consumer was found. External consumers of the released package cannot be
excluded by repository inspection and require a separate consumer-impact
review.

# Semantic Comparison

| HCES-0007 concept | Existing implementation | Assessment |
| --- | --- | --- |
| Planning-only artifact | Contains owner, due time, runtime status, and executable action references | Conflict |
| Immutable plan | Entity and copied arrays are frozen | Match, subject to deeper validation gaps |
| Deterministic plan identity | Accepts an `Identifier` and inherits ID equality | Partial; identity is accepted but no deterministic material is represented or validated |
| Organization provenance | Direct `organizationId` | Partial match; field exists, but runtime identifier validity and source consistency are not checked |
| One or more admissible operational recommendations | Singular identifier for legacy `Recommendation` | Conflict / partial |
| Source recommendation provenance | No rule, policy, version, or trace provenance | Missing |
| Planning provenance | None | Missing |
| Declarative work packages | References legacy `Action` identifiers | Conflict |
| Authoritative dependency graph | None | Missing |
| Required capabilities and resource descriptions | None | Missing |
| Assumptions, constraints, and admissibility checks | Verification requirements only | Mostly missing |
| Rollback considerations | None | Missing |
| Completion criteria | None distinct from success | Missing |
| Success criteria | Required string collection | Match in concept |
| Explicit deterministic creation context | No `createdAt` | Missing |
| Schema version | None | Missing |
| No owner assignment | Optional `ownerId` | Conflict |
| No scheduling | Optional `dueAt` | Conflict |
| No task-status mutation or execution state | Runtime-oriented status union | Conflict |
| No execution behavior | Entity has getters and validation only | Match |
| Identifier-based equality | Inherited from `Entity` | Match |

The existing contract therefore represents a mixed execution-management plan,
not the planning-only canonical artifact specified by HCES-0007.

# Naming Analysis

| Option | Architecture and governance | Implementation cost | Migration and compatibility | Long-term clarity | Minimum Complexity assessment |
| --- | --- | --- | --- | --- | --- |
| A — Retain the existing name and implementation | Leaves accepted HCES-0007 semantics unmaterialized and preserves conflicting ownership | Lowest immediate cost | No immediate break, but future engines remain blocked or require semantic compromise | Poor; one name continues to mean planning, assignment, scheduling, and runtime state | Appears simple locally but exports complexity downstream |
| A — Retain the existing name but migrate its implementation in place | Gives HCES-0007 the canonical name | Moderate | Constructor, tests, engine contract, and potentially external consumers break | Strong after migration | Viable if consumer impact is accepted; avoids two permanent concepts |
| B — Rename the existing implementation | Frees `ExecutionPlan` for HCES-0007 while preserving the legacy concept under an explicit name | Moderate | Requires export and consumer migration; an alias could prolong ambiguity | Strong if the legacy name accurately reflects runtime semantics | Viable because repository consumers are few, but exact legacy ownership still needs a decision |
| C — Rename the new HCES-0007 implementation | Preserves the current public API | Low to moderate | Minimal legacy migration, but HCES documents and future engines require revision | Weak; the normative canonical concept loses its stated name | Low immediate cost but creates durable terminology debt |
| D — Split planning and runtime artifacts | Aligns planning, execution events, outcome evaluation, and scheduling with separate boundaries | Moderate to high | Requires deliberate lineage and compatibility migration | Strongest | Justified only for responsibilities already evidenced; should not create speculative subsystems |

Option D can be combined with Option B: the HCES planning artifact can own
`ExecutionPlan`, while only demonstrably required legacy runtime concerns move
to explicitly named runtime artifacts. This combination is an alternative,
not a decision made by this report.

# Migration Scope

## Source and Export Scope

A migration decision may affect:

- `packages/domain/src/intelligence/ExecutionPlan.ts`;
- `packages/domain/src/intelligence/index.ts`;
- `packages/domain/src/index.ts`;
- the proposed `packages/domain/src/execution/ExecutionPlan.ts`;
- the proposed `packages/domain/src/execution/index.ts`;
- `packages/core/src/execution/ExecutionEngine.ts`;
- `packages/domain/src/intelligence/Action.ts`; and
- `packages/domain/src/intelligence/Outcome.ts` if lineage ownership changes.

The domain package currently exposes only `@ginzaaipro/domain`. Adding a
package subpath would itself be a package-boundary decision and would not
resolve which type is canonical.

## Test Scope

Known affected tests are:

- `packages/domain/tests/intelligence.test.ts`;
- `packages/core/tests/core-contracts.test.ts`; and
- future focused HCES-0007 `ExecutionPlan` tests.

The current domain lifecycle test would need to separate declarative planning
from action state and outcome observation rather than constructing them as one
mixed object graph.

## Runtime and Integration Scope

`ExecutionEngine` is an interface only. No concrete runtime execution engine,
API, repository, application service, persistence adapter, scheduler, or
dashboard consumer was found. Repository-local runtime migration is therefore
small, although the public package export creates unknown external consumer
risk.

The current `Engine<ExecutionPlan, ExecutionPlan>` signature requires review.
Execution should not return a mutated or replacement planning artifact when
HCES-0007 defines execution events and observed outcomes as separate states.

## Documentation Scope

Potentially affected governance references include:

- HCES-0007;
- HCES-0007A;
- ADR-0007;
- the Capability 006 VVR;
- the Capability 006 release record; and
- DISC-0007.

The accepted documents need not be changed merely to record this discovery.
Any migration ADR should identify whether clarifying amendments are necessary
after the ownership decision.

# Risks

- **Duplicate public symbol:** exporting two root classes named
  `ExecutionPlan` creates ambiguous or conflicting package exports.
- **Breaking released consumers:** renaming or replacing the legacy class can
  break consumers not visible in this repository.
- **Semantic aliasing:** a compatibility alias can preserve compilation while
  hiding incompatible meanings behind one name.
- **Runtime-state leakage:** migrating `status`, `ownerId`, or `dueAt` into the
  planning artifact would violate HCES-0007.
- **Lineage loss:** replacing singular recommendation and action links without
  an explicit mapping could break historical traceability.
- **Engine boundary ambiguity:** retaining
  `Engine<ExecutionPlan, ExecutionPlan>` can imply that execution rewrites the
  plan.
- **Over-modeling:** splitting every legacy field into a new subsystem before
  its runtime need is specified would violate the Minimum Complexity Doctrine.
- **Under-modeling:** renaming the new artifact while leaving the legacy class
  canonical would preserve the original conflict for every downstream engine.

# Architectural Alternatives

## In-Place Canonical Migration

Transform the existing public class into the HCES-0007 contract and migrate
all known consumers together.

This has one final public name and no long-lived duplicate concept. It is also
an immediate breaking constructor and semantic change unless a separately
governed compatibility strategy is approved.

## Legacy Rename Followed by Canonical Materialization

Rename the existing mixed contract according to its actual retained
responsibility, then introduce HCES-0007 `ExecutionPlan` in the execution
domain directory.

This creates the clearest name ownership. It requires a decision about which
legacy fields remain valid and whether the legacy class is retained,
deprecated, split, or removed.

## New HCES-Specific Name

Retain the existing public class and materialize HCES-0007 under a different
name.

This minimizes immediate migration but contradicts the accepted governance
language that calls the planning-only artifact `ExecutionPlan`. It would
require governance revision and preserve avoidable conceptual duplication.

## Planning and Runtime Separation

Reserve `ExecutionPlan` for immutable planning. Keep execution state,
assignment, schedules, events, and outcomes outside it under separately
governed contracts.

This best matches the HCES state boundaries. Minimum complexity requires
reusing existing `Action` and `Outcome` lineage where appropriate and delaying
new runtime artifacts until their capabilities are specified.

# Governance Analysis

## Discovery-Time Evidence

- HCES-0007 is Accepted and defines `ExecutionPlan` as the canonical
  planning-only artifact.
- HCES-0007A is Accepted and names `ExecutionPlan` as the output of the future
  deterministic planning engine.
- ADR-0007 requires `ExecutionPlan` to preserve canonical Organization
  provenance.
- ADR-0007 explicitly states that the current legacy `ExecutionPlan` is not an
  implementation of the HCES-0007 planning capability.
- The Capability 006 release record lists `ExecutionPlan` as deferred work.
- At discovery time, the source package exported the legacy class under the
  canonical public name.

## Discovery-Time Inference

Accepted HCES documents semantically assign the canonical name to the
planning-only artifact. Current source code assigns the public symbol to the
legacy mixed artifact. No existing ADR resolves the mismatch, authorizes a
breaking migration, or establishes an alternate canonical name.

## Discovery-Time Recommendation

At discovery time, an ADR was required before implementation. The decision
needed to cover both semantic ownership and migration compatibility; changing
only a file location or barrel export could not resolve the conflict.

# Discovery-Time Recommendation

The minimum-complexity migration strategy favored by the evidence is a
governed planning/runtime separation:

1. reserve the canonical `ExecutionPlan` meaning for the HCES-0007
   planning-only artifact;
2. assess external consumers of the released legacy export;
3. rename, deprecate, split, or remove the legacy mixed artifact only as
   authorized by ADR-0008;
4. migrate the core execution contract away from plan-in/plan-out semantics;
5. preserve identifiers and historical lineage explicitly; and
6. introduce no runtime subsystem beyond responsibilities supported by current
   evidence.

This was a non-binding discovery-time recommendation. It did not decide public
name ownership, select a legacy replacement name, authorize compatibility
aliases, or approve implementation.

# Discovery-Time ADR Recommendation

At discovery time, an ADR was required. The following recommendation is
retained as historical evidence of the decision request that led to ADR-0008.

**ADR number:** ADR-0008

**Title:** Canonical Ownership of ExecutionPlan

**Decision Question:** Which domain contract shall own the public canonical `ExecutionPlan` name, and how shall the existing legacy contract be migrated without preserving conflicting planning and runtime semantics?

Affected artifacts for the future decision include the legacy public class,
the HCES-0007 planning contract, domain barrels, `ExecutionEngine`, legacy
action and outcome lineage, tests, and public consumers.

This discovery report did not decide ADR-0008 at discovery time.

# Resolution

Discovery is complete. Accepted ADR-0008 resolved the conflict by assigning
the legacy runtime contract to `RuntimeExecutionPlan` and the public canonical
planning-only name to `ExecutionPlan`. The migration and planning engine were
implemented and verified. Capability 007 remains not released because no
tracked accepted Release Record exists.
