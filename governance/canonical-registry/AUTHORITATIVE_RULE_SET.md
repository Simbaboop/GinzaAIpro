# Currently Authoritative Rule Set

Last reconciled: 2026-07-20. This is a concise publication of `Active` and `Extended` entries in the Rule Register. Source text governs if a summary loses detail.

## Constitutional rules

1. Capture precedes intelligence; intelligence precedes governance; governance precedes execution; execution produces new capture.
2. Every action is traceable and every decision auditable.
3. Governance and financial controls cannot be bypassed.
4. Human constitutional authority governs the platform and retains authority over constitutional purpose, policy changes, critical exceptions, irreversible actions, and risk limits. Human oversight remains available.
5. Multi-tenant isolation is mandatory.
6. Deterministic platform policy governs routine execution only within authority explicitly delegated through approved organizational policy. Humans cannot bypass mandatory safety, compliance, tenant-isolation, audit, or constitutional controls.
7. Emergency override is authorized, scoped, time-bound, justified, and immutably audited; it is not a bypass of mandatory controls.

## Architecture rules

8. Runtime events state facts; Operational Signals communicate operational significance and are preferred for downstream reasoning when appropriate.
9. Dependencies flow downward; lower layers do not depend on higher layers.
10. Health measures but does not diagnose; Cognition reasons but does not execute; Experience does not own lower-layer logic.
11. Orchestration may prepare, sequence, simulate, and propose before Governance. It does not govern. Material execution orchestration proceeds only inside an explicitly approved governance envelope and then coordinates the authorized execution plan.
12. Significant conclusions, assessments, and recommendations are evidence-backed, traceable, and explainable through evidence, reasoning, confidence, and recommendations.
13. Operational Memory and event history are attributable, auditable, append-only/immutable, and sufficient to reconstruct historical reality.
14. Execution is separately tracked, observable, verified by evidence, and feeds outcomes into memory and learning.
15. Ownership and next action are explicit before execution; outcome is tracked separately from action.
16. Capabilities are runtime-exposed, composable, observable, independently testable, and governed.
17. New functionality extends existing layers and patterns before adding top-level subsystems or architecture-changing patterns; exceptions require explicit justification and an accepted ADR.
18. Use descriptive subsystem and responsibility names; avoid unclear acronyms in code and folders.
19. AI outputs inform governed reasoning and do not independently govern or execute.
20. Evidence Semantics preserves released Evidence component predicates and canonical values exactly and introduces no business interpretation, ontology, classification, diagnosis, or action.
21. Every evaluated Evidence component has exactly one deterministic resolution record with complete released-identity lineage; silent omission and inferred references are prohibited.

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
