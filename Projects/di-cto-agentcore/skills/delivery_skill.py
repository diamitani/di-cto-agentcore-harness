"""Delivery skill wrapper for agent invocation."""

from typing import Any
from dataclasses import dataclass


@dataclass
class DeliveryResult:
    """Delivery skill result."""
    status: str  # success | blocked | failed
    plan: str
    implementation: dict[str, Any]
    verification: dict[str, Any]
    next_steps: list[str]
    approval_required: list[str]


class DeliverySkill:
    """
    Product-to-production delivery skill.
    
    Implements the SKILL.md delivery procedure in code.
    """
    
    SKILL_ID = "di-cto-delivery"
    VERSION = "0.1.0"
    
    def __init__(self, agent_context: dict | None = None):
        self.context = agent_context or {}
        self.tools_available = {}
        
    PHASES = [
        "intake",
        "discover",
        "plan",
        "design",
        "build",
        "verify",
        "package",
    ]
    
    def run(self, request: str, project: str | None = None) -> DeliveryResult:
        """
        Execute delivery skill end-to-end.
        
        Args:
            request: User's delivery request
            project: Target project name/path
        """
        # 1. Intake
        intent = self._extract_intent(request)
        
        # 2. Discover
        discovery = self._run_discovery(project, intent)
        
        # 3. Plan
        plan = self._create_plan(intent, discovery)
        
        # 4. Design
        if intent.get("needs_design"):
            design = self._run_design(intent)
            plan["design"] = design
        
        # 5. Build (placeholder - real implementation would delegate)
        build_result = {
            "status": "not_started",
            "note": "Implementation requires file_write tool"
        }
        
        # 6. Verify
        verification = {
            "status": "not_started",
            "note": "Verification requires test execution"
        }
        
        # Check approval gates
        approval_required = []
        if intent.get("phase") == "deploy":
            approval_required.append("production_deploy")
            
        return DeliveryResult(
            status="ready" if not approval_required else "blocked",
            plan=str(plan),
            implementation=build_result,
            verification=verification,
            next_steps=[
                "Create PRD",
                "Define architecture",
                "Implement vertical slice",
                "Run tests",
                "Request approval" if approval_required else "Deploy"
            ],
            approval_required=approval_required,
        )
    
    def _extract_intent(self, request: str) -> dict:
        """Parse delivery request."""
        return {
            "raw": request,
            "phase": "development",  # PreD | Design | Development | Deploy
            "needs_design": "design" in request.lower(),
            "needs_auth": any(x in request.lower() for x in ["auth", "signin", "oauth"]),
            "needs_checkout": "checkout" in request.lower(),
            "platform": self._extract_platform(request),
        }
    
    def _extract_platform(self, request: str) -> str:
        """Detect target platform."""
        req_lower = request.lower()
        if "web" in req_lower:
            return "web"
        elif "mobile" in req_lower or "ios" in req_lower or "android" in req_lower:
            return "mobile"
        elif "agent" in req_lower:
            return "agent"
        return "web"  # default
    
    def _run_discovery(self, project: str | None, intent: dict) -> dict:
        """Discovery phase."""
        return {
            "project": project,
            "workspace_verified": bool(project),
            "existing_files": [],
            "dependencies": [],
        }
    
    def _create_plan(self, intent: dict, discovery: dict) -> dict:
        """Create delivery plan."""
        return {
            "outcome": intent["raw"],
            "platform": intent["platform"],
            "phases": self.PHASES,
            "milestones": [
                "M0 Discovery complete",
                "M1 Vertical slice",
                "M2 Integration complete",
                "M3 Release candidate",
                "M4 Production verified",
            ],
            "approval_gates": self._identify_approval_gates(intent),
        }
    
    def _run_design(self, intent: dict) -> dict:
        """Run design phase."""
        return {
            "ui_needed": intent.get("needs_design", False),
            "architecture_needed": True,
            "next_steps": ["Create PRD", "Architecture diagram", "Data model"],
        }
    
    def _identify_approval_gates(self, intent: dict) -> list[str]:
        """Determine what needs approval."""
        gates = []
        if intent.get("phase") == "deploy":
            gates.append("production_deploy")
        if intent.get("needs_auth"):
            gates.append("oauth_client_rotation")
        if intent.get("needs_checkout"):
            gates.append("payment_provider_live")
        return gates


def run_delivery(request: str, project: str | None = None) -> DeliveryResult:
    """Convenience function."""
    skill = DeliverySkill()
    return skill.run(request, project)


if __name__ == "__main__":
    # Test
    result = run_delivery("Build a landing page with pricing", "my-lp")
    print(f"Status: {result.status}")
    print(f"Plan: {result.plan}")
    print(f"Next steps: {result.next_steps}")
