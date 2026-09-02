"""Unit tests for NPAO priority calculation."""

import sys
import unittest
from pathlib import Path

# Add project root to sys.path
proj_root = Path(__file__).parent.parent
if str(proj_root) not in sys.path:
    sys.path.insert(0, str(proj_root))

from skills.npao_skill import NPAOSkill


class TestNPAOSkill(unittest.TestCase):
    def setUp(self):
        self.npao = NPAOSkill()

    def test_npao_formula_debugging(self):
        res = self.npao.calculate_priority("task-1", "Debugging", dependency_score=5.0, business_score=5.0, resource_score=5.0)
        self.assertEqual(res.final_priority, 6.75)
        self.assertEqual(res.phase_score, 10.0)
        self.assertIn("application-engineer", res.assigned_subagents)

    def test_npao_formula_deploy(self):
        res = self.npao.calculate_priority("task-2", "Deploy", dependency_score=8.0, business_score=8.0, resource_score=8.0)
        self.assertEqual(res.final_priority, 8.0)
        self.assertEqual(res.queue_rank, 1)
        self.assertIn("devops-release-engineer", res.assigned_subagents)

    def test_npao_formula_pred(self):
        res = self.npao.calculate_priority("task-3", "PreD", dependency_score=3.0, business_score=4.0, resource_score=5.0)
        self.assertEqual(res.final_priority, 3.1)
        self.assertEqual(res.queue_rank, 3)
        self.assertIn("product-architect", res.assigned_subagents)


if __name__ == "__main__":
    unittest.main()
