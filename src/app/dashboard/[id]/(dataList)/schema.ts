import { type User } from "@/types";
import { sortingSchema } from "@/types/common";
import { z } from "zod";

export const searchParamsSchema = z
	.object({
		page: z.coerce.number(),
		size: z.coerce.number(),
		column: z.custom<keyof User>(),
		sort: sortingSchema,
		filter: z.custom<keyof User>().optional(),
		search: z.coerce.string(),
	})
	.refine(
		(data) => {
			return !data.search || data.search?.length < 1 ? true : data.filter ? true : false;
		},
		{
			message: "no column to filter exist",
			path: ["filter"],
		}
	);

export type SearchParams = z.infer<typeof searchParamsSchema>;
