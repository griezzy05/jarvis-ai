import { eq } from "drizzle-orm";
import { db } from "@/db";
import { jarvisActions } from "@/db/schema";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const actionId = Number(id);
  const body = (await request.json()) as { isDone?: boolean };

  if (!Number.isInteger(actionId)) {
    return Response.json({ error: "Invalid action id" }, { status: 400 });
  }

  const [action] = await db
    .update(jarvisActions)
    .set({ isDone: body.isDone ?? true })
    .where(eq(jarvisActions.id, actionId))
    .returning();

  if (!action) return Response.json({ error: "Action not found" }, { status: 404 });
  return Response.json({ action });
}
