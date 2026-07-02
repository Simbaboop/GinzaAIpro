# AI Platform

## Purpose

The AI Platform provides a governed interface between GinzaAIpro and external or local AI models.

It centralizes model access so intelligence capabilities do not call LLM providers directly.

---

## Responsibilities

The AI Platform owns:

- AI provider contracts
- AI client interface
- provider registry
- model configuration
- future retries
- future cost tracking
- future model routing
- future prompt versioning

---

## Non-Responsibilities

The AI Platform does not own:

- business reasoning
- governance approval
- workflow execution
- operational memory
- revenue leakage logic
- business recommendation logic

Those belong to intelligence, governance, execution, or platform layers.

---

## Canonical Rule

AI reasons.

Platform executes.

Governance authorizes.

---

## Canonical Flow

Feature
↓
Intelligence Engine
↓
AI Client
↓
AI Provider
↓
LLM
↓
OperationalResult
↓
Governance
↓
Execution
