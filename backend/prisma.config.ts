import 'dotenv/config';
import { defineConfig } from '@prisma/config';

declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DATABASE_URL?: string;
    }
  }
}

export default defineConfig({
  schema: './prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});
