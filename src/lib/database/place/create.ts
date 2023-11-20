import { createPlaceDbPrisma } from "../prisma/place/create";
import { AddPlaceSchema, placeResponse } from "@/lib/validations/place-schema";
import { errorHandler, validatePlaceInputs } from ".";

export const createPlaceDb = async (newPlace: unknown): Promise<placeResponse> => {
	const { errors, validData } = validatePlaceInputs({ schema: AddPlaceSchema, data: newPlace });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	try {
		const result = await createPlaceDbPrisma(validData);
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
