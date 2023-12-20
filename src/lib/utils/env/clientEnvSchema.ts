import z from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_HOST_NAME: z.string().url().trim().optional(),
  NEXT_PUBLIC_VERCEL_URL: z.string().url().optional(),
});

const envCLient = envSchema.safeParse({
  NEXT_PUBLIC_HOST_NAME: process.env.NEXT_PUBLIC_HOST_NAME,
  NEXT_PUBLIC_VERCEL_URL: process.env.NEXT_PUBLIC_VERCEL_URL,
});

if (!envCLient.success) {
  console.error(envCLient.error.issues);
  throw new Error("There is an error with the client environment variables");
  process.exit(1);
}

export const envCLientSchema = envCLient.data;
export type EnvCLientSchemaType = z.infer<typeof envSchema>;
