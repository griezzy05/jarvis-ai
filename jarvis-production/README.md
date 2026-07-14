# 🤖 JARVIS - Personal Operations AI System

**Griezzy's intelligent operations manager for CCNA study, Loytex Closet, FarmLink, and networking projects.**

Built with Next.js 16 + PostgreSQL + React 19

---

## **What is Jarvis?**

Jarvis is your autonomous operations dashboard that:

✅ **Monitors** - Tracks CCNA progress, Loytex revenue, FarmLink growth, networking tasks  
✅ **Alerts** - Flags issues in real-time (RED/YELLOW severity levels)  
✅ **Reports** - Generates daily briefings with actionable summaries  
✅ **Acts** - Manages your action queue by priority  
✅ **Researches** - Pulls market data (livestock prices, agri-tech trends, salary benchmarks)  

---

## **System Overview**

```
┌─────────────────────────────────────────────────────────────┐
│                   JARVIS DASHBOARD (Web UI)                 │
│  ┌─────────────┐  ┌──────────┐  ┌─────────┐  ┌────────────┐ │
│  │  KPI Cards  │  │   Alerts │  │Progress │  │  Actions   │ │
│  │  (Metrics)  │  │ (Red/Ylw)│  │  Bars   │  │   Queue    │ │
│  └─────────────┘  └──────────┘  └─────────┘  └────────────┘ │
└─────────────────────────────────────────────────────────────┘
                            ↓
          ┌──────────────────────────────────────┐
          │     Next.js API Layer (TypeScript)   │
          ├──────────────────────────────────────┤
          │ /api/briefing  - Daily summary       │
          │ /api/alerts    - Alert management    │
          │ /api/actions   - Task tracking       │
          │ /api/market    - Market data         │
          │ /api/health    - System status       │
          │ /api/logs      - Activity history    │
          └──────────────────────────────────────┘
                            ↓
          ┌──────────────────────────────────────┐
          │   PostgreSQL Database (Drizzle ORM)  │
          ├──────────────────────────────────────┤
          │ • jarvis_metrics  - KPIs & targets   │
          │ • jarvis_alerts   - Alert log        │
          │ • jarvis_actions  - Task list        │
          │ • market_snapshot - Market data      │
          │ • jarvis_logs     - Activity log     │
          └──────────────────────────────────────┘
```

---

## **Core Features**

### **1. Metrics Dashboard**

Tracks 6 key metrics with real-time status:

| Area | Metric | Current | Target | Status |
|------|--------|---------|--------|--------|
| CCNA | Completion | 68% | 100% | On track |
| CCNA | Study hours/week | 3 hrs | 5 hrs | ⚠️ Watch |
| Loytex | Revenue/month | KSh 1,200 | KSh 1,000 | ✅ On track |
| FarmLink | Sign-ups (pilot) | 14 | 30 | ⚠️ Watch |
| Networking | Active tasks | 2 | 3 | ✅ On track |
| FarmLink | Weekly transactions | 3 | 8 | ⚠️ Watch |

**Status codes:**
- ✅ **on_track** - Metric within target
- ⚠️ **watch** - Metric below target (YELLOW alert)
- 🔴 **critical** - Metric severely off track (RED alert)

### **2. Alert System**

Two-tier alerting:

**🔴 RED ALERTS** (Immediate action needed)
- Loytex website downtime > 2 hours
- Revenue drop > 20% from baseline
- FarmLink sign-up stall > 3 days
- Networking deadline missed

**⚠️ YELLOW ALERTS** (Monitor & plan)
- Revenue drop 10-20% from baseline
- Study hours < 5/week
- Maintenance tasks overdue > 7 days
- Support tickets backlog > 5

### **3. Action Queue**

Prioritized task list with tracking:

```
Priority | Domain | Action | Status
---------|--------|--------|-------
HIGH    | Loytex | Run monthly maintenance | Pending
HIGH    | FarmLink | Investigate sign-up drop | In Progress
MEDIUM  | CCNA | Schedule study block | Pending
MEDIUM  | Avios | Complete lab work | Done
LOW     | General | Update documentation | Pending
```

### **4. Daily Briefing API**

**GET `/api/briefing`** returns:

```json
{
  "timestamp": "2024-07-13T09:00:00Z",
  "summary": "3 alerts to address. 2 study hours needed to hit weekly target.",
  "kpis": [...],
  "redAlerts": [...],
  "yellowAlerts": [...],
  "actionQueue": [...],
  "focusArea": "FarmLink user acquisition"
}
```

### **5. Market Data**

On-demand market intelligence:

- **Livestock Prices** (Kiambu/Nairobi) - cattle, goats, sheep
- **Agri-Tech Trends** - funding, startups, regulations
- **Tech Salaries** - Kenya vs UK IT/Cisco professional benchmarks

---

## **Quick Start**

### **1. Install & Setup (2 minutes)**

```bash
# Clone or download this project
cd jarvis-production

# Run setup script
./setup.sh

# Or manual setup:
npm install
```

### **2. Configure Database**

Edit `.env.local`:

```bash
# LOCAL (for testing)
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/jarvis_db"

# OR CLOUD (Recommended)
DATABASE_URL="postgresql://user:password@host:5432/db_name"
```

### **3. Initialize Database**

```bash
# Apply schema
npx drizzle-kit push:pg

# Check status
npm run db:status
```

### **4. Run Locally**

```bash
npm run dev
```

Open **http://localhost:3000** ✅

---

## **Project Structure**

```
jarvis-production/
├── src/
│   ├── app/
│   │   ├── page.tsx              # Home page
│   │   ├── dashboard.tsx          # Main dashboard component
│   │   ├── layout.tsx             # Layout wrapper
│   │   ├── globals.css            # Tailwind styles
│   │   └── api/
│   │       ├── briefing/          # Daily summary
│   │       ├── alerts/            # Alert management
│   │       ├── actions/           # Task queue
│   │       ├── market/            # Market data
│   │       ├── logs/              # Activity logging
│   │       └── health/            # System health
│   ├── db/
│   │   ├── index.ts               # Database connection
│   │   └── schema.ts              # Drizzle ORM schema
│   └── lib/
│       └── jarvis.ts              # Core logic & functions
├── .env.local                     # Environment config
├── drizzle.config.json            # ORM config
├── next.config.ts                 # Next.js config
├── tsconfig.json                  # TypeScript config
├── package.json                   # Dependencies
├── setup.sh                        # Setup script
├── DEPLOYMENT.md                  # Deployment guide
└── README.md                       # This file
```

---

## **API Endpoints**

### **Health & Status**

```bash
GET /api/health
# Response: { status: "healthy", timestamp: "..." }

GET /api/briefing
# Response: Daily summary with alerts, metrics, actions
```

### **Metrics Management**

```bash
GET /api/logs
# Get activity log by domain

POST /api/logs
# Create new log entry: { domain, summary, hours }
```

### **Alerts**

```bash
GET /api/alerts
# Get all alerts (paginated)

PATCH /api/alerts/[id]
# Resolve alert: { isResolved: true }
```

### **Actions Queue**

```bash
GET /api/actions
# Get tasks by status/priority

POST /api/actions
# Create action: { domain, title, detail, priority, dueLabel }

PATCH /api/actions/[id]
# Mark done: { isDone: true }
```

### **Market Data**

```bash
GET /api/market
# Get latest market snapshots (livestock, agri-tech, salaries)
```

---

## **Database Schema**

### **jarvis_metrics**
Tracks KPIs with targets and trends.

```sql
id | area | metric_key | label | value | target | unit | trend | status | updated_at
```

### **jarvis_alerts**
Alert log with severity levels.

```sql
id | domain | severity | title | description | is_resolved | created_at
```

### **jarvis_actions**
Task queue with priority.

```sql
id | domain | title | detail | priority | is_done | due_label | created_at
```

### **market_snapshots**
Market data history.

```sql
id | category | item | value | change | source | note | updated_at
```

### **jarvis_logs**
Activity log by domain.

```sql
id | domain | summary | hours | created_at
```

---

## **Configuration**

### **Metrics Baseline**

Edit `/src/lib/jarvis.ts` to update metric thresholds:

```typescript
const initialMetrics = [
  {
    area: "CCNA",
    metricKey: "ccna_completion",
    value: "68",      // Current value
    target: "100",    // Target value
    trend: 6,         // Week-over-week change
    status: "on_track" // on_track | watch | critical
  },
  // ... more metrics
];
```

### **Alert Rules**

Update `initialAlerts` to customize alert triggers:

```typescript
const initialAlerts = [
  {
    domain: "FarmLink",
    severity: "yellow",  // red | yellow
    title: "Sign-up momentum has stalled",
    description: "No new pilot users for 2 days..."
  },
  // ... more alerts
];
```

### **Action Templates**

Pre-populate action queue in `initialActions`:

```typescript
const initialActions = [
  {
    domain: "Loytex Closet",
    title: "Run monthly maintenance",
    priority: "high",    // high | medium | low
    detail: "SSL cert, WhatsApp, analytics review"
  },
  // ... more actions
];
```

---

## **Deployment**

### **Fastest (15 minutes):**

1. **Push to GitHub** (if not already)
2. **Deploy on Vercel** - https://vercel.com/new
3. **Add Supabase database** - https://supabase.com
4. **Connect in Vercel settings** (DATABASE_URL env var)
5. **Done** ✅

See **DEPLOYMENT.md** for all platform options.

---

## **Customization**

### **Add New Metric**

1. Update database schema in `src/db/schema.ts`
2. Add to `initialMetrics` in `src/lib/jarvis.ts`
3. Redeploy: `npm run build && npm start`

### **Add New Alert Type**

1. Add to `initialAlerts` with your condition
2. Update dashboard to show new alert class
3. Test in `/api/briefing`

### **Integrate with External APIs**

Examples in `src/app/api/market/route.ts`:

```typescript
// Add livestock price API call
const livestockPrices = await fetch('https://livestock-api.com/prices')
  .then(r => r.json());

// Add agri-tech news feed
const trends = await fetch('https://api.agrinews.com/trending')
  .then(r => r.json());
```

---

## **Monitoring & Maintenance**

### **Check Health**

```bash
curl http://localhost:3000/api/health
```

### **View Logs**

```bash
# Local development
npm run dev  # Logs in terminal

# Production (Vercel/Railway/Render)
# Check dashboard logs section
```

### **Database Backup**

```bash
# Export data
pg_dump $DATABASE_URL > jarvis_backup.sql

# Import data
psql $DATABASE_URL < jarvis_backup.sql
```

---

## **Troubleshooting**

### **Dashboard shows "Error loading metrics"**

1. Check `/api/health` endpoint
2. Verify `DATABASE_URL` is correct
3. Run migrations: `npx drizzle-kit push:pg`
4. Check browser console for specific error

### **Database connection fails**

```bash
# Test connection
psql $DATABASE_URL

# If that fails:
# - Verify URL syntax: postgresql://user:pass@host:5432/db
# - Check IP allowlist (if cloud database)
# - Verify credentials are correct
```

### **Build fails**

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

---

## **Next Steps**

1. ✅ **Deploy to production** (see DEPLOYMENT.md)
2. 📊 **Update your real metrics** (CCNA hours, Loytex orders, FarmLink sign-ups)
3. 🔔 **Set up notifications** (email/Slack alerts)
4. 📈 **Monitor daily** (visit dashboard each morning)
5. 🔄 **Iterate** (add new metrics, adjust thresholds)

---

## **Support & Resources**

- **Next.js Docs:** https://nextjs.org/docs
- **Drizzle ORM:** https://orm.drizzle.team
- **PostgreSQL:** https://www.postgresql.org/docs
- **Tailwind CSS:** https://tailwindcss.com

---

## **License**

Personal use - Griezzy's Operations System

---

**Made for Nairobi. Built to scale. Designed for action.** 🚀
