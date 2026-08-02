# ADR-0005 — Released Rule Boundary

**Status:** Accepted

# Context

`RecommendationRule` does not contain a lifecycle-status field.

HCES-0000A defines the rule lifecycle:

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

It also states that only Released rules are executable.

The implemented `RecommendationRuleEngine` currently assumes that all
supplied rules have already crossed the Released-rule boundary.

A decision is required regarding whether lifecycle validation belongs inside
deterministic engines or upstream of them.

# Decision

Deterministic engines shall consume only Released rules.

Rule lifecycle management, release approval, deprecation, archival, and
lifecycle filtering belong upstream of deterministic engine execution.

The `RecommendationRule` domain contract shall not be modified to add
lifecycle status at this stage.

The `RecommendationRuleEngine` shall not inspect or infer rule lifecycle
state.

The application or rule-loading boundary is responsible for supplying only
Released rule versions to deterministic engines.

# Rationale

This preserves:

- engine purity;
- deterministic behavior;
- separation of governance lifecycle from runtime evaluation;
- minimum complexity;
- a narrow rule-engine responsibility; and
- compatibility with HCES-0000 and HCES-0000A.

Adding lifecycle state to every executable rule would duplicate upstream
governance responsibility and introduce unnecessary runtime branching.

# Consequences

Positive:

- deterministic engines remain stateless and capability-neutral;
- rule lifecycle workflows can evolve independently;
- engines do not require knowledge of Draft, Approved, Deprecated, or
  Archived states; and
- no change is required to `RecommendationRule`.

Negative:

- upstream rule-loading components must enforce the Released-rule boundary;
- directly supplying mixed-lifecycle rules to an engine is prohibited; and
- future repository or application services must preserve this boundary
  explicitly.

# Invariants

- Only Released rules may be supplied to deterministic engines.
- Engines shall not execute lifecycle checks.
- Engines shall not promote, release, deprecate, or archive rules.
- Rule version and policy version shall remain preserved during evaluation.
- Lifecycle filtering shall occur before engine invocation.

# Rejected Alternatives

## Add lifecycle status to RecommendationRule

Rejected because executable rule structure and governance workflow state are
separate concerns.

## Let each engine filter rule lifecycle states

Rejected because it duplicates behavior across engines and weakens the
capability-neutral engine contract.

## Allow mixed lifecycle states during evaluation

Rejected because non-released rules must never influence production-derived
state.

# HCES Alignment

Align with:

- `HCES-0000-Deterministic-Rule-Engine-Pattern.md`
- `HCES-0000A-Rule-Specification-Pattern.md`
- `HCES-0006A-Recommendation-Rule-Engine.md`

# Implementation Impact

No implementation change is required now.

Future rule repositories, registries, or application services must ensure that
only Released rules reach deterministic engines.

# Validation

Confirm:

- no code modified;
- no existing contract modified;
- document formatting checks pass; and
- no commit created.
