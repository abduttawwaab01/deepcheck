import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schemas";

const dbUrl = process.env.DATABASE_URL || "postgresql://dummy:dummy@localhost:5432/dummy?sslmode=disable";
const sql = neon(dbUrl);
export const db = drizzle(sql, { schema });
