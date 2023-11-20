export const findPlaceDbPrisma = async (data: unknown): Promise<placeResponse> => {
	const { errors, validData } = validatePlaceInputs({ schema: AddPlaceSchema, data });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	try {
		const { id, createdById, ...rest } = validData;

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
