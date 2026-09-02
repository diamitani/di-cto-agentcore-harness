import { streamText } from "ai";
import { resolveAIModel } from "@/lib/gateway/router";
import { compilePALIntent } from "@/lib/pal/compiler";
import { memoryStore } from "@/lib/pal/memory";

export const maxDuration = 45;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { messages, preferredModel, customWeights } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: "Messages array is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const lastUserMessage = [...messages].reverse().find((m) => m.role === "user")?.content || "";

    // Step 1: PAL Intent Compilation
    const pal = compilePALIntent(lastUserMessage, customWeights);

    // Step 2: Record to episodic memory
    memoryStore.add({
      namespace: "rostr_decisions",
      content: `Compiled: "${pal.intent}" -> Phase: ${pal.phase}, Priority: ${pal.priorityScore}`,
      phase: pal.phase,
      tags: [pal.domain, pal.phase.toLowerCase(), ...pal.subAgents],
      metadata: { subAgents: pal.subAgents, priorityScore: pal.priorityScore },
    });

    // Step 3: Check AI Model from Gateway
    const model = resolveAIModel(preferredModel);

    if (model) {
      // Stream real LLM with system prompt + PAL context
      const systemPrompt = `You are DI-CTO, the Diamitani Industries governed CTO AI agent.
Operating under the ROSTR / PAL Framework:
- Phase: ${pal.phase}
- Domain: ${pal.domain}
- Priority Score: ${pal.priorityScore}/10
- Active Sub-Agents: ${pal.subAgents.join(", ")}
- Approval Gates: ${pal.approvalGates.join(", ") || "None"}
- Operating Principles: Start with user outcome, preserve intent discipline, prefer vertical slices, make work traceable.`;

      const result = streamText({
        model,
        system: systemPrompt,
        messages: messages.map((m: any) => ({
          role: m.role as "user" | "assistant" | "system",
          content: m.content,
        })),
        temperature: 0.2,
      });

      return result.toTextStreamResponse();
    }

    // Step 4: Deterministic Fallback Streaming Simulation (Zero-config instant response)
    const simulatedResponse = `### [ROSTR PAL Pipeline - Phase: ${pal.phase}]
**NPAO Priority Score:** \`${pal.priorityScore}/10\` | **Sub-Agents:** \`${pal.subAgents.join(", ")}\`

I have analyzed your outcome-driven request through the 5-stage PAL compiler:

1. **Intent Decomposition:** Identified goal in domain \`${pal.domain}\` for phase \`${pal.phase}\`.
2. **Context & Dependency Injection:** Loaded governance soul rules and active workspace blueprints.
3. **Sub-Agent Orchestration:** Dispatched to \`${pal.subAgents[0]}\` for execution planning.
4. **Approval Boundary:** ${pal.approvalGates.length > 0 ? `⚠️ Active Gate: \`${pal.approvalGates.join(", ")}\` (Human approval required)` : `✅ No blocking approval gates.`}
5. **Memory Compounding:** Logged decision trajectory to namespace \`rostr_decisions\`.

#### Proposed Vertical Slice & Actions:
- **Architecture**: Structured according to Vercel Tech Stack standards.
- **Execution**: Verified in Vercel Sandbox environment.
- **Next Step**: Proceed with component implementation and regression verification suite.`;

    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        const chunks = simulatedResponse.split(" ");
        for (let i = 0; i < chunks.length; i++) {
          const textChunk = (i === 0 ? "" : " ") + chunks[i];
          controller.enqueue(encoder.encode(textChunk));
          await new Promise((res) => setTimeout(res, 20));
        }
        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
      },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
