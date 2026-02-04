import path from 'path';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import { config } from 'dotenv';
import * as schema from './schema';

// Load environment variables from .env.local or .env
config({ path: '.env.local' });
config({ path: '.env' });

// Resolve local DB path so seed and dev server use the same file.
// Always use process.cwd() since __dirname can be unreliable in Next.js builds.
const appBlockRoot = process.cwd();
const localDbPath = path.join(appBlockRoot, 'dev.sqlite3');
const localDbUrl = `file:${localDbPath}`;

// Create Turso client with singleton pattern for Next.js hot reloading
let tursoClient: ReturnType<typeof createClient> | null = null;
let dbInstance: ReturnType<typeof drizzle> | null = null;

function getTursoClient() {
  if (tursoClient) {
    return tursoClient;
  }

  const useLocal = process.env.USE_LOCAL === 'true';
  const url = process.env.TURSO_DATABASE_URL || localDbUrl;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  // Use local file-based SQLite if USE_LOCAL is set or no auth token
  if (useLocal || !authToken) {
    console.log('📁 Using local SQLite database:', localDbUrl);
    tursoClient = createClient({ url: localDbUrl });
  } else {
    console.log('☁️ Using remote Turso database');
    tursoClient = createClient({ url, authToken });
  }

  return tursoClient;
}

// Create drizzle instance with singleton pattern
export function getDb() {
  if (dbInstance) {
    return dbInstance;
  }

  const client = getTursoClient();
  dbInstance = drizzle(client, { schema });
  return dbInstance;
}

// Export db for backwards compatibility
export const db = getDb();

export type Database = typeof db;
