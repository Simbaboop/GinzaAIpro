# SAS-0001: Deterministic Validation Engine

## Governing question

Can this canonical `BusinessSignal` become trustworthy `Evidence`?

## Scope and boundary

`@ginzaaipro/validation` contains the first concrete engine implementation. It depends on `@ginzaaipro/core` behavioral contracts and `@ginzaaipro/domain` business objects. Core and domain do not depend on validation.

## Canonical flow

```text
BusinessSignal
  -> Identity
  -> Integrity
  -> Completeness
  -> Consistency
  -> Qualification
  -> Evidence
```

The pipeline is fail-fast. The first failed gate supplies the returned diagnostics and explanation; later gates do not run. Only `EvidenceFactory` constructs Evidence.

## Determinism and acceptance

Equivalent signal and context inputs produce the same decision, evidence content, diagnostic order, and explanation. Evidence identity derives from signal and correlation identifiers. Context time supplies the evidence creation timestamp. Runtime duration is excluded from substantive determinism.

Acceptance requires immutable outputs, source traceability, stable diagnostics, concise explanations, fixed gate order, no mutation, and successful package and workspace validation.

## Non-goals

No AI, persistence, external state, duplicate detection, probabilistic scoring, orchestration, telemetry, vertical-specific rules, or other engine implementations.

## COSMOS evidence plan

Hypothesis: deterministic evidence qualification reduces downstream errors caused by unreliable operational signals.

Future measures:

- validation pass rate;
- evidence promotion rate;
- failure rate by diagnostic code;
- downstream correction rate;
- mean validation latency;
- percentage of intelligence later invalidated because of source evidence defects.

Falsification condition: if qualified evidence does not improve downstream intelligence validity or reduce correction rates compared with unqualified signals, the qualification rules or underlying hypothesis must be revised.
