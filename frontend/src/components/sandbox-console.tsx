"use client";

import React, { useState } from "react";
import { Terminal, Play, RotateCcw, Copy, Check, FileCode, Clock, Cpu, CheckCircle2, AlertCircle } from "lucide-react";

export function SandboxConsole() {
  const [language, setLanguage] = useState<"javascript" | "typescript" | "python">("javascript");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const defaultTemplates = {
    javascript: `// Vercel Sandbox JS Runner
// Test PAL 5-Stage Intent Validation
console.log("Initializing ROSTR Vercel Sandbox execution layer...");

const task = "Scaffold Next.js 15 landing page with pricing";
const npaoScore = (6.0 * 0.35) + (5.5 * 0.30) + (6.5 * 0.25) + (7.0 * 0.10);

console.log(\`Task: "\${task}"\`);
console.log(\`Calculated NPAO Priority: \${npaoScore.toFixed(2)}/10\`);
console.log("Allocated Sub-Agents: [application-engineer, experience-engineer, quality-engineer]");

const verification = {
  stage1_intent: "PASS",
  stage2_dependencies: "PASS",
  stage3_context_assembly: "PASS",
  stage4_sandboxed_exec: "PASS",
  stage5_memory_compounding: "PASS"
};

console.log("Pipeline Verification Check:", JSON.stringify(verification, null, 2));
console.log("Ready for deployment vertical slice.");`,
    typescript: `// Vercel Sandbox TypeScript Runner
interface PALIntent {
  raw: string;
  phase: "PreD" | "Design" | "Development" | "Deploy" | "Debugging";
  priority: number;
}

const intent: PALIntent = {
  raw: "Implement Vercel AI SDK streaming route",
  phase: "Development",
  priority: 6.75
};

console.log("TypeScript Strict Sandbox Validation:");
console.log("Intent Phase:", intent.phase);
console.log("Priority Score:", intent.priority);
console.log("Status: 100% Type Safe & Verified.");`,
    python: `# ROSTR Pydantic Deep Runtime Simulation
# Powered by pydantic-deep (pip install pydantic-deep)
from typing import List, Optional
from pydantic import BaseModel, Field

class PALIntent(BaseModel):
    task: str = Field(description="Raw outcome-driven prompt")
    phase: str = Field(default="Development", description="Lifecycle phase")
    npao_score: float = Field(default=7.25, ge=0.0, le=10.0)
    subagents: List[str] = Field(default_factory=lambda: ["product-architect", "agent-runtime-engineer"])
    memory_namespace: str = "rostr_decisions"

intent = PALIntent(
    task="Synthesize autonomous GTM funnel with Pydantic Deep agent",
    phase="Development",
    npao_score=8.10
)

print(f"🚀 [pydantic-deep] Initialized deep agent runtime")
print(f"📦 Active Schema: {intent.model_dump_json(indent=2)}")
print(f"✅ Governance Verification: Zero phase drift detected")
print(f"⚡ Sandboxed Execution: Status SUCCESS")`,
  };

  const [code, setCode] = useState<string>(defaultTemplates.javascript);
  const [output, setOutput] = useState<{
    stdout: string;
    stderr: string;
    status: string;
    executionTimeMs: number;
    memoryUsedMb: number;
  } | null>(null);

  const handleLanguageChange = (newLang: "javascript" | "typescript" | "python") => {
    setLanguage(newLang);
    setCode(defaultTemplates[newLang]);
    setOutput(null);
  };

  const handleRun = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/sandbox/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language, code }),
      });
      const data = await res.json();
      setOutput(data);
    } catch (err: any) {
      setOutput({
        stdout: "",
        stderr: err?.message || "Execution error",
        status: "error",
        executionTimeMs: 0,
        memoryUsedMb: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel p-6 bg-white border border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                Vercel Sandbox Runtime
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-50 text-cyan-700 border border-cyan-200">
                pydantic-deep Enabled
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900">Vercel Code Sandbox Console</h2>
            <p className="text-xs text-slate-600 mt-1">
              Test and execute agent-generated vertical slices, verify PAL assertions, and run Python / Pydantic Deep agent tasks.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRun}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all shadow-md shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Executing...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Execute in Sandbox</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Editor & Terminal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Code Editor */}
        <div className="lg:col-span-7 glass-panel flex flex-col overflow-hidden bg-white border border-slate-200">
          <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-600" />
              <span className="text-xs font-semibold text-slate-800">Sandbox Code Buffer</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-slate-200/60 p-0.5 border border-slate-200 text-xs">
                {(["javascript", "typescript", "python"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-2.5 py-1 rounded capitalize font-medium transition-colors cursor-pointer ${
                      language === lang ? "bg-white text-cyan-800 font-semibold shadow-xs" : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-200 text-xs cursor-pointer shadow-2xs"
                title="Copy code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={16}
            spellCheck={false}
            className="w-full bg-[#0f172a] p-4 text-xs font-mono text-cyan-200 focus:outline-none resize-none selection:bg-cyan-500/40"
          />
        </div>

        {/* Right: Terminal Output & Telemetry */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel overflow-hidden flex flex-col h-full min-h-[380px] bg-white border border-slate-200">
            <div className="p-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-600" />
                <span className="text-xs font-semibold text-slate-800">Terminal Output</span>
              </div>
              {output && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 font-semibold ${
                    output.status === "success"
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-red-50 text-red-700 border border-red-200"
                  }`}
                >
                  {output.status === "success" ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : (
                    <AlertCircle className="w-3 h-3" />
                  )}
                  {output.status.toUpperCase()}
                </span>
              )}
            </div>

            <div className="p-4 bg-[#0f172a] flex-1 font-mono text-xs overflow-y-auto">
              {output ? (
                <>
                  {output.stdout && (
                    <pre className="text-slate-200 whitespace-pre-wrap leading-relaxed">{output.stdout}</pre>
                  )}
                  {output.stderr && (
                    <pre className="text-red-400 whitespace-pre-wrap leading-relaxed mt-2">{output.stderr}</pre>
                  )}
                </>
              ) : (
                <div className="text-slate-500 flex flex-col items-center justify-center h-full py-12 text-center">
                  <Terminal className="w-8 h-8 mb-2 opacity-40 text-slate-400" />
                  <p className="text-slate-400 font-medium">Click "Execute in Sandbox" to run the code.</p>
                  <p className="text-[11px] text-slate-500 mt-1">Output and execution metrics will stream here.</p>
                </div>
              )}
            </div>

            {/* Telemetry Bar */}
            {output && (
              <div className="p-3 bg-slate-50 border-t border-slate-200 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Execution: <strong className="text-slate-900">{output.executionTimeMs}ms</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-600">
                  <Cpu className="w-3.5 h-3.5 text-purple-600" />
                  <span>Memory: <strong className="text-slate-900">{output.memoryUsedMb} MB</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
