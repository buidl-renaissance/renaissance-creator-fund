# Creation Cycle

A month-long, creator-led creation program that funds original work through a blended model of community participation, sponsor matching, and artisan fund support. Each cycle culminates in a live public celebration and a documented creative artifact.

## Overview

- **Duration:** 4 weeks per cycle
- **Creator team:** 1 lead creator + 2–3 collaborators
- **Funding per cycle:** $1,500 ($500 community tickets, $500 sponsor match, $500 artisan fund)
- **Live celebration:** Ticketed ($20), ~20–25 attendees, salon-style at the studio

## Getting Started

### Prerequisites

- Node.js 18+
- Yarn

### Install & Run

```bash
yarn install
yarn dev
```

Open [http://localhost:3000](http://localhost:3000).

### Database

Uses SQLite (local) or Turso (remote). Set `USE_LOCAL=true` for local development.

```bash
yarn db:push    # Apply schema to database
yarn db:migrate # Run migrations
```

### Environment

Copy `env.example` to `.env.local` and configure as needed.

## Features

- **Landing page** — Program overview and entry point
- **Cycles** — Browse past and upcoming Creation Cycles
- **Cycle detail** — 4-week timeline, artist team, creative direction, documentation
- **Celebration events** — Ticketed live events with reservation
- **Dashboard** — Authenticated user home with links to cycles and events

## Tech Stack

- Next.js (Pages Router)
- TypeScript
- Styled Components
- Drizzle ORM (SQLite / Turso)
