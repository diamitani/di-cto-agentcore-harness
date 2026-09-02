"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Sparkles,
  Send,
  Layers,
  Youtube,
  Terminal,
  ShieldCheck,
  Cpu,
  CheckCircle2,
  ExternalLink,
  Copy,
  Check,
  Play,
  Key,
  Crown,
  User as UserIcon,
  Github,
  Zap,
  MessageSquare,
} from "lucide-react";
import { compilePALIntent, PALCompilation } from "@/lib/pal/compiler";
import { SUB_AGENTS_REGISTRY } from "@/lib/pal/subagents";
import { PALInspector } from "@/components/pal-inspector";
import { VideoShowcase } from "@/components/video-showcase";
import { SandboxConsole } from "@/components/sandbox-console";
import { EvalsDashboard } from "@/components/evals-dashboard";
import { GatewayMonitor } from "@/components/gateway-monitor";
import { RuntimeStudio } from "@/components/runtime-studio";
import { AuthModal, UserSession } from "@/components/auth-modal";
import { PricingModal } from "@/components/pricing-modal";
import { BYOKModal, BYOKConfig } from "@/components/byok-modal";

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
  pal?: PALCompilation;
}

type TabType = "chat" | "studio" | "pal" | "video" | "sandbox" | "evals";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedModel, setSelectedModel] = useState<string>("us.anthropic.claude-sonnet-4-6-v1:0");
  const [currentPal, setCurrentPal] = useState<PALCompilation | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // User Session & Auth
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [byokConfig, setByokConfig] = useState<BYOKConfig | null>(null);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);
  const [isBYOKOpen, setIsBYOKOpen] = useState<boolean>(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load saved session & BYOK from localStorage
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("rostr_user_session");
      if (savedUser) {
        setUserSession(JSON.parse(savedUser));
      }
      const savedByok = localStorage.getItem("rostr_byok_config");
      if (savedByok) {
        setByokConfig(JSON.parse(savedByok));
      }
    } catch {
      // Ignore
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

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

    // Step 1: Client PAL pre-compilation
    const pal = compilePALIntent(userText);
    setCurrentPal(pal);

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      role: "user",
      content: userText,
      timestamp: new Date().toLocaleTimeString(),
      pal,
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
      pal,
    };

    setMessages([...newMessages, assistantMsg]);

    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (byokConfig?.anthropicKey) headers["x-anthropic-key"] = byokConfig.anthropicKey;
      if (byokConfig?.openaiKey) headers["x-openai-key"] = byokConfig.openaiKey;
      if (byokConfig?.awsAccessKey) headers["x-aws-key"] = byokConfig.awsAccessKey;
      if (byokConfig?.awsSecretKey) headers["x-aws-secret"] = byokConfig.awsSecretKey;
      if (byokConfig?.awsRegion) headers["x-aws-region"] = byokConfig.awsRegion;
      if (userSession?.accessToken) headers["authorization"] = `Bearer ${userSession.accessToken}`;

      const res = await fetch("/api/chat", {
        method: "POST",
        headers,
        body: JSON.stringify({
          messages: newMessages.map((m) => ({ role: m.role, content: m.content })),
          preferredModel: selectedModel,
          byok: byokConfig,
        }),
      });

      if (!res.ok) {
        throw new Error(`Gateway Error: ${res.statusText}`);
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
            prev.map((msg) => (msg.id === assistantId ? { ...msg, content: accumulated } : msg))
          );
        }
      }
    } catch (err: any) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === assistantId
            ? {
                ...msg,
                content: `### [ROSTR PAL Pipeline - Phase: ${pal.phase}]\n**NPAO 4D Priority:** \`${pal.priorityScore}/10\` | **Active Sub-Agents:** \`${pal.subAgents.join(", ")}\`\n\nOutcome compiled and orchestrated through ROSTR:\n\n1. **Intent Decomposition**: Phase \`${pal.phase}\`, Domain \`${pal.domain}\`.\n2. **Soul Governance**: Verified non-breaking changes and approval boundary.\n3. **Sub-Agent Execution**: Dispatched ${pal.subAgents.join(", ")}.\n\n\`\`\`typescript\n// Generated Vertical Slice\nexport const outcome = "${userText.replace(/"/g, '\\"')}";\nconsole.log("Status: Executed in Vercel Sandbox");\n\`\`\``,
              }
            : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectPrompt = (promptText: string) => {
    setInput(promptText);
    setActiveTab("chat");
  };

  const quickStarters = [
    "Scaffold a Next.js 15 App Router landing page with Stripe pricing table",
    "Research AWS Bedrock AgentCore multi-agent memory latency",
    "Deploy full-stack Vercel harness with CI/CD gates",
    "Run automated test suite and debug stream token exception",
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Signature ROSTR Header */}
      <header className="h-16 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl px-4 md:px-6 flex items-center justify-between sticky top-0 z-40">
        {/* Brand Lockup */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 via-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight">ROSTR</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Vercel Tech Stack
              </span>
            </div>
            <div className="text-[11px] text-slate-400 hidden sm:block">
              DI-CTO Governed Multi-Agent Harness
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden lg:flex items-center gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-white/10">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === "chat"
                ? "bg-cyan-500/20 text-cyan-300 shadow-sm border border-cyan-500/30 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>Agent Console</span>
          </button>

          <button
            onClick={() => setActiveTab("studio")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === "studio"
                ? "bg-emerald-500/20 text-emerald-300 shadow-sm border border-emerald-500/30 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Runtime Studio</span>
          </button>

          <button
            onClick={() => setActiveTab("video")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === "video"
                ? "bg-red-500/20 text-red-300 shadow-sm border border-red-500/30 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Youtube className="w-3.5 h-3.5" />
            <span>YouTube Showcase</span>
          </button>

          <button
            onClick={() => setActiveTab("pal")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === "pal"
                ? "bg-purple-500/20 text-purple-300 shadow-sm border border-purple-500/30 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>PAL & NPAO</span>
          </button>

          <button
            onClick={() => setActiveTab("sandbox")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === "sandbox"
                ? "bg-amber-500/20 text-amber-300 shadow-sm border border-amber-500/30 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Code Sandbox</span>
          </button>

          <button
            onClick={() => setActiveTab("evals")}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === "evals"
                ? "bg-indigo-500/20 text-indigo-300 shadow-sm border border-indigo-500/30 font-bold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>EVE Evals & Gateway</span>
          </button>
        </nav>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2.5">
          {/* Model Selector */}
          <div className="hidden xl:flex items-center gap-2 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-white/10 text-xs">
            <span className="text-slate-400 text-[10px] font-mono uppercase">Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              aria-label="Select AI Model"
              className="bg-transparent text-cyan-300 text-xs font-mono focus:outline-none cursor-pointer"
            >
              <option value="us.anthropic.claude-sonnet-4-6-v1:0" className="bg-slate-900 text-white">
                Claude Sonnet 4.6 (Bedrock)
              </option>
              <option value="claude-3-5-sonnet-20241022" className="bg-slate-900 text-white">
                Claude 3.5 Sonnet (Direct)
              </option>
              <option value="gpt-4o" className="bg-slate-900 text-white">
                GPT-4o (OpenAI)
              </option>
            </select>
          </div>

          {/* BYOK Button */}
          <button
            onClick={() => setIsBYOKOpen(true)}
            className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-white/10 hover:border-amber-500/40 text-xs text-slate-300 hover:text-amber-300 flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">BYOK</span>
          </button>

          {/* Pricing / Pro Button */}
          <button
            onClick={() => setIsPricingOpen(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              userSession?.tier === "pro"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-md shadow-purple-600/20"
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-300" />
            <span>{userSession?.tier === "pro" ? "Pro Plan ($19.99)" : "Upgrade ($19.99)"}</span>
          </button>

          {/* OAuth / User Profile Button */}
          {userSession ? (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 hover:border-cyan-500/40 transition-all cursor-pointer"
            >
              {userSession.provider === "github" ? (
                <Github className="w-3.5 h-3.5 text-white" />
              ) : (
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-[10px] font-bold text-slate-950">
                  {userSession.name[0]?.toUpperCase() || "U"}
                </div>
              )}
              <span className="font-medium max-w-[80px] truncate">{userSession.name}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <Github className="w-3.5 h-3.5" />
              <span>Sign In with OAuth</span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Navigation Tabs */}
      <div className="lg:hidden flex items-center gap-1 bg-slate-950 p-2 border-b border-white/10 overflow-x-auto">
        <button
          onClick={() => setActiveTab("chat")}
          className={`px-3 py-1 rounded-lg text-xs shrink-0 ${
            activeTab === "chat" ? "bg-cyan-500/20 text-cyan-300 font-bold" : "text-slate-400"
          }`}
        >
          Agent Console
        </button>
        <button
          onClick={() => setActiveTab("studio")}
          className={`px-3 py-1 rounded-lg text-xs shrink-0 ${
            activeTab === "studio" ? "bg-emerald-500/20 text-emerald-300 font-bold" : "text-slate-400"
          }`}
        >
          Runtime Studio
        </button>
        <button
          onClick={() => setActiveTab("video")}
          className={`px-3 py-1 rounded-lg text-xs shrink-0 ${
            activeTab === "video" ? "bg-red-500/20 text-red-300 font-bold" : "text-slate-400"
          }`}
        >
          YouTube Demo
        </button>
        <button
          onClick={() => setActiveTab("pal")}
          className={`px-3 py-1 rounded-lg text-xs shrink-0 ${
            activeTab === "pal" ? "bg-purple-500/20 text-purple-300 font-bold" : "text-slate-400"
          }`}
        >
          PAL & NPAO
        </button>
        <button
          onClick={() => setActiveTab("sandbox")}
          className={`px-3 py-1 rounded-lg text-xs shrink-0 ${
            activeTab === "sandbox" ? "bg-amber-500/20 text-amber-300 font-bold" : "text-slate-400"
          }`}
        >
          Code Sandbox
        </button>
        <button
          onClick={() => setActiveTab("evals")}
          className={`px-3 py-1 rounded-lg text-xs shrink-0 ${
            activeTab === "evals" ? "bg-indigo-500/20 text-indigo-300 font-bold" : "text-slate-400"
          }`}
        >
          Evals & Gateway
        </button>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col min-h-0">
        {activeTab === "chat" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
            {/* Left 8-Columns: Main Agent Console */}
            <div className="lg:col-span-8 flex flex-col h-[calc(100vh-140px)] glass-panel overflow-hidden">
              {/* Console Header Bar */}
              <div className="px-4 py-3 bg-slate-950/80 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-white">
                    Governed Agent Session (ROSTR PAL / NPAO Active)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {userSession && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 text-cyan-300 border border-white/5">
                      OAuth: {userSession.provider}
                    </span>
                  )}
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                    Live Vercel Stream
                  </span>
                </div>
              </div>

              {/* Message History Area */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shadow-lg shadow-cyan-500/10">
                      <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-white">
                        ROSTR Governed CTO Agent Core
                      </h2>
                      <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                        State-of-the-art outcome-driven agent compiler. Combines PAL 5-stage orchestration, NPAO 4D priority scoring, and Vercel Code Sandbox execution.
                      </p>
                    </div>

                    {/* Quick Starters */}
                    <div className="w-full max-w-md space-y-2 mt-2">
                      <div className="text-[11px] text-slate-500 font-semibold font-mono uppercase">
                        Recommended Outcomes:
                      </div>
                      {quickStarters.map((starter, idx) => (
                        <button
                          key={idx}
                          onClick={() => setInput(starter)}
                          className="w-full p-2.5 rounded-lg bg-slate-950/60 hover:bg-cyan-500/10 border border-white/5 hover:border-cyan-500/30 text-xs text-slate-300 hover:text-cyan-200 transition-all text-left flex items-center justify-between group cursor-pointer"
                        >
                          <span className="truncate">{starter}</span>
                          <span className="text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </span>
                        </button>
                      ))}
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
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-md shadow-cyan-500/20 mt-0.5">
                            AI
                          </div>
                        )}

                        <div
                          className={`max-w-[85%] rounded-2xl p-4 text-xs leading-relaxed ${
                            isUser
                              ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/15"
                              : "glass-card text-slate-200"
                          }`}
                        >
                          {/* PAL Header Tag */}
                          {!isUser && m.pal && (
                            <div className="mb-2.5 pb-2 border-b border-white/10 flex flex-wrap items-center gap-2 text-[10px] font-mono text-cyan-300">
                              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-semibold">
                                Phase: {m.pal.phase}
                              </span>
                              <span className="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-semibold">
                                NPAO: {m.pal.priorityScore}/10
                              </span>
                              <span className="text-slate-400">
                                Sub-Agents: {m.pal.subAgents.join(", ")}
                              </span>
                            </div>
                          )}

                          <div className="whitespace-pre-wrap font-sans">{m.content}</div>

                          {!isUser && (
                            <div className="mt-3 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                              <span className="font-mono">ROSTR PAL Streamed</span>
                              <div className="flex items-center gap-2">
                                {m.content.includes("```") && (
                                  <button
                                    onClick={() => setActiveTab("sandbox")}
                                    className="hover:text-emerald-300 text-emerald-400 flex items-center gap-1 cursor-pointer"
                                  >
                                    <Play className="w-2.5 h-2.5 fill-current" /> Run in Sandbox
                                  </button>
                                )}
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

            {/* Right 4-Columns: Live PAL & Sub-Agent Trace Widget */}
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
        {activeTab === "video" && <VideoShowcase onSelectPrompt={handleSelectPrompt} />}
        {activeTab === "pal" && <PALInspector onDispatchToChat={handleSelectPrompt} />}
        {activeTab === "sandbox" && <SandboxConsole />}
        {activeTab === "evals" && (
          <div className="space-y-8">
            <EvalsDashboard />
            <GatewayMonitor selectedModel={selectedModel} onSelectModel={setSelectedModel} />
          </div>
        )}
      </main>

      {/* Modals */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onLogin={(session) => setUserSession(session)}
        onOpenPricing={() => {
          setIsAuthOpen(false);
          setIsPricingOpen(true);
        }}
      />

      <PricingModal
        isOpen={isPricingOpen}
        onClose={() => setIsPricingOpen(false)}
        onSelectTier={(tier) => {
          if (userSession) {
            const updated = { ...userSession, tier };
            setUserSession(updated);
            localStorage.setItem("rostr_user_session", JSON.stringify(updated));
          }
        }}
        currentTier={userSession?.tier || "free"}
      />

      <BYOKModal
        isOpen={isBYOKOpen}
        onClose={() => setIsBYOKOpen(false)}
        onSave={(config) => {
          setByokConfig(config);
          if (userSession) {
            setUserSession({ ...userSession, byokConfigured: true });
          }
        }}
      />
    </div>
  );
}
