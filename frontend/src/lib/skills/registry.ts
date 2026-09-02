/**
 * ROSTR Platform Skills Inventory
 */

export interface SkillDefinition {
  id: string;
  name: string;
  category: "agent-architect" | "marketing" | "legal-finance" | "engineering" | "music-business" | "productivity" | "autonomous";
  description: string;
  version: string;
  icon?: string;
  promptSnippet: string;
  tags: string[];
}

export const SKILLS_INVENTORY: SkillDefinition[] = [
  {
    id: "agent-architect",
    name: "Full-Stack Agent Architect",
    category: "agent-architect",
    description: "Design multi-agent system instructions, tech stack configurations, and PAL compiler execution boundaries.",
    version: "2.1.0",
    tags: ["architecture", "pal", "npao", "system-design"],
    promptSnippet: "Analyze system requirements and synthesize a multi-agent harness architecture with PAL 5-stage compilation.",
  },
  {
    id: "prospect-automation-engine",
    name: "Prospect Automation Engine (GTM)",
    category: "marketing",
    description: "Autonomous GTM architect: CRM Shield dedupe, contact discovery, and PAS email copywriting.",
    version: "3.0.0",
    tags: ["gtm", "n8n", "copywriting", "outbound"],
    promptSnippet: "Construct an end-to-end outbound prospecting pipeline with CRM deduplication and PAS email sequences.",
  },
  {
    id: "uysg-email-marketing",
    name: "High-Converting Email Marketing",
    category: "marketing",
    description: "Multi-touch campaign builder: Save-the-Date, event reminders, review request funnels, and newsletter sequences.",
    version: "2.4.0",
    tags: ["email", "conversion", "newsletters", "promotions"],
    promptSnippet: "Draft a 4-part email marketing nurture sequence optimized for open rates and direct conversion.",
  },
  {
    id: "uysg-social-media",
    name: "Social Media Growth & Video Hooks",
    category: "marketing",
    description: "Multi-platform strategy: TikTok/Reels short-form hooks, posting cadences, and viral trend positioning.",
    version: "1.8.0",
    tags: ["social", "tiktok", "reels", "growth"],
    promptSnippet: "Generate 5 viral short-form video hooks and a 7-day multi-channel social posting schedule.",
  },
  {
    id: "royalty-legal-contracts",
    name: "Music Royalty & Contract Automation",
    category: "legal-finance",
    description: "P.R.O. registration, split-sheet agreements, master sync licensing, and smart contract royalty distributions.",
    version: "2.0.0",
    tags: ["legal", "contracts", "royalties", "ascap", "bmi"],
    promptSnippet: "Generate a production split-sheet agreement and master synchronization license with 50/50 publishing terms.",
  },
  {
    id: "claude-code-runner",
    name: "Claude Code CLI Substrate",
    category: "autonomous",
    description: "Autonomous software engineering loop: feature scaffolding, test synthesis, and PR code reviews.",
    version: "2.2.0",
    tags: ["claude-code", "coding", "git", "scaffolding"],
    promptSnippet: "Scaffold a production Next.js 15 App Router component with TypeScript, Tailwind CSS, and clean unit tests.",
  },
  {
    id: "sandbox-evaluator",
    name: "Vercel Code Sandbox Evaluator",
    category: "engineering",
    description: "Safely execute TypeScript, Node.js, and Python vertical slices in an isolated sandbox runtime.",
    version: "1.5.0",
    tags: ["sandbox", "testing", "isolated-execution"],
    promptSnippet: "Execute this JavaScript code snippet in the sandbox and return formatted stdout results.",
  },
  {
    id: "embedded-captions-vfx",
    name: "Embedded Captions & Motion Graphics",
    category: "marketing",
    description: "Kinetic animated captions, typography overlays, and automated transcription styling.",
    version: "1.9.0",
    tags: ["video", "captions", "motion-graphics", "typography"],
    promptSnippet: "Generate styling directives and kinetic caption timestamps for talking-head video footage.",
  },
  {
    id: "svg-logo-designer",
    name: "SVG Brand & Logo Designer",
    category: "agent-architect",
    description: "Generate scalable vector logos, brand marks, and iconography directly in clean SVG code.",
    version: "1.2.0",
    tags: ["design", "svg", "branding", "vectors"],
    promptSnippet: "Create a modern, minimalist SVG logo with geometric gradients for a high-tech agent platform.",
  },
];
