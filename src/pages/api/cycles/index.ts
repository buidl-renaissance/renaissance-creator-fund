import type { NextApiRequest, NextApiResponse } from "next";
import { getDb } from "@/db/drizzle";
import { cycles, cycleArtists, users } from "@/db/schema";
import { eq, desc, gte, lt, inArray, and } from "drizzle-orm";

type CycleWithLead = {
  id: string;
  title: string;
  slug: string;
  startDate: Date;
  endDate: Date;
  status: string;
  leadCreatorName: string | null;
};

type GetResponseData = {
  cycles: CycleWithLead[];
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
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const cyclesList = await db
      .select({
        id: cycles.id,
        title: cycles.title,
        slug: cycles.slug,
        startDate: cycles.startDate,
        endDate: cycles.endDate,
        status: cycles.status,
      })
      .from(cycles)
      .where(
        showPast
          ? lt(cycles.endDate, todayStart)
          : gte(cycles.endDate, todayStart)
      )
      .orderBy(showPast ? desc(cycles.endDate) : cycles.startDate);

    const cycleIds = cyclesList.map((c) => c.id);
    if (cycleIds.length === 0) {
      return res.status(200).json({
        cycles: cyclesList.map((c) => ({
          id: c.id,
          title: c.title,
          slug: c.slug,
          startDate: c.startDate,
          endDate: c.endDate,
          status: c.status,
          leadCreatorName: null,
        })),
      });
    }
    const leadArtists = await db
      .select({
        cycleId: cycleArtists.cycleId,
        displayName: users.displayName,
        username: users.username,
      })
      .from(cycleArtists)
      .innerJoin(users, eq(cycleArtists.userId, users.id))
      .where(
        and(inArray(cycleArtists.cycleId, cycleIds), eq(cycleArtists.role, "lead"))
      );

    const leadMap = new Map(
      leadArtists.map((a) => [
        a.cycleId,
        a.displayName || a.username || null,
      ])
    );

    const formattedCycles: CycleWithLead[] = cyclesList.map((c) => ({
      id: c.id,
      title: c.title,
      slug: c.slug,
      startDate: c.startDate,
      endDate: c.endDate,
      status: c.status,
      leadCreatorName: leadMap.get(c.id) || null,
    }));

    return res.status(200).json({ cycles: formattedCycles });
  } catch (error) {
    console.error("Error fetching cycles:", error);
    return res.status(500).json({ error: "Failed to fetch cycles" });
  }
}
