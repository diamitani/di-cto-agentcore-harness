import { runEveBenchmarks } from "@/lib/evals/eve-benchmarks";

export async function POST() {
  try {
    const summary = await runEveBenchmarks();
    return new Response(JSON.stringify(summary), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error?.message || "Evals execution failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
