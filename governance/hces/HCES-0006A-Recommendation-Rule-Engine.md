# HCES-0006A

Recommendation Rule Engine

**Status:** Accepted

# Engine

`RecommendationRuleEngine`

# Purpose

This specification defines the deterministic engine responsible for
transforming one canonical `OperationalLeakagePriority` into zero or more
immutable `OperationalRecommendation` artifacts under supplied released rule
versions.

It specifies engine behavior. Domain entity contracts remain governed by
HCES-0006 and their domain definitions.

The engine conforms to:

- HCES-0000 — Deterministic Rule Engine Pattern;
- HCES-0000A — Rule Specification Pattern;
- HCES-0006 — Operational Recommendations;
- ADR-0005 — Released Rule Boundary;
- ADR-0006 — Priority Artifact Completeness; and
- ADR-0007 — Preservation of Canonical Operational Provenance.

# Responsibility

The engine deterministically evaluates one immutable
`OperationalLeakagePriority` against zero or more supplied
`RecommendationRule` versions and returns zero or more canonical
`OperationalRecommendation` artifacts.

It performs recommendation only. It does not repeat prioritization, plan
execution, authorize work, or perform execution.

# Canonical Invocation

The canonical invocation shape is:

```text
execute(rules, input)
```

Where:

- `rules` is `readonly RecommendationRule[]`; and
- `input` contains exactly one `operationalLeakagePriority` and one explicit
  `evaluationTime`.

The engine does not accept `OperationalLeakagePriority[]`.

The priority artifact is the complete deterministic business input. Category,
priority, organization provenance, source lineage, and trace identity are read
directly from that artifact. The engine accepts no supplemental category,
organization, provenance, lineage, or priority side channel.

# Released-Rule Boundary

Every supplied `RecommendationRule` version must already have crossed the
upstream Released-rule boundary.

The engine does not inspect, infer, approve, release, deprecate, archive, or
filter governance lifecycle status. Lifecycle governance and filtering occur
before invocation in accordance with ADR-0005.

An empty rule collection is valid and produces an empty immutable result.

# Recommendation Rule Contract

Each immutable `RecommendationRule` contains:

- `ruleId`;
- `ruleVersion`;
- `policyId`;
- `policyVersion`;
- `enabled`;
- `effectiveFrom`;
- optional `effectiveTo`;
- numeric `priority`;
- declarative `predicate`;
- declarative `outputTemplate`; and
- immutable `metadata`.

Predicates and output templates contain declarative data only. They are not
callbacks, scripts, workflows, or mutable runtime behavior.

# Engine Lifecycle

```text
Validate Invocation
        ↓
Validate Rule Collection
        ↓
Filter Disabled and Ineffective Rules
        ↓
Order Applicable Rules
        ↓
Evaluate Declarative Predicates
        ↓
Materialize Canonical Recommendations
        ↓
Return Frozen Results
```

The engine shall:

1. validate the input object;
2. validate the canonical `OperationalLeakagePriority`;
3. validate and normalize the explicit evaluation time;
4. validate the rule collection;
5. ignore disabled, expired, and future rules;
6. read category and priority state directly from the priority artifact;
7. evaluate only the supported closed declarative predicate model;
8. validate complete matched output-template material;
9. materialize canonical `OperationalRecommendation` entities; and
10. return a frozen zero-or-more recommendation array.

An unmatched rule is not a failure and produces no recommendation.

# Declarative Predicate Evaluation

The engine evaluates only governed filters, fields, and comparison operators
implemented by the closed predicate model.

Predicate evaluation must not execute caller code, inspect arbitrary object
paths, infer missing facts, perform prioritization, or access external state.
Invalid filters, fields, operators, or comparison operands produce a governed
failure.

# Rule Effectiveness

`evaluationTime` determines whether a rule is effective:

- a future rule is ignored;
- an expired rule is ignored;
- a disabled rule is ignored; and
- an enabled rule inside its inclusive effective interval remains applicable.

The engine reads no system clock. Rule effectiveness depends only on the
explicit invocation time and the immutable rule version.

# Deterministic Ordering

Applicable rules execute in this deterministic order:

1. numeric `priority`;
2. `ruleId`;
3. `ruleVersion`;
4. `policyId`; and
5. `policyVersion`.

The returned recommendation array preserves the corresponding canonical rule
order. Caller rule-array order must not change equivalent output.

# Output Contract

The engine returns:

`readonly OperationalRecommendation[]`

The array and every recommendation are immutable. Each recommendation
preserves:

- `recommendationId`;
- `organizationId`;
- `sourceOperationalLeakagePriorityId`;
- `traceId`;
- `ruleId` and `ruleVersion`;
- `policyId` and `policyVersion`;
- `schemaVersion`;
- `objective`;
- `intervention`;
- `rationale`;
- `expectedOutcome`;
- `successMetric`;
- `requiredEvidence`;
- `preconditions`; and
- `constraints`.

No partial, placeholder, mutable, or non-canonical recommendation may be
returned.

# Identity and Time

Recommendation identity derives from stable normalized source-priority, trace,
rule, policy, and schema material.

The explicit `evaluationTime` determines normalized `createdAt` for every
materialized recommendation. `evaluationTime` and `createdAt` do not
participate in recommendation identity.

Identity and ordering must not depend on randomness, the system clock, process
state, environment state, object identity, repository state, external I/O, or
caller insertion order.

# Failure Contract

The governed failure taxonomy is:

- `RejectedInput`;
- `RuleConflict`;
- `ValidationFailure`;
- `PolicyConflict`; or
- `SystemFailure`.

Current governed failures provide a failure code and reviewable message. The
error contract does not claim structured rule, policy, source, organization,
or trace provenance fields.

Invalid input, rule collection, predicate, filter, comparison, or matched
output template produces a governed failure and no partial result. An unmatched
rule is not a failure and produces no recommendation.

# Invariants

The engine shall be:

- stateless;
- pure;
- deterministic;
- replayable;
- idempotent;
- traceable;
- immutable;
- side-effect free; and
- AI-free.

Equivalent independent priority artifacts, evaluation times, and rule versions
must produce recommendations with equivalent identity, state, and ordering.

The engine shall not:

- mutate rules, rule arrays, inputs, priority artifacts, or outputs;
- repeat prioritization;
- invoke AI;
- access repositories or persistence;
- read the system clock;
- use randomness;
- call external services;
- create execution plans;
- schedule work;
- allocate resources;
- generate workflows; or
- authorize or perform execution.

# Execution Boundary

The engine stops after returning immutable `OperationalRecommendation`
artifacts.

Execution planning remains Capability 007. Work packages, dependency graphs,
scheduling, ownership, runtime admission, and execution are outside this
engine.

# Validation

Acceptance requires verification of:

- deterministic replay;
- equivalent independent inputs;
- stable recommendation identity;
- identity independence from evaluation time;
- deterministic rule and output ordering;
- disabled, expired, future, and effective rule handling;
- closed declarative predicate evaluation;
- complete canonical output-template materialization;
- empty output for zero or unmatched rules;
- immutable rules, inputs, outputs, and nested collections;
- absence of input and rule-array mutation;
- organization, source-priority, trace, rule, policy, and schema provenance;
- governed failure codes and reviewable messages;
- no partial output on failure;
- focused `RecommendationRuleEngine` tests;
- the complete Engines package test suite;
- Domain and Engines package typechecks; and
- Domain and Engines package builds.

Acceptance and successful verification do not establish release. Capability
006 and this engine are released only through a governing Release Record.

# Repository Materialization

Engine implementation and export:

- `packages/engines/src/recommendation/RecommendationRuleEngine.ts`
- `packages/engines/src/recommendation/index.ts`

Engine verification:

- `packages/engines/tests/recommendation-rule-engine.test.ts`

Domain contracts:

- `packages/domain/src/intelligence/RecommendationRule.ts`
- `packages/domain/src/intelligence/OperationalRecommendation.ts`

# HCOD / HCIS

The engine performs no constitutional reasoning.

It evaluates rule versions previously approved and supplied through the
upstream Released-rule boundary.

# Non-Goals

The engine intentionally excludes:

- rule lifecycle governance;
- prioritization;
- optimization;
- execution planning;
- workflow generation;
- scheduling;
- resource allocation;
- persistence;
- repositories;
- external integration;
- AI participation;
- execution authorization; and
- execution.
