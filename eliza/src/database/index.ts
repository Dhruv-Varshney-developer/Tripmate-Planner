import { PostgresDatabaseAdapter } from "@elizaos/adapter-postgres";
import { SqliteDatabaseAdapter } from "@elizaos/adapter-sqlite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";


export function initializeDatabase(dataDir: string) {
  if (process.env.POSTGRES_URL) {
    const db = new PostgresDatabaseAdapter({
      connectionString: process.env.POSTGRES_URL,
    });
    return db;
  } else {
    const filePath = process.env.SQLITE_FILE ?? path.resolve(dataDir, "db.sqlite");
    console.log("💾 Using SQLite file at:", filePath);
    
    // Ensure the directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      try {
        fs.mkdirSync(dir, { recursive: true });
        console.log(`Created directory: ${dir}`);
      } catch (err) {
        console.error(`Failed to create directory ${dir}:`, err);
        // Fallback to in-memory database if we can't create the directory
        console.log("⚠️ Falling back to in-memory SQLite database");
        return new SqliteDatabaseAdapter(new Database(":memory:"));
      }
    }
    
    try {
      const db = new SqliteDatabaseAdapter(new Database(filePath));
      return db;
    } catch (err) {
      console.error(`Failed to open SQLite database at ${filePath}:`, err);
      // Fallback to in-memory database
      console.log("⚠️ Falling back to in-memory SQLite database");
      return new SqliteDatabaseAdapter(new Database(":memory:"));
    }
  }
}