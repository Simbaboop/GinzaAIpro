# Subsystems

## Status

Canonical

---

# Purpose

This document defines the responsibilities of every major subsystem in GinzaAIpro.

Subsystem boundaries should remain stable over time.

---

# Domain

## Purpose

Represents the business itself.

Owns:

- business entities
- business rules
- business terminology

Does not own:

- runtime
- health
- cognition
- governance

---

# Runtime

## Purpose

Executes the platform.

Owns:

- lifecycle
- capabilities
- runtime events
- execution context
- sessions

---

# Operational Evidence

## Purpose

Represents factual evidence.

Owns:

- evidence records
- evidence metadata
- evidence references

Evidence precedes reasoning.

---

# Operational Nervous System

## Purpose

Transforms runtime events into operational awareness.

Owns:

- signals
- routing
- prioritization
- signal subscriptions

---

# Operational Memory

## Purpose

Stores organizational history.

Owns:

- operational history
- decisions
- outcomes
- historical assessments
- organizational learning

---

# Operational Health

## Purpose

Measures current operational condition.

Owns:

- runtime health
- business health
- health snapshots
- health metrics

Does not diagnose.

---

# Operational Cognition

## Purpose

Explains operational reality.

Owns:

- assessments
- diagnostics
- recommendations
- reasoning
- confidence scoring

---

# Operational Orchestration

## Purpose

Coordinates execution across capabilities.

Owns:

- workflows
- sequencing
- coordination
- long-running operations

Does not perform governance.

---

# Governance

## Purpose

Authorizes operational action.

Owns:

- policy
- approvals
- constitutional validation
- operational risk

---

# Experience

## Purpose

Provides human interaction.

Owns:

- dashboards
- reports
- notifications
- APIs
- user experience

---

# Integrations

## Purpose

Connects GinzaAIpro to external systems.

Examples:

- CRM
- accounting
- email
- calendar
- phone systems
- payment providers

---

# Infrastructure

## Purpose

Provides technical platform services.

Examples:

- database
- storage
- queues
- messaging
- caching
- authentication

---

# Shared

## Purpose

Contains reusable technical utilities.

Examples:

- shared types
- helpers
- constants
- common abstractions

---

# Subsystem Principle

Every subsystem owns a clear responsibility.

Subsystems collaborate.

Subsystems should not absorb each other's responsibilities.
