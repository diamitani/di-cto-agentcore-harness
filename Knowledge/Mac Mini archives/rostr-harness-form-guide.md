# ROSTR Agent Harness — Complete Form Guide

## SECTION 1: Harness Name
```
rostr_agent_harness
```
- Must start with a letter. 40 char max. Underscores only.
- Cannot be changed after creation — choose carefully.

---

## SECTION 2: Model & System Prompt

### Model Source
```
Bedrock → Bedrock Mantle (Responses API / Chat Completions API)
```

### Model
```
Claude Sonnet 4.6 v1 — global.anthropic.claude-sonnet-4-6
```

### System Prompt
Copy the full contents of `rostr-harness-system-prompt.md` (6,863 chars, well under the 20,000 limit).

### Parameters (these are the Inference Parameters)
```
Temperature: 0.2
Top P: 0.95
Max tokens: 4096
```
Why low temp (0.2): ROSTR needs deterministic phase classification and consistent output formats. Higher temps cause phase drift.

### Additional Parameters
Leave empty unless you need:
- `stop_sequences`: Array of strings that halt generation
- `tools`: Only if you need to pre-register tool configs beyond what the form provides

---

## SECTION 3: Memory

### Enable Memory: **YES**

### Memory Type: **Create new Memory (managed by Harness)**
> ⚠️ Takes 3-5 minutes to provision. Do this FIRST, then configure everything else while it provisions.

### Memory Detail
```
Strategies:
  ✅ Semantic memory
  ✅ Summarization

Short-term memory expiration: 30 days (default)

Retrieval configs:
  Namespace 1: rostr_decisions  (key decisions + rationale)
  Namespace 2: rostr_learnings  (insights, outcomes, tags)
```

---

## SECTION 4: Tools

### Gateway
Leave empty for now. Add later when you want access controls and governance policies.

### Browser Tool
**Create new** — useful for research tasks (Phase 0 PreD). Name it `rostr_browser`.

### Code Interpreter Tool
**Create new** — ESSENTIAL. Name it `rostr_code_interpreter`. This is your sandboxed execution environment for Phase 2 Development and Phase 4 Debugging.

### Remote MCP Server
Add these MCP servers to extend capabilities:

**MCP Server 1: AWS CLI**
```
Endpoint URL: (your MCP server URL for AWS operations)
Description: AWS infrastructure management — EC2, S3, Lambda, Bedrock
```

**MCP Server 2: GitHub**
```
Endpoint URL: (your MCP server URL for GitHub)
Description: Repository management, PR workflows, issues, code review
```

If you don't have MCP servers yet, skip this — you can add them later.

### Custom Functions
Add as needed for your specific tooling. Common ones:

**Custom Function 1: deploy_to_ec2**
- Name: `deploy_to_ec2`
- Description: Deploy the current project to an EC2 instance. Accepts instance IP, key path, and project directory.
- Schema JSON:
```json
{
  "type": "object",
  "properties": {
    "instance_ip": {"type": "string", "description": "EC2 instance IP address"},
    "key_path": {"type": "string", "description": "Path to SSH private key"},
    "project_dir": {"type": "string", "description": "Absolute path to project directory"},
    "port": {"type": "integer", "description": "Application port", "default": 8080}
  },
  "required": ["instance_ip", "key_path", "project_dir"]
}
```

---

## SECTION 5: Skills

Attach these skills as reference files the Harness can load at runtime:

### Skill 1: PAL Compiler Protocol
File bundle containing the PAL 5-stage pipeline reference.

### Skill 2: NPAO Orchestrator Reference
File bundle with phase taxonomy, priority formula, and orchestration patterns.

### Skill 3: RAG DAL Knowledge Engine
File bundle with tier architecture, confidence formula, and multi-pass algorithm.

### Skill 4: ROSTR Hub State Management
File bundle with directory structure, state levels, and persistence protocol.

*(The actual skill file contents are in the companion files: `skills/pal-protocol.md`, `skills/npao-protocol.md`, `skills/ragdal-protocol.md`, `skills/hub-protocol.md`)*

---

## SECTION 6: Advanced Configurations

### Filesystem Configuration
```
Add filesystem → Session storage (S3-backed managed storage)
Mount path: /persistent/
```
This gives you persistent storage that survives session stop/resume cycles.

### Network
```
Public (for now)
```
Switch to VPC later when you need private communication with your other AWS resources.

### Custom Environment
```
Container image URI: (leave empty — use default Harness runtime)

Environment variables:
  ROSTR_VERSION=1.0
  ROSTR_ENV=production
  DEFAULT_MODEL=claude-sonnet-4-6
  LOG_LEVEL=info
  (add any API keys your MCP servers or custom functions need)
```

### Lifecycle Configs
```
Idle Session Timeout: 30 minutes
Max Lifetime: 8 hours
```

### Truncation
```
Truncation strategy: Sliding window
Messages Count: 50
```
50 messages keeps enough context for multi-turn ROSTR workflows without blowing the context window.

### Allowed Tools
```
*
```
Allow all tools initially. Restrict later if needed:
```
code_interpreter, browser, filesystem:read, filesystem:write, mcp:*
```

### Invocation Limits
```
Max Iterations: 50
Timeout duration: 30 minutes
Max tokens: 4096
```
50 iterations is enough for complex multi-phase workflows. 30 min timeout covers research + build + deploy cycles.

---

## SECTION 7: Inbound Auth

### Inbound Auth Type
```
Use IAM permissions (default AWS console role)
```
This is the simplest for testing. Switch to JWT when you need external client access.

---

## SECTION 8: Permissions

### IAM Permissions
```
Create default role
Role name: rostr-harness-role
```
This creates a role with the minimum permissions the Harness needs.

If you need specific AWS service access (S3, EC2, Lambda, Bedrock), create a custom role:
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "bedrock:InvokeModel",
        "bedrock:Converse",
        "s3:GetObject",
        "s3:PutObject",
        "s3:ListBucket",
        "ec2:DescribeInstances",
        "lambda:InvokeFunction",
        "logs:DescribeLogStreams",
        "logs:GetLogEvents"
      ],
      "Resource": "*"
    }
  ]
}
```

---

## CREATION ORDER (important)

1. **FIRST** — Create the Memory (it takes 3-5 min to provision)
2. **WHILE WAITING** — Create the Browser and Code Interpreter tools
3. **FILL** — System prompt + model settings
4. **ATTACH** — Skills (upload the reference files)
5. **CONFIGURE** — Advanced settings
6. **VERIFY** — Memory is provisioned
7. **CREATE** — Submit the Harness
8. **TEST** — Run the test plan (see test-plan.md)
