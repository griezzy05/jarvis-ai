import {
  boolean,
  integer,
  numeric,
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core";

export const jarvisMetrics = pgTable("jarvis_metrics", {
  id: serial("id").primaryKey(),
  area: varchar("area", { length: 50 }).notNull(),
  metricKey: varchar("metric_key", { length: 80 }).notNull().unique(),
  label: varchar("label", { length: 120 }).notNull(),
  value: numeric("value", { precision: 12, scale: 2 }).notNull(),
  target: numeric("target", { precision: 12, scale: 2 }),
  unit: varchar("unit", { length: 32 }).notNull().default(""),
  trend: integer("trend").notNull().default(0),
  status: varchar("status", { length: 20 }).notNull().default("on_track"),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const jarvisAlerts = pgTable("jarvis_alerts", {
  id: serial("id").primaryKey(),
  domain: varchar("domain", { length: 50 }).notNull(),
  severity: varchar("severity", { length: 12 }).notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description").notNull(),
  isResolved: boolean("is_resolved").notNull().default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const jarvisActions = pgTable("jarvis_actions", {
  id: serial("id").primaryKey(),
  domain: varchar("domain", { length: 50 }).notNull(),
  title: varchar("title", { length: 180 }).notNull(),
  detail: text("detail").notNull(),
  priority: varchar("priority", { length: 12 }).notNull().default("medium"),
  isDone: boolean("is_done").notNull().default(false),
  dueLabel: varchar("due_label", { length: 60 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const marketSnapshots = pgTable("market_snapshots", {
  id: serial("id").primaryKey(),
  category: varchar("category", { length: 40 }).notNull(),
  item: varchar("item", { length: 120 }).notNull(),
  value: varchar("value", { length: 100 }).notNull(),
  change: varchar("change", { length: 80 }).notNull(),
  source: varchar("source", { length: 160 }).notNull(),
  note: text("note").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const jarvisLogs = pgTable("jarvis_logs", {
  id: serial("id").primaryKey(),
  domain: varchar("domain", { length: 50 }).notNull(),
  summary: text("summary").notNull(),
  hours: numeric("hours", { precision: 6, scale: 2 }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
