import postgres from "postgres";

async function resetAll() {
  const sql = postgres(process.env.DATABASE_URL!);

  // Drop all tables
  await sql.unsafe(`
    DO $$ DECLARE r RECORD; BEGIN
      FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public' AND tablename NOT IN ('drizzle_migrations')) LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
      END LOOP;
    END $$;
  `);

  // Drop all enums
  await sql.unsafe(`
    DO $$ DECLARE r RECORD; BEGIN
      FOR r IN (SELECT typname FROM pg_type WHERE typnamespace = (SELECT oid FROM pg_namespace WHERE nspname = 'public') AND typtype = 'e') LOOP
        EXECUTE 'DROP TYPE IF EXISTS ' || quote_ident(r.typname) || ' CASCADE';
      END LOOP;
    END $$;
  `);

  const remaining = await sql`SELECT tablename FROM pg_tables WHERE schemaname = 'public'`;
  console.log(`Tables remaining: ${remaining.length}`);
  if (remaining.length > 0) {
    for (const t of remaining) console.log("  - " + t.tablename);
  } else {
    console.log("Schema is clean!");
  }

  await sql.end();
}

resetAll().catch(console.error);
