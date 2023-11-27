import { z } from "zod";
import { RoleSchema } from "@/database/user";
import { DataBaseRatingSchema, PlaceRatingSchema, REPUTATIONSchema } from "../place-rate";
import { PlaceDbSchema, PlaceDbSchemaOptional } from ".";

/////////////////////////////////////////
// USER PLACES TYPE SCHEMA
/////////////////////////////////////////
export const UserPlacesTypeSchema = z.enum(["ALL", "CREATED", "MODIFIED"]);

export type UserPlacesType = `${z.infer<typeof UserPlacesTypeSchema>}`;

/////////////////////////////////////////
// FETCH PLACE SCHEMA
/////////////////////////////////////////

export const GetPlacesSchema = z.object({
	userRole: RoleSchema.optional(),
	deletedPlaces: z.boolean().optional(),
	hiddenPlaces: z.boolean().optional(),
});

export type GetPlaces = z.infer<typeof GetPlacesSchema>;

export const FetchedPlaceSchema = DataBaseRatingSchema.and(PlaceDbSchema);
export type FetchedPlace = z.infer<typeof FetchedPlaceSchema>;

/////////////////////////////////////////
// FETCH USER PLACE INPUT SCHEMA
/////////////////////////////////////////

export const GetUserPlacesSchema = z.object({
	id: z.string().cuid(),
	take: z.number().optional(),
	skip: z.number().optional(),
	placeType: UserPlacesTypeSchema,
});

export type GetUserPlaces = z.infer<typeof GetUserPlacesSchema>;

/////////////////////////////////////////
// FETCH USER PLACE OUTPUT SCHEMA
/////////////////////////////////////////

export const userPlacesSchema = z
	.object({
		rating: PlaceRatingSchema.omit({ placeId: true, userId: true }).array(),
	})
	.and(PlaceDbSchemaOptional);
export type UserPlaces = z.infer<typeof userPlacesSchema>;

const FetchedUserPlacesErrorsSchema = GetUserPlacesSchema.merge(
	z.object({
		serverError: z.string(),
	})
);

type FetchedUserPlacesDataErrors = {
	[key in keyof z.infer<typeof FetchedUserPlacesErrorsSchema>]: string;
};

type FetchedUserPlacesSuccessResponse = { status: "success"; data: UserPlaces[] };
type FetchedUserPlacesErrorResponse = { status: "error"; errors: Partial<FetchedUserPlacesDataErrors> };

export type FetchedUserPlacesResponse = FetchedUserPlacesSuccessResponse | FetchedUserPlacesErrorResponse;
/////////////////////////////////////////
// FETCH USER PLACE COUNT OUTPUT SCHEMA
/////////////////////////////////////////

type FetchedUserPlacesCountSuccessResponse = { status: "success"; data: number };

export type FetchedUserPlacesCountResponse = FetchedUserPlacesCountSuccessResponse | FetchedUserPlacesErrorResponse;

/////////////////////////////////////////
//FETCH PLACES SCHEMA VALIDATION OUTPUT
/////////////////////////////////////////

const FetchedPlacesErrorsSchema = GetPlacesSchema.merge(
	z.object({
		serverError: z.string(),
	})
);

type FetchedPlacesDataErrors = {
	[key in keyof z.infer<typeof FetchedPlacesErrorsSchema>]: string;
};

type FetchedPlacesSuccessResponse = { status: "success"; data: FetchedPlace[] };
type FetchedPlacesErrorResponse = { status: "error"; errors: Partial<FetchedPlacesDataErrors> };

export type FetchedPlacesResponse = FetchedPlacesSuccessResponse | FetchedPlacesErrorResponse;
