# Harmocare

Mental health and well-being platform built with Next.js 16, Supabase, and TypeScript.

## Project Setup

- **Runtime**: Node.js with Bun as package manager (`bun install`, `bun run dev`)
- **Framework**: Next.js 16.1.6 (App Router, `src/` directory)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 with CSS variables for theming
- **UI Components**: shadcn/ui (base-nova style) + Lucide icons
- **Backend**: Supabase (auth, database, SSR)
- **Forms**: react-hook-form + Zod validation
- **Theming**: next-themes (light mode default)
- **Path alias**: `@/*` → `./src/*`

## Architecture

```
src/
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Root layout (metadata, Inter font)
│   ├── globals.css             # CSS variables, theme config, Tailwind v4
│   ├── actions/                # Server Actions
│   │   └── waitlist.ts         # Waitlist signup (Zod validation + Supabase insert)
│   └── [lang]/                 # Dynamic i18n segment (fr, en)
│       ├── layout.tsx          # ThemeProvider + generateStaticParams
│       └── (public)/           # Route group: public pages
│           ├── layout.tsx
│           └── page.tsx        # Landing page
├── components/
│   ├── ui/                     # shadcn/ui primitives (badge, button, card, dropdown-menu, input)
│   ├── landing/                # Landing page sections (Navbar, Hero, FeatureCards, Waitlist, Footer)
│   └── ThemeToggle.tsx         # Dark/light mode toggle
├── dictionaries/               # i18n translation files
│   ├── index.ts                # Dictionary type, getDictionary(), locales, defaultLocale
│   ├── fr.ts                   # French translations (default)
│   └── en.ts                   # English translations
├── lib/
│   ├── utils.ts                # cn() utility (clsx + tailwind-merge)
│   └── supabase/
│       ├── client.ts           # Browser Supabase client
│       └── server.ts           # Server-side Supabase client (cookies)
└── proxy.ts                    # Next.js proxy (formerly middleware)
```

## Conventions

### Route Groups

Route groups use parentheses `(groupName)` to organize routes without affecting the URL:

- `(public)` — Public-facing pages (landing, blog, etc.)
- `(auth)` — Authentication pages (login, signup) — planned
- `(app)` — Protected dashboard pages — planned

### Server Actions

Server actions live in `src/app/actions/`. They use the `"use server"` directive and follow this pattern:

- Validate input with Zod
- Interact with Supabase server client
- Return typed result objects (e.g. `{ success: true } | { success: false; error: string }`)

### Proxy (Next.js 16 — formerly Middleware)

Next.js 16 renamed `middleware.ts` to `proxy.ts`. The exported function is named `proxy` instead of `middleware`. It runs on the Node.js runtime (not Edge).

**File**: `src/proxy.ts`

The proxy handles:

1. **Locale detection** — Reads `Accept-Language` header, redirects bare paths (`/`) to `/{locale}/` (defaults to `fr`). Skips static files, API routes, and paths with file extensions.
2. **Supabase auth refresh** — Creates an SSR Supabase client, calls `getUser()` to refresh auth tokens, and syncs updated cookies to the response.

**Matcher config** excludes: `_next/static`, `_next/image`, `favicon.ico`, and common static asset extensions.

Migration reference: `npx @next/codemod@canary middleware-to-proxy .`

## i18n Configuration

- **Supported locales**: `fr` (default), `en`
- **Strategy**: Dynamic `[lang]` route segment with `generateStaticParams()`
- **Translations**: Typed `Dictionary` interface in `src/dictionaries/index.ts`
- **Sections**: `nav`, `hero`, `features`, `waitlist`, `footer`
- **Helper**: `getDictionary(lang: Locale)` returns the full dictionary for a locale
- **Detection**: Browser locale detected in `proxy.ts` via `Accept-Language` header, redirects to matching locale prefix

## Key Files

| File | Purpose |
|---|---|
| `src/proxy.ts` | Request proxy — locale redirect + auth refresh |
| `src/dictionaries/index.ts` | i18n types, locale list, dictionary loader |
| `src/app/actions/waitlist.ts` | Server action for waitlist email signup |
| `src/lib/supabase/server.ts` | Server-side Supabase client with cookie handling |
| `src/lib/supabase/client.ts` | Browser-side Supabase client |
| `src/app/globals.css` | Theme CSS variables (light/dark) + Tailwind v4 imports |
| `components.json` | shadcn/ui configuration |

## Environment Variables

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_KEY` — Supabase anon/publishable key
