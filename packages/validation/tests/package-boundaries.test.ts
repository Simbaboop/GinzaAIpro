import {
  readdirSync,
  readFileSync,
  statSync,
} from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import * as domain from "@ginzaaipro/domain";
import { describe, expect, it } from "vitest";

const packageRoot = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
);
const repositoryRoot = resolve(packageRoot, "..", "..");

const sourceFiles = (directory: string): readonly string[] =>
  readdirSync(directory).flatMap((entry) => {
    const path = resolve(directory, entry);
    return statSync(path).isDirectory()
      ? sourceFiles(path)
      : path.endsWith(".ts")
        ? [path]
        : [];
  });

const sourceText = (directory: string): string =>
  sourceFiles(directory)
    .map((path) => readFileSync(path, "utf8"))
    .join("\n");

describe("Canonical Evidence package boundaries", () => {
  it("keeps domain independent from Validation", () => {
    const manifest = JSON.parse(
      readFileSync(
        resolve(repositoryRoot, "packages/domain/package.json"),
        "utf8",
      ),
    ) as { dependencies?: Record<string, string> };
    const sources = sourceText(
      resolve(repositoryRoot, "packages/domain/src"),
    );

    expect(manifest.dependencies ?? {}).toEqual({});
    expect(sources).not.toContain("@ginzaaipro/validation");
    expect(sources).not.toContain("@ginzaaipro/core");
  });

  it("limits Validation dependencies to Core and Domain", () => {
    const manifest = JSON.parse(
      readFileSync(
        resolve(repositoryRoot, "packages/validation/package.json"),
        "utf8",
      ),
    ) as { dependencies?: Record<string, string> };
    const sources = sourceText(
      resolve(repositoryRoot, "packages/validation/src"),
    );

    expect(Object.keys(manifest.dependencies ?? {}).sort()).toEqual([
      "@ginzaaipro/core",
      "@ginzaaipro/domain",
    ]);
    for (const forbidden of [
      "@ginzaaipro/kernel",
      "@ginzaaipro/capture",
      "@ginzaaipro/intelligence",
      "@ginzaaipro/runtime",
    ]) {
      expect(sources).not.toContain(forbidden);
    }
    expect(sources).not.toMatch(
      /from\s+["'][.]{2}\/[.]{2}\/(?:domain|core|capture|kernel)\//,
    );
  });

  it("exports only the authorized domain contracts and keeps rendering private", () => {
    for (const contract of [
      "Evidence",
      "EvidenceComponent",
      "EvidenceRelation",
      "EvidenceQualifier",
      "EvidenceComponentProvenance",
      "EvidenceConstructionRuleReference",
    ]) {
      expect(domain).toHaveProperty(contract);
    }
    expect(domain).not.toHaveProperty("renderEvidenceStatement");
    expect(domain).not.toHaveProperty("EvidenceStatementFactory");
  });

  it("does not transfer Evidence construction to Capture or interpretation to Intelligence", () => {
    const captureSources = sourceText(
      resolve(repositoryRoot, "packages/capture/src"),
    );
    const intelligenceContract = readFileSync(
      resolve(
        repositoryRoot,
        "packages/core/src/intelligence/IntelligenceEngine.ts",
      ),
      "utf8",
    );

    expect(captureSources).not.toMatch(/\bnew\s+Evidence\s*\(/);
    expect(captureSources).not.toContain("EvidenceFactory");
    expect(intelligenceContract).toContain("readonly Evidence[]");
    expect(intelligenceContract).not.toContain(
      "VALIDATION_EVIDENCE_CONSTRUCTION",
    );
  });
});
