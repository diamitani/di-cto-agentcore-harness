import { compilePALIntent } from "@/lib/pal/compiler";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { prompt, customWeights } = body;

    if (!prompt || typeof prompt !== "string") {
      return new Response(JSON.stringify({ error: "Prompt string is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const compiled = compilePALIntent(prompt, customWeights);
    return new Response(JSON.stringify(compiled), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Failed to compile intent" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
