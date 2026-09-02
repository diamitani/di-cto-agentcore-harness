"""
Asana Provisioner — Create projects, sections, tasks, subtasks from ProjectManifest
Uses direct REST API calls for reliable, deterministic provisioning.
"""
import json
import os
import urllib.request
import urllib.error
from pathlib import Path
from typing import Optional

BASE_URL = "https://app.asana.com/api/1.0"


def _get_token() -> str:
    """Read the Asana token."""
    token_path = Path.home() / ".hermes" / "skills" / "productivity" / "asana" / "asana_token"
    if token_path.exists():
        return token_path.read_text().strip()
    return os.environ.get("ASANA_TOKEN", "")


def _api(method: str, path: str, data: dict = None) -> dict:
    """Direct REST API call to Asana."""
    token = _get_token()
    if not token:
        return {"error": "No Asana token"}
    
    url = f"{BASE_URL}{path}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Accept": "application/json",
    }
    if data is not None:
        headers["Content-Type"] = "application/json"
        body = json.dumps(data).encode("utf-8")
    else:
        body = None
    
    req = urllib.request.Request(url, data=body, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req) as resp:
            result = json.loads(resp.read())
            return result.get("data", result)
    except urllib.error.HTTPError as e:
        err_body = e.read().decode()[:1000]
        return {"error": e.code, "body": err_body}
    except Exception as e:
        return {"error": str(e)}


# ── Projects ──────────────────────────────────────────

def create_project(title: str, workspace_gid: str = "", notes: str = "") -> dict:
    """Create an Asana project."""
    return _api("POST", "/projects", {
        "data": {
            "name": title,
            "workspace": workspace_gid or "1206772437471958",
            "notes": notes,
            "default_view": "list",
        }
    })


# ── Sections ──────────────────────────────────────────

def create_section(project_gid: str, name: str) -> dict:
    """Create a section in an Asana project."""
    return _api("POST", f"/projects/{project_gid}/sections", {
        "data": {"name": name}
    })


def list_sections(project_gid: str) -> list[dict]:
    """List sections in a project."""
    result = _api("GET", f"/projects/{project_gid}/sections?opt_fields=name")
    if isinstance(result, list):
        return result
    if "data" in str(type(result)):
        return result.get("data", [])
    return []


# ── Tasks ─────────────────────────────────────────────

def create_task(name: str, project_gid: str, notes: str = "", due_on: str = "",
                 section_gid: str = "", assignee: str = "") -> dict:
    """Create a task in an Asana project."""
    task_data = {
        "name": name,
        "projects": [project_gid],
        "notes": notes,
    }
    if due_on:
        task_data["due_on"] = due_on
    if assignee:
        task_data["assignee"] = assignee
    
    result = _api("POST", "/tasks", {"data": task_data})
    
    # Add to section if specified
    if section_gid and "gid" in result:
        _api("POST", f"/sections/{section_gid}/addTask", {
            "data": {"task": result["gid"]}
        })
    
    return result


def create_subtask(parent_gid: str, name: str, notes: str = "") -> dict:
    """Create a subtask under a parent task."""
    return _api("POST", f"/tasks/{parent_gid}/subtasks", {
        "data": {"name": name, "notes": notes}
    })


def add_comment(task_gid: str, text: str) -> dict:
    """Add a comment/story to a task."""
    return _api("POST", f"/tasks/{task_gid}/stories", {
        "data": {"text": text}
    })


def update_task(task_gid: str, updates: dict) -> dict:
    """Update a task's fields."""
    return _api("PUT", f"/tasks/{task_gid}", {"data": updates})


def update_custom_field(task_gid: str, field_gid: str, enum_value: str) -> dict:
    """Update a custom field on a task."""
    return _api("PUT", f"/tasks/{task_gid}", {
        "data": {"custom_fields": {field_gid: enum_value}}
    })


# ── Batch Provisioning ───────────────────────────────

def provision_project(manifest: dict, workspace_gid: str = "") -> dict:
    """
    Full project provisioning: create project, sections, tasks, subtasks.
    
    Uses direct REST API calls for reliability.
    """
    from src.pal.compiler import render_task_contract
    from src.hub.storage import RostrHub
    
    hub = RostrHub()
    pid = manifest.get("project_id", "unknown")
    
    # Create project name
    project_name = f"[Monarch] {manifest.get('title', 'New Project')}"
    notes = f"""# {manifest.get('title')}

**Goal:** {manifest.get('goal', '')[:500]}

**Type:** {manifest.get('project_type', 'web_app')}
**Risk:** {manifest.get('risk_level', 'medium')}
**Execution Mode:** {manifest.get('execution_mode', 'draft_only')}
**Approval Policy:** {manifest.get('approval_policy', 'human_approval_required')}

**Run ID:** {manifest.get('run_id', '')}
**Project ID:** {pid}

*Provisioned by Monarch Project Factory — ROSTR Agency OS*
"""
    
    print(f"[provision] Creating Asana project: {project_name}")
    project = create_project(project_name, workspace_gid, notes)
    
    if "error" in project:
        print(f"[provision] ERROR: {project.get('error')}")
        return {"error": project}
    
    project_gid = project.get("gid", "")
    project_url = project.get("permalink_url", "")
    print(f"[provision] Created: {project_gid} - {project_url}")
    
    # Create sections
    tracks = manifest.get("delivery_tracks", [])
    section_map = {}
    
    for track in tracks:
        name = track if isinstance(track, str) else track.get("name", track.get("id", ""))
        print(f"[provision] Section: {name}")
        section = create_section(project_gid, name)
        if "error" not in section:
            section_gid = section.get("gid", "")
            section_map[name] = section_gid
        else:
            print(f"[provision] Section issue: {section.get('error')}")
    
    # Create blueprint tasks
    task_map = {}
    task_blueprint = _get_task_blueprint(manifest)
    
    for section_name, tasks in task_blueprint.items():
        section_gid = section_map.get(section_name, "")
        for task_def in tasks:
            task_notes = render_task_contract(manifest, {"name": section_name},
                                              task_def["name"], task_def.get("agent_id", ""))
            full_notes = task_def.get("description", "") + "\n\n---\n\n" + task_notes
            
            print(f"[provision] Task: {task_def['name']}")
            task = create_task(name=task_def["name"], project_gid=project_gid,
                               notes=full_notes, section_gid=section_gid)
            
            if "error" not in task:
                task_gid = task.get("gid", "")
                task_map[task_def["name"]] = task_gid
                
                # Subtasks
                for subtask in task_def.get("subtasks", []):
                    sub = create_subtask(task_gid, subtask["name"], subtask.get("notes", ""))
                    if "error" not in sub:
                        task_map[subtask["name"]] = sub.get("gid", "")
                
                # Artifact link
                add_comment(task_gid, f"📋 Artifacts: project://{pid}/artifacts/")
    
    # Update hub mapping
    hub.update_asana_mapping(pid, {
        "project_gid": project_gid,
        "project_url": project_url,
        "sections": section_map,
        "tasks": task_map,
    })
    
    hub.log_event(pid, {
        "event_type": "project_provisioned",
        "asana_project_gid": project_gid,
        "section_count": len(section_map),
        "task_count": len(task_map),
    })
    
    return {
        "project_gid": project_gid,
        "project_url": project_url,
        "sections": section_map,
        "tasks": task_map,
    }


def _get_task_blueprint(manifest: dict) -> dict:
    """Generate task blueprint per delivery track."""
    return {
        "00 — Intake & Decisions": [
            {
                "name": "Review compiled project scope",
                "agent_id": "intake-strategist",
                "description": "## Objective\nReview the PAL-compiled project scope, verify all inputs are captured correctly.\n\n## Deliverables\n- Confirmed scope document\n- Risk assessment",
                "subtasks": [
                    {"name": "Verify intent capture", "notes": "Check that the original prompt is accurately represented"},
                    {"name": "Identify missing requirements", "notes": "Flag ambiguous or missing success criteria"},
                ],
            },
            {
                "name": "Approve budget, timeline, and execution mode",
                "agent_id": "intake-strategist",
                "description": "## Objective\nApprove the project's budget, timeline, and execution mode before provisioning.",
                "subtasks": [
                    {"name": "Confirm execution mode", "notes": f"Current: {manifest.get('execution_mode', 'draft_only')}"},
                    {"name": "Set milestone dates", "notes": "Define delivery milestones and review gates"},
                ],
            },
        ],
        "01 — Discovery": [
            {
                "name": "Validate target users and problem statement",
                "agent_id": "research-agent",
                "description": "## Objective\nResearch and validate the target user group and core problem.",
                "subtasks": [
                    {"name": "User interview plan", "notes": "Define research methodology"},
                    {"name": "Competitive analysis", "notes": "Map comparable solutions"},
                ],
            },
            {
                "name": "Research comparable products",
                "agent_id": "research-agent",
                "description": "## Objective\nIdentify and analyze competitors and adjacent solutions.",
            },
            {
                "name": "Finalize Jobs-to-be-Done and success metrics",
                "agent_id": "product-manager",
                "description": "## Objective\nDefine measurable success criteria aligned with user needs.",
            },
        ],
        "02 — Product & Design": [
            {
                "name": "Produce PRD",
                "agent_id": "product-manager",
                "description": "## Objective\nWrite the Product Requirements Document with full feature definitions.\n\n## Deliverables\n- PRD.md\n- Feature priority matrix\n- Success criteria mapping",
                "subtasks": [
                    {"name": "Feature definition", "notes": "List all features with priority"},
                    {"name": "User story mapping", "notes": "Map user stories to features"},
                    {"name": "Acceptance criteria", "notes": "Define pass/fail for each feature"},
                ],
            },
            {
                "name": "Create information architecture and sitemap",
                "agent_id": "ux-designer",
                "description": "## Objective\nDefine the site structure and navigation hierarchy.",
            },
            {
                "name": "Define user flows and acceptance criteria",
                "agent_id": "ux-designer",
                "description": "## Objective\nMap core user journeys and define UX acceptance criteria.",
            },
        ],
        "03 — Architecture & Setup": [
            {
                "name": "Produce technical architecture",
                "agent_id": "solution-architect",
                "description": "## Objective\nDefine the full technical architecture, including system design, component diagram, and technology choices.",
                "subtasks": [
                    {"name": "Architecture Decision Records", "notes": "Document key architectural decisions"},
                    {"name": "Component diagram", "notes": "Create system component diagram"},
                ],
            },
            {
                "name": "Define database schema and APIs",
                "agent_id": "solution-architect",
                "description": "## Objective\nDesign the data model and API contract.",
            },
            {
                "name": "Configure GitHub, AWS, Vercel, and secrets",
                "agent_id": "solution-architect",
                "description": "## Objective\nSet up infrastructure and CI/CD pipeline.",
            },
        ],
        "04 — Build": [
            {
                "name": "Implement frontend",
                "agent_id": "builder",
                "description": "## Objective\nBuild the frontend application following the design and architecture.",
                "subtasks": [
                    {"name": "Component library", "notes": "Build reusable UI components"},
                    {"name": "Page implementation", "notes": "Implement all pages per sitemap"},
                    {"name": "Responsive design", "notes": "Ensure mobile-friendly layout"},
                ],
            },
            {
                "name": "Implement backend APIs",
                "agent_id": "builder",
                "description": "## Objective\nBuild the backend service layer and API endpoints.",
                "subtasks": [
                    {"name": "Database setup", "notes": "Initialize database and run migrations"},
                    {"name": "API endpoints", "notes": "Implement all API routes"},
                    {"name": "Authorization", "notes": "Implement auth and RBAC"},
                ],
            },
            {
                "name": "Integrate agent runtime and tool gateway",
                "agent_id": "builder",
                "description": "## Objective\nWire up the ROSTR agent runtime with project-specific agents.",
            },
        ],
        "05 — QA & Security": [
            {
                "name": "Run test suite",
                "agent_id": "qa-reviewer",
                "description": "## Objective\nExecute full test suite and report results.",
                "subtasks": [
                    {"name": "Unit tests", "notes": "Verify all unit tests pass"},
                    {"name": "Integration tests", "notes": "Verify API contracts work"},
                    {"name": "E2E tests", "notes": "Critical user flows work end-to-end"},
                ],
            },
            {
                "name": "Perform security and permissions review",
                "agent_id": "qa-reviewer",
                "description": "## Objective\nSecurity audit of authentication, authorization, and data handling.",
            },
        ],
        "06 — Launch": [
            {
                "name": "Approve release candidate",
                "agent_id": "qa-reviewer",
                "description": "## Objective\nFinal review of release candidate before production deploy.",
                "subtasks": [
                    {"name": "Release checklist", "notes": "Verify all launch criteria met"},
                    {"name": "Performance benchmarks", "notes": "Verify load and response times"},
                ],
            },
            {
                "name": "Deploy production environment",
                "agent_id": "operations-agent",
                "description": "## Objective\nDeploy to production and verify live.",
                "subtasks": [
                    {"name": "Production deploy", "notes": "Execute deployment"},
                    {"name": "Smoke test", "notes": "Verify production is operational"},
                ],
            },
            {
                "name": "Complete handoff and operating guide",
                "agent_id": "operations-agent",
                "description": "## Objective\nDocument runbooks and hand off to operations team.",
            },
        ],
        "07 — Done / Knowledge": [
            {
                "name": "Project retrospective",
                "agent_id": "operations-agent",
                "description": "## Objective\nCapture learnings and archive project state.",
                "subtasks": [
                    {"name": "Learning documentation", "notes": "Document what worked and what didn't"},
                    {"name": "Knowledge base update", "notes": "Archive key artifacts to ROSTR Hub"},
                ],
            },
        ],
    }


# ── Standalone ───────────────────────────────────────

if __name__ == "__main__":
    import sys
    test_manifest = {
        "project_id": "proj_test_002",
        "title": "Test Provision v2",
        "goal": "Test the REST API-based provisioner",
        "project_type": "web_app_with_agents",
        "risk_level": "medium",
        "execution_mode": "draft_only",
        "approval_policy": "human_approval_required",
        "run_id": "run_test_002",
        "delivery_tracks": [
            "00 — Intake & Decisions", "01 — Discovery",
            "02 — Product & Design", "03 — Architecture & Setup",
            "04 — Build", "05 — QA & Security",
            "06 — Launch", "07 — Done / Knowledge",
        ],
    }
    
    if "--dry-run" in sys.argv:
        blueprint = _get_task_blueprint(test_manifest)
        for section, tasks in blueprint.items():
            print(f"\n## {section}")
            for t in tasks:
                print(f"  - {t['name']} [{t['agent_id']}]")
                for s in t.get("subtasks", []):
                    print(f"    * {s['name']}")
    else:
        print("Run with --dry-run to preview.")
