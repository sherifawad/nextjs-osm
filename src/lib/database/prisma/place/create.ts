import { prismaDb } from "..";
import { AddPlace, AddPlaceSchema, placeResponse } from "@/database/place";
import { validateData, errorHandler, addServerError } from "@/lib/schema-utils";

export const createPlaceDbPrisma = async (data: AddPlace): Promise<placeResponse> => {
	const { errors, validData } = validateData({ schema: AddPlaceSchema, data });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	try {
		const { id, modifiedAt, modifiedById, createdAt, createdById, ...rest } = validData;

		const dbResult = await prismaDb.place.create({
			data: {
				...rest,
				createdBy: {
					connect: {
						id: createdById,
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
