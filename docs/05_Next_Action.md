# Next Action Specification v0.1

## Purpose

Next Action defines the immediate executable step associated with an observation.

It bridges Governance and Execution.

Without a Next Action, an observation may be understood but not acted upon.

---

## Definition

A Next Action is the smallest meaningful step that moves an observation forward.

Examples:

- Call customer
- Investigate billing discrepancy
- Review contract
- Schedule follow-up
- Assign technician
- Conduct audit

---

## Governance Relationship

Decision Notes explain why.

Next Actions define what happens next.

---

## Ownership Relationship

Every Next Action should have an owner.

---

## Execution Relationship

Future workflow engines may convert Next Actions into:

- tasks
- workflows
- reminders
- automations
- agent assignments

---

## MVP Implementation

The MVP stores:

nextAction: string

inside the Observation object.

---

## Future Evolution

Next Action
↓
Task
↓
Workflow
↓
Automation
↓
Agent Execution

Future agents may suggest Next Actions but may not execute them without governance approval.
