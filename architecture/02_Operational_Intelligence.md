# Operational Intelligence Architecture v0.1

## Purpose

Operational Intelligence is the GinzaAIpro subsystem that converts captured operational signals into insight, diagnosis, prioritization, and recommended action.

It does not execute actions directly.

It explains operational reality.

---

## Position in the System

The GinzaAIpro sequence is:

Capture  
↓  
Observability  
↓  
Operational Intelligence  
↓  
Governance  
↓  
Execution

Operational Intelligence depends on Capture and Observability.

Without captured events, there is nothing to analyze.

---

## Core Definition

Operational Intelligence is the ability to interpret business activity and identify:

- operational friction
- revenue leakage
- execution failures
- customer journey breakdowns
- process delays
- ownership gaps
- risk signals
- improvement opportunities
- decision priorities

---

## What Operational Intelligence Answers

Operational Intelligence answers:

1. What is happening?
2. Why is it happening?
3. Where is the breakdown?
4. Who owns the issue?
5. What is the likely business impact?
6. What should be reviewed?
7. What should be recommended?
8. What requires governance approval?

---

## Primary Inputs

Operational Intelligence receives inputs from:

- captured events
- diagnostic intake forms
- client workflow notes
- task status updates
- customer communication records
- missed opportunity logs
- follow-up records
- revenue leakage events
- manual consultant observations

---

## Primary Outputs

Operational Intelligence produces:

- classifications
- diagnoses
- risk scores
- severity levels
- recommended actions
- operational summaries
- business health indicators
- governance review items

---

## Non-Execution Rule

Operational Intelligence cannot directly execute.

It can only recommend, classify, summarize, prioritize, or escalate.

Execution belongs to the governed execution layer.

---

## Initial Intelligence Categories

The MVP should begin with simple categories:

1. Missed Lead
2. Slow Follow-Up
3. Quote Delay
4. Lost Revenue Opportunity
5. Client Communication Breakdown
6. Workflow Bottleneck
7. Ownership Gap
8. Repeated Manual Task
9. Untracked Customer Request
10. High-Risk Operational Event

---

## Diagnostic Output Structure

Every intelligence output should eventually include:

- event_id
- tenant_id
- category
- severity
- confidence
- explanation
- recommended_action
- requires_human_review
- requires_governance_review
- timestamp
- trace_id

---

## Governance Relationship

Operational Intelligence prepares decisions.

Governance approves or rejects decisions.

Execution acts only after governance approval.

---

## MVP Boundary

The first version should not attempt autonomous reasoning across all business systems.

The first version should classify and explain captured operational events using structured rules and human-readable summaries.

---

## Long-Term Direction

Over time, Operational Intelligence should evolve into:

- pattern recognition
- root-cause analysis
- business health scoring
- revenue leakage prediction
- workflow optimization
- opportunity detection
- AI-assisted consulting diagnosis
