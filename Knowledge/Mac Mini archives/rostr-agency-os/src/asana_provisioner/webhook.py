"""
Webhook Handler — Asana webhook event processing.
Receives task/story events, verifies signatures, dispatches actions.
"""
import json
import hashlib
import hmac
import sys
from pathlib import Path
from typing import Optional

ROOT = Path(__file__).resolve().parent.parent.parent


class WebhookHandler:
    """Process Asana webhook events and dispatch to appropriate handlers."""
    
    def __init__(self, hub):
        self.hub = hub
    
    def verify_signature(self, payload: bytes, signature: str, secret: str) -> bool:
        """Verify Asana webhook HMAC-SHA256 signature."""
        if not secret or not signature:
            return False
        expected = hmac.new(
            secret.encode("utf-8"),
            payload,
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(expected, signature)
    
    def process_event(self, event: dict) -> dict:
        """Process a single Asana webhook event."""
        resource = event.get("resource", {})
        resource_type = resource.get("resource_type", "")
        resource_gid = resource.get("gid", "")
        
        action = event.get("action", "")
        parent = event.get("parent", {})
        
        # Find which project this belongs to
        project_gid = parent.get("gid", "") if parent else ""
        
        # Look up project in hub
        projects = self.hub.list_projects()
        target_project = None
        
        for p in projects:
            mapping = self.hub.get_asana_mapping(p.get("project_id", ""))
            if mapping.get("project_gid") == project_gid:
                target_project = p
                break
        
        if not target_project:
            return {"handled": False, "reason": "Unknown project"}
        
        project_id = target_project["project_id"]
        
        self.hub.log_event(project_id, {
            "event_type": "asana_webhook",
            "resource_type": resource_type,
            "resource_gid": resource_gid,
            "action": action,
            "event_data": event,
        })
        
        # Dispatch based on action
        handlers = {
            "task:status_changed": self._handle_task_status_change,
            "task:assigned": self._handle_task_assigned,
            "story:added": self._handle_story_added,
            "task:added": self._handle_task_added,
            "task:completed": self._handle_task_completed,
        }
        
        handler = handlers.get(action or "")
        if handler:
            try:
                return handler(project_id, resource_gid, event)
            except Exception as e:
                return {"handled": True, "status": "error", "error": str(e)}
        
        return {"handled": True, "status": "ignored", "action": action}
    
    def _handle_task_status_change(self, project_id: str, task_gid: str, event: dict) -> dict:
        """Handle task status change events — check for approval transitions."""
        # Check custom field changes for approval status
        change = event.get("change", {})
        new_value = change.get("new_value", {})
        
        if new_value == "Approved":
            self.hub.record_approval(
                project_id,
                f"task:{task_gid}",
                "Approved",
                "asana_webhook",
                "Task approved via Asana",
            )
            return {"handled": True, "status": "approval_recorded"}
        
        return {"handled": True, "status": "status_updated"}
    
    def _handle_task_assigned(self, project_id: str, task_gid: str, event: dict) -> dict:
        """Handle task assignment changes."""
        return {"handled": True, "status": "assignment_recorded"}
    
    def _handle_story_added(self, project_id: str, task_gid: str, event: dict) -> dict:
        """Handle new comments/stories on tasks."""
        return {"handled": True, "status": "story_recorded"}
    
    def _handle_task_added(self, project_id: str, task_gid: str, event: dict) -> dict:
        """Handle new tasks being added."""
        return {"handled": True, "status": "task_added"}
    
    def _handle_task_completed(self, project_id: str, task_gid: str, event: dict) -> dict:
        """Handle task completion events."""
        self.hub.log_event(project_id, {
            "event_type": "task_completed",
            "task_gid": task_gid,
        })
        return {"handled": True, "status": "task_completed"}
    
    def register_webhook(self, project_gid: str, target_url: str, secret: str) -> dict:
        """Register a webhook with Asana."""
        token = self._get_token()
        if not token:
            return {"error": "No Asana token"}
        
        import urllib.request
        import urllib.error
        
        url = "https://app.asana.com/api/1.0/webhooks"
        headers = {
            "Authorization": f"Bearer {token}",
            "Content-Type": "application/json",
        }
        data = json.dumps({
            "data": {
                "resource": project_gid,
                "target": target_url,
            }
        }).encode("utf-8")
        
        req = urllib.request.Request(url, data=data, headers=headers, method="POST")
        try:
            with urllib.request.urlopen(req) as resp:
                result = json.loads(resp.read())
                return result.get("data", result)
        except urllib.error.HTTPError as e:
            err_body = e.read().decode()[:1000]
            return {"error": e.code, "body": err_body}
    
    def _get_token(self) -> str:
        token_path = Path.home() / ".hermes" / "skills" / "productivity" / "asana" / "asana_token"
        if token_path.exists():
            return token_path.read_text().strip()
        return ""
