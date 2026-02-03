import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/db/drizzle";
import { celebrationEvents, tickets } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { v4 as uuidv4 } from "uuid";
import { getUserById } from "@/db/user";

type PostResponseData = {
  success: boolean;
  message: string;
};

type DeleteResponseData = {
  success: boolean;
  message: string;
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
  res: NextApiResponse<PostResponseData | DeleteResponseData | ErrorResponse>
) {
  const eventId = req.query.id as string;
  if (!eventId) {
    return res.status(400).json({ error: "Event ID is required" });
  }

  const db = getDb();

  const eventRows = await db
    .select({ id: celebrationEvents.id, capacity: celebrationEvents.capacity })
    .from(celebrationEvents)
    .where(eq(celebrationEvents.id, eventId))
    .limit(1);

  if (eventRows.length === 0) {
    return res.status(404).json({ error: "Event not found" });
  }

  const event = eventRows[0];

  if (req.method === "POST") {
    try {
      const user = await getUserFromRequest(req);

      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const existingTickets = await db
        .select()
        .from(tickets)
        .where(
          and(
            eq(tickets.eventId, eventId),
            eq(tickets.userId, user.id)
          )
        );

      const activeTicket = existingTickets.find((t) => t.status !== "cancelled");
      if (activeTicket) {
        return res.status(400).json({
          error: "You already have a ticket reserved for this event",
        });
      }

      const allTickets = await db
        .select()
        .from(tickets)
        .where(eq(tickets.eventId, eventId));
      const ticketsSold = allTickets.filter((t) => t.status !== "cancelled").length;

      if (ticketsSold >= event.capacity) {
        return res.status(400).json({ error: "Event is sold out" });
      }

      const newTicket = {
        id: uuidv4(),
        eventId,
        userId: user.id,
        status: "reserved" as const,
      };

      await db.insert(tickets).values(newTicket);

      return res.status(201).json({
        success: true,
        message: "Ticket reserved successfully",
      });
    } catch (error) {
      console.error("Error reserving ticket:", error);
      return res.status(500).json({ error: "Failed to reserve ticket" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const user = await getUserFromRequest(req);

      if (!user) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const existingTickets = await db
        .select()
        .from(tickets)
        .where(
          and(
            eq(tickets.eventId, eventId),
            eq(tickets.userId, user.id)
          )
        );

      const activeTicket = existingTickets.find((t) => t.status !== "cancelled");
      if (!activeTicket) {
        return res.status(400).json({
          error: "You do not have a ticket for this event",
        });
      }

      await db
        .update(tickets)
        .set({ status: "cancelled" })
        .where(eq(tickets.id, activeTicket.id));

      return res.status(200).json({
        success: true,
        message: "Reservation cancelled",
      });
    } catch (error) {
      console.error("Error cancelling ticket:", error);
      return res.status(500).json({ error: "Failed to cancel reservation" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
