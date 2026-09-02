"""
NPAO Router — Navigate, Prioritize, Allocate, Orchestrate
5D Phase Classification + 4D Priority Scoring + Agent Allocation
"""
import json
import re
from dataclasses import dataclass, field, asdict
from typing import Optional


# ── Phase Taxonomy ──────────────────────────────────

PHASES = {
    "pred": {
        "name": "PreD (Pre-Development)",
        "question": "Is this worth building?",
        "activities": ["Problem definition", "Competitive research", "Feasibility assessment", "Go/no-go"],
        "completion": ["Problem stated in one sentence", "Target user identified", "Success criteria defined"],
    },
    "design": {
        "name": "Design",
        "question": "What exactly are we building?",
        "activities": ["Architecture design", "UI/UX", "Data models", "API contracts", "Tech stack"],
        "completion": ["Architecture diagram exists", "User flows documented", "Data models defined"],
    },
    "development": {
        "name": "Development",
        "question": "Does it work?",
        "activities": ["Implementation", "Testing", "Code review", "Documentation"],
        "completion": ["All features implemented", "Test coverage ≥ threshold", "Code review passed"],
    },
    "deployment": {
        "name": "Deployment",
        "question": "Is it safe to ship?",
        "activities": ["CI/CD", "Staging verification", "Production deploy", "Monitoring"],
        "completion": ["Staging QA passed", "Security audit passed", "Monitoring active", "Production deploy verified"],
    },
    "debugging": {
        "name": "Debugging",
        "question": "What broke, why, how do we prevent it?",
        "activities": ["Bug reproduction", "Root cause analysis", "Fix", "Regression testing"],
        "completion": ["Bug reproduced reliably", "Root cause identified", "Fix implemented and tested", "Regression test added"],
    },
}

# Phase signals for classification
PHASE_SIGNALS = {
    "pred": r"should I|worth building|idea|explore|research|feasib|alternatives|go.no.go|problem space",
    "design": r"design|architecture|ui|ux|wireframe|mockup|prototype|schema|data model|user flow|sitemap",
    "development": r"build|implement|code|develop|feature|backend|frontend|integration|api|test|fix",
    "deployment": r"deploy|ship|release|launch|production|ci/cd|rollout|cicd|publish",
    "debugging": r"bug|error|crash|broken|fail|issue|investigate|root\s*cause|incident|outage",
}

# Phase urgency baseline for priority scoring
PHASE_URGENCY = {
    "pred": 2,
    "design": 4,
    "development": 6,
    "deployment": 8,
    "debugging": 10,
}


@dataclass
class NPAOResult:
    phase: str = "pred"
    phase_name: str = "PreD (Pre-Development)"
    phase_confidence: float = 0.0
    priority_score: float = 0.0
    dimensions: dict = field(default_factory=dict)
    allocation: Optional[dict] = None
    orchestration_pattern: str = "sequential"
    dependency_impact: int = 0
    business_impact: int = 4
    resource_efficiency: int = 5


def classify_phase(prompt: str, project_type: str = "") -> tuple[str, float]:
    """Classify the appropriate 5D phase based on prompt signals."""
    text = prompt.lower() + " " + project_type.lower()
    scores = {}
    
    for phase, pattern in PHASE_SIGNALS.items():
        matches = re.findall(pattern, text)
        scores[phase] = len(matches) * 2
    
    # Default boost for project type
    project_phase_map = {
        "web_app": "development",
        "web_app_with_agents": "development",
        "mobile_app": "development",
        "agent": "development",
        "workflow": "development",
        "api": "development",
        "campaign": "deployment",
        "content_site": "development",
    }
    boost = project_phase_map.get(project_type, "")
    if boost:
        scores[boost] = scores.get(boost, 0) + 1
    
    if not scores or max(scores.values()) == 0:
        return "pred", 0.5
    
    best_phase = max(scores, key=scores.get)
    max_score = scores[best_phase]
    total = sum(scores.values()) or 1
    confidence = min(max_score / total, 1.0)
    
    return best_phase, round(confidence, 2)


def score_priority(
    phase: str,
    dependency_impact: int = 0,
    business_impact: int = 4,
    resource_efficiency: int = 5,
    risk_level: str = "medium",
) -> dict:
    """
    Calculate 4D priority score.
    
    Composite = (Phase_Urgency × 0.35) + (Dependency × 0.30) + (Business × 0.25) + (Resource × 0.10)
    """
    phase_urgency = PHASE_URGENCY.get(phase, 5)
    
    # Risk modifier on business impact
    risk_modifiers = {"low": 0, "medium": 2, "high": 4}
    biz_impact = min(business_impact + risk_modifiers.get(risk_level, 0), 10)
    
    composite = (
        phase_urgency * 0.35 +
        dependency_impact * 0.30 +
        biz_impact * 0.25 +
        resource_efficiency * 0.10
    )
    
    return {
        "phase_urgency": phase_urgency,
        "dependency_impact": dependency_impact,
        "business_impact": biz_impact,
        "resource_efficiency": resource_efficiency,
        "composite_score": round(composite, 1),
        "priority_level": "immediate" if composite >= 7.0 else ("queued" if composite >= 4.0 else "backlog"),
    }


def allocate_agents(
    manifest: dict,
    available_agents: list[str],
    agent_registry: dict,
) -> list[dict]:
    """Allocate agents to project tasks based on phase and capability."""
    phase = manifest.get("npao_phase", "development")
    allocations = []
    
    # Agent phase capability mapping
    agent_phase_map = {
        "intake-strategist": ["pred", "design"],
        "product-manager": ["pred", "design", "development"],
        "research-agent": ["pred", "design", "debugging"],
        "solution-architect": ["design", "development", "deployment"],
        "ux-designer": ["design", "development"],
        "builder": ["development", "debugging"],
        "qa-reviewer": ["development", "deployment", "debugging"],
        "operations-agent": ["development", "deployment", "debugging"],
    }
    
    for agent_id in available_agents:
        if agent_id not in agent_registry:
            continue
            
        capabilities = agent_phase_map.get(agent_id, [])
        phase_match = phase in capabilities
        
        allocations.append({
            "agent_id": agent_id,
            "agent_name": agent_registry[agent_id]["name"],
            "phase_match": phase_match,
            "approval_level": agent_registry[agent_id].get("approval", "A1"),
            "auto": agent_registry[agent_id].get("auto", True),
        })
    
    return allocations


def determine_orchestration(phase: str, agent_count: int) -> str:
    """Determine the orchestration pattern based on phase and agent count."""
    if phase == "pred":
        return "sequential"
    elif phase == "development" and agent_count >= 3:
        return "parallel_fan_out"
    elif phase == "design":
        return "sequential"
    elif phase == "deployment":
        return "sequential"
    elif phase == "debugging":
        return "conditional_branch"
    else:
        return "sequential"


def route(manifest: dict, context: dict = None) -> dict:
    """
    Full NPAO routing for a compiled project manifest.
    
    Args:
        manifest: ProjectManifest dict from PAL compiler
        context: Additional context for ranking
    
    Returns:
        dict with phase, priority, allocation, orchestration
    """
    if context is None:
        context = {}
    
    prompt = manifest.get("goal", "")
    project_type = manifest.get("project_type", "web_app")
    risk = manifest.get("risk_level", "medium")
    agent_ids = manifest.get("agents", [])
    
    # Phase classification
    phase, confidence = classify_phase(prompt, project_type)
    phase_info = PHASES.get(phase, PHASES["pred"])
    
    # Priority scoring
    priority = score_priority(
        phase=phase,
        dependency_impact=context.get("dependency_impact", 0),
        business_impact=context.get("business_impact", 4),
        resource_efficiency=context.get("resource_efficiency", 5),
        risk_level=risk,
    )
    
    # Agent allocation
    from config.settings import AGENT_REGISTRY
    allocations = allocate_agents(manifest, agent_ids, AGENT_REGISTRY)
    
    # Orchestration
    pattern = determine_orchestration(phase, len(agent_ids))
    
    return {
        "phase": {
            "id": phase,
            "name": phase_info["name"],
            "question": phase_info["question"],
            "confidence": confidence,
            "activities": phase_info["activities"],
            "completion_criteria": phase_info["completion"],
        },
        "priority": priority,
        "allocation": allocations,
        "orchestration_pattern": pattern,
    }


# ── Standalone ───────────────────────────────────────

if __name__ == "__main__":
    import sys
    from config.settings import AGENT_REGISTRY
    
    manifest = {
        "goal": "Build an AI-powered EPK platform for independent artists",
        "project_type": "web_app_with_agents",
        "risk_level": "medium",
        "agents": ["intake-strategist", "product-manager", "research-agent", "solution-architect", "ux-designer", "builder", "qa-reviewer"],
    }
    
    result = route(manifest)
    print(json.dumps(result, indent=2))
