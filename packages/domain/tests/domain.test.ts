import { describe, expect, it } from "vitest";
import {
  AggregateRoot,
  Customer,
  Identifier,
  Leakage,
  Money,
  Organization,
  Percentage,
  TimePeriod,
} from "../src/index.js";

describe("domain value objects", () => {
  it("rejects empty identifiers", () => {
    expect(() => new Identifier("   ")).toThrow("cannot be empty");
  });

  it("uses exact integer minor units for money arithmetic", () => {
    const total = new Money(9_007_199_254_740_993n, "usd").add(
      new Money(7n, "USD"),
    );

    expect(total.minorUnits).toBe(9_007_199_254_741_000n);
    expect(total.currency).toBe("USD");
    expect(() => total.add(new Money(1n, "EUR"))).toThrow(
      "matching currencies",
    );
  });

  it("enforces the documented percentage range", () => {
    expect(Percentage.fromBasisPoints(5_025).value).toBe(50.25);
    expect(() => Percentage.fromBasisPoints(-1)).toThrow();
    expect(() => Percentage.fromBasisPoints(10_001)).toThrow();
    expect(() => Percentage.fromBasisPoints(1.5)).toThrow();
  });

  it("rejects a period ending before it starts", () => {
    expect(
      () =>
        new TimePeriod(
          "2026-07-19T00:00:00.000Z",
          "2026-07-18T00:00:00.000Z",
        ),
    ).toThrow("earlier");
  });
});

describe("domain entities and kernel identities", () => {
  it("constructs immutable business entities with stable identity", () => {
    const organizationId = new Identifier("org_001");
    const organization = new Organization(organizationId, "Ginza");
    const customer = new Customer(
      new Identifier("cus_001"),
      organizationId,
      "Ari",
    );

    expect(Object.isFrozen(organization)).toBe(true);
    expect(Object.isFrozen(customer)).toBe(true);
    expect(organization).toBeInstanceOf(AggregateRoot);
    expect(organization.id).toBe(organizationId);
    expect(customer.organizationId).toBe(organizationId);
    expect(organization.equals(new Organization(organizationId, "Other"))).toBe(
      true,
    );
  });

  it("keeps kernel-owned findings and evidence as immutable identifiers", () => {
    const findingId = new Identifier("fnd_001");
    const evidenceIds = [new Identifier("evd_001")] as const;
    const leakage = new Leakage(
      new Identifier("leak_001"),
      new Identifier("org_001"),
      findingId,
      new Money(125_00n, "USD"),
      Percentage.fromBasisPoints(8_500),
      evidenceIds,
    );

    expect(Object.isFrozen(leakage)).toBe(true);
    expect(Object.isFrozen(leakage.evidenceIds)).toBe(true);
    expect(leakage.findingId).toBe(findingId);
    expect(leakage.evidenceIds).toHaveLength(1);
    expect(leakage.estimatedImpact.minorUnits).toBe(125_00n);
  });
});
