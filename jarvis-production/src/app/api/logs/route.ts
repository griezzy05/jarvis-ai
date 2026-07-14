import { desc } from "drizzle-orm";
import { db } from "@/db";
import { jarvisLogs } from "@/db/schema";

const domains = ["CCNA", "Networking", "Loytex Closet", "FarmLink"];

export async function POST(request: Request) {
  const body = (await request.json()) as { domain?: string; summary?: string; hours?: number | null };
  const domain = body.domain?.trim();
  const summary = body.summary?.trim();
  const hours = body.hours;

  if (!domain || !domains.includes(domain) || !summary || summary.length > 800) {
    return Response.json({ error: "Please provide a valid area and a concise update." }, { status: 400 });
  }
  if (hours !== undefined && hours !== null && (!Number.isFinite(hours) || hours < 0 || hours > 24)) {
    return Response.json({ error: "Hours must be between 0 and 24." }, { status: 400 });
  }

  const [log] = await db
    .insert(jarvisLogs)
    .values({ domain, summary, hours: hours === null || hours === undefined ? null : String(hours) })
    .returning();

  return Response.json({
    log: { ...log, hours: log.hours ? Number(log.hours) : null, createdAt: log.createdAt.toISOString() },
  });
}

export async function GET() {
  const logs = await db.select().from(jarvisLogs).orderBy(desc(jarvisLogs.createdAt)).limit(5);
  return Response.json({
    logs: logs.map((log) => ({ ...log, hours: log.hours ? Number(log.hours) : null, createdAt: log.createdAt.toISOString() })),
  });
}
