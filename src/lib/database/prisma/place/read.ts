import { prismaDb } from "..";
import {
	type FetchedPlacesResponse,
	type FetchedUserPlacesCountResponse,
	type FetchedUserPlacesResponse,
	type GetPlaces,
	GetPlacesSchema,
	GetUserPlaces,
	GetUserPlacesSchema,
} from "@/types";
import { validateData, errorHandler } from "@/lib/schema-utils";

export const getPlacesDbPrisma = async (data: GetPlaces): Promise<FetchedPlacesResponse> => {
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

export const getUserPlacesDbPrisma = async (data: GetUserPlaces): Promise<FetchedUserPlacesResponse> => {
	const { errors, validData } = validateData({ schema: GetUserPlacesSchema, data });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	let whereData = {};

	try {
		if (validData.placeType === "CREATED") {
			whereData = { ...whereData, createdById: validData.id };
		} else if (validData.placeType === "MODIFIED") {
			whereData = { ...whereData, modifiedById: validData.id };
		} else {
			whereData = { ...whereData, OR: [{ modifiedById: validData.id }, { createdById: validData.id }] };
		}

		const dbResult = await prismaDb.place.findMany({
			where: whereData,
			skip: validData.skip,
			take: validData.take,
			include: {
				rating: {
					select: {
						placeReputation: true,
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
export const getUserPlacesCountDbPrisma = async (data: GetUserPlaces): Promise<FetchedUserPlacesCountResponse> => {
	const { errors, validData } = validateData({ schema: GetUserPlacesSchema, data });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	let whereData = {};

	try {
		if (validData.placeType === "CREATED") {
			whereData = { ...whereData, createdById: validData.id };
		} else if (validData.placeType === "MODIFIED") {
			whereData = { ...whereData, modifiedById: validData.id };
		} else {
			whereData = { ...whereData, OR: [{ modifiedById: validData.id }, { createdById: validData.id }] };
		}

		const dbResult = await prismaDb.place.count({
			where: whereData,
		});

		return {
			status: "success",
			data: dbResult,
		};
	} catch (error) {
		return errorHandler(error, errors);
	}
};
