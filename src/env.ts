import z from "zod";
import { config } from "dotenv";

if (process.env.NODE_ENV === "development") {
	config({ path: ".env.dev.local", override: true });
} else {
	config({ path: ".env", override: true });
}

const envSchema = z.object({
	NEXTAUTH_SECRET: z.string(),
	GOOGLE_CLIENT_ID: z.string(),
	GOOGLE_CLIENT_SECRET: z.string(),
	PREVIEW_API_KEY: z.string().trim().min(1).optional(),
	PORT: z.coerce.number().default(3000),
	NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
	DATABASE_URL: z.string().trim().min(1).optional(),
});

export const env = envSchema.parse(process.env);
