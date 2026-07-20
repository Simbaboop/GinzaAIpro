# RCO-0002: Capability 002 Evidence Semantics Reconciliation

## Status

Accepted.

Effective for Capability 002 beginning with E2-001-R2.

## Purpose

Reconcile the retained
[`SAS-0002A: Evidence Semantics Layer`](../sas/SAS-0002A-Evidence-Semantics-Layer.md)
with the released Capability 001 repository and establish the bounded
Capability 002 implementation baseline.

## Authority

This reconciliation order was approved after Capability 001 was released at:

```text
Commit: 084bb8ebf2c761e470bcf78e413dd46a958e9e34
Tag:    capability-001-v1.0.0
```

It is read together with:

- ADR-0017: Canonical Evidence Semantics;
- ADR-0018: Canonical Evidence Representation;
- SAS-0001A and SAS-0001B;
- retained SAS-0002A;
- SAS-0002A-ADD-001;
- SAS-0002B;
- FEA-0002;
- IRG-0002-R1;
- E2-001-R2.

## Repository facts

Capability 001 now provides:

- canonical immutable `Evidence` in `@ginzaaipro/domain`;
- canonical immutable `EvidenceComponent` values in `@ginzaaipro/domain`;
- released Evidence identities with prefix `evidence:v2:`;
- released component identities with prefix `evidence-component:v1:`;
- explicit component relation namespace and name;
- closed canonical `EvidenceValue` variants;
- canonical component ordering and provenance;
- Validation-owned Evidence construction.

Capability 002 consumes those released contracts and identities. It does not
reproduce, relocate, regenerate, or amend them.

## Reconciled decision

Capability 002:

- consumes one released canonical `Evidence` aggregate per resolver call;
- evaluates every contained Evidence component exactly once;
- projects only predicate and canonical value already expressed by a
  component;
- produces immutable, deterministic Semantic Facts;
- records complete Evidence, component, rule, schema, and resolver lineage;
- records one resolution result for every evaluated component;
- returns expected failures through a typed synchronous result;
- belongs in `packages/evidence-semantics` with preferred package name
  `@ginzaaipro/evidence-semantics`.

Capability 002 does not:

- modify or revalidate Evidence;
- recompute Evidence or component identity;
- construct a semantic graph, node, or edge;
- create an ontology, taxonomy, alias registry, or business classification;
- infer a business entity, actor, metric, resource, process, document,
  location, cause, materiality, diagnosis, or action;
- depend on Intelligence, Recommendation, Capture implementation, AI,
  persistence, networking, or runtime infrastructure.

## Retained SAS-0002A disposition

### Retained

The following provisions remain normative:

- Evidence Semantics is the sole boundary between validated factual structure
  and downstream operational interpretation.
- Semantic extraction is deterministic, domain-neutral, immutable, and
  evidence-backed.
- No business diagnosis, priority, recommendation, execution, or causal
  reasoning is permitted.
- Semantic output requires complete Evidence lineage.
- Missing meaning is not invented.
- Raw statement prose is not parsed.
- Identity is content-addressed, versioned, locale-independent, and excludes
  runtime state.
- The concrete implementation belongs in
  `packages/evidence-semantics`.
- The implementation may depend on released Domain contracts and must not
  depend on downstream capabilities.

### Narrowed

For Capability 002 version 1:

- the transformation boundary is one released `Evidence` aggregate to one
  `EvidenceSemantics` result per invocation;
- the extraction surface is exactly the released component relation and
  canonical value;
- semantic references are limited to `EVIDENCE` and
  `EVIDENCE_COMPONENT`;
- rule execution is limited to ES-001 and ES-002;
- semantic schema and resolver versions are fixed by SAS-0002B;
- every component receives explicit resolution accountability under
  SAS-0002A-ADD-001;
- semantic confidence is represented by deterministic resolution status,
  not a probabilistic or percentage score;
- the resolver is synchronous and has no runtime context, clock, duration,
  correlation, or external I/O.

### Superseded for Capability 002 version 1

The following retained provisions are superseded only within this bounded
implementation:

- semantic contract ownership in `packages/domain`;
- a Core engine contract for Evidence Semantics;
- a broad subject/predicate/object extraction framework;
- arbitrary extraction policies or assisted extraction;
- aggregate processing across multiple Evidence records;
- semantic confidence represented as `Percentage`.

Capability 002 owns its Semantic Fact, provenance, resolution, diagnostic,
rule, resolver, result, and aggregate contracts. Domain remains the owner of
released Evidence and shared identity/value objects. No semantic contract is
moved into Domain.

### Deferred

The following are not authorized by Capability 002:

- additional rules;
- multiple-Evidence resolution;
- semantic qualifier projection;
- assisted or probabilistic extraction;
- schema migration;
- taxonomies, ontologies, aliases, or compatibility frameworks;
- semantic graphs or graph databases;
- downstream Intelligence integration.

Each requires separate governance.

## Rule reconciliation

### ES-001 — Canonical Predicate Projection

ES-001 projects the component's released relation and canonical
`EvidenceValue` without changing case, separators, namespace, type, or value
meaning.

### ES-002 — Evidence Component Semantic Reference

ES-002 verifies released Evidence/component membership and attaches
authoritative references and provenance. It does not hash Evidence again or
create inferred references.

## Ownership

| Concern | Owner |
| --- | --- |
| Evidence and Evidence components | `@ginzaaipro/domain` |
| Evidence construction and released identities | Capability 001 Validation |
| Semantic contracts and resolver | `@ginzaaipro/evidence-semantics` |
| Operational interpretation | Future downstream Intelligence |

## Consequences

- Capability 001 remains frozen.
- The retained SAS remains historically and normatively traceable.
- Capability 002 has one small implementation package and no Core change.
- Semantic meaning is preserved rather than expanded.
- Every component is accountable even when it cannot be resolved.
- No graph or business ontology is introduced.

## Non-goals

This order does not implement Capability 002, authorize release, amend
Intelligence, or create a release tag.
