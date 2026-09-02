"""Unit tests for PAL 5-stage protocol compiler."""

import sys
import unittest
from pathlib import Path

# Add project root to sys.path
proj_root = Path(__file__).parent.parent
if str(proj_root) not in sys.path:
    sys.path.insert(0, str(proj_root))

from skills.pal_skill import PALSkill


class TestPALSkill(unittest.TestCase):
    def setUp(self):
        self.pal = PALSkill()

    def test_pred_phase_classification(self):
        result = self.pal.compile("Research best practices for multi-agent state persistence")
        self.assertEqual(result.phase, "PreD")
        self.assertEqual(result.domain, "research")
        self.assertIn("product-architect", result.selected_subagents)
        self.assertIn("jtbd-npao-planner", result.selected_subagents)

    def test_design_phase_classification(self):
        result = self.pal.compile("Design UX wireframe and UI color palette tokens")
        self.assertEqual(result.phase, "Design")
        self.assertEqual(result.domain, "design")
        self.assertIn("experience-engineer", result.selected_subagents)

    def test_development_phase_classification(self):
        result = self.pal.compile("Implement Next.js 15 API route for AI SDK streaming")
        self.assertEqual(result.phase, "Development")
        self.assertEqual(result.domain, "code")
        self.assertIn("application-engineer", result.selected_subagents)

    def test_deploy_phase_and_approval_gate(self):
        result = self.pal.compile("Deploy production release to Vercel and AWS")
        self.assertEqual(result.phase, "Deploy")
        self.assertEqual(result.domain, "ops")
        self.assertIn("production_deploy", result.approval_required)
        self.assertIn("devops-release-engineer", result.selected_subagents)

    def test_debugging_phase_classification(self):
        result = self.pal.compile("Fix error 500 in chat stream handler")
        self.assertEqual(result.phase, "Debugging")
        self.assertEqual(result.domain, "code")
        self.assertIn("application-engineer", result.selected_subagents)

    def test_stages_output_structure(self):
        result = self.pal.compile("Build landing page")
        self.assertEqual(len(result.stages), 5)
        stage_names = [s.stage_name for s in result.stages]
        self.assertIn("Intent Decomposition", stage_names)
        self.assertIn("Dependency Analysis", stage_names)
        self.assertIn("Context Assembly", stage_names)
        self.assertIn("Sandboxed Verification", stage_names)
        self.assertIn("State Persistence", stage_names)


if __name__ == "__main__":
    unittest.main()
