import { neon } from "@neondatabase/serverless";

async function reset() {
  const sql = neon(process.env.DATABASE_URL!);
  const tables = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;
  const names: string[] = tables
    .map((t: any) => t.tablename)
    .filter((n: string) => !n.startsWith("_") && n !== "drizzle_migrations");
  
  if (names.length === 0) {
    console.log("No tables to drop");
    return;
  }
  
  for (const name of names) {
    // Build DROP TABLE with tagged template but dynamic table name needs safe quoting
    await sql.unsafe(`DROP TABLE IF EXISTS "${name}" CASCADE`);
    console.log("  Dropped:", name);
  }
  console.log(`\nDropped ${names.length} tables`);
}

reset().catch(console.error);
