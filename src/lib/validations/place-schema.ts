import { PlaceRatingSchema, PlaceSchema } from "@/schema/index";
import { z } from "zod";
import { Prettify } from "../types";

export const addPlaceSchema = z.object({
	name: z.string().trim().min(1, { message: "name is required" }),
});
export const EditPlaceSchema = PlaceSchema.omit({
	modifiedAt: true,
	modifiedById: true,
	createdAt: true,
	createdById: true,
}).merge(
	z.object({
		id: z.string().cuid(),
		name: z.string().min(3),
		latitude: z.coerce.number(),
		longitude: z.coerce.number(),
	})
);
export const DataBaseRatingSchema = z.object({
	_count: z.object({
		rating: z.number().int(),
	}),
	rating: PlaceRatingSchema.omit({ placeId: true }).array(),
});
export const DataBasePlaceSchema = DataBaseRatingSchema.and(PlaceSchema);

export const PlaceFormDataErrorsSchema = PlaceSchema.and(
	z.object({
		serverError: z.string(),
	})
);
