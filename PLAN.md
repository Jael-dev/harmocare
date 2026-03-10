# Harmocare — Implementation Plan

## About
Harmocare is a gamified mobile companion app helping women understand their hormonal balance through micro-learning, emotional engagement, and wellness guidance. This is the landing page / website for the project.

**GitHub Repo:** https://github.com/Jael-dev/harmocare
**Owner:** Jael-dev (Jaël Ngouzong)

---

## Color System — CSS Variables Strategy

All colors defined once in `globals.css` under `:root` (light) and `.dark` (dark). Components only reference CSS variables — no raw hex values in components.

### Palette (from UI color palettes)

| Role | HSB | Hex | Usage |
|------|-----|-----|-------|
| Brand Primary (cyan) | HSB(183, 69, 98) | `#4EF1FA` | Primary actions, links, accents |
| Amber/Support | HSB(38, 69, 98) | `#FABB4E` | Warnings, highlights |
| Blue/Support | HSB(223, 69, 98) | `#4E7EFA` | Info, secondary accents |
| Green/Support | HSB(104, 69, 98) | `#7CFA4E` | Success states |
| Dark Teal | shades scale | `#0A4D52` | Dark mode bg, dark text |
| Light Cyan | shades scale | `#E8FDFE` | Light mode surface bg |

### CSS Variables

```css
/* globals.css */
:root {
  --color-brand:        #4EF1FA;
  --color-brand-dark:   #0A4D52;
  --color-amber:        #FABB4E;
  --color-blue-support: #4E7EFA;
  --color-green:        #7CFA4E;

  --color-background:   #FFFFFF;
  --color-surface:      #F0FDFE;
  --color-text:         #0A0A0A;
  --color-text-muted:   #6B7280;
  --color-border:       #E2E8F0;
  --color-card:         #FFFFFF;
}

.dark {
  --color-background:   #060F10;
  --color-surface:      #0D2426;
  --color-text:         #F8FAFC;
  --color-text-muted:   #94A3B8;
  --color-border:       #1E3A3D;
  --color-card:         #0D2426;
}
```

### Logo
- Purple/lavender feminine icon (Image 4 — `Images/Logo Design/logo.png`) + "Harmocare" text
- Located at: `/Users/macbook/Desktop/Projects/Harmocare/Images/Logo Design/logo.png`

---

## Tech Stack

- **Next.js 15** — App Router, `src/` directory
- **TypeScript**
- **Tailwind CSS v4** — aliased to CSS variables from globals.css
- **shadcn/ui** + MCP server (https://ui.shadcn.com/docs/mcp)
- **next-themes** — Dark/Light mode via ThemeProvider
- **next-intl** — FR/EN internationalization
- **react-hook-form** + **zod** — Waitlist form validation

---

## Project Structure

```
Code/harmocare/
└── src/
    ├── app/
    │   └── [lang]/                    ← i18n dynamic segment
    │       ├── (public)/
    │       │   ├── page.tsx           ← Landing page
    │       │   └── layout.tsx
    │       ├── (auth)/
    │       │   └── layout.tsx         ← Placeholder (login, signup later)
    │       ├── (app)/
    │       │   └── layout.tsx         ← Placeholder (dashboard later)
    │       └── layout.tsx             ← ThemeProvider + i18n root layout
    ├── components/
    │   ├── landing/
    │   │   ├── Navbar.tsx             ← Logo, nav links, lang switch, theme toggle, CTA
    │   │   ├── Hero.tsx               ← Headline + description + CTA + image placeholder
    │   │   ├── FeatureCards.tsx        ← Blog, Communauté, Insights, Témoignages
    │   │   ├── Waitlist.tsx           ← Email form + social links
    │   │   └── Footer.tsx             ← Logo, links, socials, legal
    │   ├── ui/                        ← shadcn/ui generated components
    │   └── ThemeToggle.tsx            ← Sun/moon dark mode toggle
    ├── dictionaries/
    │   ├── fr.ts                      ← French translations
    │   ├── en.ts                      ← English translations
    │   └── index.ts                   ← getDictionary() helper
    ├── styles/
    │   └── globals.css                ← SINGLE SOURCE OF TRUTH for all colors
    ├── lib/
    │   └── utils.ts                   ← cn() and shared utilities
    └── middleware.ts                   ← i18n locale detection & routing
```

---

## Landing Page Sections

### 1. Navbar
- Logo (purple icon + "Harmocare" text)
- Nav links: Accueil, Blog, Communauté, Insights, Témoignages
- Language switcher (FR / EN) via DropdownMenu
- Theme toggle (sun/moon) via next-themes
- CTA button: "Rejoindre la liste d'attente"
- **shadcn components:** `NavigationMenu`, `Button`, `DropdownMenu`

### 2. Hero Section (layout: content left, image right — like Jasmim reference)
- Left side:
  - Badge: "Bientôt disponible"
  - Headline: "Comprends ton corps, reprends ton équilibre"
  - Description: Value proposition from project docs
  - CTA button: "Je veux tester en avant-première"
- Right side:
  - Image placeholder (will be replaced later)
- **shadcn components:** `Button`, `Badge`

### 3. Feature Cards (4 cards below hero)
| Card | Title | Description |
|------|-------|-------------|
| Blog | Blog | Articles et micro-apprentissages sur la santé hormonale |
| Communauté | Communauté | Un espace bienveillant entre femmes pour partager et s'entraider |
| Insights | Insights | Des données personnalisées pour mieux comprendre ton corps |
| Témoignages | Témoignages | Histoires et retours d'expériences d'utilisatrices |

Each card has: icon, title, description, "Bientôt" badge
- **shadcn components:** `Card`, `CardHeader`, `CardContent`, `Badge`

### 4. Waitlist Section (full-width, dark teal background — like Evolve reference)
- Dark teal/brand background
- Headline: "Sois parmi les premières à découvrir Harmocare"
- Subheadline: Short value prop text
- Email input + Submit button (validated with zod)
- Social links: Instagram + LinkedIn icons
- **shadcn components:** `Input`, `Button`, `Form`

### 5. Footer
- Logo + tagline
- Navigation links: Blog, Communauté, Insights, Témoignages
- Social icons: Instagram, LinkedIn
- Legal: © 2025 Harmocare — Mentions légales
- **Built with:** Pure Tailwind (no shadcn needed)

---

## i18n Setup

- Routes: `/fr/...` (default) and `/en/...`
- `middleware.ts` detects browser locale, redirects to `/fr` or `/en`
- Typed dictionaries: `dictionaries/fr.ts` and `dictionaries/en.ts`
- `getDictionary(lang: "fr" | "en")` async helper
- All user-facing text comes from dictionaries — no hardcoded strings in components

---

## Dark / Light Mode

- `next-themes` ThemeProvider wraps the app in root layout
- `ThemeToggle.tsx` component in Navbar (sun/moon icon)
- CSS variables in `globals.css` switch via `:root` (light) and `.dark` (dark)
- Tailwind is configured to use these CSS variables
- shadcn components automatically respect the theme via CSS variables

---

## Execution Steps

1. [x] Create `Code/` folder under Harmocare project
2. [x] Create GitHub repo `Jael-dev/harmocare` via `gh`
3. [ ] Scaffold Next.js 15 inside `Code/harmocare/` (TS, Tailwind, App Router, src dir)
4. [ ] Install & configure shadcn/ui (init + install components)
5. [ ] Configure shadcn MCP server (https://ui.shadcn.com/docs/mcp)
6. [ ] Install next-themes, next-intl, react-hook-form, zod
7. [ ] Define all CSS variables in `globals.css` (light + dark)
8. [ ] Configure Tailwind to use CSS variables
9. [ ] Set up next-themes ThemeProvider in root layout
10. [ ] Set up next-intl middleware + `[lang]` routing + dictionaries (fr.ts, en.ts)
11. [ ] Create route groups `(public)`, `(auth)`, `(app)` with layouts
12. [ ] Build Navbar (logo, nav, lang switcher, theme toggle, CTA)
13. [ ] Build Hero section (headline, description, CTA, image placeholder)
14. [ ] Build FeatureCards section (Blog, Communauté, Insights, Témoignages)
15. [ ] Build Waitlist section (email form, social links)
16. [ ] Build Footer (logo, links, socials, legal)
17. [ ] Assemble landing page in `(public)/page.tsx`
18. [ ] Wire i18n through all components
19. [ ] Initial commit & push to GitHub

---

## shadcn/ui Components to Install

```bash
npx shadcn@latest add button card input form badge navigation-menu dropdown-menu
```

---

## Key Assets

| Asset | Location |
|-------|----------|
| Logo (purple) | `Images/Logo Design/logo.png` |
| Color palette | `UI color palettes.png` (desktop) |
| Project doc (PDF) | `Documents/Probleme, Solution, Différentiation et Segmentation_V2.pdf` |
| Landing page ref (Jasmim) | `Images/Landing page design/1.jpg` |
| Waitlist ref (Evolve) | `Images/Landing page design/Coming soon.jpg` |
| Avatar assets | `Images/Avatar/` |

---

## Social Links

- Instagram: (URL to be provided)
- LinkedIn: (URL to be provided)
