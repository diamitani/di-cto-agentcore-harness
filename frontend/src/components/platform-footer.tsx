"use client";

import React from "react";
import {
  Sparkles,
  Map,
  ShieldCheck,
  Zap,
  Github,
  Youtube,
  Key,
  Crown,
  Heart,
} from "lucide-react";
import { NavTab } from "./navigation-header";

interface PlatformFooterProps {
  onNavigate: (tab: NavTab) => void;
  onOpenSitemap: () => void;
  onOpenAuth: () => void;
  onOpenPricing: () => void;
  onOpenBYOK: () => void;
}

export function PlatformFooter({
  onNavigate,
  onOpenSitemap,
  onOpenAuth,
  onOpenPricing,
  onOpenBYOK,
}: PlatformFooterProps) {
  return (
    <footer className="border-t border-slate-200 bg-white text-slate-600 text-xs">
      {/* Top Footer Grid */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        {/* Col 1: Brand Lockup & System Status */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => onNavigate("home")}>
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-600 via-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-cyan-600/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-base font-extrabold text-slate-900 tracking-tight">ROSTR</span>
              <span className="text-[10px] font-mono ml-2 px-2 py-0.5 rounded-full bg-cyan-50 text-cyan-700 border border-cyan-200 font-semibold">
                v2.4 Core
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
            The DI-CTO Governed Multi-Agent Engineering Platform. Orchestrates complex software workflows with mathematical 4D NPAO scoring, PAL deterministic compilation, and episodic memory persistence.
          </p>

          {/* System Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-medium font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>9 Sub-Agents Online • Vercel AI Gateway Active</span>
          </div>
        </div>

        {/* Col 2: Platform & Agency */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold font-mono uppercase text-slate-900 tracking-wider">
            Platform & Agency
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onNavigate("home")}
                className="hover:text-cyan-700 transition-colors text-left cursor-pointer"
              >
                Platform Overview
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("agency")}
                className="hover:text-cyan-700 transition-colors text-left cursor-pointer"
              >
                9 Specialist AI Managers
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("video")}
                className="hover:text-cyan-700 transition-colors text-left cursor-pointer"
              >
                Patrick Diamitani Demo Video
              </button>
            </li>
            <li>
              <button
                onClick={onOpenSitemap}
                className="text-indigo-600 font-semibold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Map className="w-3 h-3" />
                <span>Full Platform Sitemap</span>
              </button>
            </li>
          </ul>
        </div>

        {/* Col 3: Agent Core & Runtime */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold font-mono uppercase text-slate-900 tracking-wider">
            Agent Core & Runtime
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onNavigate("chat")}
                className="hover:text-cyan-700 transition-colors text-left cursor-pointer"
              >
                Governed Agent Console
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("studio")}
                className="hover:text-cyan-700 transition-colors text-left cursor-pointer"
              >
                5-Stage Runtime Studio
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("pal")}
                className="hover:text-cyan-700 transition-colors text-left cursor-pointer"
              >
                PAL & NPAO Protocol
              </button>
            </li>
            <li>
              <span className="text-slate-400 cursor-not-allowed">
                RAG-DAL Episodic Memory
              </span>
            </li>
          </ul>
        </div>

        {/* Col 4: Dev Tools & Security */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold font-mono uppercase text-slate-900 tracking-wider">
            Dev Tools & Vault
          </h4>
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => onNavigate("sandbox")}
                className="hover:text-cyan-700 transition-colors text-left cursor-pointer"
              >
                Code Sandbox (JS/TS/Python)
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("evals")}
                className="hover:text-cyan-700 transition-colors text-left cursor-pointer"
              >
                EVE Benchmark Evals
              </button>
            </li>
            <li>
              <button
                onClick={() => onNavigate("gateway")}
                className="hover:text-cyan-700 transition-colors text-left cursor-pointer"
              >
                AI Gateway Telemetry
              </button>
            </li>
            <li>
              <button
                onClick={onOpenBYOK}
                className="hover:text-amber-700 text-amber-600 font-medium transition-colors text-left cursor-pointer flex items-center gap-1"
              >
                <Key className="w-3 h-3" />
                <span>BYOK Key Vault</span>
              </button>
            </li>
            <li>
              <button
                onClick={onOpenPricing}
                className="hover:text-purple-700 text-purple-600 font-medium transition-colors text-left cursor-pointer flex items-center gap-1"
              >
                <Crown className="w-3 h-3" />
                <span>Pro Plan ($19.99/mo)</span>
              </button>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-100 bg-slate-50/60 py-4 px-4 md:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-2">
            <span>© {new Date().getFullYear()} Diamitani Industries Inc. All rights reserved.</span>
            <span className="text-slate-300">•</span>
            <span className="text-slate-600 font-medium">ROSTR Agent Architecture</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={onOpenSitemap}
              className="text-slate-600 hover:text-indigo-600 font-medium transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Map className="w-3 h-3 text-indigo-500" />
              <span>Interactive Sitemap</span>
            </button>
            <button
              onClick={onOpenAuth}
              className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              OAuth Login
            </button>
            <button
              onClick={onOpenPricing}
              className="text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Pricing
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
