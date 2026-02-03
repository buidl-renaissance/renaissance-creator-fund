import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/db/drizzle";
import {
  cycles,
  cycleArtists,
  celebrationEvents,
  tickets,
  users,
} from "@/db/schema";
import { eq } from "drizzle-orm";

type Creator = {
  id: string;
  userId: string;
  role: string;
  order: number;
  displayName: string | null;
  username: string | null;
  pfpUrl: string | null;
};

type CycleDetail = {
  id: string;
  title: string;
  slug: string;
  startDate: Date;
  endDate: Date;
  status: string;
  creativeDirection: string | null;
  documentationUrl: string | null;
  creators: Creator[];
  celebrationEvent: {
    id: string;
    title: string;
    eventDate: Date;
    ticketPrice: number;
    capacity: number;
    ticketsSold: number;
  } | null;
};

type GetResponseData = {
  cycle: CycleDetail;
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

  const id = req.query.id as string;
  if (!id) {
    return res.status(400).json({ error: "Cycle ID is required" });
  }

  try {
    const db = getDb();

    const cycleRows = await db
      .select()
      .from(cycles)
      .where(eq(cycles.id, id))
      .limit(1);

    if (cycleRows.length === 0) {
      return res.status(404).json({ error: "Cycle not found" });
    }

    const cycle = cycleRows[0];

    const artistRows = await db
      .select({
        id: cycleArtists.id,
        userId: cycleArtists.userId,
        role: cycleArtists.role,
        order: cycleArtists.order,
        displayName: users.displayName,
        username: users.username,
        pfpUrl: users.pfpUrl,
      })
      .from(cycleArtists)
      .innerJoin(users, eq(cycleArtists.userId, users.id))
      .where(eq(cycleArtists.cycleId, id))
      .orderBy(cycleArtists.order);

    const creators: Creator[] = artistRows.map((a) => ({
      id: a.id,
      userId: a.userId,
      role: a.role,
      order: a.order,
      displayName: a.displayName,
      username: a.username,
      pfpUrl: a.pfpUrl,
    }));

    const eventRows = await db
      .select()
      .from(celebrationEvents)
      .where(eq(celebrationEvents.cycleId, id))
      .limit(1);

    let celebrationEvent: CycleDetail["celebrationEvent"] = null;

    if (eventRows.length > 0) {
      const ev = eventRows[0];
      const ticketCountResult = await db
        .select()
        .from(tickets)
        .where(eq(tickets.eventId, ev.id));
      const ticketsSold = ticketCountResult.filter(
        (t) => t.status !== "cancelled"
      ).length;

      celebrationEvent = {
        id: ev.id,
        title: ev.title,
        eventDate: ev.eventDate,
        ticketPrice: ev.ticketPrice,
        capacity: ev.capacity,
        ticketsSold,
      };
    }

    const cycleDetail: CycleDetail = {
      id: cycle.id,
      title: cycle.title,
      slug: cycle.slug,
      startDate: cycle.startDate,
      endDate: cycle.endDate,
      status: cycle.status,
      creativeDirection: cycle.creativeDirection,
      documentationUrl: cycle.documentationUrl,
      creators,
      celebrationEvent,
    };

    return res.status(200).json({ cycle: cycleDetail });
  } catch (error) {
    console.error("Error fetching cycle:", error);
    return res.status(500).json({ error: "Failed to fetch cycle" });
  }
}
