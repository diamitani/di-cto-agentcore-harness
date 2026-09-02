/**
 * EVE (Evaluation & Verification Engine) Benchmark Suite
 * ROSTR Framework Gold-Standard Eval Datasets
 */

import { compilePALIntent, detectPhase, calculateNPAOPriority } from "../pal/compiler";

export interface EvalTestCase {
  id: string;
  name: string;
  category: "Phase Classification" | "NPAO Priority Formula" | "Approval Gating" | "Sub-Agent Routing" | "Security Boundary";
  prompt: string;
  expectedPhase: string;
  expectedMinPriority: number;
  expectedSubAgents: string[];
  expectedApprovalGate: boolean;
}

export interface EvalResult {
  testId: string;
  name: string;
  category: string;
  passed: boolean;
  actualPhase: string;
  actualPriority: number;
  actualSubAgents: string[];
  durationMs: number;
  reason: string;
}

export const EVE_BENCHMARK_CASES: EvalTestCase[] = [
  {
    id: "eve-001",
    name: "PreD: Architecture Discovery",
    category: "Phase Classification",
    prompt: "Research RAG-DAL memory tiering strategies and episodic retrieval latency",
    expectedPhase: "PreD",
    expectedMinPriority: 2.0,
    expectedSubAgents: ["product-architect", "jtbd-npao-planner"],
    expectedApprovalGate: false,
  },
  {
    id: "eve-002",
    name: "Design: UX Specification",
    category: "Phase Classification",
    prompt: "Design UI component hierarchy, color tokens, and responsive layout for dashboard",
    expectedPhase: "Design",
    expectedMinPriority: 3.5,
    expectedSubAgents: ["experience-engineer"],
    expectedApprovalGate: false,
  },
  {
    id: "eve-003",
    name: "Development: API Endpoint Build",
    category: "Phase Classification",
    prompt: "Build Next.js App Router streaming endpoint using Vercel AI SDK and Anthropic",
    expectedPhase: "Development",
    expectedMinPriority: 5.0,
    expectedSubAgents: ["application-engineer"],
    expectedApprovalGate: false,
  },
  {
    id: "eve-004",
    name: "Deploy: Production Release Gate",
    category: "Approval Gating",
    prompt: "Deploy production release to Vercel and AWS Bedrock AgentCore harness",
    expectedPhase: "Deploy",
    expectedMinPriority: 6.5,
    expectedSubAgents: ["devops-release-engineer"],
    expectedApprovalGate: true,
  },
  {
    id: "eve-005",
    name: "Debugging: Stream Error Fix",
    category: "Phase Classification",
    prompt: "Fix error 500 in chat completion stream buffer when token limit is reached",
    expectedPhase: "Debugging",
    expectedMinPriority: 6.5,
    expectedSubAgents: ["application-engineer", "quality-engineer"],
    expectedApprovalGate: false,
  },
  {
    id: "eve-006",
    name: "Security: Auth Secret Gate",
    category: "Security Boundary",
    prompt: "Implement Stripe webhook with live secret credential rotation and JWT validation",
    expectedPhase: "Development",
    expectedMinPriority: 5.0,
    expectedSubAgents: ["identity-commerce-qa", "application-engineer"],
    expectedApprovalGate: true,
  },
  {
    id: "eve-007",
    name: "NPAO: Critical Bug Ranking",
    category: "NPAO Priority Formula",
    prompt: "Fix critical regression crash in auth checkout flow",
    expectedPhase: "Debugging",
    expectedMinPriority: 6.5,
    expectedSubAgents: ["application-engineer"],
    expectedApprovalGate: true,
  },
  {
    id: "eve-008",
    name: "NPAO: Low-Urgency Discovery",
    category: "NPAO Priority Formula",
    prompt: "Design potential future design ideas for mobile app icons",
    expectedPhase: "Design",
    expectedMinPriority: 3.0,
    expectedSubAgents: ["experience-engineer"],
    expectedApprovalGate: false,
  },
  {
    id: "eve-009",
    name: "Routing: DevOps CI Pipeline",
    category: "Sub-Agent Routing",
    prompt: "Configure GitHub Actions CI/CD workflow for automated Vercel preview deploys",
    expectedPhase: "Deploy",
    expectedMinPriority: 6.5,
    expectedSubAgents: ["devops-release-engineer"],
    expectedApprovalGate: true,
  },
  {
    id: "eve-010",
    name: "Routing: Agent Soul & MCP",
    category: "Sub-Agent Routing",
    prompt: "Implement agent-runtime-engineer soul.md principles and MCP tool wrappers",
    expectedPhase: "Development",
    expectedMinPriority: 5.0,
    expectedSubAgents: ["agent-runtime-engineer"],
    expectedApprovalGate: false,
  },
];

export async function runEveBenchmarks(): Promise<{
  total: number;
  passed: number;
  failed: number;
  passRatePct: number;
  avgLatencyMs: number;
  results: EvalResult[];
}> {
  const results: EvalResult[] = [];
  let totalLatency = 0;

  for (const testCase of EVE_BENCHMARK_CASES) {
    const start = performance.now();
    const compiled = compilePALIntent(testCase.prompt);
    const duration = Math.round(performance.now() - start);
    totalLatency += duration;

    const phaseMatches = compiled.phase === testCase.expectedPhase;
    const priorityMatches = compiled.priorityScore >= testCase.expectedMinPriority;
    const approvalMatches =
      testCase.expectedApprovalGate ? compiled.approvalGates.length > 0 : true;

    const subAgentMatches = testCase.expectedSubAgents.some((sa) =>
      compiled.subAgents.includes(sa)
    );

    const passed = phaseMatches && priorityMatches && approvalMatches && subAgentMatches;

    results.push({
      testId: testCase.id,
      name: testCase.name,
      category: testCase.category,
      passed,
      actualPhase: compiled.phase,
      actualPriority: compiled.priorityScore,
      actualSubAgents: compiled.subAgents,
      durationMs: duration,
      reason: passed
        ? "All phase, priority, approval, and subagent routing assertions satisfied."
        : `Assertion mismatch: expected phase ${testCase.expectedPhase} (got ${compiled.phase}), min priority ${testCase.expectedMinPriority} (got ${compiled.priorityScore}).`,
    });
  }

  const passedCount = results.filter((r) => r.passed).length;
  return {
    total: results.length,
    passed: passedCount,
    failed: results.length - passedCount,
    passRatePct: Math.round((passedCount / results.length) * 100),
    avgLatencyMs: Number((totalLatency / results.length).toFixed(1)),
    results,
  };
}
