# Dependency Rules

## Status

Canonical

---

# Purpose

This document defines dependency rules for GinzaAIpro.

The goal is to prevent architectural drift, circular dependencies, and accidental coupling between platform layers.

---

# Primary Rule

Dependencies flow downward only.

Higher layers may depend on lower layers.

Lower layers must never depend on higher layers.

---

# Canonical Dependency Direction

Experience
↓
Governance
↓
Operational Orchestration
↓
Operational Cognition
↓
Operational Health
↓
Operational Memory
↓
Operational Nervous System
↓
Runtime
↓
Domain

---

# Allowed Dependencies

## Runtime

Runtime may depend on Domain only when runtime capabilities require domain types.

Runtime must not depend on:

- Operational Health
- Operational Cognition
- Governance
- Experience

---

## Operational Nervous System

ONS may depend on Runtime events and shared types.

ONS must not depend on:

- Operational Health
- Operational Cognition
- Governance
- Experience

---

## Operational Memory

Operational Memory may store references to:

- Evidence
- Events
- Signals
- Assessments
- Decisions
- Executions
- Outcomes

Operational Memory must not perform reasoning or governance.

---

## Operational Health

Operational Health may consume:

- Runtime Health
- Operational Signals
- Operational Memory
- Evidence

Operational Health must not perform deep diagnosis or approve action.

---

## Operational Cognition

Operational Cognition may consume:

- Evidence
- Signals
- Memory
- Health snapshots
- Assessments

Operational Cognition may produce:

- Assessments
- Findings
- Recommendations

Operational Cognition must not execute actions.

---

## Operational Orchestration

Operational Orchestration may coordinate capabilities.

Operational Orchestration must not make governance decisions.

---

## Governance

Governance may consume recommendations, assessments, policy, and evidence.

Governance authorizes or rejects action.

---

## Experience

Experience may consume outputs from all lower layers.

Experience must not contain domain, runtime, cognition, or governance logic.

---

# Forbidden Patterns

The following are forbidden:

- UI importing internal runtime mutation logic directly
- Domain importing runtime files
- Runtime importing cognition files
- Health performing diagnostics
- Cognition executing actions
- Orchestration bypassing Governance
- Governance mutating Operational Memory without evidence
- Business logic inside React components

---

# Enforcement Principle

If a dependency violates this document, either:

1. Refactor the dependency, or
2. Create an ADR explaining why the exception is justified.
