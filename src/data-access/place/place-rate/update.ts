import { updatePlaceRateDbPrisma } from "@/prisma";
import { type EditPlaceRate, EditPlaceRateSchema, placeRateUpdateResponse } from "@/types";
import { errorHandler, validateData } from "@/lib/schema-utils";

export const updatePlaceRatingDb = async (placeRatingData: EditPlaceRate): Promise<placeRateUpdateResponse> => {
	const { errors, validData } = validateData({ schema: EditPlaceRateSchema, data: placeRatingData });

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
