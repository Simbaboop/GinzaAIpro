# Currently Authoritative Rule Set

Last reconciled: 2026-07-31. This is a concise publication of `Active` and `Extended` entries in the Rule Register. Source text governs if a summary loses detail.

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
35. Every verification record selects exactly one disposition: PASS only after complete required conformance; CONDITIONAL PASS only for an explicit bounded non-defect limitation with a closure condition; or FAIL when requirements, boundaries, integrity, authorization, or required evidence do not conform.
36. Release is a separate authorized human governance decision requiring accepted governing artifacts, eligible verification, explicit limitations, and no unresolved blocker; implementation completion, a successful build, or a merged change does not independently establish release.
37. Acceptance of a Release Record freezes its identified baseline; later correction, extension, breaking change, deprecation, or removal is explicitly classified, governed, verified, and recorded without silently rewriting historical evidence.

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
