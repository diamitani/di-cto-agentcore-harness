# Knowledge Index — Diamitani Industries CTO Agent

This index organizes all documentation sources available to DI-CTO for research, implementation, and architecture decisions. Always prefer Tier 1 (official/authoritative) sources.

---

## Source Tiers

| Tier | Weight | Examples |
|---|---|---|
| 1 — Authoritative | 1.0 | Official vendor docs, RFC specs, AWS/Azure/GCP reference |
| 2 — Verified | 0.75 | Engineering blogs from vendors, major tech publications |
| 3 — Community | 0.40 | Stack Overflow, GitHub issues, Reddit, newsletters |

---

## AWS Services

### Bedrock & AgentCore
- **Bedrock AgentCore**: https://aws.amazon.com/bedrock/agentcore/
- **Bedrock AgentCore Runtime**: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/runtime.html
- **AgentCore Memory**: https://docs.aws.amazon.com/bedrock-agentcore/latest/devguide/memory.html
- **AgentCore CLI (`agentcore`)**: `pip install amazon-bedrock-agentcore` → `agentcore --help`
- **Reference implementation**: [`Knowledge/Mac Mini archives/rostr-agentcore-backend/`](Mac%20Mini%20archives/rostr-agentcore-backend/)

### Bedrock Foundation Models
- **Model catalog**: https://docs.aws.amazon.com/bedrock/latest/userguide/models-supported.html
- **Claude on Bedrock**: https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic.html
- **Converse API**: https://docs.aws.amazon.com/bedrock/latest/userguide/conversation-inference.html

### Compute & Storage
- **EC2 User Guide**: https://docs.aws.amazon.com/AWSEC2/latest/UserGuide/
- **S3 Developer Guide**: https://docs.aws.amazon.com/AmazonS3/latest/userguide/
- **Lambda Developer Guide**: https://docs.aws.amazon.com/lambda/latest/dg/
- **ECS Developer Guide**: https://docs.aws.amazon.com/AmazonECS/latest/developerguide/
- **Dev Server Setup**: [`Knowledge/Mac Mini archives/diamitani-aws-setup.md`](Mac%20Mini%20archives/diamitani-aws-setup.md)

### Identity & Security
- **IAM User Guide**: https://docs.aws.amazon.com/IAM/latest/UserGuide/
- **Secrets Manager**: https://docs.aws.amazon.com/secretsmanager/latest/userguide/
- **Cognito Developer Guide**: https://docs.aws.amazon.com/cognito/latest/developerguide/

### CI/CD & Infrastructure
- **CDK v2 API Reference**: https://docs.aws.amazon.com/cdk/api/v2/
- **CodePipeline**: https://docs.aws.amazon.com/codepipeline/latest/userguide/
- **CloudWatch**: https://docs.aws.amazon.com/AmazonCloudWatch/latest/monitoring/
- **CloudFormation**: https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/

---

## Azure Services

### AI & Agents
- **Azure AI Foundry**: https://learn.microsoft.com/en-us/azure/ai-foundry/
- **Azure AI Agent Service**: https://learn.microsoft.com/en-us/azure/ai-services/agents/
- **Azure OpenAI Service**: https://learn.microsoft.com/en-us/azure/ai-services/openai/

### Compute & App Services
- **App Service**: https://learn.microsoft.com/en-us/azure/app-service/
- **Azure Functions**: https://learn.microsoft.com/en-us/azure/azure-functions/
- **Container Apps**: https://learn.microsoft.com/en-us/azure/container-apps/

### Identity & Security
- **Azure AD B2C**: https://learn.microsoft.com/en-us/azure/active-directory-b2c/
- **Key Vault**: https://learn.microsoft.com/en-us/azure/key-vault/

---

## GCP Services

### AI & Agents
- **Vertex AI Agent Builder**: https://cloud.google.com/agent-builder/docs
- **Gemini API**: https://ai.google.dev/gemini-api/docs
- **Gemini ADK (Agent Development Kit)**: https://google.github.io/adk-docs/

### Compute & Storage
- **Cloud Run**: https://cloud.google.com/run/docs
- **Cloud Functions**: https://cloud.google.com/functions/docs
- **Cloud Storage**: https://cloud.google.com/storage/docs
- **BigQuery**: https://cloud.google.com/bigquery/docs

### Identity & Security
- **Identity Platform**: https://cloud.google.com/identity-platform/docs
- **Secret Manager**: https://cloud.google.com/secret-manager/docs

---

## AI Model Providers

### Anthropic
- **API Reference**: https://docs.anthropic.com/en/api/
- **Claude Models**: https://docs.anthropic.com/en/docs/about-claude/models
- **Tool Use (Function Calling)**: https://docs.anthropic.com/en/docs/build-with-claude/tool-use
- **Computer Use**: https://docs.anthropic.com/en/docs/build-with-claude/computer-use
- **Prompt Caching**: https://docs.anthropic.com/en/docs/build-with-claude/prompt-caching
- **Python SDK**: https://github.com/anthropic-ai/anthropic-sdk-python

### OpenAI
- **Responses API**: https://platform.openai.com/docs/api-reference/responses
- **Agents SDK**: https://openai.github.io/openai-agents-python/
- **Function Calling**: https://platform.openai.com/docs/guides/function-calling
- **Structured Outputs**: https://platform.openai.com/docs/guides/structured-outputs
- **Realtime API**: https://platform.openai.com/docs/guides/realtime

### Google Gemini / ADK
- **Gemini ADK Docs**: https://google.github.io/adk-docs/
- **ADK GitHub**: https://github.com/google/adk-python
- **Gemini API Docs**: https://ai.google.dev/gemini-api/docs
- **Multimodal**: https://ai.google.dev/gemini-api/docs/vision

---

## ROSTR Framework (rostragent.com)

- **Main Site**: https://rostragent.com
- **ROSTR Framework Reference**: [`Knowledge/Mac Mini archives/rostr-agent-framework/MASTER_AGENT_PROMPT.md`](Mac%20Mini%20archives/rostr-agent-framework/MASTER_AGENT_PROMPT.md)
- **ROSTR Research Paper**: [`Knowledge/Mac Mini archives/ROSTR_Research_Paper.md`](Mac%20Mini%20archives/ROSTR_Research_Paper.md)
- **ROSTR Complete Delivery**: [`Knowledge/Mac Mini archives/ROSTR_COMPLETE_DELIVERY.md`](Mac%20Mini%20archives/ROSTR_COMPLETE_DELIVERY.md)
- **ROSTR Deployment Guide**: [`Knowledge/Mac Mini archives/ROSTR_DEPLOYMENT_GUIDE.md`](Mac%20Mini%20archives/ROSTR_DEPLOYMENT_GUIDE.md)
- **Harness Form Guide**: [`Knowledge/Mac Mini archives/rostr-harness-form-guide.md`](Mac%20Mini%20archives/rostr-harness-form-guide.md)
- **Skills Inventory**: [`Knowledge/Mac Mini archives/skills_inventory.json`](Mac%20Mini%20archives/skills_inventory.json)

### ROSTR Layers
| Layer | Purpose | Reference |
|---|---|---|
| **PAL** | Prompt Abstraction Layer — compiles intent to instructions | MASTER_AGENT_PROMPT.md §Layer 1 |
| **RAG DAL** | Dynamic Acquisition Layer — 3-tier knowledge retrieval | MASTER_AGENT_PROMPT.md §Layer 2 |
| **NPAO** | Navigate, Prioritize, Allocate, Orchestrate — 5D task routing | MASTER_AGENT_PROMPT.md §Layer 3 |
| **Rostr Hub** | Central platform — agent registry, state, persistent context | MASTER_AGENT_PROMPT.md §Layer 4 |

---

## DI-CTO Agent Artifacts

| Artifact | Path | Purpose |
|---|---|---|
| Soul | [`soul.md`](../soul.md) | DI-CTO identity and authority |
| System Prompt | [`ctoagent/diamintani-cto-dev-engineer-system-prompt.md`](ctoagent/diamintani-cto-dev-engineer-system-prompt.md) | Runtime operational protocol |
| Skill | [`ctoagent/SKILL.md`](ctoagent/SKILL.md) | Delivery procedure |
| Sub-agent Registry | [`ctoagent/sub-agent-registry.yaml`](ctoagent/sub-agent-registry.yaml) | Specialist agent definitions |
| PRD Template | [`ctoagent/diamintani-web-delivery-prd-template.md`](ctoagent/diamintani-web-delivery-prd-template.md) | Project requirements template |
| Delivery Package Template | [`ctoagent/delivery-package-template.md`](ctoagent/delivery-package-template.md) | Running delivery record |
| Manifest | [`ctoagent/manifest-entry.yaml`](ctoagent/manifest-entry.yaml) | PAL/ROSTR catalog registration |

---

## Frontend & Full-Stack

- **Next.js**: https://nextjs.org/docs
- **React**: https://react.dev/reference/react
- **TypeScript**: https://www.typescriptlang.org/docs/
- **shadcn/ui**: https://ui.shadcn.com/docs
- **Tailwind CSS**: https://tailwindcss.com/docs
- **Zustand**: https://docs.pmnd.rs/zustand/getting-started/introduction
- **React Query (TanStack)**: https://tanstack.com/query/latest/docs

---

## Backend & Database

- **Supabase**: https://supabase.com/docs
- **Supabase Auth (PKCE)**: https://supabase.com/docs/guides/auth
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Prisma ORM**: https://www.prisma.io/docs/
- **FastAPI**: https://fastapi.tiangolo.com/
- **Node.js**: https://nodejs.org/en/docs/

---

## Payments & Commerce

- **Stripe**: https://stripe.com/docs
- **Stripe Checkout**: https://stripe.com/docs/payments/checkout
- **Stripe Webhooks**: https://stripe.com/docs/webhooks
- **Stripe Subscriptions**: https://stripe.com/docs/billing/subscriptions/overview

---

## DevOps & CI/CD

- **GitHub Actions**: https://docs.github.com/en/actions
- **Docker**: https://docs.docker.com/
- **Terraform**: https://developer.hashicorp.com/terraform/docs
- **AWS CDK**: https://docs.aws.amazon.com/cdk/api/v2/
- **Vercel**: https://vercel.com/docs

---

## Mobile

- **React Native**: https://reactnative.dev/docs/getting-started
- **Expo**: https://docs.expo.dev/
- **Swift (iOS)**: https://developer.apple.com/documentation/swift
- **Kotlin (Android)**: https://developer.android.com/kotlin

---

## MCP (Model Context Protocol)

- **MCP Specification**: https://modelcontextprotocol.io/docs
- **MCP Python SDK**: https://github.com/modelcontextprotocol/python-sdk
- **MCP TypeScript SDK**: https://github.com/modelcontextprotocol/typescript-sdk

---

*Last updated: 2026-08-16. Add new service docs here as they are referenced in projects.*
