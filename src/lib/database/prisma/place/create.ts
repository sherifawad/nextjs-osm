import { z } from "zod";
import { prismaDb } from "..";
import { AddPlaceSchema, Place, PlaceDataErrors, PlaceDbSchema, placeResponse } from "@/lib/validations/place-schema";
import { errorHandler, validatePlaceInputs } from "@/database/place";

export const createPlaceDbPrisma = async (data: unknown): Promise<placeResponse> => {
	const { errors, validData } = validatePlaceInputs({ schema: AddPlaceSchema, data });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	try {
		const { id, createdBy, ...rest } = validData;

		const dbResult = await prismaDb.place.create({
			data: {
				...rest,
				createdBy: {
					connect: {
						id: createdBy,
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
