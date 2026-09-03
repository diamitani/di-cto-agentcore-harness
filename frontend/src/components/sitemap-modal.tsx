"use client";

import React, { useState } from "react";
import {
  X,
  Search,
  Map,
  Home as HomeIcon,
  MessageSquare,
  Cpu,
  Youtube,
  Layers,
  Terminal,
  ShieldCheck,
  Activity,
  Users,
  Key,
  Crown,
  Lock,
  ArrowRight,
  ExternalLink,
  Sparkles,
  Database,
  Sliders,
  CheckCircle2,
} from "lucide-react";
import { NavTab } from "./navigation-header";

interface SitemapModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (tab: NavTab) => void;
  onOpenAuth: () => void;
  onOpenPricing: () => void;
  onOpenBYOK: () => void;
}

interface SitemapItem {
  id: string;
  title: string;
  desc: string;
  category: "Platform & Agency" | "Agent Core & Runtime" | "Developer Tools & Evals" | "Security & Access";
  tab?: NavTab;
  action?: "auth" | "pricing" | "byok";
  icon: React.ReactNode;
  tags: string[];
  badge?: string;
}

export function SitemapModal({
  isOpen,
  onClose,
  onNavigate,
  onOpenAuth,
  onOpenPricing,
  onOpenBYOK,
}: SitemapModalProps) {
  const [searchQuery, setSearchQuery] = useState("");

  if (!isOpen) return null;

  const sitemapItems: SitemapItem[] = [
    // 1. Platform & Agency
    {
      id: "home",
      title: "Platform Overview",
      desc: "Hero landing, 4 architectural pillars (PAL, RAG-DAL, NPAO, 9 Sub-agents), proof metrics, and quick starters.",
      category: "Platform & Agency",
      tab: "home",
      icon: <HomeIcon className="w-4 h-4 text-cyan-600" />,
      tags: ["Landing", "Pillars", "Architecture", "Metrics", "Overview"],
      badge: "Core",
    },
    {
      id: "agency",
      title: "9 Specialist AI Managers",
      desc: "Day-to-Day Manager, Legal/Royalty Specialist, Tour Booking, GTM Strategist, Executive Producer, and Runtime Engineers.",
      category: "Platform & Agency",
      tab: "agency",
      icon: <Users className="w-4 h-4 text-purple-600" />,
      tags: ["Agency", "Sub-Agents", "Managers", "Roster", "Direct Chat"],
      badge: "9 Specialists",
    },
    {
      id: "video",
      title: "Patrick Diamitani Demo Video",
      desc: "Full YouTube video theater breakdown featuring architecture walkthrough, chapter bookmarks, and prompt triggers.",
      category: "Platform & Agency",
      tab: "video",
      icon: <Youtube className="w-4 h-4 text-red-600" />,
      tags: ["Demo", "YouTube", "Video", "Patrick Diamitani", "Walkthrough"],
      badge: "HD Video",
    },

    // 2. Agent Core & Runtime
    {
      id: "chat",
      title: "Governed Agent Console",
      desc: "2-column streaming chat interface with real-time PAL compiler state, sub-agent telemetry, and approval boundary gates.",
      category: "Agent Core & Runtime",
      tab: "chat",
      icon: <MessageSquare className="w-4 h-4 text-indigo-600" />,
      tags: ["Console", "Streaming", "Live Chat", "PAL Trace", "Sub-Agents"],
      badge: "Live Stream",
    },
    {
      id: "studio",
      title: "Runtime Studio",
      desc: "5-stage interactive execution pipeline (Intent, Soul Gate, Dispatch, Sandbox, Verify) & episodic vector memory inspector.",
      category: "Agent Core & Runtime",
      tab: "studio",
      icon: <Cpu className="w-4 h-4 text-emerald-600" />,
      tags: ["Studio", "5-Stage Stepper", "Vectors", "Episodic Memory", "Execution"],
      badge: "Interactive",
    },
    {
      id: "pal",
      title: "PAL & NPAO Protocol",
      desc: "Deterministic Prompt Abstraction Layer compiler rules and interactive 4-dimensional priority formula calculator.",
      category: "Agent Core & Runtime",
      tab: "pal",
      icon: <Layers className="w-4 h-4 text-purple-600" />,
      tags: ["PAL", "NPAO", "Compiler", "4D Scoring", "Soul Governance"],
      badge: "Protocol",
    },

    // 3. Developer Tools & Evals
    {
      id: "sandbox",
      title: "Code Sandbox Console",
      desc: "Browser-isolated execution runtime supporting JavaScript, TypeScript, and Python code snippets with real-time output.",
      category: "Developer Tools & Evals",
      tab: "sandbox",
      icon: <Terminal className="w-4 h-4 text-amber-600" />,
      tags: ["Sandbox", "JavaScript", "TypeScript", "Python", "Console", "Execution"],
      badge: "Runtime",
    },
    {
      id: "evals",
      title: "EVE Benchmark Evaluations",
      desc: "10 automated evaluation suites measuring reasoning, accuracy, tool calling, latency, and token efficiency.",
      category: "Developer Tools & Evals",
      tab: "evals",
      icon: <ShieldCheck className="w-4 h-4 text-indigo-600" />,
      tags: ["EVE", "Evals", "Benchmarks", "Test Suites", "Latency"],
      badge: "10 Suites",
    },
    {
      id: "gateway",
      title: "AI Gateway & Latency Monitor",
      desc: "Multi-provider telemetry, Bedrock/Anthropic/OpenAI routing metrics, token cache hit rates, and fallback chains.",
      category: "Developer Tools & Evals",
      tab: "gateway",
      icon: <Activity className="w-4 h-4 text-cyan-600" />,
      tags: ["Gateway", "Telemetry", "Latency", "Routing", "Bedrock", "Anthropic"],
      badge: "Telemetry",
    },

    // 4. Security & Access
    {
      id: "byok",
      title: "BYOK Key Vault",
      desc: "Client-side AES key encryption for Anthropic, OpenAI, and AWS Bedrock access/secret credentials.",
      category: "Security & Access",
      action: "byok",
      icon: <Key className="w-4 h-4 text-amber-500" />,
      tags: ["BYOK", "Vault", "API Keys", "Bedrock", "Anthropic", "OpenAI"],
      badge: "Client AES",
    },
    {
      id: "auth",
      title: "OAuth Authentication",
      desc: "Single sign-on via GitHub & Google with tier-based session persistence and role management.",
      category: "Security & Access",
      action: "auth",
      icon: <Lock className="w-4 h-4 text-slate-700" />,
      tags: ["OAuth", "GitHub", "Google", "Session", "Sign In"],
      badge: "OAuth 2.0",
    },
    {
      id: "pricing",
      title: "Pricing & Pro Plan ($19.99/mo)",
      desc: "Free Community Tier vs. Pro Developer Tier ($19.99/month) feature breakdown, limits, and Stripe upgrade.",
      category: "Security & Access",
      action: "pricing",
      icon: <Crown className="w-4 h-4 text-purple-600" />,
      tags: ["Pricing", "Free Tier", "Pro Tier", "Stripe", "Upgrade"],
      badge: "$19.99 / mo",
    },
  ];

  const filteredItems = sitemapItems.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.desc.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q) ||
      item.tags.some((t) => t.toLowerCase().includes(q))
    );
  });

  const categories: Array<"Platform & Agency" | "Agent Core & Runtime" | "Developer Tools & Evals" | "Security & Access"> = [
    "Platform & Agency",
    "Agent Core & Runtime",
    "Developer Tools & Evals",
    "Security & Access",
  ];

  const handleAction = (item: SitemapItem) => {
    onClose();
    if (item.tab) {
      onNavigate(item.tab);
    } else if (item.action === "byok") {
      onOpenBYOK();
    } else if (item.action === "auth") {
      onOpenAuth();
    } else if (item.action === "pricing") {
      onOpenPricing();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center text-indigo-600">
              <Map className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <span>ROSTR Platform Sitemap & Architecture Index</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200">
                  12 Modules
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Complete navigational directory of all platform features, runtime tools, and security controls.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-all cursor-pointer"
            aria-label="Close Sitemap"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="px-6 py-3 border-b border-slate-200 bg-white flex items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search sitemap by keyword, sub-agent, tool, or protocol (e.g. 'NPAO', 'Bedrock', 'Sandbox')..."
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              autoFocus
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-slate-500 hover:text-slate-800 font-medium cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        {/* Sitemap Grid Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/40">
          {categories.map((category) => {
            const items = filteredItems.filter((i) => i.category === category);
            if (items.length === 0) return null;

            return (
              <div key={category} className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-slate-900 font-mono uppercase tracking-wider flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-500" />
                    <span>{category}</span>
                  </h4>
                  <span className="text-[10px] text-slate-500 font-mono">
                    {items.length} {items.length === 1 ? "module" : "modules"}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleAction(item)}
                      className="p-3.5 rounded-xl bg-white border border-slate-200/80 hover:border-indigo-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group space-y-2.5"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <div className="p-1.5 rounded-lg bg-slate-50 border border-slate-100 group-hover:scale-105 transition-transform">
                              {item.icon}
                            </div>
                            <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                              {item.title}
                            </span>
                          </div>
                          {item.badge && (
                            <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 font-semibold">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-600 leading-relaxed line-clamp-2">
                          {item.desc}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px]">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.slice(0, 2).map((t, idx) => (
                            <span key={idx} className="font-mono text-slate-500 bg-slate-50 px-1 py-0.5 rounded">
                              #{t}
                            </span>
                          ))}
                        </div>
                        <span className="text-indigo-600 font-semibold group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                          <span>Open</span>
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {filteredItems.length === 0 && (
            <div className="py-12 text-center space-y-2">
              <div className="text-slate-400 text-sm">No sitemap modules match "{searchQuery}"</div>
              <button
                onClick={() => setSearchQuery("")}
                className="text-xs text-indigo-600 font-semibold hover:underline cursor-pointer"
              >
                Reset search filter
              </button>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 bg-white flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
            <span>ROSTR DI-CTO Governed Platform v2.4</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
