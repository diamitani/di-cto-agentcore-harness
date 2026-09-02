"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Layers,
  Youtube,
  Terminal,
  ShieldCheck,
  Send,
  Cpu,
  RefreshCw,
  Copy,
  Check,
  ChevronRight,
  Zap,
  Activity,
  CheckCircle2,
  Clock,
  ExternalLink,
  MessageSquare,
  Wrench,
} from "lucide-react";
import { PALInspector } from "@/components/pal-inspector";
import { VideoShowcase } from "@/components/video-showcase";
import { SandboxConsole } from "@/components/sandbox-console";
import { EvalsDashboard } from "@/components/evals-dashboard";
import { GatewayMonitor } from "@/components/gateway-monitor";
import { RuntimeStudio } from "@/components/runtime-studio";
import { compilePALIntent, PALCompilation } from "@/lib/pal/compiler";
import { SUB_AGENTS_REGISTRY } from "@/lib/pal/subagents";

type TabType = "chat" | "pal" | "studio" | "video" | "sandbox" | "evals";

interface ChatMessage {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  timestamp?: string;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [selectedModel, setSelectedModel] = useState<string>("us.anthropic.claude-sonnet-4-6-v1:0");
  const [currentPal, setCurrentPal] = useState<PALCompilation | null>(null);
  const [input, setInput] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Keep PAL inspector synchronized with user input
  useEffect(() => {
    if (input && input.trim().length > 3) {
      setCurrentPal(compilePALIntent(input));
    }
  }, [input]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const handleSelectPrompt = (promptText: string) => {
    setInput(promptText);
    setCurrentPal(compilePALIntent(promptText));
    setActiveTab("chat");
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput("");

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString(),
    };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setIsLoading(true);

    const assistantId = `msg-${Date.now()}-assistant`;
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages([...newMessages, assistantMsg]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          preferredModel: selectedModel,
        }),
      });

      if (!res.ok) {
        throw new Error(`Chat API error: ${res.statusText}`);
      }

      if (res.body) {
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;

          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantId ? { ...msg, content: accumulated } : msg
            )
          );
        }
      }
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: `Error streaming response: ${err?.message || "Internal error"}`,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "Scaffold a Next.js 15 landing page with pricing table",
    "Research Bedrock AgentCore memory latency",
    "Deploy production release to Vercel",
    "Fix stream token exception in chat route",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100">
      {/* Header */}
      <header className="h-16 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-6 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">ROSTR</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Vercel Harness v1.0
              </span>
            </div>
            <div className="text-[11px] text-slate-400">DI-CTO Governed Multi-Agent System</div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/10 overflow-x-auto max-w-full">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === "chat"
                ? "bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Agent Console</span>
          </button>

          <button
            onClick={() => setActiveTab("studio")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === "studio"
                ? "bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Runtime Studio</span>
          </button>

          <button
            onClick={() => setActiveTab("pal")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === "pal"
                ? "bg-purple-500/20 text-purple-300 shadow-sm border border-purple-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>PAL & NPAO</span>
          </button>

          <button
            onClick={() => setActiveTab("video")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === "video"
                ? "bg-red-500/20 text-red-300 shadow-sm border border-red-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube Showcase</span>
          </button>

          <button
            onClick={() => setActiveTab("sandbox")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === "sandbox"
                ? "bg-amber-500/20 text-amber-300 shadow-sm border border-amber-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Code Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab("evals")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              activeTab === "evals"
                ? "bg-indigo-500/20 text-indigo-300 shadow-sm border border-indigo-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>EVE Evals & Gateway</span>
          </button>
        </nav>

        {/* Model Indicator */}
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-lg bg-slate-900 border border-white/10 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Model:</span>
            <span className="font-mono text-cyan-300">Claude Sonnet 4.6 (Bedrock)</span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 flex flex-col min-h-0">
        {activeTab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
            {/* Left Column: Chat Console */}
            <div className="lg:col-span-8 flex flex-col glass-panel overflow-hidden h-[calc(100vh-140px)]">
              {/* Chat Header */}
              <div className="p-4 bg-slate-950/60 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                  <span className="text-xs font-semibold text-slate-200">
                    Live Vercel AI SDK Streaming Stream
                  </span>
                </div>
                <div className="text-[11px] font-mono text-slate-400">
                  {messages.length} Messages in Session
                </div>
              </div>

              {/* Chat Thread */}
              <div className="flex-1 p-5 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                      <Sparkles className="w-7 h-7" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white">ROSTR Governed CTO Agent</h3>
                      <p className="text-xs text-slate-400 mt-1 max-w-md">
                        Processes your outcome through PAL 5-stage intent compilation, NPAO 4D priority scoring, and specialized sub-agent dispatch.
                      </p>
                    </div>

                    <div className="w-full max-w-lg space-y-2 mt-4">
                      <div className="text-[11px] text-slate-500 font-medium">Quick Starters:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                        {quickPrompts.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleSelectPrompt(q)}
                            className="p-2.5 rounded-lg bg-slate-900/60 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 text-xs text-slate-300 hover:text-cyan-200 transition-all text-left"
                          >
                            {q}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  messages.map((m) => {
                    const isUser = m.role === "user";
                    return (
                      <div
                        key={m.id}
                        className={`flex gap-3 ${isUser ? "justify-end" : "justify-start"}`}
                      >
                        {!isUser && (
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
                            CTO
                          </div>
                        )}

                        <div
                          className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                            isUser
                              ? "bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm"
                              : "bg-slate-900/80 border border-white/10 text-slate-200 rounded-tl-sm"
                          }`}
                        >
                          <div className="whitespace-pre-wrap font-sans">{m.content}</div>

                          {!isUser && (
                            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                              <span className="font-mono">ROSTR PAL Streamed</span>
                              <button
                                onClick={() => handleCopy(m.content, m.id)}
                                className="hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                              >
                                {copiedId === m.id ? (
                                   <>
                                    <Check className="w-3 h-3 text-emerald-400" /> Copied
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3" /> Copy
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>

                        {isUser && (
                          <div className="w-7 h-7 rounded-lg bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 text-xs font-bold shrink-0 mt-0.5">
                            You
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
                {isLoading && (
                  <div className="flex items-center gap-2 text-xs text-cyan-400 font-mono">
                    <div className="w-3.5 h-3.5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                    <span>Compiling PAL Intent & Streaming response...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Chat Input Bar */}
              <form onSubmit={handleSendMessage} className="p-3 bg-slate-950/80 border-t border-white/10">
                <div className="relative flex items-center">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter outcome-driven task (e.g. 'Build pricing page with Stripe')..."
                    className="w-full glass-input rounded-xl pl-4 pr-24 py-3 text-xs focus:ring-1 focus:ring-cyan-500"
                  />
                  <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="absolute right-1.5 px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-all shadow-md shadow-cyan-600/20 disabled:opacity-40 cursor-pointer flex items-center gap-1.5"
                  >
                    <span>Send</span>
                    <Send className="w-3 h-3" />
                  </button>
                </div>
              </form>
            </div>

            {/* Right Column: Live PAL & Sub-Agent Trace Widget */}
            <div className="lg:col-span-4 space-y-4 flex flex-col h-[calc(100vh-140px)] overflow-y-auto">
              {/* Active PAL Compilation Widget */}
              <div className="glass-panel p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-white">Live PAL Compiler State</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300">
                    Phase: {currentPal?.phase || "Development"}
                  </span>
                </div>

                <div className="space-y-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                    <div className="text-[10px] text-slate-500 uppercase">NPAO Priority</div>
                    <div className="text-lg font-bold text-cyan-400 font-mono">
                      {currentPal?.priorityScore || 6.75}{" "}
                      <span className="text-xs font-normal text-slate-500">/ 10</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                    <div className="text-[10px] text-slate-500 uppercase mb-1">Dispatched Sub-Agents</div>
                    <div className="flex flex-wrap gap-1">
                      {(currentPal?.subAgents || ["application-engineer", "quality-engineer"]).map(
                        (sa) => (
                          <span
                            key={sa}
                            className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300"
                          >
                            {sa}
                          </span>
                        )
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-white/5">
                    <div className="text-[10px] text-slate-500 uppercase mb-1">Approval Boundary</div>
                    <span className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      {currentPal?.approvalGates.length
                        ? currentPal.approvalGates.join(", ")
                        : "No blocking approval gates required"}
                    </span>
                  </div>
                </div>
              </div>

              {/* YouTube Showcase Mini-Card */}
              <div
                onClick={() => setActiveTab("video")}
                className="glass-panel p-4 hover:border-red-500/30 transition-all cursor-pointer group"
              >
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-white group-hover:text-red-300 flex items-center gap-1.5">
                    <Youtube className="w-3.5 h-3.5 text-red-500" />
                    Patrick Diamitani Demo Video
                  </span>
                  <ExternalLink className="w-3 h-3 text-slate-500 group-hover:text-red-400" />
                </div>
                <p className="text-[11px] text-slate-400 line-clamp-2">
                  Watch Patrick Diamitani demonstrate the ROSTR framework, PAL compiler, and Bedrock AgentCore.
                </p>
              </div>

              {/* Sub-Agents Quick Status */}
              <div className="glass-panel p-4 flex-1">
                <div className="text-xs font-semibold text-white mb-2 flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-purple-400" />
                  Specialist Sub-Agents Registry (9)
                </div>
                <div className="space-y-1.5 max-h-[180px] overflow-y-auto pr-1">
                  {SUB_AGENTS_REGISTRY.map((agent) => (
                    <div
                      key={agent.id}
                      className="p-2 rounded bg-slate-950/40 border border-white/5 flex items-center justify-between text-[11px]"
                    >
                      <span className="text-slate-200 font-medium">{agent.name}</span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {agent.phases.join(", ")}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "studio" && <RuntimeStudio />}
        {activeTab === "pal" && <PALInspector onDispatchToChat={handleSelectPrompt} />}
        {activeTab === "video" && <VideoShowcase onSelectPrompt={handleSelectPrompt} />}
        {activeTab === "sandbox" && <SandboxConsole />}
        {activeTab === "evals" && (
          <div className="space-y-8">
            <EvalsDashboard />
            <GatewayMonitor selectedModel={selectedModel} onSelectModel={setSelectedModel} />
          </div>
        )}
      </main>
    </div>
  );
}
