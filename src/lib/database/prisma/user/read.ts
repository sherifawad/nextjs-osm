import { prismaDb } from "..";
import {
	type FetchedPlaceResponse,
	type GetPlace,
	type GetUser,
	type userResponse,
	GetUserSchema,
	GetPlaceSchema,
} from "@/types";
import { validateData, errorHandler } from "@/lib/schema-utils";

const created = {
	placeCreated: {
		include: {
			rating: {
				select: {
					placeReputation: true,
				},
			},
		},
	},
};
const modified = {
	placeModified: {
		include: {
			rating: {
				select: {
					placeReputation: true,
				},
			},
		},
	},
};

export const getUserDbPrisma = async (data: GetUser): Promise<userResponse> => {
	const { errors, validData } = validateData({ schema: GetUserSchema, data });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}

	try {
		const dbResult = await prismaDb.user.findUniqueOrThrow({
			where: {
				id: validData.id,
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

export const getPlaceDbPrisma = async (data: GetPlace): Promise<FetchedPlaceResponse> => {
	const { errors, validData } = validateData({ schema: GetPlaceSchema, data });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	try {
		const dbResult = await prismaDb.place.findUniqueOrThrow({
			where: {
				id: validData.id,
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
