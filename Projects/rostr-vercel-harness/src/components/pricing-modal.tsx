"use client";

import React, { useState } from "react";
import {
  X,
  Check,
  Crown,
  Sparkles,
  Zap,
  Shield,
  Layers,
  Cpu,
  ArrowRight,
  CreditCard,
} from "lucide-react";

interface PricingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTier: (tier: "free" | "pro") => void;
  currentTier?: "free" | "pro";
}

export function PricingModal({ isOpen, onClose, onSelectTier, currentTier = "free" }: PricingModalProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("monthly");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleUpgradePro = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setSuccessMsg("Successfully upgraded to ROSTR Pro ($19.99/mo)!");
      onSelectTier("pro");
      setTimeout(() => {
        setSuccessMsg(null);
        onClose();
      }, 1500);
    }, 800);
  };

  const freeFeatures = [
    "50 PAL Intent Compilations / day",
    "Bring Your Own Key (BYOK: Anthropic, OpenAI, Bedrock)",
    "Vercel Code Sandbox (JS, TS, Python)",
    "10-Benchmark EVE Evaluation Suite",
    "Basic Sub-Agent Task Routing",
    "Community Support",
  ];

  const proFeatures = [
    "Unlimited PAL 5-Stage Intent Compilations",
    "All 9 Specialist Sub-Agents Full Autonomous Dispatch",
    "NPAO 4D Dynamic Priority Scoring Engine",
    "Persistent Episodic Memory Vectors (rostr_decisions)",
    "Multi-Model Vercel AI Gateway with Latency Optimization",
    "Unlimited Vercel Code Sandbox Executions",
    "Patrick Diamitani Architecture Blueprints & Video Presets",
    "Priority Vercel Edge Compute & Zero Queuing",
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl glass-panel border border-white/20 bg-slate-950/95 p-6 md:p-8 shadow-2xl text-slate-100 overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center max-w-lg mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>ROSTR HARNESS SUBSCRIPTION</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Win the Agent Harness Game
          </h2>
          <p className="text-xs md:text-sm text-slate-400">
            Governed multi-agent engineering by Diamitani Industries. Built with Vercel AI Gateway, Code Sandbox, and PAL/NPAO compilers.
          </p>

          {/* Billing Toggle */}
          <div className="pt-2 flex items-center justify-center gap-3 text-xs">
            <span className={billingCycle === "monthly" ? "text-white font-semibold" : "text-slate-400"}>
              Monthly
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
              className="w-12 h-6 rounded-full bg-slate-800 border border-white/20 p-0.5 transition-colors relative cursor-pointer"
            >
              <div
                className={`w-5 h-5 rounded-full bg-gradient-to-r from-cyan-400 to-purple-500 transition-transform ${
                  billingCycle === "annual" ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
            <span className={billingCycle === "annual" ? "text-white font-semibold" : "text-slate-400"}>
              Annual <span className="text-[10px] text-emerald-400 font-bold font-mono">(Save 20%)</span>
            </span>
          </div>
        </div>

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-semibold text-center flex items-center justify-center gap-2">
            <Check className="w-4 h-4" /> {successMsg}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Free Card */}
          <div className="rounded-2xl p-6 glass-card border border-white/10 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white">Free Community</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-white/10 text-slate-400">
                  Zero Config
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                For developers experimenting with outcome-driven agent prompting.
              </p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-white font-mono">$0</span>
                <span className="text-xs text-slate-500">/ month</span>
              </div>

              <div className="mt-5 space-y-2.5">
                {freeFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-300">
                    <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                onSelectTier("free");
                onClose();
              }}
              className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
            >
              {currentTier === "free" ? "Current Plan" : "Downgrade to Free"}
            </button>
          </div>

          {/* Pro Card */}
          <div className="rounded-2xl p-6 glass-card border-2 border-purple-500/50 bg-gradient-to-b from-purple-950/20 via-slate-900/40 to-slate-950/80 shadow-xl shadow-purple-500/10 flex flex-col justify-between space-y-4 relative overflow-hidden">
            {/* Ribbon */}
            <div className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-md">
              <Crown className="w-3 h-3 text-amber-300" />
              <span>POPULAR</span>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  <Crown className="w-4 h-4 text-amber-400" />
                  ROSTR Pro
                </h3>
              </div>
              <p className="text-xs text-slate-300 mt-1">
                For high-velocity CTOs & developers building production multi-agent systems.
              </p>

              <div className="mt-4 flex items-baseline gap-1">
                <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 font-mono">
                  {billingCycle === "annual" ? "$15.99" : "$19.99"}
                </span>
                <span className="text-xs text-slate-400">/ month</span>
                {billingCycle === "annual" && (
                  <span className="text-[10px] text-slate-500 ml-1">billed annually</span>
                )}
              </div>

              <div className="mt-5 space-y-2.5">
                {proFeatures.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs text-slate-200">
                    <Check className="w-3.5 h-3.5 text-purple-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleUpgradePro}
              disabled={isProcessing || currentTier === "pro"}
              className="w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Processing Upgrade...</span>
              ) : currentTier === "pro" ? (
                <span>Active Plan</span>
              ) : (
                <>
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Upgrade to Pro ($19.99/mo)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer Guarantee */}
        <div className="mt-6 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-400 gap-2">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-cyan-400" />
            <span>14-day money-back guarantee. Cancel anytime with 1 click.</span>
          </div>
          <div className="font-mono text-slate-500">
            Powered by Stripe & Vercel AI SDK
          </div>
        </div>
      </div>
    </div>
  );
}
