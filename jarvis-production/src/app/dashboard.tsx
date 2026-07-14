"use client";

import { FormEvent, useMemo, useState } from "react";

type Metric = {
  id: number;
  area: string;
  metricKey: string;
  label: string;
  value: number;
  target: number | null;
  unit: string;
  trend: number;
  status: string;
  updatedAt: string;
};

type Alert = {
  id: number;
  domain: string;
  severity: string;
  title: string;
  description: string;
  isResolved: boolean;
  createdAt: string;
};

type Action = {
  id: number;
  domain: string;
  title: string;
  detail: string;
  priority: string;
  isDone: boolean;
  dueLabel: string | null;
  createdAt: string;
};

type Log = {
  id: number;
  domain: string;
  summary: string;
  hours: number | null;
  createdAt: string;
};

type Market = {
  id: number;
  category: string;
  item: string;
  value: string;
  change: string;
  source: string;
  note: string;
  updatedAt: string;
};

type Briefing = { headline: string; summary: string; priorities: string[] };

type DashboardData = {
  metrics: Metric[];
  alerts: Alert[];
  actions: Action[];
  logs: Log[];
  market: Market[];
};

function Icon({ name, size = 18 }: { name: string; size?: number }) {
  const common = { width: size, height: size, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.8, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const paths: Record<string, React.ReactNode> = {
    grid: <><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></>,
    book: <><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2Z" /></>,
    network: <><circle cx="12" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" /><path d="m12 7 0 5M7 18l4-4m6 4-4-4" /></>,
    bag: <><path d="M6 8h12l1 13H5L6 8Z" /><path d="M9 9V6a3 3 0 0 1 6 0v3" /></>,
    sprout: <><path d="M7 20h10" /><path d="M12 20V10" /><path d="M12 14C8 14 5 11 5 7c4 0 7 3 7 7Z" /><path d="M12 10c0-4 3-7 7-7 0 4-3 7-7 7Z" /></>,
    chart: <><path d="M3 3v18h18" /><path d="m7 15 4-4 3 2 5-6" /></>,
    bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" /><path d="M10 21h4" /></>,
    plus: <><path d="M12 5v14M5 12h14" /></>,
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    check: <path d="m5 12 4 4L19 6" />,
    clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
    close: <><path d="m6 6 12 12M18 6 6 18" /></>,
    bolt: <path d="m13 2-9 12h7l-1 8 9-12h-7l1-8Z" />,
    dots: <><circle cx="5" cy="12" r="1" fill="currentColor" /><circle cx="12" cy="12" r="1" fill="currentColor" /><circle cx="19" cy="12" r="1" fill="currentColor" /></>,
    chevron: <path d="m9 18 6-6-6-6" />,
    target: <><circle cx="12" cy="12" r="8" /><circle cx="12" cy="12" r="3" /><path d="M12 2v2m0 16v2M2 12h2m16 0h2" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    refresh: <><path d="M20 11a8.1 8.1 0 0 0-15.5-2M4 5v4h4" /><path d="M4 13a8.1 8.1 0 0 0 15.5 2M20 19v-4h-4" /></>,
  };
  return <svg {...common} aria-hidden="true">{paths[name] ?? paths.grid}</svg>;
}

const navItems = [
  { label: "Overview", icon: "grid", href: "#overview" },
  { label: "IT study", icon: "book", href: "#progress" },
  { label: "Networking", icon: "network", href: "#progress" },
  { label: "Loytex Closet", icon: "bag", href: "#actions" },
  { label: "FarmLink", icon: "sprout", href: "#actions" },
  { label: "Market watch", icon: "chart", href: "#market" },
];

function formatMetric(metric: Metric) {
  if (metric.metricKey === "loytex_revenue") return `KSh ${metric.value.toLocaleString("en-KE")}`;
  if (metric.metricKey === "ccna_completion") return `${metric.value}%`;
  if (metric.metricKey === "study_hours_week") return `${metric.value}/${metric.target ?? 5}`;
  if (metric.metricKey === "farmlink_signups") return `${metric.value}`;
  return `${metric.value}`;
}

function metricContext(metric: Metric) {
  if (metric.metricKey === "ccna_completion") return "to certification target";
  if (metric.metricKey === "study_hours_week") return "hours logged this week";
  if (metric.metricKey === "loytex_revenue") return "this month · target KSh 1,000";
  if (metric.metricKey === "farmlink_signups") return `of ${metric.target ?? 30} pilot target`;
  return metric.unit.trim() || "current status";
}

function ago(date: string) {
  const minutes = Math.max(1, Math.round((Date.now() - new Date(date).getTime()) / 60000));
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return `${Math.round(hours / 24)}d ago`;
}

export default function Dashboard({ initialData }: { initialData: DashboardData }) {
  const [alerts, setAlerts] = useState(initialData.alerts);
  const [actions, setActions] = useState(initialData.actions);
  const [logs, setLogs] = useState(initialData.logs);
  const [market, setMarket] = useState(initialData.market);
  const [marketCategory, setMarketCategory] = useState("livestock");
  const [marketLoading, setMarketLoading] = useState(false);
  const [briefing, setBriefing] = useState<Briefing | null>(null);
  const [briefingOpen, setBriefingOpen] = useState(false);
  const [logOpen, setLogOpen] = useState(false);
  const [savingLog, setSavingLog] = useState(false);
  const [notice, setNotice] = useState("");
  const [formDomain, setFormDomain] = useState("CCNA");
  const [formSummary, setFormSummary] = useState("");
  const [formHours, setFormHours] = useState("");

  const today = useMemo(
    () => new Intl.DateTimeFormat("en-GB", { weekday: "long", day: "numeric", month: "long", timeZone: "Africa/Nairobi" }).format(new Date()),
    [],
  );
  const openActions = actions.filter((action) => !action.isDone);
  const redAlerts = alerts.filter((alert) => alert.severity === "red").length;
  const unresolvedCount = alerts.length;
  const topMetrics = initialData.metrics.slice(0, 4);
  const currentMarket = market.filter((item) => item.category === marketCategory);
  const metric = (key: string) => initialData.metrics.find((item) => item.metricKey === key);

  async function resolveAlert(id: number) {
    const previous = alerts;
    setAlerts((current) => current.filter((alert) => alert.id !== id));
    try {
      const response = await fetch(`/api/alerts/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isResolved: true }) });
      if (!response.ok) throw new Error("Unable to update alert");
      setNotice("Alert marked as reviewed.");
    } catch {
      setAlerts(previous);
      setNotice("Could not update that alert. Please try again.");
    }
  }

  async function toggleAction(action: Action) {
    const previous = actions;
    setActions((current) => current.map((item) => item.id === action.id ? { ...item, isDone: !item.isDone } : item));
    try {
      const response = await fetch(`/api/actions/${action.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isDone: !action.isDone }) });
      if (!response.ok) throw new Error("Unable to update action");
      setNotice(!action.isDone ? "Action completed. Good progress." : "Action reopened.");
    } catch {
      setActions(previous);
      setNotice("Could not update that action. Please try again.");
    }
  }

  async function showBriefing() {
    setBriefingOpen(true);
    setBriefing(null);
    try {
      const response = await fetch("/api/briefing");
      if (!response.ok) throw new Error("Unable to load briefing");
      setBriefing(await response.json() as Briefing);
    } catch {
      setBriefing({ headline: "Briefing unavailable", summary: "The latest briefing could not be generated. Check your database connection and try again.", priorities: [] });
    }
  }

  async function loadMarket(category: string) {
    setMarketCategory(category);
    setMarketLoading(true);
    try {
      const response = await fetch(`/api/market?category=${category}`);
      if (!response.ok) throw new Error("Unable to load market data");
      const data = await response.json() as { items: Market[] };
      setMarket((current) => [...current.filter((item) => item.category !== category), ...data.items]);
    } catch {
      setNotice("Market watch could not refresh. Showing the latest saved intelligence.");
    } finally {
      setMarketLoading(false);
    }
  }

  async function saveLog(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!formSummary.trim()) return;
    setSavingLog(true);
    try {
      const response = await fetch("/api/logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: formDomain, summary: formSummary, hours: formHours ? Number(formHours) : null }),
      });
      const data = await response.json() as { log?: Log; error?: string };
      if (!response.ok || !data.log) throw new Error(data.error ?? "Could not save update");
      setLogs((current) => [data.log!, ...current].slice(0, 5));
      setFormSummary("");
      setFormHours("");
      setLogOpen(false);
      setNotice("Update logged. Jarvis will include it in the next report.");
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Could not save update.");
    } finally {
      setSavingLog(false);
    }
  }

  return (
    <main className="jarvis-shell">
      <aside className="jarvis-sidebar">
        <div className="brand-lockup">
          <div className="brand-mark"><span>J</span></div>
          <div><p className="brand-name">JARVIS</p><p className="brand-subtitle">Operations system</p></div>
        </div>

        <div className="sidebar-label">COMMAND CENTER</div>
        <nav className="side-nav" aria-label="Jarvis sections">
          {navItems.map((item, index) => (
            <a key={item.label} className={`nav-link ${index === 0 ? "active" : ""}`} href={item.href}>
              <Icon name={item.icon} size={17} /><span>{item.label}</span>{item.label === "FarmLink" && redAlerts > 0 ? <em>{redAlerts}</em> : null}
            </a>
          ))}
        </nav>

        <div className="sidebar-spacer" />
        <div className="system-card">
          <div className="system-card-top"><span className="live-dot" />SYSTEM STATUS</div>
          <strong>All systems online</strong>
          <p>{unresolvedCount} item{unresolvedCount === 1 ? "" : "s"} in watch queue</p>
          <div className="mini-rule"><span /></div>
          <small>Last pulse: just now</small>
        </div>
        <div className="profile-row"><div className="avatar">G</div><div><strong>Griezzy</strong><span>Administrator</span></div><button aria-label="Profile options"><Icon name="dots" size={18} /></button></div>
      </aside>

      <section className="jarvis-content">
        <header className="topbar">
          <div className="location-chip"><span className="pulse-ring" />NAIROBI, KENYA</div>
          <div className="topbar-right"><span className="date-text">{today}</span><button className="icon-button" aria-label="Notifications"><Icon name="bell" size={19} />{unresolvedCount > 0 ? <i>{unresolvedCount}</i> : null}</button></div>
        </header>

        <div id="overview" className="hero-row">
          <div><p className="eyebrow">MORNING BRIEFING <span>•</span> 07:30 EAT</p><h1>Good morning, <em>Griezzy.</em></h1><p className="hero-copy">Your operations are stable. <b>{unresolvedCount} watch item{unresolvedCount === 1 ? "" : "s"}</b> needs your attention today.</p></div>
          <div className="hero-actions"><button className="secondary-button" onClick={() => setLogOpen(true)}><Icon name="plus" size={17} />Log update</button><button className="primary-button" onClick={showBriefing}><Icon name="bolt" size={17} />Daily briefing</button></div>
        </div>

        {notice ? <div className="toast"><span className="toast-check"><Icon name="check" size={13} /></span>{notice}<button onClick={() => setNotice("")} aria-label="Dismiss message"><Icon name="close" size={15} /></button></div> : null}

        <section className="kpi-grid" aria-label="Key performance indicators">
          {topMetrics.map((item, index) => (
            <article className={`kpi-card kpi-${index}`} key={item.id}>
              <div className="kpi-top"><span className={`metric-icon ${item.area.toLowerCase().replace(" ", "-")}`}><Icon name={index === 0 ? "book" : index === 1 ? "clock" : index === 2 ? "bag" : "sprout"} size={17} /></span><span className={`status-tag ${item.status}`}>{item.status === "on_track" ? "ON TRACK" : "WATCH"}</span></div>
              <p>{item.label}</p><div className="metric-number">{formatMetric(item)}{item.metricKey === "study_hours_week" ? <small> hrs</small> : null}</div><div className="kpi-footer"><span className={item.trend >= 0 ? "positive" : "caution"}>{item.trend >= 0 ? "↗" : "↘"} {Math.abs(item.trend)}{item.metricKey === "loytex_revenue" || item.metricKey === "ccna_completion" ? "%" : metricContext(item).startsWith("of") ? "" : " hrs"}</span><span>{metricContext(item)}</span></div>
            </article>
          ))}
        </section>

        <div className="section-heading"><div><p className="eyebrow">OPERATIONS PULSE</p><h2>See the signal, not the noise.</h2></div><button className="text-button" onClick={() => document.getElementById("progress")?.scrollIntoView({ behavior: "smooth" })}>View all activity <Icon name="arrow" size={15} /></button></div>

        <section className="overview-grid">
          <article className="panel signal-panel">
            <div className="panel-heading"><div><h3>Weekly momentum</h3><p>Study & pilot activity · last 7 days</p></div><button className="panel-menu" aria-label="More chart options"><Icon name="dots" size={19} /></button></div>
            <div className="chart-summary"><strong>68<span>%</span></strong><div><span className="positive">↗ 6%</span><p>CCNA completion trend</p></div></div>
            <div className="chart-area" aria-label="Weekly performance bar chart">
              {[36, 52, 44, 68, 55, 83, 66].map((height, index) => <div className="bar-unit" key={height + index}><div className={index === 5 ? "bar highlighted" : "bar"} style={{ height: `${height}%` }} /><span>{["M", "T", "W", "T", "F", "S", "S"][index]}</span></div>)}
              <div className="trend-line"><svg viewBox="0 0 480 120" preserveAspectRatio="none"><path d="M0 95 C55 83 55 70 104 73 S164 85 192 59 S252 80 284 48 S352 38 376 26 S432 59 480 35" /></svg></div>
            </div>
            <div className="chart-legend"><span><i className="legend-line" />Progress velocity</span><span><i className="legend-dot" />Focused days</span></div>
          </article>

          <article className="panel alert-panel">
            <div className="panel-heading"><div><h3>Alert center</h3><p>Threshold-based monitoring</p></div><div className="alert-count"><span>{unresolvedCount}</span> OPEN</div></div>
            <div className="alerts-list">
              {alerts.length === 0 ? <div className="empty-state"><span className="empty-check"><Icon name="check" size={19} /></span><strong>All clear</strong><p>No unresolved alerts in the monitoring queue.</p></div> : alerts.slice(0, 3).map((alert) => (
                <div className={`alert-row ${alert.severity}`} key={alert.id}><div className="alert-status"><Icon name={alert.severity === "red" ? "bolt" : "bell"} size={15} /></div><div className="alert-text"><div><span>{alert.domain}</span><time>{ago(alert.createdAt)}</time></div><strong>{alert.title}</strong><p>{alert.description}</p></div><button className="review-button" onClick={() => resolveAlert(alert.id)}>Review</button></div>
              ))}
            </div>
            <button className="panel-footer-button" onClick={() => setNotice("Alert rules are active: red issues interrupt, yellow issues join your next briefing.")}>How Jarvis alerts <Icon name="chevron" size={15} /></button>
          </article>
        </section>

        <section id="progress" className="lower-grid">
          <article className="panel progress-panel">
            <div className="panel-heading"><div><h3>Progress pulse</h3><p>Current workstreams against target</p></div><button className="panel-menu" aria-label="More progress options"><Icon name="dots" size={19} /></button></div>
            <div className="progress-list">
              {[
                { name: "CCNA 200-301", icon: "book", value: metric("ccna_completion")?.value ?? 0, target: 100, label: "68% complete", className: "violet" },
                { name: "FarmLink pilot", icon: "sprout", value: metric("farmlink_signups")?.value ?? 0, target: metric("farmlink_signups")?.target ?? 30, label: "14 of 30 sign-ups", className: "green" },
                { name: "Networking labs", icon: "network", value: metric("networking_tasks")?.value ?? 0, target: metric("networking_tasks")?.target ?? 3, label: "2 of 3 active tasks", className: "cyan" },
                { name: "Loytex maintenance", icon: "bag", value: 0, target: 4, label: "4 checks overdue", className: "amber" },
              ].map((item) => <div className="progress-row" key={item.name}><div className={`progress-icon ${item.className}`}><Icon name={item.icon} size={16} /></div><div className="progress-main"><div><strong>{item.name}</strong><span>{item.label}</span></div><div className="progress-track"><span className={item.className} style={{ width: `${Math.min(100, (item.value / item.target) * 100)}%` }} /></div></div><b>{Math.round((item.value / item.target) * 100)}%</b></div>)}
            </div>
          </article>

          <article id="actions" className="panel actions-panel">
            <div className="panel-heading"><div><h3>Today&apos;s action queue</h3><p>Highest impact first</p></div><span className="queue-count">{openActions.length} remaining</span></div>
            <div className="action-list">{actions.slice(0, 4).map((action) => <div className={`action-row ${action.isDone ? "done" : ""}`} key={action.id}><button className="action-check" aria-label={`Mark ${action.title} ${action.isDone ? "incomplete" : "complete"}`} onClick={() => toggleAction(action)}>{action.isDone ? <Icon name="check" size={14} /> : null}</button><div><div className="action-meta"><span className={`priority ${action.priority}`}>{action.priority}</span><span>{action.domain}</span></div><strong>{action.title}</strong><p>{action.detail}</p></div><span className="due-label">{action.dueLabel}</span></div>)}</div>
            <button className="panel-footer-button" onClick={() => setLogOpen(true)}>Add action update <Icon name="plus" size={15} /></button>
          </article>
        </section>

        <section id="market" className="market-section">
          <div className="market-heading"><div><p className="eyebrow">MARKET INTELLIGENCE</p><h2>Useful context, when you need it.</h2><p>Saved research ranges—verify live market prices before making a commercial decision.</p></div><button className="refresh-button" onClick={() => loadMarket(marketCategory)} disabled={marketLoading}><Icon name="refresh" size={15} />{marketLoading ? "Refreshing" : "Refresh watch"}</button></div>
          <article className="market-panel">
            <div className="market-tabs" role="tablist">
              {[{ key: "livestock", label: "Livestock prices" }, { key: "agritech", label: "Agri-tech trends" }, { key: "salaries", label: "IT salaries" }].map((tab) => <button key={tab.key} className={marketCategory === tab.key ? "selected" : ""} onClick={() => loadMarket(tab.key)} role="tab" aria-selected={marketCategory === tab.key}>{tab.label}</button>)}
            </div>
            <div className="market-cards">{currentMarket.length ? currentMarket.map((item) => <div className="market-card" key={item.id}><div className="market-card-top"><span>{item.category === "livestock" ? "KENYA MARKET" : item.category === "agritech" ? "FARMLINK SIGNAL" : "CAREER WATCH"}</span><Icon name={item.category === "livestock" ? "target" : item.category === "agritech" ? "sprout" : "network"} size={18} /></div><h3>{item.item}</h3><strong>{item.value}</strong><p className="market-change">{item.change}</p><p className="market-note">{item.note}</p><small>{item.source}</small></div>) : <div className="market-empty">Loading market watch…</div>}</div>
          </article>
        </section>

        <section className="activity-section">
          <div className="section-heading compact"><div><p className="eyebrow">OPERATIONS LOG</p><h2>Latest updates</h2></div><button className="text-button" onClick={() => setLogOpen(true)}>Log activity <Icon name="plus" size={15} /></button></div>
          <div className="activity-grid">{logs.map((log) => <article className="activity-card" key={log.id}><div className="activity-card-top"><span className={`domain-dot ${log.domain.toLowerCase().replace(" ", "-")}`} /> <span>{log.domain}</span><time>{ago(log.createdAt)}</time></div><p>{log.summary}</p>{log.hours !== null ? <div className="hours-chip"><Icon name="clock" size={13} />{log.hours} hours logged</div> : null}</article>)}</div>
        </section>

        <footer className="footer"><span><i className="live-dot" />Jarvis monitoring is active</span><span>Recommendation mode · Decisions stay with you</span></footer>
      </section>

      {briefingOpen ? <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Daily briefing"><div className="briefing-modal"><button className="modal-close" onClick={() => setBriefingOpen(false)} aria-label="Close briefing"><Icon name="close" size={19} /></button><div className="modal-kicker"><Icon name="bolt" size={16} />JARVIS DAILY BRIEFING</div>{briefing ? <><h2>{briefing.headline}</h2><p>{briefing.summary}</p><div className="briefing-priorities"><span>TOP PRIORITIES</span>{briefing.priorities.map((priority, index) => <div key={priority}><b>0{index + 1}</b>{priority}</div>)}</div><button className="primary-button full-button" onClick={() => setBriefingOpen(false)}>Back to command center <Icon name="arrow" size={16} /></button></> : <div className="briefing-loading"><span className="loading-orb" />Building your briefing from current metrics…</div>}</div></div> : null}

      {logOpen ? <div className="modal-backdrop" role="dialog" aria-modal="true" aria-label="Log an update"><form className="log-modal" onSubmit={saveLog}><button type="button" className="modal-close" onClick={() => setLogOpen(false)} aria-label="Close update form"><Icon name="close" size={19} /></button><div className="modal-kicker"><Icon name="plus" size={16} />OPERATIONS LOG</div><h2>Log what moved.</h2><p>Keep it factual. Jarvis will use it in your next dashboard report.</p><label>Workstream<select value={formDomain} onChange={(event) => setFormDomain(event.target.value)}><option>CCNA</option><option>Networking</option><option>Loytex Closet</option><option>FarmLink</option></select></label><label>Update<textarea value={formSummary} onChange={(event) => setFormSummary(event.target.value)} required maxLength={800} placeholder="What did you complete, learn, observe, or unblock?" /></label><label>Hours spent <span className="optional">optional</span><input type="number" min="0" max="24" step="0.25" value={formHours} onChange={(event) => setFormHours(event.target.value)} placeholder="e.g. 2" /></label><button className="primary-button full-button" type="submit" disabled={savingLog}>{savingLog ? "Saving update…" : "Save to Jarvis"}<Icon name="arrow" size={16} /></button></form></div> : null}
    </main>
  );
}
