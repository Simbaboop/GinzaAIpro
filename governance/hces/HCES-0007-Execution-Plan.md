# HCES-0007 — Execution Plan

**Status:** Accepted

# Capability

Capability 007

# Governing Question

How shall an admissible operational recommendation be transformed into a
governed execution plan without performing execution?

# Purpose

Specify the canonical domain capability responsible for converting one or
more admissible `OperationalRecommendation` artifacts into an immutable
`ExecutionPlan`.

This capability defines planning only.

It does not execute work.

It does not schedule work.

It does not allocate resources.

It does not communicate with external systems.

# Input State

One or more:

`OperationalRecommendation`

Execution planning consumes only admissible `OperationalRecommendation`
artifacts. Admissibility is determined upstream.

Execution planning performs no approval workflow, repository lookup, or
mutable state transition. Capability 007 consumes admissible recommendations
without modifying or replacing their historical state.

A planning request containing multiple recommendations shall define:

- deterministic input ordering;
- duplicate handling;
- organization compatibility;
- trace compatibility; and
- governing policy compatibility.

These are mandatory input invariants. Their algorithms are outside this
capability specification.

# Output State

One immutable:

`ExecutionPlan`

The plan preserves direct lineage to every source recommendation used to
derive it.

# Canonical Definition

An `ExecutionPlan` is a governed, deterministic representation of **how** an
admissible recommendation should be carried out.

It is not execution.

It is not a task management system.

It is not workflow history.

It is not evidence.

The plan describes an admissible execution structure without causing any work
to occur.

# Planning Doctrine

Execution plans answer:

**How should the admissible intervention be carried out?**

Recommendations answer:

**What should change?**

Execution events answer:

**What actually happened?**

These questions define permanent semantic boundaries. Planning shall not
rewrite recommendation intent, and planning shall not claim that execution
occurred.

# Required Components

An execution plan shall contain, at minimum:

- plan identity;
- source recommendation identifiers;
- trace identity;
- source recommendation provenance;
- execution planning policy identity;
- execution planning rule provenance;
- ordered work packages;
- dependency graph;
- required capabilities;
- required resources;
- execution constraints;
- admissibility checks;
- rollback considerations;
- success criteria;
- completion criteria;
- schema version; and
- creation timestamp supplied through explicit deterministic creation context.

Required capabilities and resources describe execution prerequisites. Their
presence does not assign people, reserve capacity, purchase resources, or
authorize work.

Ordered work packages and the dependency graph describe governed planning
structure. They are not mutable tasks, workflow instances, schedules, or
execution history.

# Provenance

## Source Recommendation Provenance

Every execution plan shall preserve the provenance of every source
`OperationalRecommendation`, including its recommendation, policy, rule, and
trace identities. Planning shall not replace or reinterpret that provenance.

## Execution Planning Provenance

Every execution plan shall introduce and preserve its own execution planning
policy identity and execution planning rule provenance.

Source recommendation provenance and execution planning provenance are
distinct. This capability does not define planning rules or their schema.

# Identity

Execution plan identity shall be deterministic and derived only from stable,
explicit planning inputs and provenance.

Plan identity shall not use:

- randomness;
- the system clock; or
- hidden state.

The identity implementation is outside this capability specification.

# Work Package Semantics

The dependency graph is the authoritative representation of work-package
dependencies.

Any displayed execution order shall be derived deterministically from those
dependency relationships. This capability does not define graph algorithms.

Every work package shall preserve lineage to its source recommendation, the
governing trace, and future execution events. Work-package lineage shall remain
available across planning and execution boundaries without asserting that
execution occurred.

# Invariants

Execution plans shall be:

- stateless in derivation;
- pure in derivation;
- immutable;
- deterministic;
- replayable;
- idempotent;
- traceable; and
- versioned.

Inputs and outputs shall be immutable. Planning shall use no hidden state.

Equivalent admissible recommendations evaluated with the same explicit
planning provenance and deterministic creation context shall produce
equivalent execution plans.

Every plan shall preserve source recommendation provenance, execution planning
policy identity, execution planning rule provenance, schema version, and trace
identity.

Capability 007 conforms to HCES-0000. This capability does not restate or
define engine lifecycle or rule lifecycle behavior.

# Boundaries

Execution plans shall never:

- execute tasks;
- assign owners;
- update task status;
- invoke AI;
- call external systems;
- persist execution history; or
- schedule calendar events.

Execution planning shall never perform an approval workflow, repository
lookup, or mutable state transition.

Capability 007 may describe required resources and ordered work packages, but
it shall not allocate those resources, create mutable work assignments, or
initiate the described work.

# Relationship to Capability 006

`ExecutionPlan` consumes admissible `OperationalRecommendation` artifacts.

It does not modify recommendations.

Recommendations remain historical records.

Capability 006 remains authoritative for what should change. Capability 007 is
authoritative only for the governed plan describing how that admissible change
could be carried out.

# Success Boundary

`ExecutionPlan` defines completion criteria and success criteria.

Completion criteria define when the planned work would be complete. Success
criteria preserve the measurable outcome expected from the source
recommendation.

`ExecutionPlan` never evaluates whether completion or success occurred.
`ObservedOutcome` remains solely responsible for outcome determination.

# COSMOS Mapping

```text
Recommendation
      ↓
Execution Plan
      ↓
Execution Event
      ↓
Observed Outcome
```

# HCOD / HCIS

Execution planning performs no constitutional reasoning.

Constitutional reasoning remains upstream. Capability 007 applies only
previously governed planning policy and provenance.

# Repository Materialization

The accepted capability is materialized by:

- `packages/domain/src/intelligence/ExecutionPlan.ts`;
- `packages/domain/src/intelligence/index.ts`;
- `packages/domain/src/rules/ExecutionPlanningRule.ts`;
- `packages/domain/src/rules/index.ts`;
- `packages/engines/src/planning/ExecutionPlanningEngine.ts`;
- `packages/engines/src/planning/index.ts`;
- `packages/domain/tests/execution-plan.test.ts`;
- `packages/domain/tests/execution-planning-rule.test.ts`; and
- `packages/engines/tests/execution-planning-engine.test.ts`.

`RuntimeExecutionPlan` remains a separate runtime artifact and does not own the
canonical planning meaning of `ExecutionPlan`.

# Release Boundary

Capability 007 and `ExecutionPlan` are verified but not released. No Release
Record exists. Specification acceptance, implementation completion, VVR
acceptance, successful tests, typechecks, builds, staging, merge, or commit do
not independently establish or authorize release.

# Non-Goals

This document does not specify:

- an execution engine;
- automation;
- AI;
- persistence;
- scheduling;
- resource-allocation engines;
- repositories;
- APIs;
- dashboards; or
- additional implementation beyond the accepted materialization.

This document specifies the capability only.

# Validation

- Document formatting and whitespace checks: PASS
- Trailing whitespace: NONE
- Final newline: PRESENT
- `git diff --check`: PASS
- Repository materialization reconciled: YES
- ADR created: NO
- Commit created: NO
