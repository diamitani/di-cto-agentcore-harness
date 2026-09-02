from pathlib import Path
import re
import sys

root = Path(sys.argv[1] if len(sys.argv) > 1 else ".")
skill = root / "SKILL.md"
manifest = root / "manifest-entry.yaml"
registry = root / "sub-agent-registry.yaml"
required_sections = [
    "## Purpose", "## Use when", "## Do not use when", "## Inputs",
    "## Outputs", "## Procedure", "## Guardrails", "## Quality checks",
    "## Failure and escalation", "## Examples", "## Change log",
]
errors = []
for path in (skill, manifest, registry):
    if not path.exists():
        errors.append(f"Missing required file: {path.name}")
if skill.exists():
    text = skill.read_text(encoding="utf-8")
    if not text.startswith("---\n") or text.count("---\n") < 2:
        errors.append("SKILL.md must start with YAML front matter.")
    for section in required_sections:
        if section not in text:
            errors.append(f"SKILL.md missing section: {section}")
    for field in ("id:", "trigger:", "inputs:", "outputs:", "allowed_tools:", "denied_tools:", "requires_approval_for:"):
        if field not in text:
            errors.append(f"SKILL.md front matter missing: {field}")
    steps = re.findall(r"^\d+\.\s+.+", text, flags=re.MULTILINE)
    if len(steps) < 3:
        errors.append("SKILL.md procedure needs at least three ordered steps.")
if manifest.exists() and skill.exists():
    manifest_id = re.search(r"^id:\s*(\S+)", manifest.read_text(encoding="utf-8"), re.MULTILINE)
    skill_id = re.search(r"^id:\s*(\S+)", skill.read_text(encoding="utf-8"), re.MULTILINE)
    if manifest_id and skill_id and manifest_id.group(1) != skill_id.group(1):
        errors.append("Manifest id does not match SKILL.md id.")
if errors:
    print("INVALID")
    print("\n".join(f"- {error}" for error in errors))
    raise SystemExit(1)
print("VALID: required skill files, contract fields, sections, and procedure are present.")
