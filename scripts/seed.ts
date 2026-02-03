/**
 * Seed script for Renaissance City Creator Fund
 * Run: yarn db:seed (from app-blocks/renaissance-creator-fund)
 */
import { v4 as uuid } from 'uuid';
import { config } from 'dotenv';

config({ path: '.env.local' });
config({ path: '.env' });

// Use local DB for seeding
process.env.USE_LOCAL = 'true';

const { getDb } = await import('../src/db/drizzle');
const {
  users,
  cycles,
  cycleArtists,
  celebrationEvents,
  tickets,
  sponsors,
} = await import('../src/db/schema');

const db = getDb();

// Date helpers (Unix seconds)
const date = (y: number, m: number, d: number) =>
  Math.floor(new Date(y, m - 1, d).getTime() / 1000);

async function seed() {
  console.log('🌱 Seeding database...\n');

  // 1. Users (creators + community)
  const userIds = {
    lead1: uuid(),
    lead2: uuid(),
    collab1: uuid(),
    collab2: uuid(),
    community1: uuid(),
    community2: uuid(),
  };

  await db.insert(users).values([
    {
      id: userIds.lead1,
      name: 'Jordan Chen',
      displayName: 'Jordan Chen',
      email: 'jordan@example.com',
      status: 'active',
    },
    {
      id: userIds.lead2,
      name: 'Sam Rivera',
      displayName: 'Sam Rivera',
      email: 'sam@example.com',
      status: 'active',
    },
    {
      id: userIds.collab1,
      name: 'Alex Kim',
      displayName: 'Alex Kim',
      email: 'alex@example.com',
      status: 'active',
    },
    {
      id: userIds.collab2,
      name: 'Morgan Taylor',
      displayName: 'Morgan Taylor',
      email: 'morgan@example.com',
      status: 'active',
    },
    {
      id: userIds.community1,
      name: 'Riley Green',
      displayName: 'Riley Green',
      email: 'riley@example.com',
      status: 'active',
    },
    {
      id: userIds.community2,
      name: 'Casey Wells',
      displayName: 'Casey Wells',
      email: 'casey@example.com',
      status: 'active',
    },
  ]);

  console.log('✓ Users');

  // 2. Cycles (April & May 2026 pilot)
  const cycleIds = {
    april: uuid(),
    may: uuid(),
  };

  await db.insert(cycles).values([
    {
      id: cycleIds.april,
      title: 'April 2026',
      slug: 'april-2026',
      startDate: new Date(date(2026, 4, 1)),
      endDate: new Date(date(2026, 4, 30)),
      status: 'completed',
      creativeDirection:
        'Exploring the boundary between physical and digital artifacts. A month of collaborative making, documentation, and community dialogue.',
      documentationUrl: 'https://example.com/april-2026-docs',
    },
    {
      id: cycleIds.may,
      title: 'May 2026',
      slug: 'may-2026',
      startDate: new Date(date(2026, 5, 1)),
      endDate: new Date(date(2026, 5, 31)),
      status: 'active',
      creativeDirection:
        'Sound, memory, and place. Creators investigate local archives and oral histories to produce new sonic and visual work.',
      documentationUrl: null,
    },
  ]);

  console.log('✓ Cycles');

  // 3. Cycle artists (lead + collaborators)
  await db.insert(cycleArtists).values([
    { id: uuid(), cycleId: cycleIds.april, userId: userIds.lead1, role: 'lead', order: 0 },
    { id: uuid(), cycleId: cycleIds.april, userId: userIds.collab1, role: 'collaborator', order: 1 },
    { id: uuid(), cycleId: cycleIds.april, userId: userIds.collab2, role: 'collaborator', order: 2 },
    { id: uuid(), cycleId: cycleIds.may, userId: userIds.lead2, role: 'lead', order: 0 },
    { id: uuid(), cycleId: cycleIds.may, userId: userIds.collab1, role: 'collaborator', order: 1 },
  ]);

  console.log('✓ Cycle creators');

  // 4. Celebration events
  const eventIds = {
    april: uuid(),
    may: uuid(),
  };

  await db.insert(celebrationEvents).values([
    {
      id: eventIds.april,
      cycleId: cycleIds.april,
      title: 'April 2026 — Salon & Showcase',
      description:
        'Join us for an evening of presentation, documentation, and conversation. Meet the creators, view the work, and celebrate the completion of the April cycle.',
      eventDate: new Date(date(2026, 4, 30)),
      startTime: '19:00',
      endTime: '21:30',
      location: 'Renaissance Studio',
      capacity: 25,
      ticketPrice: 20,
      imageUrl: null,
    },
    {
      id: eventIds.may,
      cycleId: cycleIds.may,
      title: 'May 2026 — Sound & Memory',
      description:
        'A listening party and exhibition. New sonic and visual work from the May cycle, with creator-led discussion.',
      eventDate: new Date(date(2026, 5, 28)),
      startTime: '19:00',
      endTime: '21:00',
      location: 'Renaissance Studio',
      capacity: 25,
      ticketPrice: 20,
      imageUrl: null,
    },
  ]);

  console.log('✓ Celebration events');

  // 5. Tickets (some reservations for April event)
  await db.insert(tickets).values([
    { id: uuid(), eventId: eventIds.april, userId: userIds.community1, status: 'reserved' },
    { id: uuid(), eventId: eventIds.april, userId: userIds.community2, status: 'reserved' },
    { id: uuid(), eventId: eventIds.may, userId: userIds.community1, status: 'reserved' },
  ]);

  console.log('✓ Tickets');

  // 6. Sponsors (creation partners)
  await db.insert(sponsors).values([
    {
      id: uuid(),
      name: 'Local Arts Council',
      websiteUrl: 'https://example.com/arts',
      cycleId: cycleIds.april,
      order: 0,
    },
    {
      id: uuid(),
      name: 'Community Foundation',
      websiteUrl: 'https://example.com/foundation',
      cycleId: cycleIds.may,
      order: 0,
    },
  ]);

  console.log('✓ Sponsors');

  console.log('\n✅ Seed complete.');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err);
  process.exit(1);
});
