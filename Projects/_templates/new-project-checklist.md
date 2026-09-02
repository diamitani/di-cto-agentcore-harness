# New Project Checklist

Use this checklist when scaffolding a new project.

## Phase 0: Setup

- [ ] Create project directory: `Projects/<project-name>/`
- [ ] Copy `prd-template.md` to `Projects/<project-name>/PRD.md`
- [ ] Copy `delivery-package-template.md` to `Projects/<project-name>/DELIVERY.md`
- [ ] Create `soul.md` stub if this is an agent system
- [ ] Create `SKILL.md` stub for any repeatable procedure
- [ ] Register project in `Agents/Master Agent/Knowledge/projects.yaml`

## Phase 1: Discovery

- [ ] Define problem statement
- [ ] Identify target users and JTBD
- [ ] List success metrics
- [ ] Define non-goals
- [ ] Research existing solutions
- [ ] Document constraints

## Phase 2: Planning

- [ ] Complete PRD
- [ ] Create architecture diagram
- [ ] Define data model
- [ ] Document API contracts
- [ ] Create JTBD map
- [ ] NPAO-rank work items
- [ ] Assign owners
- [ ] Set milestones (M0-M4)

## Phase 3: Implementation

- [ ] Create feature branch
- [ ] Implement vertical slice
- [ ] Add tests
- [ ] Document changes
- [ ] Verify build/test
- [ ] Update milestone status

## Phase 4: Verification

- [ ] Run full test suite
- [ ] Critical journey QA
- [ ] Security review
- [ ] Accessibility check
- [ ] Performance baseline
- [ ] Documentation complete

## Phase 5: Release

- [ ] CI/CD configured
- [ ] Observability added
- [ ] Rollback plan defined
- [ ] Migration tested
- [ ] Approval obtained
- [ ] Deployment verified

## Sign-off

| Role | Name | Date | Signature |
|------|------|------|-----------|
| CTO Agent | DI-CTO | | |
| Product Owner | | | |
| Approver | | | |

---
*Template version: 0.1.0*
