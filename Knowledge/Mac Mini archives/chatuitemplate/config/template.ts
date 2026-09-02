/**
 * Hermes Agent Chat UI — Template Configuration
 *
 * Customize these values before deploying with your own backend.
 * All paths and URLs are centralized here for easy integration.
 */

export const templateConfig = {
  name: "Hermes Agent Chat UI",

  backend: {
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/assistant",
  },

  appearance: {
    accentColor: "emerald",
    defaultDark: true,
    brandName: "Hermes",
  },

  assistant: {
    suggestions: [
      {
        title: "What can you do?",
        label: "Show capabilities",
        prompt: "What can you help me with? List your tools and capabilities.",
      },
      {
        title: "Code review",
        label: "Review my code",
        prompt: "Review this code for issues and suggest improvements.",
      },
      {
        title: "Explain concept",
        label: "Explain a concept",
        prompt: "Explain how React Server Components work.",
      },
      {
        title: "Debug issue",
        label: "Help me debug",
        prompt: "I'm getting this error. Help me debug it.",
      },
    ],
  },

  toolRegistry: "app/toolkit.tsx",

  messageConverter: "app/MyRuntimeProvider.tsx",
} as const;

export type TemplateConfig = typeof templateConfig;
