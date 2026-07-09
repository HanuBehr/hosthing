import { PrismaPg } from "@prisma/adapter-pg";
import { Prisma, PrismaClient } from "@/generated/prisma/client";

const connectionString =
  process.env.NEON_POSTGRES_PRISMA_URL ??
  process.env.NEON_DATABASE_URL ??
  process.env.POSTGRES_PRISMA_URL ??
  process.env.DATABASE_URL ??
  "postgresql://user:password@localhost:5432/hostwise";

const log: Prisma.LogLevel[] =
  process.env.NODE_ENV === "development"
    ? ["query", "error", "warn"]
    : ["error"];

function createPrismaClient() {
  const adapter = new PrismaPg({ connectionString });
  return new PrismaClient({ adapter, log });
}

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
