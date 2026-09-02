/**
 * Hermes Agent Chat UI — Backend Adapter Configuration
 *
 * Swap backends by changing the adapter and API URL.
 * The default uses Assistant Transport protocol with LangChain message format.
 *
 * --- AWS BACKEND INTEGRATION ---
 * 1. Set NEXT_PUBLIC_API_URL to your API Gateway endpoint
 * 2. Implement your backend with the Assistant Transport protocol
 * 3. See https://assistant-ui.com/docs/runtimes/assistant-transport for spec
 */

export interface BackendAdapter {
  apiUrl: string;
  messageFormat: "langchain" | "openai" | "custom";
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
}

export const backendAdapter: BackendAdapter = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/assistant",
  messageFormat: "langchain",
  headers: {
    "X-Hermes-Client": "assistant-ui-template",
  },
  body: {},
};

export function createBackendUrl(path: string = ""): string {
  const base = backendAdapter.apiUrl.replace(/\/+$/, "");
  return `${base}${path}`;
}

/**
 * AWS Backend Configuration Example:
 *
 * export const awsBackendAdapter: BackendAdapter = {
 *   apiUrl: "https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/assistant",
 *   messageFormat: "langchain",
 *   headers: {
 *     "x-api-key": process.env.AWS_API_KEY || "",
 *     "X-Hermes-Client": "aws-agent",
 *   },
 * };
 */
