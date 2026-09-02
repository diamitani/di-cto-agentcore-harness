# Long-Term Memory

## Permanent Facts
- Agent Builder SaaS project lives at /Users/patmini/AgentBuilder
- Stack: Next.js 15 + TypeScript + Tailwind + shadcn/ui + Supabase + Claude API + Stripe + Vercel + Zustand
- Brand: Primary Red #C0272D, Gold #F5C100, Parchment bg #F9F6EF, Charcoal text #1A1A1A
- Fonts: Playfair Display (headings) + Lato (body)
- ROSTR framework: PAL (5-stage compilation), RAG DAL (3-tier multi-pass retrieval), NPAO (N→A→P→O classification), Rostr Hub (persistent state)
- Revenue target: Core $100/mo tier, 1,000 users = $1M ARR

## Active Projects & Context
- **Project Start:** Current session — full 13-phase build
- **Phase 0 Status:** Project setup — scaffold Next.js 15 app with TypeScript, Tailwind, shadcn/ui, install all dependencies
- **Agent Workspace:** Registered in OpenClaw as "agent-builder" at ~/.openclaw/workspace-agent-builder

## Decisions Made
- Folder structure follows /app, /components, /lib, /hooks, /types pattern
- All API routes under /app/api/
- Supabase for auth (PKCE), database (PostgreSQL + RLS), and file storage
- Claude API streaming for test chat agent feature
- Stripe Checkout for payments, webhook for subscription lifecycle

## People & Organizations
- Patrick: GTM AI & Automation Manager, ROSTR author, Atlas HXM
- Atlas HXM: Employer, GTM automation focus

## Build Progress
- [ ] Phase 0: Project Setup
- [ ] Phase 1: Database Schema
- [ ] Phase 2: TypeScript Types
- [ ] Phase 3: Supabase Client
- [ ] Phase 4: Claude API Route
- [ ] Phase 5: Sidebar + Layout
- [ ] Phase 6: Agent Builder Component
- [ ] Phase 7: Knowledge Base Page
- [ ] Phase 8: Chat/Test Agent Page
- [ ] Phase 9: Dashboard Home
- [ ] Phase 10: Auth Pages
- [ ] Phase 11: Stripe Integration
- [ ] Phase 12: Deploy Preparation
