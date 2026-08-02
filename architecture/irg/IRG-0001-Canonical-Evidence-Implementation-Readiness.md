# IRG-0001: Canonical Evidence Implementation Readiness

## Status

Proposed for owner authorization.

## Capability

Capability 001 — Operational Leakage Audit

## Implementation increment

Sprint E1 — Canonical Evidence Foundation

## Purpose

Determine whether the revised canonical Evidence and Validation contracts are
sufficiently complete, internally consistent, repository-aligned, testable,
and migration-ready for implementation.

This gate concerns only the Canonical Evidence implementation governed by the
listed artifacts.

It does not authorize:

- Evidence Semantics implementation;
- Intelligence implementation;
- leakage detection;
- prioritization;
- Recommendations;
- reporting;
- persistence;
- external integrations.

## Review method

The review inspected the repository at:

```text
C:\SimbaDev\GinzaAIpro
```

Inspection was read-only except for creation of this IRG.

The review:

- read every governing artifact;
- inspected workspace and package manifests;
- inspected domain, core, capture, and Validation contracts;
- traced every source-level canonical Evidence constructor, output, export,
  fixture, test, and `statement` read;
- inspected package dependencies and cross-package imports;
- inspected available scripts;
- ran non-writing baseline verification where the environment permitted;
- independently recomputed both SAS-0001B identity vectors.

No implementation file was modified.

## Governing-artifact conformance

| Artifact | Exists | Status found | Sprint E1 finding |
| --- | --- | --- | --- |
| `architecture/adr/ADR-0015-Canonical-Capture-Boundary.md` | Yes | Accepted for Sprint 2.4 | Conformant. Capture owns observation and does not construct Evidence. |
| `architecture/adr/ADR-0017-Canonical-Evidence-Semantics.md` | Yes | Accepted; normative beginning with Sprint 2.4A | Conformant. Evidence Semantics remains the sole structured-semantic normalization boundary. |
| `architecture/adr/ADR-0018-Canonical-Evidence-Representation.md` | Yes | Accepted; normative beginning with Sprint 2.4A | Conformant. Path C controls Canonical Evidence representation. |
| `architecture/sas/SAS-0001-Validation-Engine.md` | Yes | Operative baseline; no explicit Status section | Conformant as amended. Validation owns Evidence qualification and `EvidenceFactory` is the canonical production constructor. |
| `architecture/sas/SAS-0001A-Evidence-Representation-Amendment.md` | Yes | Normative beginning with Sprint 2.4A | Conformant. It assigns structured factual preservation to Validation without semantic normalization. |
| `architecture/sas/SAS-0001B-Evidence-Representation-Implementation-Supplement.md` | Yes | Proposed for Sprint 2.4A architecture review | Not closed. Specific implementation ambiguities remain; see Gates 2, 3, 4, 7, and 8. |
| `architecture/sas/SAS-0002-Capture-Engine.md` | Yes | Normative for Sprint 2.4 | Conformant. Existing `BusinessSignal` supports the narrow initial policy without moving Evidence construction to Capture. |
| `architecture/sas/SAS-0002A-Evidence-Semantics-Layer.md` | Yes | Normative beginning with Sprint 2.4A | Conformant. It is downstream and outside Sprint E1 implementation. |
| `architecture/discovery/Sprint-2.4A-Evidence-Semantics-Input-Discovery.md` | Yes | Discovery only | Conformant. It identifies Path C as the minimum-complexity direction. |

No accepted ADR contradicts Sprint E1.

SAS-0001B is not yet normative and cannot be ratified by this review because
two required deterministic behaviors remain under-specified.

## Repository inspection

### Workspace configuration

Relevant files:

- `pnpm-workspace.yaml`;
- `package.json`;
- `tsconfig.base.json`;
- `pnpm-lock.yaml`;
- package-local `package.json` and `tsconfig.json` files.

The workspace includes:

```text
apps/*
packages/*
capabilities/*
```

Root scripts are:

```text
build     = pnpm -r build
test      = pnpm -r test
typecheck = pnpm -r typecheck
```

There is no root `lint`, `format`, or `format:check` script.

The dashboard alone exposes:

```text
pnpm --filter ginzaaipro-dashboard lint
```

### Package graph

The current workspace dependency graph is:

```text
@ginzaaipro/kernel
        ^
@ginzaaipro/follow-up-recovery

@ginzaaipro/domain
      ^       ^
      |       |
@ginzaaipro/core
      ^       ^
      |       |
@ginzaaipro/capture     @ginzaaipro/validation
```

Exact affected package manifests:

- `packages/domain/package.json`: no workspace dependency;
- `packages/core/package.json`: depends on `@ginzaaipro/domain`;
- `packages/validation/package.json`: depends on
  `@ginzaaipro/core` and `@ginzaaipro/domain`;
- `packages/capture/package.json`: depends on
  `@ginzaaipro/core` and `@ginzaaipro/domain`.

No manifest cycle exists.

Static source inspection found:

- no relative cross-package import;
- no domain import from core or Validation;
- no Validation import from Evidence Semantics, Intelligence, kernel, or
  capture implementation;
- no Capture ownership of canonical Evidence construction.

There is no automated package-boundary test in the current repository.

### Domain

Relevant files:

- `packages/domain/src/common/Entity.ts`;
- `packages/domain/src/common/Identifier.ts`;
- `packages/domain/src/common/Money.ts`;
- `packages/domain/src/common/Percentage.ts`;
- `packages/domain/src/intelligence/BusinessSignal.ts`;
- `packages/domain/src/intelligence/Evidence.ts`;
- `packages/domain/src/intelligence/index.ts`;
- `packages/domain/src/index.ts`;
- `packages/domain/tests/intelligence.test.ts`;
- `packages/domain/package.json`;
- `packages/domain/tsconfig.json`.

Current canonical Evidence has identity, Organization, signal IDs, source,
valid status, verification method, material relevance, statement, confidence,
and creation time. It has no component collection.

Current `BusinessSignal` supplies the exact fields cited by SAS-0001B:
identity, Organization, category, source, occurrence/capture times, optional
subject, closed value, confidence, status, and optional validation notes.

Existing `Identifier`, `Money`, and `Percentage` are immutable and align with
the proposed contracts.

### Core

Relevant files:

- `packages/core/src/validation/ValidationEngine.ts`;
- `packages/core/src/validation/index.ts`;
- `packages/core/src/shared/Engine.ts`;
- `packages/core/src/shared/EngineContext.ts`;
- `packages/core/src/shared/EngineResult.ts`;
- `packages/core/src/shared/Diagnostic.ts`;
- `packages/core/src/shared/Explanation.ts`;
- `packages/core/src/index.ts`;
- `packages/core/tests/core-contracts.test.ts`;
- `packages/core/package.json`.

The existing Validation contract is:

```text
Engine<BusinessSignal, Evidence>
```

It need not change for Sprint E1.

### Validation

Relevant files:

- `packages/validation/src/DeterministicValidationEngine.ts`;
- `packages/validation/src/diagnostics/ValidationDiagnosticCode.ts`;
- `packages/validation/src/diagnostics/index.ts`;
- `packages/validation/src/factories/DiagnosticFactory.ts`;
- `packages/validation/src/factories/EvidenceFactory.ts`;
- `packages/validation/src/factories/ExplanationFactory.ts`;
- `packages/validation/src/factories/index.ts`;
- `packages/validation/src/models/ValidationResult.ts`;
- `packages/validation/src/validators/IdentityValidator.ts`;
- `packages/validation/src/validators/IntegrityValidator.ts`;
- `packages/validation/src/validators/CompletenessValidator.ts`;
- `packages/validation/src/validators/ConsistencyValidator.ts`;
- `packages/validation/src/validators/QualificationValidator.ts`;
- `packages/validation/src/validators/runValidationPipeline.ts`;
- `packages/validation/src/validators/index.ts`;
- `packages/validation/src/index.ts`;
- `packages/validation/tests/factories.test.ts`;
- `packages/validation/tests/deterministic-validation-engine.test.ts`;
- `packages/validation/tests/validators.test.ts`;
- `packages/validation/package.json`;
- `packages/validation/tsconfig.json`.

Current Validation:

1. executes Identity;
2. executes Integrity;
3. executes Completeness;
4. executes Consistency;
5. executes Qualification;
6. invokes `EvidenceFactory` on success.

The current factory is the only production canonical Evidence constructor.
It produces:

```text
evidence:<signal-id>:<correlation-id>
```

and statement:

```text
Validated <category> signal from <source>.
```

It discards the signal's factual value from Evidence representation.

Current Validation diagnostics are stable uppercase codes with error
severity and fail-fast behavior. Successful Validation currently returns an
empty diagnostic collection.

### Existing Evidence fixtures and consumers

There are no dedicated Evidence fixture directories.

All canonical Evidence touchpoints are classified below.

| Location | Classification | Current use | Sprint E1 disposition |
| --- | --- | --- | --- |
| `packages/validation/src/factories/EvidenceFactory.ts` | Canonical factory | Sole production `new Evidence(...)` call | Migrate to policy-driven component and `evidence:v2` construction. |
| `packages/validation/src/DeterministicValidationEngine.ts` | Validation output | Returns `EngineResult<Evidence>` | Retain output type; integrate new fail-fast checks and success diagnostic. |
| `packages/domain/tests/intelligence.test.ts` | Fixture/test | Two direct Evidence constructor calls | Compile-time migrate to mandatory components or a test-only canonical helper. |
| `packages/validation/tests/factories.test.ts` | Test/statement reader | Verifies factory identity, statement, source linkage | Migrate expected identity, generated statement, component structure, and diagnostics. |
| `packages/validation/tests/deterministic-validation-engine.test.ts` | Test/statement reader | Verifies immutable output and serializes `statement` | Migrate serialized shape and deterministic component assertions; keep statement display-only. |
| `packages/validation/tests/validators.test.ts` | Test | Verifies existing gates and order | Add Organization and revised full-order coverage. |
| `packages/core/tests/core-contracts.test.ts` | Type-only consumer | Uses `{ } as Evidence` for interface compatibility | No semantic migration expected; compilation verifies unchanged core generic. |
| `packages/core/src/validation/ValidationEngine.ts` | Public behavioral contract | `Engine<BusinessSignal, Evidence>` | No change. |
| `packages/core/src/intelligence/IntelligenceEngine.ts` | Downstream type-only consumer | Currently consumes `readonly Evidence[]` | Out of Sprint E1; must not be changed until the separate SAS-0003 amendment. |
| `packages/domain/src/intelligence/index.ts` | Package export | Exports Evidence | Add component-contract export through this entry point. |
| `packages/domain/src/index.ts` | Package export | Re-exports intelligence entry point | No direct change expected. |
| `packages/validation/src/index.ts` | Package export | Exports engine and diagnostics | Existing path exposes new diagnostic codes without another root export. |
| `packages/kernel/src/domain.ts` and kernel consumers | Non-canonical namesake | Runtime kernel Evidence | No change; outside Sprint E1. |
| `apps/ginzaaipro-dashboard/src/operational-evidence/*` | Application-local consumer/name | Local `OperationalEvidence` and in-memory store | No change; not canonical domain Evidence. |
| `capabilities/follow-up-recovery/*` | Kernel type consumer | Imports kernel Evidence | No change. |

No canonical Evidence persistence was found. No persistence migration is
required.

### Git working tree

Before creating this IRG:

- tracked diff was empty;
- `git diff --check` passed;
- architecture artifacts from the current uncommitted architecture sequence
  were untracked;
- `packages/*/dist` and `node_modules` were ignored;
- baseline checks created no tracked modification.

This dirty status is documentation-only and must be reviewed before
implementation. Sprint E1 must preserve unrelated uncommitted architecture
files.

## Gate 1 — Constitutional closure

**Result: PASS**

Findings:

- Evidence ownership is assigned to Validation by SAS-0001/SAS-0001A.
- Capture constructs `BusinessSignal`, not Evidence.
- ADR-0018 requires validated factual structure without diagnosis.
- Evidence Semantics remains the sole normalization boundary.
- Intelligence remains downstream of Evidence Semantics.
- no accepted ADR conflicts with Sprint E1;
- no new canonical layer is required.

No constitutional change is required.

## Gate 2 — Contract closure

**Result: FAIL**

SAS-0001B defines the named contracts and most required decisions:

- mandatory `Evidence.components`;
- component and Evidence identity;
- existing `Identifier` subject;
- constrained namespaced relation;
- closed value variants;
- non-recursive qualifiers;
- provenance;
- ordering;
- duplicate rejection;
- parent Organization ownership;
- defensive copying and freezing;
- one closed construction policy;
- six versioned rules.

However, implementation would still require inventing contract behavior in
two places:

1. **Multi-component statement construction**

   SAS-0001B requires domain Evidence to support multiple components and
   requires a multiple-component test. Its sole normative statement template
   applies to exactly one component and explicitly defers multi-component
   statement construction to a future policy.

   Evidence cannot simultaneously require a mandatory consistent statement,
   accept multiple components in Sprint E1, reject arbitrary caller prose,
   and have no normative multi-component renderer.

2. **Statement invariant enforcement at the public aggregate boundary**

   SAS-0001B says Validation generates statements and rejects
   statement/component mismatch, but it does not close how public direct
   Evidence construction prevents an inconsistent caller-supplied statement.
   The migration section requires direct constructors to move, yet the exact
   aggregate construction surface and invariant-enforcement owner are not
   specified.

These are contract decisions, not ordinary coding defects.

Required closure before re-gate:

- either restrict Sprint E1 canonical Evidence to exactly one component and
  remove the multi-component acceptance/test requirement; or define the exact
  canonical multi-component statement renderer;
- define whether `statement` is generated by the aggregate, supplied only
  through a canonical factory, or supplied and checked by a fully specified
  domain invariant mechanism.

## Gate 3 — Determinism closure

**Result: FAIL**

Closed and verified:

- component identity marker and prefix;
- Evidence identity marker and prefix;
- exact ordered identity material;
- UTF-8 byte-length prefixes;
- SHA-256;
- lowercase hexadecimal rendering;
- qualifier, provenance, component, and signal ordering;
- permutation invariance;
- statement template for one component;
- rule precedence;
- fail-fast Validation order.

Normative vectors in SAS-0001B section 19 were independently recomputed:

```text
Component:
evidence-component:v1:ec0abcfac9e3056c4161dd77bae5303802236a003c5c1c9dd794cd57ea9cd133

Evidence:
evidence:v2:0154d32c5270a28ac7ba5775f611bfad65abe689e2aeb2809817e5de551156bc
```

Both match the supplement.

Remaining determinism gaps:

1. Multi-component statement rendering is undefined.
2. Decimal normalization requires "the shortest decimal that round-trips"
   and exponent expansion but does not name a normative conversion algorithm
   or define tie behavior. Two independently written conforming
   implementations could choose different decimal strings for edge-case
   IEEE-754 values.

Required closure:

- define the multi-component statement rule or remove multi-component support
  from Sprint E1;
- bind decimal conversion to one exact algorithm/runtime semantic and add
  normative edge vectors covering exponent expansion, subnormal values,
  negative zero, and boundary magnitudes.

## Gate 4 — Validation policy closure

**Result: FAIL**

The policy exists and is closed:

```text
VALIDATION_EVIDENCE_CONSTRUCTION@1.0.0
```

The following rules have identifiers, versions, common eligibility,
component output, value tags, common statement output, confidence behavior,
provenance behavior, unsupported behavior, and explicit precedence:

- `VAL-EVIDENCE-MONEY-001@1.0.0`;
- `VAL-EVIDENCE-PERCENTAGE-001@1.0.0`;
- `VAL-EVIDENCE-TEXT-001@1.0.0`;
- `VAL-EVIDENCE-BOOLEAN-001@1.0.0`;
- `VAL-EVIDENCE-INTEGER-001@1.0.0`;
- `VAL-EVIDENCE-DECIMAL-001@1.0.0`.

No rule requires prose parsing, probabilistic inference, business diagnosis,
semantic predicate normalization, enrichment, or implicit common knowledge.

Money, Percentage, Text, Boolean, and Integer are implementation-ready.
Decimal is not implementation-ready because exact canonical conversion is
not closed under Gate 3.

One unresolved rule is sufficient to fail the closed policy.

## Gate 5 — Package ownership and dependency closure

**Result: PASS**

The intended implementation preserves:

- canonical contracts in `@ginzaaipro/domain`;
- the unchanged Validation behavioral contract in `@ginzaaipro/core`;
- concrete construction rules in `@ginzaaipro/validation`;
- no domain dependency on core;
- no Validation dependency on Evidence Semantics or Intelligence;
- no Capture ownership of Evidence construction;
- no new package.

Expected public export changes after a successful re-gate:

- `@ginzaaipro/domain` adds:
  - `EvidenceComponent`;
  - `EvidenceRelation`;
  - `EvidenceValue`;
  - `EvidenceQualifier`;
  - `EvidenceComponentProvenance`;
  - `EvidenceConstructionRuleReference`.
- `@ginzaaipro/validation` exposes new diagnostic codes through its existing
  diagnostics export.
- `@ginzaaipro/core` has no public API change.

No circular or inverted dependency is required.

## Gate 6 — Migration closure

**Result: PASS**

Repository impact is bounded by the inventory above.

The preferred migration is immediate compile-time migration:

- `components` remains mandatory;
- no legacy overload remains canonical;
- no permanent optional component collection is allowed;
- no prose parser or compatibility adapter is allowed;
- direct test constructors migrate immediately;
- the current factory migrates to the closed policy;
- old identity expectations migrate to `evidence:v2`;
- unchanged readers retain `statement` as human display only;
- no persistence migration is required.

Existing consumers can be migrated inside Sprint E1 without altering
downstream architecture. `IntelligenceEngine` remains untouched.

## Gate 7 — Diagnostics closure

**Result: FAIL**

SAS-0001B defines stable codes, severities, messages, failure shape, and
fail-fast order for:

- missing components;
- unsupported component structure;
- duplicate component identity;
- invalid value;
- invalid subject;
- invalid relation;
- invalid qualifier;
- incomplete provenance;
- statement/component mismatch;
- Organization mismatch;
- unsupported construction rule;
- domain reasoning required;
- successful structured Evidence creation.

Naming and failure shape align with current Validation conventions.

The applicability of
`EVIDENCE_STATEMENT_COMPONENT_MISMATCH` remains unresolved because the
construction boundary does not define whether arbitrary statements can reach
the aggregate or whether statements are always generated internally. The
implementation would have to invent when and where this diagnostic can occur.

Diagnostic closure depends on Gate 2 statement-authority closure.

## Gate 8 — Test closure

**Result: FAIL**

### Acceptance-criterion traceability

| SAS-0001B acceptance requirement | Planned test location |
| --- | --- |
| Exact contract shape and public names | `packages/domain/tests/evidence-component.test.ts`; package compile. |
| Closed versioned construction policy | `packages/validation/tests/evidence-construction-policy.test.ts`. |
| Deterministic statement consistency | `packages/validation/tests/evidence-construction-policy.test.ts`; blocked for multiple components. |
| Exact identity material and encoding | `packages/validation/tests/evidence-identity.test.ts`. |
| Fixed vectors | `packages/validation/tests/evidence-identity.test.ts`. |
| Exact canonical ordering | domain component tests and Validation identity tests. |
| Exact diagnostics and fail-fast order | `packages/validation/tests/validators.test.ts` and `deterministic-validation-engine.test.ts`. |
| Exact package ownership/exports | `packages/validation/tests/package-boundaries.test.ts` plus compile-time root imports. |
| Exact migration behavior | migrated `packages/domain/tests/intelligence.test.ts`, factory tests, and a compile-time legacy-constructor fixture. |
| No business-domain reasoning | construction-policy negative tests. |
| No Evidence Semantics/Intelligence absorption | package-boundary test and output-shape tests. |
| No prose-only optional path | domain constructor tests and compile-time migration fixture. |
| No unresolved ambiguity | Cannot pass until Gates 2, 3, and 7 close. |

### Minimum test matrix mapping

| Required coverage | Exact planned location |
| --- | --- |
| Six construction rules and all value tags | `packages/validation/tests/evidence-construction-policy.test.ts` |
| Single component | construction-policy and factory tests |
| Multiple independently attributable components | `packages/domain/tests/evidence-component.test.ts`; blocked on statement rule |
| Empty/missing/duplicate components | domain component tests and deterministic engine injection tests |
| Invalid subject/relation/value | domain component tests |
| Qualifiers and duplicate qualifiers | domain component tests |
| Provenance and Organization isolation | domain component tests; validators tests |
| Deterministic statements and mismatch | construction-policy tests; blocked on statement authority |
| No prose parsing or inferred facts | construction-policy negative tests |
| Component/Evidence identities and vectors | `packages/validation/tests/evidence-identity.test.ts` |
| Permutation invariance and ordering | identity tests and domain component tests |
| Input/output immutability | factory and deterministic-engine tests |
| Diagnostic codes and order | validators and deterministic-engine tests |
| Unsupported rule | construction-policy and engine tests |
| Package exports and dependencies | `packages/validation/tests/package-boundaries.test.ts` |
| Fixture migration | `packages/domain/tests/intelligence.test.ts` and existing Validation tests |
| Full build/typecheck/tests | root scripts |
| Lint | No affected-package or root lint command currently exists |

The test paths are bounded, but normative assertions for multi-component
statements, statement mismatch, and decimal edge values cannot be written
without inventing decisions.

The repository also lacks an affected-package lint command. This is a
workspace-readiness observation rather than an ADR conflict, but the
requested complete lint path does not currently exist.

## Gate 9 — Minimum complexity review

**Result: PASS**

The bounded increment needs only:

- required domain contracts;
- one closed Validation policy and six rules;
- deterministic identity and statement utilities;
- required diagnostics;
- compile-time migrations;
- tests;
- public exports.

The following must remain deferred:

- Evidence Semantics entities or implementation;
- semantic predicate catalogs;
- Intelligence behavior;
- leakage logic;
- generic ontologies;
- recursive metadata;
- adapter frameworks;
- persistence;
- orchestration;
- UI changes;
- report generation;
- generic source-value extensibility;
- date, duration, identifier, or quantity value variants not justified by
  current `BusinessSignal`.

No proposed Sprint E1 item otherwise needs removal.

## Gate 10 — Workspace readiness

**Result: PASS WITH CONDITIONS**

### Exact commands from current scripts

| Concern | Repository command | Current availability |
| --- | --- | --- |
| Format/format verification | None | No root or affected-package script exists. Do not guess one. |
| Lint | `pnpm --filter ginzaaipro-dashboard lint` | Dashboard only; no root/domain/core/Validation lint script. |
| Typecheck | `pnpm typecheck` | Root recursive script. Sequential environment fallback: `pnpm --workspace-concurrency=1 -r typecheck`. |
| Unit tests | `pnpm test` | Root recursive script. |
| Domain tests | `pnpm --filter @ginzaaipro/domain test` | Available. |
| Validation tests | `pnpm --filter @ginzaaipro/validation test` | Available. |
| Package-boundary tests | No current dedicated command | Planned as a Validation test, then run through the Validation/root test script. |
| Workspace build | `pnpm build` | Root recursive script. |
| Git status | `git status --short` | Available. |
| Diff summary | `git diff --stat` | Available. |
| Whitespace/error review | `git diff --check` | Available. |
| Full patch review | `git diff -- architecture packages/domain packages/core packages/validation` | Available. |

### Current baseline results

| Command | Result | Classification |
| --- | --- | --- |
| `pnpm typecheck` | Did not reach compilation; pnpm concurrent spawn failed with `EPERM`. | Environment failure. |
| `pnpm --workspace-concurrency=1 -r typecheck` | PASS across all workspace projects that define `typecheck`. | Baseline pass. |
| `pnpm --workspace-concurrency=1 -r test` | Vitest failed before collecting tests because worker spawn returned `EPERM`. | Environment failure; not a test failure. |
| Domain Vitest with single-thread pool | Vite still invoked a Windows child process and failed with `spawn EPERM`. | Environment failure; baseline tests unverified in this sandbox. |
| `pnpm --filter ginzaaipro-dashboard lint` | FAIL: one `react-hooks/set-state-in-effect` error and three unused-variable warnings in `apps/ginzaaipro-dashboard/src/app/page.tsx`. | Pre-existing unrelated failure; outside Sprint E1. |
| `git diff --check` | PASS. | Baseline pass. |
| `git diff --stat` | Empty tracked diff before this IRG. | Baseline pass. |
| Static manifest/import boundary inspection | PASS; no cycle, inversion, forbidden affected-package import, or relative cross-package import found. | Manual baseline pass; automated test absent. |
| `pnpm build` | Not run because it emits ignored `dist` output and this discovery task prohibits implementation-file modification. | Not verified; must run during implementation in a normal environment. |
| Format verification | Not run; no configured command exists. | Missing workspace capability, not a code failure. |

Conditions for a future successful gate:

- run root tests in an environment that permits Vitest/Vite child processes;
- run `pnpm build` after implementation;
- add the planned package-boundary test;
- do not expand Sprint E1 merely to introduce unrelated formatting or lint
  infrastructure;
- record the existing dashboard lint failure as out of scope unless it
  changes independently before implementation verification.

## Implementation sequence

No implementation is authorized by this failed gate.

After normative blockers are corrected and a re-gate passes, the bounded
sequence is:

1. define domain supporting value contracts;
2. define deterministic canonical encoding and identity utilities;
3. amend the Evidence aggregate;
4. expose domain contracts through the existing domain entry point;
5. retain the current core Validation contract unchanged;
6. add the Organization check at the required fail-fast position;
7. implement the closed policy and six rules;
8. implement the ratified statement-generation contract;
9. add diagnostics and deterministic explanations;
10. migrate the Evidence factory and all direct callers;
11. migrate fixtures and tests;
12. add export and package-boundary verification;
13. run full build, typecheck, lint where configured, tests, and Git review.

## Authorized implementation scope

Because the final verdict is FAIL:

```text
Authorized implementation files: none
Created implementation files:    none
Modified implementation files:   none
Deleted implementation files:    none
```

Implementation must not begin.

### Candidate bounded scope for a future re-gate

The following is the exact expected implementation scope if and only if the
normative blockers are resolved and a later gate authorizes Sprint E1.

#### Expected created files

- `packages/domain/src/intelligence/EvidenceComponent.ts`;
- `packages/domain/tests/evidence-component.test.ts`;
- `packages/validation/src/construction/EvidenceConstructionPolicy.ts`;
- `packages/validation/src/identity/evidenceIdentity.ts`;
- `packages/validation/src/factories/EvidenceStatementFactory.ts`;
- `packages/validation/src/validators/OrganizationValidator.ts`;
- `packages/validation/tests/evidence-construction-policy.test.ts`;
- `packages/validation/tests/evidence-identity.test.ts`;
- `packages/validation/tests/package-boundaries.test.ts`.

#### Expected modified files

- `packages/domain/src/intelligence/Evidence.ts`;
- `packages/domain/src/intelligence/index.ts`;
- `packages/domain/tests/intelligence.test.ts`;
- `packages/validation/src/DeterministicValidationEngine.ts`;
- `packages/validation/src/diagnostics/ValidationDiagnosticCode.ts`;
- `packages/validation/src/factories/DiagnosticFactory.ts`;
- `packages/validation/src/factories/EvidenceFactory.ts`;
- `packages/validation/src/factories/ExplanationFactory.ts`;
- `packages/validation/src/factories/index.ts`;
- `packages/validation/src/validators/index.ts`;
- `packages/validation/tests/deterministic-validation-engine.test.ts`;
- `packages/validation/tests/factories.test.ts`;
- `packages/validation/tests/validators.test.ts`.

#### Expected deleted files

None.

#### Explicitly unchanged

- all ADRs, SAS documents, discovery reports, and this IRG during
  implementation;
- `packages/core/src/validation/ValidationEngine.ts`;
- `packages/core/src/intelligence/IntelligenceEngine.ts`;
- package manifests and lockfiles;
- capture, kernel, capability, dashboard, persistence, orchestration, and UI
  files.

If implementation later requires a file outside this candidate scope, it
must stop and report the reason before changing that file.

## Stop conditions

Implementation must stop and return to architecture if it discovers:

- an ADR contradiction;
- insufficient `BusinessSignal` structure;
- required natural-language interpretation;
- business diagnosis in Validation;
- need for a new canonical layer;
- unbounded migration impact;
- incompatible identity vectors;
- circular package dependencies;
- inability to preserve deterministic output;
- missing normative decisions;
- a need to parse legacy statements;
- a need to make `components` optional;
- a need to change Intelligence in Sprint E1.

Ordinary coding defects that do not alter accepted contracts may be corrected
after a future gate authorizes implementation.

## Final gate decision

**FAIL — IMPLEMENTATION NOT AUTHORIZED**

### Rationale

Constitution, ownership, dependency direction, migration scope, minimum
complexity, identity encoding, fixed vectors, and five of six construction
rules are sufficiently closed.

Implementation is not authorized because:

1. multiple-component Evidence is required but has no normative statement
   construction behavior;
2. the public aggregate boundary does not fully define how
   statement/component consistency is enforced;
3. decimal canonicalization is not exact enough to guarantee one output for
   all supported finite values;
4. the statement-mismatch diagnostic cannot be implemented without deciding
   the unresolved statement-authority boundary;
5. affected tests for those requirements cannot be written without inventing
   normative behavior.

These blockers require a focused SAS-0001B correction and another readiness
review. No new ADR is required.

### Conditions

Not applicable to authorization because the verdict is FAIL.

Before re-gate:

- close the single-versus-multiple component statement decision;
- close the aggregate statement-authority and enforcement mechanism;
- specify exact decimal conversion and normative edge vectors;
- reconcile the mismatch diagnostic with the selected construction boundary;
- update the planned test assertions accordingly;
- verify baseline tests in an environment that permits child processes.

### Authorized scope

None.

### Reviewer

Codex Architecture Review

### Review date

2026-07-19

### Owner authorization

Owner Authorization: PENDING
