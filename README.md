# Chive V1 — Homepage

A public library of AI conversations. Built per the Chive V1 Homepage PRD.

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · next-themes · lucide-react · Supabase-ready · pnpm

## Getting started

```bash
pnpm install
cp .env.example .env.local   # then fill in Supabase credentials
pnpm dev
```

Open http://localhost:3000.

## What's wired up vs. stubbed

- **Frontend**: every section in the PRD is built — Navbar, Hero + Search, About, How It
  Works, Latest Conversations, Browse Conversations (search/filter/sort), Publish form
  (full client-side validation matching the PRD's rules), Contact, Footer, floating
  scroll-to-top, dark/light mode, scroll fade-ins, and the `/chat/[id]` detail page.
- **Data**: `lib/mock-data.ts` stands in for `select * from conversations where status =
  'approved'` so the homepage is fully browsable without a live database.
- **Supabase**: `lib/supabase.ts` creates a real client the moment
  `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` are set. The Publish form
  already calls `supabase.from("conversations").insert(...)` — if no credentials are
  present it just completes the UI flow locally so the experience can be reviewed
  end-to-end before the database exists.
- **Schema**: matches the PRD's `conversations` table exactly (see `lib/types.ts`).
  Suggested Supabase setup: RLS on, public `select` where `status = 'approved'`, public
  `insert` with `status` forced to `'pending'` via a default/trigger (never trust the
  client's status value).
- **Logo**: pulled from `NEXT_PUBLIC_CHIVE_LOGO_URL`, defaulting to the Cloudinary URL in
  the PRD — this is the seam the future Admin Panel will write to.
- **shadcn/ui**: the PRD lists it as a dependency, but its CLI pulls component source from
  ui.shadcn.com at install time, which this build environment couldn't reach. The
  primitives (`.chive-input`, `.key-button`, `.panel`, `.well`) were hand-built in
  Tailwind to the same contract shadcn components follow (composable, unstyled-by-default
  className overrides) — running `npx shadcn@latest init` locally will let you swap in
  real shadcn primitives without touching layout code.

## Design system

Colors, fonts, and the "modern skeuomorphic" direction come straight from the PRD:
background `#000000`, text `#f3efe0`, mint accent `#7fefbd`, gold accent `#cba135`,
surface `#111111`. The signature element is the recessed, glowing dot-matrix "well"
(see the Hero search box and the Publish success modal's Conversation ID readout) —
a direct translation of the reference panels' LED displays into Chive's dark theme.

## Project structure

```
app/
  layout.tsx        Root layout, fonts, theme provider
  globals.css        Design tokens + skeuomorphic primitives (panel, well, key-button…)
  page.tsx            Homepage — assembles every PRD section in order
  not-found.tsx        404 for unknown Conversation IDs
  chat/[id]/page.tsx   Conversation Detail page
components/            One file per homepage section, plus shared primitives
lib/                   types, mock data, validation, Supabase client, small utils
```
