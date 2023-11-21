import { errorHandler, validatePlaceInputs, validatePlaceRatingInputs } from "@/database/place";
import { prismaDb } from "..";
import { placeResponse } from "../../place/validation";
import { EditPlaceRateSchema, EditPlaceSchema, placeRateUpdateResponse } from "@/database/place/update";

export const updatePlaceDbPrisma = async (data: unknown): Promise<placeResponse> => {
	const { errors, validData } = validatePlaceInputs({ schema: EditPlaceSchema, data });

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

export const updatePlaceRateDbPrisma = async (data: unknown): Promise<placeRateUpdateResponse> => {
	const { errors, validData } = validatePlaceRatingInputs({ schema: EditPlaceRateSchema, data });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	try {
		const { placeId, placeRate, userId } = validData;

		const {
			ratedPlace: {
				_count: { rating: verifiedRating },
			},
		} = await prismaDb.placeRating.upsert({
			where: {
				placeId_userId: {
					placeId,
					userId,
				},
			},
			update: {
				placeReputation: placeRate,
			},
			create: {
				placeReputation: placeRate,
				ratedPlace: {
					connect: {
						id: placeId,
					},
				},
				ratedBy: {
					connect: {
						id: userId,
					},
				},
			},
			include: {
				ratedPlace: {
					select: {
						_count: {
							select: {
								rating: {
									where: {
										AND: [
											{ placeId },
											{
												placeReputation: "VERIFIED",
											},
										],
									},
								},
							},
						},
					},
				},
			},
		});

		const { _all } = await prismaDb.placeRating.count({
			where: { placeId },
			select: {
				_all: true,
			},
		});

		return {
			status: "success",
			data: {
				state: placeRate,
				count: 2 * verifiedRating - _all,
			},
		};
	} catch (error) {
		return errorHandler(error, errors);
	}
};
