# Features

## Purpose

The features layer contains customer-facing product capabilities.

Features compose platform subsystems into usable workflows, screens, and operational experiences.

---

## Responsibilities

Features own:

- user-facing workflows
- UI-facing orchestration
- feature-specific services
- feature-specific models
- demo/reference application flows

---

## Non-Responsibilities

Features do not own:

- domain truth
- runtime lifecycle
- operational evidence storage
- knowledge graph storage
- operational memory
- health computation
- cognition engines
- governance policy

Those belong to the platform layers.

---

## Dependency Rule

Features may depend on platform subsystems.

Platform subsystems must not depend on features.

Allowed:

Feature
↓
Platform

Forbidden:

Platform
↓
Feature

---

## Initial Feature Packages

Planned features:

- capture
- evidence timeline
- graph viewer
- memory timeline
- revenue leakage panel
- business recommendations panel
- governance queue
- journey viewer
- executive cockpit
- operational supervisor

---

## Feature Principle

A feature should produce visible customer value while reusing the platform architecture.
