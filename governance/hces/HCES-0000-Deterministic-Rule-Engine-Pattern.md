# HCES-0000

Deterministic Rule Engine Pattern

**Status:** Accepted

This specification defines the canonical engineering contract for every
deterministic rule engine in GinzaAIpro.

It governs engine behavior.

It does not define business capabilities.

# Scope

Applies to every deterministic engine including, but not limited to:

- `LeakageRuleEngine`
- `PriorityRuleEngine`
- `RecommendationRuleEngine`
- `ExecutionPlanningEngine`
- `OutcomeEvaluationEngine`
- future deterministic engines

# Governing Principle

A deterministic rule engine transforms immutable input state into immutable
output state by applying released, versioned rules without side effects.

# Engine Contract

```text
Input State
     ↓
Released Rules
     ↓
Predicate Evaluation
     ↓
Output State
```

# Required Properties

Every deterministic engine shall be:

- Stateless
- Pure
- Deterministic
- Replayable
- Idempotent
- Traceable
- Versioned
- Immutable

# Engine Lifecycle

```text
Validate Inputs
       ↓
Load Released Rules
       ↓
Filter Applicable Rules
       ↓
Evaluate Predicates
       ↓
Materialize Output
       ↓
Validate Output
       ↓
Return Immutable Results
```

# Rule Contract

Every released rule shall contain:

- `ruleId`
- `ruleVersion`
- `policyId`
- `policyVersion`
- `enabled`
- `predicate`
- `outputTemplate`

# Output Contract

Outputs shall:

- preserve traceability;
- preserve identity;
- preserve schema version;
- preserve rule identity; and
- remain immutable.

# Failure Contract

Only governed failures may be returned.

Canonical failures:

- `RejectedInput`
- `RuleConflict`
- `ValidationFailure`
- `PolicyConflict`
- `SystemFailure`

# Non-Goals

Deterministic engines shall never:

- invoke AI;
- modify upstream artifacts;
- schedule work;
- allocate resources;
- execute workflows;
- persist state; or
- communicate externally.

# Validation

Acceptance requires:

- deterministic replay;
- immutable outputs;
- immutable inputs;
- rule version preservation;
- trace preservation; and
- repeatable test execution.

# Repository Guidance

Domain entities

`packages/domain`

Rules

`packages/rules`

Engines

`packages/engines`

Application orchestration

`packages/application`

# COSMOS Mapping

```text
Observed State
      ↓
Governed Rules
      ↓
Derived State
```

# HCOD / HCIS

Deterministic engines perform no constitutional reasoning.

They execute previously approved policy only.

# Conformance

Future engine specifications shall conform to HCES-0000 instead of redefining
common engine behavior.
