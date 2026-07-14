import { eq } from "drizzle-orm";
import { db } from "@/db";
import { jarvisAlerts } from "@/db/schema";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const alertId = Number(id);
  const body = (await request.json()) as { isResolved?: boolean };

  if (!Number.isInteger(alertId)) {
    return Response.json({ error: "Invalid alert id" }, { status: 400 });
  }

  const [alert] = await db
    .update(jarvisAlerts)
    .set({ isResolved: body.isResolved ?? true })
    .where(eq(jarvisAlerts.id, alertId))
    .returning();

  if (!alert) return Response.json({ error: "Alert not found" }, { status: 404 });
  return Response.json({ alert });
}
