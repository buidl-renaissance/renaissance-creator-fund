import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import { sql } from 'drizzle-orm';

// User roles
export type UserRole = 'user' | 'organizer' | 'admin';

// User status enum values
export const USER_STATUSES = ['active', 'inactive', 'banned'] as const;
export type UserStatus = typeof USER_STATUSES[number];

// Users table
export const users = sqliteTable('users', {
  id: text('id').primaryKey(),
  renaissanceId: text('renaissanceId').unique(), // Renaissance app user ID
  phone: text('phone').unique(), // Primary login method
  email: text('email'), // Optional
  username: text('username'),
  name: text('name'), // Display name
  pfpUrl: text('pfpUrl'), // Profile picture URL
  displayName: text('displayName'), // App-specific name (editable)
  profilePicture: text('profilePicture'), // App-specific profile picture (editable)
  accountAddress: text('accountAddress'), // Wallet address
  pinHash: text('pinHash'), // bcrypt hash of 4-digit PIN
  failedPinAttempts: integer('failedPinAttempts').default(0), // Failed PIN attempts counter
  lockedAt: integer('lockedAt', { mode: 'timestamp' }), // Timestamp when account was locked
  status: text('status').$type<UserStatus>().default('active'), // User status: active, inactive, banned
  role: text('role').$type<UserRole>().default('user').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Creation Cycle status
export const CYCLE_STATUSES = ['draft', 'active', 'completed'] as const;
export type CycleStatus = (typeof CYCLE_STATUSES)[number];

// Artist role in a cycle
export const CYCLE_ARTIST_ROLES = ['lead', 'collaborator'] as const;
export type CycleArtistRole = (typeof CYCLE_ARTIST_ROLES)[number];

// Ticket status
export const TICKET_STATUSES = ['reserved', 'confirmed', 'cancelled'] as const;
export type TicketStatus = (typeof TICKET_STATUSES)[number];

// Cycles table - month-long creation cycles
export const cycles = sqliteTable('cycles', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  slug: text('slug').notNull().unique(),
  startDate: integer('startDate', { mode: 'timestamp' }).notNull(),
  endDate: integer('endDate', { mode: 'timestamp' }).notNull(),
  status: text('status').$type<CycleStatus>().default('draft').notNull(),
  creativeDirection: text('creativeDirection'),
  documentationUrl: text('documentationUrl'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Cycle artists - lead and collaborators for each cycle
export const cycleArtists = sqliteTable('cycle_artists', {
  id: text('id').primaryKey(),
  cycleId: text('cycleId').notNull(),
  userId: text('userId').notNull(),
  role: text('role').$type<CycleArtistRole>().notNull(),
  order: integer('order').default(0).notNull(),
});

// Celebration events - live ticketed events at end of each cycle
export const celebrationEvents = sqliteTable('celebration_events', {
  id: text('id').primaryKey(),
  cycleId: text('cycleId').notNull(),
  title: text('title').notNull(),
  description: text('description'),
  eventDate: integer('eventDate', { mode: 'timestamp' }).notNull(),
  startTime: text('startTime'),
  endTime: text('endTime'),
  location: text('location'),
  capacity: integer('capacity').notNull(),
  ticketPrice: integer('ticketPrice').notNull(),
  imageUrl: text('imageUrl'),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
  updatedAt: integer('updatedAt', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Tickets - reservations for celebration events
export const tickets = sqliteTable('tickets', {
  id: text('id').primaryKey(),
  eventId: text('eventId').notNull(),
  userId: text('userId').notNull(),
  status: text('status').$type<TicketStatus>().default('reserved').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).default(sql`(strftime('%s', 'now'))`).notNull(),
});

// Sponsors - cycle or program sponsors
export const sponsors = sqliteTable('sponsors', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  logoUrl: text('logoUrl'),
  websiteUrl: text('websiteUrl'),
  cycleId: text('cycleId'),
  order: integer('order').default(0).notNull(),
});
