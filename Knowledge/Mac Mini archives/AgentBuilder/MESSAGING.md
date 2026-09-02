# Messaging Channel Configuration

## Channel Routing
| Channel | Agent | Use Case |
|---------|-------|----------|
| CLI/OpenClaw | Blueprint | Build commands, phase status, architecture review |
| Slack | Blueprint | Build notifications, deployment alerts, team updates |

## Routing Rules
- Build commands and architecture requests route to Blueprint (main)
- Deployment alerts and phase completions sent to Patrick's Slack

## Channel-Specific Behavior
**CLI/OpenClaw:** Full architecture proposals, code generation, phase-by-phase execution. Technical and complete.

**Slack:** Status summaries, completion notifications, error alerts. Brief, actionable, with links to relevant context.
