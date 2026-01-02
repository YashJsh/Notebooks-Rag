// import type { PrismaClient } from "../generated/prisma/client";


// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClient | undefined;
// };

// export const client = globalForPrisma.prisma ?? new PrismaClient({});

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client;

// import "dotenv/config"; // Import dotenv/config at the very top to load .env variables
// import { PrismaClient } from '../generated/prisma/client'; // Import from your specified output path


// const connectionString = `${process.env.DATABASE_URL}`;
// const adapter = new PrismaPg({ connectionString });
// const prisma = new PrismaClient({  });

import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;
const adapter = new PrismaPg({ connectionString });

export const client = new PrismaClient({
  adapter,
});




