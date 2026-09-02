"""Monarch Project Factory — Configuration & Settings."""
import os
import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent

# ── Paths ────────────────────────────────────────────
DATA_DIR = ROOT / "data"
PROJECTS_DIR = DATA_DIR / "projects"
AGENTS_DIR = ROOT / "src" / "agents"
TEMPLATES_DIR = ROOT / "config" / "templates"
os.makedirs(PROJECTS_DIR, exist_ok=True)
os.makedirs(TEMPLATES_DIR, exist_ok=True)

# ── Asana ────────────────────────────────────────────
ASANA_TOKEN_PATH = Path.home() / ".hermes" / "skills" / "productivity" / "asana" / "asana_token"
ASANA_CLI = f"python3 {Path.home() / '.hermes' / 'skills' / 'productivity' / 'asana' / 'scripts' / 'asana_cli.py'}"
ASANA_WORKSPACE = os.environ.get("ASANA_WORKSPACE", os.environ.get("ASANA_WORKSPACE_GID", "1206772437471958"))

def get_asana_token() -> str:
    if ASANA_TOKEN_PATH.exists():
        return ASANA_TOKEN_PATH.read_text().strip()
    return os.environ.get("ASANA_TOKEN", "")

# ── Custom Fields ────────────────────────────────────
CUSTOM_FIELDS = {
    "agent": "Agent Assignment",
    "run_id": "ROSTR Run ID",
    "approval": "Approval Status",
    "state": "Task State",
}

APPROVAL_STATES = [
    "Drafting",
    "Needs Review",
    "Approved",
    "Rejected",
    "Executing",
    "Blocked",
    "Delivered",
]

# ── Delivery Templates ───────────────────────────────
DELIVERY_TRACKS = [
    {"id": "intake", "name": "00 — Intake & Decisions"},
    {"id": "discovery", "name": "01 — Discovery"},
    {"id": "product", "name": "02 — Product & Design"},
    {"id": "architecture", "name": "03 — Architecture & Setup"},
    {"id": "build", "name": "04 — Build"},
    {"id": "qa", "name": "05 — QA & Security"},
    {"id": "launch", "name": "06 — Launch"},
    {"id": "done", "name": "07 — Done / Knowledge"},
]

PROJECT_TYPES = [
    "web_app",
    "mobile_app",
    "agent",
    "workflow",
    "campaign",
    "api",
    "design_system",
    "content_site",
    "ai_integration",
    "web_app_with_agents",
]

EXECUTION_MODES = [
    "draft_only",
    "approval_gated",
    "autonomous",
]

# ── Agent Registry ───────────────────────────────────
AGENT_REGISTRY = {
    "intake-strategist": {
        "name": "Intake Strategist",
        "description": "Drafts brief, identifies assumptions, asks clarifying questions",
        "auto": True,
        "approval": "A0",
    },
    "product-manager": {
        "name": "Product Manager Agent",
        "description": "Produces PRD, backlog, acceptance criteria",
        "auto": True,
        "approval": "A1",
    },
    "research-agent": {
        "name": "Research Agent",
        "description": "Market, competitor, and technical research",
        "auto": True,
        "approval": "A0",
    },
    "solution-architect": {
        "name": "Solution Architect Agent",
        "description": "Stack decisions, diagrams, ADRs, data model",
        "auto": True,
        "approval": "A2",
    },
    "ux-designer": {
        "name": "UX Designer Agent",
        "description": "User flows, wireframes, sitemaps",
        "auto": True,
        "approval": "A1",
    },
    "builder": {
        "name": "Builder Agent",
        "description": "Code, tests, PRs within scoped branch",
        "auto": True,
        "approval": "A2",
    },
    "qa-reviewer": {
        "name": "QA & Review Agent",
        "description": "Test evidence, release checklist, bug reports",
        "auto": True,
        "approval": "A1",
    },
    "operations-agent": {
        "name": "Operations Agent",
        "description": "Status reports, dependency updates, comment updates",
        "auto": True,
        "approval": "A1",
    },
}
