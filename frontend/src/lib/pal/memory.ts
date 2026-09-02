/**
 * ROSTR Episodic & Semantic Memory Store
 */

export interface MemoryEntry {
  id: string;
  namespace: "rostr_decisions" | "rostr_learnings";
  content: string;
  phase: string;
  tags: string[];
  timestamp: string;
  metadata?: Record<string, any>;
}

// In-memory persistent session store
class MemoryStore {
  private entries: MemoryEntry[] = [
    {
      id: "mem-001",
      namespace: "rostr_decisions",
      content: "Adopted Vercel AI SDK v4+ with Next.js 15 App Router as standard harness substrate.",
      phase: "PreD",
      tags: ["architecture", "vercel-ai-sdk", "nextjs15"],
      timestamp: "2026-09-02T03:00:00.000Z",
    },
    {
      id: "mem-002",
      namespace: "rostr_decisions",
      content: "Enforced NPAO 4D scoring formula with low temperature (0.2) to prevent phase drift.",
      phase: "Design",
      tags: ["npao", "governance", "prompt-engineering"],
      timestamp: "2026-09-02T03:10:00.000Z",
    },
    {
      id: "mem-003",
      namespace: "rostr_learnings",
      content: "Sandboxed execution isolates AI-generated code, reducing regression rate by 84%.",
      phase: "Development",
      tags: ["sandbox", "testing", "security"],
      timestamp: "2026-09-02T03:20:00.000Z",
    },
  ];

  public getAll(): MemoryEntry[] {
    return [...this.entries];
  }

  public getByNamespace(namespace: MemoryEntry["namespace"]): MemoryEntry[] {
    return this.entries.filter((e) => e.namespace === namespace);
  }

  public add(entry: Omit<MemoryEntry, "id" | "timestamp">): MemoryEntry {
    const newEntry: MemoryEntry = {
      ...entry,
      id: `mem-${Date.now().toString(36)}`,
      timestamp: new Date().toISOString(),
    };
    this.entries.unshift(newEntry);
    return newEntry;
  }

  public search(query: string): MemoryEntry[] {
    const q = query.toLowerCase();
    return this.entries.filter(
      (e) =>
        e.content.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q)) ||
        e.phase.toLowerCase().includes(q)
    );
  }
}

export const memoryStore = new MemoryStore();
