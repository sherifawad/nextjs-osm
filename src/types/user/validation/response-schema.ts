import { z } from "zod";
import { User, UserDbSchema } from "./user-schema";

export const UserDataErrorsSchema = UserDbSchema.merge(
  z.object({
    serverError: z.string(),
  })
);

export type UserDataErrors = {
  [key in keyof z.infer<typeof UserDataErrorsSchema>]: string;
};

/////////////////////////////////////////
// PLACE SCHEMA VALIDATION OUTPUT
/////////////////////////////////////////
type SuccessResponse = { status: "success"; data: User };
type ErrorResponse = { status: "error"; errors: Partial<UserDataErrors> };

export type userResponse = SuccessResponse | ErrorResponse;
