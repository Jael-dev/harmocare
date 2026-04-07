# Blog Engagement — Reading Tracker & Reactions

## Overview

Add two engagement features to the bottom of each blog post:
1. **Reaction bar** — 5 emoji reactions (anonymous, cookie-based)
2. **Reading tracker** — email-based "Mark as read" with article count confirmation

## Database Migration

Run this SQL in Supabase SQL Editor:

```sql
-- Readers table: blog readers who gave their email
create table public.readers (
  id uuid not null default gen_random_uuid(),
  email text not null,
  created_at timestamptz not null default now(),
  constraint readers_pkey primary key (id),
  constraint readers_email_key unique (email)
);

-- Reading history: articles marked as read
create table public.reading_history (
  id uuid not null default gen_random_uuid(),
  reader_id uuid not null references public.readers(id) on delete cascade,
  slug text not null,
  locale text not null,
  read_at timestamptz not null default now(),
  constraint reading_history_pkey primary key (id),
  constraint reading_history_unique unique (reader_id, slug, locale)
);

-- Article reactions: anonymous emoji reactions (cookie-based)
create table public.article_reactions (
  id uuid not null default gen_random_uuid(),
  slug text not null,
  locale text not null,
  reaction text not null check (reaction in ('heart', 'thumbs_up', 'smile', 'thumbs_down', 'sad')),
  visitor_id text not null,
  created_at timestamptz not null default now(),
  constraint article_reactions_pkey primary key (id),
  constraint article_reactions_unique unique (slug, locale, visitor_id)
);

-- Enable RLS
alter table public.readers enable row level security;
alter table public.reading_history enable row level security;
alter table public.article_reactions enable row level security;

-- RLS policies: allow inserts and selects from anon role (public blog)
create policy "Anyone can insert readers" on public.readers for insert with check (true);
create policy "Anyone can read readers" on public.readers for select using (true);

create policy "Anyone can insert reading_history" on public.reading_history for insert with check (true);
create policy "Anyone can read reading_history" on public.reading_history for select using (true);

create policy "Anyone can insert reactions" on public.article_reactions for insert with check (true);
create policy "Anyone can read reactions" on public.article_reactions for select using (true);
create policy "Anyone can update own reaction" on public.article_reactions for update using (true) with check (true);
```

---

## Steps

### Step 1 — Run database migration

Run the SQL above in Supabase SQL Editor to create the 3 tables with RLS policies.

### Step 2 — Create server actions

**`src/app/actions/reading.ts`**
- `markAsRead(formData)` — validates email (Zod), upserts into `readers`, inserts into `reading_history` (ignore duplicate), returns total articles read count
- `getReaderStats(email)` — returns total articles read for this reader

**`src/app/actions/reactions.ts`**
- `toggleReaction(formData)` — takes slug, locale, reaction, visitor_id. Upserts into `article_reactions` (updates reaction if visitor already reacted, or inserts new)
- `getReactionCounts(slug, locale)` — returns counts per reaction type for the article
- `getVisitorReaction(slug, locale, visitorId)` — returns the visitor's current reaction (if any)

### Step 3 — Create ReactionBar component

**`src/components/blog/ReactionBar.tsx`** — Client component
- 5 buttons: ❤️ (`heart`), 👍 (`thumbs_up`), 😊 (`smile`), 👎 (`thumbs_down`), 😢 (`sad`)
- Each button shows its count
- Active state highlights the visitor's current pick
- Clicking a reaction calls the server action
- Generates a `visitor_id` UUID, stores in localStorage
- One reaction per visitor per article (clicking another switches it)

### Step 4 — Create ReadTracker component

**`src/components/blog/ReadTracker.tsx`** — Client component
- Three states:
  1. **New visitor** (no cookie): card with email input + "Mark as read" button
  2. **Returning visitor** (cookie set): card with "Mark as read" button, shows their email
  3. **Already read / just marked**: confirmation line — "Saved! You've read X articles so far."
- Stores reader email in cookie (`reader_email`) after first submission
- Calls `markAsRead` server action

### Step 5 — Update blog post page

**`src/app/[lang]/(public)/blog/[slug]/page.tsx`**
- Add `<ReactionBar />` below the article content
- Add `<ReadTracker />` below the reaction bar

---

## Files to Create

| File | Description |
|---|---|
| `src/app/actions/reading.ts` | Server actions for mark as read + reader stats |
| `src/app/actions/reactions.ts` | Server actions for emoji reactions |
| `src/components/blog/ReactionBar.tsx` | Emoji reaction buttons with counts |
| `src/components/blog/ReadTracker.tsx` | Email collection + mark as read CTA |

## Files to Modify

| File | Change |
|---|---|
| `src/app/[lang]/(public)/blog/[slug]/page.tsx` | Add ReactionBar + ReadTracker below article |

## Decisions

- Reactions are anonymous (cookie-based `visitor_id`), no email required
- Reading tracker requires email on first use, then cookie for returning visits
- All UI stays in the `(public)` route group
- No badges/levels/confetti on the public page — just a clean count confirmation
- Tables are separate from `waitlist` (different intent)
