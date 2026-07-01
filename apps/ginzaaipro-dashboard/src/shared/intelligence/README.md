# Shared Intelligence

## Purpose

Shared Intelligence defines common contracts used by GinzaAIpro intelligence capabilities.

It standardizes how engines return results, expose confidence, reference evidence, and participate in intelligence pipelines.

---

## Responsibilities

Shared Intelligence owns:

- common intelligence result envelopes
- intelligence engine contracts
- intelligence pipeline contracts

---

## Non-Responsibilities

Shared Intelligence does not own:

- domain-specific reasoning
- revenue leakage logic
- business health logic
- diagnostics logic
- governance approval
- execution

Those belong to their respective intelligence capabilities or governance layers.

---

## Core Principle

Every intelligence capability should produce explainable, evidence-backed, traceable outputs.

---

## Canonical Result Shape

OperationalResult<T>

The payload is domain-specific.

The envelope is shared.

This allows different intelligence engines to interoperate consistently.
