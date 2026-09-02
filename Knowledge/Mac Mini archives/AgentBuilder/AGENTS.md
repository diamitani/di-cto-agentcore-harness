# Agent Team

## Main Agent: Blueprint
**Role:** Orchestrator — system architect and engineering lead for the Agent Builder SaaS
**Workspace:** /Users/patmini/AgentBuilder
**Model:** claude-sonnet-4-5
**Tools:** read, write, edit, bash, glob, grep, task (sub-agents), webfetch

## Specialist Sub-Agents (SaaS Build Agents)

These agents are spawned in parallel during active build sessions to maximize throughput.

### Agent: Schema Architect
- **Role:** Builds Phase 1 (Database Schema) and Phase 2 (TypeScript Types)
- **Trigger:** Phase 0 complete
- **Output:** SQL schema file, /types/index.ts
- **Tools:** read, write, edit, bash

### Agent: API Engineer
- **Role:** Builds Phase 3 (Supabase Client) and Phase 4 (Claude API Route)
- **Trigger:** Phase 2 complete
- **Output:** /lib/supabase.ts, /app/api/chat/route.ts, /lib/claude.ts
- **Tools:** read, write, edit, bash

### Agent: UI Architect
- **Role:** Builds Phase 5 (Sidebar + Layout), Phase 6 (Agent Builder), Phase 7 (Knowledge Base)
- **Trigger:** Phase 2 complete
- **Output:** Sidebar.tsx, DashboardLayout.tsx, AgentBuilder.tsx, page.tsx files
- **Tools:** read, write, edit, bash, glob

### Agent: Page Builder
- **Role:** Builds Phase 8 (Chat), Phase 9 (Dashboard Home), Phase 10 (Auth Pages)
- **Trigger:** Phase 5 complete
- **Output:** All dashboard pages, auth pages
- **Tools:** read, write, edit, bash, glob

### Agent: Billing Engineer
- **Role:** Builds Phase 11 (Stripe Integration) and Phase 12 (Deploy Prep)
- **Trigger:** Phase 10 complete
- **Output:** /lib/stripe.ts, Stripe API routes, pricing page, deploy files
- **Tools:** read, write, edit, bash

## Agent-to-Agent Protocols

### Handoff: Schema Architect → API Engineer
- **Deliverable:** /types/index.ts, schema.sql
- **Verification:** All interfaces match table columns, all fields properly typed

### Handoff: API Engineer → UI Architect
- **Deliverable:** /lib/supabase.ts with typed CRUD functions
- **Verification:** All CRUD functions return correct types, error handling implemented

### Handoff: UI Architect → Page Builder
- **Deliverable:** Layout components, AgentBuilder component, Sidebar
- **Verification:** Components render correctly with mock data, all brand colors applied

### Handoff: Page Builder → Billing Engineer
- **Deliverable:** All pages working, auth flow complete
- **Verification:** Full user flow works (signup → create agent → test chat)
