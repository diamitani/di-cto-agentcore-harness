---
id: di-cto-delivery
name: Diamitani Delivery — Product to Production
version: 0.1.0
status: active
trigger: |
  Invoke when the user requests delivery of a web, mobile, backend, agent, 
  or cloud project from concept to working code.
inputs:
  - name: request
    required: true
    description: User outcome, audience, success metrics
  - name: repository
    required: false
    description: Target repository/workspace
  - name: environment
    required: false
    default: sandbox
    description: Target environment
outputs:
  - name: plan
    format: markdown
  - name: prd
    format: markdown
  - name: implementation
    format: files
  - name: verification
    format: markdown
allowed_tools: [file-read, file-write, git, github, web-search, cli, mcp]
denied_tools: [prod-deploy, secret-export, raw-credential]
requires_approval: [production-deploy, cloud-resource-change, dns-change, OAuth-rotate, payment-live]
---

# Diamitani Delivery Skill

## Purpose
Convert a bounded product request into a traceable, testable delivery package.

## Trigger Conditions

- User wants to "build", "create", "implement", "ship", or "deliver"
- Request includes web, mobile, backend, agent, MCP, or cloud scope
- There's a defined outcome (not just research)

## Non-Trigger

- Pure research or questions
- Tasks that require no implementation
- Requests for advice only

## Procedure

### 1. Intake
- Restate outcome and classify requirements
- Resolve repository, branch, baseline
- Identify constraints, stack, deadline
- **ASK ONE QUESTION** if missing answer changes architecture/risk/cost

### 2. Discover
- Inspect project README, existing code
- Load `soul.md`, relevant SKILL files
- Research via RAG DAL if needed

### 3. Plan
- Select PRD template
- Define: problem, users, JTBD, requirements, non-goals
- Create work items, NPAO-rank
- Identify sub-agents needed

### 4. Design (if needed)
- Delegate to `product-architect` for PRD
- Delegate to `experience-engineer` for UX
- Consolidate before build

### 5. Build
- Create isolated branch/workspace
- Implement vertical slice first
- Add tests with every behavior
- Use typed boundaries, validation, auth

### 6. Verify
- Run: build, lint, typecheck, unit, integration
- Critical paths: auth, OAuth, checkout, webhooks
- Accessibility: keyboard, focus, labels
- Security: secrets, authZ, input validation

### 7. Package
- Document: changes, commands, evidence
- Create milestone update
- Mark status: `ready for sandbox` | `blocked` | `needs approval`

## Quality Checks

- [ ] Requirements → acceptance evidence traceability
- [ ] Build/test/lint passing
- [ ] Security/accessibility reviewed
- [ ] CI/CD with artifact versioning
- [ ] Rollback plan defined
- [ ] Approval gates unpassed or documented
