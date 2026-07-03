import type { AIModelPurpose, AIProviderName } from "./types";

export type AIModelLifecycleStatus =
  | "Discovered"
  | "Candidate"
  | "Evaluating"
  | "Approved"
  | "Active"
  | "Deprecated"
  | "Retired";

export type AIModelSelectionPriority = "cost" | "latency" | "quality";

export interface AIModelRecord {
  id: string;
  provider: AIProviderName;
  model: string;
  purpose: AIModelPurpose;
  status: AIModelLifecycleStatus;
  supportsStructuredOutput: boolean;
  supportsVision: boolean;
  supportsTools: boolean;
  supportsStreaming: boolean;
  priority: AIModelSelectionPriority;
  discoveredAt: string;
  approvedAt?: string;
  activatedAt?: string;
  deprecatedAt?: string;
  retiredAt?: string;
}

const openAiDefaultModels: AIModelRecord[] = [
  {
    id: "openai-classification-default",
    provider: "openai",
    model: "gpt-5-mini",
    purpose: "classification",
    status: "Active",
    supportsStructuredOutput: true,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    priority: "cost",
    discoveredAt: "2026-07-02T00:00:00.000Z",
    approvedAt: "2026-07-02T00:00:00.000Z",
    activatedAt: "2026-07-02T00:00:00.000Z",
  },
  {
    id: "openai-reasoning-default",
    provider: "openai",
    model: "gpt-5",
    purpose: "reasoning",
    status: "Active",
    supportsStructuredOutput: true,
    supportsVision: false,
    supportsTools: true,
    supportsStreaming: true,
    priority: "quality",
    discoveredAt: "2026-07-02T00:00:00.000Z",
    approvedAt: "2026-07-02T00:00:00.000Z",
    activatedAt: "2026-07-02T00:00:00.000Z",
  },
];

export function selectActiveModel(
  purpose: AIModelPurpose,
  models: AIModelRecord[] = [],
): AIModelRecord | undefined {
  const registryMatch = models.find(
    (model) => model.purpose === purpose && model.status === "Active",
  );

  if (registryMatch) {
    return registryMatch;
  }

  if (process.env.GINZAAIPRO_AI_DEFAULT_PROVIDER === "openai") {
    return openAiDefaultModels.find((model) => model.purpose === purpose);
  }

  return undefined;
}
