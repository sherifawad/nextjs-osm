import z from "zod";

const envSchema = z.object({
    NEXT_PUBLIC_BASE_URL_DEV: z.string().url(),
    NEXTAUTH_SECRET: z.string(),
    GOOGLE_CLIENT_ID: z.string(),
    GOOGLE_CLIENT_SECRET: z.string(),
    PREVIEW_API_KEY: z.string().trim().min(1).optional(),
    PORT: z.coerce.number().default(3000),
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    DATABASE_URL: z.string().trim().min(1).optional(),
    DATABASE_DEV_URL: z.string().trim().min(1).optional(),
});

export const env = envSchema.parse(process.env);
