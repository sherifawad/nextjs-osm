import { z } from "zod";
import { RoleSchema, User, UserDbSchema } from "./user-schema";
import { userPlacesSchema } from "../../place";
import { sortingSchema } from "@/types/common";

/////////////////////////////////////////
// FETCH USERS INPUT SCHEMA
/////////////////////////////////////////

export const GetUsersSchema = z
  .object({
    id: z.string().cuid(),
    role: RoleSchema.optional(),
    columnToSort: z.custom<keyof User>().array(),
    columnToFilter: z.custom<keyof User>().array().optional(),
    sorting: sortingSchema,
    take: z.number().optional(),
    skip: z.number().optional(),
    search: z.string().optional(),
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

export type GetUsers = z.infer<typeof GetUsersSchema>;

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
//FETCH USERS SCHEMA VALIDATION OUTPUT
/////////////////////////////////////////

const UsersErrorsSchema = GetUsersSchema.and(
  z.object({
    serverError: z.string(),
  })
);

type UsersDataErrors = {
  [key in keyof z.infer<typeof UsersErrorsSchema>]: string;
};

type UsersSuccessResponse = { status: "success"; data: User[] };
type UsersErrorResponse = { status: "error"; errors: Partial<UsersDataErrors> };

export type UsersResponse = UsersErrorResponse | UsersSuccessResponse;

/////////////////////////////////////////
// FETCH USERS COUNT OUTPUT SCHEMA
/////////////////////////////////////////

type UsersCountSuccessResponse = { status: "success"; data: number };

export type UsersCountResponse = UsersCountSuccessResponse | UsersErrorResponse;
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
type FetchedUserErrorResponse = {
  status: "error";
  errors: Partial<FetchedUserDataErrors>;
};

export type FetchedUserResponse =
  | FetchedUserErrorResponse
  | FetchedUserSuccessResponse;
