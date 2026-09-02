"""
Monarch Project Factory — Web UI (FastAPI-based Intake Center)
"""
import json
import sys
import os
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
sys.path.insert(0, str(ROOT))

try:
    from fastapi import FastAPI, Request, HTTPException
    from fastapi.responses import HTMLResponse, JSONResponse
    from pydantic import BaseModel
    import uvicorn
except ImportError:
    print("FastAPI not installed. Run: pip install fastapi uvicorn")
    sys.exit(1)

from src.pal.compiler import compile_prompt
from src.hub.storage import RostrHub
from src.orchestrator import full_pipeline, list_projects, get_project

app = FastAPI(title="Monarch Project Factory — Intake Center")


# ── Pydantic Models ───────────────────────────────────

class IntakeRequest(BaseModel):
    prompt: str
    outcome: str = ""
    project_type: str = "web_app_with_agents"
    audience: str = ""
    constraints: str = ""
    execution_mode: str = "approval_gated"
    inputs: list[dict] = []


# ── Frontend ──────────────────────────────────────────

INDEX_HTML = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Monarch — Project Factory</title>
<style>
  :root {
    --bg: #09090b;
    --surface: #18181b;
    --border: #27272a;
    --text: #fafafa;
    --muted: #a1a1aa;
    --accent: #c9a227;
    --gold: #c9a227;
    --green: #22c55e;
    --red: #ef4444;
    --radius: 12px;
  }
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Inter, sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
    line-height: 1.6;
  }
  .container { max-width: 900px; margin: 0 auto; padding: 40px 24px; }
  
  /* Header */
  .header { text-align: center; margin-bottom: 48px; }
  .header h1 { font-size: 2rem; font-weight: 700; color: var(--accent); margin-bottom: 8px; }
  .header p { color: var(--muted); font-size: 1.05rem; }
  .badge {
    display: inline-block; padding: 4px 12px; border-radius: 999px;
    border: 1px solid var(--accent); color: var(--accent); font-size: 0.75rem;
    text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 16px;
  }
  
  /* Card */
  .card {
    background: var(--surface); border: 1px solid var(--border);
    border-radius: var(--radius); padding: 32px; margin-bottom: 24px;
  }
  .card h2 { font-size: 1.25rem; margin-bottom: 20px; color: var(--accent); }
  
  /* Form */
  .form-group { margin-bottom: 20px; }
  .form-group label { display: block; font-size: 0.875rem; font-weight: 500; margin-bottom: 6px; }
  .form-group .hint { font-size: 0.75rem; color: var(--muted); margin-bottom: 6px; }
  
  textarea, input, select {
    width: 100%; padding: 12px 16px; border-radius: 8px;
    border: 1px solid var(--border); background: var(--bg);
    color: var(--text); font-size: 0.95rem; font-family: inherit;
    transition: border-color 0.2s;
  }
  textarea:focus, input:focus, select:focus {
    outline: none; border-color: var(--accent);
  }
  textarea { min-height: 100px; resize: vertical; }
  
  select { appearance: auto; }
  
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  
  /* Button */
  .btn {
    width: 100%; padding: 14px 24px; border: none; border-radius: 8px;
    font-size: 1rem; font-weight: 600; cursor: pointer;
    background: var(--accent); color: var(--bg);
    transition: opacity 0.2s;
  }
  .btn:hover { opacity: 0.9; }
  .btn:disabled { opacity: 0.5; cursor: not-allowed; }
  
  /* Result */
  .result { display: none; }
  .result.visible { display: block; }
  
  .result-header {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 20px;
  }
  .result-header h2 { margin: 0; }
  .status-badge {
    padding: 4px 12px; border-radius: 999px; font-size: 0.75rem;
    font-weight: 600; text-transform: uppercase;
  }
  .status-badge.success { background: rgba(34, 197, 94, 0.15); color: var(--green); }
  .status-badge.pending { background: rgba(201, 162, 39, 0.15); color: var(--gold); }
  .status-badge.error { background: rgba(239, 68, 68, 0.15); color: var(--red); }
  
  .detail-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px;
  }
  .detail-item {
    padding: 12px; border-radius: 8px; background: var(--bg);
  }
  .detail-item .label { font-size: 0.75rem; color: var(--muted); text-transform: uppercase; letter-spacing: 0.05em; }
  .detail-item .value { font-size: 0.95rem; margin-top: 4px; }
  
  .section-list { margin-top: 16px; }
  .section-item {
    padding: 10px 16px; border-left: 3px solid var(--accent);
    margin-bottom: 8px; background: var(--bg); border-radius: 0 8px 8px 0;
    font-size: 0.9rem;
  }
  
  .agent-list { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 12px; }
  .agent-tag {
    padding: 4px 12px; border-radius: 6px;
    background: rgba(201, 162, 39, 0.1); border: 1px solid rgba(201, 162, 39, 0.3);
    font-size: 0.8rem; color: var(--gold);
  }
  
  .project-link {
    display: inline-flex; align-items: center; gap: 8px;
    margin-top: 16px; padding: 12px 20px; border-radius: 8px;
    background: rgba(201, 162, 39, 0.1); border: 1px solid rgba(201, 162, 39, 0.3);
    color: var(--accent); text-decoration: none; font-weight: 500;
  }
  .project-link:hover { background: rgba(201, 162, 39, 0.2); }
  
  .loading { text-align: center; padding: 40px; color: var(--muted); }
  .spinner {
    display: inline-block; width: 24px; height: 24px;
    border: 3px solid var(--border); border-top-color: var(--accent);
    border-radius: 50%; animation: spin 0.8s linear infinite;
    margin-bottom: 12px;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  
  .error-box {
    padding: 16px; border-radius: 8px;
    background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3);
    color: var(--red); margin-bottom: 16px;
  }
  
  /* Projects list */
  .projects-table { width: 100%; border-collapse: collapse; }
  .projects-table th {
    text-align: left; padding: 12px 16px;
    font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.05em;
    color: var(--muted); border-bottom: 1px solid var(--border);
  }
  .projects-table td {
    padding: 12px 16px; border-bottom: 1px solid var(--border);
    font-size: 0.9rem;
  }
  .projects-table tr:hover { background: var(--surface); }
  
  .tabs {
    display: flex; gap: 4px; margin-bottom: 24px;
    background: var(--surface); border-radius: var(--radius); padding: 4px;
  }
  .tab {
    flex: 1; padding: 10px 16px; text-align: center; border: none;
    background: transparent; color: var(--muted); cursor: pointer;
    border-radius: 8px; font-size: 0.9rem; font-weight: 500;
    transition: all 0.2s;
  }
  .tab.active { background: var(--accent); color: var(--bg); }
  .tab:hover:not(.active) { color: var(--text); }
  
  .tab-content { display: none; }
  .tab-content.active { display: block; }
  
  @media (max-width: 640px) {
    .form-row { grid-template-columns: 1fr; }
    .detail-grid { grid-template-columns: 1fr; }
    .container { padding: 20px 16px; }
  }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div class="badge">ROSTR Agency OS v1.0</div>
    <h1>Monarch Project Factory</h1>
    <p>Tell us what you want to build. We turn it into a governed project, staffed agent team, implementation plan, and tracked delivery workspace.</p>
  </div>

  <div class="tabs" id="tabs">
    <button class="tab active" data-tab="intake">New Project</button>
    <button class="tab" data-tab="projects">Projects</button>
  </div>

  <!-- Tab: Intake -->
  <div class="tab-content active" id="tab-intake">
    <div class="card">
      <h2>Project Intake</h2>
      <div id="error-box" class="error-box" style="display:none"></div>
      
      <div class="form-group">
        <label>What do you want to build?</label>
        <div class="hint">Describe your idea in plain language</div>
        <textarea id="prompt" placeholder="e.g., Build a marketplace where independent artists can generate EPKs, sell services, and have AI agents manage release campaigns."></textarea>
      </div>
      
      <div class="form-group">
        <label>Desired Outcome</label>
        <div class="hint">What should users be able to do when it's done?</div>
        <textarea id="outcome" placeholder="e.g., An artist can publish a professional EPK in under 20 minutes"></textarea>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Project Type</label>
          <select id="project-type">
            <option value="web_app_with_agents">Web App + AI Agents</option>
            <option value="web_app">Web App</option>
            <option value="agent">AI Agent</option>
            <option value="mobile_app">Mobile App</option>
            <option value="campaign">Campaign</option>
            <option value="workflow">Workflow / Automation</option>
            <option value="api">API</option>
            <option value="content_site">Content Site</option>
          </select>
        </div>
        <div class="form-group">
          <label>Execution Mode</label>
          <select id="execution-mode">
            <option value="approval_gated">Approval-Gated (recommended)</option>
            <option value="draft_only">Draft Only</option>
            <option value="autonomous">Autonomous</option>
          </select>
        </div>
      </div>
      
      <div class="form-row">
        <div class="form-group">
          <label>Target Audience</label>
          <input id="audience" placeholder="e.g., Independent artists and managers">
        </div>
        <div class="form-group">
          <label>Constraints</label>
          <input id="constraints" placeholder="e.g., budget, deadline, tech stack">
        </div>
      </div>
      
      <button class="btn" id="submit-btn" onclick="submitIntake()">Compile &amp; Provision Project</button>
    </div>

    <!-- Result card (hidden until submission) -->
    <div class="card result" id="result-card">
      <div class="result-header">
        <h2 id="result-title">Project Created</h2>
        <span class="status-badge" id="status-badge">Success</span>
      </div>
      
      <div class="detail-grid" id="detail-grid"></div>
      
      <div id="agents-section" class="section-list"></div>
      
      <div id="sections-section" class="section-list"></div>
      
      <div id="project-link"></div>
    </div>
    
    <!-- Loading -->
    <div class="card" id="loading-card" style="display:none">
      <div class="loading">
        <div class="spinner"></div>
        <p>Compiling project manifest...</p>
        <p style="font-size:0.8rem;color:var(--muted);margin-top:8px">PAL → NPAO → Hub → Agents → Asana</p>
      </div>
    </div>
    
    <div class="card" id="error-card" style="display:none">
      <div id="error-detail" class="error-box">Error occurred</div>
    </div>
  </div>

  <!-- Tab: Projects -->
  <div class="tab-content" id="tab-projects">
    <div class="card">
      <h2>All Projects</h2>
      <div id="projects-list">Loading...</div>
    </div>
  </div>
</div>

<script>
  // Tab switching
  document.querySelectorAll('.tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById('tab-' + tab.dataset.tab).classList.add('active');
      if (tab.dataset.tab === 'projects') loadProjects();
    });
  });

  async function submitIntake() {
    const prompt = document.getElementById('prompt').value.trim();
    if (!prompt) {
      showError('Please describe what you want to build.');
      return;
    }
    
    const btn = document.getElementById('submit-btn');
    const resultCard = document.getElementById('result-card');
    const loadingCard = document.getElementById('loading-card');
    const errorCard = document.getElementById('error-card');
    
    btn.disabled = true;
    resultCard.classList.remove('visible');
    errorCard.style.display = 'none';
    loadingCard.style.display = 'block';
    
    const data = {
      prompt: prompt,
      outcome: document.getElementById('outcome').value.trim(),
      project_type: document.getElementById('project-type').value,
      execution_mode: document.getElementById('execution-mode').value,
      audience: document.getElementById('audience').value.trim(),
      constraints: document.getElementById('constraints').value.trim(),
      inputs: []
    };
    
    try {
      const resp = await fetch('/api/intake', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!resp.ok) {
        const err = await resp.json();
        throw new Error(err.detail || 'Server error');
      }
      
      const result = await resp.json();
      loadingCard.style.display = 'none';
      showResult(result);
      
    } catch (err) {
      loadingCard.style.display = 'none';
      showError(err.message);
    } finally {
      btn.disabled = false;
    }
  }
  
  function showResult(result) {
    const manifest = result.manifest || {};
    const pipeline = result.pipeline || {};
    const asana = pipeline.asana || {};
    const npao = pipeline.npao || {};
    
    const resultCard = document.getElementById('result-card');
    resultCard.classList.add('visible');
    
    document.getElementById('status-badge').className = 'status-badge success';
    document.getElementById('status-badge').textContent = 'Provisioned';
    document.getElementById('result-title').textContent = manifest.title || 'Project Created';
    
    // Detail grid
    document.getElementById('detail-grid').innerHTML = `
      <div class="detail-item"><div class="label">Project ID</div><div class="value">${result.project_id || '—'}</div></div>
      <div class="detail-item"><div class="label">Type</div><div class="value">${manifest.project_type || '—'}</div></div>
      <div class="detail-item"><div class="label">Risk Level</div><div class="value">${manifest.risk_level || '—'}</div></div>
      <div class="detail-item"><div class="label">Mode</div><div class="value">${manifest.execution_mode || '—'}</div></div>
      <div class="detail-item"><div class="label">Phase</div><div class="value">${(npao.phase && npao.phase.name) || '—'}</div></div>
      <div class="detail-item"><div class="label">Priority</div><div class="value">${(npao.priority && npao.priority.composite_score) || '—'}</div></div>
    `;
    
    // Agents
    const agents = pipeline.agents || [];
    if (agents.length) {
      document.getElementById('agents-section').innerHTML = `
        <h3 style="margin: 16px 0 8px; font-size: 0.9rem; color: var(--muted);">AGENT ROSTER (${agents.length})</h3>
        <div class="agent-list">
          ${agents.map(a => `<span class="agent-tag">${a.name}</span>`).join('')}
        </div>
      `;
    }
    
    // Sections
    const tracks = manifest.delivery_tracks || [];
    if (tracks.length) {
      document.getElementById('sections-section').innerHTML = `
        <h3 style="margin: 16px 0 8px; font-size: 0.9rem; color: var(--muted);">DELIVERY TRACKS (${tracks.length})</h3>
        ${tracks.map(t => {
          const trackName = typeof t === 'string' ? t : t.name;
          return `<div class="section-item">${trackName}</div>`;
        }).join('')}
      `;
    }
    
    // Project link
    const linkEl = document.getElementById('project-link');
    if (asana.project_url) {
      linkEl.innerHTML = `<a class="project-link" href="${asana.project_url}" target="_blank">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
        </svg>
        Open in Asana
      </a>`;
    }
    
    resultCard.scrollIntoView({ behavior: 'smooth' });
  }
  
  function showError(msg) {
    const errorCard = document.getElementById('error-card');
    errorCard.style.display = 'block';
    document.getElementById('error-detail').textContent = msg;
    errorCard.scrollIntoView({ behavior: 'smooth' });
  }
  
  async function loadProjects() {
    const el = document.getElementById('projects-list');
    try {
      const resp = await fetch('/api/projects');
      const projects = await resp.json();
      
      if (!projects.length) {
        el.innerHTML = '<p style="color:var(--muted);text-align:center;padding:24px">No projects yet. Create your first one!</p>';
        return;
      }
      
      el.innerHTML = `
        <table class="projects-table">
          <thead><tr><th>Title</th><th>Type</th><th>Status</th><th>Created</th></tr></thead>
          <tbody>
            ${projects.map(p => `
              <tr>
                <td><strong>${p.title}</strong></td>
                <td>${p.project_type || '—'}</td>
                <td><span class="status-badge ${p.status === 'provisioned' ? 'success' : 'pending'}">${p.status || '—'}</span></td>
                <td>${p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      `;
    } catch (err) {
      el.innerHTML = `<p style="color:var(--red)">Failed to load projects: ${err.message}</p>`;
    }
  }
</script>
</body>
</html>
"""


# ── API Routes ────────────────────────────────────────

@app.get("/", response_class=HTMLResponse)
async def index():
    return INDEX_HTML


@app.post("/api/intake")
async def api_intake(req: IntakeRequest):
    """Full intake + provision pipeline via API."""
    try:
        # Parse constraints
        constraints_list = [c.strip() for c in req.constraints.split(",") if c.strip()] if req.constraints else []
        
        intake_data = {
            "prompt": req.prompt,
            "outcome": req.outcome,
            "project_type": req.project_type,
            "audience": req.audience,
            "constraints": constraints_list,
            "execution_mode": req.execution_mode,
            "inputs": req.inputs,
        }
        
        from src.orchestrator import pipeline_from_intake
        result = pipeline_from_intake(intake_data)
        
        return {
            "status": "success",
            "project_id": result.get("project_id", ""),
            "manifest": result.get("manifest", {}),
            "pipeline": {
                "npao": result.get("npao", {}),
                "hub": result.get("hub", {}),
                "agents": result.get("agents", []),
                "asana": result.get("asana", {}),
            },
        }
    
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/projects")
async def api_projects():
    """List all projects."""
    try:
        projects = list_projects()
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/projects/{project_id}")
async def api_project_detail(project_id: str):
    """Get project details."""
    try:
        info = get_project(project_id)
        return info
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# ── Standalone ────────────────────────────────────────

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8080))
    print(f"Monarch Project Factory — Intake Center UI")
    print(f"http://localhost:{port}")
    print()
    uvicorn.run(app, host="0.0.0.0", port=port)
