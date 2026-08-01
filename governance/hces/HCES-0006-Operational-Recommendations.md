# HCES-0006

Operational Leakage Priority → Operational Recommendations

**Status:** Accepted

# Capability

Capability 006

`OperationalLeakagePriority` → `OperationalRecommendation[]`

# Governing Question

Given one immutable `OperationalLeakagePriority`, which governed intervention
hypotheses are produced by the applicable released recommendation rules at an
explicit evaluation time?

# Definition

`OperationalRecommendation` is an immutable, deterministic, evidence-backed
representation of a governed hypothesis that a specific intervention will
improve an operational outcome.

It describes what should change and why. It does not describe how work will be
planned or performed, assign responsibility, authorize execution, or evaluate
an observed result.

Capability 006 conforms to:

- HCES-0000 — Deterministic Rule Engine Pattern;
- HCES-0000A — Rule Specification Pattern;
- ADR-0005 — Released Rule Boundary;
- ADR-0006 — Priority Artifact Completeness; and
- ADR-0007 — Preservation of Canonical Operational Provenance.

# Input State

Each engine invocation consumes:

- exactly one immutable `OperationalLeakagePriority`;
- one explicit `evaluationTime`; and
- zero or more `RecommendationRule` versions already filtered through the
  upstream Released-rule boundary.

The priority artifact is the complete deterministic business input. It must
directly preserve:

- `organizationId`;
- originating leakage category;
- source leakage and priority lineage;
- trace identity;
- priority level and dimensions;
- governing policy identity; and
- stable artifact identity.

Missing organization provenance, category, lineage, or priority state must not
be repaired through inference, repository lookup, supplemental runtime fields,
trace inference, or any other side channel.

`evaluationTime` is explicit deterministic context. It is not a substitute for
canonical business state owned by the input artifact.

# Released-Rule Boundary

Only rule versions that have already crossed the upstream Released-rule
boundary are admissible.

Capability 006 does not inspect, infer, approve, release, deprecate, archive, or
otherwise manage rule lifecycle state. Rule lifecycle filtering occurs before
engine invocation in accordance with ADR-0005.

An empty released-rule collection is valid and produces an empty immutable
result.

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

Predicates and output templates are data, not executable callbacks. Rules do
not access repositories, external services, mutable state, clocks, or AI.

# Output State

The result is an immutable zero-or-more array:

`OperationalRecommendation[]`

Each `OperationalRecommendation` preserves:

- `recommendationId`;
- `organizationId`;
- `sourceOperationalLeakagePriorityId`;
- `traceId`;
- `ruleId` and `ruleVersion`;
- `policyId` and `policyVersion`;
- `objective`;
- `intervention`;
- `rationale`;
- `expectedOutcome`;
- `successMetric`;
- `requiredEvidence`;
- `preconditions`;
- `constraints`;
- `createdAt`; and
- `schemaVersion`.

One matched rule may produce one canonical recommendation. An unmatched,
disabled, or temporally inapplicable rule produces no recommendation. No
placeholder or partial recommendation is emitted.

# Transformation

For one invocation, Capability 006 shall:

1. validate the immutable priority artifact and explicit evaluation time;
2. consume the supplied rule versions as already Released;
3. ignore disabled and temporally inapplicable rules;
4. order applicable rules deterministically;
5. evaluate declarative predicates without mutating input or rules;
6. materialize each matched declarative output template;
7. validate each candidate recommendation; and
8. return one immutable canonically ordered recommendation array.

Rules execute in this deterministic order:

1. numeric `priority`;
2. `ruleId`;
3. `ruleVersion`;
4. `policyId`; and
5. `policyVersion`.

Equivalent canonical input, evaluation time, and rule versions must produce
equivalent recommendations in the same order.

Invalid input, a rule conflict, a policy conflict, or an invalid matched output
template produces a governed failure and no partial canonical output. Rules
that simply do not match are not failures and create no recommendation.

# Recommendation Doctrine

Every recommendation must state:

- the objective to improve;
- the proposed intervention;
- the governed rationale;
- the expected outcome;
- the success metric;
- the evidence required for downstream review;
- applicable preconditions; and
- applicable constraints.

These fields define a reviewable intervention hypothesis. They do not define
an execution plan, workflow, schedule, owner, resource allocation, or execution
authorization.

# Admissibility

The priority input must:

- originate from Capability 005;
- be immutable and canonically identified;
- contain immutable `organizationId` provenance;
- contain the originating leakage category;
- preserve source lineage and trace identity;
- contain canonical priority state; and
- expose valid policy and schema identity.

Each supplied rule must satisfy the canonical `RecommendationRule` contract.
The upstream caller is responsible for ensuring every supplied rule version is
Released.

An inadmissible invocation returns a governed failure. Capability 006 must not
silently repair, enrich, replace, or omit invalid canonical input.

# Invariants

Runtime evaluation shall be:

- stateless;
- pure;
- deterministic;
- replayable;
- idempotent;
- traceable;
- side-effect free;
- immutable; and
- AI-free.

Capability 006 preserves input identity, organization provenance, trace
lineage, source priority identity, rule identity, policy identity, and schema
identity in every canonical output.

Capability 006 shall never:

- repeat prioritization;
- modify upstream artifacts;
- assign work;
- schedule work;
- allocate resources;
- create projects;
- generate workflows;
- authorize or perform execution;
- persist state;
- access repositories;
- call external services; or
- invoke AI.

# Identity and Time

`OperationalRecommendation` identity is deterministic and preserves:

- canonical recommendation identity;
- source `OperationalLeakagePriority` identity;
- organization identity;
- trace identity;
- recommendation rule identity and version;
- policy identity and version; and
- schema version.

The explicit `evaluationTime` determines normalized `createdAt` for every
materialized recommendation. `evaluationTime` and `createdAt` do not
participate in recommendation identity.

Identity must not depend on current system time, randomness, process state,
environment state, repository state, external I/O, or caller insertion order.

# Failure Taxonomy

Capability 006 returns only governed failures from this taxonomy:

- `RejectedInput`;
- `RuleConflict`;
- `ValidationFailure`;
- `PolicyConflict`; or
- `SystemFailure`.

Failures must be deterministic and provide a governed failure code and
reviewable message. Structured rule, policy, source, organization, or trace
failure context requires a separately governed contract extension. A failed
invocation returns no partially canonical recommendation array.

# Execution Boundary

Capability 006 ends after producing immutable
`OperationalRecommendation[]`.

Execution planning remains Capability 007. Capability 006 does not determine
work packages, dependencies, owners, schedules, runtime admission, execution
events, or observed outcomes.

# AI Participation

AI may assist humans upstream when authoring recommendation policy or rule
candidates.

Runtime Capability 006 is deterministic and AI-free. AI does not evaluate
predicates, select rules, materialize recommendations, or authorize outputs.

# Validation

Capability 006 acceptance requires verification of:

- focused `OperationalRecommendation` domain tests;
- focused `RecommendationRule` domain tests;
- focused `RecommendationRuleEngine` tests;
- the complete Domain package test suite;
- the complete Engines package test suite;
- Domain and Engines package typechecks;
- Domain and Engines package builds;
- immutable inputs, rules, outputs, and nested collections;
- complete organization, source-priority, trace, rule, and policy provenance;
- deterministic ordering and replay;
- idempotent equivalent-input behavior;
- explicit evaluation-time normalization;
- stable identity independent of evaluation time;
- unmatched-rule empty-output behavior;
- governed failures with no partial output;
- absence of lifecycle inference and side-channel input; and
- preservation of the Capability 007 execution-planning boundary.

Acceptance and successful verification do not establish release. Capability
006 is released only through a governing Release Record.

# Repository Materialization

Domain contracts:

- `packages/domain/src/intelligence/OperationalRecommendation.ts`
- `packages/domain/src/intelligence/RecommendationRule.ts`

Domain export:

- `packages/domain/src/intelligence/index.ts`

Deterministic engine:

- `packages/engines/src/recommendation/RecommendationRuleEngine.ts`
- `packages/engines/src/recommendation/index.ts`

Verification tests:

- `packages/domain/tests/operational-recommendation.test.ts`
- `packages/domain/tests/recommendation-rule.test.ts`
- `packages/engines/tests/recommendation-rule-engine.test.ts`

# COSMOS Mapping

```text
Governed Importance
        ↓
Intervention Hypothesis
        ↓
Candidate Outcome Improvement
```

# HCOD / HCIS

Capability 006 performs no constitutional reasoning.

It applies previously approved policy expressed through rule versions that
have crossed the upstream Released-rule boundary.

# Non-Goals

Capability 006 intentionally excludes:

- prioritization;
- execution planning;
- workflow generation;
- scheduling;
- optimization;
- forecasting;
- financial valuation;
- project management;
- automation;
- human assignment;
- resource allocation;
- persistence;
- repositories;
- external integration; and
- release authorization.
