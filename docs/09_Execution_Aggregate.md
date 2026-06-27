# Execution Aggregate

## Purpose

The Execution Aggregate represents the governed carrying-out of a Next Action.

An Observation captures operational reality.

An Execution records whether action was taken, by whom, when, with what evidence, and whether the result was verified.

---

## Core Distinction

Observation answers:

What happened?

Execution answers:

What was done about it?

Outcome answers:

Did the condition improve?

---

## Current Relationship

Observation
→ Decision Note
→ Owner
→ Next Action
→ Workflow State
→ Execution
→ Verification Status
→ Outcome Status
→ Outcome / Learning

---

## Execution Identity

Every Execution should eventually have:

- execution_id
- observation_id
- tenant_id
- trace_id
- next_action
- executor_type
- executor_id
- execution_status
- execution_evidence
- verification_status
- started_at
- completed_at
- created_at

---

## Executor Types

### Human

A person performs the action.

### Agent

An AI agent performs or assists the action.

### System

A software system or automation performs the action.

### External

An outside party or dependency performs the action.

---

## Execution Status

### Not Started

The action has been defined but execution has not begun.

### In Progress

Execution has started.

### Completed

Execution has been completed.

### Failed

Execution was attempted but did not succeed.

### Blocked

Execution cannot continue due to dependency, missing authority, missing information, or external condition.

---

## Verification Status

### Unverified

No evidence has confirmed execution.

### Verified

Evidence confirms execution occurred.

### Needs Review

Human review is required.

### Failed Verification

Evidence does not support successful execution.

---

## Evidence Model

Execution evidence may include:

- written note
- call note
- email record
- SMS record
- CRM update
- booking confirmation
- payment confirmation
- screenshot
- uploaded document
- approval note
- system log
- agent execution trace

---

## Governance Rule

Execution is not trusted merely because it is marked complete.

Execution becomes trusted only when evidence exists and verification passes.

---

## Relationship to PGEA

The Execution Aggregate supports:

Propose
→ Gate
→ Execute
→ Audit

The Execution Aggregate begins at Execute and contributes to Audit.

---

## Relationship to Operational Memory

Every Execution contributes to Operational Memory.

Over time, GinzaAIpro learns:

- which actions resolve which observations
- which owners complete work reliably
- which workflows get blocked
- which interventions produce measurable improvement
- which execution patterns require escalation

---

## Current MVP Boundary

The current MVP does not yet create separate Execution records in code.

For now, execution-related fields remain attached to Observation.

This document defines the future separation point.

---

## Future Implementation

Future implementation may introduce:

- executions table
- execution_events table
- execution_evidence table
- verification service
- executor registry
- agent execution contracts
