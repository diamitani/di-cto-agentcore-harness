# Diamitani Industries Web Project PRD Template

**Document status:** Draft | In review | Approved | Superseded  
**Project:** `<project_name>`  
**Owner:** `<product_owner>`  
**Technical owner:** Diamitani CTO & Dev Engineer AI  
**Repository / baseline:** `<org/repo> @ <branch> / <commit>`  
**Target environments:** Local | Sandbox | Staging | Production  
**Last updated:** `<YYYY-MM-DD>`  
**Approvers:** `<names and roles>`

---

## 1. Executive brief

### Problem

`<Describe the user/business problem, current workaround, and cost of inaction.>`

### Outcome

`<Describe the measurable user and business outcome.>`

### Users and jobs to be done

| Audience | Situation | Job statement | Desired outcome | Evidence of success |
|---|---|---|---|---|
| `<persona>` | `<context>` | When `<situation>`, I want to `<motivation>`, so I can `<outcome>`. | `<outcome>` | `<metric or test>` |

### Goals

- `<goal with measurable target>`
- `<goal with measurable target>`

### Non-goals

- `<explicitly excluded scope>`
- `<explicitly excluded scope>`

### Success metrics

| Metric | Baseline | Target | Measurement source | Review cadence |
|---|---:|---:|---|---|
| `<metric>` | `<baseline>` | `<target>` | `<analytics/dashboard>` | `<weekly/monthly>` |

---

## 2. Requirements ledger

Classify every entry as **stated requirement**, **inferred requirement**, **optional enhancement**, or **open decision**. Inferred or optional work cannot enter the build plan without owner acceptance.

| ID | Requirement | Classification | Priority | Owner | Acceptance evidence |
|---|---|---|---|---|---|
| FR-001 | `<observable functional requirement>` | Stated requirement | Must | `<owner>` | `<automated/manual test>` |

### Functional requirements

| ID | User story / behavior | Preconditions | Happy path | Failure / recovery path | Acceptance criteria |
|---|---|---|---|---|---|
| FR-001 | As a `<user>`, I can `<action>` | `<state>` | `<steps>` | `<error/retry/support>` | Given/When/Then `<criteria>` |

### Non-functional requirements

| Area | Requirement | Target / constraint | Validation method | Owner |
|---|---|---|---|---|
| Performance | `<requirement>` | `<budget or SLO>` | `<test>` | `<owner>` |
| Availability | `<requirement>` | `<SLO>` | `<monitor>` | `<owner>` |
| Accessibility | `<requirement>` | `<standard / expected behavior>` | `<audit>` | `<owner>` |
| Security | `<requirement>` | `<control>` | `<review/test>` | `<owner>` |
| Privacy | `<requirement>` | `<data rule>` | `<review>` | `<owner>` |
| Cost | `<requirement>` | `<budget/limit>` | `<billing monitor>` | `<owner>` |

---

## 3. User journeys and experience

### Primary workflow

1. `<actor>` starts at `<entry point>`.
2. The system validates `<condition>` and presents `<state>`.
3. The user completes `<action>`.
4. The system persists/calls `<dependency>`.
5. The user sees `<success state>`; failure routes to `<recovery state>`.

### Journey coverage

| Journey | Entry | Success state | Error state | Analytics event | Test level |
|---|---|---|---|---|---|
| Sign-up | `<route>` | `<state>` | `<state>` | `<event>` | E2E |
| Sign-in / session | `<route>` | `<state>` | `<state>` | `<event>` | E2E |
| OAuth | `<provider>` | `<callback result>` | `<safe retry>` | `<event>` | E2E |
| Pricing / checkout | `<route>` | `<confirmation>` | `<cancel/recovery>` | `<event>` | E2E |
| Core product task | `<route>` | `<outcome>` | `<fallback>` | `<event>` | Integration |

### UX requirements

- Define desktop, tablet, and mobile behavior for every primary screen.
- Define loading, empty, permission-denied, validation, network-failure, and success states.
- Provide keyboard navigation, visible focus, semantic labels, clear form errors, and non-color-only status indicators.
- Identify design-system components, design tokens, content ownership, and approved TaskSkill design artifact.

---

## 4. Architecture and stack

### System context

| Component | Responsibility | Technology | Data handled | Owner | Interface |
|---|---|---|---|---|---|
| Web client | `<responsibility>` | `<approved framework>` | `<data class>` | `<owner>` | `<API/events>` |
| API / BFF | `<responsibility>` | `<runtime>` | `<data class>` | `<owner>` | `<REST/GraphQL/RPC>` |
| Data store | `<responsibility>` | `<service>` | `<data class>` | `<owner>` | `<schema>` |
| Async worker | `<responsibility>` | `<service>` | `<data class>` | `<owner>` | `<queue/topic>` |
| External service | `<responsibility>` | `<vendor>` | `<data class>` | `<owner>` | `<contract>` |

### Approved-stack decision record

| Layer | Selected option | Version | Decision rationale | Alternatives rejected | Approval |
|---|---|---|---|---|---|
| Frontend | `<e.g., Next.js/React>` | `<version>` | `<reason>` | `<options>` | `<owner>` |
| Backend | `<e.g., TypeScript service>` | `<version>` | `<reason>` | `<options>` | `<owner>` |
| Database | `<database>` | `<version>` | `<reason>` | `<options>` | `<owner>` |
| Cloud | `<AWS/Azure/GCP/Vercel>` | `<region>` | `<reason>` | `<options>` | `<owner>` |
| Identity | `<provider>` | `<plan>` | `<reason>` | `<options>` | `<owner>` |
| Payments | `<provider>` | `<mode>` | `<reason>` | `<options>` | `<owner>` |
| Agent runtime | `<provider/adapter>` | `<version>` | `<reason>` | `<options>` | `<owner>` |

### Stack constraints

- Use TypeScript for browser and server application code unless this PRD approves an exception.
- Pin runtime, package-manager, deployment, and infrastructure versions in source control.
- Prefer an existing repository convention and reusable design system before adding a framework or service.
- Use infrastructure-as-code for cloud resources; prohibit console-only production configuration.
- Keep environment configuration separate from code. Reference secrets as `ENV:<NAME>`; never include secret values in this document, code, prompts, logs, or client bundles.
- Require an approved architecture decision before adding a new cloud, paid vendor, identity provider, model provider, database, queue, or production region.
- Make external dependencies replaceable through a provider-neutral domain interface where the business domain permits it.

### Data model and retention

| Entity / event | Purpose | Classification | Source of truth | Retention | Access roles |
|---|---|---|---|---|---|
| `<entity>` | `<purpose>` | Public / Internal / Confidential / Restricted | `<system>` | `<rule>` | `<roles>` |

---

## 5. API and integration contract

### API standards

- Version externally consumed APIs using an explicit strategy, for example `/v1`; avoid breaking changes inside a published version.
- Use resource-oriented nouns, plural collection paths, predictable HTTP semantics, and JSON request/response bodies unless an approved contract requires another protocol.
- Validate all input server-side with a typed schema. Reject unknown or malformed values where the contract requires strictness.
- Authenticate every non-public route and authorize every resource action server-side. Never trust client-provided identity, role, price, ownership, or entitlement state.
- Use cursor pagination for unbounded collections; document default/max page size, filter fields, sort order, and stable cursor behavior.
- Require idempotency keys for retriable create/payment/provisioning operations. Verify webhook signatures, record event identifiers, and process events idempotently.
- Publish an OpenAPI or equivalent machine-readable contract for every public or cross-service API. Generate or validate clients where practical.
- Add request/correlation IDs, rate-limit behavior, timeout budgets, retry rules, and deprecation/migration notes to every integration contract.

### Endpoint inventory

| Operation | Method / path | AuthZ policy | Request schema | Success response | Error codes | Idempotent |
|---|---|---|---|---|---|---|
| `<operation>` | `POST /v1/<resource>` | `<role/ownership>` | `<schema ref>` | `201 <resource>` | `400, 401, 403, 409, 422, 429, 500` | Yes / No |

### Standard error envelope

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "A safe, actionable message for the caller.",
    "requestId": "req_...",
    "details": [
      {"field": "email", "reason": "invalid_format"}
    ],
    "retryable": false
  }
}
```

### Error taxonomy

| Class | Examples | Caller behavior | Server behavior |
|---|---|---|---|
| Validation | 400, 422 | Correct input; do not blind retry | Return safe field-level details |
| Authentication | 401 | Reauthenticate | Do not expose account existence or token details |
| Authorization | 403 | Stop or request access | Log policy decision safely |
| Not found | 404 | Treat as absent | Do not leak inaccessible-resource existence |
| Conflict | 409 | Refresh or resolve conflict | Return conflict type; preserve idempotency |
| Rate limit | 429 | Honor `Retry-After` | Apply scoped limit and telemetry |
| Dependency failure | 502, 503, 504 | Retry only when marked retryable | Use timeout, circuit breaker, and redacted dependency context |
| Unexpected server failure | 500 | Show safe recovery state | Log structured diagnostic data; alert by severity |

---

## 6. Security, reliability, and operations

### Threat and control register

| Risk | Likelihood | Impact | Preventive control | Detection | Response owner |
|---|---:|---:|---|---|---|
| `<risk>` | Low/Med/High | Low/Med/High | `<control>` | `<signal>` | `<owner>` |

### Error-handling protocol

1. Validate at the boundary and return the documented error envelope.
2. Classify failures as expected, transient dependency, security-relevant, or unexpected.
3. Use timeouts for outbound calls; retry only idempotent or idempotency-keyed operations with bounded exponential backoff and jitter.
4. Avoid retries for validation, authorization, non-idempotent writes without an idempotency key, or confirmed permanent failures.
5. Log structured events with timestamp, request ID, route/operation, safe actor reference, dependency, error code, latency, and retry count. Redact secrets, tokens, payment data, personal data, and raw request bodies unless explicitly approved.
6. Present user-safe messages and a recovery action. Never surface stack traces, provider internals, credential details, or hidden-resource existence.
7. Alert on defined severity thresholds. Create an incident record for Sev-1/Sev-2 events and document mitigation, root cause, and follow-up.

### Observability and release requirements

| Capability | Requirement | Evidence |
|---|---|---|
| Logging | Structured, redacted, correlated logs | `<dashboard/query>` |
| Metrics | Latency, errors, saturation, conversion, dependency health | `<dashboard>` |
| Tracing | Cross-service correlation for critical paths | `<trace example>` |
| Health | Liveness/readiness and dependency-safe health checks | `<endpoint/test>` |
| Rollback | Versioned artifact and tested rollback path | `<runbook>` |
| Backups/migrations | Restore and migration rollback/forward plan | `<test evidence>` |

---

## 7. Build plan and milestones

### JTBD / NPAO-ranked backlog

| Rank | Build item | User outcome | NPAO rationale | Dependency | Owner | Definition of done |
|---:|---|---|---|---|---|---|
| 1 | `<item>` | `<outcome>` | `<need/priority/alignment/outcome rationale>` | `<dependency>` | `<owner>` | `<evidence>` |

### Milestone ledger

| ID | Milestone | Exit criteria | Dependencies | Planned date | Actual date | Status | Evidence link | Blocker / decision |
|---|---|---|---|---|---|---|---|---|
| M0 | Discovery complete | Approved PRD, architecture, risks, backlog | `<items>` | `<date>` | `<date>` | Not started | `<link>` | `<none>` |
| M1 | Vertical slice | Core journey works in sandbox with tests | `<items>` | `<date>` | `<date>` | Not started | `<link>` | `<none>` |
| M2 | Integration complete | Contracts, auth, data, and external mocks validated | `<items>` | `<date>` | `<date>` | Not started | `<link>` | `<none>` |
| M3 | Release candidate | Quality gate passes; rollback and monitoring ready | `<items>` | `<date>` | `<date>` | Not started | `<link>` | `<none>` |
| M4 | Production verified | Approved release and post-release health evidence | `<approval>` | `<date>` | `<date>` | Not started | `<link>` | `<none>` |

### Automated milestone rules

- Create milestone IDs once; never reuse IDs or overwrite historical status evidence.
- Derive status from evidence: `Not started`, `In progress`, `Blocked`, `At risk`, `Ready for review`, `Complete`, or `Waived`.
- Mark a milestone `Complete` only when every exit criterion has linked evidence and all blocking defects are resolved or formally waived by the owner.
- Mark `Blocked` when an external dependency, approval, access gap, or decision prevents progress. Record owner, requested action, and next review date.
- Mark `At risk` when planned completion is threatened by an unresolved dependency, failed gate, scope change, or budget threshold.
- Update the ledger after every merged pull request, failed CI run, environment deployment, critical defect, approval event, or dependency change.
- Do not infer completion from code changes alone. CI/test/deployment evidence must be attached to the milestone.
- Open a change request when a Must requirement, architecture decision, timeline, budget, vendor, cloud region, data class, or security posture changes.
- Production milestones require explicit approval with exact environment, commit/artifact version, migration plan, monitoring plan, and rollback plan.

---

## 8. QA, release, and approvals

### Test matrix

| Requirement / journey | Unit | Integration | E2E | Accessibility | Security | Owner | Result |
|---|---:|---:|---:|---:|---:|---|---|
| `<ID>` | Yes/No | Yes/No | Yes/No | Yes/No | Yes/No | `<owner>` | Pending |

### Release checklist

- [ ] Requirements traceability is complete.
- [ ] Build, typecheck/lint, unit, integration, and required E2E checks pass.
- [ ] Auth, authorization, OAuth, pricing/checkout, and webhook journeys are tested where applicable using sandbox/test accounts.
- [ ] Dependency/security review and secret scan pass.
- [ ] Observability, dashboards, health checks, on-call owner, and rollback steps are ready.
- [ ] Migration and data-backfill plan is tested or explicitly waived.
- [ ] Known issues, user impact, and support response are documented.
- [ ] Required approvals are recorded before any staging/production action.

### Approval register

| Action | Exact target/change | Risk | Rollback | Approver | Status |
|---|---|---|---|---|---|
| `<production deploy>` | `<environment, artifact>` | `<risk>` | `<plan>` | `<name>` | Pending |

---

## 9. Decision and change log

| Date | Decision/change | Why | Alternatives | Owner | Approval / evidence |
|---|---|---|---|---|---|
| `<date>` | `<decision>` | `<reason>` | `<options>` | `<owner>` | `<link>` |
