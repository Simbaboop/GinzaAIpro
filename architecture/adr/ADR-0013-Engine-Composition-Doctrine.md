# ADR-0013: Engine Composition Doctrine

## Status

Accepted for Sprint 2.3.

## Decision

Concrete engines live in focused implementation packages. `@ginzaaipro/core` owns behavioral interfaces; `@ginzaaipro/domain` owns business meaning. The validation implementation depends downward on both and is not imported by either.

Validation composes small ordered validators internally. It does not introduce a service locator, dependency-injection framework, registry, event bus, or orchestration layer.

## Consequence

The public package surface remains narrow while internal gate behavior can be tested independently.
