import { readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const { Pool } = pg;

const currentFile = fileURLToPath(import.meta.url);
const currentDirectory = dirname(currentFile);

export async function initializeDatabase(): Promise<void> {
  const connectionString =
    process.env.DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5434/kimm";

  const pool = new Pool({
    connectionString,
  });

  try {
    const sqlPath = resolve(
      currentDirectory,
      "../../sql/001_create_contacts.sql",
    );

    const sql = await readFile(sqlPath, "utf8");

    await pool.query(sql);

    console.log("Database initialized successfully.");
  } finally {
    await pool.end();
  }
}