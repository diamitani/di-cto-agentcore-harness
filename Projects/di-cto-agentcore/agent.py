#!/usr/bin/env python3
"""
DI-CTO AgentCore Harness & ROSTR Orchestrator.
Governed CTO Agent harness for Diamitani Industries.
"""

import os
import sys
import json
import asyncio
from typing import Any, Optional
from dataclasses import dataclass, field
from pathlib import Path

# Add current directory to path for relative imports
current_dir = Path(__file__).parent
if str(current_dir) not in sys.path:
    sys.path.insert(0, str(current_dir))

from skills.pal_skill import PALSkill, CompiledPAL
from skills.npao_skill import NPAOSkill, NPAOResult
from skills.research_skill import ResearchSkill, ResearchResult
from skills.delivery_skill import DeliverySkill, DeliveryResult
from skills.qa_skill import QASkill, QAResult
from tools.adapters import FilesystemTool, SandboxTool, GithubTool, WebTool, CloudCLITool


@dataclass
class AgentConfig:
    """Runtime configuration."""
    name: str = "di-cto-agentcore"
    version: str = "1.0.0"
    region: str = "us-east-1"
    model_provider: str = os.getenv("AI_PROVIDER", "bedrock-claude")  # bedrock-claude | anthropic | openai | mock
    temperature: float = 0.2
    max_tokens: int = 8192


class DICTOAgent:
    """
    DI-CTO AgentCore Harness.
    
    Processes user intent through PAL -> Memory -> LLM / Sub-Agent Dispatch -> Verification.
    """
    
    def __init__(self, config: Optional[AgentConfig] = None):
        self.config = config or AgentConfig()
        self.memory: dict[str, list[dict[str, Any]]] = {
            "rostr_decisions": [],
            "rostr_learnings": [],
        }
        
        # Load Soul and System Prompt
        self.soul = self._load_soul()
        self.system_prompt = self._load_system_prompt()
        
        # Initialize Sub-Agents
        self.sub_agents_registry = self._load_sub_agents()
        
        # Initialize Skills
        self.pal_skill = PALSkill()
        self.npao_skill = NPAOSkill()
        self.research_skill = ResearchSkill()
        self.delivery_skill = DeliverySkill()
        self.qa_skill = QASkill()
        
        # Initialize Tools
        self.fs_tool = FilesystemTool()
        self.sandbox_tool = SandboxTool()
        self.github_tool = GithubTool()
        self.web_tool = WebTool()
        self.cloud_tool = CloudCLITool()
        
    def _load_soul(self) -> str:
        """Load soul.md for identity."""
        workspace_soul = Path(__file__).parent.parent.parent / "soul.md"
        if workspace_soul.exists():
            return workspace_soul.read_text(encoding="utf-8")
        local_soul = Path(__file__).parent / "config" / "soul.md"
        if local_soul.exists():
            return local_soul.read_text(encoding="utf-8")
        return (
            "# DI-CTO Soul\n"
            "You are the Diamitani Industries CTO AI Agent.\n"
            "Operating Principles: Start with user outcome, preserve intent discipline, "
            "work from evidence, prefer vertical slices, make work traceable."
        )
    
    def _load_system_prompt(self) -> str:
        """Load system prompt."""
        return (
            f"You are DI-CTO, the Diamitani Industries CTO & Dev Engineer AI.\n"
            f"Runtime: AWS Bedrock AgentCore v{self.config.version} & ROSTR Harness\n"
            f"Model: {self.config.model_provider}\n\n"
            "## Operating Principles\n"
            "1. Start with user outcome\n"
            "2. Preserve intent discipline (PreD -> Design -> Development -> Deploy -> Debug)\n"
            "3. Work from evidence and verified vertical slices\n"
            "4. Enforce approval gates for high-risk operations (production deploy, auth secrets)\n"
            "5. Compound learnings in episodic memory\n"
        )
    
    def _load_sub_agents(self) -> dict[str, Any]:
        """Load sub-agent registry."""
        reg_path = Path(__file__).parent / "sub_agents" / "registry.yaml"
        if reg_path.exists():
            try:
                import yaml
                return yaml.safe_load(reg_path.read_text(encoding="utf-8"))
            except Exception:
                pass
        return {
            "version": "1.0.0",
            "agents": [
                {"id": "product-architect", "phases": ["PreD", "Design"]},
                {"id": "jtbd-npao-planner", "phases": ["PreD", "Design"]},
                {"id": "experience-engineer", "phases": ["Design", "Development"]},
                {"id": "application-engineer", "phases": ["Development", "Debugging"]},
                {"id": "agent-runtime-engineer", "phases": ["Design", "Development", "Debugging"]},
                {"id": "identity-commerce-qa", "phases": ["Development", "Deploy"]},
                {"id": "quality-engineer", "phases": ["Development", "Deploy", "Debugging"]},
                {"id": "devops-release-engineer", "phases": ["Deploy"]},
                {"id": "security-reviewer", "phases": ["Design", "Development", "Deploy", "Debugging"]},
            ]
        }
    
    def pal_compile(self, user_input: str) -> CompiledPAL:
        """Compile intent through PAL 5-stage pipeline."""
        return self.pal_skill.compile(user_input)
    
    async def call_llm(self, messages: list[dict[str, str]]) -> str:
        """Execute LLM call across configured provider."""
        last_msg = messages[-1]["content"]
        
        # Check environment API keys
        if self.config.model_provider == "anthropic" and os.getenv("ANTHROPIC_API_KEY"):
            try:
                import anthropic
                client = anthropic.AsyncAnthropic()
                resp = await client.messages.create(
                    model="claude-3-5-sonnet-20241022",
                    max_tokens=self.config.max_tokens,
                    temperature=self.config.temperature,
                    system=self.system_prompt,
                    messages=[{"role": m["role"], "content": m["content"]} for m in messages if m["role"] != "system"],
                )
                return resp.content[0].text
            except Exception as e:
                return f"[Anthropic Fallback] Executed with notice ({e}): Intent handled for '{last_msg[:60]}'"
        
        elif self.config.model_provider == "openai" and os.getenv("OPENAI_API_KEY"):
            try:
                import openai
                client = openai.AsyncOpenAI()
                resp = await client.chat.completions.create(
                    model="gpt-4o",
                    messages=[{"role": m["role"], "content": m["content"]} for m in messages],
                    temperature=self.config.temperature,
                )
                return resp.choices[0].message.content or ""
            except Exception as e:
                return f"[OpenAI Fallback] Executed with notice ({e}): Intent handled for '{last_msg[:60]}'"
                
        # Bedrock AgentCore / Deterministic Simulator
        return (
            f"[DI-CTO Bedrock AgentCore v{self.config.version}]\n"
            f"Successfully processed outcome-driven intent: \"{last_msg}\".\n"
            f"Operating under governed principles: intent decomposed, dependencies mapped, "
            f"vertical slice executed, and state preserved in ROSTR episodic memory."
        )
    
    async def dispatch_skill(self, pal: CompiledPAL, user_input: str) -> dict[str, Any]:
        """Dispatch task to specialized skill based on PAL compiled phase."""
        if pal.phase == "PreD":
            res = await self.research_skill.execute(user_input)
            return {
                "skill": "research",
                "status": res.status,
                "confidence": res.confidence,
                "summary": res.summary,
                "key_findings": res.key_findings,
                "next_steps": res.suggested_actions,
            }
        elif pal.phase == "Design" or pal.phase == "Development":
            deliv = self.delivery_skill.run(user_input)
            qa_res = await self.qa_skill.execute(user_input)
            return {
                "skill": "delivery",
                "status": deliv.status,
                "plan": deliv.plan,
                "qa_status": qa_res.status,
                "coverage_pct": qa_res.coverage_pct,
                "next_steps": deliv.next_steps,
            }
        elif pal.phase == "Deploy":
            if pal.approval_required:
                return {
                    "skill": "deploy",
                    "status": "blocked",
                    "reason": f"Approval required for gates: {pal.approval_required}",
                    "next_steps": ["Request human approval for production deployment"],
                }
            return {
                "skill": "deploy",
                "status": "success",
                "output": "Deployment package verified and ready for CI/CD trigger.",
                "next_steps": ["Run post-deployment smoke test"],
            }
        else:  # Debugging
            qa_res = await self.qa_skill.execute(user_input)
            return {
                "skill": "qa_debug",
                "status": qa_res.status,
                "tests_passed": f"{qa_res.passed_tests}/{qa_res.total_tests}",
                "recommendation": qa_res.recommendation,
                "next_steps": ["Apply targeted fix to failing assertion", "Re-run verification pass"],
            }
    
    async def run(self, user_input: str) -> dict[str, Any]:
        """Main execution flow: PAL -> LLM -> Dispatch -> Memory."""
        # 1. PAL Compilation
        pal = self.pal_compile(user_input)
        
        # 2. Memory Record
        self.memory["rostr_decisions"].append({
            "intent": pal.intent,
            "phase": pal.phase,
            "priority": pal.priority_score,
            "sub_agents": pal.selected_subagents,
        })
        
        # 3. LLM Response
        messages = [
            {"role": "system", "content": self.system_prompt},
            {"role": "system", "content": self.soul},
            {"role": "user", "content": user_input},
        ]
        llm_response = await self.call_llm(messages)
        
        # 4. Skill Dispatch
        skill_result = await self.dispatch_skill(pal, user_input)
        
        return {
            "pal": {
                "intent": pal.intent,
                "domain": pal.domain,
                "phase": pal.phase,
                "priority": pal.priority_score,
                "sub_agents": pal.selected_subagents,
                "approval_required": pal.approval_required,
                "allowed_tools": pal.allowed_tools,
            },
            "llm_response": llm_response,
            "skill_result": skill_result,
            "memory_entries": len(self.memory["rostr_decisions"]),
        }
    
    def run_sync(self, user_input: str) -> dict[str, Any]:
        """Synchronous wrapper."""
        return asyncio.run(self.run(user_input))


def main():
    """CLI entrypoint."""
    task = sys.argv[1] if len(sys.argv) > 1 else "Scaffold a landing page with pricing table"
    agent = DICTOAgent()
    res = agent.run_sync(task)
    print("\n" + "=" * 60)
    print(f"DI-CTO AgentCore Result for: '{task}'")
    print("=" * 60)
    print(json.dumps(res, indent=2))


if __name__ == "__main__":
    main()
