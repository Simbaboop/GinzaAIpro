# SAS-0003: Intelligence Engine

## Status

Normative.

Implementation specification for Sprint 2.5.

Governed by:

- ADR-0015: Canonical Capture Boundary;
- ADR-0016: Canonical Business Diagnosis;
- SAS-0002: Deterministic Capture Engine.

## Purpose

Specify the canonical Intelligence Engine that transforms validated Evidence
into immutable Intelligence.

This specification defines:

- engine responsibilities;
- inputs;
- outputs;
- deterministic behavior;
- interpretation invariants;
- diagnostics and explanations;
- package ownership and dependency boundaries;
- verification requirements.

## Governing question

The Intelligence Engine answers:

> "What does this validated evidence mean operationally?"

It must never answer:

- What happened?
- Can it be trusted?
- What should be done?
- Was it executed correctly?

Capture records what was observed. Validation determines what qualifies as
fact. Intelligence establishes operational meaning. Recommendation and
Execution remain downstream responsibilities.

## Canonical flow

```text
Evidence
   |
Operational Interpretation
   |
Intelligence
   |
Analytical Views (future)
   |
Priority
```

The Intelligence Engine stops after producing canonical Intelligence. It
does not create analytical views, priority profiles, Recommendations,
execution plans, Actions, or Outcomes.

## Input

The engine consumes only:

```ts
readonly Evidence[]
```

Every input record must be canonical domain Evidence that has already passed
Validation. The input is an interpretation set: all supplied Evidence must be
eligible to support one operational conclusion.

The engine must not consume:

- `BusinessSignal`;
- `CaptureInput`;
- runtime or kernel Finding;
- adapter or connector payloads;
- validation implementation results other than canonical Evidence;
- mutable application DTOs;
- persistence or runtime state.

### Input invariants

The input set must:

- contain at least one Evidence record;
- contain no missing, null, sparse, or non-Evidence entry;
- contain no duplicate Evidence identity;
- contain Evidence from exactly one Organization;
- match `EngineContext.organizationId`;
- contain only Evidence whose originating signal validation status is
  `"valid"`;
- be treated as immutable;
- support exactly one deterministic operational interpretation.

Evidence ordering is not semantic. Before interpretation and identity
construction, Evidence is canonically ordered by `Evidence.id.value`.
Equivalent permutations of the same Evidence set must produce equivalent
Intelligence.

## Output

The engine produces:

```ts
readonly Intelligence[]
```

A successful invocation produces exactly one Intelligence record for the
input interpretation set. Multiple independent operational conclusions
require independently evaluated interpretation sets.

Every Intelligence record must:

- reference one or more Evidence identifiers;
- reference every Evidence record used to support its conclusion;
- belong to the same Organization as all supporting Evidence and the engine
  context;
- contain one canonical operational interpretation;
- contain one mandatory classification;
- contain explicit assumptions;
- contain explicit limitations;
- contain confidence in the operational interpretation;
- contain a creation timestamp sourced from
  `EngineContext.executionTime`;
- be immutable and explainable.

`createdAt` must be the UTC ISO representation of
`EngineContext.executionTime`. The Intelligence Engine must not read the
current system clock.

On failure, the engine returns no Intelligence value.

## Responsibilities

The Intelligence Engine SHALL:

- interpret validated Evidence;
- establish operational meaning;
- classify Intelligence;
- preserve explainability;
- preserve complete Evidence lineage;
- preserve Organization boundaries;
- preserve determinism;
- return stable diagnostics and explanations;
- reject unsupported or ambiguous interpretation.

The Intelligence Engine SHALL NOT:

- prioritize;
- recommend;
- execute;
- mutate Evidence;
- change Evidence validity or confidence;
- estimate economic loss;
- create Leakage, Risk, Opportunity, Strength, or other analytical views;
- create or consume runtime Finding;
- perform persistence, publication, orchestration, or external I/O.

## Interpretation rules

Each Intelligence record represents exactly one operational conclusion.

That conclusion must be:

- supported by the supplied Evidence;
- attributable to the exact supporting Evidence identifiers;
- explainable in stable business language;
- reviewable without access to hidden reasoning;
- bounded by explicit assumptions and limitations.

Interpretation must never introduce an unsupported assertion. A conclusion
must not claim a business condition, cause, impact, owner, severity, or
recommended action that cannot be supported by the Evidence and the applied
deterministic interpretation rule.

### Deterministic interpretation policy

Sprint 2.5 interpretation must use a closed, explicit, versioned rule
catalog. Each supported rule must define:

- a stable rule identifier and version;
- Evidence eligibility conditions;
- the required Evidence constellation;
- exactly one `IntelligenceCategory`;
- a stable title and operational-interpretation template;
- assumptions required by the interpretation;
- known limitations and missing context;
- a deterministic interpretation-confidence rule.

No rule may depend on input order, wall-clock time, random state, external
data, mutable process state, or nondeterministic prose generation.

Exactly one rule must support the Evidence set. If no rule supports it, the
interpretation is unsupported. If competing rules imply different
classifications or operational conclusions, classification fails rather than
selecting one implicitly.

The rule catalog is an Intelligence implementation concern. It must not be
placed in domain, core, Validation, adapters, or runtime infrastructure.

## Evidence lineage

The Intelligence `evidenceIds` collection must contain the canonically
ordered identifiers of all Evidence used by the interpretation rule.

The engine must not:

- omit supporting Evidence;
- add an Evidence identifier that was not supplied;
- replace Evidence identity with signal identity;
- replace Evidence identity with Finding identity;
- embed mutable Evidence objects in Intelligence.

Evidence lineage is required for auditability, review, and downstream
explanation.

## Confidence

Intelligence confidence represents:

> confidence in the operational interpretation.

It does not represent confidence in Evidence validity. Evidence confidence is
upstream and remains unchanged.

The engine must not silently copy, average, maximize, or otherwise reinterpret
Evidence confidence as Intelligence confidence. Each supported
interpretation rule must define a deterministic basis for interpretation
confidence and document that basis in the explanation.

The resulting confidence must be a valid canonical `Percentage`. Invalid or
unsupported confidence calculation fails the invocation; it must not be
clamped or defaulted.

## Assumptions

Every Intelligence record must explicitly record the assumptions required
for its operational interpretation.

Assumptions:

- must be attributable to the applied interpretation rule;
- must be stable for equivalent Evidence;
- must be normalized, non-blank strings;
- must not be disguised conclusions or Recommendations;
- must be represented by an immutable collection.

An empty assumptions collection is valid only when the applied rule
explicitly requires no assumptions.

## Limitations

Every Intelligence record must explicitly record:

- known uncertainty;
- scope limitations;
- missing context.

Limitations:

- must be stable for equivalent Evidence;
- must be normalized, non-blank strings;
- must not be omitted merely to increase apparent confidence;
- must be represented by an immutable collection.

An empty limitations collection is valid only when the applied rule
explicitly identifies no known limitation or missing context.

## Classification

Classification is mandatory.

Sprint 2.5 uses only the existing `IntelligenceCategory` values:

- `"leakage"`;
- `"opportunity"`;
- `"risk"`;
- `"strength"`.

No new Intelligence category may be introduced by Sprint 2.5.

Classification identifies the kind of operational meaning expressed by the
Intelligence. It does not create an analytical profile, economic estimate,
priority, or Recommendation.

The applied interpretation rule must select exactly one category. An
unsupported, missing, or conflicting classification fails the invocation.

## Deterministic identity

Intelligence identity must be stable for the same canonical Evidence set and
interpretation rule.

Identity material consists only of:

1. a stable Intelligence identity version;
2. `organizationId.value`;
3. the applied interpretation rule identifier and version;
4. the selected `IntelligenceCategory`;
5. the canonically ordered supporting Evidence identifier values.

Identity must not use:

- randomness;
- current system time;
- `EngineContext.executionTime`;
- correlation identifiers;
- process state;
- runtime duration;
- environment variables;
- external I/O.

The exact encoding and hashing procedure must be stable, documented inside
the Intelligence package, and covered by a fixed-vector test before the
implementation is accepted. Identity utilities remain package-private and
must not become domain or core abstractions.

## Determinism

Given equivalent Evidence, interpretation-policy version, and Organization
context, the engine must produce substantively equivalent Intelligence.

Equivalent Evidence means the same immutable Evidence records by identity
and content, regardless of input order.

Substantive equivalence requires:

- the same Intelligence identity;
- the same category;
- the same canonically ordered supporting Evidence identifiers;
- semantically equivalent operational explanation;
- equivalent assumptions;
- equivalent limitations;
- equivalent interpretation confidence;
- the same diagnostic codes, severities, messages, and ordering;
- equivalent result explanation.

For the same implementation and policy version, normalized titles,
explanations, assumptions, limitations, diagnostics, and result explanations
must be exactly reproducible. `createdAt` is sourced from
`EngineContext.executionTime`; runtime duration is excluded from substantive
equivalence.

The engine must not use:

- randomness;
- the live system clock;
- external services;
- network or filesystem I/O;
- persistence;
- environment-dependent rules;
- LLM or generative-model output;
- nondeterministic iteration or rule ordering.

## Diagnostics

Diagnostic codes, severity, messages, recommendations, and ordering are
stable public behavior.

The engine is fail-fast. A failed result:

- has `success === false`;
- has no value;
- contains exactly one error diagnostic for the first failed rule;
- contains a deterministic failure explanation;
- performs no subsequent interpretation work.

### Stable diagnostic catalog

| Code | Severity | Trigger | Result |
| --- | --- | --- | --- |
| `INTELLIGENCE_EMPTY_EVIDENCE_SET` | `error` | The input collection contains no Evidence. | Failure; no value. |
| `INTELLIGENCE_MISSING_EVIDENCE` | `error` | An expected input position is sparse, null, undefined, or otherwise missing. | Failure; no value. |
| `INTELLIGENCE_UNSUPPORTED_EVIDENCE` | `error` | An entry is not canonical validated Evidence or cannot participate in Intelligence interpretation. | Failure; no value. |
| `INTELLIGENCE_DUPLICATE_EVIDENCE` | `error` | Two or more entries have the same Evidence identity. | Failure; no value. |
| `INTELLIGENCE_MIXED_ORGANIZATIONS` | `error` | Supplied Evidence belongs to more than one Organization. | Failure; no value. |
| `INTELLIGENCE_ORGANIZATION_MISMATCH` | `error` | The Evidence Organization does not equal `EngineContext.organizationId`. | Failure; no value. |
| `INTELLIGENCE_INVALID_CONFIDENCE` | `error` | The interpretation rule cannot produce a valid canonical `Percentage`. | Failure; no value. |
| `INTELLIGENCE_CLASSIFICATION_FAILURE` | `error` | No single mandatory category can be selected, or supported rules conflict. | Failure; no value. |
| `INTELLIGENCE_UNSUPPORTED_INTERPRETATION` | `error` | Evidence is valid, but no supported operational conclusion can be established without unsupported assertions. | Failure; no value. |
| `INTELLIGENCE_CREATED` | `info` | One canonical Intelligence record was produced successfully. | Success; immutable value returned. |

### Deterministic validation order

The engine evaluates requirements in this order:

1. empty Evidence set;
2. missing Evidence;
3. unsupported or non-canonical Evidence;
4. duplicate Evidence identity;
5. mixed Evidence Organizations;
6. EngineContext Organization mismatch;
7. interpretation-rule eligibility;
8. classification uniqueness;
9. interpretation support;
10. interpretation confidence;
11. identity and Intelligence construction.

The first failed rule determines the returned diagnostic. Successful
construction returns `INTELLIGENCE_CREATED`.

## Explanation requirements

Every engine result must contain an immutable core `Explanation`.

A successful explanation must:

- reference exactly the supporting Evidence identifiers;
- carry the same interpretation confidence as the produced Intelligence;
- preserve the Intelligence assumptions and limitations;
- identify the applied deterministic interpretation rule and version;
- state the operational conclusion established;
- state that no prioritization, Recommendation, execution, or analytical
  profile was produced.

A failed explanation must:

- reference only valid attributable Evidence identifiers available before
  the failure;
- identify the stable failure diagnostic;
- state that no Intelligence was created;
- describe the failed rule without exposing raw payloads, stack traces, or
  hidden reasoning;
- use stable, deterministic prose.

Explanations report applied rules and observable outcomes. They must not
expose chain-of-thought or nondeterministic generated reasoning.

## Immutability

The engine must not mutate:

- the input Evidence array;
- any Evidence record;
- Evidence identifiers;
- Evidence statements, confidence, or lineage;
- `EngineContext`.

The output Intelligence array, Intelligence record, Evidence identifier
collection, assumptions, limitations, diagnostics, and result explanation
must be immutable or defensively copied according to existing domain and core
conventions.

## Package ownership

Canonical ownership is:

| Package responsibility | Owned meaning |
| --- | --- |
| Capture | Observation |
| Validation | Qualified fact |
| Intelligence | Operational meaning |
| Priority | Relative importance |
| Recommendation | Proposed action |
| Execution | Governed action |

No package may absorb or redefine the semantic responsibility of another
stage.

## Package boundaries

The concrete Intelligence implementation belongs in:

```text
packages/intelligence
```

The package is named:

```text
@ginzaaipro/intelligence
```

It may depend on:

- `@ginzaaipro/core`;
- `@ginzaaipro/domain`.

It must not depend on:

- `@ginzaaipro/kernel`;
- `@ginzaaipro/capture`;
- the Validation implementation package;
- adapters or connectors;
- runtime or platform packages;
- persistence or orchestration packages.

`packages/core` continues to own the `IntelligenceEngine` behavioral
contract. `packages/domain` continues to own canonical Evidence and
Intelligence business entities. Neither core nor domain may depend on the
Intelligence implementation package.

Cross-package imports must use canonical package names. Relative
cross-package imports are prohibited. No circular dependency may be
introduced.

The interpretation rule catalog, identity utility, normalization,
diagnostic factory, and explanation factory remain internal implementation
details and must not be exported as competing contracts.

## Test matrix

Sprint 2.5 must include at least the following tests:

| Test | Required assertion |
| --- | --- |
| Single Evidence | One supported Evidence record produces exactly one immutable Intelligence record with that Evidence identifier. |
| Multiple Evidence | A supported interpretation set produces one Intelligence record containing every supporting Evidence identifier in canonical order. |
| Empty input | Returns `INTELLIGENCE_EMPTY_EVIDENCE_SET`, failure, and no value. |
| Missing Evidence | Sparse, null, or undefined input returns `INTELLIGENCE_MISSING_EVIDENCE`, failure, and no value. |
| Unsupported Evidence | A non-canonical or ineligible Evidence entry returns `INTELLIGENCE_UNSUPPORTED_EVIDENCE`. |
| Duplicate Evidence | Repeated Evidence identity returns `INTELLIGENCE_DUPLICATE_EVIDENCE`, failure, and no value. |
| Mixed Organizations | Evidence from multiple Organizations returns `INTELLIGENCE_MIXED_ORGANIZATIONS`, failure, and no value. |
| Context Organization mismatch | A uniform Evidence Organization differing from context returns `INTELLIGENCE_ORGANIZATION_MISMATCH`. |
| Invalid confidence | Invalid interpretation confidence returns `INTELLIGENCE_INVALID_CONFIDENCE`; confidence is not clamped or defaulted. |
| Classification | Supported rules produce only `leakage`, `opportunity`, `risk`, or `strength`. |
| Classification failure | Missing or conflicting classification returns `INTELLIGENCE_CLASSIFICATION_FAILURE`. |
| Unsupported interpretation | Valid Evidence that cannot support a conclusion returns `INTELLIGENCE_UNSUPPORTED_INTERPRETATION`. |
| Explanation generation | Success and failure explanations contain exact stable lineage, confidence, assumptions, limitations, rule attribution, and reasoning. |
| Assumption preservation | Rule assumptions are normalized, preserved exactly, immutable, and reproducible. |
| Limitation preservation | Rule limitations are normalized, preserved exactly, immutable, and reproducible. |
| Determinism | Equivalent Evidence permutations and equivalent context produce the same identity and equivalent substantive output. |
| Fixed identity vector | The documented canonical identity material produces the expected stable identifier. |
| Evidence lineage | Output contains all and only the Evidence identifiers used by the interpretation. |
| Creation timestamp | `createdAt` equals `EngineContext.executionTime`; the live clock is not consulted. |
| Input immutability | Execution does not mutate the Evidence collection or any Evidence record. |
| Immutable output | Result, output array, Intelligence, identifier arrays, assumptions, limitations, diagnostics, and explanations cannot be mutated through returned references. |
| Fail-fast ordering | Inputs with multiple defects return the first diagnostic in the normative validation order. |
| No downstream behavior | No analytical view, priority, Recommendation, execution record, Action, or Outcome is created. |
| Public package resolution | Canonical root imports from core, domain, and Intelligence compile without relative cross-package imports. |
| Package boundaries | Intelligence contains no kernel, capture, Validation-implementation, adapter, runtime, persistence, or orchestration dependency. |

Tests must not depend on input order, the current time, elapsed duration,
randomness, process state, network access, filesystem state, external
services, or test execution order.

## Acceptance criteria

Sprint 2.5 implementation is complete only when:

- all input, interpretation, lineage, Organization, classification,
  confidence, explanation, and immutability invariants hold;
- deterministic identity and substantive behavior are verified;
- all Intelligence package tests pass;
- all domain and core contract tests pass;
- the full workspace build passes;
- the full workspace typecheck passes;
- all full workspace tests pass;
- canonical package imports and declarations resolve;
- package-boundary tests verify all forbidden dependencies are absent;
- no circular dependencies or relative cross-package imports exist;
- immutable canonical Intelligence is produced;
- no Evidence is mutated;
- no analytical view, prioritization, Recommendation, or execution behavior
  is implemented;
- no kernel, adapter, runtime-integration, persistence, orchestration, or
  external-I/O dependency exists;
- no unrelated files are changed.

## Out of scope

SAS-0003 does not define or implement:

- analytical views or profile structures;
- Leakage, Risk, Opportunity, or Strength profiles;
- prioritization;
- Recommendation;
- execution;
- LLM prompting or generative interpretation;
- runtime orchestration;
- adapters or connectors;
- persistence;
- changes to kernel Finding;
- autonomous reasoning across external business systems.
