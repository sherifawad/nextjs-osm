import { errorHandler, validateData } from "@/lib/schema-utils";
import { prismaDb } from "..";
import { EditPlace, EditPlaceSchema, placeResponse } from "@/types";

export const updatePlaceDbPrisma = async (data: EditPlace): Promise<placeResponse> => {
	const { errors, validData } = validateData({ schema: EditPlaceSchema, data });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	try {
		const { id, modifiedById, createdAt, modifiedAt, createdById, ...rest } = validData;

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
