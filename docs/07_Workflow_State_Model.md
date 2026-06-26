# Workflow State Model

## Purpose

The Workflow State Model defines the lifecycle of a governed workflow inside GinzaAIpro.

Unlike Outcome Status, which describes the condition of an observation, Workflow State describes the progress of execution.

---

## Workflow Lifecycle

Draft
↓

Ready

↓

Executing

↓

Completed

or

Escalated

---

## State Definitions

### Draft

The workflow has been created but is incomplete.

Typical characteristics:

- Observation captured
- Decision may exist
- Owner may be missing
- Next Action incomplete

---

### Ready

The workflow is ready for execution.

Requirements:

- Observation exists
- Decision recorded
- Owner assigned
- Next Action defined

No execution has occurred yet.

---

### Executing

The assigned owner is carrying out the Next Action.

Execution evidence will eventually be attached here.

---

### Completed

The workflow reached its intended outcome.

Outcome Status will normally be:

- Resolved

---

### Escalated

Execution cannot continue within the current authority or capability.

Examples:

- Requires management approval
- External dependency
- Compliance review
- Operational risk

---

## Relationship to Outcome Status

Workflow State answers:

"What stage is execution in?"

Outcome Status answers:

"What is the condition of the operational problem?"

Examples:

Workflow State = Executing
Outcome Status = Improving

Workflow State = Completed
Outcome Status = Resolved

Workflow State = Escalated
Outcome Status = Escalated

These are intentionally independent concepts.

---

## Architectural Principle

Workflow State governs execution.

Outcome Status governs operational condition.

Keeping these separate preserves clarity throughout the execution chain.
