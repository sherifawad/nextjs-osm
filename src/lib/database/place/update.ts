import { placeResponse } from "@/lib/validations/place-schema";
import { errorHandler, validatePlaceInputs, validatePlaceRatingInputs } from ".";
import { updatePlaceDbPrisma, updatePlaceRateDbPrisma } from "../prisma/place/update";
import { z } from "zod";
import { PlaceDbSchemaOptional, PlaceRatingSchema, REPUTATIONSchema, REPUTATIONType } from "./validation";

/////////////////////////////////////////
// RATING SCHEMA ERROR
/////////////////////////////////////////

export const placeRateErrorsSchema = PlaceRatingSchema.merge(
	z.object({
		serverError: z.string(),
	})
);

export type PlaceRateErrors = {
	[key in keyof z.infer<typeof placeRateErrorsSchema>]: string;
};

/////////////////////////////////////////
// PLACE CRUD Response
/////////////////////////////////////////

export type placeRateUpdatedData = {
	state: REPUTATIONType | undefined;
	count: number;
};

type RateSuccessResponse = { status: "success"; data: placeRateUpdatedData };
type RateErrorResponse = { status: "error"; errors: Partial<PlaceRateErrors> };

export type placeRateUpdateResponse = RateSuccessResponse | RateErrorResponse;

/////////////////////////////////////////
// EDIT PLACE RATE SCHEMA
/////////////////////////////////////////

export const EditPlaceRateSchema = z.object({
	userId: z.string().cuid(),
	placeId: z.string().cuid(),
	placeRate: REPUTATIONSchema,
});
export type EditPlaceRate = z.infer<typeof EditPlaceRateSchema>;
/////////////////////////////////////////
// EDIT PLACE SCHEMA
/////////////////////////////////////////

export const EditPlaceSchema = PlaceDbSchemaOptional.merge(
	z.object({
		id: z.string().cuid(),
		modifiedById: z.string().cuid(),
	})
);
export type EditPlace = z.infer<typeof EditPlaceSchema>;

export const updatePlaceDb = async (updatedPlace: unknown): Promise<placeResponse> => {
	const { errors, validData } = validatePlaceInputs({ schema: EditPlaceSchema, data: updatedPlace });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	try {
		const result = await updatePlaceDbPrisma(validData);
		if (result.status === "success") {
			return {
				status: "success",
				data: result.data,
			};
		}
		return {
			status: "error",
			errors: result.errors,
		};
	} catch (error) {
		return errorHandler(error, errors);
	}
};
export const updatePlaceRatingDb = async (placeRatingData: unknown): Promise<placeRateUpdateResponse> => {
	const { errors, validData } = validatePlaceRatingInputs({ schema: EditPlaceRateSchema, data: placeRatingData });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	try {
		const result = await updatePlaceRateDbPrisma(validData);
		if (result.status === "success") {
			return {
				status: "success",
				data: result.data,
			};
		}
		return {
			status: "error",
			errors: result.errors,
		};
	} catch (error) {
		return errorHandler(error, errors);
	}
};
