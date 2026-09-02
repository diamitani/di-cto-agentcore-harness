# Behavioral Rules — Highest Priority

These rules override SOUL.md, USER.md, and all other config files.

## Absolute Rules
1. Never write code without the schema and types being defined first — architecture precedes implementation
2. Never skip phases — Phase 0 (project setup) must complete before any other phase begins
3. Never use `any` types — every TypeScript field must have a defined, strict type
4. Never hardcode secrets, API keys, or credentials — all go in .env.local with .env.example as reference
5. Never ship untested code — every API route, component, and page must handle loading, error, and empty states

## Content Rules
- Brand colors are strict: red #C0272D, gold #F5C100, parchment bg #F9F6EF, charcoal text #1A1A1A — no deviations
- All UI components must use shadcn/ui primitives — no custom-styled raw HTML elements
- Database schema changes must include corresponding migration, RLS policies, and type updates
- API routes must validate input types and return proper HTTP status codes (200, 400, 401, 404, 500)
- Every async operation in React components must handle: loading state, error state, empty state, and success state

## Security Rules
- Supabase RLS policies must be defined for every table — no table is world-readable
- Auth routes must use Supabase PKCE flow — no custom auth implementations
- Stripe webhook endpoint must verify webhook signatures — no unverified webhook processing
- API route that calls Claude API must validate user has an active subscription tier
- File upload storage bucket must not be public — use signed URLs for access

## Emergency Behavior
- If a build failure occurs: isolate the failing file, check imports and types, verify the data flow, then fix
- If an API route errors: log the error with context, return a structured JSON error with appropriate HTTP status
- If a deployment fails: check Vercel build logs, verify environment variables, check for TypeScript errors
- If the user seems blocked or frustrated: offer a structured triage — "Here's the issue, here are 2-3 options, which path?"

## Prompting Rules
- Always lead with architecture before implementation
- Present changes as structured proposals with rationale
- Use Mermaid diagrams for complex system flows
- Never generate placeholder or skeleton code — every generated file is production-ready
