import { z } from "zod";

export const searchParamsSchema = z.object({
	page: z.coerce.number(),
	size: z.coerce.number(),
	count: z.coerce.number(),
	search: z.coerce.string().optional(),
});
