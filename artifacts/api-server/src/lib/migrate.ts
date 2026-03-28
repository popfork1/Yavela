import { pool } from "@workspace/db";

export async function runMigrations(): Promise<void> {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        display_name TEXT NOT NULL,
        password_hash TEXT NOT NULL,
        avatar_color TEXT NOT NULL DEFAULT '#6366f1',
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);
    console.log("Database tables ready");
  } finally {
    client.release();
  }
}
