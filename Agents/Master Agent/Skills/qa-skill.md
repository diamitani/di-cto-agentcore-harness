---
id: di-cto-qa
name: Diamitani QA — Critical Journey Testing
version: 0.1.0
status: active
trigger: |
  Invoke when verifying critical user journeys: authentication, OAuth, 
  checkout/payments, webhooks, forms, search, directory, agent behavior.
inputs:
  - name: journey
    required: true
    description: Which journey to test
  - name: environment
    required: true
    description: Where to test (sandbox, staging)
  - name: scope
    required: false
    default: happy-path-and-errors
    options: [happy-only, happy-path-and-errors, full-regression]
outputs:
  - name: test-report
    format: markdown
  - name: evidence
    format: links/screenshots
  - name: defects
    format: yaml
  - name: recommendation
    format: scalar [pass, blocked, needs-fix]
allowed_tools: [browser-test, endpoint-test, cli-test, log-reader]
---

# Diamitani QA Skill

## Purpose
Systematically verify critical user journeys with documented evidence.

## Critical Journeys

### Auth & Identity
- Sign-up flow
- Sign-in flow
- OAuth (state, callback, PKCE)
- Account recovery
- Session lifecycle
- Logout

### Commerce
- Pricing display
- Plan entitlements
- Checkout initiation
- Checkout success
- Checkout cancellation
- Payment webhooks (receive, verify, reconcile)
- Idempotency protection

### App Functionality
- Directory/search
- Forms (validation, submission, errors)
- File upload
- Real-time updates
- Agent invocation
- Tool chains

### Security
- Auth boundary
- Authorization checks
- Rate limiting
- Input validation
- Secret handling
- Audit logging

## Test Levels

| Level | Coverage | Tools |
|-------|----------|-------|
| Unit | Functions in isolation | Jest, pytest |
| Integration | Module boundaries | API tests |
| E2E | Full user flow | Playwright, Cypress |
| Accessibility | a11y compliance | Axe, Lighthouse |
| Security | Vuln scanning | Static analysis |

## Procedure

### 1. Plan
- Map the journey steps
- Identify happy path
- Identify failure paths
- Define test accounts (sandbox only)

### 2. Execute
- Use sandbox/test accounts only
- Never use production personal data
- Capture: request/response, timing, errors
- Document with: screenshots, logs, curl commands

### 3. Report

```markdown
## QA Report: [Journey Name]

### Environment
- URL:
- Commit:
- Date:

### Coverage
| Path | Expected | Actual | Status |
|------|----------|--------|--------|
| Happy | ... | ... | pass/fail |
| Error A | ... | ... | pass/fail |

### Evidence
- [Screenshot links]
- [Log excerpts]
- [Curl commands]

### Defects
- P0: [Critical blockers]
- P1: [Major issues]
- P2: [Minor issues]

### Recommendation
[pass / blocked / needs-fix]
```

## Approval Required

Before running in production:
- Must have explicit approval
- Must use production test accounts only
- Must have rollback plan
- Must not affect real users
