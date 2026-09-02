<img src="https://r2cdn.perplexity.ai/pplx-full-logo-primary-dark%402x.png" style="height:64px;margin-right:32px"/>

# We are building an Agent Employee. It is a CTO/Dev Engineer for Diamitani Industries. It's role is to create and build all web projects, including, Project Plan, Product Specifications and Requirements Document, System Architecture (and end user/ workflow process architecture), Jobs to be Done Build Plan with NPAO integration, system prompts for building soul.md, skill.md files, mcp scripts for tool integrations, custom functions and scrips and tool calling, ci/cd and deployment for all cloud services (Azure, GCP, AWS) and all services for each platform. Github, Agent harnesses and setup, configuration for Open Claw Hermes, etc, custom agent development with Gemini ADK, OpenAI Responses API and Agents SDK, Antrhropic, AWS Bedrock / Agent Core, Azure AI Foundry etc. It Neds to be able to take any prompt and help build, especially in sandbox with cli and secrets, like Claude Code desk top etc and actually create web apps, call endpoints, build functioning backend and front ends etc. uses tasteskill.dev for design as well as gstack and the PAL /Rostr method ingrained within. Needs to be able to read other files in folder and manage and take on tasks for quality assurance and checking sign up sign on oauth pricing ecommerce, check out pages, directories, landing pages, etc. and agents and skills and web apps and iOS and android apps.builld all related skills and sub agents and then I @Skill PAL

I’ve packaged this as a **governed orchestration skill**, not a single autonomous “do everything” agent. Its scope is to turn an approved Diamitani request into a planned, implemented, tested, and release-ready product delivery while delegating bounded work to specialist sub-agents.

## Classification

- **Primary artifact:** Skill — a repeatable product-to-production procedure with clear inputs, outputs, tool boundaries, and quality gates.
- **Supporting architecture:** Sub-agent registry — specialists for product architecture, JTBD/NPAO planning, application engineering, agent runtime work, QA, DevOps, and security.
- **Not an autonomous employee:** Production releases, cloud/DNS changes, live OAuth/payment changes, permissions, external messaging, and destructive actions remain approval-gated.

I kept runtime integration provider-neutral: AWS positions Bedrock AgentCore as compatible with multiple agent frameworks and models, which supports using adapters rather than hard-wiring the skill to one agent SDK.[^1_1]

## Delivered package

The following downloadable artifacts are ready:


| Artifact | Role |
| :-- | :-- |
| **SKILL.md** | Canonical Diamitani Agent Employee skill package, including procedure, permissions, QA gates, escalation, and examples |
| **manifest-entry.yaml** | Registration metadata for PAL/ROSTR or an Instruction Architect |
| **sub-agent-registry.yaml** | Bounded specialist-agent definitions and their completion evidence |
| **delivery-package-template.md** | Reusable template for PRD, architecture, JTBD/NPAO plan, test evidence, and approval requests |
| **validate_skill_package.py** | Local structural validator for the package |
| **diamintani-agent-employee-skill.md** | Expanded reference version of the same core delivery skill |

## Operating design

The coordinator is accountable for the complete delivery chain:

1. Intake, requirement classification, and workspace/environment resolution.
2. Repository and instruction inspection before any change.
3. RAG-DAL-backed product and vendor research where current facts matter.
4. Project plan, PRD, system architecture, end-user workflow architecture, and JTBD/NPAO-ranked build plan.
5. Delegation to bounded sub-agents with explicit tools, artifacts, and evidence requirements.
6. Sandbox implementation of frontend, backend, APIs, MCP tools, custom functions, prompts, skills, and agent-runtime adapters.
7. QA of authentication, OAuth, pricing, checkout, webhooks, directory behavior, forms, accessibility, and endpoints.
8. CI/CD, infrastructure, observability, migrations, health checks, and rollback preparation.
9. A verification report that clearly distinguishes “ready for sandbox,” “ready for staging,” “blocked,” and “ready for production approval.”

## Integration and testing

Place these files in one skill directory, with the canonical file named `SKILL.md`, then run:

```bash
python validate_skill_package.py .
```

Use the package in this order:

1. Register `manifest-entry.yaml` in the ROSTR/PAL instruction catalog.
2. Make the **Diamitani Agent Employee** the delivery coordinator.
3. Load `sub-agent-registry.yaml` as eligible, non-autonomous worker profiles.
4. Require `delivery-package-template.md` for every substantial project.
5. Bind tools through environment-specific adapters, for example:
    - `ENV:GITHUB_TOKEN`
    - `ENV:AWS_REGION`
    - `ENV:AZURE_SUBSCRIPTION_ID`
    - `ENV:GCP_PROJECT_ID`
    - `ENV:STRIPE_SECRET_KEY`
6. Keep secrets in the approved secrets manager; do not place values in prompts, `soul.md`, `SKILL.md`, source control, or generated reports.

## Assumptions and open decisions

- **Stated requirement:** The employee supports web, iOS, Android, backend, cloud, agent, MCP, CI/CD, QA, and architecture work.
- **Inferred requirement:** PAL/ROSTR is the governing orchestration layer; NPAO prioritizes work, rather than directly executing deployments.
- **Optional enhancement:** Add provider-specific adapter skills after you choose the initial runtime: Gemini ADK, OpenAI Responses/Agents SDK, Anthropic, Bedrock AgentCore, Azure AI Foundry, or a multi-provider adapter.
- **Open decision:** The exact `tasteskill.dev` integration contract was not verifiable from the available search results, so the package treats it as an approved design-tool adapter pending its URL, API/docs, authentication method, and expected output format.
- **Open decision:** “OpenClaw Hermes” should be resolved into a precise runtime topology—OpenClaw, Hermes, or an interoperability layer—before implementation. The current package deliberately prevents an unreviewed runtime lock-in.
- **Approval required:** Before enabling any live payment, OAuth, cloud account mutation, DNS/domain update, production deploy, external communication, or role/permission change.
<span style="display:none">[^1_10][^1_11][^1_12][^1_13][^1_14][^1_15][^1_2][^1_3][^1_4][^1_5][^1_6][^1_7][^1_8][^1_9]</span>

<div align="center">⁂</div>

[^1_1]: https://aws.amazon.com/bedrock/agentcore/

[^1_2]: https://help.sigmacomputing.com/docs/manage-external-ai-integrations

[^1_3]: https://github.com/snarktank/ai-dev-tasks

[^1_4]: https://dev.to/truongpx396/hermes-agent-the-self-improving-agent-framework-and-how-it-compares-to-openclaw-goclaw-22mc

[^1_5]: https://www.bitslovers.com/bedrock-vs-azure-ai-foundry-vs-vertex-ai/

[^1_6]: https://www.reddit.com/r/IndieDev/comments/1t9evhw/game_design_and_task_management_tools/

[^1_7]: https://trilogyai.substack.com/p/technical-deep-dive-hermes-vs-openclaw

[^1_8]: https://www.youtube.com/watch?v=WyGK8UcAxKo

[^1_9]: https://dribbble.com/tags/task-manager

[^1_10]: https://petronellatech.com/blog/openclaw-vs-hermes-agent-2026/

[^1_11]: https://hidekazu-konishi.com/entry/enterprise_ai_agent_design_notes_part1.html

[^1_12]: https://www.alphamatch.ai/blog/hermes-agent-vs-openclaw-ai-agent-frameworks

[^1_13]: https://taskfile.dev/

[^1_14]: https://innfactory.ai/en/blog/openclaw-vs-hermes-agent-comparison/

[^1_15]: https://dev.to/vithanco/i-built-a-task-manager-that-automatically-kills-tasks-youre-ignoring-49dk


---

# Create a comprehensive Product Requirement Document (PRD) template and system prompt for the Diamitani Industries CTO and Dev Engineer AI agent, detailing role boundaries, technical stack constraints, API design standards, error-handling protocols, and automated milestone tracking rules for web project delivery

Created a comprehensive PRD template and a production-governed system prompt for the Diamitani Industries CTO \& Dev Engineer AI. The pair is designed to make every web-project delivery traceable from JTBD/NPAO prioritization through implementation, QA, CI/CD, and explicitly approved production release.

## Delivered artifacts

| Artifact | Purpose |
| :-- | :-- |
| **Diamitani Web Delivery PRD Template** | Full project template for product requirements, workflows, architecture, stack decisions, API contracts, QA, risk, milestones, and approvals |
| **Diamitani CTO \& Dev Engineer System Prompt** | Operational role definition with technical boundaries, code/API rules, error protocol, milestone automation, quality gates, and approval controls |

## Included controls

The system prompt establishes that the agent can plan, inspect repositories, build in approved workspaces, run tests, prepare CI/CD and infrastructure artifacts, and track milestones—but it cannot autonomously deploy production changes, alter cloud resources/DNS, activate live payment or OAuth configuration, modify permissions, expose secrets, or send external communications.

The PRD template contains:

- Requirement classification: stated, inferred, optional, and open decisions
- JTBD statements plus NPAO-ranked build plan
- User journeys for sign-up, sign-in, OAuth, pricing, checkout, core flows, and failure recovery
- Stack-decision and data-retention registers
- API inventory, typed validation standards, idempotency requirements, webhook verification, pagination, and standard error envelopes
- Error taxonomy for validation, authorization, dependency, rate-limit, conflict, and unexpected failures
- Milestone ledger with evidence-based rules for `Blocked`, `At risk`, `Complete`, and production verification
- QA, security, observability, rollback, and approval registers

The prompt preserves runtime flexibility through adapters rather than assuming one provider or framework; that is consistent with AWS’s positioning of Bedrock AgentCore as framework- and model-agnostic.[^2_1]

<div align="center">⁂</div>

[^2_1]: https://aws.amazon.com/bedrock/agentcore/


---

# I need a soul.md for hte agent not just a skill I need everything asked for

You’re right — a `SKILL.md` is only a procedure. I’ve now created the actual **`soul.md`**: the durable identity, authority model, engineering values, safety boundaries, decision behavior, and definition of done for the Diamitani CTO \& Dev Engineer AI.

## Complete agent package

| Layer | Artifact | Function |
| :-- | :-- | :-- |
| Identity and authority | **soul.md** | Defines who DI-CTO is, what it owns, how it thinks, approval boundaries, escalation behavior, and engineering standards |
| Runtime execution | **Diamitani CTO \& Dev Engineer System Prompt** | Runtime-specific operating protocol, response format, tool behavior, API and error rules, delivery workflow, and milestone automation |
| Product delivery contract | **Diamitani Web Delivery PRD Template** | Requirements, JTBD/NPAO plan, architecture, APIs, security, QA, release, and approval template |
| Reusable procedure | **SKILL.md** | Product-to-production delivery process for invoking the CTO agent |
| Specialist delegation | **sub-agent-registry.yaml** | Product architect, NPAO planner, app engineer, agent-runtime engineer, QA, DevOps, and security reviewer scopes |
| Registration | **manifest-entry.yaml** | PAL/ROSTR catalog metadata and approval-gate declarations |
| Quality support | **delivery-package-template.md** | Project-level evidence and milestone package |
| Validation | **validate_skill_package.py** | Checks the required skill-package structure |

## What the soul adds

The new soul establishes DI-CTO as an accountable technical delivery owner that can:

- Read project files and inspect repositories before modifying code.
- Build functioning sandbox web, backend, mobile, agent, MCP, API, CI/CD, IaC, and QA artifacts.
- Operate through JTBD, NPAO, PAL/ROSTR, TaskSkill design, and evidence-based milestones.
- Build agent systems using distinct layers for `soul.md`, system prompts, skills, tool/MCP schemas, runtime adapters, and memory.
- Validate OAuth, sign-up/sign-in, authorization, pricing, checkout, webhooks, search/directories, accessibility, error recovery, and operational readiness.
- Prepare production deployments—but never perform live production, billing, DNS, OAuth, cloud-resource, permission, secret, or external communication changes without an exact approval gate.


## Recommended hierarchy

Use the package in this order:

```text
soul.md
  └── System Prompt
        └── SKILL.md
              └── Sub-agent registry
                    └── Tool / MCP contracts
                          └── Runtime adapters
```

The soul stays stable across platforms. The system prompt changes per runtime. Skills define repeatable work. MCP tools and adapters grant narrowly scoped capabilities. This separation is appropriate for a multi-runtime architecture, including framework- and model-flexible environments such as Bedrock AgentCore.[^3_1]

## Next implementation step

Place `soul.md` at the root of the CTO/Dev Engineer agent package, load the system prompt as the runtime instruction layer, and register `SKILL.md` plus the sub-agent registry in PAL/ROSTR. Then create runtime-specific adapter configurations for the first execution environment you want to enable—such as Claude Code-style sandbox execution, OpenAI Agents SDK, Gemini ADK, Bedrock AgentCore, Azure AI Foundry, or OpenClaw/Hermes.

<div align="center">⁂</div>

[^3_1]: https://aws.amazon.com/bedrock/agentcore/

