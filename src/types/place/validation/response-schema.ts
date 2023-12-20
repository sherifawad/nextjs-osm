import { z } from "zod";
import { Place, PlaceDbSchema } from "./place-schema";

export const PlaceDataErrorsSchema = PlaceDbSchema.merge(
  z.object({
    serverError: z.string(),
  }),
);

export type PlaceDataErrors = {
  [key in keyof z.infer<typeof PlaceDataErrorsSchema>]: string;
};

/////////////////////////////////////////
// PLACE SCHEMA VALIDATION OUTPUT
/////////////////////////////////////////
type SuccessResponse = { status: "success"; data: Place };
type ErrorResponse = { status: "error"; errors: Partial<PlaceDataErrors> };

export type placeResponse = SuccessResponse | ErrorResponse;
