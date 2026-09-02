"use client";

import React from "react";
import {
  Sparkles,
  ArrowRight,
  PlayCircle,
  Layers,
  Users,
  FileText,
  DollarSign,
  Terminal,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Youtube,
  Cpu,
} from "lucide-react";

interface HomeOverviewProps {
  onOpenAgent: (prompt?: string) => void;
  onOpenAgency: () => void;
}

export function HomeOverview({ onOpenAgent, onOpenAgency }: HomeOverviewProps) {
  const platformChips = [
    { label: "Day-to-Day Manager", prompt: "Activate Day-to-Day Manager: Draft weekly release schedule and task priorities." },
    { label: "P.R.O. & Royalty Setup", prompt: "Set up ASCAP/BMI work registration metadata and split percentages." },
    { label: "Contract Generation", prompt: "Generate production master sync license and artist split sheet agreement." },
    { label: "Booking & Venues", prompt: "Draft tour booking inquiry email for regional music venues." },
    { label: "78K+ Contact Directory", prompt: "Query industry directory for indie music supervisors and playlist curators." },
    { label: "19 Academy Courses", prompt: "Summarize music business academy course on sync licensing and publishing." },
    { label: "Catalog & Split Sheets", prompt: "Create split sheet ledger with 50/50 songwriter and publisher splits." },
  ];

  const features = [
    {
      icon: <Users className="w-5 h-5 text-cyan-600" />,
      title: "9 AI Specialist Managers",
      desc: "Dedicated autonomous agents for artist management, legal contracts, marketing, release ops, and live bookings.",
    },
    {
      icon: <FileText className="w-5 h-5 text-indigo-600" />,
      title: "Automated Legal Contracts",
      desc: "Instant generation of work-for-hire, master sync licenses, split sheets, and non-disclosure agreements.",
    },
    {
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      title: "Royalty Collection Infrastructure",
      desc: "Streamlined metadata formatting for ASCAP, BMI, SoundExchange, and international collection societies.",
    },
    {
      icon: <Terminal className="w-5 h-5 text-amber-600" />,
      title: "Vercel Code & Prompt Sandbox",
      desc: "Run and evaluate agent scripts, automation workflows, and vertical slices in an isolated environment.",
    },
    {
      icon: <Cpu className="w-5 h-5 text-purple-600" />,
      title: "Multi-Model AI Gateway",
      desc: "Dynamic low-latency routing across Anthropic Claude 3.7/3.5, OpenAI GPT-4o, and AWS Bedrock AgentCore.",
    },
    {
      icon: <ShieldCheck className="w-5 h-5 text-rose-600" />,
      title: "Soul Governance & PAL Protocol",
      desc: "5-stage intent compilation, NPAO 4D priority weighting, and human-in-the-loop approval boundaries.",
    },
  ];

  return (
    <div className="space-y-12 animate-fade-in pb-12">
      {/* Hero Section */}
      <section className="text-center max-w-4xl mx-auto pt-6 space-y-6">
        {/* Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
          <span>The AI Music Business OS • ROSTR Platform</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.1]">
          Build your music business{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600">
            operating system.
          </span>
        </h1>

        {/* Hero Subtitle */}
        <p className="text-base md:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
          Artispreneur gives independent artists and developers an autonomous AI management team, 78,000+ verified industry contacts, legal contract automation, and royalty collection infrastructure. Keep 100% of what you create.
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
            onClick={onOpenAgency}
            className="px-6 py-3 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-semibold text-sm shadow-xs flex items-center gap-2 transition-all cursor-pointer"
          >
            <PlayCircle className="w-4 h-4 text-cyan-600" />
            <span>Meet the AI Agency</span>
          </button>
        </div>
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
                ROSTR & Artispreneur • Architecture & Unified Agent Demo • Patrick Diamitani
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-cyan-700 bg-cyan-50 border border-cyan-200 px-2.5 py-0.5 rounded-full font-medium">
              <Sparkles className="w-3 h-3 text-cyan-600" />
              <span>Official Video Showcase</span>
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
              Click to Run:
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

      {/* Trust & Proof Bar */}
      <section className="max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-2xl font-bold text-slate-900 font-mono">78,000+</div>
          <div className="text-xs text-slate-500 mt-0.5">Industry Contacts</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-2xl font-bold text-cyan-600 font-mono">9</div>
          <div className="text-xs text-slate-500 mt-0.5">Specialist Agents</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-2xl font-bold text-emerald-600 font-mono">100%</div>
          <div className="text-xs text-slate-500 mt-0.5">Rights Retained</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200/80 shadow-xs">
          <div className="text-2xl font-bold text-purple-600 font-mono">5-Stage</div>
          <div className="text-xs text-slate-500 mt-0.5">PAL Intent Pipeline</div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="max-w-5xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">
            Autonomous Music Business Infrastructure
          </h2>
          <p className="text-sm text-slate-600 max-w-xl mx-auto">
            Everything independent creators and founders need to manage catalogs, register royalties, negotiate deals, and execute high-converting marketing campaigns.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((feat, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-cyan-300 shadow-xs hover:shadow-md transition-all space-y-2.5"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center">
                {feat.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
