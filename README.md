# Kansas Full Gospel Church — Official Website

![Next.js](https://img.shields.io/badge/Next.js_16-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)

A full rebuild of the official website for **Kansas Full Gospel Church** (founded 1977), replacing the legacy [ksfgc.net](http://ksfgc.net) site with a modern, performant, and fully self-managed web application.

**Live site:** [https://ksfgc.com](https://ksfgc.com)

---

## Before & After

| Before (`ksfgc.net`) | After (`ksfgc.com`) |
|---|---|
| ![Before screenshot](docs/screenshots/before.png) | ![After screenshot](docs/screenshots/after.png) |

---

## Features

| Area | Details |
|---|---|
| **Church News** | Post / edit / delete news articles with multi-image support |
| **Weekly Bulletin** | Upload and display weekly bulletin images; modal viewer |
| **Sermon Video Archive** | YouTube playlist integration with cursor-based pagination |
| **Church History** | Era-based interactive timeline managed from the admin dashboard |
| **Admin Dashboard** | Unified CMS for news, bulletins, and history — protected by Supabase Auth JWT |
| **Image / File Upload** | Drag-and-drop upload to Supabase Storage with live preview |
| **SEO** | Dynamic `sitemap.xml`, `robots.txt`, per-page `<Metadata>` with Open Graph |
| **Smooth Navigation** | Framer Motion page transitions via custom `TransitionLink` |
| **Responsive Design** | Mobile-first layout; adaptive cards, tables, and grids throughout |

---

## Tech Stack

### Frontend
- **Next.js 16** (App Router) — Server Components for data-fetching pages, Client Components for interactive UI
- **React 19** — latest concurrent features
- **TypeScript** — strict typing across all components, API routes, and DB models
- **Tailwind CSS v4** — utility-first styling with PostCSS plugin

### Backend / Infrastructure
- **Supabase** — PostgreSQL database, Row Level Security (RLS), Supabase Auth, and Storage buckets
- **YouTube Data API v3** — sermon video listings with `nextPageToken`-based pagination
- **Vercel** — zero-config CI/CD deployment from the `main` branch
- **Cloudflare** — DNS management and CDN for the `ksfgc.com` domain

### Key Libraries
- `framer-motion` — page enter/exit animations
- `lucide-react` — icon set
- `fast-xml-parser` — YouTube RSS feed parsing fallback
- `server-only` — hard boundary enforcement between server and client modules

---

## Architecture Highlights

### Supabase Auth JWT — Admin Protection
Admin routes (`/admin`) are protected end-to-end:

1. The client authenticates via `supabase.auth.signInWithPassword()`
2. The returned JWT `access_token` is attached to every mutating request as `Authorization: Bearer <token>`
3. Server API routes call `verifyAdminToken(request)` which validates the token against Supabase Auth — no shared secrets, no ADMIN_PASSWORD env var

```
frontend/lib/supabase-server.ts   ← verifyAdminToken() using service role key
frontend/middleware.ts            ← redirects /*/admin/* → /admin (route guard)
```

### Database Schema (Supabase / PostgreSQL)

```sql
-- Church news posts
create table church_news (
  id         uuid default gen_random_uuid() primary key,
  title      text not null,
  content    text not null,
  image_urls text[] default '{}',
  created_at timestamptz default now()
);

-- Weekly bulletins
create table bulletins (
  id         uuid default gen_random_uuid() primary key,
  title      text not null,
  date       text not null,
  image_urls text[] default '{}',
  created_at timestamptz default now()
);

-- Church history (era + event)
create table church_history_eras (
  id         uuid default gen_random_uuid() primary key,
  title      text not null,
  period     text not null,
  icon_name  text not null,
  sort_order int  not null
);

create table church_history_events (
  id         uuid default gen_random_uuid() primary key,
  era_id     uuid references church_history_eras(id) on delete cascade,
  year       text not null,
  date       text not null,
  event_text text not null,
  is_major   boolean default false,
  sort_order int not null
);
```

RLS policies allow **public read access** and restrict writes to authenticated service-role calls only.

### Storage — Orphan Cleanup on Delete / Edit
When a news post or bulletin is deleted or its images are modified, the API route automatically removes orphaned files from the Supabase Storage bucket before updating the database row — preventing unbounded storage growth.

```
app/api/admin/news/route.ts      ← POST / PUT / DELETE with storage cleanup
app/api/admin/bulletin/route.ts  ← same pattern for bulletins
app/api/admin/upload/route.ts    ← multipart upload → Supabase Storage
```

### Sermon Pagination — YouTube API
Sermons are fetched from a YouTube playlist using cursor-based pagination (`nextPageToken` / `prevPageToken`). The API route is a thin server-side proxy that hides the API key and controls page size.

```
app/api/sermons/route.ts         ← GET ?pageToken=...&size=9
lib/youtube.ts                   ← getSermonList(pageToken, size)
```

### SEO
- `app/sitemap.ts` — dynamically generates sitemap entries for all news posts from Supabase
- `app/robots.ts` — disallows admin and API routes
- Each page exports a typed `Metadata` object with `title`, `description`, and canonical URLs

### Deployment
- Push to `main` → Vercel auto-deploys
- Environment variables managed via Vercel dashboard
- Cloudflare proxies `ksfgc.com` → Vercel edge network

---

## Project Structure

```
frontend/
├── app/
│   ├── page.tsx                   # Home
│   ├── about/page.tsx             # Church intro, pastor profile, history timeline
│   ├── sermons/page.tsx           # Worship schedule + sermon video archive
│   ├── news/
│   │   ├── page.tsx               # Church news list (Server Component)
│   │   └── [id]/page.tsx          # News detail
│   ├── admin/page.tsx             # Unified admin dashboard (news/bulletin/history)
│   ├── api/
│   │   ├── sermons/route.ts       # YouTube API proxy
│   │   └── admin/
│   │       ├── news/route.ts
│   │       ├── bulletin/route.ts
│   │       ├── upload/route.ts
│   │       └── history/route.ts
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── common/                    # Header, Footer, PageTransition, TransitionLink
│   └── home/                     # HeroSection, WorshipSchedule, LatestSermon, …
├── lib/
│   ├── supabase.ts                # Public client (anon key)
│   ├── supabase-server.ts         # Server client (service role) + verifyAdminToken
│   └── youtube.ts                 # YouTube API helpers
├── types/index.ts                 # Shared TypeScript types
└── middleware.ts                  # Admin route guard
```

---

## Local Development

### Prerequisites
- Node.js 20+
- A Supabase project with the schema above applied
- A YouTube Data API v3 key

### Setup

```bash
# 1. Clone the repo
git clone https://github.com/<your-username>/full-gospel-church.git
cd full-gospel-church/frontend

# 2. Install dependencies
npm install

# 3. Configure environment variables
cp .env.example .env.local
# → fill in values (see below)

# 4. Start dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Environment Variables

Create `frontend/.env.local` based on the template below:

```env
# .env.example

# YouTube Data API v3
YOUTUBE_API_KEY=

# Supabase — public (safe to expose to browser)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# Supabase — server only (never exposed to browser)
SUPABASE_SERVICE_ROLE_KEY=
```

> **Note:** `SUPABASE_SERVICE_ROLE_KEY` is only imported in files marked `import "server-only"` and is never bundled into client code.

---

## Admin Account Setup

Admin accounts are managed entirely through **Supabase Authentication**:

1. Go to your Supabase dashboard → **Authentication → Users**
2. Click **Invite user** or **Add user** and create an account with email + password
3. Use those credentials to log in at `/admin`

No additional configuration is required.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | ESLint check |

