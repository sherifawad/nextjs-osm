import { createPlaceDbPrisma } from "../prisma";
import { AddPlace, AddPlaceSchema, placeResponse } from "./validation";
import { errorHandler, validateData } from "@/lib/schema-utils";

export const createPlaceDb = async (newPlace: AddPlace): Promise<placeResponse> => {
	const { errors, validData } = validateData({ schema: AddPlaceSchema, data: newPlace });

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
