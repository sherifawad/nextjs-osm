import { prismaDb } from "..";
import { FetchedPlace, FetchedPlacesResponse, GetPlaces, GetPlacesSchema } from "@/database/place";
import { validateData, errorHandler } from "@/lib/schema-utils";

export const getPlacedDbPrisma = async (data: GetPlaces): Promise<FetchedPlacesResponse> => {
	const { errors, validData } = validateData({ schema: GetPlacesSchema, data });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	try {
		const whereData = {
			deleted: validData.deletedPlaces,
			hidden: validData.hiddenPlaces,
		};
		let dbResult;
		if (validData.userRole === "OWNER") {
			dbResult = await prismaDb.place.findMany({
				where: whereData,
				include: {
					rating: {
						select: {
							userId: true,
							placeReputation: true,
						},
					},
					_count: {
						select: {
							rating: {
								where: {
									placeReputation: "VERIFIED",
								},
							},
						},
					},
				},
			});
		} else if (validData.userRole === "ADMIN") {
			dbResult = await prismaDb.place.findMany({
				where: whereData,
				include: {
					rating: {
						select: {
							userId: true,
							placeReputation: true,
						},
					},
					_count: {
						select: {
							rating: {
								where: {
									placeReputation: "VERIFIED",
								},
							},
						},
					},
				},
			});
		} else {
			dbResult = await prismaDb.place.findMany({
				where: whereData,
				include: {
					rating: {
						select: {
							userId: true,
							placeReputation: true,
						},
					},
					_count: {
						select: {
							rating: {
								where: {
									placeReputation: "VERIFIED",
								},
							},
						},
					},
				},
			});
		}

		return {
			status: "success",
			data: dbResult,
		};
	} catch (error) {
		return errorHandler(error, errors);
	}
};
