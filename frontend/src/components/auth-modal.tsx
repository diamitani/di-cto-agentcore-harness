"use client";

import React, { useState } from "react";
import {
  X,
  Lock,
  Mail,
  User,
  Github,
  CheckCircle2,
  Sparkles,
  Shield,
  Zap,
  Crown,
} from "lucide-react";

export interface UserSession {
  email: string;
  name: string;
  tier: "free" | "pro";
  avatar: string;
  byokConfigured: boolean;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (session: UserSession) => void;
  onOpenPricing?: () => void;
}

export function AuthModal({ isOpen, onClose, onLogin, onOpenPricing }: AuthModalProps) {
  const [isSignUp, setIsSignUp] = useState<boolean>(true);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [selectedTier, setSelectedTier] = useState<"free" | "pro">("free");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      const session: UserSession = {
        email: email || "developer@rostr.ai",
        name: name || email.split("@")[0] || "ROSTR Developer",
        tier: selectedTier,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${email || "rostr"}`,
        byokConfigured: false,
      };
      localStorage.setItem("rostr_user_session", JSON.stringify(session));
      onLogin(session);
      setIsLoading(false);
      onClose();
    }, 600);
  };

  const handleDemoLogin = (tier: "free" | "pro") => {
    setIsLoading(true);
    setTimeout(() => {
      const session: UserSession = {
        email: tier === "pro" ? "pro_architect@diamitani.com" : "developer@rostr.ai",
        name: tier === "pro" ? "Pro Architect" : "Community Developer",
        tier: tier,
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${tier}`,
        byokConfigured: true,
      };
      localStorage.setItem("rostr_user_session", JSON.stringify(session));
      onLogin(session);
      setIsLoading(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in">
      <div className="relative w-full max-w-md rounded-2xl glass-panel border border-white/20 bg-slate-950/95 p-6 shadow-2xl text-slate-100 overflow-hidden">
        {/* Glow Accent */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">
                {isSignUp ? "Create ROSTR Account" : "Sign in to ROSTR"}
              </h3>
              <p className="text-[11px] text-slate-400">Diamitani Industries CTO Agent Platform</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Plan Selection Badge */}
        <div className="mt-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSelectedTier("free")}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedTier === "free"
                ? "bg-cyan-500/10 border-cyan-500/50 shadow-md shadow-cyan-500/10"
                : "bg-slate-900/50 border-white/5 opacity-60 hover:opacity-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white">Free Tier</span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 text-cyan-300">
                $0/mo
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">50 runs/day + BYOK</p>
          </button>

          <button
            type="button"
            onClick={() => setSelectedTier("pro")}
            className={`p-3 rounded-xl border text-left transition-all ${
              selectedTier === "pro"
                ? "bg-purple-500/10 border-purple-500/50 shadow-md shadow-purple-500/10 ring-1 ring-purple-500/30"
                : "bg-slate-900/50 border-white/5 opacity-60 hover:opacity-100"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-400" /> Pro Tier
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300">
                $19.99/mo
              </span>
            </div>
            <p className="text-[10px] text-slate-400 mt-1">Unlimited + 9 Agents</p>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-3">
          {isSignUp && (
            <div>
              <label className="text-[11px] font-medium text-slate-300 block mb-1">Full Name</label>
              <div className="relative flex items-center">
                <User className="w-3.5 h-3.5 absolute left-3 text-slate-500" />
                <input
                  type="text"
                  required={isSignUp}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Patrick Diamitani"
                  className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-cyan-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">Work Email</label>
            <div className="relative flex items-center">
              <Mail className="w-3.5 h-3.5 absolute left-3 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="developer@company.com"
                className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-medium text-slate-300 block mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="w-3.5 h-3.5 absolute left-3 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full glass-input rounded-xl pl-9 pr-3 py-2 text-xs focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all mt-2 disabled:opacity-50"
          >
            {isLoading ? (
              <span>Authenticating...</span>
            ) : (
              <span>{isSignUp ? "Sign Up & Start Harness" : "Sign In to Console"}</span>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <div className="relative flex justify-center text-[10px] uppercase">
            <span className="bg-slate-950 px-2 text-slate-500 font-mono">1-Click Instant Demo</span>
          </div>
        </div>

        {/* Demo Login Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => handleDemoLogin("free")}
            className="py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-white/10 text-[11px] text-slate-300 font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            <span>Try Free Tier</span>
          </button>

          <button
            type="button"
            onClick={() => handleDemoLogin("pro")}
            className="py-2 px-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/30 text-[11px] text-purple-300 font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>Try Pro Tier</span>
          </button>
        </div>

        {/* Toggle Sign In / Sign Up */}
        <div className="mt-4 pt-3 border-t border-white/10 text-center text-xs text-slate-400">
          {isSignUp ? (
            <span>
              Already have an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-cyan-400 hover:underline font-semibold cursor-pointer"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              Need an account?{" "}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-cyan-400 hover:underline font-semibold cursor-pointer"
              >
                Create one
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
