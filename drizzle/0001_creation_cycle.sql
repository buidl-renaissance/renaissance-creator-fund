CREATE TABLE `cycles` (
	`id` text PRIMARY KEY NOT NULL,
	`title` text NOT NULL,
	`slug` text NOT NULL,
	`startDate` integer NOT NULL,
	`endDate` integer NOT NULL,
	`status` text DEFAULT 'draft' NOT NULL,
	`creativeDirection` text,
	`documentationUrl` text,
	`createdAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updatedAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `cycles_slug_unique` ON `cycles` (`slug`);--> statement-breakpoint
CREATE TABLE `cycle_artists` (
	`id` text PRIMARY KEY NOT NULL,
	`cycleId` text NOT NULL,
	`userId` text NOT NULL,
	`role` text NOT NULL,
	`order` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `celebration_events` (
	`id` text PRIMARY KEY NOT NULL,
	`cycleId` text NOT NULL,
	`title` text NOT NULL,
	`description` text,
	`eventDate` integer NOT NULL,
	`startTime` text,
	`endTime` text,
	`location` text,
	`capacity` integer NOT NULL,
	`ticketPrice` integer NOT NULL,
	`imageUrl` text,
	`createdAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL,
	`updatedAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`eventId` text NOT NULL,
	`userId` text NOT NULL,
	`status` text DEFAULT 'reserved' NOT NULL,
	`createdAt` integer DEFAULT (strftime('%s', 'now')) NOT NULL
);
--> statement-breakpoint
CREATE TABLE `sponsors` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`logoUrl` text,
	`websiteUrl` text,
	`cycleId` text,
	`order` integer DEFAULT 0 NOT NULL
);
