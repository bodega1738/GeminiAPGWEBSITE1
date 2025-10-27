import { createMachine, assign } from "xstate";

/**
 * AI Assistant State Machine
 * Manages AI query rate limiting and conversation state
 * Prevents exceeding monthly quota (100 queries/user/month)
 */
export const aiMachine = createMachine({
  id: "aiAssistant",
  initial: "idle",
  context: {
    userId: null as string | null,
    queriesThisMonth: 0,
    queriesLimit: 100,
    currentPrompt: null as string | null,
  },
  states: {
    idle: {
      on: {
        QUERY: {
          target: "checkingRateLimit",
          actions: assign({
            currentPrompt: ({ event }) => event.prompt,
          }),
        },
      },
    },
    checkingRateLimit: {
      on: {
        WITHIN_LIMIT: "checkingAIEnabled",
        LIMIT_EXCEEDED: "rateLimitExceeded",
      },
    },
    checkingAIEnabled: {
      on: {
        AI_ENABLED: "querying",
        AI_DISABLED: "aiDisabled",
      },
    },
    querying: {
      on: {
        RESPONSE_RECEIVED: "responding",
        QUERY_ERROR: "error",
        TIMEOUT: "error",
      },
    },
    responding: {
      on: {
        COMPLETE: {
          target: "idle",
          actions: assign({
            queriesThisMonth: ({ context }) => context.queriesThisMonth + 1,
            currentPrompt: null,
          }),
        },
      },
    },
    rateLimitExceeded: {
      on: {
        RESET_LIMIT: "idle",
      },
    },
    aiDisabled: {
      on: {
        ENABLE_AI: "idle",
      },
    },
    error: {
      on: {
        RETRY: "querying",
        CANCEL: "idle",
      },
    },
  },
});

export type AIEvent =
  | { type: "QUERY"; prompt: string }
  | { type: "WITHIN_LIMIT" }
  | { type: "LIMIT_EXCEEDED" }
  | { type: "AI_ENABLED" }
  | { type: "AI_DISABLED" }
  | { type: "RESPONSE_RECEIVED" }
  | { type: "QUERY_ERROR" }
  | { type: "TIMEOUT" }
  | { type: "COMPLETE" }
  | { type: "RESET_LIMIT" }
  | { type: "ENABLE_AI" }
  | { type: "RETRY" }
  | { type: "CANCEL" };
