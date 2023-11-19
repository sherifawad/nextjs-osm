import { z } from "zod";
import { REPUTATIONSchema } from "./generated/prisma";

export const locationSchema = z.object({
	lat: z.coerce.number(),
	lon: z.coerce.number(),
});

export const placeRateSchema = z.object({
	place: z.coerce.string().optional(),
	count: z.coerce.number().default(0),
	rate: REPUTATIONSchema.optional(),
});

export const leafletMapPageSearchParameterSchema = locationSchema.merge(
	z.object({
		search: z.string().min(3).optional(),
	})
);
export const placeRateSearchParameterSchema = locationSchema.merge(placeRateSchema);
