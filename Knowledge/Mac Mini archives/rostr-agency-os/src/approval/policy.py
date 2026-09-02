"""
Approval Queue — Policy Engine for gating agent actions.
Enforces approval levels before any consequential action.
"""
import json
import os
from datetime import datetime, timezone
from dataclasses import dataclass, field, asdict
from typing import Optional


APPROVAL_LEVELS = {
    "A0": {"name": "Read & Draft", "description": "Read, research, generate drafts", "requires_approval": False, "requires_confirmation": False},
    "A1": {"name": "Internal Writes", "description": "Create tasks, comments, internal documents", "requires_approval": False, "requires_confirmation": False},
    "A2": {"name": "Scope & Ownership", "description": "Change scope, assign resources, mark milestones", "requires_approval": True, "requires_confirmation": False},
    "A3": {"name": "External Side Effects", "description": "Send emails, open PRs, create cloud resources", "requires_approval": True, "requires_confirmation": False},
    "A4": {"name": "Irreversible/High-Impact", "description": "Deploy production, spend money, delete data", "requires_approval": True, "requires_confirmation": True},
}


@dataclass
class ApprovalRequest:
    request_id: str = ""
    project_id: str = ""
    action: str = ""
    agent_id: str = ""
    approval_level: str = "A0"
    description: str = ""
    status: str = "pending"  # pending, approved, rejected, escalated
    requested_by: str = ""
    reviewed_by: str = ""
    created_at: str = ""
    reviewed_at: str = ""
    notes: str = ""


class PolicyEngine:
    """Policy engine that gates agent actions based on approval levels."""
    
    def __init__(self, hub):
        self.hub = hub
    
    def check_action(self, project_id: str, action: str, agent_id: str, approval_level: str = "A1") -> dict:
        """
        Check if an action is permitted for the given agent.
        
        Returns:
            dict with 'permitted' (bool), 'reason', 'requires_approval'
        """
        level_info = APPROVAL_LEVELS.get(approval_level, APPROVAL_LEVELS["A1"])
        
        if level_info["requires_approval"]:
            # Check if approval exists in hub
            approved = self.hub.check_approval(project_id, action, approval_level)
            if not approved:
                return {
                    "permitted": False,
                    "reason": f"Action requires {approval_level} approval ({level_info['name']})",
                    "requires_approval": True,
                    "requires_confirmation": level_info["requires_confirmation"],
                    "approval_level": approval_level,
                }
        
        return {
            "permitted": True,
            "reason": "Action is permitted",
            "requires_approval": False,
        }
    
    def request_approval(self, project_id: str, action: str, agent_id: str, approval_level: str, description: str) -> ApprovalRequest:
        """Create an approval request in the queue."""
        import uuid
        req = ApprovalRequest(
            request_id=f"apr_{uuid.uuid4().hex[:8]}",
            project_id=project_id,
            action=action,
            agent_id=agent_id,
            approval_level=approval_level,
            description=description,
            status="pending",
            created_at=datetime.now(timezone.utc).isoformat(),
        )
        
        # Store in hub
        self.hub.log_event(project_id, asdict(req))
        
        return req
    
    def approve(self, project_id: str, action: str, reviewer: str, notes: str = "") -> dict:
        """Record an approval decision."""
        state = self.hub.record_approval(project_id, action, "Approved", reviewer, notes)
        return state
    
    def reject(self, project_id: str, action: str, reviewer: str, notes: str = "") -> dict:
        """Record a rejection."""
        state = self.hub.record_approval(project_id, action, "Rejected", reviewer, notes)
        return state
    
    def get_pending_approvals(self, project_id: str) -> list[dict]:
        """Get all pending approval requests for a project."""
        timeline = self.hub.get_timeline(project_id)
        return [
            e for e in timeline
            if e.get("event_type") == "approval_requested" and e.get("status") == "pending"
        ]
    
    def describe_action_level(self, action: str) -> str:
        """Classify an action into an approval level."""
        action_lower = action.lower()
        
        # A4 — Irreversible
        if any(k in action_lower for k in ["deploy prod", "delete", "drop table", "rm -rf",
                                              "spend money", "publish", "production release"]):
            return "A4"
        
        # A3 — External
        if any(k in action_lower for k in ["send email", "create repo", "open pr", "merge",
                                              "create cloud", "provision", "api call external"]):
            return "A3"
        
        # A2 — Scope
        if any(k in action_lower for k in ["complete milestone", "change scope", "assign",
                                              "reprioritize", "mark done", "sign off"]):
            return "A2"
        
        # A1 - Internal writes
        if any(k in action_lower for k in ["create task", "update task", "add comment",
                                              "write doc", "create section"]):
            return "A1"
        
        # A0 - default
        return "A0"


# ── Standalone ───────────────────────────────────────

if __name__ == "__main__":
    print("Approval Levels:")
    for level, info in APPROVAL_LEVELS.items():
        flag = "🔒" if info["requires_approval"] else "✅"
        confirm = " + confirm" if info["requires_confirmation"] else ""
        print(f"  {flag} {level}: {info['name']}{confirm}")
        print(f"     {info['description']}")
