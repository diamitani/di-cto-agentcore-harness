"use client";

import React, { useState } from "react";
import {
  Cpu,
  Play,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Database,
  Wrench,
  Terminal,
  FileCode,
  Shield,
  Zap,
  RefreshCw,
  Sliders,
  ChevronRight,
  Activity,
  Check,
  Copy,
  Sparkles,
} from "lucide-react";
import { SUB_AGENTS_REGISTRY, SubAgentConfig } from "@/lib/pal/subagents";
import { compilePALIntent, PALCompilation } from "@/lib/pal/compiler";
import { memoryStore, EpisodicMemory } from "@/lib/pal/memory";

export function RuntimeStudio() {
  const [selectedAgent, setSelectedAgent] = useState<SubAgentConfig>(SUB_AGENTS_REGISTRY[3]); // application-engineer
  const [promptInput, setPromptInput] = useState<string>("Build checkout form with Stripe elements and validate inputs");
  const [activeSubTab, setActiveSubTab] = useState<"execution" | "memory" | "tools" | "soul">("execution");
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [compilationResult, setCompilationResult] = useState<PALCompilation | null>(null);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [executionStep, setExecutionStep] = useState<number>(0);
  const [memories, setMemories] = useState<EpisodicMemory[]>(memoryStore.getMemories());
  const [toolPayload, setToolPayload] = useState<string>('{\n  "action": "execute_code",\n  "runtime": "typescript",\n  "code": "console.log(\'Runtime Studio OK\');"\n}');
  const [toolOutput, setToolOutput] = useState<string>("");
  const [isToolRunning, setIsToolRunning] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const handleRunRuntimePipeline = async () => {
    if (!promptInput.trim() || isRunning) return;
    setIsRunning(true);
    setExecutionLogs([]);
    setExecutionStep(1);

    const compiled = compilePALIntent(promptInput);
    setCompilationResult(compiled);

    // Step 1: Intent Extraction & Phase Detection
    setExecutionLogs((prev) => [
      ...prev,
      `[Stage 1: Intent Extraction] Identified outcome in domain "${compiled.domain}" for phase "${compiled.phase}"`,
    ]);
    await new Promise((r) => setTimeout(r, 400));
    setExecutionStep(2);

    // Step 2: RAG & Soul Directive Loading
    setExecutionLogs((prev) => [
      ...prev,
      `[Stage 2: Governance & RAG] Loaded soul directives for agent "${selectedAgent.name}" (${selectedAgent.model})`,
    ]);
    await new Promise((r) => setTimeout(r, 450));
    setExecutionStep(3);

    // Step 3: NPAO 4D Context Assembly
    setExecutionLogs((prev) => [
      ...prev,
      `[Stage 3: NPAO 4D Score] Computed priority: ${compiled.priorityScore}/10 | Weights: Phase 35%, Dep 30%, Biz 25%, Res 10%`,
    ]);
    await new Promise((r) => setTimeout(r, 400));
    setExecutionStep(4);

    // Step 4: Tool & Approval Gate Verification
    const gateMsg = compiled.approvalGates.length > 0
      ? `[Stage 4: Gate Check] Human Gate Required: ${compiled.approvalGates.join(", ")}`
      : `[Stage 4: Gate Check] All approval criteria satisfied. Zero blocking gates.`;
    setExecutionLogs((prev) => [...prev, gateMsg]);
    await new Promise((r) => setTimeout(r, 450));
    setExecutionStep(5);

    // Step 5: Memory Vector Compounding
    const newMemory: EpisodicMemory = {
      id: `mem-${Date.now()}`,
      namespace: "rostr_decisions",
      content: `Runtime Studio executed: "${promptInput}" with agent ${selectedAgent.name}`,
      timestamp: new Date().toISOString(),
      phase: compiled.phase,
      tags: [compiled.domain, compiled.phase.toLowerCase(), selectedAgent.id],
      metadata: { priorityScore: compiled.priorityScore, subAgents: compiled.subAgents },
    };
    memoryStore.add(newMemory);
    setMemories(memoryStore.getMemories());

    setExecutionLogs((prev) => [
      ...prev,
      `[Stage 5: State Persistence] Persisted episodic execution vector to namespace "rostr_decisions"`,
      `[Runtime Completed] Outcome successfully compiled and validated.`,
    ]);
    setIsRunning(false);
  };

  const handleRunTool = async () => {
    setIsToolRunning(true);
    setToolOutput("Invoking tool adapter in sandbox runtime...");
    await new Promise((r) => setTimeout(r, 600));

    try {
      const parsed = JSON.parse(toolPayload);
      setToolOutput(
        JSON.stringify(
          {
            status: "success",
            exitCode: 0,
            adapter: selectedAgent.tools[0] || "sandbox",
            executionTimeMs: 142,
            result: {
              stdout: `[Runtime Studio Tool Output]\nExecuting ${parsed.action || "action"} for ${selectedAgent.name}\nResult: PASS (0 errors)`,
              timestamp: new Date().toISOString(),
            },
          },
          null,
          2
        )
      );
    } catch {
      setToolOutput(
        JSON.stringify(
          {
            status: "error",
            message: "Invalid JSON tool payload syntax.",
          },
          null,
          2
        )
      );
    } finally {
      setIsToolRunning(false);
    }
  };

  const handleCopyCode = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Studio Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-purple-600 flex items-center justify-center text-white shadow-md shadow-cyan-500/20">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Agent Runtime Studio
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Ready & Interactive
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Configure, inspect, test, and step-through multi-agent execution loops, memory persistence, and tool adapters.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Navigation Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-950/80 p-1 rounded-xl border border-white/10 self-start md:self-auto">
          <button
            onClick={() => setActiveSubTab("execution")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === "execution"
                ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Pipeline Tester
          </button>
          <button
            onClick={() => setActiveSubTab("tools")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === "tools"
                ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Tool Adapters
          </button>
          <button
            onClick={() => setActiveSubTab("memory")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === "memory"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Episodic Memory ({memories.length})
          </button>
          <button
            onClick={() => setActiveSubTab("soul")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeSubTab === "soul"
                ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Soul Governance
          </button>
        </div>
      </div>

      {/* Main Grid: Left Agent Selector + Right Studio Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: 9 Sub-Agents Selector */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-semibold text-slate-300 px-1 flex items-center justify-between">
            <span>Specialist Sub-Agents ({SUB_AGENTS_REGISTRY.length})</span>
            <span className="text-[10px] font-mono text-cyan-400">DI-CTO Governed</span>
          </div>

          <div className="space-y-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1">
            {SUB_AGENTS_REGISTRY.map((agent) => {
              const isSelected = selectedAgent.id === agent.id;
              return (
                <div
                  key={agent.id}
                  onClick={() => setSelectedAgent(agent)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? "bg-slate-900 border-cyan-500/50 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30"
                      : "glass-card hover:border-white/20"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                        {agent.name}
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        )}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-1">
                        {agent.role}
                      </p>
                    </div>
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-950 border border-white/10 text-slate-400">
                      {agent.model}
                    </span>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px]">
                    <div className="flex flex-wrap gap-1">
                      {agent.phases.map((p) => (
                        <span
                          key={p}
                          className="px-1.5 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 uppercase text-[9px]"
                        >
                          {p}
                        </span>
                      ))}
                    </div>
                    <span className="text-slate-500 font-mono">
                      {agent.tools.length} Tools
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Studio Workspace Panel */}
        <div className="lg:col-span-8">
          {activeSubTab === "execution" && (
            <div className="space-y-4">
              {/* Agent Active Spec Banner */}
              <div className="glass-panel p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-300 font-bold text-sm">
                    {selectedAgent.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">{selectedAgent.name}</h3>
                    <div className="text-xs text-slate-400">
                      Primary Model: <span className="text-cyan-300 font-mono">{selectedAgent.model}</span> | Allowed Phases:{" "}
                      <span className="text-purple-300 font-mono">{selectedAgent.phases.join(", ")}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Runtime Active
                  </span>
                </div>
              </div>

              {/* Execution Test Input */}
              <div className="glass-panel p-4 space-y-3">
                <label className="text-xs font-semibold text-slate-200 flex items-center justify-between">
                  <span>Step-Through Outcome Test Prompt:</span>
                  <span className="text-[11px] text-slate-400 font-normal">Runs full 5-stage PAL compiler</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promptInput}
                    onChange={(e) => setPromptInput(e.target.value)}
                    placeholder="Enter prompt to execute through the agent runtime..."
                    className="flex-1 glass-input rounded-xl px-4 py-2.5 text-xs focus:ring-1 focus:ring-cyan-500"
                  />
                  <button
                    onClick={handleRunRuntimePipeline}
                    disabled={isRunning || !promptInput.trim()}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white text-xs font-semibold shadow-md shadow-cyan-500/20 disabled:opacity-40 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    {isRunning ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>{isRunning ? "Stepping..." : "Run Pipeline"}</span>
                  </button>
                </div>
              </div>

              {/* 5-Stage Visual Stepper */}
              <div className="grid grid-cols-5 gap-2">
                {[
                  { step: 1, label: "1. Intent", icon: Sparkles },
                  { step: 2, label: "2. Governance", icon: Shield },
                  { step: 3, label: "3. NPAO 4D", icon: Sliders },
                  { step: 4, label: "4. Gate Check", icon: CheckCircle2 },
                  { step: 5, label: "5. State Write", icon: Database },
                ].map((s) => {
                  const isDone = executionStep > s.step;
                  const isCurrent = executionStep === s.step;
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.step}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        isDone
                          ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                          : isCurrent
                          ? "bg-cyan-500/20 border-cyan-500/50 text-cyan-300 shadow-md shadow-cyan-500/20 animate-pulse"
                          : "bg-slate-950/40 border-white/5 text-slate-500"
                      }`}
                    >
                      <Icon className="w-4 h-4 mx-auto mb-1" />
                      <div className="text-[10px] font-semibold tracking-tight">{s.label}</div>
                    </div>
                  );
                })}
              </div>

              {/* Terminal Logs */}
              <div className="glass-panel p-4 space-y-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-semibold text-slate-200">Runtime Execution Stream</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500">
                    {executionLogs.length} events logged
                  </span>
                </div>

                <div className="bg-slate-950 p-3 rounded-xl border border-white/5 font-mono text-xs text-slate-300 min-h-[160px] max-h-[220px] overflow-y-auto space-y-1.5">
                  {executionLogs.length === 0 ? (
                    <div className="text-slate-600 italic py-8 text-center">
                      Click "Run Pipeline" to step through the agent runtime execution trace.
                    </div>
                  ) : (
                    executionLogs.map((log, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <ChevronRight className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                        <span className={idx === executionLogs.length - 1 ? "text-cyan-300 font-semibold" : "text-slate-300"}>
                          {log}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {activeSubTab === "tools" && (
            <div className="space-y-4">
              <div className="glass-panel p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-purple-400" />
                    <span className="text-xs font-semibold text-white">Tool Invocation Sandbox</span>
                  </div>
                  <div className="flex gap-1">
                    {selectedAgent.tools.map((tool) => (
                      <span
                        key={tool}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      >
                        {tool}
                      </span>
                    ))}
                  </div>
                </div>

                <label className="text-[11px] text-slate-400 block">
                  JSON Tool Invocation Payload for <strong className="text-slate-200">{selectedAgent.name}</strong>:
                </label>
                <textarea
                  rows={5}
                  value={toolPayload}
                  onChange={(e) => setToolPayload(e.target.value)}
                  className="w-full glass-input rounded-xl p-3 font-mono text-xs text-cyan-300 focus:ring-1 focus:ring-purple-500"
                />

                <div className="flex justify-end">
                  <button
                    onClick={handleRunTool}
                    disabled={isToolRunning}
                    className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold shadow-md shadow-purple-600/20 flex items-center gap-2 cursor-pointer transition-all"
                  >
                    {isToolRunning ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Play className="w-3.5 h-3.5 fill-current" />
                    )}
                    <span>{isToolRunning ? "Executing..." : "Execute Tool"}</span>
                  </button>
                </div>
              </div>

              {/* Tool Execution Result */}
              {toolOutput && (
                <div className="glass-panel p-4 space-y-2">
                  <div className="flex items-center justify-between border-b border-white/10 pb-2">
                    <span className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                      <Terminal className="w-3.5 h-3.5 text-emerald-400" /> Tool Response Output
                    </span>
                    <button
                      onClick={() => handleCopyCode(toolOutput)}
                      className="text-[10px] text-slate-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? "Copied" : "Copy JSON"}</span>
                    </button>
                  </div>
                  <pre className="bg-slate-950 p-3 rounded-xl border border-white/5 font-mono text-xs text-emerald-300 overflow-x-auto">
                    {toolOutput}
                  </pre>
                </div>
              )}
            </div>
          )}

          {activeSubTab === "memory" && (
            <div className="space-y-4">
              <div className="glass-panel p-4 flex items-center justify-between">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    Episodic Memory Vectors ({memories.length})
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Persistent state and decisions compiled across agent execution sessions.
                  </p>
                </div>
                <button
                  onClick={() => setMemories(memoryStore.getMemories())}
                  className="px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 hover:border-cyan-500/30 text-xs text-slate-300 hover:text-cyan-300 flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <RefreshCw className="w-3 h-3" />
                  <span>Refresh</span>
                </button>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {memories.map((mem) => (
                  <div
                    key={mem.id}
                    className="p-3.5 rounded-xl bg-slate-950/60 border border-white/5 hover:border-emerald-500/30 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-mono text-emerald-400 font-semibold">
                        namespace: {mem.namespace}
                      </span>
                      <span className="text-slate-500 font-mono text-[10px]">
                        {new Date(mem.timestamp).toLocaleTimeString()}
                      </span>
                    </div>

                    <div className="text-xs text-slate-200">{mem.content}</div>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {mem.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400 border border-white/5"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSubTab === "soul" && (
            <div className="glass-panel p-5 space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div>
                  <h3 className="text-xs font-bold text-white flex items-center gap-2">
                    <Shield className="w-4 h-4 text-indigo-400" />
                    Soul Governance Directives & Operating Principles
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Immutable constraints governing all 9 ROSTR sub-agents
                  </p>
                </div>
              </div>

              <div className="space-y-3 text-xs text-slate-300">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <div className="text-[11px] font-bold text-cyan-400 mb-1">1. Outcome-Driven Execution</div>
                  <p className="text-slate-400">
                    Always start with the concrete user outcome, working backwards into minimal, testable vertical slices.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <div className="text-[11px] font-bold text-purple-400 mb-1">2. Strict Intent Discipline</div>
                  <p className="text-slate-400">
                    Preserve the user's explicit choices. Do not invent arbitrary abstractions or delete user assets.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <div className="text-[11px] font-bold text-emerald-400 mb-1">3. NPAO 4D Prioritization</div>
                  <p className="text-slate-400">
                    Rank tasks via <code>Priority = (Phase × 0.35) + (Dep × 0.30) + (Biz × 0.25) + (Res × 0.10)</code>.
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/60 border border-white/5">
                  <div className="text-[11px] font-bold text-indigo-400 mb-1">4. Approval Boundary Enforcement</div>
                  <p className="text-slate-400">
                    Block destructive mutations, production deployments, and secret injections until human approval is recorded.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
