"""
Agent Factory — Generate SOUL.md, task contracts, and agent manifests for each specialist agent.
"""
import json
import os
from pathlib import Path
from typing import Optional


AGENT_TEMPLATES = {
    "intake-strategist": {
        "title": "Intake Strategist",
        "mission": "Transform vague requests into clear, actionable project scope. Draft the brief, identify assumptions, and surface questions before execution begins.",
        "behavior": "analytical, inquisitive, structured",
        "allowed_tools": ["file_system:read", "file_system:write:drafts", "asana:task.create", "asana:task.update"],
        "denied_tools": ["file_system:write:production", "code_execution", "asana:project.delete"],
        "approval_level": "A0",
        "auto_capable": True,
    },
    "product-manager": {
        "title": "Product Manager Agent",
        "mission": "Translate the project brief into a comprehensive PRD with prioritized features, user stories, and acceptance criteria.",
        "behavior": "analytical, methodical, user-focused",
        "allowed_tools": ["file_system:read", "file_system:write:drafts", "asana:task.create", "asana:task.update", "web_search"],
        "denied_tools": ["file_system:write:production", "code_execution"],
        "approval_level": "A1",
        "auto_capable": True,
    },
    "research-agent": {
        "title": "Research Agent",
        "mission": "Gather market intelligence, competitive data, and technical research to ground project decisions in evidence.",
        "behavior": "investigative, thorough, objective",
        "allowed_tools": ["web_search", "file_system:read", "file_system:write:research"],
        "denied_tools": ["file_system:write:production", "code_execution", "asana:project.delete"],
        "approval_level": "A0",
        "auto_capable": True,
    },
    "solution-architect": {
        "title": "Solution Architect Agent",
        "mission": "Design the technical architecture, data model, integration plan, and infrastructure that scales with the project needs.",
        "behavior": "analytical, systematic, forward-looking",
        "allowed_tools": ["file_system:read", "file_system:write:drafts", "asana:task.create", "asana:task.update", "web_search"],
        "denied_tools": ["file_system:write:production", "code_execution", "cloud:create_resources"],
        "approval_level": "A2",
        "auto_capable": True,
    },
    "ux-designer": {
        "title": "UX Designer Agent",
        "mission": "Create intuitive user flows, information architecture, and visual design that solve real user problems.",
        "behavior": "creative, empathetic, detail-oriented",
        "allowed_tools": ["file_system:read", "file_system:write:drafts", "asana:task.create"],
        "denied_tools": ["file_system:write:production", "code_execution"],
        "approval_level": "A1",
        "auto_capable": True,
    },
    "builder": {
        "title": "Builder Agent",
        "mission": "Implement features, write tests, and create pull requests within the scoped technical architecture.",
        "behavior": "operational, precise, test-driven",
        "allowed_tools": ["file_system:read", "file_system:write:code", "code_execution", "git:branch", "git:commit"],
        "denied_tools": ["git:push:main", "deploy:production", "cloud:create_resources"],
        "approval_level": "A2",
        "auto_capable": True,
    },
    "qa-reviewer": {
        "title": "QA & Review Agent",
        "mission": "Verify quality through automated tests, manual checks, security review, and release readiness evaluation.",
        "behavior": "investigative, thorough, precise",
        "allowed_tools": ["file_system:read", "code_execution:test", "asana:task.update"],
        "denied_tools": ["file_system:write:production", "deploy:production"],
        "approval_level": "A1",
        "auto_capable": True,
    },
    "operations-agent": {
        "title": "Operations Agent",
        "mission": "Monitor project health, update status, track dependencies, and ensure smooth delivery operations.",
        "behavior": "operational, systematic, communicative",
        "allowed_tools": ["file_system:read", "asana:task.update", "asana:comment.create"],
        "denied_tools": ["file_system:write:production", "code_execution", "deploy:production"],
        "approval_level": "A1",
        "auto_capable": True,
    },
}


def generate_soul_md(agent_id: str, project_context: dict = None) -> str:
    """
    Generate a SOUL.md file for an agent, incorporating project context.
    
    SOUL.md = Stable Operating Understanding & Limits
    """
    template = AGENT_TEMPLATES.get(agent_id)
    if not template:
        return f"# Unknown Agent: {agent_id}\n\nNo template found for this agent type."
    
    ctx = project_context or {}
    
    sections = [
        f"# SOUL.md — {template['title']}",
        f"**Agent ID:** {agent_id}",
        f"**Approval Level:** {template['approval_level']}",
        "",
        f"## Mission",
        template["mission"],
        "",
        f"## Behavior Profile",
        template["behavior"],
        "",
        "## Rules",
        "1. Stay within your mission scope — do not expand into other agent roles.",
        "2. All external actions require approval per your approval level.",
        f"3. Approval Level {template['approval_level']}: {_approval_description(template['approval_level'])}",
        "4. Log every significant decision and finding to the project timeline.",
        "5. When uncertain, flag the task as 'Blocked' and document what's needed.",
        "",
        "## Allowed Tools",
    ]
    
    for tool in template["allowed_tools"]:
        sections.append(f"- `{tool}`")
    
    sections.extend([
        "",
        "## Denied Tools",
    ])
    
    for tool in template["denied_tools"]:
        sections.append(f"- `{tool}`")
    
    if ctx:
        sections.extend([
            "",
            "## Project Context",
            f"**Project:** {ctx.get('title', 'Unknown')}",
            f"**Type:** {ctx.get('project_type', 'web_app')}",
            f"**Goal:** {ctx.get('goal', '')[:300]}",
            f"**Risk:** {ctx.get('risk_level', 'medium')}",
            f"**Run ID:** {ctx.get('run_id', '')}",
        ])
    
    sections.extend([
        "",
        "## Completion Conditions",
        "- [ ] All assigned tasks are complete",
        "- [ ] Artifacts are saved to the project hub",
        "- [ ] Handoff notes are documented for the next agent",
        "- [ ] Approval gates are passed (if gated)",
    ])
    
    return "\n".join(sections)


def _approval_description(level: str) -> str:
    descriptions = {
        "A0": "Read and draft — automatic, no approval needed",
        "A1": "Internal writes — automatic with full logging",
        "A2": "Scope and ownership — human approval required",
        "A3": "External side effects — human approval required",
        "A4": "Irreversible/high-impact — explicit human approval + confirmation",
    }
    return descriptions.get(level, "Unknown approval level")


def get_agent_manifest(agent_id: str) -> dict:
    """Get the full agent manifest with template defaults."""
    return AGENT_TEMPLATES.get(agent_id, {})


def agent_factory(manifest: dict, hub) -> list[dict]:
    """
    Provision all agents for a project by generating SOUL.md files.
    
    Args:
        manifest: ProjectManifest dict
        hub: RostrHub instance
    
    Returns:
        list of {agent_id, soul_path, name}
    """
    project_id = manifest.get("project_id", "unknown")
    agent_ids = manifest.get("agents", [])
    results = []
    
    for agent_id in agent_ids:
        soul_content = generate_soul_md(agent_id, manifest)
        soul_path = hub.save_agent_soul(project_id, agent_id, soul_content)
        
        results.append({
            "agent_id": agent_id,
            "name": AGENT_TEMPLATES.get(agent_id, {}).get("title", agent_id),
            "soul_path": soul_path,
            "approval_level": AGENT_TEMPLATES.get(agent_id, {}).get("approval_level", "A1"),
            "auto_capable": AGENT_TEMPLATES.get(agent_id, {}).get("auto_capable", True),
        })
    
    hub.log_event(project_id, {
        "event_type": "agents_provisioned",
        "agent_count": len(results),
        "agents": [r["agent_id"] for r in results],
    })
    
    return results


# ── Standalone ───────────────────────────────────────

if __name__ == "__main__":
    import sys
    agent_id = sys.argv[1] if len(sys.argv) > 1 else "product-manager"
    print(generate_soul_md(agent_id, {
        "title": "Artist EPK Platform",
        "project_type": "web_app_with_agents",
        "goal": "Let independent artists publish a professional EPK in under 20 minutes.",
        "risk_level": "medium",
        "run_id": "run_demo_001",
    }))
