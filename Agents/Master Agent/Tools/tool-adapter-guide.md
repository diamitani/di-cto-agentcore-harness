# Tool Adapter Guide

**Purpose:** How to bind DI-CTO's provider-neutral tool contracts to specific runtime environments. Use this when configuring a new runtime or migrating between runtimes.

---

## Design Principle

All tool contracts in `mcp-tool-contracts.md` are **provider-neutral**. A runtime adapter wraps each tool with the specific SDK/format required by the runtime. Switching runtimes means replacing adapters — not rewriting tool logic.

```
Tool Contract (neutral schema)
  └── Runtime Adapter
        ├── Bedrock AgentCore format
        ├── Anthropic tool_use format
        ├── OpenAI function_calling format
        ├── Gemini ADK tool format
        └── Azure AI Foundry format
```

---

## AWS Bedrock AgentCore

**Runtime:** `amazon-bedrock-agentcore` Python SDK  
**Tool format:** Standard Python functions decorated with `@app.tool` (or registered via `app.register_tool`)

### Example: filesystem_read adapter

```python
from amazon_bedrock_agentcore import app

@app.tool(
    name="filesystem_read",
    description="Read a file from the resolved workspace.",
    input_schema={
        "type": "object",
        "properties": {
            "path": {"type": "string"},
            "start_line": {"type": "integer"},
            "end_line": {"type": "integer"}
        },
        "required": ["path"]
    }
)
def filesystem_read_adapter(path: str, start_line: int = None, end_line: int = None) -> dict:
    from tools.filesystem_tool import filesystem_read
    return filesystem_read(path, start_line, end_line)
```

### agentcore.yaml tool registration

```yaml
tools:
  - name: filesystem_read
    type: inline
    handler: agent.filesystem_read_adapter
  - name: github_read
    type: inline
    handler: agent.github_read_adapter
  - name: web_fetch
    type: inline
    handler: agent.web_fetch_adapter
  - name: endpoint_call
    type: inline
    handler: agent.endpoint_call_adapter
  - name: secrets_read
    type: inline
    handler: agent.secrets_read_adapter
  - name: cloud_cli
    type: inline
    handler: agent.cloud_cli_adapter
```

---

## Anthropic (Direct API — Tool Use)

**SDK:** `anthropic` Python SDK  
**Tool format:** `tools=[ { "name": ..., "description": ..., "input_schema": { ... } } ]`

### Example: github_read adapter

```python
import anthropic

tools = [
    {
        "name": "github_read",
        "description": "Read GitHub repository content, PR diffs, issues.",
        "input_schema": {
            "type": "object",
            "properties": {
                "action": {
                    "type": "string",
                    "enum": ["get_file", "list_files", "get_pr", "list_issues", "get_workflow_run"]
                },
                "repo": {"type": "string"},
                "ref": {"type": "string"},
                "path": {"type": "string"},
                "pr_number": {"type": "integer"}
            },
            "required": ["action", "repo"]
        }
    }
]

client = anthropic.Anthropic()
response = client.messages.create(
    model="claude-sonnet-4-6-20250514",
    max_tokens=4096,
    tools=tools,
    messages=[{"role": "user", "content": "..."}]
)

# Handle tool_use blocks
for block in response.content:
    if block.type == "tool_use":
        result = dispatch_tool(block.name, block.input)
        # Continue conversation with tool_result
```

---

## OpenAI Agents SDK

**SDK:** `openai-agents` Python SDK  
**Tool format:** `@function_tool` decorator or `FunctionTool` class

```python
from agents import Agent, function_tool, Runner

@function_tool
def filesystem_read(path: str, start_line: int = None, end_line: int = None) -> dict:
    """Read a file from the resolved workspace."""
    from tools.filesystem_tool import filesystem_read as _read
    return _read(path, start_line, end_line)

agent = Agent(
    name="di-cto",
    instructions="You are DI-CTO...",  # Load from soul_loader.py
    tools=[filesystem_read, github_read, web_fetch, endpoint_call, secrets_read, cloud_cli],
    model="gpt-4o"
)

result = Runner.run_sync(agent, "Build a landing page for...")
```

---

## Gemini ADK

**SDK:** `google-adk` Python SDK  
**Tool format:** Python functions with docstrings + type hints, passed to `Agent(tools=[...])`

```python
from google.adk.agents import Agent
from google.adk.tools import FunctionTool

def filesystem_read(path: str) -> dict:
    """
    Read a file from the resolved workspace.
    
    Args:
        path: Absolute or workspace-relative path to file or directory.
    
    Returns:
        dict with content, lines, bytes, is_directory, children.
    """
    from tools.filesystem_tool import filesystem_read as _read
    return _read(path)

agent = Agent(
    name="di-cto",
    model="gemini-2.5-pro",
    instruction="You are DI-CTO...",  # Load from soul_loader.py
    tools=[
        FunctionTool(filesystem_read),
        FunctionTool(github_read),
        FunctionTool(web_fetch),
    ]
)
```

---

## Azure AI Foundry

**SDK:** `azure-ai-projects` Python SDK  
**Tool format:** `FunctionTool` from `azure.ai.projects.models`

```python
from azure.ai.projects import AIProjectClient
from azure.ai.projects.models import FunctionTool, ToolSet
import json

def filesystem_read(path: str) -> str:
    from tools.filesystem_tool import filesystem_read as _read
    result = _read(path)
    return json.dumps(result)

functions = FunctionTool({filesystem_read, github_read, web_fetch})
toolset = ToolSet()
toolset.add(functions)

agent = project_client.agents.create_agent(
    model="gpt-4o",
    name="di-cto",
    instructions="You are DI-CTO...",
    toolset=toolset
)
```

---

## Multi-Provider Selector Pattern

Use this pattern in `agent.py` to select the runtime adapter based on configuration:

```python
import os

PROVIDER = os.getenv("AGENT_PROVIDER", "bedrock")  # bedrock | anthropic | openai | gemini | azure

def get_tools_for_provider(provider: str) -> list:
    from tools.filesystem_tool import filesystem_read
    from tools.github_tool import github_read, github_write
    from tools.web_tool import web_fetch
    from tools.endpoint_tool import endpoint_call
    from tools.secrets_tool import secrets_read
    from tools.cloud_cli_tool import cloud_cli

    raw_tools = [filesystem_read, github_read, github_write,
                 web_fetch, endpoint_call, secrets_read, cloud_cli]

    if provider == "anthropic":
        return _wrap_anthropic(raw_tools)
    elif provider == "openai":
        return _wrap_openai(raw_tools)
    elif provider == "gemini":
        return _wrap_gemini(raw_tools)
    elif provider == "azure":
        return _wrap_azure(raw_tools)
    else:  # bedrock (default)
        return raw_tools  # Registered via @app.tool decorators
```

---

## Secrets Reference

All tool adapters must use ENV references only:

| Secret | ENV Reference | Used By |
|---|---|---|
| Anthropic API Key | `ENV:ANTHROPIC_API_KEY` | LLM calls |
| OpenAI API Key | `ENV:OPENAI_API_KEY` | LLM calls (fallback) |
| GitHub Token | `ENV:GITHUB_TOKEN` | github_read, github_write |
| AWS Access Key | `ENV:AWS_ACCESS_KEY_ID` | cloud_cli (sandbox) |
| AWS Secret | `ENV:AWS_SECRET_ACCESS_KEY` | cloud_cli (sandbox) |
| AWS Region | `ENV:AWS_REGION` | All AWS tools |
| Stripe Test Key | `ENV:STRIPE_TEST_KEY` | endpoint_call (test mode) |
| Supabase URL | `ENV:SUPABASE_URL` | endpoint_call |
| Supabase Key | `ENV:SUPABASE_ANON_KEY` | endpoint_call |

Never place real values in this file, in `soul.md`, in `SKILL.md`, in source code, or in logs.
