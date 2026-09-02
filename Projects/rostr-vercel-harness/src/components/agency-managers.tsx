"use client";

import React, { useState } from "react";
import {
  Users,
  Sparkles,
  ArrowRight,
  Bot,
  MessageSquare,
  ShieldCheck,
  CheckCircle2,
  FileText,
  DollarSign,
  TrendingUp,
  Cpu,
  Layers,
  Code,
  Music,
} from "lucide-react";
import { SUB_AGENTS_REGISTRY } from "@/lib/pal/subagents";
import { SKILLS_INVENTORY } from "@/lib/skills/registry";

interface AgencyManagersProps {
  onSelectAgent: (agentId: string, initialPrompt?: string) => void;
}

export function AgencyManagers({ onSelectAgent }: AgencyManagersProps) {
  const [selectedAgentId, setSelectedAgentId] = useState<string>("application-engineer");

  const agencySpecialists = [
    {
      id: "day-to-day-manager",
      name: "Day-to-Day Artist Manager",
      role: "Operations & Release Strategy",
      avatar: "👔",
      skills: ["Release Scheduling", "Task Prioritization", "Milestone Tracking", "Calendar Sync"],
      prompt: "Plan a 6-week single release timeline including pre-save campaigns, playlist pitching, and video drops.",
      desc: "Coordinates daily workflows, release roadmaps, and cross-functional deliverables for independent artists.",
    },
    {
      id: "legal-royalty-specialist",
      name: "Royalty & Legal Specialist",
      role: "Contracts & P.R.O. Infrastructure",
      avatar: "⚖️",
      skills: ["Split Sheets", "Master Sync Licensing", "ASCAP/BMI Registration", "Work-for-Hire"],
      prompt: "Draft a 50/50 producer split sheet agreement and calculate publishing shares for SoundExchange and ASCAP.",
      desc: "Automates music contracts, copyright filings, split sheet accounting, and royalty tracking.",
    },
    {
      id: "booking-tour-agent",
      name: "Live Tour & Booking Agent",
      role: "Venues & Performance Deals",
      avatar: "🎤",
      skills: ["Venue Outreach", "Deal Negotiation", "Performance Riders", "Routing Optimization"],
      prompt: "Draft a high-conversion booking inquiry to regional 500-cap music venues for an upcoming tour.",
      desc: "Sources venues, structures performance guarantees, and automates talent buyer outreach.",
    },
    {
      id: "gtm-marketing-strategist",
      name: "GTM & Email Marketing Strategist",
      role: "Audience Growth & Funnels",
      avatar: "📈",
      skills: ["Email Sequences", "Social Video Hooks", "CRM Deduplication", "Fan Club Funnels"],
      prompt: "Construct a 4-part email marketing nurture sequence for fan engagement and VIP merch sales.",
      desc: "Builds automated fan conversion funnels, newsletter campaigns, and short-form video hooks.",
    },
    {
      id: "executive-producer",
      name: "Executive Music Producer",
      role: "Creative Direction & Mix QA",
      avatar: "🎧",
      skills: ["Sonic Direction", "Session Coordination", "Mastering QA", "Stem Organization"],
      prompt: "Create a mix review checklist and creative brief for a modern pop/hip-hop crossover record.",
      desc: "Oversees creative vision, track arrangement feedback, mixing revisions, and master deliveries.",
    },
    {
      id: "agent-runtime-engineer",
      name: "Agent Runtime & Tool Engineer",
      role: "Vercel AI SDK & Tool Adapters",
      avatar: "⚡",
      skills: ["Vercel AI SDK Core", "Tool Adapters", "Code Sandbox", "Bedrock Routing"],
      prompt: "Synthesize a Vercel AI SDK streamText handler with streaming tool execution and sandbox evaluation.",
      desc: "Builds and optimizes the multi-agent runtime, LLM gateway connections, and sandboxed code execution.",
    },
    {
      id: "product-architect",
      name: "Product & Platform Architect",
      role: "PAL Compiler & NPAO Scoring",
      avatar: "📐",
      skills: ["PAL 5-Stage Protocol", "NPAO 4D Formulas", "System Architecture", "Episodic Vectors"],
      prompt: "Deconstruct product requirements into PAL intent stages and NPAO priority scores.",
      desc: "Maintains system blueprints, intent compiler rules, and episodic memory persistence.",
    },
    {
      id: "devops-release-engineer",
      name: "DevOps & Release Engineer",
      role: "CI/CD & Cloud Infrastructure",
      avatar: "🚀",
      skills: ["Vercel CI/CD", "AWS Bedrock", "Docker Deployments", "Zero-Downtime Rollouts"],
      prompt: "Verify Next.js build health, deploy release to Vercel production, and audit environment secrets.",
      desc: "Ensures automated builds, zero-downtime deployments, and edge infrastructure reliability.",
    },
    {
      id: "security-reviewer",
      name: "Security & Rights Auditor",
      role: "Access Gates & Zero Trust",
      avatar: "🛡️",
      skills: ["Approval Boundaries", "Secret Encryption", "Audit Logs", "BYOK Key Vault"],
      prompt: "Audit active session approval gates, credential exposure boundaries, and sandbox memory limits.",
      desc: "Guards approval boundaries, API key encryption, and autonomous execution safety.",
    },
  ];

  const activeAgent = agencySpecialists.find((a) => a.id === selectedAgentId) || agencySpecialists[0];

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 text-xs font-semibold">
          <Users className="w-3.5 h-3.5 text-cyan-600" />
          <span>AUTONOMOUS AGENCY ROSTER</span>
        </div>
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          9 Specialist AI Managers
        </h2>
        <p className="text-sm text-slate-600">
          Select any specialist manager to inspect their core skills, active system directives, or chat with them directly in the Agent Console.
        </p>
      </div>

      {/* Grid: Specialists List + Active Specialist Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-6xl mx-auto">
        {/* Left 5-Cols: Specialist Cards List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
          {agencySpecialists.map((agent) => {
            const isSelected = agent.id === selectedAgentId;
            return (
              <button
                key={agent.id}
                onClick={() => setSelectedAgentId(agent.id)}
                className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer flex items-start gap-3.5 ${
                  isSelected
                    ? "bg-white border-cyan-500 shadow-md ring-1 ring-cyan-500/20"
                    : "bg-white/80 border-slate-200 hover:border-slate-300 hover:bg-white shadow-2xs"
                }`}
              >
                <div className="text-2xl p-2 rounded-xl bg-slate-50 border border-slate-100 shrink-0">
                  {agent.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-bold text-slate-900 truncate">{agent.name}</h4>
                    {isSelected && (
                      <span className="text-[10px] font-semibold text-cyan-600 bg-cyan-50 px-2 py-0.5 rounded-full">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{agent.role}</p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {agent.skills.slice(0, 2).map((sk, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600"
                      >
                        {sk}
                      </span>
                    ))}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right 7-Cols: Active Specialist Detailed Inspector */}
        <div className="lg:col-span-7 rounded-2xl bg-white border border-slate-200 p-6 shadow-md flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="text-3xl p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                  {activeAgent.avatar}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{activeAgent.name}</h3>
                  <p className="text-xs font-medium text-cyan-600">{activeAgent.role}</p>
                </div>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-medium">
                ● Live & Ready
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">{activeAgent.desc}</p>

            {/* Core Capabilities */}
            <div className="space-y-2 pt-2">
              <span className="text-xs font-bold text-slate-900 uppercase font-mono tracking-wider">
                Specialist Skill Bindings:
              </span>
              <div className="grid grid-cols-2 gap-2">
                {activeAgent.skills.map((skill, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-xs font-medium text-slate-700 flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                    <span>{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Starter Prompt Box */}
            <div className="p-3.5 rounded-xl bg-cyan-50/60 border border-cyan-100 space-y-1.5">
              <span className="text-[11px] font-bold text-cyan-900 block font-mono">
                Suggested Outcome Prompt:
              </span>
              <p className="text-xs text-cyan-800 italic">"{activeAgent.prompt}"</p>
            </div>
          </div>

          {/* Action Trigger */}
          <button
            onClick={() => onSelectAgent(activeAgent.id, activeAgent.prompt)}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white font-semibold text-xs shadow-md shadow-cyan-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <MessageSquare className="w-4 h-4" />
            <span>Engage {activeAgent.name} in Console</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
