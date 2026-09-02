# Hermes — Agent Chat UI Template

Premium AI agent chat interface built with [assistant-ui](https://assistant-ui.com). Dark mode by default, swappable backends, ready for AWS integration.

## Quick Start

```bash
npm install
cp .env.example .env.local
npm run dev
```

Open [http://localhost:3456](http://localhost:3456) in your browser.

## Backend Configuration

This template uses the **Assistant Transport protocol** — the most flexible option for custom backends.

### 1. Set your backend URL

Edit `.env.local`:
```
NEXT_PUBLIC_API_URL=http://localhost:8000/assistant
```

For AWS API Gateway:
```
NEXT_PUBLIC_API_URL=https://xxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/assistant
```

### 2. Configure message format

The default is **LangChain message format** (via `@assistant-ui/react-langgraph`). To swap:

- **OpenAI format**: Replace the converter in `app/MyRuntimeProvider.tsx`
- **Custom format**: Implement your own `createMessageConverter`

See `config/backend.ts` for the adapter configuration.

### 3. Add custom tools

Edit `app/toolkit.tsx` — put your agent's tools there. Uses the `defineToolkit` API with Zod schemas.

### 4. Customize suggestions

Edit `config/template.ts` → `assistant.suggestions` array.

## Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout (Geist font, dark mode, TooltipProvider)
│   ├── page.tsx                # Main page (dashboard + thread)
│   ├── globals.css             # Ethereal Glass dark theme
│   ├── MyRuntimeProvider.tsx   # Assistant Transport runtime + message converter
│   └── toolkit.tsx             # Agent tools definition
├── components/
│   ├── assistant-ui/           # assistant-ui components (Thread, ThreadList, reasonings, etc.)
│   ├── dashboard/              # Dashboard shell (nav, sidebar, layout)
│   └── ui/                     # shadcn/ui primitives
├── config/
│   ├── template.ts             # Template configuration (brand, suggestions, URLs)
│   └── backend.ts              # Backend adapter config (AWS-ready)
└── lib/
    └── utils.ts                # cn() utility
```

## Backend Protocols

This template ships with **Assistant Transport** but can be adapted:

| Backend | How to switch |
|---|---|
| **Assistant Transport** (current) | Already configured — set `NEXT_PUBLIC_API_URL` |
| **AWS Bedrock** | Install `@ai-sdk/amazon-bedrock`, create `app/api/chat/route.ts` |
| **AG-UI protocol** | Replace runtime with AG-UI transport adapter |
| **A2A** | Install `@assistant-ui/react-a2a` and swap runtime |
| **Custom REST API** | Implement Assistant Transport protocol on your backend |

## Design System

| Token | Value |
|---|---|
| **Background** | OLED-rich `oklch(0.115 0.002 260)` |
| **Accent** | Emerald `oklch(0.72 0.18 162)` |
| **Font** | Geist Sans + Geist Mono via `next/font` |
| **Theme** | Ethereal Glass — radial gradients, blur panels, hairline borders |
| **Motion** | Inline cubic-bezier transitions, spring layout animations |

## Commands

```bash
npm run dev      # Start dev server
npm run build    # Production build
```

## Adding Components

```bash
npx assistant-ui@latest add thread-list    # Multi-conversation list
npx assistant-ui@latest add assistant-modal  # Floating chat widget
npx shadcn@latest add accordion tabs badge  # Additional UI primitives
```

## Related Docs

- [assistant-ui Documentation](https://assistant-ui.com/docs)
- [Assistant Transport Runtime](https://assistant-ui.com/docs/runtimes/assistant-transport)
