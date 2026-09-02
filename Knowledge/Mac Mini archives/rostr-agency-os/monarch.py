#!/usr/bin/env python3
"""
Monarch — ROSTR Agency OS Command Line Interface
Entry point for the Monarch Project Factory.
"""
import sys
import json
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ROOT))


def print_banner():
    print("""
╔══════════════════════════════════════════════════════╗
║              Monarch Project Factory                  ║
║              ROSTR Agency OS                          ║
╚══════════════════════════════════════════════════════╝
    """)


def cmd_intake(args):
    """Interactive intake wizard."""
    from src.intake_center.cli import run
    run()


def cmd_quick(args):
    """Quick intake from command line."""
    from src.orchestrator import full_pipeline
    prompt = " ".join(args)
    if not prompt:
        print("Usage: monarch quick <prompt>")
        sys.exit(1)
    result = full_pipeline(prompt)
    print(json.dumps({
        "project_id": result.get("project_id"),
        "title": result.get("manifest", {}).get("title"),
        "asana": result.get("asana", {}).get("project_url", "Hub only"),
        "agents": len(result.get("agents", [])),
    }, indent=2))


def cmd_list(args):
    """List all projects."""
    from src.orchestrator import list_projects
    projects = list_projects()
    if not projects:
        print("No projects found.")
        return
    
    print(f"\n{'ID':<25} {'Title':<40} {'Status':<15} {'Created':<20}")
    print("-" * 100)
    for p in projects:
        pid = p.get("project_id", "")[:24]
        title = p.get("title", "Untitled")[:39]
        status = p.get("status", "unknown")
        created = p.get("created_at", "")[:19] if p.get("created_at") else ""
        print(f"{pid:<25} {title:<40} {status:<15} {created:<20}")
    print(f"\n{len(projects)} projects total")


def cmd_get(args):
    """Get project details."""
    if not args:
        print("Usage: monarch get <project_id>")
        sys.exit(1)
    
    from src.orchestrator import get_project
    info = get_project(args[0])
    
    manifest = info.get("manifest", {}) or {}
    timeline = info.get("timeline", [])
    asana = info.get("asana", {}) or {}
    
    print(f"\nProject: {manifest.get('title', 'Untitled')}")
    print(f"ID:      {manifest.get('project_id', 'N/A')}")
    print(f"Type:    {manifest.get('project_type', 'N/A')}")
    print(f"Status:  {manifest.get('status', 'N/A')}")
    print(f"Risk:    {manifest.get('risk_level', 'N/A')}")
    print(f"Mode:    {manifest.get('execution_mode', 'N/A')}")
    if asana.get("project_url"):
        print(f"Asana:   {asana['project_url']}")
    
    print(f"\nEvents: {len(timeline)}")
    for e in timeline[-5:]:
        ts = e.get("timestamp", "")[:19]
        et = e.get("event_type", "event")
        print(f"  [{ts}] {et}")


def cmd_web(args):
    """Launch the web UI."""
    from src.intake_center.web import start_web
    port = int(args[0]) if args else 8080
    print(f"Starting Monarch Intake Center on http://localhost:{port}")
    
    import uvicorn
    from src.intake_center.web import app
    uvicorn.run(app, host="0.0.0.0", port=port)


def cmd_compile(args):
    """Just compile a prompt with PAL, don't provision."""
    from src.pal.compiler import compile_prompt
    prompt = " ".join(args)
    if not prompt:
        print("Usage: monarch compile <prompt>")
        sys.exit(1)
    result = compile_prompt(prompt)
    manifest = result["manifest"]
    print(json.dumps(manifest, indent=2))


def cmd_help():
    print_help()


def print_help():
    print_banner()
    print("Usage: monarch <command> [options]")
    print()
    print("Commands:")
    print("  intake              Interactive project intake wizard")
    print("  quick <prompt>      Quick intake + provision from command line")
    print("  compile <prompt>    PAL compile only (preview manifest)")
    print("  list                List all projects")
    print("  get <project_id>    Show project details")
    print("  web [port]          Launch web UI (default port 8080)")
    print()
    print("Examples:")
    print("  monarch intake")
    print('  monarch quick "Build an artist EPK platform"')
    print('  monarch compile "Build an AI marketplace"')
    print("  monarch list")
    print("  monarch web 8080")


def main():
    if len(sys.argv) < 2:
        print_help()
        return
    
    cmd = sys.argv[1]
    args = sys.argv[2:]
    
    commands = {
        "intake": cmd_intake,
        "quick": cmd_quick,
        "compile": cmd_compile,
        "list": cmd_list,
        "get": cmd_get,
        "web": cmd_web,
        "--help": cmd_help,
        "-h": cmd_help,
        "help": cmd_help,
    }
    
    handler = commands.get(cmd)
    if handler:
        handler(args)
    else:
        print(f"Unknown command: {cmd}")
        print_help()
        sys.exit(1)


if __name__ == "__main__":
    main()
