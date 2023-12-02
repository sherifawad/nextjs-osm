import { UserPlaces, sortingSchema } from "@/types";
import { z } from "zod";

export const searchParamsSchema = z.object({
	page: z.coerce.number().default(1),
	size: z.coerce.number().default(5),
	count: z.coerce.number().default(0),
	column: z.custom<keyof UserPlaces>().default("modifiedAt"),
	sort: sortingSchema.default("desc"),
	search: z.coerce.string().default(""),
});

export type SearchParams = z.infer<typeof searchParamsSchema>;
