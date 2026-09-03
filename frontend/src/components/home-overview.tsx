"use client";

import React from "react";
import {
  Sparkles,
  ArrowRight,
  PlayCircle,
  Layers,
  Users,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Youtube,
  Cpu,
  Database,
  Sliders,
  Map,
  Activity,
  Zap,
} from "lucide-react";

interface HomeOverviewProps {
  onOpenAgent: (prompt?: string) => void;
  onNavigateTab: (tab: string) => void;
}

export function HomeOverview({ onOpenAgent, onNavigateTab }: HomeOverviewProps) {
  const platformChips = [
    { label: "5-Stage PAL Compiler", prompt: "Compile intent through PAL: Scaffold Next.js 15 App Router landing page with Stripe pricing." },
    { label: "NPAO 4D Priority Calculation", prompt: "Calculate NPAO 4D score for mission-critical production deployment gate." },
    { label: "RAG-DAL Episodic Memory", prompt: "Query episodic memory vector store in namespace 'rostr_decisions' for architecture rules." },
    { label: "9-Specialist Sub-Agent Dispatch", prompt: "Dispatch Product Architect and Application Engineer to design multi-agent workflow." },
    { label: "AWS Bedrock AgentCore Routing", prompt: "Route multi-agent task to AWS Bedrock Claude Sonnet 4.6 with low-latency streaming." },
    { label: "Vercel Code Sandbox", prompt: "Execute sandboxed TypeScript test suite and return execution traces." },
    { label: "EVE Evaluation Benchmark", prompt: "Run 10-benchmark EVE evaluation suite to verify deterministic governance compliance." },
  ];

  const pillars = [
    {
      icon: <Layers className="w-5 h-5 text-cyan-600" />,
      title: "1. PAL (Prompt Abstraction Layer)",
      desc: "Deterministic 5-stage compiler: Intent Decomposition, Soul Governance, NPAO Weighting, Approval Gate Check, and State Vector Write.",
      tag: "Deterministic Synthesis",
      tab: "pal",
    },
    {
      icon: <Database className="w-5 h-5 text-indigo-600" />,
      title: "2. RAG-DAL (Dynamic Acquisition)",
      desc: "Semantic episodic memory persistence across 'rostr_decisions' and 'rostr_learnings' with zero hallucination rate.",
      tag: "Memory Compounding",
      tab: "studio",
    },
    {
      icon: <Sliders className="w-5 h-5 text-purple-600" />,
      title: "3. NPAO (Dynamic 4D Scoring)",
      desc: "Mathematical prioritization: (Phase × 0.35) + (Dependency × 0.30) + (Business × 0.25) + (Resource × 0.10).",
      tag: "Prioritization Engine",
      tab: "pal",
    },
    {
      icon: <Users className="w-5 h-5 text-emerald-600" />,
      title: "4. 9 Specialist Sub-Agents",
      desc: "Orchestration across Product Architect, Application Engineer, JTBD Planner, Experience Engineer, and Security Reviewers.",
      tag: "Autonomous Roster",
      tab: "agency",
    },
  ];

  const quickNavCards = [
    {
      title: "Governed Agent Console",
      desc: "2-column streaming chat with live PAL compilation telemetry & sub-agent trace.",
      icon: <Zap className="w-5 h-5 text-amber-500" />,
      tab: "chat",
      color: "border-amber-200 hover:border-amber-400 bg-amber-50/20",
    },
    {
      title: "9 Specialist AI Managers",
      desc: "Autonomous roster covering Product, Engineering, Music Legal/Royalty, Tour, and GTM.",
      icon: <Users className="w-5 h-5 text-purple-600" />,
      tab: "agency",
      color: "border-purple-200 hover:border-purple-400 bg-purple-50/20",
    },
    {
      title: "5-Stage Runtime Studio",
      desc: "Live interactive execution pipeline & episodic vector memory query inspector.",
      icon: <Cpu className="w-5 h-5 text-emerald-600" />,
      tab: "studio",
      color: "border-emerald-200 hover:border-emerald-400 bg-emerald-50/20",
    },
    {
      title: "Code Sandbox & EVE Evals",
      desc: "Browser-isolated JS/TS/Python runtime with 10 automated test suites.",
      icon: <Terminal className="w-5 h-5 text-indigo-600" />,
      tab: "sandbox",
      color: "border-indigo-200 hover:border-indigo-400 bg-indigo-50/20",
    },
  ];

  const keyInnovations = [
    {
      title: "Zero Phase Drift",
      desc: "Guarantees tasks stay within PreD, Design, Development, or Deployment phases without scope creep.",
    },
    {
      title: "Soul Governance Boundaries",
      desc: "Immutable operating principles preventing unauthorized production pushes, secret exposures, or breaking changes.",
    },
    {
      title: "Vercel AI SDK Core Substrate",
      desc: "Native Next.js 15 App Router streaming, tool invocations, and multi-model gateway load balancing.",
    },
    {
      title: "Sandboxed Vertical Slices",
      desc: "Isolates execution of AI-generated TypeScript, Node.js, and Python code before state commit.",
    },
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-4 space-y-5">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span>ROSTR AI Agent Platform • Diamitani Industries</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
          Your Models,{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600">
            Your Rules.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Production multi-agent engineering harness. Powered by the <strong>PAL Prompt Abstraction Layer</strong>, <strong>NPAO 4D scoring</strong>, persistent episodic memory, and Vercel AI Gateway.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
          <button
            onClick={() => onOpenAgent()}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold text-sm shadow-md shadow-cyan-600/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <span>Launch Agent Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigateTab("agency")}
            className="px-6 py-3 rounded-xl bg-white hover:bg-purple-50 border border-slate-200 hover:border-purple-300 text-slate-700 hover:text-purple-700 font-semibold text-sm shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <Users className="w-4 h-4 text-purple-600" />
            <span>9 Specialist AI Managers</span>
          </button>

          <button
            onClick={() => onNavigateTab("pal")}
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <PlayCircle className="w-4 h-4 text-cyan-600" />
            <span>PAL Architecture</span>
          </button>
        </div>
      </section>

      {/* Quick Nav IA Grid */}
      <section className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickNavCards.map((card, idx) => (
          <div
            key={idx}
            onClick={() => onNavigateTab(card.tab)}
            className={`p-4 rounded-xl bg-white border ${card.color} shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group`}
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="p-2 rounded-lg bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
                  {card.icon}
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
              </div>
              <h4 className="text-xs font-bold text-slate-900 mb-1">{card.title}</h4>
              <p className="text-[11px] text-slate-600 leading-relaxed">{card.desc}</p>
            </div>
            <div className="pt-2 mt-2 border-t border-slate-100 text-[10px] font-mono text-cyan-700 font-semibold">
              Explore Module →
            </div>
          </div>
        ))}
      </section>

      {/* Featured Hardware Video Showcase Frame */}
      <section className="max-w-5xl mx-auto">
        <div className="relative rounded-2xl bg-white border border-slate-200 shadow-xl overflow-hidden">
          {/* Hardware Header Bar */}
          <div className="px-4 py-3 bg-slate-100/90 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-slate-700 ml-2">
                ROSTR Agent Demo — Architecture & PAL Protocol • Patrick Diamitani
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-cyan-700 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full font-medium">
              <Sparkles className="w-3 h-3 text-cyan-600" />
              <span>Official Video Walkthrough</span>
            </div>
          </div>

          {/* YouTube Responsive Embed */}
          <div className="relative w-full aspect-video bg-black">
            <iframe
              src="https://www.youtube-nocookie.com/embed/vKGtIY-MR8Y?rel=0&modestbranding=1"
              title="ROSTR Agent Demo — Architecture & PAL Protocol by Patrick Diamitani"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>

          {/* Platform Clickable Chips */}
          <div className="p-4 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider mr-1">
              Test Video Workflows:
            </span>
            {platformChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => onOpenAgent(chip.prompt)}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-cyan-50 border border-slate-200 hover:border-cyan-300 text-xs text-slate-700 hover:text-cyan-700 transition-all font-medium flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                <span>{chip.label}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Metric Proof Bar */}
      <section className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-2xl font-bold text-slate-900 font-mono">5-Stage</div>
          <div className="text-xs text-slate-500 mt-0.5">PAL Compiler</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-2xl font-bold text-cyan-600 font-mono">9</div>
          <div className="text-xs text-slate-500 mt-0.5">Specialist Sub-Agents</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-2xl font-bold text-emerald-600 font-mono">10 / 10</div>
          <div className="text-xs text-slate-500 mt-0.5">EVE Evals Passed</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-2xl font-bold text-purple-600 font-mono">0%</div>
          <div className="text-xs text-slate-500 mt-0.5">Phase Drift Rate</div>
        </div>
      </section>

      {/* 4 Core Pillars Section */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            The 4 Architectural Pillars of ROSTR
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Engineered to replace fragile prompt chains with deterministic state machines and mathematical task allocation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              onClick={() => onNavigateTab(pillar.tab)}
              className="p-6 rounded-2xl bg-white border border-slate-200/80 hover:border-cyan-300 shadow-xs hover:shadow-md transition-all space-y-3 cursor-pointer group"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center group-hover:scale-105 transition-transform">
                  {pillar.icon}
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 font-bold border border-cyan-200">
                  {pillar.tag}
                </span>
              </div>
              <h3 className="text-base font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                {pillar.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Key Innovations Grid */}
      <section className="max-w-5xl mx-auto p-6 rounded-2xl bg-slate-100/70 border border-slate-200 space-y-6">
        <div className="text-center space-y-1">
          <h3 className="text-lg font-bold text-slate-900">Why CTOs & Developers Choose ROSTR</h3>
          <p className="text-xs text-slate-500">Autonomous execution governed by strict approval boundaries.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {keyInnovations.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200/80 space-y-1.5 shadow-2xs">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                <span>{item.title}</span>
              </div>
              <p className="text-[11px] text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
