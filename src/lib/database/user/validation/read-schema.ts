import { z } from "zod";
import { RoleSchema, UserDbSchema } from "./user-schema";
import { userPlacesSchema } from "@/database/place";

/////////////////////////////////////////
// FETCH USER PLACE SCHEMA
/////////////////////////////////////////

export const GetUserSchema = z.object({
	id: z.string().cuid(),
});

export type GetUser = z.infer<typeof GetUserSchema>;

const fetchedUserPlacesSchema = z.object({
	placeCreated: z.lazy(() => userPlacesSchema.array().optional()),
	placeModified: z.lazy(() => userPlacesSchema.array().optional()),
});

export const FetchedUserSchema = fetchedUserPlacesSchema.and(UserDbSchema);
export type FetchedUser = z.infer<typeof FetchedUserSchema>;

/////////////////////////////////////////
//FETCH USER SCHEMA VALIDATION OUTPUT
/////////////////////////////////////////

const FetchedUserErrorsSchema = GetUserSchema.merge(
	z.object({
		serverError: z.string(),
	})
);

type FetchedUserDataErrors = {
	[key in keyof z.infer<typeof FetchedUserErrorsSchema>]: string;
};

type FetchedUserSuccessResponse = { status: "success"; data: FetchedUser };
type FetchedUserErrorResponse = { status: "error"; errors: Partial<FetchedUserDataErrors> };

export type FetchedUserResponse = FetchedUserErrorResponse | FetchedUserSuccessResponse;
