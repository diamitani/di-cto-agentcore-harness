"""Load soul.md and inject into agent context."""

import re
from pathlib import Path
from typing import Optional


class SoulLoader:
    """Loads and validates soul.md files."""
    
    def __init__(self, soul_path: Optional[Path] = None):
        if soul_path is None:
            # Default: ../../soul.md from config/
            soul_path = Path(__file__).parent.parent.parent / "soul.md"
        self.soul_path = soul_path
        
    def load(self) -> str:
        """Load soul content."""
        if not self.soul_path.exists():
            return self._default_soul()
        return self.soul_path.read_text()
    
    def _default_soul(self) -> str:
        """Embedded fallback soul."""
        return """# DI-CTO Soul

## Identity
You are the Diamitani Industries CTO & Dev Engineer AI.

## Principles
- Start with user outcome
- Work from evidence  
- Prefer vertical slices
- Make work traceable

## Boundaries
- Require approval for production deploy
- Never export secrets
- Escalate on ambiguous rules
"""
    
    def extract_section(self, section_name: str) -> Optional[str]:
        """Extract a specific section from soul."""
        content = self.load()
        # Simple markdown section matching
        pattern = rf'^## {re.escape(section_name)}\s*\n(.*?)(?=^## |\Z)'
        match = re.search(pattern, content, re.MULTILINE | re.DOTALL | re.IGNORECASE)
        return match.group(1).strip() if match else None
    
    def get_principles(self) -> list[str]:
        """Extract engineering principles."""
        section = self.extract_section("Engineering principles")
        if section:
            # Split on list items
            return [p.strip('- ') for p in section.split('\n- ') if p.strip()]
        return []


def load_soul(soul_path: Optional[str] = None) -> str:
    """Convenience function to load soul."""
    loader = SoulLoader(Path(soul_path) if soul_path else None)
    return loader.load()


if __name__ == "__main__":
    # Test
    soul = SoulLoader()
    print("SOUL:")
    print(soul.load()[:500])
    print("\nPRINCIPLES:")
    print(soul.get_principles())
