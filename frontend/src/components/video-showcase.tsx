"use client";

import React, { useState } from "react";
import { Play, Sparkles, Youtube, ExternalLink, BookOpen, Layers, CheckCircle2, ArrowRight } from "lucide-react";

interface VideoShowcaseProps {
  onSelectPrompt: (prompt: string) => void;
}

interface Chapter {
  timestamp: string;
  seconds: number;
  title: string;
  description: string;
}

export function VideoShowcase({ onSelectPrompt }: VideoShowcaseProps) {
  const [currentChapterSeconds, setCurrentChapterSeconds] = useState<number>(0);

  const chapters: Chapter[] = [
    {
      timestamp: "00:00",
      seconds: 0,
      title: "Introduction & Unified Agent Architecture",
      description: "Patrick Diamitani introduces the ROSTR multi-agent framework and governed CTO harness principles.",
    },
    {
      timestamp: "01:30",
      seconds: 90,
      title: "PAL 5-Stage Compilation Pipeline",
      description: "How intent extraction, dependency analysis, context assembly, and sandbox execution operate deterministically.",
    },
    {
      timestamp: "03:45",
      seconds: 225,
      title: "NPAO 4D Priority Scoring Engine",
      description: "Mathematical prioritization: (Phase × 0.35) + (Dependency × 0.30) + (Business × 0.25) + (Resource × 0.10).",
    },
    {
      timestamp: "06:15",
      seconds: 375,
      title: "AWS Bedrock AgentCore & Episodic Memory",
      description: "Integrating semantic retrieval, session checkpointing, and 'rostr_decisions' knowledge compounding.",
    },
    {
      timestamp: "08:30",
      seconds: 510,
      title: "Production Benchmarks & Live Scaffolding",
      description: "End-to-end vertical slice delivery from natural language prompt to live deployed application.",
    },
  ];

  const demoPresets = [
    {
      title: "Scaffold Landing Page with Pricing",
      phase: "Development",
      priority: "5.20",
      prompt: "Scaffold a modern SaaS landing page with dark glassmorphism styling, feature grid, and pricing table using Next.js 15 and Tailwind CSS.",
    },
    {
      title: "Compile GTM Outbound Workflow",
      phase: "Development",
      priority: "6.75",
      prompt: "Build an automated GTM outbound pipeline integrating CRM dedupe, contact discovery, and PAS email copywriting.",
    },
    {
      title: "Execute Multi-Agent Research Pass",
      phase: "PreD",
      priority: "3.10",
      prompt: "Research episodic memory persistence patterns and latency benchmarks in AWS Bedrock AgentCore for multi-turn sessions.",
    },
    {
      title: "Enforce Production Deploy Approval Gate",
      phase: "Deploy",
      priority: "7.27",
      prompt: "Deploy production release of ROSTR harness to Vercel and trigger automated health check verification.",
    },
  ];

  const videoSrc = `https://www.youtube.com/embed/vKGtIY-MR8Y?autoplay=0&enablejsapi=1&start=${currentChapterSeconds}`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="glass-panel-glow p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-red-500/20 text-red-400 border border-red-500/30 flex items-center gap-1.5">
                <Youtube className="w-3.5 h-3.5" /> Featured YouTube Showcase
              </span>
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Official ROSTR Demo
              </span>
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              ROSTR Agent Demo — Architecture & PAL Protocol
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Patrick Diamitani demonstrates the complete ROSTR framework, PAL compilation pipeline, NPAO routing, and AWS Bedrock AgentCore integration.
            </p>
          </div>
          <a
            href="https://www.youtube.com/watch?v=vKGtIY-MR8Y"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-sm font-medium transition-colors shadow-lg shadow-red-600/25 shrink-0"
          >
            <Youtube className="w-4 h-4" />
            Watch on YouTube
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>

      {/* Main Grid: Video Player + Chapter Navigator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Video Player */}
        <div className="lg:col-span-8 glass-panel overflow-hidden flex flex-col">
          <div className="relative w-full aspect-video bg-black/80 rounded-t-xl overflow-hidden">
            <iframe
              key={currentChapterSeconds}
              src={videoSrc}
              title="ROSTR Agent Demo by Patrick Diamitani"
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          </div>
          <div className="p-4 bg-slate-900/60 border-t border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Demonstration by <strong>Patrick Diamitani</strong> (Diamitani Industries © 2026)</span>
            </div>
            <div className="text-xs text-cyan-400 font-mono">
              v1.0 · PAL / NPAO Protocol
            </div>
          </div>
        </div>

        {/* Chapter Index */}
        <div className="lg:col-span-4 glass-panel p-5 flex flex-col h-full">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-cyan-400" />
              Demo Chapters
            </h3>
            <span className="text-xs text-slate-500 font-mono">5 Markers</span>
          </div>

          <div className="space-y-2.5 overflow-y-auto max-h-[380px] pr-1">
            {chapters.map((ch, idx) => {
              const isActive = currentChapterSeconds === ch.seconds;
              return (
                <button
                  key={idx}
                  onClick={() => setCurrentChapterSeconds(ch.seconds)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    isActive
                      ? "bg-cyan-500/15 border-cyan-500/40 shadow-sm shadow-cyan-500/10"
                      : "bg-slate-950/40 border-white/5 hover:bg-slate-800/40 hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-white/10 text-cyan-300">
                      {ch.timestamp}
                    </span>
                    {isActive && (
                      <span className="text-[10px] text-cyan-400 font-medium flex items-center gap-1">
                        <Play className="w-2.5 h-2.5 fill-current" /> Active Chapter
                      </span>
                    )}
                  </div>
                  <div className="text-xs font-medium text-slate-200 line-clamp-1">{ch.title}</div>
                  <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2">{ch.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Launch Presets from the Video */}
      <div className="glass-panel p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              Interactive Demo Presets
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select any workflow featured in the demo video to test it instantly in the live Agent Console.
            </p>
          </div>
          <span className="text-xs text-slate-500">Click to execute</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoPresets.map((preset, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/50 border border-white/5 hover:border-cyan-500/30 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors">
                    {preset.title}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono">
                      Phase: {preset.phase}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 font-mono">
                      NPAO: {preset.priority}
                    </span>
                  </div>
                </div>
                <p className="text-xs text-slate-400 line-clamp-2">{preset.prompt}</p>
              </div>

              <button
                onClick={() => onSelectPrompt(preset.prompt)}
                className="mt-3.5 inline-flex items-center justify-between w-full px-3 py-1.5 rounded-lg bg-white/5 hover:bg-cyan-500/20 text-cyan-300 hover:text-cyan-200 text-xs font-medium transition-all"
              >
                <span>Run in Agent Console</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
