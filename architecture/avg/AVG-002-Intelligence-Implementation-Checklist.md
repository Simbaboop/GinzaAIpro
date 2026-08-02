# AVG-002: Intelligence Engine Implementation Checklist

## Status

Implementation readiness checklist for Sprint 2.5.

This document is not an architecture decision or implementation
specification. ADR-0016 and SAS-0003 remain authoritative. AVG-002 remains
the final authority for architecture verification.

## Purpose

Define the implementation checklist that must be satisfied before the Sprint
2.5 Intelligence Engine can be submitted for Architecture Verification Gate
AVG-002.

This document verifies implementation readiness and conformance. It does not
restate or replace the normative requirements in:

- ADR-0016: Canonical Business Diagnosis;
- SAS-0003: Intelligence Engine;
- the upstream boundaries established by ADR-0015 and SAS-0002.

## Scope

This checklist applies only to:

```text
packages/intelligence
```

No other package may be modified unless the modification is explicitly
identified, justified as necessary for package integration, and reviewed as
part of AVG-002.

Before submission:

- [ ] All changes outside `packages/intelligence` are listed.
- [ ] Every out-of-package change has a written integration justification.
- [ ] No unrelated domain, core, kernel, capture, Validation, adapter,
      runtime, application, or capability change is included.
- [ ] ADR-0016 and SAS-0003 have not been altered to accommodate the
      implementation.

## Required package structure

The expected layout is:

```text
packages/intelligence/
├── src/
│   ├── DeterministicIntelligenceEngine.ts
│   ├── interpretation/
│   │   ├── InterpretationPolicy.ts
│   │   ├── RuleCatalog.ts
│   │   └── rules/
│   ├── diagnostics/
│   ├── factories/
│   ├── identity/
│   ├── normalization/
│   └── index.ts
├── tests/
├── package.json
└── tsconfig.json
```

Internal organization and filenames may vary, but equivalent responsibilities
must exist and remain clearly separated.

- [ ] A concrete deterministic engine entry point exists.
- [ ] Interpretation policy is isolated from engine orchestration.
- [ ] The versioned rule catalog and individual rules have an identifiable
      home.
- [ ] Diagnostics are separated from interpretation logic.
- [ ] Diagnostic and explanation construction responsibilities are isolated.
- [ ] Identity construction is package-private and isolated.
- [ ] Input normalization and invariant checks are identifiable.
- [ ] Tests are contained in the package test area.
- [ ] The package has established workspace scripts and TypeScript
      configuration.
- [ ] The package root exports only the intended public API.

## Required components

- [ ] Deterministic Intelligence Engine.
- [ ] Interpretation Policy.
- [ ] Versioned Rule Catalog.
- [ ] Deterministic identity generation.
- [ ] Diagnostic Factory.
- [ ] Explanation Factory.
- [ ] Normalization and invariant utilities.
- [ ] Public package exports.
- [ ] Comprehensive tests traceable to SAS-0003.
- [ ] Package manifest and declaration-generating TypeScript configuration.

## Engine checklist

- [ ] The engine implements the existing core `IntelligenceEngine` contract.
- [ ] The input is only `readonly Evidence[]`.
- [ ] Successful execution returns exactly one canonical Intelligence record
      for one supported interpretation set.
- [ ] Failed execution returns no Intelligence value.
- [ ] The engine stops after producing Intelligence.
- [ ] The engine performs no analytical profiling, prioritization,
      Recommendation, execution, or outcome behavior.
- [ ] `createdAt` is sourced only from `EngineContext.executionTime`.
- [ ] The live system clock is not read.
- [ ] Input Evidence and `EngineContext` are never mutated.

## Rule catalog checklist

- [ ] The catalog declares an explicit version.
- [ ] Every rule has a stable identifier.
- [ ] Every rule has an explicit version.
- [ ] Catalog iteration order is deterministic.
- [ ] Rule order does not create implicit precedence.
- [ ] Conflicting rules are detected rather than resolved by incidental
      ordering.
- [ ] Rules declare their Evidence eligibility requirements.
- [ ] Rules declare one supported Intelligence classification.
- [ ] Rules declare deterministic interpretation confidence behavior.
- [ ] Rule collections and rule definitions cannot be mutated at runtime.
- [ ] Rule identifiers and versions are available to identity and explanation
      construction.
- [ ] The catalog is internal and is not exported as a competing public
      contract.

## Interpretation policy checklist

- [ ] Rule selection is deterministic for equivalent Evidence.
- [ ] Exactly one supported rule is required for success.
- [ ] No supported rule produces the SAS-0003 unsupported-interpretation
      failure.
- [ ] Multiple incompatible rules produce the SAS-0003 classification
      failure.
- [ ] Conflict detection is explicit and tested.
- [ ] Unsupported Evidence is distinguished from unsupported interpretation.
- [ ] The applied rule identifier and version are reported to explanation
      construction.
- [ ] The policy introduces no unsupported assertion.
- [ ] The policy does not infer priority, recommended action, execution, or
      economic loss.
- [ ] The policy uses no LLM, generated prose, external lookup, or mutable
      runtime state.

## Evidence and Organization checklist

- [ ] Empty Evidence input is rejected.
- [ ] Missing, null, undefined, sparse, or non-canonical entries are rejected
      according to SAS-0003.
- [ ] Only validated canonical Evidence is eligible.
- [ ] Duplicate Evidence identity is rejected.
- [ ] Evidence from mixed Organizations is rejected.
- [ ] The uniform Evidence Organization must match
      `EngineContext.organizationId`.
- [ ] Output lineage contains all and only the Evidence used by the
      interpretation.
- [ ] Evidence identifiers are canonically ordered.
- [ ] Evidence identity is not replaced with signal or Finding identity.

## Identity checklist

- [ ] Intelligence identity is deterministic.
- [ ] Equivalent Evidence permutations produce the same identity.
- [ ] Evidence identifiers participate in canonical order.
- [ ] Organization identity participates in identity construction.
- [ ] Applied rule identifier and version participate in identity
      construction.
- [ ] Intelligence classification participates in identity construction.
- [ ] Identity encoding and hashing behavior is documented internally.
- [ ] A fixed identity vector verifies the canonical algorithm.
- [ ] Timestamps do not participate in identity.
- [ ] Correlation identifiers and runtime duration do not participate in
      identity.
- [ ] No randomness, process state, environment state, persistence, or
      external I/O participates in identity.
- [ ] Identity utilities remain package-private.

## Classification checklist

- [ ] Classification is mandatory.
- [ ] Only `leakage`, `opportunity`, `risk`, and `strength` are used.
- [ ] No new Intelligence category is introduced.
- [ ] Exactly one category is produced on success.
- [ ] Missing or conflicting classification fails deterministically.
- [ ] Classification does not create an analytical profile.

## Confidence checklist

- [ ] Output confidence represents confidence in the operational
      interpretation.
- [ ] Evidence confidence remains upstream and unchanged.
- [ ] Evidence confidence is not silently copied, averaged, maximized, or
      otherwise reused as interpretation confidence.
- [ ] Each supported rule defines a deterministic confidence basis.
- [ ] The explanation reports the interpretation-confidence basis.
- [ ] Invalid interpretation confidence fails without clamping or defaulting.

## Diagnostics checklist

- [ ] Every diagnostic required by the SAS-0003 stable catalog is
      implemented.
- [ ] The diagnostic-code constant and diagnostic-code type cover the entire
      catalog.
- [ ] Every code has a stable severity.
- [ ] Every code has a stable message.
- [ ] Any recommendation text is stable.
- [ ] Validation and diagnostic ordering matches SAS-0003.
- [ ] Failure is fail-fast.
- [ ] Failure returns exactly the first applicable error diagnostic.
- [ ] Failure returns no partial Intelligence value.
- [ ] Success returns the required success diagnostic.
- [ ] Diagnostic records and returned diagnostic collections are immutable.
- [ ] Tests assert exact codes, severities, messages, recommendations, and
      ordering.

## Explanation checklist

- [ ] Successful explanations contain complete Evidence lineage.
- [ ] Successful explanations preserve Intelligence assumptions.
- [ ] Successful explanations preserve Intelligence limitations.
- [ ] Successful explanations carry interpretation confidence.
- [ ] Successful explanations identify the applied rule and version.
- [ ] Successful explanations state the operational conclusion.
- [ ] Successful explanations state that no downstream analytical view,
      priority, Recommendation, or execution was produced.
- [ ] Failed explanations identify the stable failure diagnostic.
- [ ] Failed explanations state that no Intelligence was created.
- [ ] Failed explanations include only attributable Evidence identifiers
      available before failure.
- [ ] Explanation wording is deterministic.
- [ ] Explanations contain no raw payload, stack trace, hidden reasoning, or
      chain-of-thought.
- [ ] Explanation records and their collections are immutable.

## Assumptions and limitations checklist

- [ ] Every supported rule explicitly declares assumptions.
- [ ] Every supported rule explicitly declares limitations.
- [ ] Empty collections are intentional rule declarations rather than omitted
      data.
- [ ] Assumptions and limitations are normalized and non-blank.
- [ ] Equivalent Evidence produces equivalent assumptions and limitations.
- [ ] Assumptions do not contain disguised conclusions or Recommendations.
- [ ] Limitations disclose known uncertainty, scope constraints, and missing
      context.
- [ ] Returned collections are immutable and defensively copied.

## Public API checklist

- [ ] The package root exports the deterministic Intelligence Engine.
- [ ] The package root exports the stable diagnostic-code constant.
- [ ] The package root exports the corresponding diagnostic-code type.
- [ ] Required declarations resolve through `@ginzaaipro/intelligence`.
- [ ] Interpretation rules, rule catalog implementation, identity helpers,
      normalization utilities, factories, and fixtures are not accidentally
      public.
- [ ] Public names match ADR-0016 and SAS-0003 terminology.
- [ ] No alternative Intelligence or diagnosis contract is exported.

## Package boundary checklist

The only permitted GinzaAIpro workspace dependencies are:

```text
@ginzaaipro/core
@ginzaaipro/domain
```

- [ ] `packages/intelligence` depends on core.
- [ ] `packages/intelligence` depends on domain.
- [ ] No dependency or import from kernel.
- [ ] No dependency or import from capture.
- [ ] No dependency or import from the Validation implementation.
- [ ] No dependency or implementation from adapters or connectors.
- [ ] No dependency or implementation from runtime or platform packages.
- [ ] No dependency or implementation from persistence packages.
- [ ] No dependency or implementation from orchestration packages.
- [ ] No relative cross-package imports.
- [ ] Domain and core do not depend on the Intelligence implementation.
- [ ] No circular dependency is introduced.
- [ ] Development dependencies are limited to established compilation and
      testing tools.
- [ ] No external runtime dependency or external I/O is introduced.

## SAS-0003 test coverage checklist

The implementation test suite must contain explicit coverage traceable to
every SAS-0003 test-matrix entry. The assertions remain defined by SAS-0003
and are not repeated here.

- [ ] Single Evidence.
- [ ] Multiple Evidence.
- [ ] Empty input.
- [ ] Missing Evidence.
- [ ] Unsupported Evidence.
- [ ] Duplicate Evidence.
- [ ] Mixed Organizations.
- [ ] Context Organization mismatch.
- [ ] Invalid confidence.
- [ ] Classification.
- [ ] Classification failure.
- [ ] Unsupported interpretation.
- [ ] Explanation generation.
- [ ] Assumption preservation.
- [ ] Limitation preservation.
- [ ] Determinism.
- [ ] Fixed identity vector.
- [ ] Evidence lineage.
- [ ] Creation timestamp.
- [ ] Input immutability.
- [ ] Immutable output.
- [ ] Fail-fast ordering.
- [ ] No downstream behavior.
- [ ] Public package resolution.
- [ ] Package boundaries.

Additionally:

- [ ] A test-to-SAS traceability table or equivalent mapping is available for
      AVG-002 review.
- [ ] Tests do not depend on input order, current time, elapsed duration,
      randomness, process state, external services, filesystem state, or
      execution order.
- [ ] Tests assert substantive values through public behavior rather than
      relying only on private-field object equality.

## Repository checklist

- [ ] `@ginzaaipro/domain` build passes.
- [ ] `@ginzaaipro/core` build passes.
- [ ] `@ginzaaipro/intelligence` build passes.
- [ ] Full workspace build passes.
- [ ] Domain typecheck passes.
- [ ] Core typecheck passes.
- [ ] Intelligence package typecheck passes.
- [ ] Full workspace typecheck passes.
- [ ] Domain tests pass.
- [ ] Core tests pass.
- [ ] Intelligence package tests pass.
- [ ] Full workspace tests pass.
- [ ] Declaration generation succeeds.
- [ ] Canonical package imports resolve from compiled consumers.
- [ ] Workspace dependency graph contains no cycle.
- [ ] Static boundary verification finds no forbidden package import.
- [ ] Static verification finds no relative cross-package import.
- [ ] Static verification finds no random, live-clock, network, filesystem,
      persistence, runtime, or orchestration dependency.
- [ ] `git diff --check` passes.
- [ ] Repository status contains only intended Sprint 2.5 changes and
      explicitly justified integration metadata.
- [ ] No unrelated file is modified.
- [ ] No generated build output or local package cache is included.

## Submission evidence

The AVG-002 submission must include:

- [ ] The final changed-file list.
- [ ] The final package dependency graph.
- [ ] The final public export list.
- [ ] Rule catalog version and stable rule identifiers.
- [ ] Identity fixed-vector result.
- [ ] Diagnostic catalog verification.
- [ ] SAS-0003 test traceability.
- [ ] Package and full-workspace build results.
- [ ] Package and full-workspace typecheck results.
- [ ] Package and full-workspace test results.
- [ ] Static forbidden-dependency results.
- [ ] Final `git status --short`.
- [ ] Any justified deviation, unresolved concern, or warning.

## Exit criteria

Implementation is eligible for AVG-002 only when:

- [ ] Every applicable checklist item is satisfied.
- [ ] Every SAS-0003 invariant and acceptance criterion is satisfied.
- [ ] All required submission evidence is available.
- [ ] No undocumented deviation remains.
- [ ] No release blocker is known.

Checklist completion makes the implementation eligible for review; it does
not grant architecture approval. AVG-002 remains the final authority.
