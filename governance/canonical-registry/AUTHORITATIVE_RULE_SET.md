# Currently Authoritative Rule Set

Last reconciled: 2026-08-02. This is a concise publication of `Active` and `Extended` entries in the Rule Register. Source text governs if a summary loses detail.

## Constitutional rules

1. Capture precedes intelligence; intelligence precedes governance; governance precedes execution; execution produces new capture.
2. Every action is traceable and every decision auditable.
3. Governance and financial controls cannot be bypassed.
4. Human constitutional authority governs the platform and retains authority over constitutional purpose, policy changes, critical exceptions, irreversible actions, and risk limits. Human oversight remains available.
5. Multi-tenant isolation is mandatory.
6. Deterministic platform policy governs routine execution only within authority explicitly delegated through approved organizational policy. Humans cannot bypass mandatory safety, compliance, tenant-isolation, audit, or constitutional controls.
7. Emergency override is authorized, scoped, time-bound, justified, and immutably audited; it is not a bypass of mandatory controls.
8. Accepted architecture defines platform meaning, ownership, and boundaries; implementation conforms to architecture, and historical code gains no authority merely through prior existence.
9. Architectural decisions require explicit evidence about current contracts, consumers, constraints, and consequences; material uncertainty requires discovery before decision or implementation.
10. Deterministic mechanisms are authoritative wherever a governed outcome can be derived deterministically; intelligence operates on explicit, validated, and traceable inputs.
11. Each canonical architectural concept has one authoritative meaning and one public implementation owning its canonical name; competing definitions, ambiguous aliases, and duplicate canonical contracts require governed migration.
12. Canonical artifacts preserve all information required by downstream deterministic consumers; engines use complete immutable artifacts and explicit evaluation context without hidden business facts or side-channel state.
13. Canonical identity, lineage, organizational boundaries, source, trace, rule, and policy provenance required for reproduction, isolation, explanation, or audit are preserved through every state transition.
14. Architecture uses the smallest design that completely satisfies accepted requirements and preserves invariants; additional abstractions, frameworks, services, contracts, and layers require demonstrated need.
15. Canonical domain artifacts and released governance artifacts are immutable historical records; correction and evolution occur through explicit supersession, versioning, or governed migration.
16. A capability’s authority, admissibility, boundaries, failures, and verification criteria are governed before automation; automation executes accepted policy but cannot create authority.
17. Human responsibility for policy approval, constitutional judgment, authorization, exception handling, and material business consequences remains identifiable and cannot be obscured or transferred to AI or automation.

## Architecture rules

18. Runtime events state facts; Operational Signals communicate operational significance and are preferred for downstream reasoning when appropriate.
19. Dependencies flow downward; lower layers do not depend on higher layers.
20. Health measures but does not diagnose; Cognition reasons but does not execute; Experience does not own lower-layer logic.
21. Orchestration may prepare, sequence, simulate, and propose before Governance. It does not govern. Material execution orchestration proceeds only inside an explicitly approved governance envelope and then coordinates the authorized execution plan.
22. Significant conclusions, assessments, and recommendations are evidence-backed, traceable, and explainable through evidence, reasoning, confidence, and recommendations.
23. Operational Memory and event history are attributable, auditable, append-only/immutable, and sufficient to reconstruct historical reality.
24. Execution is separately tracked, observable, verified by evidence, and feeds outcomes into memory and learning.
25. Ownership and next action are explicit before execution; outcome is tracked separately from action.
26. Capabilities are runtime-exposed, composable, observable, independently testable, and governed.
27. New functionality extends existing layers and patterns before adding top-level subsystems or architecture-changing patterns; exceptions require explicit justification and an accepted ADR.
28. Use descriptive subsystem and responsibility names; avoid unclear acronyms in code and folders.
29. AI outputs inform governed reasoning and do not independently govern or execute.
30. Evidence Semantics preserves released Evidence component predicates and canonical values exactly and introduces no business interpretation, ontology, classification, diagnosis, or action.
31. Every evaluated Evidence component has exactly one deterministic resolution record with complete released-identity lineage; silent omission and inferred references are prohibited.

## Governance process rules

32. Every new capability and every material evolution of a released capability follows the governed lifecycle: discovery when needed, architectural decision when required, accepted specification, explicit authorization, scoped implementation, verification and validation, release, and governed evolution.
33. Implementation requires explicit accepted status and authorization identifying allowed scope and protected artifacts; draft, proposed, discovery, or superseded artifacts, roadmap position, existing code, and capability numbering do not authorize implementation.
34. Verification and validation are evidence-based, reproducible, scoped, and independent of desired release outcomes; executed checks, inferred conclusions, limitations, excluded phases, and repository-scope changes are reported accurately, and an unexecuted check is not a pass.
35. Every verification record selects exactly one disposition under CGS-0004: PASS only after complete required conformance; CONDITIONAL PASS only for an explicit bounded non-defect limitation with a recorded closure condition; or FAIL when requirements, architecture boundaries, integrity, authorization, or required evidence do not conform.
36. Release is a separate authorized human governance decision requiring accepted governing artifacts, eligible verification, explicit limitations, and no unresolved blocker; implementation completion, a successful build, or a merged change does not independently establish release.
37. Acceptance of a Release Record freezes its identified baseline; later correction, extension, breaking change, deprecation, or removal is explicitly classified, governed, verified, and recorded without silently rewriting historical evidence.

## Capability 003 rules

38. Capability 003 consumes only released Semantic Facts and deterministically derives immutable `OperationalCondition` artifacts using released rule sets while preserving stable identity, semantic-fact references, traceability, rule-set version, replayability, and boundary integrity.
39. `OperationalCondition` is descriptive operational state only and does not calculate leakage, assign priority or severity, generate recommendations, express financial impact, authorize execution, or contain AI reasoning; governed input failure produces no partial canonical output or silent omission.

## Capability 004 rules

40. Capability 004 deterministically derives immutable `OperationalLeakage` artifacts from admissible same-Organization `OperationalCondition` inputs under released leakage rules while preserving `organizationId`, source-condition lineage, traceability, rule provenance, stable identity, and replayability.
41. `OperationalLeakage` expresses governed operational or economic consequence only and does not assign priority, estimate ROI, generate recommendations, authorize execution, or invoke AI reasoning; invalid, untraceable, or Organization-incompatible inputs produce a governed failure with no partial canonical output.


## Capability 005 rules

42. Capability 005 deterministically represents governed relative importance for admissible same-Organization `OperationalLeakage` artifacts under released prioritization policy while preserving `organizationId`, originating category, source-leakage lineage, traceability, policy and rule identity, stable identity, and replayability.
43. `OperationalLeakagePriority` expresses governed relative importance only and does not recommend remediation, estimate ROI, schedule work, allocate resources, optimize, authorize execution, invoke AI assignment, replace the released legacy `PriorityProfile`, or recover missing provenance or category through lookup, inference, or side-channel input; inadmissible inputs produce governed failure without partial canonical output or silent omission.

## Capability 006 rules

44. Capability 006 deterministically derives immutable `OperationalRecommendation` artifacts from one admissible `OperationalLeakagePriority` using supplied released `RecommendationRule` versions and explicit evaluation time while preserving organization, source-priority, trace, rule, policy, schema, identity, and replay provenance.
45. `OperationalRecommendation` expresses a governed intervention hypothesis only. Capability 006 does not repeat prioritization, manage rule lifecycle inside the engine, infer missing provenance or category, use repository or side-channel repair, plan or assign work, schedule, allocate resources, authorize or perform execution, persist state, invoke AI, or return partial canonical output after governed failure. Unmatched rules produce no recommendation and are not failures.

Publication entries 44 and 45 correspond to registry identifiers RULE-0050 and
RULE-0051. Publication numbering is distinct from Rule Register identifiers.

## Capability 007 rules

46. Capability 007 deterministically derives one immutable planning-only `ExecutionPlan` from one or more admissible `OperationalRecommendation` artifacts through one selected supplied released `ExecutionPlanningRule` and an explicit generation timestamp while preserving organization, recommendation, trace, planning-rule, planning-policy, schema, identity, dependency, and creation provenance.
47. `ExecutionPlan` describes how admissible recommended work should be carried out. Capability 007 does not execute, schedule, assign, allocate, persist, invoke AI, manage rule or recommendation lifecycle, infer missing provenance, or evaluate completion or success; invalid or conflicting inputs, rules, templates, or dependencies produce governed failure with no partial canonical plan.

Publication entries 46 and 47 correspond to registry identifiers RULE-0052 and
RULE-0053. Publication numbering is distinct from Rule Register identifiers.

## Capability 008A rules

48. Capability 008A materializes an immutable deterministic append-only `RuntimeAdmission` binding one canonical runtime-admissible `ExecutionPlan` and an explicit non-empty work-package selection to organization, recommendation, trace, planning-rule, planning-policy, execution-plan-schema, admission-policy, actor, reason, ordinal, timestamp, identity, and serialization provenance.
49. `RuntimeAdmission` authorizes entry into runtime but does not execute, schedule, assign, allocate, orchestrate, retry, persist, publish events, infer outcomes, generate evidence, invoke AI, mutate the plan, or manage revocation or expiration lifecycle. Implementation and verification may consume the canonical verified plan contract; operational admission requires the plan to cross applicable release and admissibility boundaries. A plan alone is not execution permission.

Publication entries 48 and 49 correspond to registry identifiers RULE-0054 and
RULE-0055. Publication numbering is distinct from Rule Register identifiers.

## Capability 008B rules

50. Capability 008B materializes one deeply immutable deterministic `ExecutionEvent` for exactly one admitted work package after admission, recording only the atomic `EXECUTION_OCCURRED` fact while preserving canonical admission, plan, organization, work-package, recommendation, trace, planning-rule, planning-policy, schema, provenance, identity, serialization, and temporal lineage through a defensive `RuntimeAdmission` projection.
51. `ExecutionEvent` does not execute, schedule, assign, allocate, orchestrate, retry, persist, publish externally, infer outcomes, generate evidence, evaluate success or quality, invoke AI, mutate `RuntimeAdmission` or `ExecutionPlan`, or manage workflow or lifecycle state. Implementation and verification may consume the canonical verified `RuntimeAdmission` contract; operational use requires upstream `RuntimeAdmission` and `ExecutionPlan` to cross all applicable release, admissibility, and runtime-governance boundaries. Capability 008B is verified but Not Released because no tracked accepted Release Record exists.

Publication entries 50 and 51 correspond to registry identifiers RULE-0056 and
RULE-0057. Publication numbering is distinct from Rule Register identifiers.

## Capability 009 rules

52. Capability 009 materializes one deeply immutable deterministic `ObservedOutcome` from one canonical verified `ExecutionEvent`, recording exactly one bounded observation while preserving event, admission, plan, organization, work-package, recommendation, trace, rule, policy, schema, observation, provenance, identity, serialization, and temporal lineage.
53. `ObservedOutcome` records observation only and does not claim causation, verify truth, evaluate success or quality, generate evidence, execute, schedule, assign, allocate, orchestrate, retry, persist, publish externally, aggregate, invoke AI, mutate upstream artifacts, or manage workflow or lifecycle state. Implementation and verification may consume the canonical verified `ExecutionEvent` contract; operational use requires `ExecutionEvent`, `RuntimeAdmission`, and `ExecutionPlan` to cross all applicable release, admissibility, and runtime-governance boundaries. Capability 009 is Verified but Not Released because no tracked accepted Release Record exists.

Publication entries 52 and 53 correspond to registry identifiers RULE-0058 and
RULE-0059. Publication numbering is distinct from Rule Register identifiers.

## Capability 010 rules

54. Capability 010 deterministically materializes one deeply immutable canonical `Verification` for exactly one canonical `ObservedOutcome` using 1–128 explicit canonical Evidence records, preserving Organization, subject, outcome, Evidence, method, time, limitation, optional verifier, notes, confidence/calibration, identity, serialization, validation, and failure provenance.
55. `Verification` qualifies one observation using explicit Evidence and the closed judgment `confirmed`, `refuted`, or `inconclusive`. It does not recreate Evidence, mutate observation or Evidence, infer missing Evidence, convert completion into proof, claim causality, calculate business impact, evaluate recommendation quality, generate Outcome Evaluation or Learning, implement calibration methodology, persist, access repositories, transport data, invoke AI, or create a second canonical authority. Implementation and verification may consume canonical verified `ObservedOutcome` and Evidence contracts; operational use requires all applicable upstream release, admissibility, and runtime-governance boundaries. Capability 010 is Verified but Not Released because no tracked accepted Release Record exists.

Publication entries 54 and 55 correspond to registry identifiers RULE-0060 and
RULE-0061. Publication numbering is distinct from Rule Register identifiers.

## Canonical lifecycle

Reality → Capture → Operational Evidence / Runtime Events → Operational Signals → Operational Memory → Operational Health → Operational Cognition → Operational Orchestration → Governance → Execution → Verification → Learning.

This expands the constitutional sequence without changing its ordering invariants.

The Orchestration → Governance → Execution segment has two phases: pre-governance preparation/proposal, followed by post-approval coordination inside the governance envelope.

## Canonical data scopes

- Observation: captured operational aggregate with lifecycle, ownership, governance, and traceability.
- Operational Evidence: factual, attributable artifacts used before interpretation.
- Operational Knowledge Graph: graph representation for organizational reality, lineage, and traversal.
- Execution Aggregate: separately identified execution and verification record linked back to decisions and observations.

See [`registers/RULE_REGISTER.md`](registers/RULE_REGISTER.md) for identifiers, evidence, and relationships.
