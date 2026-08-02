# HCES-0000A

Rule Specification Pattern

**Status:** Accepted

This specification defines the canonical structure for every governed rule
used by deterministic engines in GinzaAIpro.

It governs rule structure and lifecycle.

It does not define business capabilities or engine behavior.

# Scope

Applies to all governed rules, including:

- `LeakageRule`
- `PriorityRule`
- `RecommendationRule`
- `ExecutionPlanningRule`
- `OutcomeRule`
- future deterministic rules

# Governing Principle

A rule is an immutable, versioned expression of approved business policy that
deterministically evaluates input state and defines the corresponding output
template.

# Rule Contract

Every released rule shall contain:

- `ruleId`
- `ruleVersion`
- `policyId`
- `policyVersion`
- `enabled`
- `effectiveFrom`
- `effectiveTo`
- `priority`
- `predicate`
- `outputTemplate`
- `metadata`

# Rule Lifecycle

```text
Draft
  ↓
Review
  ↓
Approved
  ↓
Released
  ↓
Deprecated
  ↓
Archived
```

Only Released rules are executable.

# Rule Properties

Every rule shall be:

- Immutable after release
- Versioned
- Traceable
- Deterministic
- Capability-neutral
- Independently testable
- Policy-linked

# Predicate Contract

A predicate evaluates whether input state satisfies the rule.

Evaluation returns only:

- Matched
- Not Matched

Evaluation shall not modify input state.

# Output Template

The output template specifies the immutable artifact to be materialized when
the predicate matches.

Rules never create mutable objects.

# Rule Boundaries

Rules shall never:

- invoke AI;
- access databases;
- schedule work;
- persist state;
- call external services;
- allocate resources;
- execute workflows; or
- modify existing entities.

# Traceability

Every rule execution shall preserve:

- `ruleId`
- `ruleVersion`
- `policyId`
- `policyVersion`
- `traceId`
- `sourceArtifactId`

# Validation

Acceptance requires:

- immutable released rules;
- deterministic evaluation;
- version preservation;
- complete traceability; and
- independent unit tests.

# Repository Guidance

`packages/rules/`

Future rule implementations shall conform to this specification.

# COSMOS Mapping

```text
Observed State
      ↓
Released Rule
      ↓
Derived State
      ↓
Evidence
```

# HCOD / HCIS

Rules express previously approved organizational policy.

Constitutional reasoning occurs before rule release, never during execution.

# Conformance

All future rule specifications shall conform to HCES-0000A.
