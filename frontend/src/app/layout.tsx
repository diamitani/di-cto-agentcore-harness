import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ROSTR / PAL Vercel Tech Stack Harness — DI-CTO Agent",
  description:
    "Production-grade governed CTO multi-agent harness powered by PAL compiler, Vercel AI SDK, Vercel Sandbox, AI Gateway, and AWS Bedrock AgentCore.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#07090e] text-slate-100 antialiased bg-grid-pattern selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
