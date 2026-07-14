import Dashboard from "./dashboard";
import { getDashboardData } from "@/lib/jarvis";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const data = await getDashboardData();
  return <Dashboard initialData={data} />;
}
