# Observation Lifecycle Specification v0.1

## Purpose

The Observation Lifecycle defines how an observation moves through GinzaAIpro from capture to closure.

This prevents observations from becoming passive notes.

Every observation must represent operational reality, review status, governance state, and eventual outcome.

---

## Lifecycle Flow

New
↓
Under Review
↓
Approved / Rejected / Deferred
↓
In Progress
↓
Resolved
↓
Archived

---

## Status Definitions

### New

The observation has been captured but not yet reviewed.

### Under Review

The observation is being examined for meaning, priority, risk, or opportunity.

### Approved

The observation has been accepted as valid and worthy of action or tracking.

### Rejected

The observation has been reviewed and determined not to require action.

### Deferred

The observation is valid but not ready for action.

### In Progress

A response, investigation, task, or intervention is currently underway.

### Resolved

The issue, opportunity, or investigation has reached an outcome.

### Archived

The observation is no longer active but remains preserved for audit, learning, and historical intelligence.

---

## Governance Rule

No observation should move into execution without review.

Approved does not mean executed.

Approved means eligible for action.

Execution requires a task, owner, and traceable outcome.

---

## Data Relationship

Observation
↓
Decision Note
↓
Task / Action
↓
Outcome
↓
Learning

---

## MVP Implementation

Current MVP supports:

- New
- Under Review
- Approved
- Rejected
- In Progress
- Resolved
- Archived

Deferred will be added in a later workflow refinement.

---

## Future Agent Role

Future agents may assist with:

- suggesting status transitions
- identifying stale observations
- flagging unresolved critical items
- recommending escalation
- drafting decision notes
- creating tasks after governance approval

Agents may recommend lifecycle transitions.

Agents may not bypass governance rules.
