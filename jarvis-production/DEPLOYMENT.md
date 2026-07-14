# 🚀 JARVIS DEPLOYMENT GUIDE - GO LIVE NOW

**Griezzy's Personal Operations AI**  
Last updated: July 13, 2026

---

## **QUICK START (5 Minutes)**

### **1. Install Dependencies**
```bash
npm install
```

### **2. Set Up PostgreSQL Database**

**Option A: LOCAL (for testing)**
```bash
# Install PostgreSQL locally (if not already installed)
# macOS: brew install postgresql
# Ubuntu/Debian: sudo apt install postgresql postgresql-contrib
# Windows: Download from postgresql.org

# Start PostgreSQL service
# macOS/Linux: brew services start postgresql
# Windows: Services > PostgreSQL start

# Create database
createdb jarvis_db

# Run migrations
npm run db:migrate
```

**Option B: CLOUD POSTGRES (Recommended - FREE)**

Choose one:

#### **Supabase (Easiest - FREE tier)**
1. Go to https://supabase.com
2. Sign up with GitHub/email
3. Create new project: `jarvis`
4. Go to Settings > Database
5. Copy the connection string
6. Replace `DATABASE_URL` in `.env.local`

#### **Railway (Simple - $5/month or free credits)**
1. Go to https://railway.app
2. Sign up, create new project
3. Add PostgreSQL service
4. Copy connection string to `.env.local`

#### **Render (Free tier available)**
1. Go to https://render.com
2. Create PostgreSQL database
3. Copy connection string to `.env.local`

### **3. Initialize Database**
```bash
# Apply schema to your database
npm run db:migrate

# Or if that doesn't work, use:
npx drizzle-kit push:pg
```

### **4. Run Locally**
```bash
npm run dev
```

Open http://localhost:3000 - **You should see your Jarvis dashboard!**

---

## **PRODUCTION DEPLOYMENT (Choose 1)**

### **Option 1: VERCEL (Fastest - Recommended)**

**Best for:** Next.js, free tier available, instant deploys

1. **Connect your repo:**
   - Push this project to GitHub
   - Go to https://vercel.com/new
   - Import your GitHub repo
   - Select "Next.js" framework

2. **Set environment variables:**
   - In Vercel dashboard: Settings > Environment Variables
   - Add: `DATABASE_URL` (your Supabase/Railway/Render connection string)
   - Add: `NEXT_PUBLIC_API_URL` = your Vercel domain (e.g., `https://jarvis-XXX.vercel.app`)

3. **Deploy:**
   - Click "Deploy"
   - Wait 2 minutes
   - Your Jarvis is LIVE ✅

**Cost:** Free tier (5GB bandwidth/month), then $20/month  
**Domain:** jarvis-XXX.vercel.app (upgrade to custom domain)

---

### **Option 2: NETLIFY**

1. **Build your project:**
   ```bash
   npm run build
   ```

2. **Connect to Netlify:**
   - Drag and drop the `.next` folder to https://app.netlify.com
   - Or connect your GitHub repo

3. **Set environment variables:**
   - Netlify dashboard > Site settings > Build & deploy
   - Add `DATABASE_URL`

**Note:** Netlify works best with serverless functions; consider Vercel for Next.js

---

### **Option 3: RAILWAY (Best value)**

1. **Create account:** https://railway.app
2. **Create new project** > Add PostgreSQL
3. **Deploy from GitHub:**
   - Connect your repo
   - Railway auto-detects Next.js
   - Sets `DATABASE_URL` automatically

4. **Deployment:**
   - Push to GitHub
   - Railway deploys automatically

**Cost:** $5/month, includes PostgreSQL  
**Domain:** Auto-assigned + custom domain support

---

### **Option 4: RENDER**

1. Go to https://render.com
2. Create new Web Service > Connect GitHub
3. Settings:
   - Build Command: `npm run build`
   - Start Command: `npm start`
4. Add environment variables (DATABASE_URL)
5. Deploy

**Cost:** Free tier, $12/month for custom domain

---

### **Option 5: SELF-HOSTED (AWS/Digital Ocean)**

#### **AWS EC2:**
```bash
# Launch Ubuntu 22.04 instance
# SSH into instance

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs postgresql postgresql-contrib

# Clone your repo
git clone <your-repo-url>
cd jarvis

# Install & build
npm install
npm run build

# Set environment variables
export DATABASE_URL="postgresql://..."
export NODE_ENV="production"

# Run with PM2 (process manager)
npm install -g pm2
pm2 start "npm start" --name "jarvis"
pm2 startup
pm2 save

# Set up Nginx reverse proxy (optional but recommended)
```

#### **Digital Ocean App Platform:**
1. Go to https://cloud.digitalocean.com/apps
2. Create new app from GitHub
3. Configure: Next.js detection automatic
4. Add database: PostgreSQL
5. Deploy

**Cost:** $12/month for app + $15/month for database

---

## **POST-DEPLOYMENT CHECKLIST**

After deploying to production:

- [ ] **Verify dashboard loads:** Visit your deployed URL
- [ ] **Check API health:** Visit `/api/health`
- [ ] **Test briefing endpoint:** Visit `/api/briefing`
- [ ] **Verify database connection:** Check logs for connection errors
- [ ] **Set up custom domain** (if not already)
  - Vercel/Render/Railway have easy domain setup
- [ ] **Enable HTTPS** (automatic on all platforms)
- [ ] **Test market data API:** Visit `/api/market`
- [ ] **Bookmark your dashboard** for daily access

---

## **UPDATE YOUR DATA**

Once live, update your Jarvis vault with real metrics:

### **Database seeding (populate initial data):**

The app ships with sample data:
- CCNA: 68% completion, 3/5 weekly hours
- Loytex: KSh 1,200 revenue
- FarmLink: 14 sign-ups
- Avios: 2/3 active tasks

**To update:**

Edit `/src/lib/jarvis.ts` - find `initialMetrics`, `initialAlerts`, `initialActions` sections and update with your real numbers, then redeploy.

Or use the dashboard UI once live (actions can be marked complete, new alerts created).

---

## **LIVE DASHBOARD FEATURES**

Once deployed, Jarvis provides:

1. **KPI Cards** - Real-time metric snapshots
2. **Alert Log** - RED/YELLOW severity tracking
3. **Progress Bars** - Study, project, business metrics
4. **Action Queue** - Prioritized task list
5. **Market Data** - On-demand livestock prices, agri-tech trends, salary data

### **API Endpoints (for automation):**

- `GET /api/health` - System status
- `GET /api/briefing` - Daily summary
- `GET /api/logs` - Activity log
- `GET /api/market` - Market data
- `GET /api/alerts` - Current alerts
- `POST /api/actions` - Create action
- `PATCH /api/actions/[id]` - Update action

---

## **TROUBLESHOOTING**

### **Database connection fails:**
- Verify `DATABASE_URL` is correct
- Check IP allowlist (Supabase/Railway/Render)
- Test connection: `psql $DATABASE_URL`

### **Dashboard shows "Error loading metrics":**
- Check `/api/health` endpoint
- Verify migrations ran: `npx drizzle-kit push:pg`
- Check browser console for API errors

### **Build fails on deployment:**
- Verify `npm install && npm run build` works locally
- Check Node.js version (need 18+)
- Verify all env vars are set

### **Pages are slow:**
- Database might be cold (cloud services)
- Check Vercel/Railway logs
- Optimize by running migrations on deploy

---

## **CUSTOM DOMAIN SETUP**

### **Vercel:**
- Dashboard > Settings > Domains
- Add your domain, follow DNS instructions

### **Railway:**
- Project > Settings > Deployments > Domain

### **Render:**
- Service > Environment > Custom Domain

---

## **MONITORING & LOGS**

### **Vercel:**
- Dashboard > Deployments > Logs

### **Railway:**
- Project > Logs

### **Render:**
- Service > Logs

### **Local:**
```bash
npm run dev  # Watch logs in terminal
```

---

## **NEXT STEPS AFTER GOING LIVE**

1. **Test all endpoints** with your actual data
2. **Set up daily alerts** - configure email/Slack integration
3. **Populate FarmLink pilot metrics** from your system
4. **Link to ministry/Arsenal content** (if extending)
5. **Create backup strategy** (database backups)
6. **Set up monitoring** (error tracking with Sentry - optional)

---

## **SCALING LATER**

If Jarvis grows:
- Add caching layer (Redis)
- Set up database backups (automatic on Supabase/Railway)
- Configure CDN (Vercel/Netlify built-in)
- Add authentication (NextAuth.js)
- Build mobile companion app

---

## **SUPPORT**

- **Docs:** https://nextjs.org, https://orm.drizzle.team
- **Database Issues:** Check provider docs (Supabase, Railway, Render)
- **Deployment Help:** Use provider support chat

---

**🎯 You're ready to deploy. Pick Vercel + Supabase for the fastest path (15 minutes total).**
