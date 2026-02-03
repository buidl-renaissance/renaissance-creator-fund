import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/db/drizzle";
import {
  celebrationEvents,
  cycles,
  tickets,
} from "@/db/schema";
import { eq, desc, gte, lt, inArray } from "drizzle-orm";

type EventWithMeta = {
  id: string;
  title: string;
  description: string | null;
  eventDate: Date;
  startTime: string | null;
  endTime: string | null;
  location: string | null;
  capacity: number;
  ticketPrice: number;
  ticketsSold: number;
  imageUrl: string | null;
  cycleTitle: string | null;
};

type GetResponseData = {
  events: EventWithMeta[];
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetResponseData | ErrorResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const db = getDb();
    const showPast = req.query.past === "true";
    const cycleId = req.query.cycleId as string | undefined;
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const eventsList = await db
      .select({
        id: celebrationEvents.id,
        title: celebrationEvents.title,
        description: celebrationEvents.description,
        eventDate: celebrationEvents.eventDate,
        startTime: celebrationEvents.startTime,
        endTime: celebrationEvents.endTime,
        location: celebrationEvents.location,
        capacity: celebrationEvents.capacity,
        ticketPrice: celebrationEvents.ticketPrice,
        imageUrl: celebrationEvents.imageUrl,
        cycleId: celebrationEvents.cycleId,
        cycleTitle: cycles.title,
      })
      .from(celebrationEvents)
      .leftJoin(cycles, eq(celebrationEvents.cycleId, cycles.id))
      .where(
        showPast
          ? lt(celebrationEvents.eventDate, todayStart)
          : gte(celebrationEvents.eventDate, todayStart)
      )
      .orderBy(
        showPast
          ? desc(celebrationEvents.eventDate)
          : celebrationEvents.eventDate
      );

    const filteredEvents = cycleId
      ? eventsList.filter((e) => e.cycleId === cycleId)
      : eventsList;

    if (filteredEvents.length === 0) {
      return res.status(200).json({ events: [] });
    }

    const eventIds = filteredEvents.map((e) => e.id);
    const allTickets = await db
      .select({
        eventId: tickets.eventId,
        status: tickets.status,
      })
      .from(tickets)
      .where(inArray(tickets.eventId, eventIds));

    const ticketCountMap = new Map<string, number>();
    for (const t of allTickets) {
      if (t.status !== "cancelled") {
        ticketCountMap.set(t.eventId, (ticketCountMap.get(t.eventId) || 0) + 1);
      }
    }

    const formattedEvents: EventWithMeta[] = filteredEvents.map((e) => ({
      id: e.id,
      title: e.title,
      description: e.description,
      eventDate: e.eventDate,
      startTime: e.startTime,
      endTime: e.endTime,
      location: e.location,
      capacity: e.capacity,
      ticketPrice: e.ticketPrice,
      ticketsSold: ticketCountMap.get(e.id) || 0,
      imageUrl: e.imageUrl,
      cycleTitle: e.cycleTitle,
    }));

    return res.status(200).json({ events: formattedEvents });
  } catch (error) {
    console.error("Error fetching events:", error);
    return res.status(500).json({ error: "Failed to fetch events" });
  }
}
