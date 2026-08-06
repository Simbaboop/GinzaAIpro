# AMD-0002 — Capability 002 Verification Corrections

- Workflow status: Accepted
- Approved by: Simba Kanjanda
- Approval date: 2026-08-06
- Date: 2026-08-06
- Amends: SAS-0002B, IRG-0002-R2, and E2-001-R3
- Scope: Capability 002 non-ASCII fixed vector and released `instant` Evidence compatibility only
- Resolves: CON-0008

## Decision

Human authority approves both minimum corrections identified during
E2-001-R3 implementation validation.

### Non-ASCII fixed vector

The complete ordered scalar material stated by the Capability 002 governance
chain was independently encoded with UTF-8 byte-length prefixes and SHA-256
outside the Capability 002 implementation. The ratified expected identifier
is:

```text
semantic-fact:v1:75dc8425b955d541f801e5e86ffd9f21793a5bec31bf134e60f116fc3eb51e70
```

The superseded `ce7cb9e8...` value did not reproduce from the published
material. This correction changes no identity algorithm or scalar ordering.

### Released instant compatibility

`EvidenceValue` already declares and canonicalizes the `instant` variant, and
Evidence rendering already defines its canonical representation. Capability
001 is corrected narrowly so an `instant` component using the repository's
existing `VAL-EVIDENCE-TEXT-001@1.0.0` construction-rule convention is
accepted by Evidence statement validation.

No new value variant, identity material, construction rule, dependency, or
Capability 002 meaning is introduced.

## Authorized repository correction

The following Capability 001 files may change only as required to implement
and verify released `instant` compatibility:

- `packages/domain/src/intelligence/Evidence.ts`;
- `packages/domain/tests/evidence-component.test.ts`.

Capability 002 governance and tests may replace only the superseded Vector 3
expected identifier and add references to this amendment.

## Continuation authority

After these corrections pass Domain and Capability 002 verification,
E2-001-R3 implementation may resume under its existing boundaries.

This amendment does not authorize release certification, tagging, pushing,
deployment, production use, or any other Capability 001 modification.
