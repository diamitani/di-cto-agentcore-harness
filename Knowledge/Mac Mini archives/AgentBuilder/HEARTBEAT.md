# Heartbeat Schedule

## Daily Automations
- **09:00:** Check build status — any failed phases, unresolved issues, pending decisions
- **17:00:** Log daily progress to MEMORY.md — phases completed, files created, blockers

## Triggered Automations
- **On phase completion:** Update MEMORY.md build progress, mark phase as completed
- **On new dependency install:** Verify package.json, check for peer dependency warnings
- **On schema change:** Verify RLS policies are still valid, check type definitions match

## Notes
- All times in local timezone
- Heartbeat is active only during active build sessions
- No automated deploys — deployment requires explicit user approval
