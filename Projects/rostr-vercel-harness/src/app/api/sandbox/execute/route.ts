import { executeSandbox, SandboxExecutionRequest } from "@/lib/sandbox/runner";

export async function POST(req: Request) {
  try {
    const body: SandboxExecutionRequest = await req.json();
    if (!body.code) {
      return new Response(JSON.stringify({ error: "Code is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const result = await executeSandbox(body);
    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Execution error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
