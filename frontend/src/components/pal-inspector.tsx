"use client";

import React, { useState, useEffect } from "react";
import { compilePALIntent, PALCompilation, PhaseType } from "@/lib/pal/compiler";
import { SUB_AGENTS_REGISTRY } from "@/lib/pal/subagents";
import { Sliders, Layers, ShieldAlert, Cpu, Sparkles, CheckCircle2, ArrowRight, RefreshCw } from "lucide-react";

interface PALInspectorProps {
  onDispatchToChat?: (prompt: string) => void;
}

export function PALInspector({ onDispatchToChat }: PALInspectorProps) {
  const [prompt, setPrompt] = useState<string>("Build a high-converting pricing page with Stripe subscription checkout");
  const [depWeight, setDepWeight] = useState<number>(6.0);
  const [bizWeight, setBizWeight] = useState<number>(7.5);
  const [resWeight, setResWeight] = useState<number>(8.0);
  const [compiled, setCompiled] = useState<PALCompilation | null>(null);

  const handleCompile = () => {
    const res = compilePALIntent(prompt, {
      dependencyScore: depWeight,
      businessScore: bizWeight,
      resourceScore: resWeight,
    });
    setCompiled(res);
  };

  useEffect(() => {
    handleCompile();
  }, [prompt, depWeight, bizWeight, resWeight]);

  const phaseColors: Record<PhaseType, { bg: string; text: string; border: string }> = {
    PreD: { bg: "bg-blue-500/15", text: "text-blue-300", border: "border-blue-500/30" },
    Design: { bg: "bg-purple-500/15", text: "text-purple-300", border: "border-purple-500/30" },
    Development: { bg: "bg-cyan-500/15", text: "text-cyan-300", border: "border-cyan-500/30" },
    Deploy: { bg: "bg-rose-500/15", text: "text-rose-300", border: "border-rose-500/30" },
    Debugging: { bg: "bg-amber-500/15", text: "text-amber-300", border: "border-amber-500/30" },
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-panel p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                PAL 5-Stage Protocol
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30">
                NPAO 4D Engine
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">Interactive PAL & NPAO Compiler Inspector</h2>
            <p className="text-xs text-slate-400 mt-1">
              Test intent classification, 4D priority calculations, and sub-agent dispatch before runtime execution.
            </p>
          </div>
          {onDispatchToChat && (
            <button
              onClick={() => onDispatchToChat(prompt)}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white text-xs font-medium transition-colors shadow-lg shadow-cyan-600/20"
            >
              <span>Execute in Agent Console</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Input Textarea */}
        <div className="mt-5">
          <label className="text-xs font-semibold text-slate-300 mb-1.5 block">
            Natural Language Outcome / Prompt
          </label>
          <div className="relative">
            <textarea
              rows={2}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Enter your task outcome..."
              className="w-full glass-input rounded-lg p-3 text-sm resize-none focus:ring-1 focus:ring-cyan-500"
            />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: NPAO 4D Sliders & Priority Score */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                NPAO 4D Priority Tuner
              </h3>
              <button
                onClick={() => {
                  setDepWeight(5.5);
                  setBizWeight(6.5);
                  setResWeight(7.0);
                }}
                className="text-[11px] text-slate-400 hover:text-cyan-300 flex items-center gap-1"
              >
                <RefreshCw className="w-3 h-3" /> Reset
              </button>
            </div>

            {/* Score Card */}
            {compiled && (
              <div className="p-4 rounded-xl bg-slate-950/60 border border-white/10 mb-5 flex items-center justify-between">
                <div>
                  <div className="text-[11px] text-slate-400 uppercase tracking-wider font-mono">
                    NPAO Priority Score
                  </div>
                  <div className="text-3xl font-bold text-cyan-400 mt-1">
                    {compiled.priorityScore}{" "}
                    <span className="text-sm text-slate-500 font-normal">/ 10</span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-1">
                    Formula: {compiled.priorityBreakdown.formula}
                  </div>
                </div>

                <div
                  className={`px-3 py-1.5 rounded-lg border text-xs font-semibold ${
                    phaseColors[compiled.phase].bg
                  } ${phaseColors[compiled.phase].text} ${phaseColors[compiled.phase].border}`}
                >
                  Phase: {compiled.phase}
                </div>
              </div>
            )}

            {/* Sliders */}
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Phase Weight (35%)</span>
                  <span className="text-cyan-300 font-mono font-semibold">
                    {compiled?.priorityBreakdown.phaseWeight} pts
                  </span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div
                    className="bg-cyan-400 h-full rounded-full"
                    style={{ width: `${((compiled?.priorityBreakdown.phaseWeight || 0) / 3.5) * 100}%` }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Dependency Criticality (30%)</span>
                  <span className="text-indigo-300 font-mono font-semibold">{depWeight.toFixed(1)} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={depWeight}
                  onChange={(e) => setDepWeight(parseFloat(e.target.value))}
                  className="w-full accent-indigo-400 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Business Impact (25%)</span>
                  <span className="text-purple-300 font-mono font-semibold">{bizWeight.toFixed(1)} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={bizWeight}
                  onChange={(e) => setBizWeight(parseFloat(e.target.value))}
                  className="w-full accent-purple-400 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">Resource Feasibility (10%)</span>
                  <span className="text-emerald-300 font-mono font-semibold">{resWeight.toFixed(1)} / 10</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.5"
                  value={resWeight}
                  onChange={(e) => setResWeight(parseFloat(e.target.value))}
                  className="w-full accent-emerald-400 bg-slate-800 rounded-lg cursor-pointer"
                />
              </div>
            </div>
          </div>

          {/* Approval Gates & Security Boundary */}
          {compiled && compiled.approvalGates.length > 0 && (
            <div className="glass-panel p-4 border border-amber-500/30 bg-amber-500/5">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 mb-2">
                <ShieldAlert className="w-4 h-4 text-amber-400" />
                Active Approval Gates Required
              </div>
              <ul className="space-y-1">
                {compiled.approvalGates.map((gate, i) => (
                  <li key={i} className="text-xs text-amber-200/80 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                    <code className="font-mono text-[11px] bg-amber-950/60 px-1.5 py-0.5 rounded text-amber-300">
                      {gate}
                    </code>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Right Column: PAL 5-Stage Pipeline Visualizer */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-400" />
                PAL 5-Stage Pipeline Execution Trace
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Total Latency: ~8.0ms
              </span>
            </div>

            <div className="space-y-3">
              {compiled?.stages.map((st) => (
                <div
                  key={st.stageNumber}
                  className="p-3.5 rounded-xl bg-slate-950/40 border border-white/5 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold flex items-center justify-center">
                        {st.stageNumber}
                      </span>
                      <span className="text-xs font-semibold text-slate-200">{st.stageName}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                      {st.latencyMs}ms
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 ml-7">{st.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Assigned Sub-Agents */}
          <div className="glass-panel p-5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2 mb-3">
              <Cpu className="w-4 h-4 text-emerald-400" />
              Dispatched Specialist Sub-Agents
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {compiled?.subAgents.map((saId) => {
                const def = SUB_AGENTS_REGISTRY.find((a) => a.id === saId);
                return (
                  <div
                    key={saId}
                    className="p-3 rounded-lg bg-slate-950/50 border border-white/5 flex items-start gap-3"
                  >
                    <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${def?.avatarColor || "from-cyan-500 to-blue-600"} flex items-center justify-center text-white font-bold text-xs shrink-0`}>
                      {def?.name.charAt(0) || "A"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-semibold text-white truncate">{def?.name || saId}</div>
                      <p className="text-[11px] text-slate-400 line-clamp-2 mt-0.5">{def?.role}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
