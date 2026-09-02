"""
ROSTR Hub — Agent Operating System with Persistent Project State
4-level state management: Session, Project, Organization, Agent
"""
import json
import os
import uuid
from datetime import datetime, timezone
from pathlib import Path
from typing import Union, Optional


class RostrHub:
    """Persistent storage and retrieval for project state, artifacts, and learnings."""
    
    def __init__(self, base_dir: str = None):
        self.base_dir = Path(base_dir) if base_dir else Path(__file__).resolve().parent.parent.parent / "data" / "projects"
        self.base_dir.mkdir(parents=True, exist_ok=True)
    
    # ── Project CRUD ───────────────────────────────────
    
    def create_project(self, manifest: dict) -> dict:
        """Initialize a new project namespace with full artifact structure."""
        pid = manifest.get("project_id", f"proj_{uuid.uuid4().hex[:12]}")
        project_dir = self.base_dir / pid
        project_dir.mkdir(parents=True, exist_ok=True)
        
        # Create artifact directories
        (project_dir / "artifacts").mkdir(exist_ok=True)
        (project_dir / "agents").mkdir(exist_ok=True)
        (project_dir / "approvals").mkdir(exist_ok=True)
        (project_dir / "asana").mkdir(exist_ok=True)
        
        # Write manifest
        self._write_json(project_dir / "PROJECT_MANIFEST.json", manifest)
        
        # Create artifact files
        bundle = manifest.get("document_bundle", {})
        for doc_name, content in bundle.items():
            if content:
                self._write_md(project_dir / "artifacts" / f"{doc_name}.md", content)
        
        # Initialize timeline (empty JSONL file)
        timeline_path = project_dir / "timeline.jsonl"
        timeline_path.write_text("")
        
        # Init approvals
        self._write_json(project_dir / "approvals" / "approval_state.json", {
            "stages": {},
            "policy": manifest.get("approval_policy", "human_approval_required"),
        })
        
        # Init Asana mapping
        self._write_json(project_dir / "asana" / "mapping.json", {
            "project_gid": "",
            "sections": {},
            "tasks": {},
        })
        
        return {
            "project_id": pid,
            "path": str(project_dir),
            "created_at": datetime.now(timezone.utc).isoformat(),
            "status": "initialized",
        }
    
    def get_project(self, project_id: str) -> Optional[dict]:
        """Retrieve the full project manifest."""
        path = self.base_dir / project_id / "PROJECT_MANIFEST.json"
        return self._read_json(path)
    
    def update_project(self, project_id: str, updates: dict) -> dict:
        """Update project state."""
        manifest = self.get_project(project_id) or {}
        manifest.update(updates)
        
        path = self.base_dir / project_id / "PROJECT_MANIFEST.json"
        self._write_json(path, manifest)
        return manifest
    
    def list_projects(self) -> list[dict]:
        """List all projects in the hub."""
        projects = []
        for d in self.base_dir.iterdir():
            if d.is_dir():
                manifest = self._read_json(d / "PROJECT_MANIFEST.json")
                if manifest:
                    projects.append({
                        "project_id": manifest.get("project_id", d.name),
                        "title": manifest.get("title", "Untitled"),
                        "status": manifest.get("status", "unknown"),
                        "created_at": manifest.get("created_at", ""),
                    })
        return sorted(projects, key=lambda p: p.get("created_at", ""), reverse=True)
    
    # ── Artifacts ─────────────────────────────────────
    
    def save_artifact(self, project_id: str, name: str, content: str, artifact_type: str = "md") -> str:
        """Save an artifact to the project."""
        artifact_dir = self.base_dir / project_id / "artifacts"
        artifact_dir.mkdir(parents=True, exist_ok=True)
        
        ext = "md" if artifact_type == "md" else "json"
        path = artifact_dir / f"{name}.{ext}"
        
        if artifact_type == "json":
            self._write_json(path, content)
        else:
            path.write_text(content)
        
        return str(path)
    
    def get_artifact(self, project_id: str, name: str) -> Optional[str]:
        """Read an artifact from the project."""
        for ext in ["md", "json"]:
            path = self.base_dir / project_id / "artifacts" / f"{name}.{ext}"
            if path.exists():
                if ext == "json":
                    return json.dumps(self._read_json(path), indent=2)
                return path.read_text()
        return None
    
    # ── Agent SOUL.md ─────────────────────────────────
    
    def save_agent_soul(self, project_id: str, agent_id: str, content: str) -> str:
        """Save an agent's SOUL.md file."""
        agents_dir = self.base_dir / project_id / "agents" / agent_id
        agents_dir.mkdir(parents=True, exist_ok=True)
        
        path = agents_dir / "SOUL.md"
        path.write_text(content)
        return str(path)
    
    def get_agent_soul(self, project_id: str, agent_id: str) -> Optional[str]:
        """Read an agent's SOUL.md file."""
        path = self.base_dir / project_id / "agents" / agent_id / "SOUL.md"
        return path.read_text() if path.exists() else None
    
    # ── Approvals ─────────────────────────────────────
    
    def get_approval_state(self, project_id: str) -> dict:
        """Get the current approval state for a project."""
        path = self.base_dir / project_id / "approvals" / "approval_state.json"
        return self._read_json(path) or {"stages": {}, "policy": "human_approval_required"}
    
    def record_approval(self, project_id: str, stage: str, status: str, approver: str = "system", notes: str = "") -> dict:
        """Record an approval decision."""
        state = self.get_approval_state(project_id)
        state["stages"][stage] = {
            "status": status,
            "approver": approver,
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "notes": notes,
        }
        
        path = self.base_dir / project_id / "approvals" / "approval_state.json"
        self._write_json(path, state)
        return state
    
    def check_approval(self, project_id: str, stage: str, required_level: str) -> bool:
        """Check if a specific stage has been approved."""
        state = self.get_approval_state(project_id)
        approval = state.get("stages", {}).get(stage, {})
        
        if required_level == "A0":
            return True  # Read/draft always allowed
        
        if not approval:
            return False
        
        return approval.get("status") == "Approved"
    
    # ── Asana Mapping ──────────────────────────────────
    
    def get_asana_mapping(self, project_id: str) -> dict:
        """Get Asana mapping for a project."""
        path = self.base_dir / project_id / "asana" / "mapping.json"
        return self._read_json(path) or {"project_gid": "", "sections": {}, "tasks": {}}
    
    def update_asana_mapping(self, project_id: str, mapping: dict) -> dict:
        """Update Asana mapping for a project."""
        path = self.base_dir / project_id / "asana" / "mapping.json"
        current = self._read_json(path) or {}
        current.update(mapping)
        self._write_json(path, current)
        return current
    
    # ── Timeline / Audit Log ──────────────────────────
    
    def log_event(self, project_id: str, event: dict) -> None:
        """Log an event to the project timeline."""
        timeline_path = self.base_dir / project_id / "timeline.jsonl"
        event["timestamp"] = event.get("timestamp", datetime.now(timezone.utc).isoformat())
        event["event_id"] = event.get("event_id", f"evt_{uuid.uuid4().hex[:8]}")
        
        with open(timeline_path, "a") as f:
            f.write(json.dumps(event) + "\n")
    
    def get_timeline(self, project_id: str, limit: int = 50) -> list[dict]:
        """Get project timeline events."""
        timeline_path = self.base_dir / project_id / "timeline.jsonl"
        if not timeline_path.exists():
            return []
        
        events = []
        with open(timeline_path) as f:
            for line in f:
                line = line.strip()
                if line:
                    events.append(json.loads(line))
        
        return events[-limit:]
    
    # ── Utilities ─────────────────────────────────────
    
    def _write_json(self, path: Path, data: Union[dict, list]) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(data, indent=2, default=str))
    
    def _read_json(self, path: Path) -> Union[dict, list, None]:
        if not path.exists():
            return None if path.suffix == ".json" else None
        try:
            return json.loads(path.read_text())
        except (json.JSONDecodeError, OSError):
            return None
    
    def _write_md(self, path: Path, content: str) -> None:
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content)


# ── Standalone ───────────────────────────────────────

if __name__ == "__main__":
    hub = RostrHub()
    print(f"Hub path: {hub.base_dir}")
    projects = hub.list_projects()
    print(f"Projects: {len(projects)}")
    for p in projects:
        print(f"  {p['project_id']}: {p['title']} ({p['status']})")
