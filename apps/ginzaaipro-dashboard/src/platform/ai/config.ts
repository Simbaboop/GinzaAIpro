/**
 * AI Platform Config
 *
 * Centralized AI configuration.
 *
 * API keys must come from environment variables.
 * Never hardcode provider keys in source code.
 */

export const aiConfig = {
  defaultProvider: process.env.GINZAAIPRO_AI_PROVIDER ?? "openai",

  providers: {
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
    },

    anthropic: {
      apiKey: process.env.ANTHROPIC_API_KEY,
    },

    google: {
      apiKey: process.env.GOOGLE_AI_API_KEY,
    },

    openrouter: {
      apiKey: process.env.OPENROUTER_API_KEY,
    },
  },
};
