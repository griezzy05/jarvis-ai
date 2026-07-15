import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import {
  jarvisActions,
  jarvisAlerts,
  jarvisLogs,
  jarvisMetrics,
  marketSnapshots,
} from "@/db/schema";

const initialMetrics = [
  {
    area: "CCNA",
    metricKey: "ccna_completion",
    label: "CCNA completion",
    value: "68",
    target: "100",
    unit: "%",
    trend: 6,
    status: "on_track",
  },
  {
    area: "CCNA",
    metricKey: "study_hours_week",
    label: "Study hours this week",
    value: "3",
    target: "5",
    unit: " hrs",
    trend: -2,
    status: "watch",
  },
  {
    area: "Loytex Closet",
    metricKey: "loytex_revenue",
    label: "Loytex revenue",
    value: "1200",
    target: "1000",
    unit: " KSh",
    trend: 20,
    status: "on_track",
  },
  {
    area: "FarmLink",
    metricKey: "farmlink_signups",
    label: "FarmLink sign-ups",
    value: "14",
    target: "30",
    unit: " users",
    trend: 0,
    status: "watch",
  },
  {
    area: "Networking",
    metricKey: "networking_tasks",
    label: "Networking tasks",
    value: "2",
    target: "3",
    unit: " active",
    trend: 1,
    status: "on_track",
  },
  {
    area: "FarmLink",
    metricKey: "farmlink_transactions",
    label: "Weekly transactions",
    value: "3",
    target: "8",
    unit: " orders",
    trend: 1,
    status: "watch",
  },
];

const initialAlerts = [
  {
    domain: "Loytex Closet",
    severity: "yellow",
    title: "Monthly maintenance is overdue",
    description: "SSL, WhatsApp integration, and analytics review are 8 days overdue.",
  },
  {
    domain: "FarmLink",
    severity: "yellow",
    title: "Sign-up momentum has stalled",
    description: "No new pilot users recorded for 2 days. Review field messaging before the 3-day red threshold.",
  },
  {
    domain: "CCNA",
    severity: "yellow",
    title: "Study time below weekly target",
    description: "3 of 5 target study hours are logged. Two focused hours are needed before the weekly review.",
  },
];

const initialActions = [
  {
    domain: "Loytex Closet",
    title: "Run monthly maintenance",
    detail: "Test WhatsApp notifications, refresh the catalog, verify SSL, and review analytics.",
    priority: "high",
    dueLabel: "Due this weekend",
  },
  {
    domain: "FarmLink",
    title: "Refresh pilot acquisition message",
    detail: "Create one farmer-first WhatsApp message and test it with the Kiambu pilot audience.",
    priority: "high",
    dueLabel: "Today",
  },
  {
    domain: "CCNA",
    title: "Complete routing configuration lab",
    detail: "Schedule a 2-hour routing lab, then note the ACL points that still need revision.",
    priority: "medium",
    dueLabel: "This week",
  },
  {
    domain: "Networking",
    title: "Document GRE tunnel blocker",
    detail: "Write the current configuration and the exact failure point before the next Avios sync.",
    priority: "medium",
    dueLabel: "Next sync",
  },
];

const initialMarket = [
  {
    category: "livestock",
    item: "Goats · Nairobi / Kiambu",
    value: "KSh 7,500–12,000",
    change: "Seasonal range",
    source: "Jarvis research watchlist",
    note: "Indicative live-animal range. Confirm with the destination market before setting a price.",
  },
  {
    category: "livestock",
    item: "Cattle · Nairobi / Kiambu",
    value: "KSh 45,000–85,000",
    change: "Quality dependent",
    source: "Jarvis research watchlist",
    note: "Indicative farm-gate range; weight, breed, and market-day demand materially affect price.",
  },
  {
    category: "agritech",
    item: "East Africa agri-tech signal",
    value: "Input + market access",
    change: "High farmer utility",
    source: "Jarvis research watchlist",
    note: "Prioritise trust, buyer liquidity, and logistics visibility before non-core features.",
  },
  {
    category: "salaries",
    item: "CCNA / network support · Kenya",
    value: "KSh 45k–120k/mo",
    change: "Experience-led",
    source: "Jarvis research watchlist",
    note: "Indicative range only. Certifications, troubleshooting depth, and employer type drive offers.",
  },
  {
    category: "salaries",
    item: "Network engineer · UK",
    value: "£32k–55k/yr",
    change: "Role dependent",
    source: "Jarvis research watchlist",
    note: "Indicative range. Compare roles by location, clearance requirements, and cloud networking exposure.",
  },
];

// MOCK DATA MODE - Database connection will be fixed later
// Using hardcoded sample data for immediate deployment

export async function ensureJarvisSeeded() {
  // Mock function - returns immediately
  return Promise.resolve();
}

export async function getDashboardData() {
  // Return mock data without database queries
  return {
    metrics: initialMetrics.map((metric) => ({
      id: Math.random(),
      ...metric,
      value: Number(metric.value),
      target: metric.target ? Number(metric.target) : null,
      createdAt: new Date(),
      updatedAt: new Date().toISOString(),
    })),
    alerts: initialAlerts.map((alert, idx) => ({ 
      id: idx + 1,
      ...alert, 
      isResolved: false,
      createdAt: new Date().toISOString() 
    })),
    actions: initialActions.map((action, idx) => ({ 
      id: idx + 1,
      ...action,
      isDone: false, 
      createdAt: new Date().toISOString() 
    })),
    logs: [
      {
        id: 1,
        domain: "CCNA",
        summary: "Routing is 70% complete. Keep subnetting drills short and daily; ACL configuration remains the main weak area.",
        hours: 3,
        createdAt: new Date().toISOString(),
      },
      {
        id: 2,
        domain: "FarmLink",
        summary: "Pilot has 14 sign-ups and 3 weekly transactions. Feedback is positive on listing speed and ease of use.",
        hours: null,
        createdAt: new Date().toISOString(),
      },
    ],
    market: initialMarket.map((snapshot, idx) => ({ 
      id: idx + 1,
      ...snapshot, 
      updatedAt: new Date().toISOString() 
    })),
  };
}

export async function getDailyBriefing() {
  const dashboard = await getDashboardData();
  const metric = (key: string) => dashboard.metrics.find((item) => item.metricKey === key);
  const ccna = metric("ccna_completion");
  const hours = metric("study_hours_week");
  const revenue = metric("loytex_revenue");
  const signups = metric("farmlink_signups");
  const redAlerts = dashboard.alerts.filter((alert) => alert.severity === "red").length;

  return {
    headline:
      redAlerts > 0
        ? `${redAlerts} red alert${redAlerts === 1 ? "" : "s"} needs your attention.`
        : "No red alerts. Keep the momentum focused.",
    summary: `CCNA is ${ccna?.value ?? 0}% complete with ${hours?.value ?? 0}/${hours?.target ?? 5} study hours logged. Loytex is at KSh ${revenue?.value ?? 0} this month. FarmLink has ${signups?.value ?? 0}/${signups?.target ?? 30} pilot sign-ups.`,
    priorities: dashboard.actions.filter((action) => !action.isDone).slice(0, 3).map((action) => action.title),
  };
}
