"""Integration tests for DI-CTO AgentCore."""

import sys
import unittest
from pathlib import Path

# Add project root to sys.path
proj_root = Path(__file__).parent.parent
if str(proj_root) not in sys.path:
    sys.path.insert(0, str(proj_root))

from agent import DICTOAgent, AgentConfig


class TestDICTOAgent(unittest.TestCase):
    def setUp(self):
        config = AgentConfig(model_provider="mock")
        self.agent = DICTOAgent(config=config)

    def test_end_to_end_research_task(self):
        result = self.agent.run_sync("Research state persistence patterns in Bedrock AgentCore")
        self.assertEqual(result["pal"]["phase"], "PreD")
        self.assertEqual(result["skill_result"]["skill"], "research")
        self.assertEqual(result["skill_result"]["status"], "success")
        self.assertGreaterEqual(result["memory_entries"], 1)

    def test_end_to_end_development_task(self):
        result = self.agent.run_sync("Build Next.js dashboard with dark mode")
        self.assertEqual(result["pal"]["phase"], "Development")
        self.assertEqual(result["skill_result"]["skill"], "delivery")
        self.assertEqual(result["skill_result"]["qa_status"], "passed")
        self.assertIn("application-engineer", result["pal"]["sub_agents"])

    def test_end_to_end_deploy_gate_task(self):
        result = self.agent.run_sync("Deploy production release to Vercel")
        self.assertEqual(result["pal"]["phase"], "Deploy")
        self.assertEqual(result["skill_result"]["skill"], "deploy")
        self.assertEqual(result["skill_result"]["status"], "blocked")
        self.assertIn("production_deploy", result["pal"]["approval_required"])

    def test_end_to_end_debug_task(self):
        result = self.agent.run_sync("Fix bug in stream parsing logic")
        self.assertEqual(result["pal"]["phase"], "Debugging")
        self.assertEqual(result["skill_result"]["skill"], "qa_debug")
        self.assertEqual(result["skill_result"]["status"], "passed")


if __name__ == "__main__":
    unittest.main()
