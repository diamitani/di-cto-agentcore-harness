"""
PAL Compiler — Prompt Abstraction Layer
Transforms plain-language intent into a structured ProjectManifest.

Five stages:
1. Intent Extraction
2. Context Injection
3. Semantic Enhancement
4. Runtime Compilation
5. Output Routing
"""
import json
import re
import uuid
from datetime import datetime, timezone
from dataclasses import dataclass, field, asdict
from typing import Optional


# ── Data Models ──────────────────────────────────────

@dataclass
class IntentExtract:
    primary_intent: str
    domain: str
    subject: str
    constraints: list[str] = field(default_factory=list)
    desired_output: str = ""
    urgency: str = "queued"
    ambiguity_score: float = 0.0


@dataclass
class ProjectManifest:
    project_id: str = ""
    title: str = ""
    project_type: str = "web_app"
    goal: str = ""
    success_metrics: list[str] = field(default_factory=list)
    delivery_tracks: list[dict] = field(default_factory=list)
    agents: list[str] = field(default_factory=list)
    approval_policy: str = "human_approval_required"
    risk_level: str = "medium"
    client_name: str = ""
    audience: str = ""
    constraints: list[str] = field(default_factory=list)
    execution_mode: str = "draft_only"
    inputs: list[dict] = field(default_factory=list)
    created_at: str = ""
    run_id: str = ""
    workspace_gid: str = ""


@dataclass
class DocumentBundle:
    project_brief: str = ""
    discovery_memo: str = ""
    jtbd_analysis: str = ""
    prd: str = ""
    requirements: str = ""
    sitemap: str = ""
    architecture: str = ""
    data_model: str = ""
    delivery_plan: str = ""
    agent_roster: str = ""
    tool_manifest: str = ""
    build_prompts: str = ""
    qa_plan: str = ""
    decision_log: str = ""
    approval_plan: str = ""


# ── Domain Detection ─────────────────────────────────

DOMAIN_PATTERNS = {
    "web_app": r"web\s*app|website|platform|dashboard|portal|landing|site|frontend",
    "mobile_app": r"mobile|ios|android|swift|flutter|react\s*native",
    "agent": r"agent|ai|llm|chatbot|assistant|autonomous|copilot",
    "workflow": r"workflow|automation|pipeline|integration|etl|cron",
    "campaign": r"campaign|marketing|launch|promotion|social",
    "api": r"api|backend|service|endpoint|microservice",
    "design_system": r"design\s*system|ui\s*kit|component\s*lib|theme",
    "content_site": r"blog|content|docs|wiki|knowledge\s*base",
    "ai_integration": r"ai\s*integrat|llm\s*integrat|embed\s*ai",
}

DOMAIN_PRIORITY = [
    "agent", "ai_integration", "web_app_with_agents",
    "web_app", "mobile_app", "api", "workflow",
    "campaign", "content_site", "design_system",
]

RISK_KEYWORDS = {
    "high": r"production|launch|revenue|payment|pii|auth|deploy|live|customer-facing|scale",
    "medium": r"user\s*data|integration|third.party|multi.user|team|collaboration",
    "low": r"prototype|draft|internal|experiment|test|personal|demo",
}

APPROVAL_KEYWORDS = {
    "autonomous": r"auto.*(?:deploy|ship|release)|no\s*review|full\s*autonomy",
    "human_approval_required": r"approval|review|gate|sign.off|check|confirm",
    "draft_only": r"draft|proposal|idea|explore|suggest",
}


def _detect_domain(intent: str, prompt: str) -> str:
    text = f"{intent} {prompt}".lower()
    scores = {}
    for domain, pattern in DOMAIN_PATTERNS.items():
        matches = len(re.findall(pattern, text))
        if matches:
            scores[domain] = matches
    
    if not scores:
        return "web_app"
    
    # Check for combined web_app + agent (most common modern pattern)
    web_score = scores.get("web_app", 0) + scores.get("content_site", 0) + scores.get("api", 0)
    agent_score = scores.get("agent", 0) + scores.get("ai_integration", 0)
    if web_score >= 1 and agent_score >= 1:
        return "web_app_with_agents"
    
    # Check pure agent (no web signals)
    if agent_score >= 1 and web_score == 0:
        return "agent"
    
    # Return best match with domain priority tiebreaker
    best = max(scores, key=lambda d: (scores[d], -DOMAIN_PRIORITY.index(d) if d in DOMAIN_PRIORITY else 99))
    return best


def _detect_risk(prompt: str, constraints: list[str]) -> str:
    text = prompt.lower() + " " + " ".join(constraints).lower()
    for level, pattern in RISK_KEYWORDS.items():
        if re.search(pattern, text):
            return level
    return "medium"


def _detect_approval_policy(prompt: str, constraints: list[str]) -> str:
    text = prompt.lower() + " " + " ".join(constraints).lower()
    for policy, pattern in APPROVAL_KEYWORDS.items():
        if re.search(pattern, text):
            return policy
    return "human_approval_required"


def _generate_manifest_id() -> str:
    return f"proj_{uuid.uuid4().hex[:12]}"


def _generate_run_id() -> str:
    return f"run_{uuid.uuid4().hex[:8]}"


# ── PAL Stages ────────────────────────────────────────

def stage1_intent_extraction(prompt: str, inputs: list[dict] = None) -> IntentExtract:
    """Stage 1: Extract raw intent from the user prompt."""
    prompt_lower = prompt.lower()
    
    # Parse constraints from prompt
    constraint_markers = ["constraint", "limit", "must", "cannot", "need to", "budget", "deadline"]
    constraints = []
    for marker in constraint_markers:
        for match in re.finditer(rf'(?:{marker}[^.]*\.)', prompt_lower):
            constraints.append(match.group(0).strip())
    
    # Detect urgency
    urgency = "queued"
    if re.search(r"asap|urgent|immediate|today|now|emergency", prompt_lower):
        urgency = "immediate"
    elif re.search(r"this week|soon|next", prompt_lower):
        urgency = "scheduled"
    
    # Detect ambiguity
    ambiguity = 0.0
    vague_terms = ["something", "maybe", "kind of", "like", "sort of", "cool", "nice"]
    vagueness = sum(1 for t in vague_terms if t in prompt_lower)
    ambiguity = min(vagueness * 0.15, 0.8)
    if len(prompt.split()) < 10:
        ambiguity += 0.2
    
    domain = _detect_domain(prompt, prompt)
    
    # Extract primary verb+object
    verbs = ["build", "create", "make", "design", "develop", "ship", "deploy",
             "fix", "improve", "automate", "integrate", "migrate", "launch"]
    primary_verb = "build"
    for v in verbs:
        if v in prompt_lower.split()[:15]:
            primary_verb = v
            break
    
    # Extract subject (first noun-like phrase after verb)
    subject = prompt[:80].strip() if len(prompt) > 80 else prompt
    
    return IntentExtract(
        primary_intent=f"{primary_verb} {prompt[:60].strip()}",
        domain=domain,
        subject=subject,
        constraints=constraints,
        desired_output="",
        urgency=urgency,
        ambiguity_score=round(ambiguity, 2),
    )


def stage2_context_injection(intent: IntentExtract) -> IntentExtract:
    """Stage 2: Inject project context and defaults."""
    # Enhance constraints with domain-specific defaults
    if intent.domain == "web_app_with_agents" and "agents" not in " ".join(intent.constraints):
        intent.constraints.append("Requires AI agent runtime integration")
    if intent.domain == "web_app" and "hosting" not in " ".join(intent.constraints):
        intent.constraints.append("Requires hosting and deployment")
    
    return intent


def stage3_semantic_enhancement(intent: IntentExtract, prompt: str) -> IntentExtract:
    """Stage 3: Expand ambiguous terms, add precision."""
    # Expand vague verbs
    intent.primary_intent = intent.primary_intent.replace("create", "design and implement")
    intent.primary_intent = intent.primary_intent.replace("make", "build and ship")
    
    # Extract desired output if present
    outcome_markers = ["so that", "to enable", "so users can", "to let", "allowing"]
    for marker in outcome_markers:
        if marker in prompt.lower():
            idx = prompt.lower().index(marker)
            intent.desired_output = prompt[idx + len(marker):].strip().rstrip(".!")
            break
    
    return intent


def stage4_compilation(intent: IntentExtract, prompt: str, inputs: list[dict] = None) -> ProjectManifest:
    """Stage 4: Compile the enhanced intent into a structured ProjectManifest."""
    delivery_tracks = _generate_delivery_tracks()
    
    # Select agents based on project type
    agents = _select_agents(intent.domain)
    
    # Detect constraints from prompt
    text_lower = prompt.lower()
    constraints = []
    constraint_indicators = ["budget", "deadline", "existing", "stack", "limit", "scope"]
    for c in constraint_indicators:
        for match in re.finditer(rf'(?:{c}[^.]*\.)', text_lower):
            constraints.append(match.group(0).strip())
    constraints.extend(intent.constraints)
    
    # Extract success metrics
    success_metrics = []
    metric_pattern = r"(?:should|must|will|can)\s+(?:be\s+)?(?:able\s+to\s+|)(\w+\s+\w+[^.,]*)"
    for match in re.finditer(metric_pattern, prompt):
        metric = match.group(0).strip()
        if len(metric) > 10:
            success_metrics.append(metric)
    
    # Extract audience
    audience = ""
    audience_patterns = [
        r"(?:for|target|audience)\s+([^.,]*)",
        r"(?:indie|independent)\s+([^.,]*artists?)",
    ]
    for pat in audience_patterns:
        m = re.search(pat, text_lower)
        if m:
            audience = m.group(0).strip()
            break
    
    risk = _detect_risk(prompt, constraints)
    approval = _detect_approval_policy(prompt, constraints)
    
    now = datetime.now(timezone.utc).isoformat()
    
    # Title generation
    title = _generate_title(prompt)
    
    return ProjectManifest(
        project_id=_generate_manifest_id(),
        run_id=_generate_run_id(),
        title=title,
        project_type=intent.domain,
        goal=prompt.strip(),
        success_metrics=success_metrics if success_metrics else [
            "Core functionality working",
            "User testing passes",
            "Deployed to production",
        ],
        delivery_tracks=delivery_tracks,
        agents=agents,
        approval_policy=approval,
        risk_level=risk,
        client_name=_extract_client(prompt),
        audience=audience or "End users",
        constraints=constraints,
        execution_mode=_detect_execution_mode(prompt),
        inputs=inputs or [],
        created_at=now,
        workspace_gid="",
    )


def _generate_title(prompt: str) -> str:
    """Generate a clean project title from the prompt."""
    # Remove leading verbs
    title = prompt.strip()
    for v in ["Build ", "Create ", "Make ", "Design ", "Develop ", "Ship "]:
        if title.startswith(v):
            title = title[len(v):]
            break
    
    # Take first ~50 chars
    if len(title) > 60:
        title = title[:60].rsplit(" ", 1)[0]
    
    # Clean up
    title = title.strip().rstrip(".,!?")
    
    # Capitalize
    if title and not title[0].isupper():
        title = title[0].upper() + title[1:]
    
    return title or "New Project"


def _extract_client(prompt: str) -> str:
    """Try to extract client name from prompt."""
    patterns = [
        r"(?:for|by|at)\s+([A-Z][a-zA-Z0-9\s]{1,30}(?:Inc|LLC|Co|Corp|Studio|Media|Entertainment)?)",
    ]
    for pat in patterns:
        m = re.search(pat, prompt)
        if m:
            return m.group(1).strip()
    return "Client"


def _detect_execution_mode(prompt: str) -> str:
    text = prompt.lower()
    if "autonomous" in text or "auto" in text:
        return "autonomous"
    if "draft" in text or "explore" in text or "proposal" in text:
        return "draft_only"
    return "approval_gated"


def _generate_delivery_tracks() -> list[dict]:
    from config.settings import DELIVERY_TRACKS
    return DELIVERY_TRACKS


def _select_agents(domain: str) -> list[str]:
    """Select appropriate agents based on project domain."""
    base_agents = ["intake-strategist", "product-manager", "research-agent"]
    
    if domain == "web_app_with_agents":
        return base_agents + ["solution-architect", "ux-designer", "builder", "qa-reviewer"]
    elif domain == "agent":
        return base_agents + ["solution-architect", "builder", "qa-reviewer"]
    elif domain == "web_app":
        return base_agents + ["ux-designer", "solution-architect", "builder", "qa-reviewer"]
    elif domain == "mobile_app":
        return base_agents + ["ux-designer", "solution-architect", "builder", "qa-reviewer"]
    elif domain == "campaign":
        return base_agents + ["ux-designer"]
    elif domain == "workflow":
        return base_agents + ["solution-architect", "builder"]
    else:
        return base_agents + ["solution-architect", "builder", "qa-reviewer"]


# ── Public API ───────────────────────────────────────

def compile_prompt(prompt: str, inputs: list[dict] = None) -> dict:
    """
    Compile a plain-language prompt into a complete project manifest.
    
    Args:
        prompt: The user's build request in natural language
        inputs: Optional list of input attachments [{type, url, content}]
    
    Returns:
        dict with 'manifest' (ProjectManifest), 'intent' (IntentExtract), 'document_bundle'
    """
    if inputs is None:
        inputs = []
    
    # Stage 1-3: Extract, Inject, Enhance
    intent = stage1_intent_extraction(prompt, inputs)
    intent = stage2_context_injection(intent)
    intent = stage3_semantic_enhancement(intent, prompt)
    
    # Stage 4: Compile
    manifest = stage4_compilation(intent, prompt, inputs)
    
    # Generate document bundle
    docs = generate_document_bundle(manifest, intent)
    
    return {
        "manifest": asdict(manifest),
        "intent": asdict(intent),
        "document_bundle": docs,
        "stages": {
            "extraction": "complete",
            "injection": "complete",
            "enhancement": "complete",
            "compilation": "complete",
            "routing": "pending",
        }
    }


def generate_document_bundle(manifest: ProjectManifest, intent: IntentExtract) -> dict:
    """Generate the document bundle for a project manifest."""
    nl = "\n"
    dash = "- "
    agent_lines = nl.join(f"{dash}{a}" for a in manifest.agents)
    track_lines = nl.join(f"{dash}{t['name']}" for t in manifest.delivery_tracks)
    success_metrics_str = "; ".join(manifest.success_metrics)

    return {
        "project_brief": f"# {manifest.title}\n\n**Goal:** {manifest.goal}\n\n**Audience:** {manifest.audience}\n**Risk:** {manifest.risk_level}\n**Execution:** {manifest.execution_mode}",
        "discovery_memo": f"## Discovery & Assumptions\n\n**Domain:** {manifest.project_type}\n**Key Assumptions:** 1. Target users validated. 2. Market need exists. 3. Feasible with current stack.",
        "jtbd_analysis": f"## Jobs-to-be-Done\n\n**Primary Job:** {manifest.goal[:100]}...\n**Success Criteria:** {success_metrics_str}",
        "prd": f"# Product Requirements Document\n\n## Overview\n{manifest.goal}",
        "requirements": f"## Requirements & Acceptance Criteria\n\n- All stated success metrics met\n- Core user flows operational\n- Security review passed",
        "agent_roster": f"## Agent Roster\n\n{agent_lines}",
        "delivery_plan": f"## Delivery Plan\n\nTracks:\n{track_lines}",
        "approval_plan": f"## Approval Plan\n\n**Policy:** {manifest.approval_policy}\n**Requires:** Human sign-off on scope, budget, and deploy",
    }


def render_task_contract(manifest: dict, track: dict, task_name: str, agent_id: str) -> str:
    """Render a structured task description for Asana."""
    return f"""## Objective
{task_name}

## Context
Project: {manifest['title']}
Goal: {manifest['goal'][:200]}

## Deliverables
- Complete task deliverables per project plan
- Update status in Asana
- Report completion to project thread

## Done when
- Deliverable meets acceptance criteria
- Documentation is updated
- Human reviewer has approved (if gated)

## Assigned agent
{agent_id}

## Execution policy
{manifest['approval_policy']}. {'Do not deploy, spend, or modify production systems.' if manifest.get('approval_policy') != 'autonomous' else 'Execute autonomously within scope.'}
"""


# ── Standalone ───────────────────────────────────────

if __name__ == "__main__":
    import sys
    prompt = sys.argv[1] if len(sys.argv) > 1 else "Build a marketplace where independent artists can generate EPKs"
    result = compile_prompt(prompt)
    print(json.dumps(result["manifest"], indent=2))
    print(f"\n--- Document Bundle ({len(result['document_bundle'])} docs) ---")
    for k, v in result["document_bundle"].items():
        print(f"  {k}: {len(v)} chars")
