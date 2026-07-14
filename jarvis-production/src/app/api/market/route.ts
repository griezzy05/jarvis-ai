import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { marketSnapshots } from "@/db/schema";
import { ensureJarvisSeeded } from "@/lib/jarvis";

const categories = ["livestock", "agritech", "salaries"];

export async function GET(request: Request) {
  await ensureJarvisSeeded();
  const category = new URL(request.url).searchParams.get("category") ?? "livestock";
  if (!categories.includes(category)) {
    return Response.json({ error: "Unknown market category" }, { status: 400 });
  }

  const items = await db
    .select()
    .from(marketSnapshots)
    .where(eq(marketSnapshots.category, category))
    .orderBy(asc(marketSnapshots.id));

  return Response.json({
    category,
    updatedAt: items[0]?.updatedAt.toISOString() ?? null,
    items: items.map((item) => ({ ...item, updatedAt: item.updatedAt.toISOString() })),
  });
}
