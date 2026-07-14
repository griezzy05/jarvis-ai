import { getDailyBriefing } from "@/lib/jarvis";

export async function GET() {
  return Response.json(await getDailyBriefing());
}
