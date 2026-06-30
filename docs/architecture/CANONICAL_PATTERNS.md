# Canonical Patterns

## Status

Canonical

---

# Purpose

This document defines the recurring architectural patterns used throughout GinzaAIpro.

Patterns should be reused before introducing new implementation styles.

Consistency is preferred over novelty.

---

# Pattern 1 — Capability Pattern

A platform capability exposes functionality through the Runtime.

Structure:

Capability
↓

Engine

↓

Models

↓

Results

Responsibilities:

- Runtime registration
- Lifecycle participation
- Health reporting

Examples:

- RuntimeHealthCapability
- BusinessHealthCapability
- RevenueLeakageCapability

---

# Pattern 2 — Engine Pattern

Engines perform reasoning or computation.

Examples:

- AssessmentEngine
- DiagnosticEngine
- BusinessHealthEngine
- RevenueLeakageEngine

Engines should:

- accept structured inputs
- produce deterministic outputs
- expose confidence where applicable
- remain independently testable

---

# Pattern 3 — Evidence Pattern

Operational reasoning begins with evidence.

Capture

↓

Operational Evidence

↓

Assessment

↓

Recommendation

↓

Execution

Every assessment should reference supporting evidence.

---

# Pattern 4 — Assessment Pattern

Every assessment should contain:

- finding
- supporting evidence
- confidence
- severity
- recommendation

Assessments are explainable artifacts.

---

# Pattern 5 — Health Pattern

Health measures current condition.

Health summarizes.

Health does not diagnose.

Diagnostics consume health rather than replacing it.

---

# Pattern 6 — Memory Pattern

Operational Memory stores organizational history.

Memory is:

- append-only
- auditable
- attributable
- queryable

Memory supports future reasoning.

---

# Pattern 7 — Signal Pattern

Runtime Events

↓

Operational Signals

↓

Routing

↓

Operational Consumers

Signals communicate operational importance.

---

# Pattern 8 — Governance Pattern

Assessment

↓

Recommendation

↓

Governance

↓

Execution

Recommendations never execute themselves.

Governance authorizes execution.

---

# Pattern 9 — Learning Pattern

Execution

↓

Verification

↓

Operational Memory

↓

Future Assessments

Every completed action contributes to organizational learning.

---

# Pattern 10 — Explainability Pattern

Every significant operational conclusion should expose:

- evidence
- reasoning
- confidence
- recommendation

Opaque reasoning should be avoided.

---

# Pattern Selection Principle

Before introducing a new architectural pattern:

1. Check existing canonical patterns.
2. Reuse where possible.
3. If a new pattern is required, document it.
4. Record the decision with an ADR if it changes platform architecture.
