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
}, (t) => [
  index("idx_sub_credits_user").on(t.userId),
]);

export const bankTransfers = pgTable("bank_transfers", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").references(() => users.id).notNull(),
  amount: numeric("amount").notNull(),
  coinsRequested: integer("coins_requested").notNull(),
  senderName: text("sender_name").notNull(),
  status: text("status", { enum: ["pending", "confirmed", "rejected"] }).default("pending"),
  adminNote: text("admin_note"),
  confirmedAt: timestamp("confirmed_at"),
  createdAt: timestamp("created_at").defaultNow(),
}, (t) => [
  index("idx_bank_transfer_user").on(t.userId),
  index("idx_bank_transfer_status").on(t.status),
]);
