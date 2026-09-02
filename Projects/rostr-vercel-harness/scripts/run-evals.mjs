/**
 * CLI Evals Runner for ROSTR / PAL Vercel Harness
 */

const PHASE_SCORES = {
  Debugging: 10.0,
  Deploy: 8.0,
  Development: 6.0,
  Design: 4.0,
  PreD: 2.0,
};

const PHASE_SUBAGENTS = {
  PreD: ["product-architect", "jtbd-npao-planner"],
  Design: ["product-architect", "experience-engineer", "agent-runtime-engineer"],
  Development: ["application-engineer", "agent-runtime-engineer", "quality-engineer"],
  Deploy: ["devops-release-engineer", "identity-commerce-qa", "quality-engineer"],
  Debugging: ["application-engineer", "security-reviewer", "quality-engineer"],
};

function detectPhase(prompt) {
  const p = prompt.toLowerCase().trim();

  // 1. Debugging
  if (/(fix|error|bug|crash|issue|broken|debug|revert|exception|failure)/i.test(p)) {
    return { phase: "Debugging", domain: "code" };
  }

  // 2. Deploy
  if (
    /(deploy|release|production rollout|ship to prod|prod release|ci\/cd workflow|github actions)/i.test(
      p
    ) &&
    !/(build|develop|implement api|scaffold)/i.test(p.split(" ")[0])
  ) {
    return { phase: "Deploy", domain: "ops" };
  }

  // 3. Design
  if (
    /^(design|ux|ui|wireframe|spec|figma|palette|typography)/i.test(p) ||
    (/(design ui|ui component hierarchy|ux specification|design tokens)/i.test(p) &&
      !/(build|implement|code|deploy)/i.test(p.split(" ")[0]))
  ) {
    return { phase: "Design", domain: "design" };
  }

  // 4. Development
  if (
    /(build|create|implement|code|scaffold|add|make|endpoint|api route|backend|frontend|integration)/i.test(
      p
    )
  ) {
    return { phase: "Development", domain: "code" };
  }

  // 5. PreD / Discovery (default)
  return { phase: "PreD", domain: "research" };
}

function calculateNPAOPriority(phase, weights = {}) {
  const phaseVal = PHASE_SCORES[phase] || 4.0;
  const depVal = weights.dependencyScore ?? 5.5;
  const bizVal = weights.businessScore ?? 6.5;
  const resVal = weights.resourceScore ?? 7.0;

  const score = phaseVal * 0.35 + depVal * 0.30 + bizVal * 0.25 + resVal * 0.10;
  return Number(score.toFixed(2));
}

function compilePALIntent(userPrompt) {
  const { phase, domain } = detectPhase(userPrompt);
  const score = calculateNPAOPriority(phase);
  const subAgents = PHASE_SUBAGENTS[phase] || ["application-engineer"];

  const approvalGates = [];
  if (phase === "Deploy") approvalGates.push("production_deploy");
  if (/(auth|secret|credential|jwt|stripe webhook|payment provider|private key)/i.test(userPrompt)) {
    approvalGates.push("security_boundary_audit");
  }

  return {
    rawPrompt: userPrompt,
    intent: userPrompt.trim(),
    domain,
    phase,
    priorityScore: score,
    subAgents,
    approvalGates,
  };
}

const EVE_BENCHMARK_CASES = [
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

async function main() {
  console.log("=================================================");
  console.log("ROSTR / PAL Framework - EVE Evaluation Benchmark");
  console.log("=================================================\n");

  let passedCount = 0;
  for (const testCase of EVE_BENCHMARK_CASES) {
    const start = performance.now();
    const compiled = compilePALIntent(testCase.prompt);
    const duration = Math.round(performance.now() - start);

    const phaseMatches = compiled.phase === testCase.expectedPhase;
    const priorityMatches = compiled.priorityScore >= testCase.expectedMinPriority;
    const approvalMatches = testCase.expectedApprovalGate
      ? compiled.approvalGates.length > 0
      : true;
    const subAgentMatches = testCase.expectedSubAgents.some((sa) =>
      compiled.subAgents.includes(sa)
    );

    const passed = phaseMatches && priorityMatches && approvalMatches && subAgentMatches;
    if (passed) passedCount++;

    const statusIcon = passed ? "✅ PASS" : "❌ FAIL";
    console.log(`${statusIcon} [${testCase.id}] ${testCase.name} (${duration}ms)`);
    console.log(`   Phase: ${compiled.phase} | NPAO Priority: ${compiled.priorityScore}/10`);
    console.log(`   Sub-Agents: ${compiled.subAgents.join(", ")}`);
    console.log(`   Approval Gates: ${compiled.approvalGates.join(", ") || "None"}\n`);
  }

  console.log("-------------------------------------------------");
  console.log(`Summary: ${passedCount} / ${EVE_BENCHMARK_CASES.length} Passed (${Math.round((passedCount / EVE_BENCHMARK_CASES.length) * 100)}%)`);
  console.log("-------------------------------------------------");

  if (passedCount !== EVE_BENCHMARK_CASES.length) {
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
