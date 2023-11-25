import { prismaDb } from "..";
import { FetchedPlace, FetchedPlacesResponse, GetPlaces, GetPlacesSchema } from "@/database/place";
import { FetchedUserResponse, GetUser, GetUserSchema } from "@/database/user";
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

export const getUserDbPrisma = async (data: GetUser): Promise<FetchedUserResponse> => {
	const { errors, validData } = validateData({ schema: GetUserSchema, data });

	if (!validData) {
		return {
			status: "error",
			errors,
		};
	}
	let includePlaces;

	try {
		if (validData.placesType === "CREATED") {
			includePlaces = { ...created };
		} else if (validData.placesType === "MODIFIED") {
			includePlaces = { ...modified };
		} else if (validData.placesType === "ALL") {
			includePlaces = { ...created, ...modified };
		} else {
			includePlaces = undefined;
		}

		const dbResult = await prismaDb.user.findUniqueOrThrow({
			where: {
				id: validData.userId,
			},
			include: { ...includePlaces },
		});

		return {
			status: "success",
			data: dbResult,
		};
	} catch (error) {
		return errorHandler(error, errors);
	}
};
