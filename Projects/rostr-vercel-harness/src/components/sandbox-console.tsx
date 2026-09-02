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
    python: `# Vercel Sandbox Python Simulation
from dataclasses import dataclass

@dataclass
class PALTask:
    name: str
    phase: str
    priority: float

task = PALTask("Research Bedrock AgentCore Memory", "PreD", 3.10)
print(f"[Python 3.14] Processing task: {task.name}")
print(f"Phase: {task.phase} | Priority: {task.priority}")
print("Episodic Memory record queued in namespace: rostr_decisions")`,
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
      <div className="glass-panel p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Vercel Sandbox Runtime
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Isolated Execution
              </span>
            </div>
            <h2 className="text-xl font-bold text-white">Vercel Code Sandbox Console</h2>
            <p className="text-xs text-slate-400 mt-1">
              Test and execute agent-generated vertical slices, verify PAL assertions, and capture telemetry in real time.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleRun}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition-all shadow-lg shadow-emerald-600/20 disabled:opacity-50 cursor-pointer"
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
        <div className="lg:col-span-7 glass-panel flex flex-col overflow-hidden">
          <div className="p-3 bg-slate-950/60 border-b border-white/10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-semibold text-slate-200">Sandbox Code Buffer</span>
            </div>

            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-slate-900 p-0.5 border border-white/10 text-xs">
                {(["javascript", "typescript", "python"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => handleLanguageChange(lang)}
                    className={`px-2.5 py-1 rounded capitalize font-medium transition-colors ${
                      language === lang ? "bg-cyan-500/20 text-cyan-300 font-semibold" : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {lang}
                  </button>
                ))}
              </div>

              <button
                onClick={handleCopy}
                className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-400 hover:text-slate-200 text-xs"
                title="Copy code"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          <textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            rows={16}
            spellCheck={false}
            className="w-full bg-[#05070a] p-4 text-xs font-mono text-cyan-200 focus:outline-none resize-none selection:bg-cyan-500/40"
          />
        </div>

        {/* Right: Terminal Output & Telemetry */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel overflow-hidden flex flex-col h-full min-h-[380px]">
            <div className="p-3 bg-slate-950/60 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-semibold text-slate-200">Terminal Output</span>
              </div>
              {output && (
                <span
                  className={`text-[10px] font-mono px-2 py-0.5 rounded flex items-center gap-1 ${
                    output.status === "success"
                      ? "bg-emerald-500/20 text-emerald-300"
                      : "bg-red-500/20 text-red-300"
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

            <div className="p-4 bg-[#05070a] flex-1 font-mono text-xs overflow-y-auto">
              {output ? (
                <>
                  {output.stdout && (
                    <pre className="text-slate-300 whitespace-pre-wrap leading-relaxed">{output.stdout}</pre>
                  )}
                  {output.stderr && (
                    <pre className="text-red-400 whitespace-pre-wrap leading-relaxed mt-2">{output.stderr}</pre>
                  )}
                </>
              ) : (
                <div className="text-slate-600 flex flex-col items-center justify-center h-full py-12 text-center">
                  <Terminal className="w-8 h-8 mb-2 opacity-40" />
                  <p>Click "Execute in Sandbox" to run the code.</p>
                  <p className="text-[11px] text-slate-700 mt-1">Output and execution metrics will stream here.</p>
                </div>
              )}
            </div>

            {/* Telemetry Bar */}
            {output && (
              <div className="p-3 bg-slate-950/70 border-t border-white/10 grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Execution: <strong className="text-white">{output.executionTimeMs}ms</strong></span>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Cpu className="w-3.5 h-3.5 text-purple-400" />
                  <span>Memory: <strong className="text-white">{output.memoryUsedMb} MB</strong></span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
