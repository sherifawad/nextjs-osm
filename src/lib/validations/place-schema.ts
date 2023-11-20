import { PlaceRatingSchema } from "@/schema/index";
import { z } from "zod";
import { Prettify } from "../types";

/////////////////////////////////////////
// PLACE SCHEMA
/////////////////////////////////////////

export const PlaceDbMandatorySchema = z.object({
	latitude: z.coerce.number(),
	longitude: z.coerce.number(),
	name: z.string().min(3),
});
export const PlaceDbOptionalSchema = z.object({
	id: z.string().cuid().optional(),
	arName: z.string().nullable().optional(),
	enName: z.string().nullable().optional(),
	verified: z.boolean().optional(),
	image: z.string().nullable().optional(),
	hidden: z.boolean().optional(),
	deleted: z.boolean().optional(),
	createdAt: z.coerce.date().optional(),
	createdById: z.string().nullable().optional(),
	modifiedAt: z.coerce.date().optional(),
	modifiedById: z.string().nullable().optional(),
});

export const PlaceDbSchema = z.object({
	id: z.string().cuid(),
	latitude: z.coerce.number(),
	longitude: z.coerce.number(),
	name: z.string().min(3),
	arName: z.string().nullable(),
	enName: z.string().nullable(),
	verified: z.boolean(),
	image: z.string().nullable(),
	hidden: z.boolean(),
	deleted: z.boolean(),
	createdAt: z.coerce.date(),
	createdById: z.string().nullable(),
	modifiedAt: z.coerce.date(),
	modifiedById: z.string().nullable(),
});

export const PlaceDbWithOutUserSchema = PlaceDbMandatorySchema.merge(PlaceDbOptionalSchema).omit({
	modifiedAt: true,
	modifiedById: true,
	createdAt: true,
	createdById: true,
});

export const PlaceDataErrorsSchema = PlaceDbMandatorySchema.merge(PlaceDbOptionalSchema).merge(
	z.object({
		serverError: z.string().optional(),
	})
);

export type Place = z.infer<typeof PlaceDbSchema>;
export type PlaceDataErrors = {
	[key in keyof z.infer<typeof PlaceDataErrorsSchema>]: string;
};

/////////////////////////////////////////
// ADD PLACE SCHEMA
/////////////////////////////////////////

export const AddPlaceSchema = PlaceDbWithOutUserSchema.merge(
	z.object({
		createdById: z.string().cuid(),
	})
);
export type AddPlace = z.infer<typeof AddPlaceSchema>;

/////////////////////////////////////////
// EDIT PLACE SCHEMA
/////////////////////////////////////////

export const EditPlaceSchema = PlaceDbWithOutUserSchema.merge(
	z.object({
		modifiedById: z.string().cuid(),
	})
);
export type EditPlace = z.infer<typeof EditPlaceSchema>;

/////////////////////////////////////////
// PLACE RATING SCHEMA
/////////////////////////////////////////

export const DataBaseRatingSchema = z.object({
	_count: z.object({
		rating: z.number().int(),
	}),
	rating: PlaceRatingSchema.omit({ placeId: true }).array(),
});
export const DataBasePlaceSchema = PlaceDbWithOutUserSchema.and(PlaceDbSchema);

/////////////////////////////////////////
// PLACE CRUD Response
/////////////////////////////////////////

type SuccessResponse = { status: "success"; data: Place };
export type ErrorResponse = { status: "error"; errors: Partial<PlaceDataErrors> };

export type placeResponse = SuccessResponse | ErrorResponse;
