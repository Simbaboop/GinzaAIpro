# ADR-0016: Canonical Business Diagnosis

## Status

Accepted. Normative for Sprint 2.5 and subsequent business-diagnosis work.

## Purpose

Establish the canonical semantic model for business diagnosis within
GinzaAIpro and define the architectural boundary between:

- Evidence;
- Intelligence;
- Finding;
- Leakage;
- Recommendation.

## Background

This decision builds on:

- ADR-0015: Canonical Capture Boundary;
- SAS-0002: Deterministic Capture Engine;
- the Sprint 2.5 Discovery Report.

ADR-0015 and SAS-0002 establish the boundary from external reality through
canonical `BusinessSignal` creation and Evidence qualification. Sprint 2.5
discovery examined the downstream Intelligence-related domain model and
revealed overlapping concepts among Evidence, Intelligence, kernel Finding,
Leakage, and Recommendation.

Those overlaps create uncertainty about which record represents business
meaning, which records provide analytical enrichment, and which concepts
belong to runtime infrastructure. They must be resolved before Sprint 2.5
implementation begins.

## Canonical decision

**Intelligence is the canonical business diagnosis.**

Intelligence is the sole authoritative representation of the operational
meaning of validated Evidence.

The semantic boundaries are:

> Evidence answers: "What has been validated as fact?"

> Intelligence answers: "What does this evidence mean operationally?"

> Recommendations answer: "What should be done?"

> Execution answers: "Was it performed correctly?"

Evidence establishes qualified fact. Intelligence interprets that fact.
Recommendations propose action based on that interpretation. Execution
records and evaluates governed performance. These responsibilities must not
be collapsed into one model.

## Intelligence responsibilities

Intelligence:

- consumes canonical Evidence only;
- never consumes raw `BusinessSignal` records;
- never consumes `CaptureInput`;
- is immutable;
- is evidence-backed;
- is scoped to an Organization;
- expresses operational meaning;
- carries explicit assumptions and limitations;
- carries confidence;
- is explainable.

Intelligence retains the identities of the Evidence that supports it so that
its operational meaning remains attributable and auditable.

## Intelligence is not

Intelligence is not:

- execution;
- a Recommendation;
- workflow or orchestration state;
- a raw observation;
- validation;
- a runtime event;
- an infrastructure Finding.

Intelligence may inform downstream activity, but it does not perform,
authorize, schedule, or record that activity.

## Analytical profiles

Intelligence may be enriched by analytical profiles such as:

- Leakage Profile;
- Risk Profile;
- Opportunity Profile;
- Strength Profile.

Analytical profiles:

- are derived from Intelligence;
- do not replace Intelligence;
- do not redefine Intelligence;
- provide quantitative or analytical views of Intelligence.

A profile may express a specialized analytical perspective, but the
underlying Intelligence remains the canonical diagnosis. This ADR does not
specify profile structures or implementation.

## Leakage

Leakage is not a competing business diagnosis.

Leakage is an analytical profile representing the estimated economic
consequence associated with an Intelligence record.

The diagnostic meaning remains in Intelligence. Leakage supplies an economic
view of that meaning and must not independently redefine the diagnosis.

This ADR supersedes treating Leakage as an independent diagnostic concept.
It does not prescribe migration of the current domain model.

## Finding

Kernel Finding is runtime infrastructure.

Finding records detection. It may support runtime traceability, processing,
and operational diagnostics, but it is not the canonical business diagnosis.

Business-domain decisions must not depend on kernel Finding semantics.
Runtime Finding identity or representation must not define the meaning,
lifecycle, taxonomy, or authority of Intelligence.

## Canonical pipeline

```text
Reality
   |
BusinessSignal
   |
Evidence
   |
Intelligence
   |
Profiles
   |
Priority
   |
Recommendation
   |
Execution
   |
Outcome
```

Each stage has a distinct responsibility:

- `BusinessSignal` captures an immutable canonical observation.
- Evidence qualifies what has been validated as fact.
- Intelligence establishes the operational meaning of that Evidence.
- Profiles enrich Intelligence with specialized analytical views.
- Priority evaluates relative importance and decision context.
- Recommendation proposes what should be done.
- Execution performs or records governed action.
- Outcome records what resulted.

## Architectural rules

The following rules are mandatory:

1. There is one canonical business diagnosis: Intelligence.
2. Duplicate semantic representations of the same diagnosis are prohibited.
3. Evidence always precedes Intelligence.
4. Intelligence must remain attributable to canonical Evidence.
5. Recommendation never rewrites Intelligence.
6. Execution never rewrites Intelligence.
7. Profiles enrich Intelligence only.
8. Profiles must not become alternative diagnosis authorities.
9. Kernel Finding remains infrastructure and must not define business-domain
   diagnosis semantics.
10. Upstream observations and validation results must not bypass Evidence to
    become Intelligence.

## Consequences

This decision:

- removes ambiguity created by overlapping diagnosis entities;
- establishes one authoritative location for operational meaning;
- simplifies downstream engine responsibilities;
- separates validated fact, interpretation, analytical enrichment, proposed
  action, and execution;
- aligns COSMOS, ZOOS, HCOD, and GinzaAIpro terminology around a common
  diagnosis boundary;
- improves explainability by preserving a direct Evidence-to-Intelligence
  semantic chain;
- improves deterministic reasoning by ensuring each pipeline stage has one
  defined responsibility;
- treats Leakage, Risk, Opportunity, and Strength as analytical views rather
  than competing diagnoses;
- preserves the separation between business-domain meaning and kernel
  runtime infrastructure.

## Out of scope

This ADR intentionally does not:

- define the Intelligence entity;
- define analytical profile structures;
- define prioritization;
- define Recommendations;
- define implementation.

Those decisions belong to SAS-0003.
