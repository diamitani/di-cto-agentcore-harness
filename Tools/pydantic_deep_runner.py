"""
ROSTR PAL Agent Core — Pydantic Deep Runtime Adapter
===================================================
Provides deep autonomous agent execution, sub-agent delegation, and
deterministic PAL (Prompt Abstraction Layer) intent compilation using pydantic-deep.
"""

import sys
import asyncio
import argparse
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field

try:
    from pydantic_deep import create_deep_agent, create_default_deps
    from pydantic_deep.backends import StateBackend
    PYDANTIC_DEEP_AVAILABLE = True
except ImportError:
    PYDANTIC_DEEP_AVAILABLE = False


class PALCompiledIntent(BaseModel):
    phase: str = Field(description="Active lifecycle phase (PreD, Design, Development, Deployment)")
    domain: str = Field(description="Execution domain (FullStack, MusicOps, DevOps, Security, Research)")
    priority_score: float = Field(description="NPAO 4D calculated priority (0.0 to 10.0)")
    dispatched_subagents: List[str] = Field(description="List of specialist sub-agents dispatched")
    requires_approval: bool = Field(default=False, description="Whether human approval gate is triggered")
    vertical_slice_outcome: str = Field(description="Synthesized executable plan or code")


async def run_rostr_deep_agent(task_prompt: str, model: str = "claude-sonnet-4-6") -> Dict[str, Any]:
    """Execute a task through Pydantic Deep agent runtime with PAL governance."""
    if not PYDANTIC_DEEP_AVAILABLE:
        return {
            "status": "fallback",
            "message": "pydantic-deep not installed. Run 'pip install pydantic-deep' to enable.",
            "prompt": task_prompt,
        }

    backend = StateBackend()
    deps = create_default_deps(backend)
    agent = create_deep_agent()

    system_instruction = (
        "You are the ROSTR Governed CTO Agent Core. "
        "Enforce strict PAL 5-Stage intent compilation, NPAO 4D priority calculation, "
        "and multi-agent delegation without phase drift."
    )

    result = await agent.run(
        f"{system_instruction}\n\nTask: {task_prompt}",
        deps=deps,
    )

    return {
        "status": "success",
        "output": str(result.output),
        "model": model,
    }


def main():
    parser = argparse.ArgumentParser(description="ROSTR Pydantic Deep Agent CLI")
    parser.add_argument("prompt", nargs="?", default="Compile PAL architecture blueprint", help="Task prompt")
    parser.add_argument("--model", default="claude-sonnet-4-6", help="Model identifier")
    args = parser.parse_args()

    print(f"🚀 Initializing ROSTR Pydantic Deep Agent...")
    print(f"📦 Model: {args.model}")
    print(f"🎯 Task: {args.prompt}\n")

    res = asyncio.run(run_rostr_deep_agent(args.prompt, model=args.model))
    print("✅ Result:")
    print(res)


if __name__ == "__main__":
    main()
