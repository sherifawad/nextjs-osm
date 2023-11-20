import { errorHandler, validatePlaceInputs } from "@/database/place";
import { EditPlaceSchema, placeResponse } from "@/lib/validations/place-schema";
import { prismaDb } from "..";

export const updatePlaceDbPrisma = async (data: unknown): Promise<placeResponse> => {
	const { errors, validData } = validatePlaceInputs({ schema: EditPlaceSchema, data });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	try {
		const { id, modifiedById, ...rest } = validData;

		const dbResult = await prismaDb.place.update({
			where: {
				id,
			},
			data: {
				...rest,
				modifiedBy: {
					connect: {
						id: modifiedById,
					},
				},
			},
		});
		return {
			status: "success",
			data: dbResult,
		};
	} catch (error) {
		return errorHandler(error, errors);
	}
};
