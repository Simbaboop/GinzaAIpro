# AI Discovery

## Purpose

AI Discovery detects and records available AI providers, models, capabilities, lifecycle changes, and provider health.

It allows GinzaAIpro to evolve its AI model strategy without hardcoding every provider and model into business logic.

---

## Responsibilities

AI Discovery owns:

- provider discovery
- model discovery
- model metadata
- model registry records
- provider health signals
- future model lifecycle detection
- future deprecation detection
- future pricing and capability change detection

---

## Non-Responsibilities

AI Discovery does not own:

- business reasoning
- AI request execution
- governance approval
- production model promotion
- workflow execution
- customer-facing decisions

Those belong to AI Governance, AI Routing, AI Client, Operational Intelligence, Governance, and Execution layers.

---

## Canonical Flow

Provider
↓
Discovery
↓
Model Registry
↓
Evaluation
↓
AI Governance
↓
Approved Model Policy
↓
AI Routing
↓
Execution

---

## Model Lifecycle

Discovered
↓
Candidate
↓
Evaluating
↓
Approved
↓
Active
↓
Deprecated
↓
Retired

---

## Principle

Discovery may identify better models.

Discovery may not silently promote models into production.

Production promotion requires governance.
