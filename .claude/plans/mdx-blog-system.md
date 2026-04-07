# MDX Blog System — Implementation Plan

## Overview

Add a full MDX-powered blog system to harmocare: content in `src/content/blogs/`, helper functions to query posts, blog routes under `[lang]/(public)/blog/`, and reusable MDX components.

## Packages to Install

- `@next/mdx` — Next.js MDX integration with `createMDX`
- `@mdx-js/loader` — MDX webpack loader (required by `@next/mdx`)
- `@mdx-js/react` — MDX React provider
- `remark-frontmatter` — Parse YAML frontmatter in MDX
- `remark-mdx-frontmatter` — Expose frontmatter as named exports
- `gray-matter` — Parse frontmatter in helper functions (without full MDX compilation)

Already installed: `@tailwindcss/typography` (prose styling)

---

## Steps

### Step 1 — Install dependencies

```bash
bun add @next/mdx @mdx-js/loader @mdx-js/react remark-frontmatter remark-mdx-frontmatter gray-matter
```

### Step 2 — Update `next.config.ts`

Wrap config with `createMDX` from `@next/mdx`. Add `remark-frontmatter` and `remark-mdx-frontmatter` to remark plugins. Add `mdx` to `pageExtensions`.

```ts
import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
};

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter],
  },
});

export default withMDX(nextConfig);
```

### Step 3 — Create `src/mdx-components.tsx`

Required by `@next/mdx`. Imports all custom components from `src/components/mdx/` and maps them for MDX rendering.

```tsx
import type { MDXComponents } from "mdx/types";
import { BlogHero } from "@/components/mdx/BlogHero";
import { BlogFooter } from "@/components/mdx/BlogFooter";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    BlogHero,
    BlogFooter,
    ...components,
  };
}
```

### Step 4 — Create MDX components in `src/components/mdx/`

**`src/components/mdx/BlogHero.tsx`**
- Props: `title`, `description`, `cta?` (optional link/text)
- Displays a customizable hero banner at the top of blog posts

**`src/components/mdx/BlogFooter.tsx`**
- Displays company links (social, legal) at the bottom of blog posts
- Can reuse data from the landing footer

### Step 5 — Create blog content directory `src/content/blogs/{locale}/`

Blogs are localized using **Option A — Separate directories per locale**:

```
src/content/blogs/
├── fr/
│   └── bienvenue-sur-harmocare.mdx
└── en/
    └── welcome-to-harmocare.mdx
```

Each `.mdx` file uses YAML frontmatter:

```mdx
---
title: "My Blog Post"
slug: "my-blog-post"
description: "A short description"
date: "2026-04-07"
featured: true
image: "/blog/my-post.jpg"
---

<BlogHero title="My Blog Post" description="A short description" />

Blog content here...

<BlogFooter />
```

Create a sample 5-paragraph fictive blog post in both `fr/` and `en/`.

### Step 6 — Create blog helper functions in `src/lib/blog.ts`

All helpers take a `locale: Locale` parameter and read from `src/content/blogs/{locale}/`.

Frontmatter type:

```ts
interface BlogMeta {
  title: string;
  slug: string;
  description: string;
  date: string;
  featured: boolean;
  image?: string;
}
```

| Function | Description |
|---|---|
| `getBlogSlugs(locale)` | Reads `src/content/blogs/{locale}/`, filters `.mdx` files, returns slugs (filename without extension) |
| `getBlogBySlug(slug, locale)` | Uses `gray-matter` to parse frontmatter, returns metadata + MDX content via dynamic import |
| `getAllBlogs(locale)` | Calls `getBlogSlugs(locale)` → `getBlogBySlug()` for each, returns all blog metadata sorted by date desc |
| `getFeaturedBlogs(locale)` | Calls `getAllBlogs(locale)`, filters where `featured === true` |

### Step 7 — Create blog routes under `src/app/[lang]/(public)/blog/`

**`src/app/[lang]/(public)/blog/page.tsx`** — Blog listing
- Reads `lang` from params
- Calls `getAllBlogs(lang)` to get locale-specific posts
- Renders grid/list of blog cards (title, description, date, image)
- Links each card to `/[lang]/blog/[slug]`

**`src/app/[lang]/(public)/blog/[slug]/page.tsx`** — Blog post
- `generateStaticParams()` iterates over all locales, calls `getBlogSlugs(locale)` for each, returns `{ lang, slug }` pairs
- Dynamically imports MDX: `const { default: Content, ...frontmatter } = await import(@/content/blogs/${lang}/${slug}.mdx)`
- Renders `<Content />` inside a `prose` container (`@tailwindcss/typography`)

### Step 8 — Update `tsconfig.json`

Add `**/*.mdx` to the `include` array so TypeScript recognizes MDX files.

---

## Files to Create

| File | Type |
|---|---|
| `src/content/blogs/` | Directory for MDX blog posts |
| `src/lib/blog.ts` | Blog helper functions |
| `src/mdx-components.tsx` | MDX component mapping (Next.js convention) |
| `src/components/mdx/BlogHero.tsx` | Blog hero component |
| `src/components/mdx/BlogFooter.tsx` | Blog footer component |
| `src/app/[lang]/(public)/blog/page.tsx` | Blog listing page |
| `src/app/[lang]/(public)/blog/[slug]/page.tsx` | Blog post page |

## Files to Modify

| File | Change |
|---|---|
| `next.config.ts` | Wrap with `createMDX`, add pageExtensions |
| `tsconfig.json` | Add `**/*.mdx` to include |

---

## Decisions

1. **Blog localization** — Option A: separate directories per locale (`src/content/blogs/fr/`, `src/content/blogs/en/`)
2. **BlogHero/BlogFooter design** — Match landing page style
3. **Sample blog post** — Yes, create a fictive 5-paragraph post in both locales
