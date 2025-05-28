import { execSync } from 'node:child_process';
import { randomUUID } from 'node:crypto';

import 'dotenv/config';

import { Environment } from 'vitest/environments';

import { PrismaClient } from '../prisma/generated/prisma';

const prisma = new PrismaClient();

function generateDatabaseURL(schema: string): string {
  if (!process.env.DATABASE_URL) {
    throw new Error('Please provide a DATABASE_URL environment variable');
  }

  const url = new URL(process.env.DATABASE_URL);
  url.searchParams.set('schema', schema);

  return url.toString();
}

export default <Environment>{
  name: 'prisma',
  transformMode: 'ssr',
  // eslint-disable-next-line @typescript-eslint/require-await
  async setup() {
    const schema = randomUUID();
    const databaseURL = generateDatabaseURL(schema);

    process.env.DATABASE_URL = databaseURL;

    execSync('npx prisma migrate deploy');

    return {
      async teardown() {
        await prisma.$executeRawUnsafe(
          /* sql */ `DROP SCHEMA IF EXISTS "${schema}" CASCADE`,
        );

        await prisma.$disconnect();
      },
    };
  },
};
