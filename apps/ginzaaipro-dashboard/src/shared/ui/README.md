# Shared UI

## Purpose

Shared UI contains reusable presentation components for GinzaAIpro features.

These components provide consistent visual language across the dashboard, operational cockpit, intelligence panels, governance queue, timelines, and journey views.

---

## Responsibilities

Shared UI owns:

- reusable visual components
- presentation primitives
- consistent styling patterns
- reusable status indicators
- reusable cards, panels, and timeline elements

---

## Non-Responsibilities

Shared UI does not own:

- domain logic
- runtime logic
- evidence storage
- cognition
- recommendations
- governance policy
- execution logic

Those belong to platform and feature layers.

---

## Planned Components

- Button
- Card
- Panel
- Badge
- Metric
- StatusIndicator
- ConfidenceIndicator
- Timeline
- EmptyState
- LoadingState

---

## Rule

Shared UI components should be presentational.

They should receive data through props and avoid owning business logic.
