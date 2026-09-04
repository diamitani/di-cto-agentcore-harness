# Rostr Dev Agent — DI-CTO Governed Multi-Agent Harness

A production-grade, governed CTO agent harness for Diamitani Industries uniting the **ROSTR / PAL Framework**, **Vercel AI Ecosystem**, **Pydantic Deep Agents**, and **AWS Bedrock AgentCore** runtime.

---

## 🚀 Quick Start

### 1. Launch the ROSTR Vercel Tech Stack Harness
```bash
cd Projects/rostr-vercel-harness
npm install
npm run dev
# Open http://localhost:3000 in your browser
```

### 2. Python Pydantic Deep Runtime & CLI
```bash
# Install dependencies
pip install pydantic-deep -r requirements.txt

# Run ROSTR Pydantic Deep Agent CLI
python3 Tools/pydantic_deep_runner.py "Scaffold Next.js 15 landing page with Stripe pricing"
```

### 3. Run EVE Evaluation Benchmarks
```bash
cd Projects/rostr-vercel-harness
npm run test:evals
```

### 4. Execute Sandbox Tests
```bash
cd Projects/rostr-vercel-harness
npm run build
```

---

## 📦 Architecture & Stack Overview

```
Diamitani Industries CTO Agent System
├── 1. ROSTR / PAL Framework
│   ├── PAL 5-Stage Intent Compiler (Intent → Dependency → Context → Sandbox → Memory)
│   ├── NPAO 4D Priority Scoring: (Phase × 0.35) + (Dependency × 0.30) + (Business × 0.25) + (Resource × 0.10)
│   └── 9 Specialist Sub-Agents (Product Architect, JTBD/NPAO Planner, Experience Engineer, etc.)
│
├── 2. Pydantic Deep Agent Runtime (Tools/pydantic_deep_runner.py)
│   ├── Pydantic AI & Deep Agent state backend (pip install pydantic-deep)
│   ├── Type-safe intent compilation & sub-agent delegation
│   └── Sandbox code execution with memory persistence
│
├── 3. Vercel Tech Stack Harness (Projects/rostr-vercel-harness/)
│   ├── Vercel AI SDK Core & Streaming (/api/chat)
│   ├── Vercel AI Gateway (Multi-model router & telemetry: Bedrock, Anthropic, OpenAI, Local)
│   ├── Vercel Code Sandbox (/api/sandbox/execute - JS, TS, Python execution)
│   ├── AI SDK Elements & Assistant UI (Streaming chat, reasoning trace, tool cards)
│   ├── EVE Benchmark Suite (10 automated gold eval test cases)
│   └── Patrick Diamitani YouTube Showcase (vKGtIY-MR8Y embedded player & demo scrubber)
│
└── 4. AWS Bedrock AgentCore Python Harness
    ├── Governed Soul & System Prompt (soul.md)
    ├── Modular Skills: PAL, NPAO, Research (RAG DAL), Delivery, QA
    ├── MCP Tool Adapters: Filesystem, Sandbox, GitHub, Web, Cloud CLI
    └── Episodic Memory: 'rostr_decisions' and 'rostr_learnings'
```

---

## 🎬 Featured Demo Video

Watch **Patrick Diamitani** demonstrate the ROSTR multi-agent framework, PAL compiler, and Bedrock AgentCore:
- **YouTube Embed**: `https://www.youtube.com/embed/vKGtIY-MR8Y`
- **Watch on YouTube**: [ROSTR Agent Demo by Patrick Diamitani](https://www.youtube.com/watch?v=vKGtIY-MR8Y)

---

## 👥 9 Specialist Sub-Agents

| Sub-Agent | Role & Scope | Active Phases | Approval Gate |
|:----------|:-------------|:--------------|:--------------|
| `product-architect` | Planning, PRDs, domain boundaries | PreD, Design | None |
| `jtbd-npao-planner` | Jobs-to-be-Done, NPAO 4D priority | PreD, Design | None |
| `experience-engineer` | UX specifications, WCAG AA tokens | Design, Development | None |
| `application-engineer` | Full-stack APIs, AI SDK streaming | Development, Debugging | None |
| `agent-runtime-engineer` | soul.md governance, SKILL packages, pydantic-deep | Design, Development, Debug | None |
| `identity-commerce-qa` | Auth, OAuth, Stripe checkout | Development, Deploy | **Required** |
| `quality-engineer` | Functional QA, E2E benchmarks | Development, Deploy, Debug | None |
| `devops-release-engineer` | CI/CD, Vercel/AWS IaC, rollback | Deploy | **Required** |
| `security-reviewer` | Threat model, secret detection | All Phases | None |

---

## 🧪 Verification & Test Results

- **Pydantic Deep Integration**: Verified (`pydantic_deep` version 0.3.43 installed and functional).
- **EVE Benchmark Suite**: 10/10 gold evaluation benchmarks passing (`100% PASS`).
- **Next.js Production Build**: 0 errors, full static and dynamic route optimization.

---
*Diamitani Industries — Governed Agentic Engineering*
