import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

const sql = neon(process.env.DATABASE_URL || process.env.NEXT_PUBLIC_DRIZZLE_DB_URL);
export const db = drizzle({ client: sql });
