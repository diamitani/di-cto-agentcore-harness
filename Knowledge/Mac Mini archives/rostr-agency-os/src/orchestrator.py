"""
Monarch Project Factory — Main Orchestrator
Coordinates PAL → Hub → NPAO → Agent Factory → Approval → Asana Provisioner
"""
import json
import sys
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent


def full_pipeline(prompt: str, workspace_gid: str = "", **overrides) -> dict:
    """
    Run the full intake-to-provision pipeline.
    
    1. PAL: compile prompt → ProjectManifest
    2. NPAO: classify phase, score priority, allocate agents
    3. Hub: create project storage, save artifacts
    4. Agent Factory: provision SOUL.md files
    5. Approval: check policy gates
    6. Asana: create project, sections, tasks, subtasks
    
    Returns dict with all stage outputs.
    """
    from src.pal.compiler import compile_prompt
    from src.npao.router import route as npao_route
    from src.hub.storage import RostrHub
    from src.agents.factory import agent_factory
    from src.approval.policy import PolicyEngine
    from src.asana_provisioner.adapter import provision_project
    
    pipeline = {}
    
    # ── Stage 1: PAL ────────────────────────────────────
    print("[pipeline] Stage 1: PAL Compilation")
    result = compile_prompt(prompt)
    manifest = result["manifest"]
    manifest.update(overrides)
    pipeline["pal"] = {"status": "complete", "intent": result["intent"]}
    
    # ── Stage 2: NPAO ───────────────────────────────────
    print("[pipeline] Stage 2: NPAO Routing")
    npao = npao_route(manifest)
    manifest["npao_phase"] = npao["phase"]["id"]
    manifest["npao_score"] = npao["priority"]["composite_score"]
    pipeline["npao"] = npao
    
    # ── Stage 3: Hub ────────────────────────────────────
    print("[pipeline] Stage 3: ROSTR Hub Initialization")
    hub = RostrHub()
    hub_result = hub.create_project(manifest)
    project_id = hub_result["project_id"]
    
    # Save document bundle
    bundle = result.get("document_bundle", {})
    for doc_name, content in bundle.items():
        if content:
            hub.save_artifact(project_id, doc_name, content)
    
    hub.log_event(project_id, {
        "event_type": "pipeline_run",
        "stages": ["pal", "npao", "hub", "agents", "approval", "asana"],
    })
    pipeline["hub"] = {"project_id": project_id, "path": hub_result["path"]}
    
    # ── Stage 4: Agent Factory ──────────────────────────
    print("[pipeline] Stage 4: Agent Provisioning")
    agents = agent_factory(manifest, hub)
    pipeline["agents"] = agents
    
    # ── Stage 5: Approval Policy Check ──────────────────
    print("[pipeline] Stage 5: Policy Check")
    policy = PolicyEngine(hub)
    approval_check = policy.check_action(project_id, "provision_project", "system", "A1")
    pipeline["approval"] = approval_check
    
    # ── Stage 6: Asana Provisioning ─────────────────────
    print("[pipeline] Stage 6: Asana Provisioning")
    asana_result = provision_project(manifest, workspace_gid)
    
    if "error" in asana_result:
        print(f"[pipeline] Asana issue (Hub-only mode): {asana_result.get('error', 'unknown')}")
        pipeline["asana"] = {"status": "hub_only", "error": str(asana_result.get("error", ""))}
    else:
        pipeline["asana"] = {
            "status": "provisioned",
            "project_gid": asana_result.get("project_gid"),
            "project_url": asana_result.get("project_url"),
            "sections": len(asana_result.get("sections", {})),
            "tasks": len(asana_result.get("tasks", {})),
        }
    
    # ── Update manifest with final state ─────────────────
    manifest["status"] = "provisioned" if "error" not in asana_result else "hub_only"
    hub.update_project(project_id, manifest)
    
    pipeline["manifest"] = manifest
    pipeline["project_id"] = project_id
    
    print(f"\n[pipeline] ✓ Complete — Project {project_id}")
    return pipeline


def pipeline_from_intake(intake_data: dict, workspace_gid: str = "") -> dict:
    """Run the full pipeline from structured intake data."""
    prompt = intake_data.get("prompt", "")
    if intake_data.get("outcome"):
        prompt += f" Outcome: {intake_data['outcome']}"
    
    return full_pipeline(
        prompt=prompt,
        workspace_gid=workspace_gid,
        project_type=intake_data.get("project_type", "web_app_with_agents"),
        audience=intake_data.get("audience", ""),
        execution_mode=intake_data.get("execution_mode", "approval_gated"),
        constraints=intake_data.get("constraints", []),
        inputs=intake_data.get("inputs", []),
    )


def list_projects() -> list[dict]:
    """List all projects in the hub."""
    from src.hub.storage import RostrHub
    hub = RostrHub()
    return hub.list_projects()


def get_project(project_id: str) -> dict:
    """Get full project details."""
    from src.hub.storage import RostrHub
    hub = RostrHub()
    manifest = hub.get_project(project_id)
    timeline = hub.get_timeline(project_id)
    asana = hub.get_asana_mapping(project_id)
    
    return {
        "manifest": manifest,
        "timeline": timeline,
        "asana": asana,
    }


# ── CLI Entry ──────────────────────────────────────────

if __name__ == "__main__":
    import sys
    sys.path.insert(0, str(ROOT.parent))
    
    if len(sys.argv) > 1 and sys.argv[1] == "pipeline":
        prompt = " ".join(sys.argv[2:]) if len(sys.argv) > 2 else "Build an AI-powered EPK platform"
        result = full_pipeline(prompt)
        print(json.dumps({k: v for k, v in result.items() if k != "manifest"}, indent=2))
    
    elif len(sys.argv) > 1 and sys.argv[1] == "list":
        projects = list_projects()
        print(json.dumps(projects, indent=2))
    
    elif len(sys.argv) > 2 and sys.argv[1] == "get":
        info = get_project(sys.argv[2])
        print(json.dumps({k: v for k, v in info.items() if v is not None}, indent=2, default=str))
    
    else:
        print("""
Monarch Project Factory — ROSTR Agency OS
Usage:
  python3 -m src.orchestrator list           # List all projects
  python3 -m src.orchestrator get <id>        # Get project details
  python3 -m src.orchestrator pipeline <txt>  # Run full pipeline
        """)
