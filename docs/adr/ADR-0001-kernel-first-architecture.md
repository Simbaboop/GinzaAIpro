# ADR-0001 — Kernel-First Architecture

- **Status:** Accepted
- **Date:** 2026-07-17

## Decision

The GinzaAIpro kernel owns five canonical concepts: Event, Finding, Decision, Action, and Evidence.

Capabilities are plugins that consume events and produce findings, decisions, and measurements through explicit contracts.

## Rule

A new concept may enter the kernel only when at least two implemented capabilities require it and composition cannot express the need cleanly.
