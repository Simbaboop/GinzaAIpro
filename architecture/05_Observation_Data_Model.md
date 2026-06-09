# Observation Data Model v0.1

## Purpose

Defines the canonical Observation entity for GinzaAIpro.

All Observation records must conform to this structure.

---

## Observation

Observation

### Identity

id: string

### Core

title: string

description: text

source: string

timestamp: datetime

### Classification

category:

- Opportunity
- Problem
- Risk
- Revenue
- Research
- Execution
- Customer
- Operations

severity:

- Low
- Medium
- High
- Critical

confidence:

0-100

### Governance

status:

- New
- Under Review
- Approved
- Rejected
- In Progress
- Resolved
- Archived

owner: string

review_required: boolean

### Traceability

trace_id: string

created_by: string

created_at: datetime

updated_at: datetime

### Relationships

related_observations[]

related_decisions[]

related_projects[]

---

## MVP Required Fields

Only these fields are required for MVP:

- title
- description
- category
- status

Everything else may be added later.

---

## Design Principle

The MVP should remain intentionally simple.

Capture first.

Complexity later.
