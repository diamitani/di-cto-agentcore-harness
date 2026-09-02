"use client";

import React, { useState } from "react";
import { CheckCircle2, XCircle, Play, ShieldCheck, Activity, Zap, Search, RefreshCw, BarChart3 } from "lucide-react";
import { EvalResult } from "@/lib/evals/eve-benchmarks";

export function EvalsDashboard() {
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [evalSummary, setEvalSummary] = useState<{
    total: number;
    passed: number;
    failed: number;
    passRatePct: number;
    avgLatencyMs: number;
    results: EvalResult[];
  } | null>(null);

  const handleRunEvals = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/evals/run", { method: "POST" });
      const data = await res.json();
      setEvalSummary(data);
    } catch (err) {
      console.error("Evals failed", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    "all",
    "Phase Classification",
    "NPAO Priority Formula",
    "Approval Gating",
    "Sub-Agent Routing",
    "Security Boundary",
  ];

  const filteredResults =
    evalSummary?.results.filter((r) =>
      selectedCategory === "all" ? true : r.category === selectedCategory
    ) || [];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/20 text-purple-300 border border-purple-500/30 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> EVE Benchmark Suite
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                10 Automated Gold Evals
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">EVE Agent Evaluation & Verification Engine</h2>
            <p className="text-xs text-slate-400 mt-1">
              Automated regression test suite verifying PAL phase accuracy, NPAO priority consistency, approval boundaries, and sub-agent routing.
            </p>
          </div>

          <button
            onClick={handleRunEvals}
            disabled={loading}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-semibold transition-all shadow-lg shadow-purple-600/25 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Running 10 Benchmarks...</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Run EVE Evaluation Bench</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      {evalSummary ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Pass Rate</div>
              <div className="text-2xl font-bold text-emerald-400">{evalSummary.passRatePct}%</div>
            </div>
          </div>

          <div className="glass-panel p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Total Evaluated</div>
              <div className="text-2xl font-bold text-white">{evalSummary.total} Tests</div>
            </div>
          </div>

          <div className="glass-panel p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Avg PAL Latency</div>
              <div className="text-2xl font-bold text-purple-400">{evalSummary.avgLatencyMs}ms</div>
            </div>
          </div>

          <div className="glass-panel p-4 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[11px] text-slate-400">Passed / Failed</div>
              <div className="text-2xl font-bold text-slate-200">
                {evalSummary.passed} <span className="text-sm font-normal text-slate-500">/ {evalSummary.failed}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-panel p-8 text-center">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center mx-auto mb-3">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-base font-semibold text-white">EVE Benchmark Suite Ready</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
            Click "Run EVE Evaluation Bench" above to execute all 10 automated test cases against the live PAL and NPAO routing engine.
          </p>
        </div>
      )}

      {/* Category Filter Pills */}
      {evalSummary && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? "bg-purple-500/20 text-purple-300 border border-purple-500/40"
                  : "bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-white/5"
              }`}
            >
              {cat === "all" ? "All Categories (10)" : cat}
            </button>
          ))}
        </div>
      )}

      {/* Benchmark Results List */}
      {evalSummary && (
        <div className="glass-panel overflow-hidden">
          <div className="p-4 bg-slate-950/60 border-b border-white/10 flex items-center justify-between text-xs font-semibold text-slate-300">
            <span>Benchmark Test Case & Target Assertion</span>
            <span>Verdict / Duration</span>
          </div>

          <div className="divide-y divide-white/5">
            {filteredResults.map((res) => (
              <div key={res.testId} className="p-4 hover:bg-slate-900/40 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {res.passed ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-400" />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{res.name}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400">
                          {res.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{res.reason}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2 py-0.5 rounded">
                          Phase: {res.actualPhase}
                        </span>
                        <span className="text-[10px] font-mono text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded">
                          NPAO: {res.actualPriority}/10
                        </span>
                        <span className="text-[10px] font-mono text-slate-400 bg-white/5 px-2 py-0.5 rounded">
                          Sub-Agents: {res.actualSubAgents.join(", ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        res.passed
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-red-500/20 text-red-300 border border-red-500/30"
                      }`}
                    >
                      {res.passed ? "PASSED" : "FAILED"}
                    </span>
                    <div className="text-[10px] font-mono text-slate-500 mt-1">{res.durationMs}ms</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
