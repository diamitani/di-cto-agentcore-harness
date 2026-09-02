"""
NPAO (Natural Priority Agent Orchestrator) skill for DI-CTO AgentCore.
Calculates 4D priority matrices and orchestrates sub-agent queues.
"""

from typing import Any
from dataclasses import dataclass


@dataclass
class NPAOResult:
    task_id: str
    phase: str
    phase_score: float
    dependency_score: float
    business_score: float
    resource_score: float
    final_priority: float
    queue_rank: int
    assigned_subagents: list[str]
    rationale: str


class NPAOSkill:
    """
    NPAO Orchestration Engine:
    Priority = (Phase × 0.35) + (Dependency × 0.30) + (Business × 0.25) + (Resource × 0.10)
    """

    SKILL_ID = "di-cto-npao-orchestrator"
    VERSION = "1.0.0"

    PHASE_SCORES = {
        "Debugging": 10.0,
        "Deploy": 8.0,
        "Development": 6.0,
        "Design": 4.0,
        "PreD": 2.0,
    }

    def calculate_priority(
        self,
        task_id: str,
        phase: str,
        dependency_score: float = 5.0,
        business_score: float = 6.0,
        resource_score: float = 7.0,
    ) -> NPAOResult:
        phase_score = self.PHASE_SCORES.get(phase, 4.0)

        # 4D weighted sum
        score = (
            (phase_score * 0.35)
            + (dependency_score * 0.30)
            + (business_score * 0.25)
            + (resource_score * 0.10)
        )

        rationale = (
            f"Phase [{phase}] contributes {phase_score * 0.35:.2f} (35%), "
            f"Dependency [{dependency_score}] contributes {dependency_score * 0.30:.2f} (30%), "
            f"Business [{business_score}] contributes {business_score * 0.25:.2f} (25%), "
            f"Resource [{resource_score}] contributes {resource_score * 0.10:.2f} (10%)."
        )

        subagent_map = {
            "PreD": ["product-architect", "jtbd-npao-planner"],
            "Design": ["product-architect", "experience-engineer", "agent-runtime-engineer"],
            "Development": ["application-engineer", "agent-runtime-engineer", "quality-engineer"],
            "Deploy": ["devops-release-engineer", "identity-commerce-qa"],
            "Debugging": ["application-engineer", "security-reviewer"],
        }

        return NPAOResult(
            task_id=task_id,
            phase=phase,
            phase_score=phase_score,
            dependency_score=dependency_score,
            business_score=business_score,
            resource_score=resource_score,
            final_priority=round(score, 2),
            queue_rank=1 if score >= 7.0 else (2 if score >= 5.0 else 3),
            assigned_subagents=subagent_map.get(phase, ["application-engineer"]),
            rationale=rationale,
        )
