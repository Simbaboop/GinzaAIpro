# HCES-0003

Released Semantic Facts → Operational Conditions

**Status:** Accepted

# Capability

Capability 003

# Governing Question

What operational condition exists as a deterministic consequence of the
released semantic facts?

# Input State

Released Semantic Facts

Only RELEASED semantic facts are admissible.

Capability 003 consumes the released facts as canonical upstream artifacts. It
does not reinterpret their release status or replace the governance that made
them admissible.

# Output State

`OperationalCondition`

Immutable.

An output describes operational state attributable to its released semantic
facts and governing rule set. It does not express downstream consequence,
priority, recommendation, or authority to act.

# Transformation

Deterministically derive one or more `OperationalCondition` artifacts from one
or more released semantic facts using released rule sets.

No AI reasoning is required.

The same admissible inputs, rule set, and rule-set version must produce
equivalent outputs. The transformation must not rely on randomness, ambient
process state, external interpretation, or mutable runtime context.

# Admissibility

Inputs must:

- be RELEASED;
- have valid identity;
- have traceability; and
- satisfy rule prerequisites.

Otherwise return a governed failure.

Admissibility is evaluated before operational conditions are released. A
failure must not produce a partial canonical output or silently omit an input
that affects the governed result.

# Invariants

Preserve:

- traceability;
- immutability;
- determinism;
- replayability;
- identity stability; and
- boundary integrity.

Capability 003 must never:

- calculate leakage;
- assign priority;
- generate recommendations; or
- authorize execution.

These prohibitions keep Capability 003 descriptive. Downstream capabilities
remain responsible for consequence, prioritization, proposed action, and
governed execution.

# Identity

`OperationalCondition` identity consists of:

- artifact id;
- schema version;
- rule set version;
- trace id; and
- semantic fact references.

Identity material must be stable for deterministic replay. Reprocessing
equivalent released facts with the same released rule set must not create a
different canonical identity.

# Failure Taxonomy

Return one of:

- `RejectedInput`
- `InsufficientEvidence`
- `SemanticConflict`
- `RuleConflict`
- `ValidationFailure`
- `SystemFailure`

Failures are governed outcomes and must preserve sufficient traceability for
review without producing an invalid `OperationalCondition`.

# AI Participation

AI may assist upstream in semantic extraction.

Capability 003 itself is deterministic.

AI cannot release `OperationalCondition` artifacts.

Any upstream AI participation remains outside this capability boundary and
does not weaken input admissibility, released-rule requirements, or
deterministic replay.

# Validation

Capability is accepted when:

- deterministic replay succeeds;
- identical inputs produce identical outputs;
- identity remains stable; and
- all tests pass.

# Repository Materialization

`packages/domain/src/intelligence/OperationalCondition.ts`

`packages/domain/tests/operational-condition.test.ts`

# COSMOS Mapping

```text
Observation
    ↓
Meaning
    ↓
Operational State
```

# HCOD / HCIS

No constitutional decisions occur here.

Capability 003 remains descriptive only.
