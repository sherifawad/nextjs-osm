import { EditPlaceSchema, placeResponse } from "@/lib/validations/place-schema";
import { errorHandler, validatePlaceInputs } from ".";
import { updatePlaceDbPrisma } from "../prisma/place/update";

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
