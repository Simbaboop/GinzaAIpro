# HCES-0007A — Execution Planning Engine

**Status:** Accepted

**Version:** 1.1.0

# Governing Specifications

This specification conforms to:

- the GinzaAIpro Platform Constitution;
- HCES-0000 — Deterministic Rule Engine Pattern;
- HCES-0000A — Rule Specification Pattern;
- HCES-0007 — Execution Plan;
- ADR-0005 — Released Rule Boundary;
- ADR-0006 — Priority Artifact Completeness;
- ADR-0007 — Preservation of Canonical Operational Provenance; and
- ADR-0008 — Canonical Ownership of ExecutionPlan.

This document specifies the deterministic `ExecutionPlanningEngine`, its rule
selection contract, and the materialization grammar consumed from
`ExecutionPlanningRule`.

It does not specify runtime execution and does not change the canonical
`ExecutionPlan` domain contract.

# Blocker Resolution

Version 1.0 left the planning-rule predicate and output-template grammar
undefined. The implemented `ExecutionPlan` requires complete assumptions,
checks, controls, gates, rollback content, work-package content, dependency
data, capabilities, resources, completion criteria, and success criteria.

Without a governed grammar, an engine would have to fabricate those values,
interpret generic metadata, or introduce hidden context. Each option would
violate the Platform Constitution.

Version 1.1.0 closes that omission by defining:

- a closed predicate grammar;
- a closed literal output-template grammar;
- one source for every `ExecutionPlan` field;
- one multi-recommendation binding strategy;
- deterministic rule selection and precedence;
- explicit timestamp semantics; and
- stable materialization failures.

# Governing Question

How shall admissible `OperationalRecommendation` artifacts be transformed into
one immutable `ExecutionPlan` through deterministic application of one
selected Released `ExecutionPlanningRule`?

# Engine Responsibility

The `ExecutionPlanningEngine` shall:

- consume one or more upstream-admissible `OperationalRecommendation`
  artifacts;
- consume only Released `ExecutionPlanningRule` artifacts;
- consume one explicit canonical generation timestamp;
- validate canonical input structure and compatibility;
- select exactly one applicable rule;
- materialize all required plan content from the sources defined here;
- construct one immutable canonical `ExecutionPlan`; and
- preserve complete Organization, recommendation, trace, rule, policy,
  version, and creation provenance.

The engine performs planning only. It never executes work.

# Inputs

The engine input consists only of:

1. `readonly OperationalRecommendation[]` containing at least one item;
2. `readonly ExecutionPlanningRule[]` supplied through the Released-rule
   boundary; and
3. an explicit canonical `generationTimestamp: string`.

The engine receives no repository, policy object, Organization side channel,
clock, random source, environment data, runtime state, or external service.

Inputs and rules shall remain immutable and unmodified.

# Canonical Input Normalization

Before rule matching, the engine shall:

1. verify every recommendation is an `OperationalRecommendation`;
2. order recommendations by `recommendationId.value` using ordinal code-unit
   comparison;
3. reject duplicate recommendation identifiers;
4. verify every recommendation contains valid Organization, trace, rule,
   policy, schema-version, and creation provenance;
5. verify every recommendation belongs to the same Organization; and
6. normalize the explicit generation timestamp to an ISO-8601 UTC string.

No recommendation may be silently dropped, merged, rewritten, or repaired.

# Upstream Admissibility Boundary

`OperationalRecommendation` admissibility is guaranteed by the upstream
caller or governed pipeline before engine invocation.

Capability 007 shall not add an `admissible`, `approved`, lifecycle, or
workflow-status field to `OperationalRecommendation`.

The engine validates only:

- canonical recommendation structure;
- Organization compatibility;
- duplicate identity;
- provenance constraints explicitly declared by the selected rule predicate;
  and
- bindings and output material that can be evaluated from canonical inputs.

The engine does not infer organizational approval, human authorization, or
workflow state. Approval gates are declarative plan content supplied by the
selected rule, not recommendation runtime state.

# Released Rule Boundary

Only Released rules may be supplied to the engine. Under ADR-0005, lifecycle
management and lifecycle filtering remain upstream.

The engine shall not inspect, infer, approve, release, deprecate, archive, or
otherwise modify rule lifecycle state.

Loading rules means accepting the immutable Released rule set supplied at
invocation. It does not authorize repository access or rule discovery.

# ExecutionPlanningRule Contract

Every `ExecutionPlanningRule` retains:

- `ruleId`;
- `ruleVersion`;
- `policyId`;
- `policyVersion`;
- `enabled`;
- `effectiveFrom`;
- optional `effectiveTo`;
- non-negative integer `priority`;
- one closed `predicate`;
- one closed `outputTemplate`; and
- immutable declarative `metadata`.

The rule is immutable configuration. It contains no predicate execution,
engine behavior, persistence, I/O, AI, callbacks, or mutable state.

Metadata is audit information only. The engine shall not read metadata to
materialize a plan, repair an incomplete template, alter precedence, or obtain
policy.

# Predicate Grammar

`ExecutionPlanningPredicate` contains exactly the following fields:

| Field | Type | Required | Matching semantics |
| --- | --- | --- | --- |
| `recommendationRuleIds` | non-empty unique `readonly string[]` | Yes | Every recommendation `ruleId` shall be a member. |
| `recommendationRuleVersions` | non-empty unique `readonly string[]` | Yes | Every recommendation `ruleVersion` shall be a member. |
| `recommendationPolicyIds` | non-empty unique `readonly string[]` | Yes | Every recommendation `policyId` shall be a member. |
| `recommendationPolicyVersions` | non-empty unique `readonly string[]` | Yes | Every recommendation `policyVersion` shall be a member. |
| `recommendationSchemaVersions` | non-empty unique `readonly string[]` | Yes | Every recommendation `schemaVersion` shall be a member. |
| `requiredRecommendationCount` | positive safe integer | No | When present, input count shall equal the value. It is mutually exclusive with minimum and maximum count. |
| `minimumRecommendationCount` | positive safe integer | No | When present, input count shall be greater than or equal to the value. |
| `maximumRecommendationCount` | positive safe integer | No | When present, input count shall be less than or equal to the value. |
| `requireSharedTrace` | boolean | Yes | When true, all recommendations shall have the same `traceId`. |
| `requireSharedRuleVersion` | boolean | Yes | When true, all recommendations shall have the same `ruleId` and `ruleVersion` pair. |
| `requireSharedPolicyVersion` | boolean | Yes | When true, all recommendations shall have the same `policyId` and `policyVersion` pair. |
| `requireSharedSchemaVersion` | boolean | Yes | When true, all recommendations shall have the same `schemaVersion`. |

Organization consistency is unconditional and is not an optional predicate
field.

When both minimum and maximum count are present, minimum shall not exceed
maximum. When no count field is present, the engine-level minimum of one
recommendation applies.

All predicate string arrays are trimmed, sorted by ordinal code-unit order,
and reject duplicate or empty values at rule construction.

No recommendation category predicate exists in Version 1.1.0 because
`OperationalRecommendation` contains no canonical category field. The engine
shall not infer category from identifiers or upstream artifacts.

Unknown predicate fields are invalid. Arbitrary property paths, comparison
operators, expression trees, scripts, and callbacks are prohibited.

# Predicate Matching

A rule matches only when:

1. it is enabled;
2. the generation timestamp falls within its inclusive effective period;
3. every recommendation satisfies every identifier and version membership
   filter;
4. all active count constraints are satisfied; and
5. every enabled shared-provenance constraint is satisfied.

Predicate matching is conjunctive. There is no implicit OR, fallback,
coercion, case folding, locale comparison, or partial match.

# Output Template Grammar

`ExecutionPlanningOutputTemplate` contains exactly:

| Field | Type | Required | Canonicalization and duplicate behavior |
| --- | --- | --- | --- |
| `schemaVersion` | non-empty string | Yes | Trimmed; preserved exactly after trimming. |
| `requiredCapabilities` | non-empty unique `readonly string[]` | Yes | Trimmed and ordinally sorted; shall equal the union of work-package capabilities. |
| `requiredResources` | non-empty unique `readonly string[]` | Yes | Trimmed and ordinally sorted; shall equal the union of work-package resources. |
| `executionAssumptions` | non-empty unique `readonly string[]` | Yes | Literal, trimmed, ordinally sorted. |
| `executionConstraints` | non-empty unique `readonly string[]` | Yes | Literal, trimmed, ordinally sorted. |
| `admissibilityChecks` | non-empty unique `readonly string[]` | Yes | Literal, trimmed, ordinally sorted. These are future execution checks, not engine approval. |
| `riskControls` | non-empty unique `readonly string[]` | Yes | Literal, trimmed, ordinally sorted. |
| `approvalGates` | non-empty unique `readonly string[]` | Yes | Literal, trimmed, ordinally sorted. They initiate no workflow. |
| `rollbackConsiderations` | non-empty unique `readonly string[]` | Yes | Literal, trimmed, ordinally sorted. An explicit non-applicability reason is valid. |
| `completionCriteria` | non-empty unique `readonly string[]` | Yes | Literal, trimmed, ordinally sorted. The plan does not evaluate them. |
| `successCriteria` | non-empty unique `readonly string[]` | Yes | Literal, trimmed, ordinally sorted. `ObservedOutcome` remains authoritative for evaluation. |
| `workPackages` | non-empty `readonly ExecutionPlanningWorkPackageTemplate[]` | Yes | Canonically ordered by `templateId`; duplicate identifiers are rejected. |
| `dependencies` | `readonly ExecutionPlanningDependencyTemplate[]` | Yes | May be empty; canonically ordered by predecessor then successor; duplicate, self, unknown, and cyclic edges are rejected. |

Every required output field is rule-owned literal data. Empty materialized
values are prohibited. Metadata shall never supply a missing output field.

# Work-Package Template Grammar

Every `ExecutionPlanningWorkPackageTemplate` contains exactly:

| Field | Type | Required | Semantics |
| --- | --- | --- | --- |
| `templateId` | non-empty string | Yes | Rule-local immutable identity; unique within the rule. |
| `recommendationBinding` | closed binding record | Yes | Binds either all selected recommendations or one named selected recommendation. |
| `objective` | non-empty string | Yes | Literal declarative objective. |
| `intervention` | non-empty string | Yes | Literal intervention description; performs no work. |
| `entryCriteria` | non-empty unique string array | Yes | Literal declarative entry criteria. |
| `exitCriteria` | non-empty unique string array | Yes | Literal declarative exit criteria. |
| `requiredCapabilities` | non-empty unique string array | Yes | Literal capability descriptions; allocates nothing. |
| `requiredResources` | non-empty unique string array | Yes | Literal resource descriptions; reserves nothing. |
| `executionConstraints` | non-empty unique string array | Yes | Literal work-package constraints. |
| `validationCheckpoints` | non-empty unique string array | Yes | Literal future checkpoints; perform no validation. |
| `completionCriteria` | non-empty unique string array | Yes | Literal package-completion criteria. |
| `rollbackConsiderations` | non-empty unique string array | Yes | Literal rollback guidance or explicit non-applicability reason. |

All strings are trimmed. All string arrays are ordinally sorted and reject
duplicates. Work-package templates are immutable and deeply frozen.

# Dependency Template Grammar

Every `ExecutionPlanningDependencyTemplate` contains exactly:

- `predecessorTemplateId: string`; and
- `successorTemplateId: string`.

Both identifiers shall reference existing work-package templates in the same
rule. Self-dependencies, duplicate edges, unknown references, and cycles are
invalid at rule construction.

The dependency graph is authoritative. Displayed or serialized work-package
order does not override it.

# Template Interpolation

Template interpolation is prohibited in Version 1.1.0.

Every template string is literal rule-owned content. The engine shall not
resolve placeholders from recommendations, the system clock, environment
variables, random values, network data, arbitrary property paths, AI output,
or implicit defaults.

Strings containing placeholder syntax such as `${...}` or `{{...}}` are
invalid and produce `UNKNOWN_EXECUTION_PLANNING_TEMPLATE_PLACEHOLDER`.

Adding interpolation requires a future accepted specification revision with
an explicit placeholder allowlist. No implicit interpolation is permitted.

# Multi-Recommendation Binding

Each work-package template declares exactly one binding:

```text
{ kind: "all" }
```

or:

```text
{
  kind: "recommendation",
  recommendationId: Identifier
}
```

`all` binds one materialized work package to the complete canonically ordered
recommendation set.

`recommendation` binds one materialized work package to the selected
recommendation with the exact canonical identifier. An absent identifier is
an unknown binding and fails materialization.

Every template materializes exactly once. Version 1.1.0 does not support an
`each`, query, predicate, or multi-materialization binding. Consequently, a
template cannot materialize more than once. Adding such a binding requires a
future specification revision.

The materialized work package preserves:

- the bound recommendation identifiers in canonical order; and
- the canonical union of trace identifiers from those recommendations.

Ambiguous, empty, unsupported, or absent bindings are rejected.

# Deterministic Work-Package Identity

For each template, the engine constructs one `Identifier` from the following
canonical scalar sequence:

1. namespace `ginzaaipro:execution-plan-work-package:v1`;
2. output `schemaVersion`;
3. `organizationId.value`;
4. selected `ruleId`;
5. selected `ruleVersion`;
6. selected `policyId`;
7. selected `policyVersion`;
8. `templateId`;
9. the decimal count of bound recommendation identifiers; and
10. each bound `recommendationId.value` in canonical order.

Each scalar is normalized to Unicode NFC and encoded as:

```text
<UTF-8 byte length>:<value>
```

The sequence is concatenated and prefixed with:

```text
execution-plan-work-package:v1:
```

No randomness, system clock, process state, environment value, I/O, or object
insertion order participates.

# Dependency Materialization

Because every template materializes once, each dependency template maps
directly from its predecessor and successor `templateId` to the corresponding
materialized work-package identifiers.

The engine shall pass those immutable edges to `ExecutionPlan`. The plan
revalidates unknown identifiers, self-dependencies, duplicate edges,
dependency-reference consistency, and cycles.

No graph library, workflow execution, scheduling, or silent repair is
authorized.

# Rule Selection

The engine evaluates only enabled rules effective at the explicit generation
timestamp. Effective bounds are inclusive.

## Zero Matching Rules

Reject with:

`NO_MATCHING_EXECUTION_PLANNING_RULE`

An empty supplied rule set produces the same failure.

## One Matching Rule

Select it.

## Multiple Matching Rules

Order matching rules by:

1. greater numeric `priority` first;
2. later `effectiveFrom` first; and
3. `ruleId` in ascending ordinal code-unit order.

`effectiveFrom` is the existing effective-version boundary. No semantic
parsing or ordering of the free-form `ruleVersion` string is permitted.

If two enabled matching rules have identical priority, effective-from time,
and canonical rule identifier but differ in rule version, policy identity,
policy version, or output, neither is more authoritative. Reject with:

`AMBIGUOUS_EXECUTION_PLANNING_RULE`

Otherwise select the first rule in the normative ordering. Canonical rule
identifier is a deterministic final tie-breaker between distinct rule
identities; array insertion order is never a tie-breaker.

# Planning Policy Semantics

The selected `ExecutionPlanningRule.policyId` and `policyVersion` constitute
the complete planning-policy input for Capability 007.

No separate `PlanningPolicy` entity, repository, registry, or runtime object
is introduced. The engine preserves the selected values as
`ExecutionPlan.planningPolicyId` and `planningPolicyVersion`.

The engine does not retrieve or execute an external policy object. Released
rule content is the deterministic expression of that approved policy.

# Canonical Plan Field Sources

Every canonical `ExecutionPlan` field has exactly one authoritative origin:

| ExecutionPlan field | Authoritative source | Materialization rule |
| --- | --- | --- |
| `planId` | Deterministic `ExecutionPlan` domain derivation | Constructed by `ExecutionPlan` from its normalized complete canonical state. The engine supplies no alternate identity. |
| `organizationId` | Recommendation-derived | Copied unchanged from the uniform input Organization. |
| `sourceRecommendationIds` | Recommendation-derived | All normalized recommendation identifiers in canonical order. |
| `traceIds` | Recommendation-derived | Canonical unique union of input recommendation trace identifiers. |
| `recommendationProvenance` | Recommendation-derived | For every input: recommendation identifier, Organization, trace, recommendation schema version, rule identifier/version, and policy identifier/version. |
| `planningPolicyId` | Selected rule | Exact selected `policyId`. |
| `planningPolicyVersion` | Selected rule | Exact selected `policyVersion`. |
| `planningRuleProvenance` | Selected rule | One record containing exact selected `ruleId` and `ruleVersion`. |
| `workPackages` | Rule-derived plus deterministic engine derivation | Literal template content plus bound recommendation/trace lineage and deterministic work-package identity. |
| `dependencyGraph` | Rule-derived plus deterministic engine derivation | Template edges mapped to materialized work-package identifiers. |
| `requiredCapabilities` | Selected rule output | Exact canonical `outputTemplate.requiredCapabilities`; validated against work-package union. |
| `requiredResources` | Selected rule output | Exact canonical `outputTemplate.requiredResources`; validated against work-package union. |
| `executionAssumptions` | Selected rule output | Exact literal canonical `outputTemplate.executionAssumptions`. |
| `executionConstraints` | Selected rule output | Exact literal canonical `outputTemplate.executionConstraints`. |
| `admissibilityChecks` | Selected rule output | Exact literal canonical `outputTemplate.admissibilityChecks`. |
| `riskControls` | Selected rule output | Exact literal canonical `outputTemplate.riskControls`. |
| `approvalGates` | Selected rule output | Exact literal canonical `outputTemplate.approvalGates`. |
| `rollbackConsiderations` | Selected rule output | Exact literal canonical `outputTemplate.rollbackConsiderations`. |
| `completionCriteria` | Selected rule output | Exact literal canonical `outputTemplate.completionCriteria`. |
| `successCriteria` | Selected rule output | Exact literal canonical `outputTemplate.successCriteria`. |
| `schemaVersion` | Selected rule output | Exact normalized `outputTemplate.schemaVersion`. |
| `createdAt` | Caller-supplied canonical context | Normalized explicit `generationTimestamp`; the engine never reads the clock. |

No field may be sourced from metadata, runtime state, repository lookup,
inferred approval, implicit fallback, or fabricated prose.

# Generation Timestamp

`generationTimestamp` is a required explicit canonical engine input.

It shall be an RFC 3339 date-time containing `Z` or an explicit UTC offset and
shall parse to a finite instant. The engine normalizes it to an ISO-8601 UTC
string.

The timestamp is used only for:

- inclusive rule effective-period evaluation; and
- `ExecutionPlan.createdAt` creation provenance.

The engine shall not call the system clock. The timestamp participates in plan
identity through the already implemented `ExecutionPlan` canonical identity
contract. This specification does not change that contract.

# Engine Lifecycle

```text
Validate and Normalize Recommendations
                  ↓
Validate Explicit Generation Timestamp
                  ↓
Accept Supplied Released Rules
                  ↓
Evaluate Closed Rule Predicates
                  ↓
Select Exactly One Rule
                  ↓
Resolve Template Bindings
                  ↓
Materialize Work Packages and Dependencies
                  ↓
Construct Canonical ExecutionPlan
                  ↓
Return Immutable Plan
```

The engine returns no partial plan on failure.

# Deterministic Contract

The engine shall be:

- stateless;
- pure;
- deterministic;
- replayable;
- idempotent;
- traceable;
- versioned;
- immutable in input and output; and
- capability-neutral in its evaluation mechanics.

Equivalent canonical recommendations, Released rules, and generation
timestamp shall produce equivalent serialized plans and identical plan
identity.

The engine uses no hidden state, current time, random value, locale ordering,
environment variable, repository, network, process state, AI, or external I/O.

# Materialization Failure Contract

The engine shall use the repository's existing deterministic error pattern: a
single immutable engine error carrying one stable code and deterministic
message. This is a capability-specific specialization of the HCES-0000
governed failure contract, not a second validation framework.

| Code | HCES category | Trigger |
| --- | --- | --- |
| `NO_MATCHING_EXECUTION_PLANNING_RULE` | `RuleConflict` | No supplied effective rule matches, including an empty rule set. |
| `AMBIGUOUS_EXECUTION_PLANNING_RULE` | `RuleConflict` | Equally authoritative matching rules remain after normative precedence. |
| `DUPLICATE_OPERATIONAL_RECOMMENDATION` | `RejectedInput` | Duplicate canonical recommendation identifiers. |
| `INCOMPATIBLE_RECOMMENDATION_ORGANIZATIONS` | `IncompatibleRecommendations` | Input recommendations do not share one Organization. |
| `INCOMPATIBLE_RECOMMENDATION_PROVENANCE` | `PolicyConflict` or `TraceConflict` | A matched predicate's required shared or allowed provenance constraint fails. |
| `INVALID_EXECUTION_PLANNING_RULE_TEMPLATE` | `ValidationFailure` | A rule contains malformed, empty, unsupported, or internally inconsistent template data. |
| `UNKNOWN_EXECUTION_PLANNING_TEMPLATE_BINDING` | `ValidationFailure` | A named binding does not resolve to one selected recommendation or uses an unsupported binding kind. |
| `UNKNOWN_EXECUTION_PLANNING_TEMPLATE_PLACEHOLDER` | `ValidationFailure` | Any placeholder syntax occurs while interpolation is prohibited. |
| `EMPTY_EXECUTION_PLAN_FIELD` | `ValidationFailure` | Materialization would produce an empty required plan or work-package field. |
| `DUPLICATE_EXECUTION_PLAN_WORK_PACKAGE` | `ValidationFailure` | Materialization produces duplicate work-package identity. |
| `UNKNOWN_EXECUTION_PLAN_DEPENDENCY` | `ValidationFailure` | A dependency references no materialized work package. |
| `EXECUTION_PLAN_DEPENDENCY_CYCLE` | `ValidationFailure` | Materialized dependencies contain a cycle. |
| `INCONSISTENT_EXECUTION_PLAN_REQUIREMENTS` | `ValidationFailure` | Plan-level capability or resource declarations differ from the work-package union. |
| `INVALID_EXECUTION_PLANNING_TIMESTAMP` | `RejectedInput` | Generation timestamp is missing, malformed, lacks an offset, or is not finite. |
| `SYSTEM_FAILURE` | `SystemFailure` | An unexpected internal failure occurs after governed validation. It shall not conceal a known failure above. |

No failure may silently omit a recommendation, rule, work package, edge, or
required field. A failure returns no `ExecutionPlan`.

# Organization Compatibility

Every input `OperationalRecommendation` contains immutable
`organizationId: Identifier` under ADR-0007.

The engine derives Organization compatibility solely from those artifacts.
All recommendations in one request shall share the same Organization.

Organization identity shall not be supplied through context, repository
lookup, trace inference, or hidden state. The resulting plan preserves the
same Organization unchanged.

# Provenance

The engine preserves:

- Organization identity;
- every recommendation identifier and schema version;
- every recommendation rule identifier and version;
- every recommendation policy identifier and version;
- every recommendation trace identifier;
- the selected planning rule identifier and version;
- the selected planning policy identifier and version; and
- the explicit generation timestamp.

Recommendation provenance and planning provenance remain distinct. Neither is
rewritten or inferred.

# Success Boundary

The selected rule supplies completion and success criteria as literal plan
content.

The engine never evaluates completion or success. `ObservedOutcome` remains
solely responsible for outcome evaluation.

# HCOD / HCIS

The engine performs no constitutional reasoning. It applies only previously
governed policy supplied through the Released-rule boundary.

# Non-Goals

The engine shall never:

- execute work;
- schedule work;
- assign owners;
- allocate resources;
- invoke AI;
- call external systems;
- persist state;
- create repositories;
- expose APIs;
- update dashboards;
- mutate recommendations or rules; or
- manage rule or recommendation lifecycle.

# Validation

Implementation acceptance requires verification of:

- closed predicate parsing and matching;
- effective-period evaluation from explicit time;
- zero-match and ambiguous-match failures;
- canonical multi-recommendation normalization;
- duplicate and mixed-Organization rejection;
- exact field-source conformance;
- literal template enforcement;
- binding resolution;
- deterministic work-package identity;
- dependency integrity;
- immutable inputs and output;
- complete provenance;
- deterministic serialization and plan identity;
- no hidden dependencies or side effects; and
- repeatable test execution.

# Repository Materialization

The accepted engine is materialized by:

- `packages/engines/src/planning/ExecutionPlanningEngine.ts`;
- `packages/engines/src/planning/index.ts`;
- `packages/engines/tests/execution-planning-engine.test.ts`;
- `packages/domain/src/intelligence/ExecutionPlan.ts`;
- `packages/domain/src/rules/ExecutionPlanningRule.ts`;
- `packages/domain/tests/execution-plan.test.ts`; and
- `packages/domain/tests/execution-planning-rule.test.ts`.

The engine depends on the existing domain package. It does not modify or own
`RuntimeExecutionPlan`, `ExecutionEngine`, or runtime execution contracts.

# Release Boundary

`ExecutionPlanningEngine` and Capability 007 are verified but not released.
No Release Record exists. Specification acceptance, implementation completion,
VVR acceptance, successful tests, typechecks, builds, staging, merge, or commit
do not independently establish or authorize release.

# Revision History

## Version 1.1.0 — Accepted

- Closed the rule-materialization blocker identified before engine
  implementation.
- Replaced underspecified generic predicate and output content with closed
  immutable grammars.
- Defined complete `ExecutionPlan` field sourcing.
- Defined literal-only templates, bindings, work-package identity, rule
  precedence, policy semantics, upstream admissibility, explicit timestamp
  semantics, and stable failures.
- Retained HCES-0007, ADR-0007, ADR-0008, and the planning/runtime boundary
  unchanged.

## Version 1.0 — Superseded by 1.1.0

- Established the accepted deterministic execution-planning boundary.
- Left planning-rule predicate and materialization grammar unspecified.
