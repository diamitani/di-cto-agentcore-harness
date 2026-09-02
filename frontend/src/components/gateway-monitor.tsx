"use client";

import React, { useState, useEffect } from "react";
import { Network, Server, DollarSign, Activity, CheckCircle2, AlertTriangle, ArrowUpRight } from "lucide-react";
import { ModelProviderConfig } from "@/lib/gateway/router";

interface GatewayMonitorProps {
  selectedModel: string;
  onSelectModel: (modelId: string) => void;
}

export function GatewayMonitor({ selectedModel, onSelectModel }: GatewayMonitorProps) {
  const [stats, setStats] = useState<{
    gatewayStatus: string;
    activeRouter: string;
    cacheHitRate: string;
    totalRequests24h: number;
    p95LatencyMs: number;
    avgCostPerRequest: string;
    providers: ModelProviderConfig[];
  } | null>(null);

  useEffect(() => {
    fetch("/api/gateway/stats")
      .then((res) => res.json())
      .then((data) => setStats(data))
      .catch((err) => console.error("Failed to load gateway stats", err));
  }, []);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1">
                <Network className="w-3.5 h-3.5" /> Vercel AI Gateway
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Multi-Model Fallback Active
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">AI Gateway Routing & Telemetry Engine</h2>
            <p className="text-xs text-slate-400 mt-1">
              Intelligent multi-model router with zero-downtime failover across AWS Bedrock, Anthropic Direct, OpenAI, and Local Simulators.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-mono text-emerald-300">Gateway Status: Optimal</span>
          </div>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="glass-panel p-4">
          <div className="text-[11px] text-slate-400">P95 Router Latency</div>
          <div className="text-2xl font-bold text-cyan-400 mt-1">{stats?.p95LatencyMs || 412}ms</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Across all models</div>
        </div>

        <div className="glass-panel p-4">
          <div className="text-[11px] text-slate-400">Semantic Cache Hit Rate</div>
          <div className="text-2xl font-bold text-emerald-400 mt-1">{stats?.cacheHitRate || "34.2%"}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">ROSTR decision cache</div>
        </div>

        <div className="glass-panel p-4">
          <div className="text-[11px] text-slate-400">24h Gateway Invocations</div>
          <div className="text-2xl font-bold text-purple-400 mt-1">
            {stats?.totalRequests24h.toLocaleString() || "18,420"}
          </div>
          <div className="text-[10px] text-slate-500 mt-0.5">Requests processed</div>
        </div>

        <div className="glass-panel p-4">
          <div className="text-[11px] text-slate-400">Avg Cost per Execution</div>
          <div className="text-2xl font-bold text-amber-400 mt-1">{stats?.avgCostPerRequest || "$0.0031"}</div>
          <div className="text-[10px] text-slate-500 mt-0.5">Optimized prompt compression</div>
        </div>
      </div>

      {/* Model Providers Table & Selector */}
      <div className="glass-panel overflow-hidden">
        <div className="p-4 bg-slate-950/60 border-b border-white/10 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-white flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan-400" />
            Configured AI Model Endpoints
          </h3>
          <span className="text-xs text-slate-400 font-mono">Click to activate as primary model</span>
        </div>

        <div className="divide-y divide-white/5">
          {stats?.providers.map((p) => {
            const isSelected = selectedModel === p.modelId || (!selectedModel && p.id === "bedrock-sonnet-4-6");
            return (
              <div
                key={p.id}
                onClick={() => onSelectModel(p.modelId)}
                className={`p-4 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer ${
                  isSelected
                    ? "bg-cyan-500/10 border-l-4 border-l-cyan-400"
                    : "hover:bg-slate-900/40"
                }`}
              >
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className="text-sm font-bold text-white">{p.name}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-slate-400 uppercase">
                      {p.provider}
                    </span>
                    {isSelected && (
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        Active Model
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-mono text-slate-400 mt-1">ID: {p.modelId}</div>
                </div>

                <div className="flex items-center gap-6 text-xs text-slate-400">
                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Context</div>
                    <div className="font-mono text-slate-200">{(p.contextWindow / 1000).toFixed(0)}k tokens</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Cost (In/Out 1M)</div>
                    <div className="font-mono text-slate-200">${p.inputCostPer1M} / ${p.outputCostPer1M}</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Avg Latency</div>
                    <div className="font-mono text-cyan-300">{p.avgLatencyMs}ms</div>
                  </div>

                  <div>
                    <div className="text-[10px] text-slate-500 uppercase">Status</div>
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-400">
                      <CheckCircle2 className="w-3 h-3" />
                      {p.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
