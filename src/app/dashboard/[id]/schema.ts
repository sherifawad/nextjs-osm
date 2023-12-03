import { UserPlaces, sortingSchema } from "@/types";
import { z } from "zod";

export const searchParamsSchema = z
	.object({
		page: z.coerce.number().default(1),
		size: z.coerce.number().default(5),
		count: z.coerce.number().default(0),
		column: z.custom<keyof UserPlaces>().default("modifiedAt"),
		sort: sortingSchema.default("desc"),
		filter: z.custom<keyof UserPlaces>().optional(),
		search: z.coerce.string().default(""),
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
