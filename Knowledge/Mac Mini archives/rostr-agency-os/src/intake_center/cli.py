"""
Intake Center CLI — Collect build requests, compile with PAL, and manage the intake pipeline.
"""
import json
import sys
import os
from pathlib import Path
from datetime import datetime


ROOT = Path(__file__).resolve().parent.parent.parent


def _blue(text: str) -> str:
    return f"\033[94m{text}\033[0m"

def _green(text: str) -> str:
    return f"\033[92m{text}\033[0m"

def _yellow(text: str) -> str:
    return f"\033[93m{text}\033[0m"

def _red(text: str) -> str:
    return f"\033[91m{text}\033[0m"

def _bold(text: str) -> str:
    return f"\033[1m{text}\033[0m"


def show_banner():
    print()
    print(_bold("╔══════════════════════════════════════════════════════╗"))
    print(_bold("║         Monarch Project Factory                    ║"))
    print(_bold("║         ROSTR Agency OS — Intake Center            ║"))
    print(_bold("╚══════════════════════════════════════════════════════╝"))
    print()
    print(_blue("Tell us what you want to build. We turn it into a governed project,"))
    print(_blue("staffed agent team, implementation plan, and tracked delivery workspace."))
    print()


def intake_wizard() -> dict:
    """
    Interactive intake wizard that collects minimal structured inputs + freeform prompt.
    Returns a dictionary of intake data.
    """
    show_banner()
    
    print(_bold("Step 1: What do you want to build?"))
    print(_yellow("(Describe your idea in plain language — be as specific or as vague as you like)"))
    print()
    prompt = input("> ").strip()
    while not prompt:
        print(_red("A description is required."))
        prompt = input("> ").strip()
    
    print()
    print(_bold("Step 2: What's the desired outcome?"))
    print(_yellow("(What should users be able to do when it's done?)"))
    print()
    outcome = input("> ").strip()
    
    print()
    print(_bold("Step 3: Project type"))
    print(_yellow("(Pick the closest match)"))
    types = ["web_app", "web_app_with_agents", "agent", "mobile_app", "campaign", "workflow", "api", "content_site"]
    for i, t in enumerate(types, 1):
        print(f"  {i}. {t}")
    print()
    type_choice = input(f"Type [1-{len(types)}] (default: web_app_with_agents): ").strip()
    try:
        idx = int(type_choice) - 1
        project_type = types[idx] if 0 <= idx < len(types) else "web_app_with_agents"
    except ValueError:
        project_type = "web_app_with_agents"
    
    print()
    print(_bold("Step 4: Target audience"))
    print(_yellow("(Who will use this?)"))
    print()
    audience = input("> ").strip()
    
    print()
    print(_bold("Step 5: Constraints"))
    print(_yellow("(Budget, deadline, tech stack preferences, anything to avoid — comma separated)"))
    print()
    constraints_raw = input("> ").strip()
    constraints = [c.strip() for c in constraints_raw.split(",") if c.strip()]
    
    print()
    print(_bold("Step 6: Execution mode"))
    print(_yellow("(How should the project be executed?)"))
    modes = [
        ("draft_only", "Draft only — generate plans and documents, no code"),
        ("approval_gated", "Approval-gated — human must approve each major phase"),
        ("autonomous", "Autonomous — agents execute within scope boundaries"),
    ]
    for i, (mode_id, desc) in enumerate(modes, 1):
        print(f"  {i}. {mode_id} — {desc}")
    print()
    mode_choice = input(f"Mode [1-3] (default: approval_gated): ").strip()
    try:
        idx = int(mode_choice) - 1
        execution_mode = modes[idx][0] if 0 <= idx < len(modes) else "approval_gated"
    except ValueError:
        execution_mode = "approval_gated"
    
    print()
    print(_bold("Step 7: Inputs (optional)"))
    print(_yellow("(URLs to existing repos, docs, brand assets — one per line, blank line to end)"))
    print()
    inputs = []
    while True:
        inp = input("  Input (or blank): ").strip()
        if not inp:
            break
        if inp.startswith(("http://", "https://")):
            inputs.append({"type": "url", "content": inp})
        else:
            inputs.append({"type": "text", "content": inp})
    
    return {
        "prompt": prompt,
        "outcome": outcome,
        "project_type": project_type,
        "audience": audience,
        "constraints": constraints,
        "execution_mode": execution_mode,
        "inputs": inputs,
    }


def compile_and_review(intake_data: dict) -> dict:
    """Compile intake data into a ProjectManifest and show review screen."""
    print()
    print(_bold("╔═══════════════════════════════════════════════╗"))
    print(_bold("║         PAL Compilation                      ║"))
    print(_bold("╚═══════════════════════════════════════════════╝"))
    print()
    
    # Import PAL compiler
    sys.path.insert(0, str(ROOT))
    from src.pal.compiler import compile_prompt
    
    # Build the full prompt with context
    full_prompt = intake_data["prompt"]
    if intake_data["outcome"]:
        full_prompt += f" Outcome: {intake_data['outcome']}"
    if intake_data["audience"]:
        full_prompt += f" Target: {intake_data['audience']}"
    
    # Compile
    result = compile_prompt(full_prompt, intake_data.get("inputs", []))
    manifest = result["manifest"]
    intent = result["intent"]
    
    # Override fields from intake
    manifest["project_type"] = intake_data.get("project_type", manifest["project_type"])
    manifest["audience"] = intake_data.get("audience", manifest["audience"])
    manifest["execution_mode"] = intake_data.get("execution_mode", manifest["execution_mode"])
    manifest["client_name"] = intake_data.get("client_name", "Intake Request")
    if intake_data.get("constraints"):
        manifest["constraints"].extend(intake_data["constraints"])
    if intake_data.get("inputs"):
        manifest["inputs"].extend(intake_data["inputs"])
    
    # Recalculate risk and approval based on updated fields
    from src.pal.compiler import _detect_risk, _detect_approval_policy
    manifest["risk_level"] = _detect_risk(full_prompt, manifest["constraints"])
    manifest["approval_policy"] = _detect_approval_policy(full_prompt, manifest["constraints"])
    
    print(f"  {_bold('Title:')} {manifest['title']}")
    print(f"  {_bold('Type:')} {manifest['project_type']}")
    print(f"  {_bold('Risk:')} {manifest['risk_level']}")
    print(f"  {_bold('Mode:')} {manifest['execution_mode']}")
    print(f"  {_bold('Agents:')} {', '.join(manifest['agents'])}")
    if manifest["success_metrics"]:
        print(f"  {_bold('Metrics:')}")
        for m in manifest["success_metrics"]:
            print(f"    - {m}")
    print(f"  {_bold('Document Bundle:')} {len(result['document_bundle'])} docs generated")
    
    return result


def review_decision(result: dict) -> str:
    """Ask the user to approve, edit, or reject the compiled plan."""
    print()
    print(_bold("╔═══════════════════════════════════════════════╗"))
    print(_bold("║         Review & Approve                      ║"))
    print(_bold("╚═══════════════════════════════════════════════╝"))
    print()
    print("  " + _yellow("What would you like to do?"))
    print()
    print("  1. " + _green("Approve") + " — Provision the project to Asana")
    print("  2. " + _yellow("Revise") + " — Edit the plan before provisioning")
    print("  3. " + _red("Reject") + " — Discard this intake request")
    print()
    
    choice = input("Choice [1-3] (default: 1): ").strip()
    return {"1": "approved", "2": "revise", "3": "rejected"}.get(choice, "approved")


def provision(result: dict, workspace_gid: str = "") -> dict:
    """Provision the approved project to Asana."""
    print()
    print(_bold("╔═══════════════════════════════════════════════╗"))
    print(_bold("║         Provisioning                           ║"))
    print(_bold("╚═══════════════════════════════════════════════╝"))
    print()
    
    manifest = result["manifest"]
    
    # Initialize Hub
    sys.path.insert(0, str(ROOT))
    from src.hub.storage import RostrHub
    hub = RostrHub()
    
    # Create project in Hub
    print("  Creating project in ROSTR Hub...")
    hub_result = hub.create_project(manifest)
    project_id = hub_result["project_id"]
    print(f"  Project ID: {project_id}")
    print(f"  Path: {hub_result['path']}")
    
    # Save document bundle
    bundle = result.get("document_bundle", {})
    for doc_name, content in bundle.items():
        if content:
            hub.save_artifact(project_id, doc_name, content)
            print(f"  Saved: {doc_name}.md")
    
    # Log event
    hub.log_event(project_id, {
        "event_type": "intake_completed",
        "intake_mode": "cli_wizard",
        "manifest_version": "1.0",
    })
    
    # Provision agents
    from src.agents.factory import agent_factory
    print("  Provisioning agents...")
    agents = agent_factory(manifest, hub)
    for a in agents:
        print(f"    - {a['name']} ({a['agent_id']}) → {a['soul_path']}")
    
    # Create Asana project
    from src.asana_provisioner.adapter import provision_project
    print("  Creating Asana project...")
    asana_result = provision_project(manifest, workspace_gid)
    
    if "error" in asana_result:
        print(f"  {_red('Asana provisioning error:')} {asana_result.get('error')}")
        print(f"  {_yellow('Hub project still created. Run later with:')}")
        print(f"  monarch provision {project_id}")
        asana_result = {"error": str(asana_result.get("error")), "status": "hub_only"}
    else:
        print(f"  {_green('Asana project created:')} {asana_result.get('project_url', '')}")
        print(f"  Tasks created: {len(asana_result.get('tasks', {}))}")
    
    print()
    print(_green("╔═══════════════════════════════════════════════╗"))
    print(_green("║         Project Provisioned ✓                 ║"))
    print(_green("╚═══════════════════════════════════════════════╝"))
    print()
    print(f"  ROSTR Hub: {hub_result['path']}")
    if "project_url" in asana_result:
        print(f"  Asana:     {asana_result['project_url']}")
    print(f"  Agents:    {len(agents)} provisioned")
    print(f"  Tracks:    {len(manifest.get('delivery_tracks', []))}")
    
    return {
        "hub": hub_result,
        "project_id": project_id,
        "asana": asana_result,
        "agents": agents,
    }


def run():
    """Main intake flow."""
    intake = intake_wizard()
    result = compile_and_review(intake)
    decision = review_decision(result)
    
    if decision == "approved":
        outcome = provision(result)
        return outcome
    elif decision == "revise":
        print()
        print(_yellow("Revision mode — run `monarch intake --edit` with your edits."))
        print(_yellow("For now, the intake data is saved for manual editing."))
        
        # Save for later editing
        import tempfile
        save_path = Path(tempfile.gettempdir()) / "monarch_intake_draft.json"
        save_path.write_text(json.dumps(intake, indent=2))
        print(_yellow(f"Draft saved to {save_path}"))
        return {"status": "revised"}
    else:
        print()
        print(_red("Intake request rejected. No project created."))
        return {"status": "rejected"}


# ── Quick path: command-line intake ──────────────────

def quick_intake(prompt: str, **kwargs):
    """Quick intake from command line without wizard."""
    from src.pal.compiler import compile_prompt
    from src.hub.storage import RostrHub
    
    result = compile_prompt(prompt)
    manifest = result["manifest"]
    
    # Override with kwargs
    for k, v in kwargs.items():
        if v:
            manifest[k] = v
    
    return result


# ── Entry point ──────────────────────────────────────

if __name__ == "__main__":
    import sys
    sys.path.insert(0, str(ROOT))
    
    if len(sys.argv) > 1:
        if sys.argv[1] == "--quick":
            prompt = " ".join(sys.argv[2:])
            if not prompt:
                print("Usage: python3 intake.py --quick <prompt>")
                sys.exit(1)
            result = quick_intake(prompt)
            print(json.dumps(result["manifest"], indent=2))
        elif sys.argv[1] == "--web":
            # Launch web UI
            print("Starting web UI...")
            os.execvp("python3", ["python3", "-m", "uvicorn", "src.intake_center.web:app", "--host", "0.0.0.0", "--port", "8080"])
        else:
            print("Usage: python3 intake.py [--quick <prompt> | --web]")
    else:
        run()
