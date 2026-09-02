"use client";

import {
  AssistantRuntimeProvider,
  Tools,
  type AssistantTransportConnectionMetadata,
  unstable_createMessageConverter as createMessageConverter,
  useAui,
  useAssistantTransportRuntime,
} from "@assistant-ui/react";
import {
  convertLangChainMessages,
  type LangChainMessage,
} from "@assistant-ui/react-langgraph";
import type { ReactNode } from "react";
import toolkit from "./toolkit";
import { templateConfig } from "@/config/template";

type MyRuntimeProviderProps = {
  children: ReactNode;
};

type State = {
  messages: LangChainMessage[];
};

const LangChainMessageConverter = createMessageConverter(
  convertLangChainMessages,
);

const converter = (
  state: State,
  connectionMetadata: AssistantTransportConnectionMetadata,
) => {
  const optimisticStateMessages = connectionMetadata.pendingCommands.map(
    (c): LangChainMessage[] => {
      if (c.type === "add-message") {
        return [
          {
            type: "human" as const,
            content: [
              {
                type: "text" as const,
                text: c.message.parts
                  .map((p) => (p.type === "text" ? p.text : ""))
                  .join("\n"),
              },
            ],
          },
        ];
      }
      return [];
    },
  );

  const messages = [...state.messages, ...optimisticStateMessages.flat()];
  return {
    messages: LangChainMessageConverter.toThreadMessages(messages),
    isRunning: connectionMetadata.isSending || false,
  };
};

export function MyRuntimeProvider({ children }: MyRuntimeProviderProps) {
  const runtime = useAssistantTransportRuntime({
    initialState: {
      messages: [],
    },
    api: templateConfig.backend.apiUrl,
    converter,
    headers: async () => ({
      "X-Hermes-Client": "assistant-ui-template",
    }),
    body: {},
    prepareSendCommandsRequest: (body) => {
      return body;
    },
    onResponse: () => {},
    onFinish: () => {},
    onError: (error: Error) => {
      console.error("Assistant transport error:", error);
    },
    onCancel: () => {},
  });

  const aui = useAui({
    tools: Tools({ toolkit }),
  });

  return (
    <AssistantRuntimeProvider aui={aui} runtime={runtime}>
      {children}
    </AssistantRuntimeProvider>
  );
}
