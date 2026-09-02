/**
 * 9 Specialist Sub-Agents Registry
 * Diamitani Industries CTO Governed Multi-Agent System
 */

export interface SubAgentDef {
  id: string;
  name: string;
  role: string;
  phases: string[];
  tools: string[];
  approvalRequired: boolean;
  avatarColor: string;
  icon: string;
}

export const SUB_AGENTS_REGISTRY: SubAgentDef[] = [
  {
    id: "product-architect",
    name: "Product Architect",
    role: "Strategic planning, PRD authoring, requirements definition, and architecture boundary mapping.",
    phases: ["PreD", "Design"],
    tools: ["file_read", "file_write", "web_search", "memory_query"],
    approvalRequired: false,
    avatarColor: "from-sky-500 to-blue-600",
    icon: "Compass",
  },
  {
    id: "jtbd-npao-planner",
    name: "JTBD & NPAO Planner",
    role: "Jobs-to-be-Done prioritization, NPAO 4D scoring, dependency trees, and queue ordering.",
    phases: ["PreD", "Design"],
    tools: ["file_read", "memory_query", "npao_scorer"],
    approvalRequired: false,
    avatarColor: "from-indigo-500 to-purple-600",
    icon: "Target",
  },
  {
    id: "experience-engineer",
    name: "Experience Engineer",
    role: "UX specification, WCAG AA compliance, design tokens, micro-animations, component hierarchy.",
    phases: ["Design", "Development"],
    tools: ["file_read", "file_write", "sandbox_eval"],
    approvalRequired: false,
    avatarColor: "from-fuchsia-500 to-pink-600",
    icon: "Palette",
  },
  {
    id: "application-engineer",
    name: "Application Engineer",
    role: "Full-stack implementation, Next.js / AI SDK integration, API routes, state management.",
    phases: ["Development", "Debugging"],
    tools: ["file_read", "file_write", "code_interpreter", "sandbox_eval", "github"],
    approvalRequired: false,
    avatarColor: "from-cyan-500 to-teal-600",
    icon: "Code2",
  },
  {
    id: "agent-runtime-engineer",
    name: "Agent Runtime Engineer",
    role: "soul.md governance, SKILL.md packages, MCP tool adapter orchestration, PAL compiler config.",
    phases: ["Design", "Development", "Debugging"],
    tools: ["file_read", "file_write", "memory_manage", "mcp_runner"],
    approvalRequired: false,
    avatarColor: "from-violet-500 to-indigo-600",
    icon: "Cpu",
  },
  {
    id: "identity-commerce-qa",
    name: "Identity & Commerce QA",
    role: "Authentication (OAuth, JWT, Cognito), Stripe payment gateways, subscription lifecycle.",
    phases: ["Development", "Deploy"],
    tools: ["file_read", "sandbox_eval", "auth_validator"],
    approvalRequired: true,
    avatarColor: "from-amber-500 to-orange-600",
    icon: "ShieldAlert",
  },
  {
    id: "quality-engineer",
    name: "Quality Engineer",
    role: "Functional testing, integration regression, E2E benchmarks, performance profiling.",
    phases: ["Development", "Deploy", "Debugging"],
    tools: ["file_read", "code_interpreter", "test_runner"],
    approvalRequired: false,
    avatarColor: "from-emerald-500 to-green-600",
    icon: "CheckCircle2",
  },
  {
    id: "devops-release-engineer",
    name: "DevOps & Release Engineer",
    role: "CI/CD pipelines, Vercel deployments, AWS Bedrock AgentCore infrastructure, rollback gates.",
    phases: ["Deploy"],
    tools: ["cloud_cli", "github", "vercel_cli", "deploy_checker"],
    approvalRequired: true,
    avatarColor: "from-rose-500 to-red-600",
    icon: "Rocket",
  },
  {
    id: "security-reviewer",
    name: "Security Reviewer",
    role: "Threat modeling, credential leak detection, dependency CVE scanning, auth boundary audit.",
    phases: ["Design", "Development", "Deploy", "Debugging"],
    tools: ["file_read", "sec_scan", "secret_detector"],
    approvalRequired: false,
    avatarColor: "from-red-500 to-orange-700",
    icon: "Lock",
  },
];
