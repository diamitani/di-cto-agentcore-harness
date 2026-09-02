# Delivery Package: <project_name>

## Intake

| Field | Value |
|---|---|
| Request | <request> |
| Outcome | <user outcome> |
| Target audience | <target_audience> |
| Repository / baseline | <repo, branch, commit> |
| Environment | <local/sandbox/staging/production> |
| Owner | <owner> |
| Status | <intake/planned/building/verified/blocked> |

## Requirement ledger

| ID | Detail | Classification | Decision / source | Acceptance evidence |
|---|---|---|---|---|
| R-001 | <requirement> | stated requirement | <source> | <test or review> |

## PRD

### Problem and users

<Problem, primary user, user story, and non-goals.>

### Functional requirements

| ID | Requirement | Priority | Acceptance criteria |
|---|---|---:|---|
| FR-001 | <requirement> | Must | <observable condition> |

### Non-functional requirements

| Area | Requirement | Evidence |
|---|---|---|
| Security | <requirement> | <review/test> |

## Architecture

### System components

| Component | Responsibility | Interface / data | Owner |
|---|---|---|---|
| <component> | <responsibility> | <contract> | <owner> |

### Workflow

1. <actor> starts <event>.
2. <system> validates <condition>.
3. <system> persists/calls <dependency>.
4. <user-visible result and failure route>.

## JTBD and NPAO plan

**Job statement:** When <situation>, I want to <motivation>, so I can <expected outcome>.

| Rank | Build item | NPAO rationale | Dependency | Owner | Definition of done |
|---:|---|---|---|---|---|
| 1 | <item> | <need, priority, alignment, outcome> | <dependency> | <owner> | <evidence> |

## Implementation plan

| Slice | Files / services | Test plan | Risk | Approval needed |
|---|---|---|---|---|
| <slice> | <scope> | <tests> | <risk> | <yes/no and gate> |

## Security and operations

| Area | Decision | Evidence / owner |
|---|---|---|
| Secrets | ENV:<NAME> stored in approved manager | <evidence> |
| Observability | <logs, metrics, traces, alerts> | <evidence> |
| Rollback | <steps> | <evidence> |

## Verification report

| Check | Command / journey | Result | Evidence | Defects |
|---|---|---|---|---|
| Build | `<command>` | pass/fail/not run | <log path/id> | <issue> |

## Approval requests

| Action | Exact target / change | Rollback | Approver | Status |
|---|---|---|---|---|
| <action> | <resolved target> | <rollback> | <owner> | pending |

## Open decisions

- <decision, impact, default, owner, due date>
