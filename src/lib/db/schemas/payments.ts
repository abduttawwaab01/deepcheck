import { pgTable, uuid, text, timestamp, numeric, jsonb, boolean, integer, index } from "drizzle-orm/pg-core";
import { users } from "./users";

export const paymentTransactions = pgTable("payment_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  reference: text("reference").notNull().unique(),
  amount: numeric("amount").notNull(),
  currency: text("currency").default("NGN"),
  status: text("status", { enum: ["pending", "success", "failed", "refunded"] }).default("pending"),
  provider: text("provider").default("paystack"),
  metadata: jsonb("metadata"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("idx_payment_user").on(t.userId),
  index("idx_payment_reference").on(t.reference),
]);

export const walletTransactions = pgTable("wallet_transactions", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  type: text("type", { enum: ["credit", "debit", "refund"] }).notNull(),
  amount: numeric("amount").notNull(),
  balance: numeric("balance").notNull(),
  description: text("description"),
  reference: text("reference"),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("idx_wallet_user").on(t.userId),
]);

export const subscriptionPlans = pgTable("subscription_plans", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  code: text("code").notNull().unique(),
  amount: numeric("amount").notNull(),
  interval: text("interval", { enum: ["one_time", "term", "annual"] }).default("one_time"),
  credits: integer("credits").default(0),
  features: jsonb("features").default([]),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const subscriptionCredits = pgTable("subscription_credits", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  planId: uuid("plan_id").references(() => subscriptionPlans.id),
  transactionId: uuid("transaction_id").references(() => paymentTransactions.id),
  creditsRemaining: integer("credits_remaining").default(0),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});
