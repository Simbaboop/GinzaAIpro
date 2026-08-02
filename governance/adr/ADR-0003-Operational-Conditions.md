# ADR-0003: Introduce OperationalCondition as the Canonical Output of Capability 003

## Status

Accepted

## Context

- OSTA defines Capability 003 as: Released Semantic Facts → Operational
  Conditions.
- The repository previously transitioned from evidence and intelligence
  concepts without an explicit operational state.
- Intelligence mixed operational interpretation with canonical state.

This left the transition from released semantic facts to downstream leakage
analysis without a dedicated canonical representation of descriptive
operational state.

## Decision

- Introduce `OperationalCondition` as a first-class immutable domain entity.
- Position it between Released Semantic Facts and Operational Leakage:

  ```text
  Released Semantic Facts → OperationalCondition → Operational Leakage
  ```

- `OperationalCondition` represents descriptive operational state only.
- It must not contain:
  - priority;
  - severity;
  - recommendations;
  - financial impact;
  - execution decisions; or
  - AI reasoning.
- Preserve existing released contracts.
- Integrate `OperationalCondition` into `packages/domain/src/intelligence`.

## Consequences

### Positive

- The semantic-to-operational transition becomes explicit.
- Capability 003 can remain deterministic.
- Operational state gains direct lineage and improved auditability.
- Downstream capabilities receive a cleaner canonical boundary.

### Negative

- The domain contains one additional canonical artifact.
- Capability 004 now depends on `OperationalCondition`.

## Alternatives Considered

### 1. Extend Intelligence

Rejected because Intelligence is interpretive rather than canonical state.
Extending it would preserve the ambiguity between interpretation and a
descriptive operational condition.

### 2. Merge into Leakage

Rejected because leakage is downstream and requires an operational condition.
Combining the two would mix descriptive state with consequential analysis.

### 3. Omit OperationalCondition

Rejected because omission would violate OSTA state separation and leave no
canonical output boundary for Capability 003.

## Repository Impact

Files added:

- `packages/domain/src/intelligence/OperationalCondition.ts`
- `packages/domain/tests/operational-condition.test.ts`

Files modified:

- `packages/domain/src/intelligence/index.ts`

## Acceptance Evidence

- Typecheck PASS
- Build PASS
- 15 tests PASS
