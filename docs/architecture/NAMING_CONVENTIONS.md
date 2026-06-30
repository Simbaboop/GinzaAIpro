# Naming Conventions

## Status

Canonical

---

# Purpose

This document defines naming conventions for GinzaAIpro.

Names should communicate architectural responsibility clearly.

Acronyms may be used in conversation, but code should prefer descriptive names.

---

# General Rule

Use full descriptive names for major subsystems.

Avoid unclear acronyms in folder names.

---

# Top-Level Subsystems

Preferred folder names:

- domain
- runtime
- operational-evidence
- operational-nervous-system
- operational-memory
- operational-health
- operational-cognition
- operational-orchestration
- governance
- experience
- integrations
- infrastructure
- shared

---

# Subsystem Naming

## Runtime

Runtime components should use names such as:

- Runtime
- RuntimeContext
- RuntimeState
- RuntimeSession
- RuntimeEvent
- RuntimeCapability
- CapabilityRegistry
- RuntimeEventBus

---

## Operational Nervous System

ONS components should use names such as:

- OperationalSignal
- OperationalSignalBus
- OperationalSignalRouter
- OperationalSignalSubscriber

---

## Operational Evidence

Evidence components should use names such as:

- OperationalEvidence
- OperationalEvidenceStore

---

## Operational Memory

Memory components should use names such as:

- MemoryEntry
- OperationalMemoryStore

---

## Operational Health

Health components should use names such as:

- RuntimeHealthSnapshot
- RuntimeHealthService
- BusinessHealth
- BusinessHealthEngine
- BusinessHealthCapability

---

## Operational Cognition

Cognition components should use names such as:

- OperationalAssessment
- AssessmentPipeline
- AssessmentEngine
- DiagnosticEngine

---

# Engine vs Service vs Capability

## Engine

Use Engine for components that compute, infer, score, diagnose, reason, or optimize.

Examples:

- AssessmentEngine
- DiagnosticEngine
- BusinessHealthEngine
- RevenueLeakageEngine

---

## Service

Use Service for components that expose or coordinate access to functionality.

Examples:

- RuntimeHealthService
- BusinessHealthService

---

## Capability

Use Capability for runtime-registered platform capabilities.

Examples:

- RuntimeHealthCapability
- BusinessHealthCapability
- RevenueLeakageCapability

---

## Store

Use Store for temporary or persistent data storage interfaces.

Examples:

- OperationalEvidenceStore
- OperationalMemoryStore

---

## Router

Use Router for routing signals, events, requests, or capabilities.

Examples:

- OperationalSignalRouter

---

# Acronym Rule

Documentation may introduce acronyms.

Code should prefer full descriptive names unless the acronym is universally clear.

Examples:

Use:

operational-nervous-system

Avoid:

ons

Use:

operational-orchestration

Avoid:

ooe

---

# Naming Principle

A name should answer:

"What responsibility does this object own?"

If the name does not clarify responsibility, rename it.
