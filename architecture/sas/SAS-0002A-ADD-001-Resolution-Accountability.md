# SAS-0002A-ADD-001: Evidence Semantics Resolution Accountability

## Status

Normative for Capability 002.

## Purpose

Add deterministic component-level resolution accountability to retained
SAS-0002A. This addendum is governed by RCO-0002 and does not replace the
retained specification.

## Scope

Every `EvidenceComponent` supplied through an otherwise valid resolver input
must be evaluated exactly once and must produce exactly one
`SemanticResolutionRecord`.

Silent omission is prohibited.

## Frozen resolution statuses

```typescript
type SemanticResolutionStatus =
  | "RESOLVED"
  | "NOT_APPLICABLE"
  | "UNRESOLVED";
```

No additional status is authorized.

## Status invariants

### RESOLVED

- Contains one or more Semantic Fact identities.
- Contains no component-level unresolved diagnostic code.
- Every referenced Semantic Fact exists in the same `EvidenceSemantics`
  aggregate.
- Every fact is attributable to the record's component identity.

### NOT_APPLICABLE

- Contains zero Semantic Fact identities.
- Represents valid Evidence material intentionally outside the governed rule
  surface.
- Must not be used as a fallback for rule failure or missing provenance.

### UNRESOLVED

- Contains zero Semantic Fact identities.
- Contains at least one deterministic semantic diagnostic code.
- Preserves the component identity.
- Must not contain partial Semantic Facts.

## Resolution record

The repository-compatible contract is:

```typescript
interface SemanticResolutionRecord {
  readonly componentReference: SemanticReference;
  readonly status: SemanticResolutionStatus;
  readonly semanticFactIds: readonly Identifier[];
  readonly diagnosticCodes: readonly SemanticDiagnosticCode[];
}
```

`componentReference.kind` must be `EVIDENCE_COMPONENT`.

## Aggregate invariants

For a successful operation:

1. The number of resolution records equals the number of Evidence components.
2. Every released component identity appears in exactly one record.
3. No foreign component identity appears.
4. Records are canonically ordered under SAS-0002B.
5. Fact identities and diagnostic codes are deduplicated and canonically
   ordered.
6. A fact identity cannot appear in a `NOT_APPLICABLE` or `UNRESOLVED`
   record.
7. No component can disappear because a rule is not applicable.

Invalid aggregate input is an operation-level failure and produces no
canonical `EvidenceSemantics`.

## Identity participation

Every resolution record contributes the following ordered material to the
aggregate identity:

1. component identity;
2. resolution status;
3. Semantic Fact identity count;
4. ordered Semantic Fact identities;
5. diagnostic-code count;
6. ordered diagnostic codes.

Human-readable diagnostic messages do not participate.

## Determinism

Equivalent Evidence produces equivalent resolution records regardless of:

- input component order;
- rule registry iteration order;
- object enumeration order;
- locale;
- diagnostic wording;
- execution time or environment.

## Prohibitions

Resolution accountability must not:

- infer meaning to convert an unresolved component into `RESOLVED`;
- invent facts to avoid `NOT_APPLICABLE`;
- suppress a component;
- use last-write-wins conflict handling;
- expose raw Evidence values in diagnostics;
- introduce scoring or probabilistic confidence.

## Required tests

- exactly one record per component;
- all three statuses;
- `RESOLVED` fact-reference invariant;
- empty fact sets for other statuses;
- mandatory diagnostics for `UNRESOLVED`;
- duplicate record rejection;
- foreign component rejection;
- canonical record and code ordering;
- silent omission rejection;
- identity changes when status, fact identities, or diagnostic codes change.
