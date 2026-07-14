# 📋 JARVIS QUICK REFERENCE

**Commands, endpoints, and common tasks for daily use**

---

## **LOCAL DEVELOPMENT**

### **Start Jarvis**
```bash
npm run dev
# Open http://localhost:3000
```

### **Build for Production**
```bash
npm run build
npm start
```

### **Database Migrations**
```bash
# Push schema to database
npx drizzle-kit push:pg

# Generate migration files
npx drizzle-kit generate:pg

# Check status
npm run db:status
```

### **Linting & Type Checking**
```bash
npm run lint
npm run typecheck
```

---

## **API ENDPOINTS**

All endpoints return JSON. Use with `curl` or your frontend:

### **GET /api/health**
Check if system is running.
```bash
curl http://localhost:3000/api/health
# { "status": "healthy" }
```

### **GET /api/briefing**
Daily summary with alerts, metrics, actions.
```bash
curl http://localhost:3000/api/briefing
# Returns: summary, kpis, alerts, actionQueue, focusArea
```

### **GET /api/logs?domain=CCNA&limit=10**
Get activity log for a domain.
```bash
curl "http://localhost:3000/api/logs?domain=CCNA&limit=10"
# Returns array of log entries
```

### **POST /api/logs**
Create a new activity log.
```bash
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "CCNA",
    "summary": "Completed Routing module",
    "hours": 2.5
  }'
```

### **GET /api/alerts**
Get all active alerts.
```bash
curl "http://localhost:3000/api/alerts?severity=red"
# Returns: alert list with domain, severity, title, description
```

### **PATCH /api/alerts/[id]**
Mark alert as resolved.
```bash
curl -X PATCH http://localhost:3000/api/alerts/5 \
  -H "Content-Type: application/json" \
  -d '{ "isResolved": true }'
```

### **GET /api/actions**
Get action queue.
```bash
curl "http://localhost:3000/api/actions?priority=high"
# Returns: task list with domain, title, priority, status
```

### **POST /api/actions**
Create new action.
```bash
curl -X POST http://localhost:3000/api/actions \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "FarmLink",
    "title": "Fix user registration flow",
    "detail": "Users reporting email verification delays",
    "priority": "high",
    "dueLabel": "By Friday"
  }'
```

### **PATCH /api/actions/[id]**
Mark action as done.
```bash
curl -X PATCH http://localhost:3000/api/actions/3 \
  -H "Content-Type: application/json" \
  -d '{ "isDone": true }'
```

### **GET /api/market**
Get latest market data.
```bash
curl http://localhost:3000/api/market
# Returns: livestock prices, agri-tech trends, salary benchmarks
```

---

## **UPDATING METRICS**

### **Method 1: Edit Source Code (Deploy Required)**

Edit `/src/lib/jarvis.ts`:

```typescript
const initialMetrics = [
  {
    area: "CCNA",
    metricKey: "ccna_completion",
    label: "CCNA completion",
    value: "72",        // ← Update this
    target: "100",
    unit: "%",
    trend: 4,           // ← Week-over-week change
    status: "on_track"
  },
  // ... update others
];
```

Then deploy:
```bash
npm run build
git push  # If using GitHub
# Vercel auto-redeploys on push
```

### **Method 2: API-Based (Programmatic)**

Use POST to `/api/logs` to create timestamped activity:

```bash
# Log CCNA study session
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "CCNA",
    "summary": "Completed Switching module + practice test (84%)",
    "hours": 3
  }'

# Log Loytex revenue
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "Loytex Closet",
    "summary": "6 orders received today, KSh 1,800 revenue",
    "hours": 0.5
  }'

# Log FarmLink activity
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "FarmLink",
    "summary": "2 new sign-ups from Kiambu pilot",
    "hours": 1
  }'
```

---

## **UPDATING ALERTS**

### **Add New Alert**

```bash
curl -X POST http://localhost:3000/api/alerts \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "FarmLink",
    "severity": "red",
    "title": "Payment processing down",
    "description": "M-Pesa integration failing. Farmers cannot complete transactions."
  }'
```

### **Resolve Alert**

```bash
# Get alert ID first
curl http://localhost:3000/api/alerts

# Then resolve it
curl -X PATCH http://localhost:3000/api/alerts/12 \
  -H "Content-Type: application/json" \
  -d '{ "isResolved": true }'
```

---

## **DAILY WORKFLOW**

### **Morning Standup**

```bash
# Get daily briefing
curl http://localhost:3000/api/briefing

# Read: summary, RED alerts, focus area
# Check: KPIs vs targets
# Plan: Actions for today
```

### **Log Progress**

Throughout the day:
```bash
# After CCNA study session
curl -X POST http://localhost:3000/api/logs \
  -d '{ "domain": "CCNA", "summary": "...", "hours": 2.5 }'

# After handling Loytex order
curl -X POST http://localhost:3000/api/logs \
  -d '{ "domain": "Loytex Closet", "summary": "...", "hours": 0.5 }'

# After FarmLink work
curl -X POST http://localhost:3000/api/logs \
  -d '{ "domain": "FarmLink", "summary": "...", "hours": 3 }'
```

### **Complete Actions**

```bash
# Mark task as done
curl -X PATCH http://localhost:3000/api/actions/1 \
  -d '{ "isDone": true }'
```

### **Evening Review**

```bash
# Get logs from today
curl "http://localhost:3000/api/logs?limit=50"

# Check updated metrics
curl http://localhost:3000/api/briefing

# Plan tomorrow
```

---

## **WEEKLY REVIEW**

### **Summary Query**

```bash
# Get all logs from past 7 days for each domain
curl "http://localhost:3000/api/logs?domain=CCNA&limit=100"
curl "http://localhost:3000/api/logs?domain=Loytex%20Closet&limit=100"
curl "http://localhost:3000/api/logs?domain=FarmLink&limit=100"
curl "http://localhost:3000/api/logs?domain=Networking&limit=100"

# Calculate totals:
# - CCNA: sum(hours) for study time
# - Loytex: count(orders), sum(revenue)
# - FarmLink: count(new_signups), count(transactions)
# - Networking: count(tasks_completed)
```

### **Update Metrics**

Based on weekly summary, update `/src/lib/jarvis.ts`:

```typescript
// CCNA
value: "75" // ← Was 68%, now 75% complete
trend: 7    // ← 7% progress this week

// Loytex
value: "1500" // ← Revenue increased to KSh 1,500

// FarmLink
value: "20"   // ← Sign-ups increased to 20 users
trend: 6      // ← 6 new users this week

// Networking
value: "6"    // ← 6 tasks completed
status: "on_track"
```

---

## **MONTHLY TASKS**

### **First of Month**

```bash
# Reset YTD metrics
# Update targets for new month
# Review and plan monthly goals
# Check database size: pg_dump --stat
```

### **Mid-Month Check**

```bash
# Review progress toward targets
# Identify trends (what's accelerating? what's slowing?)
# Adjust actions/alerts if needed
```

### **End of Month**

```bash
# Generate monthly summary report
# Archive logs for reference
# Backup database:
pg_dump $DATABASE_URL > jarvis_backup_$(date +%Y-%m).sql
```

---

## **SHORTCUTS FOR COMMON TASKS**

### **Update CCNA Progress**

```bash
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "CCNA",
    "summary": "Completed ACL configuration lab (Quiz score: 88%)",
    "hours": 2
  }'
```

### **Log Loytex Order**

```bash
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "Loytex Closet",
    "summary": "5 shoe orders via WhatsApp, KSh 1,500 revenue",
    "hours": 0.75
  }'
```

### **Log FarmLink Activity**

```bash
curl -X POST http://localhost:3000/api/logs \
  -H "Content-Type: application/json" \
  -d '{
    "domain": "FarmLink",
    "summary": "Deployed user onboarding improvements. 3 new farmer sign-ups",
    "hours": 4
  }'
```

### **Check All RED Alerts**

```bash
curl "http://localhost:3000/api/alerts?severity=red"
```

### **Get Urgent Actions**

```bash
curl "http://localhost:3000/api/actions?priority=high&isDone=false"
```

---

## **ENVIRONMENT VARIABLES**

Update in `.env.local`:

```bash
# Database (required)
DATABASE_URL="postgresql://..."

# Environment
NODE_ENV=development  # development | production

# API Base URL (for frontend)
NEXT_PUBLIC_API_URL=http://localhost:3000  # Change for production

# Logging
DEBUG=false
```

---

## **DEPLOYMENT SHORTCUTS**

### **Deploy to Vercel**

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

### **View Logs**

```bash
# Vercel
vercel logs

# Railway (if using)
railway logs

# Local
npm run dev  # Logs in terminal
```

---

## **FILE LOCATIONS**

| What | Where |
|------|-------|
| Metrics config | `/src/lib/jarvis.ts` |
| Alert rules | `/src/lib/jarvis.ts` |
| Action templates | `/src/lib/jarvis.ts` |
| Database schema | `/src/db/schema.ts` |
| Dashboard UI | `/src/app/dashboard.tsx` |
| API routes | `/src/app/api/` |
| Styles | `/src/app/globals.css` |
| Config | `.env.local` |

---

## **USEFUL COMMANDS**

```bash
# Development
npm run dev          # Start dev server
npm run build        # Production build
npm run lint         # Check code style
npm run typecheck    # TypeScript check

# Database
npx drizzle-kit push:pg      # Run migrations
npx drizzle-kit studio       # Open DB UI
psql $DATABASE_URL           # Connect to DB

# Deployment
vercel                       # Deploy to Vercel
git push                     # Push to GitHub (auto-deploys)
npm run build && npm start   # Local production
```

---

**Keep this handy for daily use!** 📌
