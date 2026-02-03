import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/db/drizzle";
import {
  celebrationEvents,
  cycles,
  cycleArtists,
  tickets,
  users,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { getUserById } from "@/db/user";

type Creator = {
  id: string;
  displayName: string | null;
  username: string | null;
  pfpUrl: string | null;
  role: string;
};

type EventDetail = {
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
  cycle: { id: string; title: string } | null;
  creators: Creator[];
  userHasTicket: boolean;
};

type GetResponseData = {
  event: EventDetail;
};

type ErrorResponse = {
  error: string;
};

async function getUserFromRequest(req: NextApiRequest) {
  const cookies = req.headers.cookie || "";
  const sessionMatch = cookies.match(/user_session=([^;]+)/);
  if (sessionMatch?.[1]) {
    return await getUserById(sessionMatch[1]);
  }
  if (req.query.userId && typeof req.query.userId === "string") {
    return await getUserById(req.query.userId);
  }
  return null;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetResponseData | ErrorResponse>
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json({ error: "Event ID is required" });
  }

  try {
    const db = getDb();
    const currentUser = await getUserFromRequest(req);

    const eventRows = await db
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
      .where(eq(celebrationEvents.id, id))
      .limit(1);

    if (eventRows.length === 0) {
      return res.status(404).json({ error: "Event not found" });
    }

    const ev = eventRows[0];

    const ticketRows = await db
      .select()
      .from(tickets)
      .where(eq(tickets.eventId, id));
    const ticketsSold = ticketRows.filter((t) => t.status !== "cancelled").length;
    const userHasTicket =
      !!currentUser &&
      ticketRows.some(
        (t) => t.userId === currentUser.id && t.status !== "cancelled"
      );

    const cycleArtistsRows = await db
      .select({
        id: cycleArtists.id,
        role: cycleArtists.role,
        displayName: users.displayName,
        username: users.username,
        pfpUrl: users.pfpUrl,
      })
      .from(cycleArtists)
      .innerJoin(users, eq(cycleArtists.userId, users.id))
      .where(eq(cycleArtists.cycleId, ev.cycleId));

    const creators: Creator[] = cycleArtistsRows.map((a) => ({
      id: a.id,
      displayName: a.displayName,
      username: a.username,
      pfpUrl: a.pfpUrl,
      role: a.role,
    }));

    const eventDetail: EventDetail = {
      id: ev.id,
      title: ev.title,
      description: ev.description,
      eventDate: ev.eventDate,
      startTime: ev.startTime,
      endTime: ev.endTime,
      location: ev.location,
      capacity: ev.capacity,
      ticketPrice: ev.ticketPrice,
      ticketsSold,
      imageUrl: ev.imageUrl,
      cycle: ev.cycleId
        ? { id: ev.cycleId, title: ev.cycleTitle || "Unknown" }
        : null,
      creators,
      userHasTicket,
    };

    return res.status(200).json({ event: eventDetail });
  } catch (error) {
    console.error("Error fetching event:", error);
    return res.status(500).json({ error: "Failed to fetch event" });
  }
}
