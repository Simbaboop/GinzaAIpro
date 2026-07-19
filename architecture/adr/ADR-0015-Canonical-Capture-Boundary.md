# ADR-0015: Canonical Capture Boundary

## Status

Accepted for Sprint 2.4.

## Context

The current Capture Engine contract accepts a `BusinessSignal` and returns a `BusinessSignal`. This is an identity-preserving processing step, not a true capture operation. By the time a `BusinessSignal` exists, technology-specific input has already been interpreted, normalized, assigned business identity, categorized, timestamped, and expressed through canonical domain value objects.

The repository also contains kernel `BusinessEvent` records and several application-local payload, observation, and capture types. None provides the stable, technology-neutral boundary required by the core capture contract.

## Decision

### Canonical boundary vocabulary

The capture boundary distinguishes six concepts:

- **External Reality** is the real-world occurrence that the system seeks to observe. It is not a software object and is not owned by a package.
- **External Representation** is a technology-specific representation of that occurrence, such as a webhook, form, file, email, API payload, or kernel event. It may be incomplete, malformed, duplicated, or shaped by its transport.
- **Adapter** understands an external representation and translates it into `CaptureInput`. An adapter is source-specific and remains outside the capture implementation package.
- **`CaptureInput`** is the normalized, technology-neutral intake contract accepted by the Capture Engine. It belongs in `packages/core` beside the `CaptureEngine` contract.
- **`BusinessSignal`** is the immutable canonical captured observation produced by the Capture Engine.
- **`Evidence`** is a validated business fact derived by Validation from one or more `BusinessSignal` records.

These concepts are separate stages. An external representation is not a `CaptureInput`, a `CaptureInput` is not yet a `BusinessSignal`, and a `BusinessSignal` is not Evidence until Validation establishes that it qualifies.

### Capture begins before `BusinessSignal`

The canonical Capture Engine will transform `CaptureInput` into an immutable `BusinessSignal`.

`CaptureInput` represents normalized intake data that is sufficient to create a business signal but has not yet been promoted into one. It is the boundary between technology-specific translation and canonical business meaning.

The Capture Engine is responsible only for:

- enforcing the canonical structural and domain requirements for creating a `BusinessSignal`;
- preserving organization, source, subject, and temporal traceability supplied through `CaptureInput`;
- assigning or constructing canonical signal identity from explicitly supplied deterministic identity material;
- setting `capturedAt` from `EngineContext.executionTime`;
- initializing `validationStatus` as `"unvalidated"`;
- constructing an immutable `BusinessSignal`;
- returning capture diagnostics and an auditable explanation.

It must not fabricate missing business facts. It does not claim validated confidence: initial confidence must either be supplied explicitly by the adapter through `CaptureInput` or be set according to a documented deterministic default in SAS-0002.

The Capture Engine is not responsible for connectors, transport protocols, authentication, persistence, event publication, external retries, source-specific payload interpretation, or deciding whether a signal qualifies as Evidence.

### `BusinessEvent` remains a kernel primitive

Kernel `BusinessEvent` represents runtime execution, traceability, audit, and event processing. Making it the direct Capture Engine input would introduce a `packages/core` dependency on `packages/kernel` and conflate runtime event representation with business capture semantics.

Core behavioral contracts must remain dependent on canonical domain concepts and technology-neutral contracts. `packages/core` must not depend on `packages/kernel`. A kernel event is one possible external representation and may be translated by an adapter, but its identifiers, payload conventions, versions, and runtime metadata do not define the stable capture boundary.

### Adapters own technology-specific translation

Adapters receive external representations such as webhook bodies, connector records, imported files, forms, emails, API payloads, or kernel events. They translate those inputs into `CaptureInput`.

Adapters are responsible for:

- understanding external schemas and protocols;
- selecting and mapping source fields;
- rejecting malformed technology-specific payloads that cannot be translated into valid canonical intake;
- converting transport-specific identifiers and timestamps;
- supplying source representation data;
- supplying organization identity and occurrence time;
- supplying a category candidate and value;
- supplying optional subject identity when the source provides one;
- supplying a source reference;
- supplying the deterministic identity material from which capture constructs canonical signal identity;
- supplying initial confidence when a documented deterministic default from SAS-0002 is not used.

No raw connector payload, application DTO, or generic unbounded payload becomes part of the core Capture Engine contract.

### `CaptureInput` is the canonical intake boundary

`CaptureInput` is the only canonical input contract for the Capture Engine. It belongs in `packages/core` beside `CaptureEngine` and must be immutable, framework-independent, technology-neutral, and limited to information required to construct a `BusinessSignal`.

Competing upstream canonical models are prohibited. Types such as `BusinessEvent`, `CaptureRecord`, `Observation`, connector DTOs, or raw payload envelopes must not become alternative Capture Engine input contracts unless a future ADR explicitly supersedes this decision.

It must not contain:

- connector clients or callbacks;
- persistence concerns;
- kernel services;
- request or response objects;
- retry or orchestration state;
- arbitrary mutable context bags;
- technology-specific payload schemas.

### Package ownership

The contracts and implementation have distinct ownership:

- `packages/core` owns `CaptureInput` and `CaptureEngine`.
- A separate `packages/capture` implementation package owns the concrete deterministic Capture Engine.
- `packages/capture` may depend on `packages/core` and `packages/domain`.
- `packages/core` must not depend on `packages/kernel`.
- Adapters remain outside `packages/capture`; the capture package contains no connector-specific or transport-specific translation.

This keeps the stable engine contract independent of runtime event infrastructure while allowing the deterministic implementation to construct canonical domain objects.

### Validation boundary

Responsibility is divided at explicit boundaries:

- Adapters reject malformed technology-specific payloads that cannot be translated into `CaptureInput`.
- The Capture Engine enforces canonical structural and domain requirements required to create an immutable `BusinessSignal`.
- The Validation Engine determines whether a created `BusinessSignal` qualifies as Evidence.

Capture therefore establishes a canonical observation, not a validated business fact. Evidence may be derived from one or more `BusinessSignal` records and remains a Validation concern.

## Dependency flow

The architectural flow is:

```text
External Reality
       |
External Representation
(webhook, form, file, email,
 API payload, or kernel event)
       |
    Adapter
       |
 CaptureInput
       |
    Capture
       |
 BusinessSignal
       |
  Validation
       |
   Evidence
       |
 Intelligence
```

Expressed as package responsibility:

```text
Adapters -> Capture -> Validation -> Intelligence
```

The corresponding package ownership and allowed dependencies are:

```text
Adapters ----------> packages/core
packages/capture ---> packages/core
packages/capture ---> packages/domain
```

Dependencies point toward stable contracts and domain meaning. `packages/capture` does not depend on adapter implementations, adapters do not live in `packages/capture`, and `packages/core` does not acquire a kernel dependency merely to receive events.

## Consequences

- `BusinessSignal -> BusinessSignal` will no longer be considered the canonical capture operation.
- The Capture Engine contract will use `CaptureInput` as input and `BusinessSignal` as output.
- `CaptureInput` will be owned by `packages/core` and will be the only canonical Capture Engine input contract.
- Competing canonical capture-input models are prohibited unless a future ADR supersedes this decision.
- The deterministic Capture Engine implementation will be owned by a separate `packages/capture` package.
- `BusinessSignal` remains the sole canonical captured-signal domain entity.
- `Evidence` remains a validated fact produced by Validation from one or more captured signals.
- Kernel `BusinessEvent` remains a runtime and audit primitive.
- `packages/core` remains independent of `packages/kernel`.
- External and application-specific payload types remain outside core contracts.
- Adapters must perform explicit translation before invoking capture.
- Adapters remain outside `packages/capture`.
- Capture implementations remain deterministic and independently testable.
- Signal identity is constructed from explicitly supplied deterministic identity material.
- `capturedAt` is sourced from `EngineContext.executionTime`, and new signals begin with `validationStatus` set to `"unvalidated"`.
- Initial confidence is either adapter-supplied or governed by the deterministic default documented in SAS-0002; capture does not claim validated confidence.
- Capture must reject insufficient canonical input rather than fabricate missing business facts.
- Validation continues to receive immutable `BusinessSignal` objects and remains unaffected by source technology.
- The boundary introduces one additional explicit model, but removes ambiguity between raw intake, runtime events, and canonical business signals.

## Sprint 2.4 migration notes

Sprint 2.4 will:

1. Define the minimum immutable `CaptureInput` contract in `packages/core` beside `CaptureEngine`.
2. Change the Capture Engine input from `BusinessSignal` to `CaptureInput`.
3. Create `packages/capture` for the concrete deterministic Capture Engine, with dependencies on `packages/core` and `packages/domain` only as required.
4. Implement deterministic transformation from `CaptureInput` to `BusinessSignal`, constructing signal identity from explicitly supplied deterministic identity material.
5. Set `capturedAt` from `EngineContext.executionTime` and initialize `validationStatus` as `"unvalidated"`.
6. Require adapter-supplied initial confidence or apply only the deterministic default documented in SAS-0002.
7. Preserve adapter-supplied organization, source, subject, occurrence, category, value, and source-reference information without fabricating missing business facts.
8. Add focused tests for canonical requirements, immutability, deterministic identity, capture timing, initial validation status, confidence handling, diagnostics, explanations, and failure behavior.
9. Keep adapters outside `packages/capture`.
10. Keep Validation responsible for determining whether one or more `BusinessSignal` records qualify as Evidence.
11. Avoid changing Validation Engine input or introducing any `packages/core` dependency on `packages/kernel`.
12. Migrate application-local capture flows through adapters incrementally rather than treating dashboard `CaptureRecord`, `Observation`, kernel `BusinessEvent`, or any other upstream type as a competing canonical core input.
