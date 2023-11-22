import { FetchedPlacesResponse, GetPlaces, GetPlacesSchema } from ".";
import { getPlacedDbPrisma } from "../prisma";
import { validateData, errorHandler } from "@/lib/schema-utils";

export const getPlaces = async (data: GetPlaces): Promise<FetchedPlacesResponse> => {
	const { errors, validData } = validateData({ schema: GetPlacesSchema, data });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	try {
		const result = await getPlacedDbPrisma(validData);
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
