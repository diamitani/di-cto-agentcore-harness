---
id: di-cto-research
name: Diamitani Research — RAG DAL Procedure
version: 0.1.0
status: active
trigger: |
  Invoke when the user request requires external knowledge, current technology 
  research, or validation of third-party APIs/docs. Use before making technology choices.
inputs:
  - name: query
    required: true
    description: What to research
  - name: depth
    required: false
    default: standard
    options: [quick, standard, deep]
  - name: recency_requirement
    required: false
    default: 90_days
outputs:
  - name: summary
    format: markdown
  - name: sources
    format: yaml
  - name: confidence
    format: scalar 0.0-1.0
allowed_tools: [web-search, web-extract, arxiv]
---

# Diamitani Research Skill

## Purpose
Conduct multi-pass, tiered research with confidence scoring.

## Source Tiers

| Tier | Credibility | Examples |
|------|-------------|----------|
| 1 (Primary) | 1.0 | arXiv, .gov, standards docs, official APIs |
| 2 (Verified) | 0.75 | Reuters, NYT, trade journals, Gartner |
| 3 (Community) | 0.40 | Blogs, Reddit, Stack Overflow |

## Procedure

### Pass 1: Broad Sweep
1. Generate 3-5 distinct search queries
2. Search across all tiers
3. Decompose into 3-7 sub-topics
4. Assess coverage per sub-topic

### Pass 2: Gap Fill (if needed)
- Target sub-topics with confidence < 0.8
- Focus Tier 1-2 sources
- Re-assess coverage

### Pass 3: Deep Verification (if needed)
- Tier 1 only for remaining gaps
- Mark uncertain if < 0.7

### Confidence Formula
```
topic_confidence = 
  (source_count × 0.35) +
  (consistency × 0.30) +
  (tier_distribution × 0.25) +
  (recency × 0.10)
```

## Output Format

```markdown
## Research Summary: [Query]

### Key Findings
- [Bullet points]

### Sources
| Tier | Source | Credibility | Recency |
|------|--------|-------------|---------|
| 1 | ... | 1.0 | ... |

### Confidence: 0.85

### Uncertainties
- [What remains unclear]

### Recommendations
- [Actionable next steps]
```

## Non-Triggers

- Skip for well-established patterns in current codebase
- Skip for user-specified exact versions/commits
- Skip for purely creative/artistic decisions
