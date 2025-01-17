import { drizzle } from 'drizzle-orm/neon-http';
import { neon, neonConfig } from '@neondatabase/serverless';
import { config } from 'dotenv';
import * as schema from './schema';

config({ path: '.env' });

neonConfig.webSocketConstructor = WebSocket;

const sql = neon(process.env.DATABASE_URL!);

export const db = drizzle(sql, { logger: true, schema });
