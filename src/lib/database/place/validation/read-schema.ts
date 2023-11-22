import { z } from "zod";
import { RoleSchema } from "@/database/user";
import { DataBaseRatingSchema } from "../place-rate";
import { PlaceDbSchema } from ".";

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
