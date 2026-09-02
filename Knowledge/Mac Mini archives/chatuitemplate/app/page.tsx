"use client";

import { useState, useCallback } from "react";
import { Thread } from "@/components/assistant-ui/thread";
import { useAui, AuiProvider, Suggestions } from "@assistant-ui/react";
import { MyRuntimeProvider } from "./MyRuntimeProvider";
import { DashboardLayout, type ThreadItem } from "@/components/dashboard/dashboard-layout";
import { templateConfig } from "@/config/template";

const defaultThreads: ThreadItem[] = [
  {
    id: "1",
    title: "Capabilities overview",
    lastMessage: "Here's what I can help you with...",
    timestamp: "2m ago",
  },
];

function ThreadWithSuggestions() {
  const aui = useAui({
    suggestions: Suggestions(
      templateConfig.assistant.suggestions.map((s) => ({
        title: s.title,
        label: s.label,
        prompt: s.prompt,
      })),
    ),
  });

  return (
    <AuiProvider value={aui}>
      <Thread />
    </AuiProvider>
  );
}

export default function Home() {
  const [threads, setThreads] = useState<ThreadItem[]>(defaultThreads);
  const [counter, setCounter] = useState(defaultThreads.length + 1);

  const handleNewThread = useCallback(() => {
    const newId = String(counter);
    setThreads((prev) => [
      {
        id: newId,
        title: "New conversation",
      },
      ...prev,
    ]);
    setCounter((c) => c + 1);
  }, [counter]);

  return (
    <MyRuntimeProvider>
      <DashboardLayout threads={threads} onNewThread={handleNewThread}>
        <ThreadWithSuggestions />
      </DashboardLayout>
    </MyRuntimeProvider>
  );
}
