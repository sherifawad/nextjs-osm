import { env } from "@/env";
import { PrismaClient } from "@prisma/client";

export * from "./place/index";
export * from "./user/index";

const prismaClientSingleton = () => {
	return new PrismaClient({
		datasources: {
			db: {
				url:
					env.NODE_ENV !== "production"
						? `${env.DATABASE_URL}`
						: `${env.DATABASE_URL}?pgbouncer=true&connect_timeout=10&pool_timeout=10`,
			},
		},
		...(process.env.DEBUG === "1" && {
			log: env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
		}),
	});
};

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

const globalForPrisma = globalThis as unknown as {
	prisma: PrismaClientSingleton | undefined;
};

export const prismaDb = globalForPrisma.prisma ?? prismaClientSingleton();
if (env.NODE_ENV !== "production") globalForPrisma.prisma = prismaDb;
