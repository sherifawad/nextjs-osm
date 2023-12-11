import { UserPlaces, type User } from "@/types";
import { sortingSchema } from "@/types/common";
import { z } from "zod";

export const UserSearchParamsSchema = z
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

export type UserSearchParams = z.infer<typeof UserSearchParamsSchema>;

export const PlacesSearchParamsSchema = z
	.object({
		page: z.coerce.number(),
		size: z.coerce.number(),
		column: z.custom<keyof UserPlaces>(),
		sort: sortingSchema,
		filter: z.custom<keyof UserPlaces>().optional(),
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

export type PlacesSearchParams = z.infer<typeof PlacesSearchParamsSchema>;
