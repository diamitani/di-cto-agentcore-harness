"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Layers,
  Youtube,
  Terminal,
  ShieldCheck,
  Cpu,
  Key,
  Crown,
  User as UserIcon,
  Zap,
  ExternalLink,
  MessageSquare,
} from "lucide-react";
import { ClaudeCodeChat } from "@/components/claude-code-chat";
import { PALInspector } from "@/components/pal-inspector";
import { VideoShowcase } from "@/components/video-showcase";
import { SandboxConsole } from "@/components/sandbox-console";
import { EvalsDashboard } from "@/components/evals-dashboard";
import { GatewayMonitor } from "@/components/gateway-monitor";
import { RuntimeStudio } from "@/components/runtime-studio";
import { AuthModal, UserSession } from "@/components/auth-modal";
import { PricingModal } from "@/components/pricing-modal";
import { BYOKModal, BYOKConfig } from "@/components/byok-modal";

type TabType = "chat" | "studio" | "pal" | "video" | "sandbox" | "evals";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabType>("chat");
  const [selectedModel, setSelectedModel] = useState<string>("us.anthropic.claude-sonnet-4-6-v1:0");
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [byokConfig, setByokConfig] = useState<BYOKConfig | null>(null);

  // Modals
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isPricingOpen, setIsPricingOpen] = useState<boolean>(false);
  const [isBYOKOpen, setIsBYOKOpen] = useState<boolean>(false);

  // Load session & BYOK from localStorage
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

  const handleSelectPrompt = (promptText: string) => {
    setActiveTab("chat");
  };

  const handleOpenSandboxWithCode = (code: string, runtime: string) => {
    setActiveTab("sandbox");
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#07090e] text-slate-100 selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Top Navigation Bar */}
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
                Claude Code Edition
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
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

          {/* User Profile / Auth Button */}
          {userSession ? (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="flex items-center gap-2 p-1 pl-2 pr-3 rounded-xl bg-slate-900 border border-white/10 text-xs text-slate-200 hover:border-white/20 transition-all cursor-pointer"
            >
              <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-cyan-400 to-blue-500 flex items-center justify-center text-[10px] font-bold text-slate-950">
                {userSession.name[0]?.toUpperCase() || "U"}
              </div>
              <span className="font-medium max-w-[80px] truncate">{userSession.name}</span>
            </button>
          ) : (
            <button
              onClick={() => setIsAuthOpen(true)}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-medium text-slate-200 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <UserIcon className="w-3.5 h-3.5" />
              <span>Sign In / Sign Up</span>
            </button>
          )}
        </div>
      </header>

      {/* Mobile Tab Bar */}
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

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col min-h-0">
        {activeTab === "chat" && (
          <ClaudeCodeChat
            userSession={userSession}
            byokConfig={byokConfig}
            selectedModel={selectedModel}
            onOpenBYOK={() => setIsBYOKOpen(true)}
            onOpenPricing={() => setIsPricingOpen(true)}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenSandboxWithCode={handleOpenSandboxWithCode}
            onNavigateTab={(tab) => setActiveTab(tab as TabType)}
          />
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
