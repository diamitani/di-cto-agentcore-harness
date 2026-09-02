# DI-CTO AgentCore Harness

AWS Bedrock AgentCore runtime for the Diamitani Industries CTO Agent.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      AgentCore Runtime                       │
│                    (AWS Bedrock us-east-1)                   │
├─────────────────────────────────────────────────────────────┤
│  agent.py              │ Entrypoint: PAL → Memory → LLM     │
│  agentcore.yaml        │ Runtime config                     │
│  config/               │ Soul loader, env                   │
│  skills/               │ Skill wrappers                     │
│  tools/                │ MCP adapters                       │
│  sub_agents/           │ Registry + dispatch                │
│  tests/                │ Unit + integration tests           │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Run locally
python agent.py --task "Hello World"

# Deploy to AgentCore Runtime
make deploy

# Run tests
make test
```

## Configuration

```bash
# Copy env template
cp config/env.example .env

# Edit .env with your values
cat .env
AWS_REGION=us-east-1
BEDROCK_AGENT_ID=your-agent-id
ANTHROPIC_API_KEY=your-key  # fallback

# Load env
export $(cat .env | xargs)
```

## Usage

### Direct Invocation

```python
from agent import DICTOAgent

agent = DICTOAgent()
result = agent.run("Build a landing page")
```

### Via AgentCore CLI

```bash
agentcore invoke \
  --agent-id ${BEDROCK_AGENT_ID} \
  --input '{"task": "Build a landing page"}'
```

## Project Structure

```
di-cto-agentcore/
├── agent.py              # Main entrypoint
├── agentcore.yaml        # Runtime configuration
├── requirements.txt      # Python dependencies
├── Makefile             # Build/deploy commands
├── config/
│   ├── soul_loader.py   # Loads soul.md into context
│   └── env.example      # Environment template
├── skills/
│   ├── delivery_skill.py
│   ├── research_skill.py
│   └── qa_skill.py
├── tools/
│   ├── github_tool.py
│   ├── filesystem_tool.py
│   ├── web_tool.py
│   ├── cloud_cli_tool.py
│   └── secrets_tool.py
├── sub_agents/
│   ├── registry.py       # YAML wrapper
│   └── coordinator.py    # Dispatch logic
└── tests/
    ├── test_agent.py
    └── test_tools.py
```

## Sub-Agents

The harness delegates to specialist sub-agents registered in `sub_agent_registry.yaml`:

- `product-architect` — Planning, PRD, architecture
- `application-engineer` — Frontend, backend, APIs
- `agent-runtime-engineer` — agent.py, soul.md, MCP
- `quality-engineer` — Test, QA, E2E
- `devops-release-engineer` — CI/CD, deploy, rollback
- `security-reviewer` — Threat model, auth boundary

## Approval Gates

Production-sensitive operations require explicit approval:
- `cloud_resource_create_or_delete`
- `domain_or_dns_change`
- `oauth_client_create_or_rotate`
- `payment_provider_live_mode_change`
- `production_deploy`

## License

Diamitani Industries Internal Use Only
