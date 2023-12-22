import { z } from "zod";
import { RoleSchema } from "../../user";
import { DataBaseRatingSchema, PlaceRatingSchema } from "../place-rate";
import { Place, PlaceDbSchema, PlaceDbSchemaOptional } from ".";
import { sortingSchema } from "@/types/common";

/////////////////////////////////////////
// GET PLACE SCHEMA
/////////////////////////////////////////

/**
 * Input Schema
 */
export const GetPlaceSchema = z.object({
  id: z.string().cuid(),
});

export type GetPlace = z.infer<typeof GetPlaceSchema>;
/**
 * Output Schema
 */
const FetchedPlaceErrorsSchema = GetPlaceSchema.merge(
  z.object({
    serverError: z.string(),
  })
);

/**
 * Response Schema
 */
type FetchedPlaceDataErrors = {
  [key in keyof z.infer<typeof FetchedPlaceErrorsSchema>]: string;
};

type FetchedUserSuccessResponse = { status: "success"; data: Place };
type FetchedPlaceErrorResponse = {
  status: "error";
  errors: Partial<FetchedPlaceDataErrors>;
};

export type FetchedPlaceResponse =
  | FetchedPlaceErrorResponse
  | FetchedUserSuccessResponse;

/////////////////////////////////////////
// USER PLACES TYPE SCHEMA
/////////////////////////////////////////
export const UserPlacesTypeSchema = z.enum([
  "ALL",
  "CREATED",
  "MODIFIED",
  "BOTH",
]);

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

export const userPlacesSchema = z
  .object({
    rating: PlaceRatingSchema.omit({ placeId: true, userId: true }).array(),
  })
  .and(PlaceDbSchemaOptional);
export const userPlacesDTOSchema = z
  .object({
    rating: z.number(),
  })
  .and(PlaceDbSchemaOptional);
export type UserPlaces = z.infer<typeof userPlacesSchema>;
export type UserPlacesDTO = z.infer<typeof userPlacesDTOSchema>;
export const GetUserPlacesSchema = z
  .object({
    id: z.string().cuid(),
    placeType: UserPlacesTypeSchema,
    columnToSort: z.custom<keyof UserPlaces>().array(),
    columnToFilter: z.custom<keyof UserPlaces>().array().optional(),
    sorting: sortingSchema,
    take: z.number().optional(),
    skip: z.number().optional(),
    search: z.string().optional(),
    deletedPlaces: z.boolean().optional(),
    hiddenPlaces: z.boolean().optional(),
  })
  .refine(
    (data) => {
      return !data.search || data.search?.length < 1
        ? true
        : data.columnToFilter
          ? true
          : false;
    },
    {
      message: "no column to filter exist",
      path: ["columnToFilter"],
    }
  );

export type GetUserPlaces = z.infer<typeof GetUserPlacesSchema>;

/////////////////////////////////////////
// FETCH USER PLACE OUTPUT SCHEMA
/////////////////////////////////////////

const FetchedUserPlacesErrorsSchema = GetUserPlacesSchema.and(
  z.object({
    serverError: z.string(),
  })
);

type FetchedUserPlacesDataErrors = {
  [key in keyof z.infer<typeof FetchedUserPlacesErrorsSchema>]: string;
};

type FetchedUserPlacesSuccessResponse = {
  status: "success";
  data: UserPlaces[];
};
type FetchedUserPlacesDTOSuccessResponse = {
  status: "success";
  data: UserPlacesDTO[];
};
type FetchedUserPlacesErrorResponse = {
  status: "error";
  errors: Partial<FetchedUserPlacesDataErrors>;
};

export type FetchedUserPlacesResponse =
  | FetchedUserPlacesSuccessResponse
  | FetchedUserPlacesErrorResponse;
export type FetchedUserPlacesDTOResponse =
  | FetchedUserPlacesDTOSuccessResponse
  | FetchedUserPlacesErrorResponse;

/////////////////////////////////////////
// FETCH USER PLACE COUNT OUTPUT SCHEMA
/////////////////////////////////////////

type FetchedUserPlacesCountSuccessResponse = {
  status: "success";
  data: number;
};

export type FetchedUserPlacesCountResponse =
  | FetchedUserPlacesCountSuccessResponse
  | FetchedUserPlacesErrorResponse;

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
type FetchedPlacesErrorResponse = {
  status: "error";
  errors: Partial<FetchedPlacesDataErrors>;
};

export type FetchedPlacesResponse =
  | FetchedPlacesSuccessResponse
  | FetchedPlacesErrorResponse;
